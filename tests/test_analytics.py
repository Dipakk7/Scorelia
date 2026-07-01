import os
import sys
import uuid
import unittest
import unittest.mock
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

# Add backend to path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider
from app.services.job_match import get_history_summary, add_to_history
from app.services.job_match.history import _history_cache
from app.analytics.statistics.base import BaseStatistics

class TestAnalytics(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users and obtain authenticated TestClients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Delete any pre-existing test users to clean up state
            for email in ["analytics_test@careerpilot.com", "analytics_other@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    resumes = db.query(Resume).filter(Resume.user_id == test_user.id).all()
                    for r in resumes:
                        db.delete(r)
                    db.delete(test_user)
            db.commit()

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate
            
            user_in = UserCreate(
                email="analytics_test@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Analytics Test User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create secondary test user
            other_user_in = UserCreate(
                email="analytics_other@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Other Test User"
            )
            cls.other_user = auth_service.register_user(db, user_create=other_user_in)
            cls.other_user_id = cls.other_user.id

            db.commit()
        finally:
            db.close()

        # Primary user client (authenticated)
        cls.client = TestClient(app)
        login_payload = {
            "email": "analytics_test@careerpilot.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Primary login failed: {login_response.text}"

        # Unauthenticated client
        cls.unauth_client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            for email in ["analytics_test@careerpilot.com", "analytics_other@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    resumes = db.query(Resume).filter(Resume.user_id == test_user.id).all()
                    for r in resumes:
                        db.delete(r)
                    db.delete(test_user)
            db.commit()
        finally:
            db.close()

    def setUp(self):
        # Clear in-memory history cache before each test
        _history_cache.clear()
        
        # Clear GitHub service caches
        from app.analytics.service import analytics_service
        analytics_service.github_service._cache.clear()
        analytics_service.github_service._repo_languages_cache.clear()
        
        # Clean up any resumes left behind by test users
        db = SessionLocal()
        try:
            db.query(Resume).filter(Resume.user_id.in_([self.user_id, self.other_user_id])).delete(synchronize_session=False)
            db.commit()
        finally:
            db.close()

    # --- BaseStatistics Tests ---

    def test_base_statistics_average(self):
        """Test BaseStatistics.calculate_average method."""
        self.assertEqual(BaseStatistics.calculate_average([10, 20, 30, 40]), 25.0)
        self.assertEqual(BaseStatistics.calculate_average([15]), 15.0)
        self.assertEqual(BaseStatistics.calculate_average([]), 0.0)

    def test_base_statistics_median(self):
        """Test BaseStatistics.calculate_median method."""
        self.assertEqual(BaseStatistics.calculate_median([10, 20, 30]), 20.0)
        self.assertEqual(BaseStatistics.calculate_median([10, 20, 30, 40]), 25.0)
        self.assertEqual(BaseStatistics.calculate_median([5]), 5.0)
        self.assertEqual(BaseStatistics.calculate_median([]), 0.0)

    def test_base_statistics_safe_divide(self):
        """Test BaseStatistics.safe_divide method."""
        self.assertEqual(BaseStatistics.safe_divide(10, 2), 5.0)
        self.assertEqual(BaseStatistics.safe_divide(10, 0, default=9.9), 9.9)

    def test_base_statistics_percentage(self):
        """Test BaseStatistics.percentage method."""
        self.assertEqual(BaseStatistics.percentage(1, 4), 25.0)
        self.assertEqual(BaseStatistics.percentage(2, 3), 66.7)

    # --- Health endpoint Tests ---

    def test_health_endpoint(self):
        """Verify the health endpoint is publicly accessible and returns correct status."""
        response = self.unauth_client.get("/api/v1/analytics/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("module"), "analytics")

    # --- Dashboard endpoint Tests ---

    def test_dashboard_unauthenticated(self):
        """Verify the dashboard endpoint rejects unauthenticated access with 401."""
        response = self.unauth_client.get("/api/v1/analytics/dashboard")
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertEqual(data.get("message"), "Not authenticated")

    def test_dashboard_empty_database(self):
        """Verify the dashboard aggregates data safely when no resumes or job matches exist."""
        response = self.client.get("/api/v1/analytics/dashboard")
        self.assertEqual(response.status_code, 200)
        
        res = response.json()
        self.assertTrue(res["success"])
        self.assertEqual(res["message"], "Dashboard analytics generated successfully")
        self.assertIn("timestamp", res)
        
        data = res["data"]
        self.assertGreaterEqual(data["total_users"], 2)
        self.assertEqual(data["total_resumes"], 0)
        self.assertEqual(data["parsed_resumes"], 0)
        self.assertEqual(data["total_job_matches"], 0)
        self.assertEqual(data["average_ats_score"], 0.0)
        self.assertEqual(data["average_match_score"], 0.0)
        self.assertIsNone(data["latest_resume"])
        self.assertIsNone(data["latest_job_match"])

    def test_dashboard_with_records(self):
        """Verify the dashboard aggregates data and calculates statistics correctly when records exist."""
        db = SessionLocal()
        try:
            # Create a parsed resume with ATS score
            resume1 = Resume(
                user_id=self.user_id,
                original_filename="resume_parsed.pdf",
                stored_filename="stored_parsed.pdf",
                file_path="storage/resumes/stored_parsed.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                ats_score=80,
                uploaded_at=datetime.now(timezone.utc) - timedelta(minutes=10)
            )
            # Create an uploaded (unparsed) resume with no ATS score
            resume2 = Resume(
                user_id=self.user_id,
                original_filename="resume_uploaded.pdf",
                stored_filename="stored_uploaded.pdf",
                file_path="storage/resumes/stored_uploaded.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=2048,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.UPLOADED,
                ats_score=None,
                uploaded_at=datetime.now(timezone.utc) - timedelta(minutes=5)
            )
            # Create another parsed resume with ATS score for other user
            resume3 = Resume(
                user_id=self.other_user_id,
                original_filename="resume_parsed_other.pdf",
                stored_filename="stored_parsed_other.pdf",
                file_path="storage/resumes/stored_parsed_other.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                ats_score=90,
                uploaded_at=datetime.now(timezone.utc)
            )

            db.add_all([resume1, resume2, resume3])
            db.commit()
            db.refresh(resume1)
            db.refresh(resume2)
            db.refresh(resume3)
            
            # Fill job match cache
            add_to_history(
                resume_id=resume1.id,
                overall_score=75,
                grade="B",
                job_title="Software Engineer",
                company="Google"
            )
            add_to_history(
                resume_id=resume3.id,
                overall_score=85,
                grade="A",
                job_title="Senior Engineer",
                company="Netflix"
            )
            
            # Request the dashboard
            response = self.client.get("/api/v1/analytics/dashboard")
            self.assertEqual(response.status_code, 200)
            
            res = response.json()
            self.assertTrue(res["success"])
            
            data = res["data"]
            self.assertEqual(data["total_resumes"], 3)
            self.assertEqual(data["parsed_resumes"], 2)
            self.assertEqual(data["average_ats_score"], 85.0)
            
            # Job matches
            self.assertEqual(data["total_job_matches"], 2)
            self.assertEqual(data["average_match_score"], 80.0)
            
            # Latest resume check
            self.assertIsNotNone(data["latest_resume"])
            self.assertEqual(data["latest_resume"]["original_filename"], "resume_parsed_other.pdf")
            
            # Latest job match check
            self.assertIsNotNone(data["latest_job_match"])
            self.assertEqual(data["latest_job_match"]["company"], "Netflix")
            
        finally:
            db.query(Resume).filter(Resume.user_id.in_([self.user_id, self.other_user_id])).delete(synchronize_session=False)
            db.commit()
            db.close()

    # --- Resume Analytics endpoint Tests ---

    def test_resume_analytics_unauthenticated(self):
        """Verify resume analytics rejects unauthenticated requests with 401."""
        response = self.unauth_client.get("/api/v1/analytics/resumes")
        self.assertEqual(response.status_code, 401)

    def test_resume_analytics_empty_database(self):
        """Verify resume analytics returns valid zero-value schemas when no data exists."""
        response = self.client.get("/api/v1/analytics/resumes")
        self.assertEqual(response.status_code, 200)
        
        res = response.json()
        self.assertTrue(res["success"])
        data = res["data"]
        self.assertEqual(data["overview"]["total_resumes"], 0)
        self.assertEqual(data["skills"]["top_skills"], [])
        self.assertEqual(data["experience"]["average_years_experience"], 0.0)

    def test_resume_analytics_populated_database(self):
        """Verify calculations for skills, education, experience, timeline, and overview."""
        db = SessionLocal()
        try:
            resume1 = Resume(
                user_id=self.user_id,
                original_filename="res1.pdf",
                stored_filename="stored_res1.pdf",
                file_path="storage/resumes/stored_res1.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1000,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                raw_text="This is a long raw text for resume one",
                uploaded_at=datetime.utcnow() - timedelta(days=2),
                parsed_data={
                    "data": {
                        "skills": ["Python", "FastAPI", "SQL"],
                        "education": [{"degree": "Ph.D. in Computer Science", "institution": "MIT"}],
                        "experience": [{"duration": "5 years", "company": "A"}]
                    }
                }
            )

            resume2 = Resume(
                user_id=self.user_id,
                original_filename="res2.pdf",
                stored_filename="stored_res2.pdf",
                file_path="storage/resumes/stored_res2.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=2000,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                raw_text="Short text",
                uploaded_at=datetime.utcnow() - timedelta(days=15),
                parsed_data={
                    "data": {
                        "skills": ["Python", "Git"],
                        "education": [{"degree": "Bachelor of Science", "institution": "Stanford"}],
                        "experience": [{"duration": "18 months", "company": "B"}]
                    }
                }
            )

            resume3 = Resume(
                user_id=self.other_user_id,
                original_filename="res3.pdf",
                stored_filename="stored_res3.pdf",
                file_path="storage/resumes/stored_res3.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1000,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.UPLOADED,
                raw_text="Unparsed raw text",
                uploaded_at=datetime.utcnow() - timedelta(days=45),
                parsed_data=None
            )

            db.add_all([resume1, resume2, resume3])
            db.commit()

            response = self.client.get("/api/v1/analytics/resumes")
            self.assertEqual(response.status_code, 200)

            res = response.json()
            data = res["data"]

            self.assertEqual(data["overview"]["total_resumes"], 3)
            self.assertEqual(data["overview"]["parsed_resumes"], 2)
            self.assertEqual(data["overview"]["average_resume_length"], 21.7)
            self.assertEqual(data["skills"]["total_unique_skills"], 4)
            self.assertEqual(data["experience"]["average_years_experience"], 3.2)
            self.assertEqual(data["education"]["education_distribution"]["PhD"], 1)

        finally:
            db.query(Resume).filter(Resume.user_id.in_([self.user_id, self.other_user_id])).delete(synchronize_session=False)
            db.commit()
            db.close()

    # --- ATS Analytics endpoint Tests ---

    def test_ats_analytics_unauthenticated(self):
        """Verify ATS analytics rejects unauthenticated requests with 401."""
        response = self.unauth_client.get("/api/v1/analytics/ats")
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertEqual(data.get("message"), "Not authenticated")

    def test_ats_analytics_empty_database(self):
        """Verify ATS analytics returns zero values when no scored resumes exist."""
        response = self.client.get("/api/v1/analytics/ats")
        self.assertEqual(response.status_code, 200)
        
        res = response.json()
        self.assertTrue(res["success"])
        self.assertEqual(res["message"], "ATS analytics generated successfully")
        
        data = res["data"]
        # Overview
        self.assertEqual(data["overview"]["total_ats_evaluations"], 0)
        self.assertEqual(data["overview"]["average_ats_score"], 0.0)
        self.assertEqual(data["overview"]["highest_ats_score"], 0)
        self.assertEqual(data["overview"]["lowest_ats_score"], 0)
        self.assertEqual(data["overview"]["median_ats_score"], 0.0)

        # Grade distribution
        self.assertEqual(data["grade_distribution"]["Excellent"]["count"], 0)
        self.assertEqual(data["grade_distribution"]["Needs Improvement"]["count"], 0)

        # Category breakdown
        self.assertEqual(data["category_breakdown"]["skills"]["average"], 0.0)
        self.assertEqual(data["category_breakdown"]["skills"]["weight"], 25)

        # Trend & Weaknesses
        self.assertEqual(data["trend"]["score_trend"], [])
        self.assertEqual(data["trend"]["improvement_rate"], 0.0)
        self.assertEqual(data["weaknesses"]["top_weaknesses"], [])
        self.assertEqual(data["weaknesses"]["top_recommendations"], [])

    def test_ats_analytics_populated_database(self):
        """Verify that ATS calculations aggregate counts, distributions, trends, and top weaknesses correctly."""
        db = SessionLocal()
        try:
            # Create three scored resumes
            # Resume 1: score = 95 (Excellent)
            resume1 = Resume(
                user_id=self.user_id,
                original_filename="res_ats1.pdf",
                stored_filename="stored_ats1.pdf",
                file_path="storage/resumes/stored_ats1.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1000,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                raw_text="This is a long raw text for resume one",
                uploaded_at=datetime.utcnow() - timedelta(days=5),
                ats_score=95,
                parsed_data={
                    "data": {
                        "name": "Jane", "email": "jane@gmail.com", "phone": "123",
                        "skills": ["python", "fastapi", "sql", "git", "docker", "aws", "gcp", "redis"],
                        "education": [{"degree": "PhD in CS", "institution": "Stanford"}, {"degree": "MS", "institution": "Stanford"}],
                        "experience": [{"duration": "5 years", "company": "Google"}, {"duration": "3 years", "company": "Meta"}],
                        "projects": [{"title": "Proj1", "description": "built backend"}, {"title": "Proj2", "description": "scaled service"}],
                        "certifications": [{"name": "Cert1"}, {"name": "Cert2"}]
                    }
                }
            )

            # Resume 2: score = 75 (Good), uploaded 3 days ago for same user (to test user improvements)
            resume2 = Resume(
                user_id=self.user_id,
                original_filename="res_ats2.pdf",
                stored_filename="stored_ats2.pdf",
                file_path="storage/resumes/stored_ats2.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=2000,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                raw_text="Short text for resume two",
                uploaded_at=datetime.utcnow() - timedelta(days=3),
                ats_score=75,
                parsed_data={
                    "data": {
                        "name": "Jane", "email": "jane@gmail.com", # phone is missing
                        "skills": ["python", "fastapi"],
                        "education": [{"degree": "Bachelor of Science", "institution": "MIT"}],
                        "experience": [{"duration": "1 year", "company": "Startup"}],
                        "projects": [], # projects missing
                        "certifications": [] # certs missing
                    }
                }
            )

            # Resume 3: score = 30 (Needs Improvement), uploaded 1 day ago for other user
            resume3 = Resume(
                user_id=self.other_user_id,
                original_filename="res_ats3.pdf",
                stored_filename="stored_ats3.pdf",
                file_path="storage/resumes/stored_ats3.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1000,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                raw_text="Very sparse",
                uploaded_at=datetime.utcnow() - timedelta(days=1),
                ats_score=30,
                parsed_data={
                    "data": {
                        "skills": [], # empty
                        "education": [],
                        "experience": [],
                        "projects": [],
                        "certifications": []
                    }
                }
            )

            db.add_all([resume1, resume2, resume3])
            db.commit()

            response = self.client.get("/api/v1/analytics/ats")
            self.assertEqual(response.status_code, 200)

            res = response.json()
            self.assertTrue(res["success"])
            data = res["data"]

            # 1. Assert Overview
            overview = data["overview"]
            self.assertEqual(overview["total_ats_evaluations"], 3)
            # Scores: 95, 75, 30. Average = 200 / 3 = 66.666... -> 66.7
            self.assertEqual(overview["average_ats_score"], 66.7)
            self.assertEqual(overview["highest_ats_score"], 95)
            self.assertEqual(overview["lowest_ats_score"], 30)
            # Median of 95, 75, 30 -> sorted: 30, 75, 95 -> median is 75.0
            self.assertEqual(overview["median_ats_score"], 75.0)

            # 2. Assert Grade Distribution
            grade_dist = data["grade_distribution"]
            self.assertEqual(grade_dist["Excellent"]["count"], 1)
            self.assertEqual(grade_dist["Excellent"]["percentage"], 33.3)
            self.assertEqual(grade_dist["Good"]["count"], 1)
            self.assertEqual(grade_dist["Good"]["percentage"], 33.3)
            self.assertEqual(grade_dist["Needs Improvement"]["count"], 1)
            self.assertEqual(grade_dist["Needs Improvement"]["percentage"], 33.3)

            # 3. Assert Category Breakdown
            breakdown = data["category_breakdown"]
            # Verify weight definitions
            self.assertEqual(breakdown["contact"]["weight"], 10)
            self.assertEqual(breakdown["skills"]["weight"], 25)
            # Average score checks
            self.assertGreaterEqual(breakdown["skills"]["average"], 0.0)

            # 4. Assert Trend
            trend = data["trend"]
            self.assertEqual(len(trend["score_trend"]), 3)
            # User improvements: resume1 (95, uploaded 5 days ago) -> resume2 (75, uploaded 3 days ago).
            # Earliest: 95, latest: 75. Difference = -20
            self.assertEqual(trend["improvement_rate"], -20.0)

            # 5. Assert Weaknesses
            weaknesses = data["weaknesses"]
            # verify top lists populated
            self.assertGreaterEqual(len(weaknesses["top_weaknesses"]), 1)
            self.assertGreaterEqual(len(weaknesses["top_recommendations"]), 1)
            # Count percentages
            self.assertIn("percentage", weaknesses["top_weaknesses"][0])

        finally:
            db.query(Resume).filter(Resume.user_id.in_([self.user_id, self.other_user_id])).delete(synchronize_session=False)
            db.commit()
            db.close()

    # --- Job Match Analytics endpoint Tests ---

    def test_job_analytics_unauthenticated(self):
        """Verify Job match analytics rejects unauthenticated requests with 401."""
        response = self.unauth_client.get("/api/v1/analytics/jobs")
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertEqual(data.get("message"), "Not authenticated")

    def test_job_analytics_empty_database(self):
        """Verify Job match analytics returns zero values when no cached records exist."""
        response = self.client.get("/api/v1/analytics/jobs")
        self.assertEqual(response.status_code, 200)
        
        res = response.json()
        self.assertTrue(res["success"])
        self.assertEqual(res["message"], "Job match analytics generated successfully")
        
        data = res["data"]
        # Overview
        self.assertEqual(data["overview"]["total_job_matches"], 0)
        self.assertEqual(data["overview"]["average_match_score"], 0.0)
        
        # Distribution
        self.assertEqual(data["distribution"]["90–100%"]["count"], 0)
        
        # Skill gaps
        self.assertEqual(data["skill_gaps"]["top_missing_skills"], [])
        self.assertEqual(data["skill_gaps"]["total_unique_missing_skills"], 0)
        
        # Trend & History
        self.assertEqual(data["trend"]["score_trend"], [])
        self.assertEqual(data["history"]["total_matches"], 0)

    def test_job_analytics_populated_database(self):
        """Verify that Job calculations aggregate scores, distributions, trends, and history correctly."""
        # Add matches to history cache
        # Match 1: score = 95, 2 days ago
        resume_id1 = str(uuid.uuid4())
        add_to_history(
            resume_id=resume_id1,
            overall_score=95,
            grade="A",
            job_title="Python Developer",
            company="Google",
            missing_skills=["FastAPI", "SQL"],
            recommendations=[{"message": "Add Certs"}]
        )
        
        # Match 2: score = 75, 1 day ago
        add_to_history(
            resume_id=resume_id1,
            overall_score=75,
            grade="B",
            job_title="FastAPI Developer",
            company="Netflix",
            missing_skills=["Docker", "AWS"],
            recommendations=[{"message": "Add Projects"}]
        )

        # Match 3: score = 55, today
        resume_id2 = str(uuid.uuid4())
        add_to_history(
            resume_id=resume_id2,
            overall_score=55,
            grade="C",
            job_title="Python Developer",
            company="Google", # repeated job description (Python Developer at Google)
            missing_skills=["FastAPI"],
            recommendations=[{"message": "Add Certs"}]
        )
        
        response = self.client.get("/api/v1/analytics/jobs")
        self.assertEqual(response.status_code, 200)
        
        res = response.json()
        self.assertTrue(res["success"])
        data = res["data"]
        
        # 1. Assert Overview
        self.assertEqual(data["overview"]["total_job_matches"], 3)
        self.assertEqual(data["overview"]["average_match_score"], 75.0)
        self.assertEqual(data["overview"]["highest_match_score"], 95)
        self.assertEqual(data["overview"]["lowest_match_score"], 55)
        self.assertEqual(data["overview"]["median_match_score"], 75.0)
        
        # 2. Assert Distribution (with chart-ready fields)
        dist = data["distribution"]
        self.assertEqual(dist["90–100%"]["count"], 1)
        self.assertEqual(dist["90–100%"]["percentage"], 33.3)
        self.assertEqual(dist["90–100%"]["label"], "90–100%")
        self.assertEqual(dist["90–100%"]["value"], 1)
        
        # 3. Assert Skill Gaps (with chart-ready fields)
        gaps = data["skill_gaps"]
        self.assertEqual(gaps["total_unique_missing_skills"], 4)

        self.assertEqual(gaps["missing_skill_frequency"]["FastAPI"], 2)
        
        top_skills = gaps["top_missing_skills"]
        self.assertGreaterEqual(len(top_skills), 1)
        self.assertEqual(top_skills[0]["name"], "FastAPI")
        self.assertEqual(top_skills[0]["count"], 2)
        self.assertEqual(top_skills[0]["label"], "FastAPI")
        self.assertEqual(top_skills[0]["value"], 2)
        
        # 4. Assert Trend
        self.assertEqual(len(data["trend"]["score_trend"]), 1) # all matches on same day in test mock
        
        # 5. Assert Recommendations
        recs = data["recommendations"]["top_recommendations"]
        self.assertEqual(len(recs), 2)
        self.assertEqual(recs[0]["name"], "Add Certs")
        self.assertEqual(recs[0]["count"], 2)
        
        # 6. Assert History
        hist = data["history"]
        self.assertEqual(hist["total_matches"], 3)
        self.assertEqual(hist["average_matches_per_resume"], 1.5)
        self.assertEqual(hist["repeated_job_descriptions"], 1) # (Python Developer, Google) matched twice
        self.assertIsNotNone(hist["latest_match"])
        self.assertEqual(hist["latest_match"]["company"], "Google")

    # --- GitHub Profile Analytics Tests ---

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_unauthorized(self, mock_get):
        """Verify that unauthorized access to GitHub endpoint returns 401."""
        response = self.unauth_client.get("/api/v1/analytics/github/octocat/profile")
        self.assertEqual(response.status_code, 401)

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_invalid_username(self, mock_get):
        """Verify that malformed or empty GitHub username returns 400."""
        response1 = self.client.get("/api/v1/analytics/github/%20/profile")
        self.assertEqual(response1.status_code, 400)
        
        response2 = self.client.get("/api/v1/analytics/github/invalid_name--double/profile")
        self.assertEqual(response2.status_code, 400)

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_valid_user(self, mock_get):
        """Verify that a valid GitHub username returns profile analytics correctly."""
        # Setup mocks
        profile_json = {
            "login": "octocat",
            "name": "The Octocat",
            "bio": "There once was a cat...",
            "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
            "followers": 120,
            "following": 9,
            "public_repos": 8,
            "created_at": "2011-01-25T18:44:36Z"
        }
        repos_json = [
            {
                "name": "boysenberry-repo-1",
                "description": "Testing repo 1",
                "stargazers_count": 1000,
                "forks_count": 200,
                "html_url": "https://github.com/octocat/boysenberry-repo-1"
            },
            {
                "name": "git-consortium",
                "description": "Testing repo 2",
                "stargazers_count": 500,
                "forks_count": 100,
                "html_url": "https://github.com/octocat/git-consortium"
            }
        ]

        mock_response_profile = unittest.mock.MagicMock()
        mock_response_profile.status_code = 200
        mock_response_profile.json.return_value = profile_json
        mock_response_profile.headers = {"x-ratelimit-remaining": "50", "x-ratelimit-reset": "1774872000"}

        mock_response_repos = unittest.mock.MagicMock()
        mock_response_repos.status_code = 200
        mock_response_repos.json.return_value = repos_json
        mock_response_repos.headers = {"x-ratelimit-remaining": "49", "x-ratelimit-reset": "1774872000"}

        mock_get.side_effect = [mock_response_profile, mock_response_repos]

        # Execute
        response = self.client.get("/api/v1/analytics/github/octocat/profile")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "GitHub profile analytics generated successfully")
        
        profile = data["data"]["profile"]
        self.assertEqual(profile["username"], "octocat")
        self.assertEqual(profile["name"], "The Octocat")
        self.assertEqual(profile["bio"], "There once was a cat...")
        self.assertEqual(profile["followers"], 120)
        self.assertEqual(profile["following"], 9)
        self.assertEqual(profile["public_repos_count"], 8)
        self.assertEqual(profile["account_created_at"], "2011-01-25T18:44:36Z")
        self.assertGreater(profile["account_age_years"], 0.0)

        repos = data["data"]["repository_summary"]
        self.assertEqual(repos["total_repos"], 2)
        self.assertEqual(repos["total_stars"], 1500)
        self.assertEqual(repos["total_forks"], 300)
        self.assertEqual(repos["average_stars_per_repo"], 750.0)
        self.assertEqual(repos["most_starred_repo"]["name"], "boysenberry-repo-1")
        self.assertEqual(repos["most_starred_repo"]["stars"], 1000)
        self.assertEqual(len(repos["top_repositories"]), 2)
        self.assertEqual(repos["top_repositories"][0]["name"], "boysenberry-repo-1")

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_nonexistent_user(self, mock_get):
        """Verify that a nonexistent username returns 404."""
        mock_response = unittest.mock.MagicMock()
        mock_response.status_code = 404
        mock_response.text = "Not Found"
        mock_response.headers = {}
        mock_get.return_value = mock_response

        response = self.client.get("/api/v1/analytics/github/nonexistent-user-12345/profile")
        self.assertEqual(response.status_code, 404)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("not found", data["message"].lower())

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_rate_limited(self, mock_get):
        """Verify that API rate limit exceeded is handled gracefully (returns 429)."""
        mock_response = unittest.mock.MagicMock()
        mock_response.status_code = 403
        mock_response.text = "API rate limit exceeded"
        mock_response.headers = {"x-ratelimit-remaining": "0", "x-ratelimit-reset": "1774872000"}
        mock_get.return_value = mock_response

        response = self.client.get("/api/v1/analytics/github/rate-limited-user/profile")
        self.assertEqual(response.status_code, 429)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("rate limit exceeded", data["message"].lower())

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_caching_behavior(self, mock_get):
        """Verify that cache hit avoids repeated API requests."""
        # Setup mock for first call
        profile_json = {
            "login": "cached-user",
            "name": "Cached User",
            "avatar_url": "https://avatars.githubusercontent.com/u/1",
            "followers": 10,
            "following": 5,
            "public_repos": 1,
            "created_at": "2020-01-01T00:00:00Z"
        }
        repos_json = [{
            "name": "only-repo",
            "stargazers_count": 5,
            "forks_count": 2,
            "html_url": "https://github.com/cached-user/only-repo"
        }]

        mock_response_profile = unittest.mock.MagicMock()
        mock_response_profile.status_code = 200
        mock_response_profile.json.return_value = profile_json
        mock_response_profile.headers = {"x-ratelimit-remaining": "50", "x-ratelimit-reset": "1774872000"}

        mock_response_repos = unittest.mock.MagicMock()
        mock_response_repos.status_code = 200
        mock_response_repos.json.return_value = repos_json
        mock_response_repos.headers = {"x-ratelimit-remaining": "49", "x-ratelimit-reset": "1774872000"}

        mock_get.side_effect = [mock_response_profile, mock_response_repos]

        from app.analytics.service import analytics_service
        analytics_service.github_service._cache.clear()

        # First request (Cache Miss)
        resp1 = self.client.get("/api/v1/analytics/github/cached-user/profile")
        self.assertEqual(resp1.status_code, 200)
        self.assertEqual(mock_get.call_count, 2)

        # Second request (Cache Hit - mock_get call count should NOT increase)
        resp2 = self.client.get("/api/v1/analytics/github/cached-user/profile")
        self.assertEqual(resp2.status_code, 200)
        self.assertEqual(mock_get.call_count, 2)  # Still 2!
        
        # Verify cached-user lowercase caching works
        resp3 = self.client.get("/api/v1/analytics/github/CACHED-USER/profile")
        self.assertEqual(resp3.status_code, 200)
        self.assertEqual(mock_get.call_count, 2)  # Still 2!

    # --- GitHub Repository Insights Tests ---

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_insights_unauthorized(self, mock_get):
        """Verify that unauthorized access to GitHub insights endpoint returns 401."""
        response = self.unauth_client.get("/api/v1/analytics/github/octocat/insights")
        self.assertEqual(response.status_code, 401)

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_insights_invalid_username(self, mock_get):
        """Verify that malformed or empty GitHub username for insights returns 400."""
        response1 = self.client.get("/api/v1/analytics/github/%20/insights")
        self.assertEqual(response1.status_code, 400)
        
        response2 = self.client.get("/api/v1/analytics/github/invalid_name--double/insights")
        self.assertEqual(response2.status_code, 400)

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_insights_valid_user(self, mock_get):
        """Verify that a valid GitHub username returns repository insights correctly."""
        # Setup mocks
        profile_json = {
            "login": "octocat",
            "name": "The Octocat",
            "created_at": "2020-01-25T18:44:36Z"
        }
        repos_json = [
            {
                "name": "repo-python",
                "description": "A Python repository",
                "stargazers_count": 10,
                "forks_count": 5,
                "size": 100,
                "topics": ["fastapi", "python"],
                "created_at": "2024-01-01T12:00:00Z",
                "pushed_at": "2026-07-01T09:00:00Z"
            },
            {
                "name": "repo-js",
                "description": "A JavaScript repository",
                "stargazers_count": 2,
                "forks_count": 1,
                "size": 200,
                "topics": ["javascript"],
                "created_at": "2025-01-01T12:00:00Z",
                "pushed_at": "2026-06-15T09:00:00Z"
            }
        ]
        python_lang = {"Python": 8000, "C": 2000}
        js_lang = {"JavaScript": 5000}

        mock_response_profile = unittest.mock.MagicMock()
        mock_response_profile.status_code = 200
        mock_response_profile.json.return_value = profile_json
        
        mock_response_repos = unittest.mock.MagicMock()
        mock_response_repos.status_code = 200
        mock_response_repos.json.return_value = repos_json

        mock_response_lang1 = unittest.mock.MagicMock()
        mock_response_lang1.status_code = 200
        mock_response_lang1.json.return_value = python_lang

        mock_response_lang2 = unittest.mock.MagicMock()
        mock_response_lang2.status_code = 200
        mock_response_lang2.json.return_value = js_lang

        mock_get.side_effect = [
            mock_response_profile,
            mock_response_repos,
            mock_response_lang1,
            mock_response_lang2
        ]

        from app.analytics.service import analytics_service
        analytics_service.github_service._cache.clear()
        analytics_service.github_service._repo_languages_cache.clear()

        # Execute
        response = self.client.get("/api/v1/analytics/github/octocat/insights")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["message"], "GitHub repository insights generated successfully")
        
        insights = data["data"]
        
        # 1. Assert Languages
        langs = insights["languages"]
        self.assertEqual(langs["total_languages_used"], 3)
        self.assertEqual(langs["primary_language"], "Python")
        self.assertEqual(len(langs["top_languages"]), 3)
        self.assertEqual(langs["top_languages"][0]["label"], "Python")

        # 2. Assert Growth
        growth = insights["growth"]
        self.assertEqual(len(growth["repos_created_by_year"]), 2)
        self.assertEqual(growth["newest_repo"]["name"], "repo-js")
        self.assertEqual(growth["oldest_repo"]["name"], "repo-python")

        # 3. Assert Size
        size = insights["size"]
        self.assertEqual(size["average_repo_size_kb"], 150.0)
        self.assertEqual(size["largest_repo"]["name"], "repo-js")
        self.assertEqual(size["largest_repo"]["size_kb"], 200)

        # 4. Assert Topics
        topics = insights["topics"]
        self.assertEqual(topics["total_unique_topics"], 3)
        self.assertEqual(len(topics["top_topics"]), 3)

        # 5. Assert Activity
        activity = insights["activity"]
        self.assertEqual(activity["most_recently_active_repo"]["name"], "repo-python")
        self.assertEqual(activity["repos_updated_this_month"], 1)
        self.assertGreater(len(activity["activity_trend"]), 0)

        # 6. Assert Developer Score Breakdown
        score = insights["developer_score"]
        self.assertGreater(score["developer_score"], 0)
        self.assertIn("language_diversity", score["breakdown"])

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_insights_no_topics(self, mock_get):
        """Verify that a user with repositories that have no topics is handled gracefully."""
        profile_json = {
            "login": "no-topics-user",
            "created_at": "2022-01-01T00:00:00Z"
        }
        repos_json = [
            {
                "name": "repo-1",
                "description": "No topics here",
                "stargazers_count": 0,
                "forks_count": 0,
                "size": 50,
                "topics": [],
                "created_at": "2023-01-01T00:00:00Z",
                "pushed_at": "2026-01-01T00:00:00Z"
            }
        ]

        mock_response_profile = unittest.mock.MagicMock()
        mock_response_profile.status_code = 200
        mock_response_profile.json.return_value = profile_json
        
        mock_response_repos = unittest.mock.MagicMock()
        mock_response_repos.status_code = 200
        mock_response_repos.json.return_value = repos_json

        mock_response_lang = unittest.mock.MagicMock()
        mock_response_lang.status_code = 200
        mock_response_lang.json.return_value = {"Python": 1000}

        mock_get.side_effect = [mock_response_profile, mock_response_repos, mock_response_lang]

        from app.analytics.service import analytics_service
        analytics_service.github_service._cache.clear()
        analytics_service.github_service._repo_languages_cache.clear()

        response = self.client.get("/api/v1/analytics/github/no-topics-user/insights")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["data"]["topics"]["total_unique_topics"], 0)
        self.assertEqual(data["data"]["topics"]["top_topics"], [])

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_github_insights_rate_limit_mid_loop(self, mock_get):
        """Verify that hitting a rate limit mid-loop returns partial data with 206 status."""
        profile_json = {
            "login": "mid-limit-user",
            "created_at": "2021-01-01T00:00:00Z"
        }
        repos_json = [
            {
                "name": "repo-first",
                "stargazers_count": 10,
                "size": 100,
                "created_at": "2021-01-01T00:00:00Z",
                "pushed_at": "2026-06-01T00:00:00Z"
            },
            {
                "name": "repo-second",
                "stargazers_count": 5,
                "size": 100,
                "created_at": "2021-01-01T00:00:00Z",
                "pushed_at": "2026-06-01T00:00:00Z"
            }
        ]

        mock_response_profile = unittest.mock.MagicMock()
        mock_response_profile.status_code = 200
        mock_response_profile.json.return_value = profile_json
        
        mock_response_repos = unittest.mock.MagicMock()
        mock_response_repos.status_code = 200
        mock_response_repos.json.return_value = repos_json

        mock_response_lang1 = unittest.mock.MagicMock()
        mock_response_lang1.status_code = 200
        mock_response_lang1.json.return_value = {"Python": 1000}

        mock_response_lang2 = unittest.mock.MagicMock()
        mock_response_lang2.status_code = 403
        mock_response_lang2.text = "API rate limit exceeded"
        mock_response_lang2.headers = {"x-ratelimit-remaining": "0", "x-ratelimit-reset": "1774872000"}

        mock_get.side_effect = [
            mock_response_profile,
            mock_response_repos,
            mock_response_lang1,
            mock_response_lang2
        ]

        from app.analytics.service import analytics_service
        analytics_service.github_service._cache.clear()
        analytics_service.github_service._repo_languages_cache.clear()

        response = self.client.get("/api/v1/analytics/github/mid-limit-user/insights")
        self.assertEqual(response.status_code, 206)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("partial data due to rate limits", data["message"])
        self.assertTrue(data["data"]["is_partial"])
        self.assertIn("Returned partial analytics", data["data"]["partial_reason"])
        
        langs = data["data"]["languages"]
        self.assertEqual(langs["total_languages_used"], 1)
        self.assertEqual(langs["primary_language"], "Python")

    def test_github_insights_developer_score_deterministic(self):
        """Deterministic test of the Developer Score calculation formula with predefined inputs."""
        from app.analytics.statistics.github_statistics import GitHubStatistics
        
        now_str = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
        
        repos = [
            {
                "name": "repo-1",
                "description": "Has desc",
                "stargazers_count": 5,
                "forks_count": 2,
                "created_at": "2024-01-01T00:00:00Z",
                "pushed_at": now_str
            },
            {
                "name": "repo-2",
                "description": "",
                "stargazers_count": 0,
                "forks_count": 0,
                "created_at": "2025-01-01T00:00:00Z",
                "pushed_at": "2024-01-01T00:00:00Z"
            }
        ]
        languages = ["Python", "JavaScript"]

        result = GitHubStatistics.calculate_developer_score(repos, languages)
        
        self.assertEqual(result["breakdown"]["language_diversity"], 40)
        self.assertEqual(result["breakdown"]["activity"], 100)
        self.assertEqual(result["breakdown"]["community_engagement"], 36)
        self.assertEqual(result["breakdown"]["consistency"], 50)
        self.assertEqual(result["breakdown"]["documentation"], 50)
        self.assertEqual(result["developer_score"], 58)

    # --- Charts Engine Tests ---

    def test_charts_unauthenticated(self):
        """Verify charts endpoints reject unauthenticated access with 401."""
        response = self.unauth_client.get("/api/v1/analytics/charts/overview")
        self.assertEqual(response.status_code, 401)

        response = self.unauth_client.get("/api/v1/analytics/charts/ats-grade-distribution")
        self.assertEqual(response.status_code, 401)

    def test_charts_overview_empty_database(self):
        """Verify the charts overview works on empty databases (zero state validation)."""
        response = self.client.get("/api/v1/analytics/charts/overview")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertTrue(res["success"])
        self.assertIn("charts", res["data"])
        
        # Verify ATS grade distribution is present and contains empty grades (e.g. Excellent: 0, etc.)
        charts_list = res["data"]["charts"]
        self.assertTrue(any(c["chart_id"] == "ats-score-distribution" for c in charts_list))
        self.assertTrue(any(c["chart_id"] == "job-match-distribution" for c in charts_list))
        self.assertTrue(any(c["chart_id"] == "resume-upload-timeline" for c in charts_list))
        self.assertTrue(any(c["chart_id"] == "top-skills" for c in charts_list))

    def test_charts_overview_populated_database(self):
        """Verify the charts overview maps and aggregates populated statistics correctly."""
        db = SessionLocal()
        try:
            # Create a parsed resume with ATS score
            resume1 = Resume(
                user_id=self.user_id,
                original_filename="resume1.pdf",
                stored_filename="stored1.pdf",
                file_path="storage/resumes/stored1.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                ats_score=95,
                uploaded_at=datetime.utcnow()
            )
            db.add(resume1)
            db.commit()
            db.refresh(resume1)

            # Fill job match cache
            add_to_history(
                resume_id=resume1.id,
                overall_score=85,
                grade="A",
                job_title="Software Engineer",
                company="Google"
            )

            # Request overview
            response = self.client.get("/api/v1/analytics/charts/overview")
            self.assertEqual(response.status_code, 200)
            res = response.json()
            self.assertTrue(res["success"])

            charts = res["data"]["charts"]
            ats_chart = next(c for c in charts if c["chart_id"] == "ats-score-distribution")
            self.assertEqual(ats_chart["chart_type"], "pie")
            # 95 is Excellent
            excellent_pt = next(pt for pt in ats_chart["data"] if pt["label"] == "Excellent")
            self.assertEqual(excellent_pt["value"], 1)

            job_chart = next(c for c in charts if c["chart_id"] == "job-match-distribution")
            self.assertEqual(job_chart["chart_type"], "bar")
            # 85 is in "80–89%"
            cohort_pt = next(pt for pt in job_chart["data"] if pt["label"] == "80–89%")
            self.assertEqual(cohort_pt["value"], 1)
        finally:
            db.close()

    def test_charts_overview_partial_failure(self):
        """Verify that a failure in one statistics module doesn't fail the entire overview request."""
        # Mock get_upload_timeline_dates to fail
        with unittest.mock.patch(
            "app.analytics.statistics.resume_statistics.ResumeStatistics.get_upload_timeline_dates",
            side_effect=Exception("Database error in timeline query")
        ):
            response = self.client.get("/api/v1/analytics/charts/overview")
            self.assertEqual(response.status_code, 200)
            res = response.json()
            self.assertTrue(res["success"])
            
            charts = res["data"]["charts"]
            # resume-upload-timeline should be omitted
            self.assertFalse(any(c["chart_id"] == "resume-upload-timeline" for c in charts))
            # Others like ats-score-distribution should still be returned
            self.assertTrue(any(c["chart_id"] == "ats-score-distribution" for c in charts))
            
            # Verify omitted_charts metadata
            self.assertIn("omitted_charts", res["data"])
            self.assertIn("resume-upload-timeline", res["data"]["omitted_charts"])
            self.assertIn("Database error in timeline query", res["data"]["omitted_charts"]["resume-upload-timeline"])

    def test_single_chart_success(self):
        """Test getting individual charts on demand (ats-category-breakdown, resume-experience-distribution, etc.)."""
        response = self.client.get("/api/v1/analytics/charts/ats-category-breakdown")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertTrue(res["success"])
        self.assertEqual(res["data"]["chart_id"], "ats-category-breakdown")
        self.assertEqual(res["data"]["chart_type"], "bar")
        self.assertIn("metadata", res["data"])
        self.assertIn("weights", res["data"]["metadata"])

        response = self.client.get("/api/v1/analytics/charts/resume-experience-distribution")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertEqual(res["data"]["chart_id"], "resume-experience-distribution")

    def test_single_chart_unknown_id(self):
        """Verify request for unknown chart_id returns 404 with standard error format and valid chart list."""
        response = self.client.get("/api/v1/analytics/charts/non-existent-chart")
        self.assertEqual(response.status_code, 404)
        res = response.json()
        self.assertFalse(res["success"])
        self.assertIn("Valid chart IDs:", res["message"])
        self.assertIn("ats-grade-distribution", res["message"])

    def test_single_chart_github_requires_username(self):
        """Verify requesting github charts without a username or with an invalid username returns 400."""
        # 1. Missing username
        response = self.client.get("/api/v1/analytics/charts/github-language-distribution")
        self.assertEqual(response.status_code, 400)
        res = response.json()
        self.assertFalse(res["success"])
        self.assertIn("Username query parameter is required", res["message"])

        # 2. Invalid username format
        response = self.client.get("/api/v1/analytics/charts/github-language-distribution?username=-invalid-")
        self.assertEqual(response.status_code, 400)
        res = response.json()
        self.assertFalse(res["success"])
        self.assertIn("Malformed GitHub username", res["message"])

    @unittest.mock.patch("httpx.AsyncClient.get")
    def test_single_chart_github_success(self, mock_get):
        """Verify successful generation of GitHub charts with a valid username and mock service calls."""
        profile_json = {
            "login": "test-developer",
            "created_at": "2023-01-01T00:00:00Z"
        }
        repos_json = [
            {
                "name": "project-alpha",
                "stargazers_count": 10,
                "size": 500,
                "created_at": "2023-01-01T00:00:00Z",
                "pushed_at": "2026-06-01T00:00:00Z"
            }
        ]
        lang_json = {"Python": 8000, "JavaScript": 2000}

        mock_profile = unittest.mock.MagicMock()
        mock_profile.status_code = 200
        mock_profile.json.return_value = profile_json

        mock_repos = unittest.mock.MagicMock()
        mock_repos.status_code = 200
        mock_repos.json.return_value = repos_json

        mock_lang = unittest.mock.MagicMock()
        mock_lang.status_code = 200
        mock_lang.json.return_value = lang_json

        mock_get.side_effect = [mock_profile, mock_repos, mock_lang]

        # 1. Test github-language-distribution
        response = self.client.get("/api/v1/analytics/charts/github-language-distribution?username=test-developer")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertTrue(res["success"])
        self.assertEqual(res["data"]["chart_id"], "github-language-distribution")
        self.assertEqual(res["data"]["chart_type"], "pie")
        
        data_points = res["data"]["data"]
        python_pt = next(pt for pt in data_points if pt["label"] == "Python")
        self.assertEqual(python_pt["value"], 80.0)  # percentage is 80%

        # Reset mock call side effects for the second chart
        mock_profile2 = unittest.mock.MagicMock()
        mock_profile2.status_code = 200
        mock_profile2.json.return_value = profile_json

        mock_repos2 = unittest.mock.MagicMock()
        mock_repos2.status_code = 200
        mock_repos2.json.return_value = repos_json

        mock_get.side_effect = [mock_profile2, mock_repos2]

        # 2. Test github-repo-growth
        response = self.client.get("/api/v1/analytics/charts/github-repo-growth?username=test-developer")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertTrue(res["success"])
        self.assertEqual(res["data"]["chart_id"], "github-repo-growth")
        self.assertEqual(res["data"]["chart_type"], "line")
        self.assertEqual(res["data"]["data"][0]["label"], "2023")
        self.assertEqual(res["data"]["data"][0]["value"], 1)


class TestStatisticsDirect(unittest.TestCase):
    """Direct unit tests for BaseStatistics and its calculation subclasses."""
    
    def test_base_statistics_format_timeline(self):
        """Test BaseStatistics.format_timeline directly."""
        dt = datetime(2026, 7, 1, 10, 0, 0, tzinfo=timezone.utc)
        self.assertEqual(BaseStatistics.format_timeline(dt, "daily"), "2026-07-01")
        self.assertEqual(BaseStatistics.format_timeline(dt, "weekly"), "2026-06-29")  # 2026-07-01 is Wednesday, Monday is June 29
        self.assertEqual(BaseStatistics.format_timeline(dt, "monthly"), "2026-07")

    def test_resume_statistics_direct(self):
        """Test ResumeStatistics calculation methods directly."""
        from app.analytics.statistics.resume_statistics import ResumeStatistics
        
        parsed_resumes_data = [
            {
                "data": {
                    "skills": ["Python", "FastAPI"],
                    "experience": [{"duration": "2 years"}],
                    "education": [{"degree": "Bachelor of Science"}]
                }
            },
            {
                "data": {
                    "skills": ["Python", "Docker"],
                    "experience": [{"duration": "3 years"}],
                    "education": [{"degree": "Master"}]
                }
            }
        ]
        
        skills = ResumeStatistics.calculate_skills_analytics(parsed_resumes_data)
        self.assertEqual(skills["total_unique_skills"], 3)
        self.assertEqual(skills["most_common_skill"], "Python")
        self.assertIn("Python", skills["top_skills"])
        
        exp = ResumeStatistics.calculate_experience_analytics(parsed_resumes_data)
        self.assertEqual(exp["average_years_experience"], 2.5)
        self.assertEqual(exp["experience_distribution"]["2–4 years"], 2)
        
        edu = ResumeStatistics.calculate_education_analytics(parsed_resumes_data)
        self.assertEqual(edu["education_distribution"]["Bachelor"], 1)
        self.assertEqual(edu["education_distribution"]["Master"], 1)
        
        timeline_dates = [
            datetime(2026, 7, 1, tzinfo=timezone.utc),
            datetime(2026, 7, 2, tzinfo=timezone.utc),
        ]
        timeline = ResumeStatistics.calculate_timeline_analytics(timeline_dates)
        self.assertEqual(timeline["daily"]["2026-07-01"], 1)
        self.assertEqual(timeline["daily"]["2026-07-02"], 1)

    def test_ats_statistics_direct(self):
        """Test ATSStatistics calculation methods directly."""
        from app.analytics.statistics.ats_statistics import ATSStatistics
        
        class MockResume:
            def __init__(self, id, user_id, ats_score, uploaded_at, parsed_data):
                self.id = id
                self.user_id = user_id
                self.ats_score = ats_score
                self.uploaded_at = uploaded_at
                self.parsed_data = parsed_data

        resume1 = MockResume(1, 101, 95, datetime(2026, 6, 25, tzinfo=timezone.utc), {})
        resume2 = MockResume(2, 101, 75, datetime(2026, 6, 27, tzinfo=timezone.utc), {})
        
        scored_resumes = [resume1, resume2]
        db_scores = {1: 95, 2: 75}
        
        overview = ATSStatistics.calculate_ats_overview(scored_resumes, db_scores)
        self.assertEqual(overview["total_ats_evaluations"], 2)
        self.assertEqual(overview["average_ats_score"], 85.0)
        self.assertEqual(overview["highest_ats_score"], 95)
        self.assertEqual(overview["lowest_ats_score"], 75)
        self.assertEqual(overview["median_ats_score"], 85.0)
        
        grade_dist = ATSStatistics.calculate_ats_grade_distribution(scored_resumes, db_scores)
        self.assertEqual(grade_dist["Excellent"]["count"], 1)
        self.assertEqual(grade_dist["Good"]["count"], 1)
        
        trend = ATSStatistics.calculate_ats_trend_analytics(scored_resumes, db_scores)
        self.assertEqual(len(trend["score_trend"]), 2)
        self.assertEqual(trend["improvement_rate"], -20.0)
        
        with unittest.mock.patch("app.analytics.statistics.ats_statistics.calculate_ats_score") as mock_score:
            class MockBreakdown:
                contact = 10.0
                skills = 20.0
                education = 15.0
                experience = 20.0
                projects = 10.0
                certifications = 5.0
            
            class MockATSRecommendation:
                def __init__(self, message):
                    self.message = message

            class MockATSScoreResponse:
                breakdown = MockBreakdown()
                weaknesses = ["Missing certifications"]
                recommendations = [MockATSRecommendation("Add a certification")]
            
            mock_score.return_value = MockATSScoreResponse()
            
            breakdown = ATSStatistics.calculate_ats_category_breakdown(scored_resumes)
            self.assertEqual(breakdown["skills"]["average"], 20.0)
            
            weaknesses = ATSStatistics.calculate_ats_weakness_insights(scored_resumes)
            self.assertEqual(weaknesses["top_weaknesses"][0]["name"], "Missing certifications")
            self.assertEqual(weaknesses["top_recommendations"][0]["name"], "Add a certification")

    def test_job_statistics_direct(self):
        """Test JobStatistics calculation methods directly."""
        from app.analytics.statistics.job_statistics import JobStatistics
        
        matches = [
            {
                "resume_id": "r1",
                "overall_score": 90,
                "grade": "A",
                "job_title": "Python Developer",
                "company": "Google",
                "missing_skills": ["Docker"],
                "recommendations": [{"message": "Learn Docker"}],
                "timestamp": datetime(2026, 6, 25, 12, 0, 0)
            },
            {
                "resume_id": "r1",
                "overall_score": 80,
                "grade": "B",
                "job_title": "Python Developer",
                "company": "Google",
                "missing_skills": ["Docker", "Kubernetes"],
                "recommendations": [{"message": "Learn Docker"}],
                "timestamp": datetime(2026, 6, 26, 12, 0, 0)
            }
        ]
        
        overview = JobStatistics.calculate_job_overview(matches)
        self.assertEqual(overview["total_job_matches"], 2)
        self.assertEqual(overview["average_match_score"], 85.0)
        
        dist = JobStatistics.calculate_job_distribution(matches)
        self.assertEqual(dist["90–100%"]["count"], 1)
        self.assertEqual(dist["80–89%"]["count"], 1)
        
        gaps = JobStatistics.calculate_job_skill_gaps(matches)
        self.assertEqual(gaps["total_unique_missing_skills"], 2)
        self.assertEqual(gaps["missing_skill_frequency"]["Docker"], 2)
        self.assertEqual(gaps["missing_skill_frequency"]["Kubernetes"], 1)
        
        trend = JobStatistics.calculate_job_trend(matches)
        self.assertEqual(len(trend["score_trend"]), 2)
        
        recs = JobStatistics.calculate_job_recommendations(matches)
        self.assertEqual(recs["top_recommendations"][0]["name"], "Learn Docker")
        self.assertEqual(recs["top_recommendations"][0]["count"], 2)
        
        history = JobStatistics.calculate_job_history(matches)
        self.assertEqual(history["total_matches"], 2)
        self.assertEqual(history["repeated_job_descriptions"], 1)

    def test_github_statistics_direct(self):
        """Test GitHubStatistics calculation methods directly."""
        from app.analytics.statistics.github_statistics import GitHubStatistics
        
        age = GitHubStatistics.calculate_profile_age("2024-01-01T12:00:00Z")
        self.assertGreater(age, 2.0)
        
        repos = [
            {
                "name": "repo1",
                "description": "First project",
                "stargazers_count": 10,
                "forks_count": 2,
                "size": 500,
                "topics": ["python"],
                "created_at": "2024-01-01T00:00:00Z",
                "pushed_at": "2026-06-25T12:00:00Z"
            },
            {
                "name": "repo2",
                "description": "",
                "stargazers_count": 5,
                "forks_count": 1,
                "size": 1500,
                "topics": ["python", "fastapi"],
                "created_at": "2025-01-01T00:00:00Z",
                "pushed_at": "2026-06-26T12:00:00Z"
            }
        ]
        
        summary = GitHubStatistics.calculate_repository_summary(repos)
        self.assertEqual(summary["total_repos"], 2)
        self.assertEqual(summary["total_stars"], 15)
        self.assertEqual(summary["total_forks"], 3)
        self.assertEqual(summary["average_stars_per_repo"], 7.5)
        self.assertEqual(summary["most_starred_repo"]["name"], "repo1")
        
        languages = {"repo1": {"Python": 1000}, "repo2": {"Python": 500, "C": 500}}
        lang_stats = GitHubStatistics.calculate_languages_analytics(languages)
        self.assertEqual(lang_stats["total_languages_used"], 2)
        self.assertEqual(lang_stats["primary_language"], "Python")
        
        growth = GitHubStatistics.calculate_growth_analytics(repos)
        self.assertEqual(len(growth["repos_created_by_year"]), 2)
        self.assertEqual(growth["newest_repo"]["name"], "repo2")
        
        size = GitHubStatistics.calculate_size_analytics(repos)
        self.assertEqual(size["average_repo_size_kb"], 1000.0)
        self.assertEqual(size["largest_repo"]["name"], "repo2")
        self.assertEqual(size["largest_repo"]["size_kb"], 1500)
        
        topics = GitHubStatistics.calculate_topics_analytics(repos)
        self.assertEqual(topics["total_unique_topics"], 2)
        self.assertEqual(topics["top_topics"][0]["label"], "python")
        self.assertEqual(topics["top_topics"][0]["value"], 2)
        
        activity = GitHubStatistics.calculate_activity_analytics(repos)
        self.assertEqual(activity["most_recently_active_repo"]["name"], "repo2")
        self.assertEqual(len(activity["activity_trend"]), 1)
        
        score_data = GitHubStatistics.calculate_developer_score(repos, ["Python", "C"])
        self.assertGreater(score_data["developer_score"], 0)
        self.assertEqual(score_data["breakdown"]["language_diversity"], 40)





