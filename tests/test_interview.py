import os
import sys
import uuid
import unittest
import asyncio
from datetime import datetime, timezone
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider, InterviewType, InterviewDifficulty, InterviewStatus, QuestionCategory
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.schemas import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewTurnResponse,
    InterviewHistory
)
from app.interview.crud.crud import InterviewCRUD
from app.interview.services.service import InterviewService
from app.interview.services.context import InterviewContext
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.services.job_match.history import add_to_history

class TestAIInterviewFoundation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["int_test@careerpilot.com", "int_test_other@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                        db.query(InterviewSession.id).filter(InterviewSession.user_id == test_user.id)
                    )).delete(synchronize_session=False)
                    db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="int_test@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Interview User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create secondary test user
            other_user_in = UserCreate(
                email="int_test_other@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Other Int User"
            )
            cls.other_user = auth_service.register_user(db, user_create=other_user_in)
            cls.other_user_id = cls.other_user.id

            # Create a mock parsed resume for primary user
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="int_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/int_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "personal_info": {"name": "Interview User"},
                    "skills": ["Python", "FastAPI", "SQLAlchemy"],
                    "experience": [],
                    "education": [],
                    "projects": [],
                    "parser_version": "1.0.0"
                }
            )
            db.add(cls.resume)

            # Create a mock parsed resume for other user
            cls.other_resume = Resume(
                user_id=cls.other_user_id,
                original_filename="other_int_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/other_int_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "personal_info": {"name": "Other Int User"},
                    "skills": ["Java", "Spring Boot"],
                    "experience": [],
                    "education": [],
                    "projects": [],
                    "parser_version": "1.0.0"
                }
            )
            db.add(cls.other_resume)
            db.flush()

            # Create a cover letter record for the user to verify in Context Builder
            cls.cover_letter = AICoverLetter(
                user_id=cls.user_id,
                resume_id=cls.resume.id,
                company_name="Google",

                job_title="Software Engineer",
                writing_style="PROFESSIONAL",
                generation_mode="STANDARD",
                generated_content="Dear Google, ...",
                provider="mock",
                model="mock",
                prompt_version="1.0.0"
            )
            db.add(cls.cover_letter)

            db.commit()
            db.refresh(cls.resume)
            db.refresh(cls.other_resume)
            db.refresh(cls.cover_letter)
            cls.resume_id = cls.resume.id
            cls.other_resume_id = cls.other_resume.id
        finally:
            db.close()

        # Login primary user client
        cls.client = TestClient(app)
        login_payload = {
            "email": "int_test@careerpilot.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"

        # Login other user client
        cls.other_client = TestClient(app)
        other_login_payload = {
            "email": "int_test_other@careerpilot.com",
            "password": "SecurePassword@2026"
        }
        other_login_response = cls.other_client.post("/api/v1/auth/login", json=other_login_payload)
        assert other_login_response.status_code == 200, f"Other login failed: {other_login_response.text}"

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            for email in ["int_test@careerpilot.com", "int_test_other@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                        db.query(InterviewSession.id).filter(InterviewSession.user_id == test_user.id)
                    )).delete(synchronize_session=False)
                    db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()
        finally:
            db.close()

    def test_01_enums_and_constants(self):
        """Test enums and constants are registered and have correct values."""
        self.assertEqual(InterviewType.BEHAVIORAL, "BEHAVIORAL")
        self.assertEqual(InterviewDifficulty.MEDIUM, "MEDIUM")
        self.assertEqual(InterviewStatus.PENDING, "PENDING")
        self.assertEqual(QuestionCategory.TECHNICAL, "TECHNICAL")

        from app.core.interview_constants import (
            DEFAULT_TOTAL_QUESTIONS,
            DEFAULT_DIFFICULTY,
            DEFAULT_INTERVIEW_TYPE,
            QUESTION_CATEGORIES,
            SCORE_BANDS
        )
        self.assertEqual(DEFAULT_TOTAL_QUESTIONS, 5)
        self.assertEqual(DEFAULT_DIFFICULTY, "MEDIUM")
        self.assertEqual(DEFAULT_INTERVIEW_TYPE, "BEHAVIORAL")
        self.assertIn("TECHNICAL", QUESTION_CATEGORIES)
        self.assertIn("EXCELLENT", SCORE_BANDS)

    def test_02_schema_validation(self):
        """Test validation rules of the schemas."""
        # 1. Valid session create schema
        schema = InterviewSessionCreate(
            resume_id=self.resume_id,
            company_name="Google",
            target_role="Software Engineer",
            interview_type="TECHNICAL",
            difficulty="HARD",
            total_questions=10
        )
        self.assertEqual(schema.interview_type, "TECHNICAL")
        self.assertEqual(schema.difficulty, "HARD")

        # 2. Rejects invalid type
        from pydantic import ValidationError
        with self.assertRaises(ValidationError):
            InterviewSessionCreate(interview_type="INVALID_TYPE")

        # 3. Rejects invalid difficulty
        with self.assertRaises(ValidationError):
            InterviewSessionCreate(difficulty="EXTREME")

    def test_03_crud_operations(self):
        """Test database models and CRUD transactions directly."""
        db = SessionLocal()
        try:
            # Create session
            schema = InterviewSessionCreate(
                resume_id=self.resume_id,
                company_name="Amazon",
                target_role="Backend Engineer",
                interview_type="BEHAVIORAL",
                difficulty="MEDIUM",
                total_questions=5,
                session_metadata={"custom": "meta"}
            )
            session = InterviewCRUD.create_session(
                db=db,
                user_id=self.user_id,
                schema=schema,
                status="PENDING",
                provider="mock",
                model="mock",
                prompt_version="1.0.0"
            )
            self.assertIsNotNone(session.id)
            self.assertEqual(session.company_name, "Amazon")
            self.assertEqual(session.session_metadata, {"custom": "meta"})

            # Create turn
            turn = InterviewCRUD.create_turn(
                db=db,
                session_id=session.id,
                question_number=1,
                question_category="BEHAVIORAL",
                question_text="Tell me about a time you solved a hard bug.",
                answer_text="I did...",
                feedback="Good job",
                score=90
            )
            self.assertIsNotNone(turn.id)
            self.assertEqual(turn.question_number, 1)

            # Get session
            fetched = InterviewCRUD.get_session(db, session.id, self.user_id)
            self.assertIsNotNone(fetched)
            self.assertEqual(len(fetched.turns), 1)
            self.assertEqual(fetched.turns[0].question_text, "Tell me about a time you solved a hard bug.")

            # Cross user read restriction
            other_fetched = InterviewCRUD.get_session(db, session.id, self.other_user_id)
            self.assertIsNone(other_fetched)

            # List sessions
            user_sessions = InterviewCRUD.list_sessions(db, self.user_id)
            self.assertTrue(len(user_sessions) >= 1)

            # Delete
            deleted = InterviewCRUD.delete_session(db, session)
            self.assertTrue(deleted)

            # Verify deletion cascade
            post_del_session = InterviewCRUD.get_session(db, session.id, self.user_id)
            self.assertIsNone(post_del_session)

            # Turn should be cascaded and deleted too
            deleted_turn = db.query(InterviewTurn).filter(InterviewTurn.id == turn.id).first()
            self.assertIsNone(deleted_turn)

        finally:
            db.close()

    def test_04_context_builder(self):
        """Test Context Builder fetching values and handling missing elements gracefully."""
        db = SessionLocal()
        try:
            # Add a mock job match to the history cache to be resolved by builder
            add_to_history(
                resume_id=self.resume_id,
                overall_score=85,
                grade="Good",
                job_title="Software Engineer",
                company="Google",
                missing_skills=["Kubernetes"],
                recommendations=[]
            )

            # Build full context
            context = asyncio.run(InterviewContext.build(
                db=db,
                user_id=self.user_id,
                resume_id=self.resume_id,
                job_id=uuid.uuid4()
            ))

            self.assertIsNotNone(context.resume)
            self.assertEqual(context.ats_score, 0) # Minimal contact/skills populated in mock resume yields 0 score
            self.assertIsNotNone(context.job_match)
            self.assertEqual(context.job_match["overall_score"], 85)
            self.assertEqual(context.job_match["grade"], "Good")
            self.assertIsNotNone(context.cover_letter)
            self.assertEqual(context.cover_letter.company_name, "Google")

            # Check serialization to dict
            ctx_dict = context.to_dict()
            self.assertEqual(ctx_dict["ats_score"], 0)
            self.assertEqual(ctx_dict["cover_letter"]["company_name"], "Google")

            # Graceful recovery: missing optional data
            empty_context = asyncio.run(InterviewContext.build(
                db=db,
                user_id=self.user_id,
                resume_id=None,
                job_id=None
            ))
            self.assertIsNone(empty_context.resume)
            self.assertIsNone(empty_context.ats_score)
            self.assertIsNone(empty_context.job_match)
            self.assertIsNone(empty_context.cover_letter)

        finally:
            db.close()

    def test_05_api_endpoints(self):
        """Test mock interview session routing and response validation."""
        client = self.client
        other_client = self.other_client

        # 1. POST /sessions
        payload = {
            "resume_id": str(self.resume_id),
            "company_name": "Google",
            "target_role": "AI Engineer",
            "interview_type": "TECHNICAL",
            "difficulty": "HARD",
            "total_questions": 5
        }
        res = client.post("/api/v1/ai/interview/sessions", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertEqual(data["company_name"], "Google")
        self.assertEqual(data["interview_type"], "TECHNICAL")
        self.assertEqual(data["difficulty"], "HARD")
        session_id = data["id"]

        # Try creating with invalid inputs (400 validation error)
        bad_payload = payload.copy()
        bad_payload["interview_type"] = "INVALID"
        res_bad = client.post("/api/v1/ai/interview/sessions", json=bad_payload)
        self.assertEqual(res_bad.status_code, 422) # FastAPI returns 422 for pydantic parse failure on request body

        # 2. GET /sessions (History)
        res_history = client.get("/api/v1/ai/interview/sessions")
        self.assertEqual(res_history.status_code, 200)
        history_data = res_history.json()
        self.assertTrue(history_data["total"] >= 1)
        self.assertEqual(history_data["sessions"][0]["company_name"], "Google")

        # 3. GET /sessions/{id}
        res_detail = client.get(f"/api/v1/ai/interview/sessions/{session_id}")
        self.assertEqual(res_detail.status_code, 200)
        self.assertEqual(res_detail.json()["target_role"], "AI Engineer")

        # Other user cannot access
        res_forbidden = other_client.get(f"/api/v1/ai/interview/sessions/{session_id}")
        self.assertEqual(res_forbidden.status_code, 404)

        # 4. POST placeholders (501 not implemented)
        res_ans = client.post(f"/api/v1/ai/interview/sessions/{session_id}/answer")
        self.assertEqual(res_ans.status_code, 501)
        self.assertIn("Implemented in Phase 10 Part 1B", res_ans.json()["message"])

        res_comp = client.post(f"/api/v1/ai/interview/sessions/{session_id}/complete")
        self.assertEqual(res_comp.status_code, 501)
        self.assertIn("Implemented in Phase 10 Part 1B", res_comp.json()["message"])

        # 5. DELETE /sessions/{id}
        res_del = client.delete(f"/api/v1/ai/interview/sessions/{session_id}")
        self.assertEqual(res_del.status_code, 200)
        self.assertEqual(res_del.json()["success"], True)

        # Verify actually deleted
        res_get_del = client.get(f"/api/v1/ai/interview/sessions/{session_id}")
        self.assertEqual(res_get_del.status_code, 404)
