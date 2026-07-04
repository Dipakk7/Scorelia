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
from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.career_roadmap.schemas.schemas import TimelineRequest, AITimelineResponse, AIMilestone
from app.core.enums import RoadmapStatus, MilestoneStatus

class TestCareerTimelinePlanner(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test user, database connection, and authenticated client."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            email = "timeline_test@careerpilot.com"
            test_user = db.query(User).filter(User.email == email).first()
            if test_user:
                # Cleanup related roadmaps
                roadmaps = db.query(CareerRoadmap).filter(CareerRoadmap.user_id == test_user.id).all()
                for r in roadmaps:
                    db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == r.id).delete()
                    db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == r.id).delete()
                    db.delete(r)
                db.delete(test_user)
            db.commit()

            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email=email,
                password="SecurePassword@2026",
                full_name="Timeline User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create a Completed Roadmap
            cls.roadmap = CareerRoadmap(
                user_id=cls.user_id,
                target_role="AI Engineer",
                current_role="Software Engineer",
                experience_level="ENTRY",
                target_industry="Tech",
                roadmap_status=RoadmapStatus.COMPLETED.value,
                estimated_duration_months=12,
                current_readiness_score=70,
                provider="mock_provider",
                model="mock_model",
                prompt_version="1.0.0",
                roadmap_metadata={}
            )
            db.add(cls.roadmap)
            db.commit()
            db.refresh(cls.roadmap)
            cls.roadmap_id = cls.roadmap.id

            # Create a milestone for the Completed Roadmap
            cls.milestone = RoadmapMilestone(
                roadmap_id=cls.roadmap_id,
                phase_number=1,
                title="Phase 1: Foundations",
                description="Objective: Learn basic tools",
                duration="4 weeks",
                order_index=1,
                status=MilestoneStatus.NOT_STARTED.value
            )
            db.add(cls.milestone)
            db.commit()

            # Create an Empty/Incomplete Roadmap (Pending)
            cls.pending_roadmap = CareerRoadmap(
                user_id=cls.user_id,
                target_role="Data Scientist",
                current_role="Intern",
                experience_level="ENTRY",
                target_industry="Tech",
                roadmap_status=RoadmapStatus.PENDING.value,
                estimated_duration_months=12,
                current_readiness_score=50,
                roadmap_metadata={}
            )
            db.add(cls.pending_roadmap)
            db.commit()
            db.refresh(cls.pending_roadmap)
            cls.pending_roadmap_id = cls.pending_roadmap.id

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
            db.delete(cls.user)
            db.commit()
        except Exception:
            db.rollback()
        db.close()

    def setUp(self):
        # Reset roadmap metadata
        self.roadmap.roadmap_metadata = {}
        self.db.commit()

    # --- Schema Validation Tests ---

    def test_01_schema_timeline_request_validation(self):
        """Test TimelineRequest validation parameters."""
        # Valid duration
        req = TimelineRequest(roadmap_id=self.roadmap_id, estimated_duration_months=3)
        self.assertEqual(req.estimated_duration_months, 3)

        # Invalid duration
        with self.assertRaises(ValueError):
            TimelineRequest(roadmap_id=self.roadmap_id, estimated_duration_months=5)

        # Empty target role
        with self.assertRaises(ValueError):
            TimelineRequest(roadmap_id=self.roadmap_id, target_role=" ")

    def test_02_schema_milestone_validation(self):
        """Test AIMilestone validation parameters."""
        # Valid status
        m = AIMilestone(
            id="m1",
            title="Milestone 1",
            start_week=1,
            end_week=4,
            estimated_hours=40,
            expected_outcome="Code Base",
            completion_status="IN_PROGRESS"
        )
        self.assertEqual(m.completion_status, "IN_PROGRESS")

        # Case insensitive status normalization
        m_lower = AIMilestone(
            id="m2",
            title="Milestone 2",
            start_week=1,
            end_week=4,
            estimated_hours=40,
            expected_outcome="Code Base",
            completion_status="completed"
        )
        self.assertEqual(m_lower.completion_status, "COMPLETED")

        # Invalid status
        with self.assertRaises(ValueError):
            AIMilestone(
                id="m3",
                title="Milestone 3",
                start_week=1,
                end_week=4,
                estimated_hours=40,
                expected_outcome="Code Base",
                completion_status="invalid_status"
            )

    # --- API & Integration Tests ---

    def test_03_generate_timeline_success(self):
        """Test successful timeline generation & database persistence."""
        mock_response = {
            "parsed_response": {
                "weekly_goals": [
                    {"week_number": 1, "goal": "Python Basics", "tasks": ["Syntax", "Functions"]}
                ],
                "monthly_milestones": [
                    {"month_number": 1, "milestone": "Python Competency"}
                ],
                "quarterly_objectives": [
                    {"quarter_number": 1, "objective": "OOP understanding"}
                ],
                "estimated_completion_date": "Within 3 months",
                "time_estimates": "12 hours/week",
                "dependencies": ["Computer science basics"],
                "priority_ordering": ["Priority 1: Core syntax"],
                "milestones": [
                    {
                        "id": "m1",
                        "title": "Core Foundations",
                        "description": "Learn syntax",
                        "start_week": 1,
                        "end_week": 4,
                        "estimated_hours": 30,
                        "prerequisite_skills": ["None"],
                        "expected_outcome": "Small CLI tool",
                        "completion_status": "NOT_STARTED"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 250,
            "prompt_version": "1.0.0"
        }

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_timeline", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = mock_response

            payload = {
                "roadmap_id": str(self.roadmap_id),
                "estimated_duration_months": 12
            }

            response = self.client.post("/api/v1/ai/roadmap/timeline", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 201)
            data = response.json()
            self.assertEqual(data["estimated_completion_date"], "Within 3 months")
            self.assertEqual(data["time_estimates"], "12 hours/week")
            self.assertEqual(len(data["milestones"]), 1)
            self.assertEqual(data["milestones"][0]["title"], "Core Foundations")

            # Check database cache/metadata storage
            self.db.refresh(self.roadmap)
            metadata = self.roadmap.roadmap_metadata
            self.assertIn("timeline", metadata)
            self.assertEqual(metadata["timeline"]["time_estimates"], "12 hours/week")
            self.assertIn("timeline_metadata", metadata)
            self.assertEqual(metadata["timeline_metadata"]["provider"], "mock_provider")

    def test_04_identical_request_caching(self):
        """Test that subsequent requests retrieve timeline from DB cache, avoiding LLM calls."""
        # Inject cached timeline into roadmap metadata
        self.roadmap.roadmap_metadata = {
            "timeline": {
                "roadmap_id": str(self.roadmap_id),
                "weekly_goals": [],
                "monthly_milestones": [],
                "quarterly_objectives": [],
                "estimated_completion_date": "Cached Date",
                "time_estimates": "Cached Time",
                "dependencies": [],
                "priority_ordering": [],
                "milestones": []
            }
        }
        self.db.commit()

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_timeline", new_callable=AsyncMock) as mock_gen:
            payload = {
                "roadmap_id": str(self.roadmap_id)
            }

            response = self.client.post("/api/v1/ai/roadmap/timeline", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 201)
            data = response.json()
            self.assertEqual(data["estimated_completion_date"], "Cached Date")
            # Verify AIService was NEVER called since it served from cache
            mock_gen.assert_not_called()

    def test_05_generate_timeline_by_id_success(self):
        """Test POST /api/v1/ai/roadmap/{id}/timeline bypasses caching and generates fresh timeline."""
        # Inject cached timeline
        self.roadmap.roadmap_metadata = {
            "timeline": {
                "roadmap_id": str(self.roadmap_id),
                "weekly_goals": [],
                "monthly_milestones": [],
                "quarterly_objectives": [],
                "estimated_completion_date": "Cached Date",
                "time_estimates": "Cached Time",
                "dependencies": [],
                "priority_ordering": [],
                "milestones": []
            }
        }
        self.db.commit()

        mock_response = {
            "parsed_response": {
                "weekly_goals": [],
                "monthly_milestones": [],
                "quarterly_objectives": [],
                "estimated_completion_date": "Fresh Date",
                "time_estimates": "Fresh Time",
                "dependencies": [],
                "priority_ordering": [],
                "milestones": [
                    {
                        "id": "m1",
                        "title": "Fresh Milestone",
                        "description": "",
                        "start_week": 1,
                        "end_week": 2,
                        "estimated_hours": 10,
                        "prerequisite_skills": [],
                        "expected_outcome": "Outcome",
                        "completion_status": "NOT_STARTED"
                    }
                ]
            },
            "provider": "mock_provider",
            "model": "mock_model",
            "latency_ms": 150,
            "prompt_version": "1.0.0"
        }

        with patch("app.career_roadmap.services.ai_service.RoadmapAIService.generate_timeline", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = mock_response

            response = self.client.post(f"/api/v1/ai/roadmap/{self.roadmap_id}/timeline", cookies=self.cookies)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["estimated_completion_date"], "Fresh Date")
            # Verify AIService was called despite the existing cache
            mock_gen.assert_called_once()

    def test_06_get_and_delete_timeline(self):
        """Test GET and DELETE endpoints for roadmap timeline."""
        # Setup cached timeline
        self.roadmap.roadmap_metadata = {
            "timeline": {
                "roadmap_id": str(self.roadmap_id),
                "weekly_goals": [],
                "monthly_milestones": [],
                "quarterly_objectives": [],
                "estimated_completion_date": "Get Date",
                "time_estimates": "Get Time",
                "dependencies": [],
                "priority_ordering": [],
                "milestones": []
            }
        }
        self.db.commit()

        # Test GET Success
        get_response = self.client.get(f"/api/v1/ai/roadmap/{self.roadmap_id}/timeline", cookies=self.cookies)
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json()["estimated_completion_date"], "Get Date")

        # Test DELETE Success
        del_response = self.client.delete(f"/api/v1/ai/roadmap/{self.roadmap_id}/timeline", cookies=self.cookies)
        self.assertEqual(del_response.status_code, 200)
        self.assertTrue(del_response.json()["success"])

        # Test GET 404 (after deletion)
        get_response_2 = self.client.get(f"/api/v1/ai/roadmap/{self.roadmap_id}/timeline", cookies=self.cookies)
        self.assertEqual(get_response_2.status_code, 404)

    # --- Validation Error Handling & Rejection Tests ---

    def test_07_reject_invalid_roadmap_ids(self):
        """Test endpoints reject non-existent or invalid roadmap IDs."""
        non_existent_uuid = str(uuid.uuid4())
        
        # Test generate timeline on non-existent roadmap
        payload = {"roadmap_id": non_existent_uuid}
        response = self.client.post("/api/v1/ai/roadmap/timeline", json=payload, cookies=self.cookies)
        self.assertEqual(response.status_code, 404)

        # Test GET on non-existent roadmap
        response_get = self.client.get(f"/api/v1/ai/roadmap/{non_existent_uuid}/timeline", cookies=self.cookies)
        self.assertEqual(response_get.status_code, 404)

    def test_08_reject_empty_or_incomplete_roadmaps(self):
        """Test timeline generation is rejected for empty/incomplete roadmap shells."""
        # Use our pending roadmap (which has status PENDING and no milestones)
        payload = {"roadmap_id": str(self.pending_roadmap_id)}
        response = self.client.post("/api/v1/ai/roadmap/timeline", json=payload, cookies=self.cookies)
        self.assertEqual(response.status_code, 400)
        self.assertIn("empty or incomplete", response.json()["message"].lower())

    def test_09_reject_invalid_duration(self):
        """Test endpoints reject invalid roadmap duration specifications."""
        payload = {
            "roadmap_id": str(self.roadmap_id),
            "estimated_duration_months": 5  # Only 3, 6, 12, 18, 24 are supported
        }
        response = self.client.post("/api/v1/ai/roadmap/timeline", json=payload, cookies=self.cookies)
        # Returns 422 because of Pydantic validation on TimelineRequest
        self.assertEqual(response.status_code, 422)

    # --- Mock AI Execution & Retry / Privacy Log Tests ---

    def test_10_ai_retry_once_on_malformed_json(self):
        """Test timeline engine retries once on malformed JSON or validation error and recovers."""
        from app.career_roadmap.services.ai_service import RoadmapAIService
        from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage
        
        # We mock execute to fail once with ResponseParsingError and then succeed
        mock_response = MagicMock(spec=AIStructuredResponse)
        mock_response.provider = "mock_provider"
        mock_response.model = "mock_model"
        mock_response.latency_ms = 180
        mock_response.prompt_version = "1.0.0"
        mock_response.parsed_response = {
            "weekly_goals": [],
            "monthly_milestones": [],
            "quarterly_objectives": [],
            "estimated_completion_date": "Success Date",
            "time_estimates": "Success Time",
            "dependencies": [],
            "priority_ordering": [],
            "milestones": [
                {
                    "id": "m1",
                    "title": "Success Milestone",
                    "description": "",
                    "start_week": 1,
                    "end_week": 2,
                    "estimated_hours": 10,
                    "prerequisite_skills": [],
                    "expected_outcome": "Outcome",
                    "completion_status": "NOT_STARTED"
                }
            ]
        }
        
        from app.ai.exceptions import ResponseParsingError
        
        # side_effect: raises error on first call, returns mock_response on second
        side_effects = [
            ResponseParsingError("Malformed JSON block"),
            mock_response
        ]

        from app.ai.services.ai_service import AIService
        with patch.object(AIService, "execute", side_effect=side_effects) as mock_execute:
            from app.career_roadmap.dependencies import get_roadmap_ai_service
            roadmap_ai_svc = get_roadmap_ai_service()
            
            from app.career_roadmap.services.context import RoadmapContext
            context = RoadmapContext(resume=None, github_insights=None, interview_analytics=None)
            
            # This should call execute twice due to retry once policy
            res = asyncio_run(roadmap_ai_svc.generate_timeline(self.roadmap, context))
            
            self.assertEqual(mock_execute.call_count, 2)
            self.assertEqual(res["parsed_response"]["estimated_completion_date"], "Success Date")

    def test_11_privacy_logging_rules(self):
        """Verify logging strictly adheres to privacy constraints: no personal data, only metadata."""
        # Check that we do not log resumes, prompt bodies, or target outputs.
        # We check logs generated during generation (mocking logger info).
        with patch("app.career_roadmap.services.service.logger.info") as mock_log:
            # Inject cached timeline
            self.roadmap.roadmap_metadata = {
                "timeline": {
                    "roadmap_id": str(self.roadmap_id),
                    "weekly_goals": [],
                    "monthly_milestones": [],
                    "quarterly_objectives": [],
                    "estimated_completion_date": "Log Date",
                    "time_estimates": "Log Time",
                    "dependencies": [],
                    "priority_ordering": [],
                    "milestones": []
                }
            }
            self.db.commit()

            payload = {"roadmap_id": str(self.roadmap_id)}
            response = self.client.post("/api/v1/ai/roadmap/timeline", json=payload, cookies=self.cookies)
            self.assertEqual(response.status_code, 201)

            # Ensure logger.info was called with metadata fields but NOT with the timeline data
            for call in mock_log.call_args_list:
                args, kwargs = call
                # Must not contain private details:
                log_text = str(kwargs)
                self.assertNotIn("weekly_goals", log_text)
                self.assertNotIn("monthly_milestones", log_text)
                self.assertNotIn("milestones", log_text)

# Helper to run async methods synchronously in test environment
def asyncio_run(coro):
    import asyncio
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)
