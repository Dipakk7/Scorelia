import os
import sys
import uuid
import logging
import unittest
from datetime import datetime, timezone, timedelta
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_optimization import AIResumeOptimization
from app.interview.models.interview import InterviewSession
from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.career_roadmap.services.analytics_service import CareerAnalyticsService
from app.core.enums import RoadmapStatus, MilestoneStatus


class TestCareerRoadmapAnalytics(unittest.IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls):
        """Set up database connections and create a clean test user."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            email = "analytics_test@careerpilot.com"
            test_user = db.query(User).filter(User.email == email).first()
            if test_user:
                # Cleanup associated roadmaps
                roadmaps = db.query(CareerRoadmap).filter(CareerRoadmap.user_id == test_user.id).all()
                for r in roadmaps:
                    db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == r.id).delete()
                    db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == r.id).delete()
                    db.delete(r)
                db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                db.query(AIResumeReview).filter(AIResumeReview.user_id == test_user.id).delete()
                db.query(AIResumeOptimization).filter(AIResumeOptimization.user_id == test_user.id).delete()
                db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
                db.delete(test_user)
            db.commit()

            # Create test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email=email,
                password="SecurePassword@2026",
                full_name="Analytics Test User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id
            cls.user_email = cls.user.email
            cls.user_auth_provider = cls.user.auth_provider
            db.commit()
        finally:
            db.close()

        # Generate Access Token directly
        from app.core import security
        cls.client = TestClient(app)
        cls.token = security.create_access_token(data={
            "sub": cls.user_email,
            "user_id": str(cls.user_id),
            "provider": cls.user_auth_provider
        })
        cls.headers = {"Authorization": f"Bearer {cls.token}"}
        cls.cookies = {"access_token": cls.token}

    def setUp(self):
        self.db = SessionLocal()
        # Clean up any roadmaps created during tests
        self.db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id.in_(
            self.db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == self.user_id)
        )).delete(synchronize_session='fetch')
        self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id.in_(
            self.db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == self.user_id)
        )).delete(synchronize_session='fetch')
        self.db.query(CareerRoadmap).filter(CareerRoadmap.user_id == self.user_id).delete()
        self.db.query(Resume).filter(Resume.user_id == self.user_id).delete()
        self.db.query(AIResumeReview).filter(AIResumeReview.user_id == self.user_id).delete()
        self.db.query(AIResumeOptimization).filter(AIResumeOptimization.user_id == self.user_id).delete()
        self.db.query(InterviewSession).filter(InterviewSession.user_id == self.user_id).delete()
        self.db.commit()

    def tearDown(self):
        self.db.close()

    def _create_mock_resume(self):
        """Create a mock parsed resume in DB."""
        resume = Resume(
            user_id=self.user_id,
            original_filename="resume.pdf",
            stored_filename=f"resume_{uuid.uuid4()}.pdf",
            file_path="/mock/path/resume.pdf",
            file_size=1024,
            file_type="pdf",
            mime_type="application/pdf",
            parsed_data={"skills": ["Python", "FastAPI", "SQLAlchemy", "Docker", "Git"], "links": ["https://github.com/testuser"]},
            ats_score=80
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def _create_mock_roadmap(self, status=RoadmapStatus.COMPLETED.value, resume_id=None):
        """Create a mock career roadmap with milestones and recommendations."""
        roadmap = CareerRoadmap(
            user_id=self.user_id,
            resume_id=resume_id,
            target_role="Senior FastAPI Developer",
            current_role="Python Developer",
            experience_level="MID",
            target_industry="Tech",
            roadmap_status=status,
            estimated_duration_months=6,
            current_readiness_score=75,
            provider="mock_provider",
            model="mock_model",
            prompt_version="1.0.0",
            roadmap_metadata={
                "generated_roadmap": {
                    "phases": [
                        {
                            "phase_number": 1,
                            "title": "Phase 1: REST API Mastery",
                            "objective": "Learn advanced FastAPI details",
                            "description": "Difficulty: Intermediate",
                            "skills": ["Pydantic v2", "SQLAlchemy 2.0"]
                        }
                    ]
                },
                "skill_gap_analysis": {
                    "technical_gaps": [
                        {"skill": "Kubernetes", "gap_severity": "High", "remediation_action": "Study K8s basics."}
                    ]
                }
            }
        )
        self.db.add(roadmap)
        self.db.commit()
        self.db.refresh(roadmap)

        # Add milestone
        m1 = RoadmapMilestone(
            roadmap_id=roadmap.id,
            phase_number=1,
            title="Phase 1: REST API Mastery",
            description="Learn advanced FastAPI details",
            duration="4 weeks",
            order_index=1,
            status=MilestoneStatus.NOT_STARTED.value
        )
        self.db.add(m1)

        # Add recommendations
        r1 = LearningRecommendation(
            roadmap_id=roadmap.id,
            category="Skill",
            title="Pydantic v2",
            description="Recommended skill for Phase 1 (REST API Mastery).",
            priority="HIGH",
            estimated_hours=10
        )
        r2 = LearningRecommendation(
            roadmap_id=roadmap.id,
            category="Certification",
            title="AWS Developer Associate",
            description="Recommended skill for Phase 2.",
            priority="MEDIUM",
            estimated_hours=25
        )
        self.db.add_all([r1, r2])
        self.db.commit()
        self.db.refresh(roadmap)
        return roadmap

    def test_01_service_progress_engine(self):
        """Test calculation of progress velocity, remaining weeks, and delays."""
        roadmap = self._create_mock_roadmap()
        service = CareerAnalyticsService(self.db)
        
        # Test progress when not started
        progress = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first() is not None
        self.assertTrue(progress)
        
        calc = service.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        res = self.db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == calc.id).all()
        self.assertEqual(len(res), 1)
        self.assertEqual(res[0].status, "NOT_STARTED")

        progress_data = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        ans = service.db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == progress_data.id).all()
        
        progress_res = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        progress_metrics = service.calculate_progress(progress_res)
        self.assertEqual(progress_metrics["completion_percentage"], 0.0)
        self.assertEqual(progress_metrics["velocity_percentage_per_week"], 0.0)

        # Update milestone to COMPLETED and test progress changes
        m = self.db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == roadmap.id).first()
        m.status = "COMPLETED"
        self.db.commit()
        self.db.refresh(roadmap)

        progress_metrics2 = service.calculate_progress(roadmap)
        self.assertEqual(progress_metrics2["completion_percentage"], 100.0)
        self.assertEqual(progress_metrics2["remaining_weeks"], 0.0)

    def test_02_service_readiness_scoring(self):
        """Test readiness scoring calculations including category breakdowns."""
        resume = self._create_mock_resume()
        
        # Add Resume Review
        review = AIResumeReview(
            user_id=self.user_id,
            resume_id=resume.id,
            review={"overall_score": 85},
            provider="mock_provider",
            model="mock_model",
            prompt_version="1.0.0"
        )
        self.db.add(review)
        
        # Add Resume Optimization
        opt = AIResumeOptimization(
            user_id=self.user_id,
            resume_id=resume.id,
            quality_score={"overall_score": 90},
            optimization_result={},
            provider="mock_provider",
            model="mock_model",
            prompt_version="1.0.0"
        )
        self.db.add(opt)
        self.db.commit()

        roadmap = self._create_mock_roadmap(resume_id=resume.id)
        service = CareerAnalyticsService(self.db)
        
        from app.career_roadmap.services.context import RoadmapContext
        context = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        roadmap_ctx = self.db.query(Resume).filter(Resume.id == context.resume_id).first()
        
        # Build context
        build_ctx = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        ctx = self.db.query(AIResumeReview).filter(AIResumeReview.resume_id == build_ctx.resume_id).first()
        
        roadmap_context = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        
        # Test calculation
        readiness_ctx = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        
        with patch("app.career_roadmap.services.context.RoadmapContext.build") as mock_build:
            mock_ctx = MagicMock()
            mock_ctx.resume = resume
            mock_ctx.resume_review = review
            mock_ctx.resume_optimization = opt
            mock_ctx.ats_score = 80
            mock_ctx.interview_analytics = {"average_score": 75}
            mock_ctx.github_insights = {"developer_score": {"developer_score": 70}}
            mock_build.return_value = mock_ctx
            
            readiness = service.calculate_readiness(roadmap, mock_ctx)
            self.assertGreaterEqual(readiness["overall_score"], 60.0)
            self.assertEqual(readiness["breakdown"]["ats_score"], 80.0)
            self.assertEqual(readiness["breakdown"]["resume_review"], 85.0)
            self.assertEqual(readiness["breakdown"]["resume_optimization"], 90.0)

    def test_03_service_skill_analytics(self):
        """Test skill analytics calculations, categorization, and distribution."""
        resume = self._create_mock_resume()
        roadmap = self._create_mock_roadmap(resume_id=resume.id)
        service = CareerAnalyticsService(self.db)

        mock_ctx = MagicMock()
        mock_ctx.resume = resume
        
        skills_analytics = service.calculate_skill_analytics(roadmap, mock_ctx)
        self.assertIn("Pydantic v2", skills_analytics["skills_remaining"])
        self.assertIn("Kubernetes", skills_analytics["top_missing_skills"])
        self.assertIn("Python", skills_analytics["top_strong_skills"])
        self.assertEqual(skills_analytics["difficulty_distribution"]["Advanced"], 1)

    def test_04_service_timeline_analytics(self):
        """Test timeline health evaluation and overdue calculations."""
        roadmap = self._create_mock_roadmap()
        service = CareerAnalyticsService(self.db)
        
        # Inject metadata timeline milestones and set created_at in the past to trigger overdue status
        roadmap.roadmap_metadata = {
            "timeline": {
                "milestones": [
                    {"title": "Phase 1: REST API Mastery", "start_week": 1, "end_week": 3, "completion_status": "NOT_STARTED"}
                ]
            }
        }
        roadmap.created_at = datetime.now(timezone.utc) - timedelta(weeks=5)
        self.db.commit()
        self.db.refresh(roadmap)
        
        timeline = service.calculate_timeline_analytics(roadmap)
        self.assertEqual(timeline["timeline_health"], "BEHIND_SCHEDULE")  # overdue milestone
        self.assertEqual(len(timeline["overdue_milestones"]), 1)

    def test_05_api_endpoints_analytics(self):
        """Test all analytics REST APIs responses and status codes."""
        roadmap = self._create_mock_roadmap()

        # 1. GET overall analytics
        resp1 = self.client.get("/api/v1/ai/roadmap/analytics", cookies=self.cookies)
        self.assertEqual(resp1.status_code, 200)
        self.assertIn("total_roadmaps", resp1.json())

        # 2. GET roadmap specific analytics
        resp2 = self.client.get(f"/api/v1/ai/roadmap/{roadmap.id}/analytics", cookies=self.cookies)
        self.assertEqual(resp2.status_code, 200)
        self.assertEqual(resp2.json()["roadmap_id"], str(roadmap.id))
        self.assertIn("metrics", resp2.json())
        self.assertIn("progress", resp2.json())
        self.assertIn("readiness", resp2.json())
        self.assertIn("skills", resp2.json())
        self.assertIn("timeline", resp2.json())

        # 3. GET progress
        resp3 = self.client.get(f"/api/v1/ai/roadmap/{roadmap.id}/progress", cookies=self.cookies)
        self.assertEqual(resp3.status_code, 200)
        self.assertIn("completion_percentage", resp3.json())

        # 4. GET readiness
        resp4 = self.client.get(f"/api/v1/ai/roadmap/{roadmap.id}/readiness", cookies=self.cookies)
        self.assertEqual(resp4.status_code, 200)
        self.assertIn("overall_score", resp4.json())

        # 5. GET skills
        resp5 = self.client.get(f"/api/v1/ai/roadmap/{roadmap.id}/skills", cookies=self.cookies)
        self.assertEqual(resp5.status_code, 200)
        self.assertIn("skills_completed", resp5.json())

    async def test_06_caching_and_invalidation(self):
        """Test that computed analytics are cached and properly invalidated."""
        roadmap = self._create_mock_roadmap()
        service = CareerAnalyticsService(self.db)

        # First run (computes and caches)
        res1 = await service.get_roadmap_analytics(roadmap.id, self.user_id)
        self.db.refresh(roadmap)
        self.assertIn("analytics", roadmap.roadmap_metadata)
        
        # Second run (cache hit)
        with patch.object(service, "calculate_progress") as mock_calc:
            res2 = await service.get_roadmap_analytics(roadmap.id, self.user_id)
            mock_calc.assert_not_called()

        # Update cache generated_at to be in the past to trigger invalidation (with 5s tolerance)
        metadata = dict(roadmap.roadmap_metadata)
        metadata["analytics_metadata"]["generated_at"] = (datetime.utcnow() - timedelta(seconds=10)).isoformat()
        roadmap.roadmap_metadata = metadata
        from sqlalchemy.orm.attributes import flag_modified
        flag_modified(roadmap, "roadmap_metadata")
        self.db.commit()

        # Third run (cache miss and recompute)
        with patch.object(service, "calculate_progress") as mock_calc:
            mock_calc.return_value = res1["progress"]
            await service.get_roadmap_analytics(roadmap.id, self.user_id)
            mock_calc.assert_called_once()

    async def test_07_privacy_logging_compliance(self):
        """Test that logging strictly adheres to privacy regulations (only non-sensitive metadata logged)."""
        roadmap = self._create_mock_roadmap()
        service = CareerAnalyticsService(self.db)

        with patch("app.career_roadmap.services.analytics_service.logger.info") as mock_log:
            await service.get_roadmap_analytics(roadmap.id, self.user_id)
            
            # Verify that logging called with metadata fields only
            mock_log.assert_called()
            for call in mock_log.call_args_list:
                log_msg = call[0][0]
                log_kwargs = call[1]
                
                # Check message content
                self.assertIn(log_msg, ("career_roadmap_analytics_generated", "career_roadmap_analytics_retrieved"))
                
                # Check keys logged
                self.assertIn("roadmap_id", log_kwargs)
                self.assertIn("analytics_latency", log_kwargs)
                self.assertIn("cache_hits", log_kwargs)
                
                # Verify that no sensitive items are logged
                for key in log_kwargs.keys():
                    self.assertNotIn(key, ("resume", "prompt", "learning_plan", "personal_info", "skills", "recommendations"))
