import os
import sys
import uuid
import unittest
from datetime import datetime
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.schemas.schemas import (
    WritingStyle,
    GenerationMode,
    ExperienceLevel,
    CoverLetterRequest,
    CoverLetterResponse,
    CoverLetterHistory,
    CoverLetterMetadata
)
from app.cover_letter.crud import crud
from app.cover_letter.services.service import CoverLetterService
from app.cover_letter.services.context import CoverLetterContext
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage


class TestAICoverLetterFoundation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["cl_test@careerpilot.com", "cl_test_other@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="cl_test@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Cover Letter User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create secondary test user
            other_user_in = UserCreate(
                email="cl_test_other@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Other CL User"
            )
            cls.other_user = auth_service.register_user(db, user_create=other_user_in)
            cls.other_user_id = cls.other_user.id

            # Create a mock parsed resume for primary user
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="my_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/my_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "personal_info": {"name": "Cover Letter User"},
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
                original_filename="other_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/other_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "personal_info": {"name": "Other CL User"},
                    "skills": ["Java", "Spring Boot"],
                    "experience": [],
                    "education": [],
                    "projects": [],
                    "parser_version": "1.0.0"
                }
            )
            db.add(cls.other_resume)

            db.commit()
            db.refresh(cls.resume)
            db.refresh(cls.other_resume)
            cls.resume_id = cls.resume.id
            cls.other_resume_id = cls.other_resume.id
        finally:
            db.close()

        # Login primary user client
        cls.client = TestClient(app)
        login_payload = {
            "email": "cl_test@careerpilot.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"

        # Login other user client
        cls.other_client = TestClient(app)
        other_login_payload = {
            "email": "cl_test_other@careerpilot.com",
            "password": "SecurePassword@2026"
        }
        other_login_response = cls.other_client.post("/api/v1/auth/login", json=other_login_payload)
        assert other_login_response.status_code == 200, f"Other login failed: {other_login_response.text}"

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            for email in ["cl_test@careerpilot.com", "cl_test_other@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()
        finally:
            db.close()

    def test_01_schemas(self):
        """Test validation and default values of schemas."""
        # 1. Test WritingStyle and GenerationMode enums
        self.assertEqual(WritingStyle.PROFESSIONAL, "PROFESSIONAL")
        self.assertEqual(GenerationMode.STANDARD, "STANDARD")

        # 2. Test valid CoverLetterRequest
        req = CoverLetterRequest(
            resume_id=self.resume_id,
            company_name="Google",
            job_title="Software Engineer",
            job_description="Familiarity with FastAPI and Python."
        )
        self.assertEqual(req.writing_style, WritingStyle.PROFESSIONAL)
        self.assertEqual(req.generation_mode, GenerationMode.STANDARD)

        # 3. Test invalid request raises validation error
        from pydantic import ValidationError
        with self.assertRaises(ValidationError):
            CoverLetterRequest(
                resume_id=self.resume_id,
                company_name="", # empty company name
                job_title="Software Engineer"
            )

    def test_02_crud_operations(self):
        """Test database model columns and CRUD transactions directly."""
        db = SessionLocal()
        try:
            # Create
            cl = crud.create_cover_letter(
                db=db,
                user_id=self.user_id,
                resume_id=self.resume_id,
                company_name="Google",
                job_title="Backend Engineer",
                job_description="Build clean APIs",
                writing_style="CONCISE",
                generation_mode="STANDARD",
                generated_content="Dear Google, ...",
                cover_letter_metadata={"ats_score": 85},
                provider="ollama",
                model="qwen2.5:3b",
                prompt_version="1.0.0"
            )
            self.assertIsNotNone(cl.id)
            self.assertEqual(cl.company_name, "Google")
            self.assertEqual(cl.writing_style, "CONCISE")
            self.assertEqual(cl.cover_letter_metadata, {"ats_score": 85})

            # Read
            fetched = crud.get_cover_letter_by_id(db, cl.id, self.user_id)
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.company_name, "Google")

            # Read other user's access should yield None
            fetched_other = crud.get_cover_letter_by_id(db, cl.id, self.other_user_id)
            self.assertIsNone(fetched_other)

            # List
            user_list = crud.get_cover_letters_by_user_id(db, self.user_id)
            self.assertTrue(len(user_list) >= 1)

            resume_list = crud.get_cover_letters_by_resume_id(db, self.resume_id, self.user_id)
            self.assertTrue(len(resume_list) >= 1)

            # Delete
            crud.delete_cover_letter_record(db, cl)
            db.commit()

            deleted = crud.get_cover_letter_by_id(db, cl.id, self.user_id)
            self.assertIsNone(deleted)
        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
    def test_03_service_layer_and_context(self, mock_execute):
        """Test Service workflow, request validation, and Context builder."""
        import asyncio
        db = SessionLocal()
        try:
            # Build Context
            ctx = asyncio.run(CoverLetterContext.build(
                db=db,
                resume_id=self.resume_id,
                user_id=self.user_id,
                company_name="Apple",
                job_title="iOS Developer",
                job_description="Swift UI"
            ))
            self.assertEqual(ctx.resume.id, self.resume_id)
            self.assertEqual(ctx.company_name, "Apple")
            self.assertEqual(ctx.role, "iOS Developer")
            self.assertIsNotNone(ctx.ats_score)

            variables = ctx.to_variables()
            self.assertIn("resume", variables)
            self.assertEqual(variables["company_name"], "Apple")
            self.assertEqual(variables["role"], "iOS Developer")

            # Mock consecutive calls: 1st for generation, 2nd for fact check
            mock_execute.side_effect = [
                AIStructuredResponse(
                    provider="mock_provider",
                    model="mock_model",
                    latency_ms=120.0,
                    prompt_version="1.0.0",
                    created_at=datetime.utcnow(),
                    raw_response={},
                    parsed_response={
                        "title": "Application for Senior Engineer",
                        "greeting": "Dear Hiring Manager,",
                        "introduction": "I am writing to express my interest in Netflix.",
                        "body": "I have experience with Python and FastAPI.",
                        "closing": "Sincerely,",
                        "signature": "Applicant Signature",
                        "overall_quality": 95,
                        "ats_score": 90,
                        "tone": "PROFESSIONAL",
                        "writing_style": "PROFESSIONAL",
                        "provider": "mock_provider",
                        "model": "mock_model",
                        "prompt_version": "1.0.0",
                        "created_at": "2026-07-01T17:28:47Z",
                        "category_scores": {
                            "grammar": 95,
                            "professional_tone": 95,
                            "readability": 90,
                            "ats_friendliness": 92,
                            "role_alignment": 94,
                            "company_alignment": 90
                        }
                    },
                    usage=TokenUsage(prompt_tokens=100, completion_tokens=150, total_tokens=250),
                    token_fields={}
                ),
                AIStructuredResponse(
                    provider="mock_provider",
                    model="mock_model",
                    latency_ms=50.0,
                    prompt_version="1.0.0",
                    created_at=datetime.utcnow(),
                    raw_response={},
                    parsed_response={"is_valid": True, "fabrications": []},
                    usage=TokenUsage(prompt_tokens=50, completion_tokens=10, total_tokens=60),
                    token_fields={}
                )
            ]

            # Execute CoverLetterService
            service = CoverLetterService(db)
            req = CoverLetterRequest(
                resume_id=self.resume_id,
                company_name="Netflix",
                job_title="Senior Engineer",
                job_description="Python master",
                experience_level=ExperienceLevel.EXPERIENCED
            )
            cl = asyncio.run(service.generate_cover_letter(
                user_id=self.user_id,
                request=req
            ))
            self.assertIsNotNone(cl.id)
            self.assertEqual(cl.company_name, "Netflix")
            self.assertIn("Application for Senior Engineer", cl.generated_content)
            self.assertIn("Python and FastAPI", cl.generated_content)
            self.assertEqual(cl.provider, "mock_provider")
            self.assertEqual(cl.model, "mock_model")

            # Retrieve previous versions
            history = asyncio.run(service.get_history(user_id=self.user_id, resume_id=self.resume_id))
            self.assertTrue(len(history) >= 1)

            # Delete cover letter via service
            deleted = asyncio.run(service.delete_cover_letter(cover_letter_id=cl.id, user_id=self.user_id))
            self.assertTrue(deleted)
        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
    def test_04_api_endpoints(self, mock_execute):
        """Test the registered FastAPI endpoints."""
        client = self.client
        other_client = self.other_client

        # Mock consecutive calls: 1st for generation, 2nd for fact check
        mock_execute.side_effect = [
            AIStructuredResponse(
                provider="mock_provider",
                model="mock_model",
                latency_ms=120.0,
                prompt_version="1.0.0",
                created_at=datetime.utcnow(),
                raw_response={},
                parsed_response={
                    "title": "Application for Full Stack Engineer",
                    "greeting": "Dear Microsoft,",
                    "introduction": "I am writing to express interest.",
                    "body": "I have experience with TypeScript and FastAPI.",
                    "closing": "Sincerely,",
                    "signature": "Applicant Signature",
                    "overall_quality": 95,
                    "ats_score": 90,
                    "tone": "PROFESSIONAL",
                    "writing_style": "PROFESSIONAL",
                    "provider": "mock_provider",
                    "model": "mock_model",
                    "prompt_version": "1.0.0",
                    "created_at": "2026-07-01T17:28:47Z",
                    "category_scores": {
                        "grammar": 95,
                        "professional_tone": 95,
                        "readability": 90,
                        "ats_friendliness": 92,
                        "role_alignment": 94,
                        "company_alignment": 90
                    }
                },
                usage=TokenUsage(prompt_tokens=100, completion_tokens=150, total_tokens=250),
                token_fields={}
            ),
            AIStructuredResponse(
                provider="mock_provider",
                model="mock_model",
                latency_ms=50.0,
                prompt_version="1.0.0",
                created_at=datetime.utcnow(),
                raw_response={},
                parsed_response={"is_valid": True, "fabrications": []},
                usage=TokenUsage(prompt_tokens=50, completion_tokens=10, total_tokens=60),
                token_fields={}
            )
        ]

        # 1. POST /generate
        payload = {
            "resume_id": str(self.resume_id),
            "company_name": "Microsoft",
            "job_title": "Full Stack Engineer",
            "job_description": "TypeScript and FastAPI",
            "writing_style": "PROFESSIONAL",
            "generation_mode": "STANDARD",
            "experience_level": "EXPERIENCED",
            "metadata": {
                "ats_score": 90,
                "prompt_metadata": {"custom_prompt_key": "val"}
            }
        }
        response = client.post("/api/v1/ai/cover-letter/generate", json=payload)
        self.assertEqual(response.status_code, 201, f"Generate failed: {response.text}")
        data = response.json()
        self.assertEqual(data["company_name"], "Microsoft")
        self.assertIsNotNone(data["id"])
        cl_id = data["id"]
        self.assertIn("Application for Full Stack", data["generated_content"])
        self.assertIsNotNone(data["metadata"])
        self.assertEqual(data["metadata"]["ats_score"], 90)

        # Try to generate for other user's resume (should fail/404)
        bad_payload = {
            "resume_id": str(self.other_resume_id), # not owned by user
            "company_name": "Microsoft",
            "job_title": "Full Stack Engineer"
        }
        bad_response = client.post("/api/v1/ai/cover-letter/generate", json=bad_payload)
        self.assertEqual(bad_response.status_code, 404, f"Should fail: {bad_response.text}")

        # 2. GET /history
        history_response = client.get("/api/v1/ai/cover-letter/history")
        self.assertEqual(history_response.status_code, 200)
        history_data = history_response.json()
        self.assertTrue(history_data["total"] >= 1)
        self.assertEqual(history_data["cover_letters"][0]["company_name"], "Microsoft")

        # GET /history with filter
        filtered_history_response = client.get(f"/api/v1/ai/cover-letter/history?resume_id={self.resume_id}")
        self.assertEqual(filtered_history_response.status_code, 200)
        filtered_data = filtered_history_response.json()
        self.assertTrue(filtered_data["total"] >= 1)

        # 3. GET /{id}
        get_response = client.get(f"/api/v1/ai/cover-letter/{cl_id}")
        self.assertEqual(get_response.status_code, 200)
        self.assertEqual(get_response.json()["company_name"], "Microsoft")

        # Access with other user client should yield 404
        forbidden_response = other_client.get(f"/api/v1/ai/cover-letter/{cl_id}")
        self.assertEqual(forbidden_response.status_code, 404)

        # 4. DELETE /{id}
        del_response = client.delete(f"/api/v1/ai/cover-letter/{cl_id}")
        self.assertEqual(del_response.status_code, 200)
        self.assertEqual(del_response.json()["success"], True)

        # Check it is actually deleted
        get_deleted_response = client.get(f"/api/v1/ai/cover-letter/{cl_id}")
        self.assertEqual(get_deleted_response.status_code, 404)

    def test_05_schema_validation(self):
        """Test validation rules of the extended schemas and output JSON parsing."""
        from pydantic import ValidationError
        # Verify invalid writing style raises error
        with self.assertRaises(ValidationError):
            CoverLetterRequest(
                resume_id=self.resume_id,
                company_name="Google",
                job_title="DevOps",
                writing_style="BAD_STYLE"
            )

        # Verify valid values
        req = CoverLetterRequest(
            resume_id=self.resume_id,
            company_name="Google",
            job_title="DevOps",
            writing_style="modern",
            experience_level="internship"
        )
        self.assertEqual(req.writing_style, "MODERN")
        self.assertEqual(req.experience_level, ExperienceLevel.INTERNSHIP)

    @patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
    def test_06_fact_check_failure(self, mock_execute):
        """Test that generated cover letter with fabrications is rejected with 422."""
        client = self.client
        
        # Mock consecutive calls: 1st for generation, 2nd for fact check showing fabrications
        mock_execute.side_effect = [
            AIStructuredResponse(
                provider="mock_provider",
                model="mock_model",
                latency_ms=120.0,
                prompt_version="1.0.0",
                created_at=datetime.utcnow(),
                raw_response={},
                parsed_response={
                    "title": "Application for Senior Engineer",
                    "greeting": "Dear Netflix,",
                    "introduction": "I am writing to express my interest.",
                    "body": "I have experience with Python and I worked as VP of Netflix.",
                    "closing": "Sincerely,",
                    "signature": "Applicant Signature",
                    "overall_quality": 95,
                    "ats_score": 90,
                    "tone": "PROFESSIONAL",
                    "writing_style": "PROFESSIONAL",
                    "provider": "mock_provider",
                    "model": "mock_model",
                    "prompt_version": "1.0.0",
                    "created_at": "2026-07-01T17:28:47Z",
                    "category_scores": {
                        "grammar": 95,
                        "professional_tone": 95,
                        "readability": 90,
                        "ats_friendliness": 92,
                        "role_alignment": 94,
                        "company_alignment": 90
                    }
                },
                usage=TokenUsage(prompt_tokens=100, completion_tokens=150, total_tokens=250),
                token_fields={}
            ),
            AIStructuredResponse(
                provider="mock_provider",
                model="mock_model",
                latency_ms=50.0,
                prompt_version="1.0.0",
                created_at=datetime.utcnow(),
                raw_response={},
                parsed_response={
                    "is_valid": False,
                    "fabrications": [
                        {
                            "field": "experience",
                            "fabricated_item": "VP of Netflix",
                            "reason": "Resume shows no Netflix VP employment."
                        }
                    ]
                },
                usage=TokenUsage(prompt_tokens=50, completion_tokens=10, total_tokens=60),
                token_fields={}
            )
        ]

        payload = {
            "resume_id": str(self.resume_id),
            "company_name": "Netflix",
            "job_title": "Senior Engineer",
            "job_description": "Python",
            "writing_style": "PROFESSIONAL",
            "generation_mode": "STANDARD",
            "experience_level": "EXPERIENCED"
        }
        response = client.post("/api/v1/ai/cover-letter/generate", json=payload)
        self.assertEqual(response.status_code, 422)
        data = response.json()
        self.assertEqual(data["error"], True)
        self.assertEqual(data["message"], "Fact validation failed: generated cover letter contains fabricated details.")
        self.assertTrue(len(data["detail"]) >= 1)
        self.assertEqual(data["detail"][0]["loc"], ["body", "experience"])
        self.assertIn("Fabrication detected", data["detail"][0]["msg"])

    def test_07_resolver_registry(self):
        """Test CoverLetterTemplateResolver behavior."""
        from app.cover_letter.services.resolver import CoverLetterTemplateResolver
        resolver = CoverLetterTemplateResolver()
        
        # Resolve values
        self.assertEqual(resolver.resolve("PROFESSIONAL", "fresher", "STANDARD", None), "fresher")
        self.assertEqual(resolver.resolve("MODERN", "internship", "FAST", None), "internship")
        self.assertEqual(resolver.resolve("FORMAL", "executive", "DETAILED", None), "executive")
        
        # Test fallback
        self.assertEqual(resolver.resolve("PROFESSIONAL", "invalid_level", "STANDARD", None), "experienced")

