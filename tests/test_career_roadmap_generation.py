import os
import sys
import uuid
import unittest
from datetime import datetime, timezone
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider, RoadmapStatus, MilestoneStatus
from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.career_roadmap.schemas.schemas import RoadmapCreate

class TestCareerRoadmapGeneration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            email = "roadmap_gen_test@careerpilot.com"
            test_user = db.query(User).filter(User.email == email).first()
            if test_user:
                db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id.in_(
                    db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == test_user.id)
                )).delete(synchronize_session=False)
                db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id.in_(
                    db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == test_user.id)
                )).delete(synchronize_session=False)
                db.query(CareerRoadmap).filter(CareerRoadmap.user_id == test_user.id).delete()
                db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                db.delete(test_user)
            db.commit()

            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email=email,
                password="SecurePassword@2026",
                full_name="Generation User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create a mock parsed resume
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="roadmap_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/roadmap_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                ats_score=85,
                parsed_data={"data": {"skills": {"value": ["Python", "FastAPI"]}}}
            )
            db.add(cls.resume)
            db.commit()
            db.refresh(cls.resume)
            cls.resume_id = cls.resume.id

            from app.core import security
            cls.client = TestClient(app)
            cls.token = security.create_access_token(data={
                "sub": cls.user.email,
                "user_id": str(cls.user.id),
                "provider": cls.user.auth_provider
            })
            cls.cookies = {"access_token": cls.token}
        except Exception:
            db.rollback()
            raise

    @classmethod
    def tearDownClass(cls):
        db = cls.db
        try:
            db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id.in_(
                db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == cls.user_id)
            )).delete(synchronize_session=False)
            db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id.in_(
                db.query(CareerRoadmap.id).filter(CareerRoadmap.user_id == cls.user_id)
            )).delete(synchronize_session=False)
            db.query(CareerRoadmap).filter(CareerRoadmap.user_id == cls.user_id).delete()
            db.query(Resume).filter(Resume.user_id == cls.user_id).delete()
            db.delete(cls.user)
            db.commit()
        except Exception:
            db.rollback()
        db.close()

    def test_01_api_generate_success(self):
        """Test successful generation endpoint with mocked AI output."""
        mock_response = {
            "parsed_response": {
                "roadmap_title": "AI Architect Path",
                "target_role": "AI Architect",
                "experience_level": "SENIOR",
                "estimated_duration_months": 12,
                "current_readiness_score": 75,
                "phases": [
                    {
                        "phase_number": 1,
                        "title": "FastAPI Master",
                        "objective": "Objective 1",
                        "description": "Description 1",
                        "estimated_duration_weeks": 6,
                        "difficulty": "Intermediate",
                        "skills": ["FastAPI", "SQLAlchemy"],
                        "projects": ["REST API Project"],
                        "certifications": ["Python Cert"],
                        "resources": ["Doc Link"],
                        "completion_criteria": ["Finish project"],
                        "career_outcome": "FastAPI proficiency"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 320,
            "prompt_version": "1.0.0"
        }

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_roadmap", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = mock_response

            payload = {
                "resume_id": str(self.resume_id),
                "target_role": "AI Architect",
                "current_role": "Backend Engineer",
                "experience_level": "senior",
                "target_industry": "Tech",
                "estimated_duration_months": 12
            }

            response = self.client.post("/api/v1/ai/roadmap/generate", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 201)
            data = response.json()
            self.assertEqual(data["roadmap_status"], "COMPLETED")
            self.assertEqual(data["current_readiness_score"], 75)
            self.assertEqual(data["provider"], "mock_provider")
            self.assertEqual(data["model"], "mock_model")

            # Check db persistence
            roadmap_id = data["id"]
            db_milestones = self.db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == roadmap_id).all()
            self.assertEqual(len(db_milestones), 1)
            self.assertEqual(db_milestones[0].title, "FastAPI Master")

            db_recs = self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap_id).all()
            # 2 skills + 1 project + 1 cert + 1 resource = 5 recommendations
            self.assertEqual(len(db_recs), 5)

    def test_02_identical_request_caching(self):
        """Test that identical requests hit the DB cache and avoid calling the AI service again."""
        mock_response = {
            "parsed_response": {
                "roadmap_title": "ML Engineer Path",
                "target_role": "ML Engineer",
                "experience_level": "MID",
                "estimated_duration_months": 6,
                "current_readiness_score": 65,
                "phases": [
                    {
                        "phase_number": 1,
                        "title": "Math Fundamentals",
                        "objective": "Objective 1",
                        "description": "Description 1",
                        "estimated_duration_weeks": 4,
                        "difficulty": "Intermediate",
                        "skills": ["Linear Algebra"],
                        "projects": [],
                        "certifications": [],
                        "resources": [],
                        "completion_criteria": ["Exam"],
                        "career_outcome": "Outcome"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 200,
            "prompt_version": "1.0.0"
        }

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_roadmap", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = mock_response

            payload = {
                "resume_id": str(self.resume_id),
                "target_role": "ML Engineer",
                "current_role": "Data Analyst",
                "experience_level": "mid",
                "target_industry": "Finance",
                "estimated_duration_months": 6
            }

            # First call: triggers AI generation
            resp1 = self.client.post("/api/v1/ai/roadmap/generate", json=payload, cookies=self.cookies)
            self.assertEqual(resp1.status_code, 201)
            mock_gen.assert_called_once()

            # Second call: returns cached DB instance, no AI call
            mock_gen.reset_mock()
            resp2 = self.client.post("/api/v1/ai/roadmap/generate", json=payload, cookies=self.cookies)
            self.assertEqual(resp2.status_code, 201)
            mock_gen.assert_not_called()
            
            # Verify the IDs are the same
            self.assertEqual(resp1.json()["id"], resp2.json()["id"])

    def test_03_ai_retry_once_on_malformed_json(self):
        """Test that RoadmapAIService retries generation once if the output fails validation/JSON parsing."""
        from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage
        from app.career_roadmap.services.ai_service import RoadmapAIService
        from app.career_roadmap.models.roadmap import CareerRoadmap
        from app.career_roadmap.services.context import RoadmapContext

        mock_ai_service = MagicMock()
        roadmap_ai = RoadmapAIService(ai_service=mock_ai_service)

        # First attempt returns malformed dict (missing target_role)
        first_bad = AIStructuredResponse(
            provider="mock",
            model="mock",
            latency_ms=100.0,
            prompt_version="1.0.0",
            created_at=datetime.utcnow(),
            raw_response={},
            parsed_response={
                "roadmap_title": "Bad Output",
                "phases": []
            },
            usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
            token_fields={}
        )

        # Second attempt returns a valid dict
        second_good = AIStructuredResponse(
            provider="mock",
            model="mock",
            latency_ms=100.0,
            prompt_version="1.0.0",
            created_at=datetime.utcnow(),
            raw_response={},
            parsed_response={
                "roadmap_title": "Good Path",
                "target_role": "Data Scientist",
                "experience_level": "MID",
                "estimated_duration_months": 12,
                "current_readiness_score": 60,
                "phases": [
                    {
                        "phase_number": 1,
                        "title": "Python foundations",
                        "objective": "Objective 1",
                        "description": "Description 1",
                        "estimated_duration_weeks": 4,
                        "difficulty": "Beginner",
                        "skills": [],
                        "projects": [],
                        "certifications": [],
                        "resources": [],
                        "completion_criteria": [],
                        "career_outcome": "Proficiency"
                    }
                ]
            },
            usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
            token_fields={}
        )

        mock_ai_service.execute = AsyncMock(side_effect=[first_bad, second_good])

        roadmap = CareerRoadmap(
            id=uuid.uuid4(),
            target_role="Data Scientist",
            experience_level="MID",
            estimated_duration_months=12
        )
        context = RoadmapContext()

        # Run generator - should succeed on the second attempt
        import asyncio
        res = asyncio.run(roadmap_ai.generate_roadmap(roadmap, context))
        self.assertEqual(res["parsed_response"]["roadmap_title"], "Good Path")
        self.assertEqual(mock_ai_service.execute.call_count, 2)

    def test_04_api_generate_by_id(self):
        """Test the POST /api/v1/ai/roadmap/{id}/generate endpoint directly."""
        mock_response = {
            "parsed_response": {
                "roadmap_title": "DevOps Engineer Path",
                "target_role": "DevOps Engineer",
                "experience_level": "ENTRY",
                "estimated_duration_months": 6,
                "current_readiness_score": 55,
                "phases": [
                    {
                        "phase_number": 1,
                        "title": "Linux & Bash",
                        "objective": "Objective 1",
                        "description": "Description 1",
                        "estimated_duration_weeks": 4,
                        "difficulty": "Beginner",
                        "skills": ["Linux", "Bash"],
                        "projects": [],
                        "certifications": [],
                        "resources": [],
                        "completion_criteria": ["Finish script"],
                        "career_outcome": "Outcome"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 180,
            "prompt_version": "1.0.0"
        }

        # 1. Create a pending roadmap shell using standard endpoint
        payload = {
            "target_role": "DevOps Engineer",
            "current_role": "IT Support",
            "experience_level": "entry",
            "target_industry": "Tech",
            "estimated_duration_months": 6
        }
        create_resp = self.client.post("/api/v1/ai/roadmap/roadmaps", json=payload, cookies=self.cookies)
        self.assertEqual(create_resp.status_code, 201)
        roadmap_id = create_resp.json()["id"]

        # 2. Trigger AI generation for that specific ID
        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_roadmap", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = mock_response

            gen_resp = self.client.post(f"/api/v1/ai/roadmap/{roadmap_id}/generate", cookies=self.cookies)
            self.assertEqual(gen_resp.status_code, 200)
            data = gen_resp.json()
            self.assertEqual(data["roadmap_status"], "COMPLETED")
            self.assertEqual(len(data["milestones"]), 1)
            self.assertEqual(data["milestones"][0]["title"], "Linux & Bash")
