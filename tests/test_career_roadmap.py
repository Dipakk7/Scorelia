import os
import sys
import uuid
import unittest
from datetime import datetime, timezone
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider, RoadmapStatus, ExperienceLevel, LearningPriority, MilestoneStatus
from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.career_roadmap.schemas.schemas import (
    RoadmapCreate,
    RoadmapResponse,
    RoadmapHistory
)
from app.career_roadmap.crud.crud import RoadmapCRUD
from app.career_roadmap.services.service import RoadmapService
from app.career_roadmap.services.context import RoadmapContext
from app.interview.models.interview import InterviewSession

class TestAICareerRoadmapFoundation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["roadmap_test@scorelia.com", "roadmap_test_other@scorelia.com"]:
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

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="roadmap_test@scorelia.com",
                password="SecurePassword@2026",
                full_name="Roadmap User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create secondary test user
            other_user_in = UserCreate(
                email="roadmap_test_other@scorelia.com",
                password="SecurePassword@2026",
                full_name="Other Roadmap User"
            )
            cls.other_user = auth_service.register_user(db, user_create=other_user_in)
            cls.other_user_id = cls.other_user.id

            # Create a mock parsed resume for primary user
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
                ats_score=80,
                parsed_data={
                    "parser_version": "v2",
                    "parsed_at": "2026-07-03T15:00:00Z",
                    "model": "en_core_web_sm",
                    "statistics": {
                        "text_length": 500,
                        "page_count": 1,
                        "skills_found": 3,
                        "education_found": 0,
                        "experience_found": 0,
                        "projects_found": 0,
                        "certifications_found": 0,
                        "links_found": 1,
                        "processing_time_ms": 100,
                        "empty_sections": 0
                    },
                    "data": {
                        "name": {"value": "Roadmap User", "confidence": 1.0},
                        "email": {"value": "roadmap_test@scorelia.com", "confidence": 1.0},
                        "phone": {"value": "1234567890", "confidence": 1.0},
                        "links": {"value": ["https://github.com/roadmapdev"], "confidence": 1.0},
                        "skills": {"value": ["Python", "FastAPI", "SQLAlchemy"], "confidence": 1.0},
                        "education": {"value": [], "confidence": 1.0},
                        "experience": {"value": [], "confidence": 1.0},
                        "projects": {"value": [], "confidence": 1.0},
                        "certifications": {"value": [], "confidence": 1.0}
                    }
                }
            )
            db.add(cls.resume)
            db.commit()
            db.refresh(cls.resume)
            cls.resume_id = cls.resume.id

            # Set up client and authenticate
            from app.core import security
            cls.client = TestClient(app)
            cls.token = security.create_access_token(data={
                "sub": cls.user.email,
                "user_id": str(cls.user.id),
                "provider": cls.user.auth_provider
            })
            cls.cookies = {"access_token": cls.token}

            cls.other_token = security.create_access_token(data={
                "sub": cls.other_user.email,
                "user_id": str(cls.other_user.id),
                "provider": cls.other_user.auth_provider
            })
            cls.other_cookies = {"access_token": cls.other_token}
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
            db.delete(cls.other_user)
            db.commit()
        except Exception:
            db.rollback()
        db.close()

    def test_01_schema_validation(self):
        """Test schemas input validations and validators."""
        # Test valid creation request
        valid_req = RoadmapCreate(
            resume_id=self.resume_id,
            target_role="Senior Backend Developer",
            current_role="Junior Developer",
            experience_level="ENTRY",
            target_industry="Tech",
            estimated_duration_months=12
        )
        self.assertEqual(valid_req.experience_level, "ENTRY")

        # Test lowercase experience level auto-conversion to uppercase
        mixed_req = RoadmapCreate(
            target_role="Senior Backend Developer",
            experience_level="mid",
        )
        self.assertEqual(mixed_req.experience_level, "MID")

        # Test invalid experience level rejection
        with self.assertRaises(ValueError):
            RoadmapCreate(
                target_role="Role",
                experience_level="EXPERT"
            )

        # Test invalid target role rejection
        with self.assertRaises(ValueError):
            RoadmapCreate(
                target_role="  ",
                experience_level="MID"
            )

    def test_02_database_crud(self):
        """Test direct database operations in RoadmapCRUD."""
        schema = RoadmapCreate(
            resume_id=self.resume_id,
            target_role="Lead Software Engineer",
            current_role="Senior Engineer",
            experience_level="SENIOR",
            target_industry="Finance",
            estimated_duration_months=24,
            roadmap_metadata={"source": "test"}
        )
        # Create
        roadmap = RoadmapCRUD.create_roadmap(
            db=self.db,
            user_id=self.user_id,
            schema=schema,
            status=RoadmapStatus.IN_PROGRESS.value,
            estimated_duration_months=24,
            current_readiness_score=60
        )
        self.assertIsNotNone(roadmap.id)
        self.assertEqual(roadmap.target_role, "Lead Software Engineer")
        self.assertEqual(roadmap.roadmap_status, "IN_PROGRESS")
        self.assertEqual(roadmap.roadmap_metadata, {"source": "test"})

        # Get
        fetched = RoadmapCRUD.get_roadmap(self.db, roadmap.id, self.user_id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.id, roadmap.id)

        # List
        history = RoadmapCRUD.list_roadmaps(self.db, self.user_id)
        self.assertTrue(len(history) >= 1)
        self.assertEqual(history[0].id, roadmap.id)

        # Create Milestone
        milestone = RoadmapCRUD.create_milestone(
            db=self.db,
            roadmap_id=roadmap.id,
            phase_number=1,
            title="Learn Kubernetes",
            description="Complete CKAD certification",
            duration="3 months",
            order_index=1,
            status=MilestoneStatus.NOT_STARTED.value
        )
        self.assertEqual(milestone.title, "Learn Kubernetes")
        self.assertEqual(milestone.roadmap_id, roadmap.id)

        # Create Recommendation
        recommendation = RoadmapCRUD.create_learning_recommendation(
            db=self.db,
            roadmap_id=roadmap.id,
            category="Course",
            title="Kubernetes Mastery on Udemy",
            description="Highly recommended CKAD prep course",
            priority=LearningPriority.HIGH.value,
            resource_url="https://udemy.com/ckad",
            estimated_hours=40
        )
        self.assertEqual(recommendation.title, "Kubernetes Mastery on Udemy")

        # Verify cascades on delete
        RoadmapCRUD.delete_roadmap(self.db, fetched)
        # Ensure roadmap and milestones are deleted
        deleted_roadmap = self.db.query(CareerRoadmap).filter(CareerRoadmap.id == roadmap.id).first()
        self.assertIsNone(deleted_roadmap)
        deleted_milestone = self.db.query(RoadmapMilestone).filter(RoadmapMilestone.id == milestone.id).first()
        self.assertIsNone(deleted_milestone)
        deleted_recommendation = self.db.query(LearningRecommendation).filter(LearningRecommendation.id == recommendation.id).first()
        self.assertIsNone(deleted_recommendation)

    async def _run_context_builder_test(self):
        """Test build context method returns aggregated context, mock github calls."""
        with patch("app.analytics.service.analytics_service.get_github_repository_insights") as mock_git:
            mock_git.return_value = ({"profile": {"login": "roadmapdev"}, "score_breakdown": {}}, False)
            
            context = await RoadmapContext.build(self.db, self.user_id, self.resume_id, "Software Engineer")
            self.assertIsNotNone(context.resume)
            self.assertEqual(context.ats_score, 80)  # Calculated/Stored or default
            self.assertIsNotNone(context.github_insights)
            self.assertEqual(context.github_insights["profile"]["login"], "roadmapdev")

    def test_04_api_endpoints(self):
        """Test API paths, router, authorization, delete cascades, and 501 stubs."""
        # 1. Create Roadmap
        payload = {
            "resume_id": str(self.resume_id),
            "target_role": "AI Specialist",
            "current_role": "Data Scientist",
            "experience_level": "mid",
            "target_industry": "Healthcare",
            "estimated_duration_months": 18
        }
        response = self.client.post("/api/v1/ai/roadmap/roadmaps", json=payload, cookies=self.cookies)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("id", data)
        self.assertEqual(data["target_role"], "AI Specialist")
        self.assertEqual(data["experience_level"], "MID")
        self.assertEqual(data["roadmap_status"], "PENDING")
        roadmap_id = data["id"]

        # 2. Unauthorized get
        response = self.client.get(f"/api/v1/ai/roadmap/roadmaps/{roadmap_id}")
        self.assertEqual(response.status_code, 401)

        # 3. Cross-user get isolation (Forbidden or Not Found)
        response = self.client.get(f"/api/v1/ai/roadmap/roadmaps/{roadmap_id}", cookies=self.other_cookies)
        self.assertEqual(response.status_code, 404)

        # 4. Get detailed roadmap
        response = self.client.get(f"/api/v1/ai/roadmap/roadmaps/{roadmap_id}", cookies=self.cookies)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["id"], roadmap_id)

        # 5. List roadmaps
        response = self.client.get("/api/v1/ai/roadmap/roadmaps", cookies=self.cookies)
        self.assertEqual(response.status_code, 200)
        history_data = response.json()
        self.assertTrue(history_data["total"] >= 1)
        self.assertEqual(history_data["roadmaps"][0]["id"], roadmap_id)

        # 6. Delete roadmap
        response = self.client.delete(f"/api/v1/ai/roadmap/roadmaps/{roadmap_id}", cookies=self.cookies)
        self.assertEqual(response.status_code, 200)

        # Confirm it's gone
        response = self.client.get(f"/api/v1/ai/roadmap/roadmaps/{roadmap_id}", cookies=self.cookies)
        self.assertEqual(response.status_code, 404)

        # 7. Test AI endpoints generate with mock
        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_roadmap", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = {
                "parsed_response": {
                    "roadmap_title": "Mock Title",
                    "target_role": "AI Specialist",
                    "experience_level": "MID",
                    "estimated_duration_months": 18,
                    "current_readiness_score": 60,
                    "phases": [
                        {
                            "phase_number": 1,
                            "title": "Phase 1",
                            "objective": "Objective 1",
                            "description": "Description 1",
                            "estimated_duration_weeks": 4,
                            "difficulty": "Beginner",
                            "skills": ["Python"],
                            "projects": ["REST API"],
                            "certifications": ["Cert"],
                            "resources": ["Doc"],
                            "completion_criteria": ["Done"],
                            "career_outcome": "Outcome"
                        }
                    ]
                },
                "provider": "mock",
                "model": "mock",
                "latency_ms": 150,
                "prompt_version": "1.0.0"
            }
            
            gen_payload = {
                "resume_id": str(self.resume_id),
                "target_role": "AI Specialist",
                "current_role": "Data Scientist",
                "experience_level": "mid",
                "target_industry": "Healthcare",
                "estimated_duration_months": 18
            }
            
            response = self.client.post("/api/v1/ai/roadmap/generate", json=gen_payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 201)
            gen_data = response.json()
            self.assertEqual(gen_data["roadmap_status"], "COMPLETED")
            self.assertEqual(len(gen_data["milestones"]), 1)
            self.assertEqual(len(gen_data["recommendations"]), 4)
            
            # Clean up the generated roadmap
            response = self.client.delete(f"/api/v1/ai/roadmap/{gen_data['id']}", cookies=self.cookies)
            self.assertEqual(response.status_code, 200)

        # 8. Future AI endpoints regenerate (501)
        response = self.client.post("/api/v1/ai/roadmap/regenerate", cookies=self.cookies)
        self.assertEqual(response.status_code, 501)

    def test_05_async_context_runner(self):
        """Helper to run the async test_03_context_builder synchronously."""
        import asyncio
        asyncio.run(self._run_context_builder_test())
