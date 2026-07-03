import os
import sys
import uuid
import unittest
from datetime import datetime, timezone
from unittest.mock import patch, AsyncMock

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider, InterviewStatus
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.schemas import InterviewSessionCreate
from app.interview.services.service import InterviewService
from app.interview.services.ai_service import InterviewAIService, GeneratedQuestion, GeneratedQuestionBatch
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage
from app.ai.dependencies import get_ai_service
from app.interview.dependencies import get_interview_ai_service, get_interview_service

class TestAIInterviewGeneration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["gen_test@careerpilot.com"]:
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
                email="gen_test@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Generation User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create a mock parsed resume for primary user
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="gen_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/gen_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "skills": ["Python", "FastAPI"],
                    "experience": [{"title": "Software Engineer", "company": "Tech Inc"}]
                }
            )
            db.add(cls.resume)

            # Create an empty resume to test validation rules
            cls.empty_resume = Resume(
                user_id=cls.user_id,
                original_filename="empty_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/empty_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={}
            )
            db.add(cls.empty_resume)
            db.commit()
            db.refresh(cls.resume)
            db.refresh(cls.empty_resume)
            cls.resume_id = cls.resume.id
            cls.empty_resume_id = cls.empty_resume.id
        finally:
            db.close()

        # Login primary user client
        cls.client = TestClient(app)
        login_payload = {
            "email": "gen_test@careerpilot.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            for email in ["gen_test@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                        db.query(InterviewSession.id).filter(InterviewSession.user_id == test_user.id)
                    )).delete(synchronize_session=False)
                    db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()
        finally:
            db.close()

    def test_01_prompt_registry_loading(self):
        """Verify prompt templates (including mixed) are loaded into the registry."""
        ai_service = get_ai_service()
        int_ai_service = InterviewAIService(ai_service=ai_service)
        
        registered_templates = ["system_prompt", "hr", "technical", "behavioral", "resume_based", "mixed", "followup"]
        for t_name in registered_templates:
            template = ai_service.registry.get_prompt("interview", t_name)
            self.assertIsNotNone(template)
            self.assertEqual(template.metadata.name, t_name)
            self.assertEqual(template.metadata.version, "1.0.0")

    def test_02_validation_invalid_inputs(self):
        """Verify session creation constraints on type, difficulty, and empty resumes."""
        # 1. Invalid interview type validation
        with self.assertRaises(ValidationError):
            InterviewSessionCreate(interview_type="UNKNOWN_TYPE")

        # 2. Invalid difficulty validation
        with self.assertRaises(ValidationError):
            InterviewSessionCreate(difficulty="EXTREME")

        # 3. Empty resume validation
        db = SessionLocal()
        service = get_interview_service(db)
        try:
            # Create session using empty resume
            schema = InterviewSessionCreate(
                resume_id=self.empty_resume_id,
                company_name="Google",
                target_role="AI Engineer",
                interview_type="RESUME_BASED",
                difficulty="MEDIUM"
            )
            session = db.query(InterviewSession).filter(InterviewSession.user_id == self.user_id).first()
            if not session:
                session = InterviewSession(
                    user_id=self.user_id,
                    resume_id=self.empty_resume_id,
                    company_name="Google",
                    target_role="AI Engineer",
                    interview_type="RESUME_BASED",
                    difficulty="MEDIUM",
                    status="PENDING",
                    total_questions=5
                )
                db.add(session)
                db.commit()
                db.refresh(session)
            
            with self.assertRaises(ValueError) as context:
                import asyncio
                asyncio.run(service.generate_session_questions(
                    session_id=session.id,
                    user_id=self.user_id,
                    mode="entire"
                ))
            self.assertIn("Resume content is empty or lacks parsed details", str(context.exception))
        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute")
    def test_03_generation_success(self, mock_execute):
        """Verify successful structured questions generation and DB persistence."""
        # Setup mock structured AI response
        mock_questions = {
            "questions": [
                {
                    "question_id": 1,
                    "category": "TECHNICAL",
                    "difficulty": "HARD",
                    "question": "Explain FastAPI dependency injection mechanisms.",
                    "expected_topics": ["FastAPI", "Dependency Injection"],
                    "recommended_answer_framework": "PREP",
                    "estimated_time_seconds": 180,
                    "evaluation_weight": 8,
                    "followup_possible": True
                }
            ]
        }
        
        mock_execute.return_value = AIStructuredResponse(
            provider="mock-provider",
            model="mock-model",
            latency_ms=120.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=mock_questions,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=20, total_tokens=30),
            token_fields={}
        )

        db = SessionLocal()
        service = get_interview_service(db)
        try:
            # Create session
            schema = InterviewSessionCreate(
                resume_id=self.resume_id,
                company_name="Acme Corp",
                target_role="Backend Engineer",
                interview_type="TECHNICAL",
                difficulty="HARD"
            )
            session = asyncio_run(service.create_session(user_id=self.user_id, request=schema))

            # Generate questions
            turns = asyncio_run(service.generate_session_questions(
                session_id=session.id,
                user_id=self.user_id,
                mode="entire"
            ))

            self.assertEqual(len(turns), 1)
            self.assertEqual(turns[0].question_text, "Explain FastAPI dependency injection mechanisms.")
            self.assertEqual(turns[0].question_category, "TECHNICAL")

            # Check session state update
            db.refresh(session)
            self.assertEqual(session.status, "IN_PROGRESS")
            self.assertEqual(session.provider, "mock-provider")
            self.assertEqual(session.model, "mock-model")
            self.assertEqual(session.prompt_version, "1.0.0")

            # Verify session metadata structure
            q_meta = session.session_metadata.get("questions")
            self.assertIsNotNone(q_meta)
            self.assertEqual(q_meta[0]["question_id"], 1)
            self.assertEqual(q_meta[0]["recommended_answer_framework"], "PREP")

            gen_meta = session.session_metadata.get("generation_metadata")
            self.assertIsNotNone(gen_meta)
            self.assertEqual(gen_meta["generation_mode"], "entire")
            self.assertEqual(gen_meta["latency_ms"], 120.0)

        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute")
    def test_04_generation_retry_on_invalid_json(self, mock_execute):
        """Verify the generator retries once when JSON parsing/validation fails initially."""
        mock_questions = {
            "questions": [
                {
                    "question_id": 1,
                    "category": "BEHAVIORAL",
                    "difficulty": "MEDIUM",
                    "question": "Tell me about a time you resolved a conflict.",
                    "expected_topics": ["Conflict"],
                    "recommended_answer_framework": "STAR",
                    "estimated_time_seconds": 120,
                    "evaluation_weight": 9,
                    "followup_possible": False
                }
            ]
        }
        
        valid_response = AIStructuredResponse(
            provider="mock-provider",
            model="mock-model",
            latency_ms=100.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=mock_questions,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=20, total_tokens=30),
            token_fields={}
        )

        # First call raises an exception, second call succeeds
        mock_execute.side_effect = [ValueError("Malformed JSON response"), valid_response]

        db = SessionLocal()
        service = get_interview_service(db)
        try:
            # Create session
            schema = InterviewSessionCreate(
                resume_id=self.resume_id,
                company_name="Netflix",
                target_role="Senior Eng",
                interview_type="BEHAVIORAL",
                difficulty="MEDIUM"
            )
            session = asyncio_run(service.create_session(user_id=self.user_id, request=schema))

            # Generate questions (should retry and succeed)
            turns = asyncio_run(service.generate_session_questions(
                session_id=session.id,
                user_id=self.user_id,
                mode="entire"
            ))

            self.assertEqual(len(turns), 1)
            self.assertEqual(turns[0].question_text, "Tell me about a time you resolved a conflict.")
            self.assertEqual(mock_execute.call_count, 2) # Verified retry was triggered

        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute")
    def test_05_caching_and_duplicate_prevention(self, mock_execute):
        """Verify duplicate generation requests return existing turns directly without LLM call."""
        mock_questions = {
            "questions": [
                {
                    "question_id": 1,
                    "category": "BEHAVIORAL",
                    "difficulty": "MEDIUM",
                    "question": "Tell me about yourself.",
                    "expected_topics": ["Intro"],
                    "recommended_answer_framework": "STAR",
                    "estimated_time_seconds": 120,
                    "evaluation_weight": 10,
                    "followup_possible": True
                }
            ]
        }
        
        mock_execute.return_value = AIStructuredResponse(
            provider="mock-provider",
            model="mock-model",
            latency_ms=10.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=mock_questions,
            usage=TokenUsage(),
            token_fields={}
        )

        db = SessionLocal()
        service = get_interview_service(db)
        try:
            schema = InterviewSessionCreate(
                resume_id=self.resume_id,
                company_name="Facebook",
                target_role="Tech Lead",
                interview_type="BEHAVIORAL",
                difficulty="MEDIUM"
            )
            session = asyncio_run(service.create_session(user_id=self.user_id, request=schema))

            # First generation
            turns1 = asyncio_run(service.generate_session_questions(
                session_id=session.id,
                user_id=self.user_id,
                mode="entire"
            ))

            # Reset call count
            mock_execute.reset_mock()

            # Second generation (should return cached turns)
            turns2 = asyncio_run(service.generate_session_questions(
                session_id=session.id,
                user_id=self.user_id,
                mode="entire"
            ))

            self.assertEqual(len(turns2), 1)
            mock_execute.assert_not_called() # No second AI call made

        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute")
    def test_06_api_endpoints_flow(self, mock_execute):
        """Verify POST, GET, and DELETE API endpoints for interview questions."""
        mock_questions = {
            "questions": [
                {
                    "question_id": 1,
                    "category": "TECHNICAL",
                    "difficulty": "MEDIUM",
                    "question": "What is Python GIL?",
                    "expected_topics": ["GIL", "Concurrency"],
                    "recommended_answer_framework": "PREP",
                    "estimated_time_seconds": 150,
                    "evaluation_weight": 7,
                    "followup_possible": True
                }
            ]
        }
        
        mock_execute.return_value = AIStructuredResponse(
            provider="mock-provider",
            model="mock-model",
            latency_ms=80.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=mock_questions,
            usage=TokenUsage(),
            token_fields={}
        )

        # 1. POST /generate
        payload = {
            "resume_id": str(self.resume_id),
            "company_name": "OpenAI",
            "target_role": "Research Engineer",
            "interview_type": "TECHNICAL",
            "difficulty": "MEDIUM",
            "total_questions": 5
        }
        res = self.client.post("/api/v1/ai/interview/generate", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        session_id = data["id"]
        self.assertEqual(len(data["turns"]), 1)
        self.assertEqual(data["turns"][0]["question_text"], "What is Python GIL?")

        # 2. GET /session/{id}/questions
        res_get = self.client.get(f"/api/v1/ai/interview/session/{session_id}/questions")
        self.assertEqual(res_get.status_code, 200)
        self.assertEqual(len(res_get.json()), 1)
        self.assertEqual(res_get.json()[0]["question_text"], "What is Python GIL?")

        # 3. DELETE /session/{id}/questions
        res_del = self.client.delete(f"/api/v1/ai/interview/session/{session_id}/questions")
        self.assertEqual(res_del.status_code, 200)
        self.assertTrue(res_del.json()["success"])

        # 4. Verify turns are deleted and status reset
        res_get_post_del = self.client.get(f"/api/v1/ai/interview/session/{session_id}/questions")
        self.assertEqual(res_get_post_del.status_code, 200)
        self.assertEqual(len(res_get_post_del.json()), 0)

        res_detail = self.client.get(f"/api/v1/ai/interview/sessions/{session_id}")
        self.assertEqual(res_detail.status_code, 200)
        self.assertEqual(res_detail.json()["status"], "PENDING")

    def test_07_adaptive_difficulty_resolution(self):
        """Verify that difficulty resolves adaptively depending on prior scores."""
        db = SessionLocal()
        ai_service = get_ai_service()
        int_ai_service = InterviewAIService(ai_service=ai_service)
        try:
            session = InterviewSession(
                user_id=self.user_id,
                interview_type="TECHNICAL",
                difficulty="ADAPTIVE",
                status="IN_PROGRESS",
                total_questions=5,
                session_metadata={
                    "questions": [
                        {
                            "question_id": 1,
                            "difficulty": "MEDIUM"
                        }
                    ]
                }
            )
            db.add(session)
            db.flush()

            # Add turn with score >= 80 (should step up to HARD)
            turn1 = InterviewTurn(
                session_id=session.id,
                question_number=1,
                question_text="Q1",
                score=85
            )
            db.add(turn1)
            db.commit()
            db.refresh(session)

            resolved = int_ai_service._resolve_adaptive_difficulty(session)
            self.assertEqual(resolved, "HARD")

            # Reset score to < 60 (should step down to EASY)
            turn1.score = 50
            db.commit()
            db.refresh(session)
            
            resolved2 = int_ai_service._resolve_adaptive_difficulty(session)
            self.assertEqual(resolved2, "EASY")

        finally:
            db.close()


def asyncio_run(coro):
    """Helper to run async coroutines in a synchronous test wrapper."""
    import asyncio
    return asyncio.run(coro)
