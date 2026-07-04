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
from app.core.enums import ResumeStatus, StorageProvider, RoadmapStatus, LearningPriority
from app.career_roadmap.models.roadmap import CareerRoadmap, LearningRecommendation
from app.career_roadmap.schemas.schemas import (
    SkillGapRequest,
    LearningPlanRequest,
    AISkillGapResponse,
    AILearningPlanResponse,
    AILearningRecommendation
)
from app.career_roadmap.services.context import RoadmapContext
from app.career_roadmap.services.ai_service import RoadmapAIService
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage

class TestCareerRoadmapRecommendations(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            email = "roadmap_recs_test@careerpilot.com"
            test_user = db.query(User).filter(User.email == email).first()
            if test_user:
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
                full_name="Recommendations User"
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

    def test_01_skill_gap_schemas(self):
        """Test validation and instantiation of Skill Gap schemas."""
        item = {
            "skill": "Python Concurrency",
            "gap_severity": "High",
            "remediation_action": "Read book on Python Asyncio"
        }
        # Validates correctly
        data = {
            "target_role": "Python Backend Engineer",
            "readiness_score": 75,
            "technical_gaps": [item]
        }
        resp = AISkillGapResponse.model_validate(data)
        self.assertEqual(resp.target_role, "Python Backend Engineer")
        self.assertEqual(len(resp.technical_gaps), 1)

    def test_02_learning_plan_schemas(self):
        """Test validation and instantiation of Learning Plan schemas."""
        rec = {
            "recommendation_id": 1,
            "title": "Master FastAPI",
            "category": "Courses",
            "priority": "High",
            "estimated_hours": 20,
            "difficulty": "Intermediate",
            "reason": "FastAPI is primary for target role",
            "learning_resources": ["http://fastapi.tiangolo.com"],
            "practice_projects": ["REST API", "Auth System"],
            "success_criteria": ["Implement OAuth2 flows"],
            "career_impact": "Will write production APIs"
        }
        plan_data = {
            "weekly_plan": [
                {
                    "week_number": 1,
                    "topic": "FastAPI Masterclass",
                    "focus": "Async requests",
                    "objectives": ["Understand async/await"],
                    "schedule": [
                        {"day": "Monday", "focus": "FastAPI Tutorial", "tasks": ["Read introductory docs"]}
                    ]
                }
            ],
            "monthly_goals": ["Build 1 project"],
            "quarterly_goals": ["Learn deployment"],
            "practice_schedule": ["Practice coding every morning"],
            "certification_suggestions": ["AWS developer certification"],
            "books": ["FastAPI in Action"],
            "courses": ["Udemy course"],
            "hands_on_projects": ["Portfolio website"],
            "open_source_contributions": [],
            "interview_practice": [],
            "recommendations": [rec]
        }
        plan = AILearningPlanResponse.model_validate(plan_data)
        self.assertEqual(len(plan.recommendations), 1)
        self.assertEqual(plan.recommendations[0].title, "Master FastAPI")

    def test_03_ai_service_skill_gap_generation(self):
        """Test RoadmapAIService generate_skill_gap retry and validation logic."""
        mock_ai = MagicMock()
        roadmap_ai = RoadmapAIService(ai_service=mock_ai)

        bad_response = AIStructuredResponse(
            provider="mock",
            model="mock",
            latency_ms=100.0,
            prompt_version="1.0.0",
            created_at=datetime.utcnow(),
            raw_response={},
            parsed_response={
                "target_role": "AI Architect",
                "readiness_score": 105, # invalid readiness score
                "technical_gaps": []
            },
            usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
            token_fields={}
        )

        good_response = AIStructuredResponse(
            provider="mock",
            model="mock",
            latency_ms=120.0,
            prompt_version="1.0.0",
            created_at=datetime.utcnow(),
            raw_response={},
            parsed_response={
                "target_role": "AI Architect",
                "readiness_score": 75,
                "technical_gaps": [
                    {
                        "skill": "LangChain",
                        "gap_severity": "High",
                        "remediation_action": "Complete deeplearning.ai courses"
                    }
                ]
            },
            usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
            token_fields={}
        )

        mock_ai.execute = AsyncMock(side_effect=[bad_response, good_response])

        roadmap = CareerRoadmap(
            id=uuid.uuid4(),
            target_role="AI Architect",
            experience_level="SENIOR",
            estimated_duration_months=12
        )
        context = RoadmapContext()

        import asyncio
        res = asyncio.run(roadmap_ai.generate_skill_gap(roadmap, context))
        self.assertEqual(res["parsed_response"]["readiness_score"], 75)
        self.assertEqual(mock_ai.execute.call_count, 2)

    def test_04_api_endpoints_success(self):
        """Test API endpoints for skill gap, learning plan, and recommendations with mock AI responses."""
        mock_skill_gap = {
            "parsed_response": {
                "target_role": "FastAPI Developer",
                "readiness_score": 65,
                "technical_gaps": [
                    {
                        "skill": "Pydantic v2",
                        "gap_severity": "Medium",
                        "remediation_action": "Learn serialization and validation changes"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 250,
            "prompt_version": "1.0.0"
        }

        mock_learning_plan = {
            "parsed_response": {
                "weekly_plan": [],
                "monthly_goals": [],
                "quarterly_goals": [],
                "practice_schedule": [],
                "certification_suggestions": [],
                "books": [],
                "courses": [],
                "hands_on_projects": [],
                "open_source_contributions": [],
                "interview_practice": [],
                "recommendations": [
                    {
                        "recommendation_id": 1,
                        "title": "Master Asyncio",
                        "category": "Courses",
                        "priority": "High",
                        "estimated_hours": 15,
                        "difficulty": "Intermediate",
                        "reason": "Important for high performance async servers",
                        "learning_resources": ["http://asyncio.org"],
                        "practice_projects": ["Chat Server"],
                        "success_criteria": ["Design a socket server"],
                        "career_impact": "Fast execution"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 250,
            "prompt_version": "1.0.0"
        }

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_skill_gap", new_callable=AsyncMock) as mock_gap_gen, \
             patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_learning_plan", new_callable=AsyncMock) as mock_plan_gen:
            
            mock_gap_gen.return_value = mock_skill_gap
            mock_plan_gen.return_value = mock_learning_plan

            # 1. Test POST /api/v1/ai/roadmap/skill-gap without roadmap_id (creates on the fly)
            payload = {
                "target_role": "FastAPI Developer",
                "experience_level": "mid",
                "resume_id": str(self.resume_id)
            }
            response = self.client.post("/api/v1/ai/roadmap/skill-gap", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["readiness_score"], 65)
            self.assertEqual(len(data["technical_gaps"]), 1)

            # Check that a career roadmap was created in DB
            roadmap_db = self.db.query(CareerRoadmap).filter(
                CareerRoadmap.user_id == self.user_id,
                CareerRoadmap.target_role == "FastAPI Developer"
            ).first()
            self.assertIsNotNone(roadmap_db)
            roadmap_id = roadmap_db.id

            # 2. Test POST /api/v1/ai/roadmap/learning-plan with roadmap_id (uses cached or runs AI)
            payload_plan = {
                "roadmap_id": str(roadmap_id)
            }
            response = self.client.post("/api/v1/ai/roadmap/learning-plan", json=payload_plan, cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            plan_data = response.json()
            self.assertEqual(len(plan_data["recommendations"]), 1)
            self.assertEqual(plan_data["recommendations"][0]["title"], "Master Asyncio")

            # Check recommendations saved to database rows
            db_recs = self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap_id).all()
            self.assertEqual(len(db_recs), 1)
            self.assertEqual(db_recs[0].title, "Master Asyncio")
            self.assertEqual(db_recs[0].priority, "High")

            # 3. Test GET /api/v1/ai/roadmap/{id}/recommendations
            response = self.client.get(f"/api/v1/ai/roadmap/{roadmap_id}/recommendations", cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            recs_data = response.json()
            self.assertEqual(len(recs_data), 1)
            self.assertEqual(recs_data[0]["title"], "Master Asyncio")
            self.assertEqual(recs_data[0]["difficulty"], "Intermediate")

            # 4. Test GET /api/v1/ai/roadmap/{id}/skill-gap
            response = self.client.get(f"/api/v1/ai/roadmap/{roadmap_id}/skill-gap", cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            gap_data = response.json()
            self.assertEqual(gap_data["readiness_score"], 65)

            # 5. Test DELETE /api/v1/ai/roadmap/{id}/recommendations
            response = self.client.delete(f"/api/v1/ai/roadmap/{roadmap_id}/recommendations", cookies=self.cookies)
            self.assertEqual(response.status_code, 200)

            # Recommendations cleared from DB
            db_recs_cleared = self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap_id).all()
            self.assertEqual(len(db_recs_cleared), 0)

            # Recommendations cleared from metadata
            self.db.refresh(roadmap_db)
            self.assertNotIn("learning_plan", roadmap_db.roadmap_metadata)

            # Cleanup
            self.db.delete(roadmap_db)
            self.db.commit()

    def test_05_caching_behavior(self):
        """Test database-level caching to prevent redundant AI calls for identical roadmap IDs."""
        roadmap = CareerRoadmap(
            user_id=self.user_id,
            target_role="Cache Developer",
            experience_level="ENTRY",
            roadmap_status=RoadmapStatus.COMPLETED.value,
            estimated_duration_months=12,
            current_readiness_score=50,
            roadmap_metadata={
                "skill_gap_analysis": {
                    "target_role": "Cache Developer",
                    "readiness_score": 80,
                    "technical_gaps": []
                },
                "learning_plan": {
                    "weekly_plan": [],
                    "recommendations": [
                        {
                            "recommendation_id": 1,
                            "title": "Cached Course",
                            "category": "Courses",
                            "priority": "Low",
                            "estimated_hours": 5,
                            "difficulty": "Beginner",
                            "reason": "Test cache",
                            "learning_resources": [],
                            "practice_projects": [],
                            "success_criteria": [],
                            "career_impact": "None"
                        }
                    ]
                }
            }
        )
        self.db.add(roadmap)
        self.db.commit()
        self.db.refresh(roadmap)

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_skill_gap", new_callable=AsyncMock) as mock_gap_gen, \
             patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_learning_plan", new_callable=AsyncMock) as mock_plan_gen:

            # Make API request to skill-gap
            payload = {"roadmap_id": str(roadmap.id)}
            response = self.client.post("/api/v1/ai/roadmap/skill-gap", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            # Verify cached result returned directly and AI NOT called
            self.assertEqual(response.json()["readiness_score"], 80)
            mock_gap_gen.assert_not_called()

            # Make API request to learning-plan
            response = self.client.post("/api/v1/ai/roadmap/learning-plan", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            # Verify cached plan returned directly and AI NOT called
            self.assertEqual(response.json()["recommendations"][0]["title"], "Cached Course")
            mock_plan_gen.assert_not_called()

        self.db.delete(roadmap)
        self.db.commit()
