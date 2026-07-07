import os
import sys
import uuid
import unittest
from datetime import datetime, timezone, timedelta
from unittest.mock import patch

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.schemas import InterviewSessionCreate, AnswerSubmitRequest
from app.interview.services.manager import InterviewSessionManager
from app.interview.dependencies import get_interview_session_manager
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage

class TestAIInterviewSessionEngine(unittest.IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated client."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["engine_test@scorelia.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                        db.query(InterviewSession.id).filter(InterviewSession.user_id == test_user.id)
                    )).delete(synchronize_session=False)
                    db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="engine_test@scorelia.com",
                password="SecurePassword@2026",
                full_name="Engine User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create a mock parsed resume
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="engine_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/engine_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "skills": ["Python", "FastAPI", "PostgreSQL"],
                    "experience": [{"title": "Software Engineer", "company": "Tech Inc"}]
                }
            )
            db.add(cls.resume)
            db.commit()
            db.refresh(cls.resume)
            cls.resume_id = cls.resume.id
        finally:
            db.close()

        # Login client
        cls.client = TestClient(app)
        login_payload = {
            "email": "engine_test@scorelia.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"
        token = login_response.json().get("access_token")
        cls.headers = {"Authorization": f"Bearer {token}"} if token else {}

        # Mock JSON response helper for questions
        cls.mock_gen_questions_dict = {
            "questions": [{
                "question_id": 1,
                "category": "TECHNICAL",
                "difficulty": "MEDIUM",
                "question": "What is dependency injection in FastAPI?",
                "expected_topics": ["FastAPI", "Dependency Injection"],
                "recommended_answer_framework": "PREP",
                "estimated_time_seconds": 120,
                "evaluation_weight": 8,
                "followup_possible": True
            }]
        }

        # Mock JSON response helper for evaluation
        cls.mock_eval_dict = {
            "overall_score": 88,
            "technical_score": 85,
            "communication_score": 90,
            "grammar_score": 95,
            "confidence_score": 85,
            "professionalism_score": 90,
            "star_score": 0,
            "strengths": ["Structured answer", "Good terminology"],
            "weaknesses": ["None"],
            "missing_topics": [],
            "improvements": ["Explain scope of dependencies"],
            "followup_questions": ["How do you override dependencies in tests?"],
            "summary": "Excellent explanation.",
            "rubric_scores": {},
            "star_analysis": {},
            "quality_analysis": {},
            "followup_metadata": {"should_followup": True}
        }

    def tearDown(self):
        """Cleanup session data after each test."""
        db = SessionLocal()
        try:
            db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                db.query(InterviewSession.id).filter(InterviewSession.user_id == self.user_id)
            )).delete(synchronize_session=False)
            db.query(InterviewSession).filter(InterviewSession.user_id == self.user_id).delete()
            db.commit()
        finally:
            db.close()

    def _get_mock_response(self, parsed_data) -> AIStructuredResponse:
        return AIStructuredResponse(
            provider="mock-provider",
            model="mock-model",
            latency_ms=150.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=parsed_data,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=20, total_tokens=30),
            token_fields={}
        )

    @patch("app.ai.services.ai_service.AIService.execute")
    async def test_session_lifecycle_and_state_machine(self, mock_execute):
        """Verify the state machine transition validations."""
        mock_execute.return_value = self._get_mock_response(self.mock_gen_questions_dict)

        db = SessionLocal()
        manager = get_interview_session_manager(db=db)

        # Create session in CREATED state
        session_create = InterviewSessionCreate(
            resume_id=self.resume_id,
            interview_type="MIXED",
            difficulty="MEDIUM",
            total_questions=3
        )
        session = await manager.service.create_session(user_id=self.user_id, request=session_create)
        self.assertEqual(session.status, "PENDING")  # PENDING acts as CREATED in manager

        # Start interview (CREATED -> READY -> QUESTION_GENERATED -> WAITING_FOR_ANSWER)
        session = await manager.start_interview(session.id, self.user_id)
        self.assertEqual(session.status, "WAITING_FOR_ANSWER")

        # Invalid: Triggering start again should be rejected
        with self.assertRaises(Exception):
            await manager.start_interview(session.id, self.user_id)

        # Invalid: Next question before answer is rejected
        with self.assertRaises(Exception):
            await manager.get_next_question(session.id, self.user_id)

        # Submit answer (WAITING_FOR_ANSWER -> ANSWER_RECEIVED -> EVALUATED)
        mock_execute.return_value = self._get_mock_response(self.mock_eval_dict)
        eval_res = await manager.submit_answer(session.id, self.user_id, "FastAPI depends is a dependency injector.")
        self.assertEqual(eval_res.overall_score, 88)
        self.assertEqual(session.status, "EVALUATED")

        # Invalid: Submit answer again should be rejected
        with self.assertRaises(Exception):
            await manager.submit_answer(session.id, self.user_id, "Duplicate answer.")

        # Pause and Resume
        session = await manager.pause_interview(session.id, self.user_id)
        self.assertTrue(session.session_metadata["is_paused"])
        
        session = await manager.resume_interview(session.id, self.user_id)
        self.assertFalse(session.session_metadata["is_paused"])

        # Force Cancel
        session = await manager.cancel_interview(session.id, self.user_id)
        self.assertEqual(session.status, "CANCELLED")

        # Restart (CANCELLED -> CREATED)
        session = await manager.restart_interview(session.id, self.user_id)
        self.assertEqual(session.status, "CREATED")
        self.assertEqual(session.current_question, 1)
        self.assertEqual(len(session.turns), 0)

    @patch("app.ai.services.ai_service.AIService.execute")
    async def test_adaptive_difficulty(self, mock_execute):
        """Verify difficulty changes correctly on thresholds >= 85 and <= 55."""
        db = SessionLocal()
        manager = get_interview_session_manager(db=db)

        session_create = InterviewSessionCreate(
            resume_id=self.resume_id,
            interview_type="TECHNICAL",
            difficulty="ADAPTIVE",
            total_questions=3
        )
        session = await manager.service.create_session(user_id=self.user_id, request=session_create)

        # Turn 1
        mock_execute.return_value = self._get_mock_response(self.mock_gen_questions_dict)
        session = await manager.start_interview(session.id, self.user_id)
        self.assertEqual(session.session_metadata["questions"][0]["difficulty"], "MEDIUM")

        # Submit high score (>= 85) -> increase difficulty (MEDIUM -> HARD)
        eval_high = dict(self.mock_eval_dict, overall_score=90)
        mock_execute.return_value = self._get_mock_response(eval_high)
        await manager.submit_answer(session.id, self.user_id, "High score answer.")

        # Generate next question
        mock_execute.return_value = self._get_mock_response({
            "questions": [{
                "question_id": 2,
                "category": "TECHNICAL",
                "difficulty": "HARD",
                "question": "Explain system architecture?",
                "expected_topics": [],
                "recommended_answer_framework": "STAR",
                "estimated_time_seconds": 120,
                "evaluation_weight": 8,
                "followup_possible": True
            }]
        })
        next_turn = await manager.get_next_question(session.id, self.user_id)
        # Note: since followup is triggered by should_followup=True in mock_eval_dict,
        # it generates a follow-up. Let's inspect the next question difficulty in metadata.
        self.assertEqual(session.session_metadata["questions"][1]["difficulty"], "HARD") # follow-up difficulty defaults to ADAPTIVE or parent's.
        
        # Submit low score (<= 55) -> decrease difficulty
        eval_low = dict(self.mock_eval_dict, overall_score=45, followup_metadata={"should_followup": False})
        mock_execute.return_value = self._get_mock_response(eval_low)
        await manager.submit_answer(session.id, self.user_id, "Low score answer.")

        # Next question
        mock_execute.return_value = self._get_mock_response({
            "questions": [{
                "question_id": 3,
                "category": "TECHNICAL",
                "difficulty": "MEDIUM",
                "question": "Explain medium difficulty topic?",
                "expected_topics": [],
                "recommended_answer_framework": "STAR",
                "estimated_time_seconds": 120,
                "evaluation_weight": 8,
                "followup_possible": True
            }]
        })
        
        # Determine resolved adaptive difficulty
        resolved_diff = manager.service.interview_ai_service._resolve_adaptive_difficulty(session)
        # Low score from HARD difficulty reduces it to MEDIUM
        self.assertEqual(resolved_diff, "MEDIUM")

    @patch("app.ai.services.ai_service.AIService.execute")
    async def test_session_timer_and_progress(self, mock_execute):
        """Verify timings, duration calculation, and progress statistics."""
        db = SessionLocal()
        manager = get_interview_session_manager(db=db)

        session_create = InterviewSessionCreate(
            resume_id=self.resume_id,
            interview_type="MIXED",
            difficulty="MEDIUM",
            total_questions=3
        )
        session = await manager.service.create_session(user_id=self.user_id, request=session_create)

        # Start
        mock_execute.return_value = self._get_mock_response(self.mock_gen_questions_dict)
        session = await manager.start_interview(session.id, self.user_id)

        # Check status and progress
        status_res = await manager.get_status(session.id, self.user_id)
        self.assertIsNotNone(status_res["start_time"])
        self.assertFalse(status_res["is_paused"])

        progress_res = await manager.get_progress(session.id, self.user_id)
        self.assertEqual(progress_res["completion_percentage"], 0)
        self.assertEqual(progress_res["current_question"], 1)
        self.assertEqual(progress_res["questions_remaining"], 3)

        # Submit answer
        mock_execute.return_value = self._get_mock_response(self.mock_eval_dict)
        await manager.submit_answer(session.id, self.user_id, "First answer.")

        progress_res2 = await manager.get_progress(session.id, self.user_id)
        self.assertEqual(progress_res2["completion_percentage"], 33)
        self.assertEqual(progress_res2["questions_completed"], 1)
        self.assertEqual(progress_res2["average_score"], 88.0)

    @patch("app.ai.services.ai_service.AIService.execute")
    def test_api_session_endpoints(self, mock_execute):
        """Verify the mock interview endpoints via TestClient."""
        # 1. Start Session API
        mock_execute.return_value = self._get_mock_response(self.mock_gen_questions_dict)
        payload = {
            "resume_id": str(self.resume_id),
            "company_name": "Google",
            "target_role": "AI Engineer",
            "interview_type": "MIXED",
            "difficulty": "ADAPTIVE",
            "total_questions": 3
        }
        response = self.client.post(
            "/api/v1/ai/interview/session/start",
            json=payload,
            headers=self.headers
        )
        self.assertEqual(response.status_code, 201)
        session_data = response.json()
        session_id = session_data["id"]
        self.assertEqual(session_data["status"], "WAITING_FOR_ANSWER")
        self.assertEqual(session_data["current_question"], 1)

        # 2. Status API
        response = self.client.get(
            f"/api/v1/ai/interview/session/{session_id}/status",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "WAITING_FOR_ANSWER")

        # 3. Answer API
        mock_execute.return_value = self._get_mock_response(self.mock_eval_dict)
        answer_payload = {"answer": "Dependency injection facilitates clean, testable code."}
        response = self.client.post(
            f"/api/v1/ai/interview/session/{session_id}/answer",
            json=answer_payload,
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["overall_score"], 88)

        # 4. Next API
        mock_execute.return_value = self._get_mock_response(self.mock_gen_questions_dict)
        response = self.client.post(
            f"/api/v1/ai/interview/session/{session_id}/next",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["question_number"], 2)

        # 5. Pause API
        response = self.client.post(
            f"/api/v1/ai/interview/session/{session_id}/pause",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)

        # 6. Resume API
        response = self.client.post(
            f"/api/v1/ai/interview/session/{session_id}/resume",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)

        # 7. Progress API
        response = self.client.get(
            f"/api/v1/ai/interview/session/{session_id}/progress",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["questions_completed"], 1)

        # 8. Complete API
        response = self.client.post(
            f"/api/v1/ai/interview/session/{session_id}/complete",
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
