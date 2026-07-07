import os
import sys
import uuid
import unittest
import asyncio
from datetime import datetime
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
from pydantic import ValidationError

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.models.ai_cover_letter_optimization import AICoverLetterOptimization
from app.cover_letter.schemas.schemas import (
    CoverLetterOptimizationRequest,
    CoverLetterOptimizationResponse,
    CoverLetterCompareRequest,
    VersionComparison,
    QualityScore,
    CategoryScore,
    OptimizationSuggestion,
    KeywordAnalysis,
    CompanyAlignment,
    OptimizationMetadata
)
from app.cover_letter.crud import crud
from app.cover_letter.services.optimization_service import CoverLetterOptimizationService
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage


class TestAICoverLetterOptimization(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test users, database connection, and authenticated clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["opt_test@scorelia.com", "opt_test_other@scorelia.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    # Cascade deletes optimizations due to foreign key
                    db.query(AICoverLetterOptimization).filter(AICoverLetterOptimization.user_id == test_user.id).delete()
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="opt_test@scorelia.com",
                password="SecurePassword@2026",
                full_name="Opt User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create secondary test user
            other_user_in = UserCreate(
                email="opt_test_other@scorelia.com",
                password="SecurePassword@2026",
                full_name="Other Opt User"
            )
            cls.other_user = auth_service.register_user(db, user_create=other_user_in)
            cls.other_user_id = cls.other_user.id

            # Create a mock parsed resume for primary user
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="opt_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/opt_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "personal_info": {"name": "Opt User"},
                    "skills": ["Python", "FastAPI", "SQLAlchemy", "Ollama"],
                    "experience": [],
                    "education": [],
                    "projects": [],
                    "parser_version": "1.0.0"
                }
            )
            db.add(cls.resume)
            db.commit()
            db.refresh(cls.resume)
            cls.resume_id = cls.resume.id

            # Create primary user cover letter
            cls.cover_letter = crud.create_cover_letter(
                db=db,
                user_id=cls.user_id,
                resume_id=cls.resume_id,
                company_name="Google",
                job_title="Backend Engineer",
                job_description="Looking for Python and FastAPI developer.",
                writing_style="PROFESSIONAL",
                generation_mode="STANDARD",
                generated_content="Dear Google Team, I am writing to express interest in the Backend Engineer role. I know Python and FastAPI.",
                cover_letter_metadata={"ats_score": 80}
            )
            cls.cover_letter_id = cls.cover_letter.id

            # Create other user cover letter
            cls.other_cover_letter = crud.create_cover_letter(
                db=db,
                user_id=cls.other_user_id,
                resume_id=cls.resume_id,
                company_name="Meta",
                job_title="Product Manager",
                job_description="Looking for Product Manager.",
                writing_style="EXECUTIVE",
                generation_mode="STANDARD",
                generated_content="Dear Meta Team, I want to be a Product Manager.",
                cover_letter_metadata={"ats_score": 70}
            )
            cls.other_cover_letter_id = cls.other_cover_letter.id

        finally:
            db.close()

        # Login clients
        cls.client = TestClient(app)
        login_payload = {
            "email": "opt_test@scorelia.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200

        cls.other_client = TestClient(app)
        other_login_payload = {
            "email": "opt_test_other@scorelia.com",
            "password": "SecurePassword@2026"
        }
        other_login_response = cls.other_client.post("/api/v1/auth/login", json=other_login_payload)
        assert other_login_response.status_code == 200

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            for email in ["opt_test@scorelia.com", "opt_test_other@scorelia.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(AICoverLetterOptimization).filter(AICoverLetterOptimization.user_id == test_user.id).delete()
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()
        finally:
            db.close()

    def test_01_schema_validation(self):
        """Test schemas with valid and invalid bounds."""
        cat_scores = CategoryScore(
            grammar=90, professional_tone=85, readability=80, ats=85, keyword_usage=75,
            company_alignment=80, job_alignment=90, personalization=90, structure=85, closing=90
        )
        quality = QualityScore(overall_score=85, category_scores=cat_scores)
        self.assertEqual(quality.overall_score, 85)
        self.assertEqual(quality.category_scores.grammar, 90)

        # Invalid bounds test
        with self.assertRaises(ValidationError):
            CategoryScore(
                grammar=105, professional_tone=85, readability=80, ats=85, keyword_usage=75,
                company_alignment=80, job_alignment=90, personalization=90, structure=85, closing=90
            )

        with self.assertRaises(ValidationError):
            QualityScore(overall_score=-5, category_scores=cat_scores)

    def test_02_database_crud(self):
        """Test database CRUD for AICoverLetterOptimization."""
        db = SessionLocal()
        try:
            db_opt = crud.create_cover_letter_optimization(
                db=db,
                user_id=self.user_id,
                cover_letter_id=self.cover_letter_id,
                optimization_result={"original_content": "Original text", "optimized_content": "New text"},
                quality_score=88,
                category_scores={"grammar": 90, "ats": 85},
                keyword_analysis={"matched": ["python"]},
                provider="ollama",
                model="llama3",
                prompt_version="1.0.0",
                optimization_metadata={"latency_ms": 120.0}
            )
            self.assertIsNotNone(db_opt.id)
            self.assertEqual(db_opt.quality_score, 88)

            # Get by id
            fetched = crud.get_optimization_by_id(db, db_opt.id, self.user_id)
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.id, db_opt.id)

            # Get by wrong user
            fetched_wrong = crud.get_optimization_by_id(db, db_opt.id, self.other_user_id)
            self.assertIsNone(fetched_wrong)

            # Get by user_id
            all_opts = crud.get_optimizations_by_user_id(db, self.user_id)
            self.assertEqual(len(all_opts), 1)

            # Get by cover letter id
            cl_opts = crud.get_optimizations_by_cover_letter_id(db, self.cover_letter_id, self.user_id)
            self.assertEqual(len(cl_opts), 1)

            # Delete record
            crud.delete_optimization_record(db, db_opt)
            fetched_deleted = crud.get_optimization_by_id(db, db_opt.id, self.user_id)
            self.assertIsNone(fetched_deleted)
        finally:
            db.close()

    def test_03_version_comparison_diff_engine(self):
        """Test computing comparison diffs."""
        original = "Dear Google Team, I am writing to express interest in the Backend Engineer role. I know Python and FastAPI."
        optimized = "Dear Google Team, I am writing to express my strong interest in the Backend Engineer position. I know Python, FastAPI and Ollama."
        
        # Test Compare request
        req = CoverLetterCompareRequest(original_content=original, optimized_content=optimized)
        resp = self.client.post("/api/v1/ai/cover-letter/compare", json=req.model_dump())
        self.assertEqual(resp.status_code, 200)
        
        diff_data = resp.json()
        self.assertIn("added_content", diff_data)
        self.assertIn("removed_content", diff_data)
        self.assertIn("modified_sections", diff_data)

    @patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
    def test_04_optimization_service_success(self, mock_execute):
        """Test service successfully optimizes cover letter."""
        mock_output = {
            "optimized_content": "Dear Google Team, optimized letter content.",
            "overall_score": 92,
            "category_scores": {
                "grammar": 95, "professional_tone": 90, "readability": 90, "ats": 90, "keyword_usage": 92,
                "company_alignment": 95, "job_alignment": 95, "personalization": 90, "structure": 90, "closing": 92
            },
            "suggestions": {
                "high_priority": [{"reason": "Weak opening", "expected_benefit": "Better impression", "suggested_improvement": "Use active voice", "estimated_ats_improvement": 10}],
                "medium_priority": [],
                "low_priority": []
            },
            "keyword_analysis": {
                "matched_keywords": ["python", "fastapi"],
                "missing_keywords": ["sqlalchemy"],
                "recommended_keywords": ["sql"],
                "overused_keywords": ["very"],
                "weak_keywords": ["try"],
                "strong_action_verbs": ["spearheaded"]
            },
            "company_alignment": {
                "mission_alignment": "Aligned",
                "culture_fit": "Excellent",
                "role_alignment": "Strong",
                "technical_alignment": "Deep",
                "industry_language": "Professional",
                "alignment_confidence": 0.95
            },
            "improvement_summary": "Greatly improved grammar and ATS fit.",
            "estimated_quality_gain": 15
        }

        mock_execute.return_value = AIStructuredResponse(
            provider="ollama",
            model="llama3",
            latency_ms=150.0,
            prompt_version="1.0.0",
            created_at=datetime.utcnow(),
            raw_response={},
            parsed_response=mock_output,
            usage=TokenUsage(prompt_tokens=100, completion_tokens=100, total_tokens=200),
            token_fields={}
        )

        db = SessionLocal()
        try:
            service = CoverLetterOptimizationService(db)
            req = CoverLetterOptimizationRequest(cover_letter_id=self.cover_letter_id)
            db_opt = asyncio.run(service.optimize_cover_letter(user_id=self.user_id, request=req))
            
            self.assertIsNotNone(db_opt)
            self.assertEqual(db_opt.quality_score, 92)
            self.assertEqual(db_opt.provider, "ollama")
            self.assertEqual(db_opt.model, "llama3")
            self.assertEqual(db_opt.optimization_result["optimized_content"], "Dear Google Team, optimized letter content.")
        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute", new_callable=AsyncMock)
    def test_05_api_optimize_endpoints(self, mock_execute):
        """Test API POST optimize call, GET retrieval, list and delete."""
        mock_output = {
            "optimized_content": "Dear Google Team, optimized letter content.",
            "overall_score": 92,
            "category_scores": {
                "grammar": 95, "professional_tone": 90, "readability": 90, "ats": 90, "keyword_usage": 92,
                "company_alignment": 95, "job_alignment": 95, "personalization": 90, "structure": 90, "closing": 92
            },
            "suggestions": {
                "high_priority": [{"reason": "Weak opening", "expected_benefit": "Better impression", "suggested_improvement": "Use active voice", "estimated_ats_improvement": 10}],
                "medium_priority": [],
                "low_priority": []
            },
            "keyword_analysis": {
                "matched_keywords": ["python"],
                "missing_keywords": [],
                "recommended_keywords": [],
                "overused_keywords": [],
                "weak_keywords": [],
                "strong_action_verbs": []
            },
            "company_alignment": {
                "mission_alignment": "Aligned",
                "culture_fit": "Excellent",
                "role_alignment": "Strong",
                "technical_alignment": "Deep",
                "industry_language": "Professional",
                "alignment_confidence": 0.95
            },
            "improvement_summary": "Improved.",
            "estimated_quality_gain": 15
        }

        mock_execute.return_value = AIStructuredResponse(
            provider="ollama",
            model="llama3",
            latency_ms=150.0,
            prompt_version="1.0.0",
            created_at=datetime.utcnow(),
            raw_response={},
            parsed_response=mock_output,
            usage=TokenUsage(prompt_tokens=100, completion_tokens=100, total_tokens=200),
            token_fields={}
        )

        # 1. POST Optimize Cover Letter
        opt_req = {
            "cover_letter_id": str(self.cover_letter_id),
            "job_description": "We need python engineers"
        }
        response = self.client.post("/api/v1/ai/cover-letter/optimize", json=opt_req)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("id", data)
        self.assertEqual(data["quality_score"]["overall_score"], 92)
        opt_id = data["id"]

        # 2. GET Specific Optimization
        get_resp = self.client.get(f"/api/v1/ai/cover-letter/optimization/{opt_id}")
        self.assertEqual(get_resp.status_code, 200)
        self.assertEqual(get_resp.json()["id"], opt_id)

        # GET Specific Optimization - Wrong user (Other Client)
        get_other = self.other_client.get(f"/api/v1/ai/cover-letter/optimization/{opt_id}")
        self.assertEqual(get_other.status_code, 404)

        # 3. GET Optimizations List
        list_resp = self.client.get("/api/v1/ai/cover-letter/optimizations")
        if list_resp.status_code != 200:
            print("Optimizations list response error:", list_resp.json())
        self.assertEqual(list_resp.status_code, 200)
        self.assertGreaterEqual(list_resp.json()["total"], 1)

        # GET Optimizations List for specific cover letter
        list_cl_resp = self.client.get(f"/api/v1/ai/cover-letter/optimizations?cover_letter_id={self.cover_letter_id}")
        self.assertEqual(list_cl_resp.status_code, 200)
        self.assertGreaterEqual(list_cl_resp.json()["total"], 1)

        # 4. DELETE Optimization
        del_resp = self.client.delete(f"/api/v1/ai/cover-letter/optimization/{opt_id}")
        self.assertEqual(del_resp.status_code, 200)

        # Verify deletion
        get_deleted = self.client.get(f"/api/v1/ai/cover-letter/optimization/{opt_id}")
        self.assertEqual(get_deleted.status_code, 404)

    def test_06_validation_failures(self):
        """Test that optimization requests fail gracefully with unsupported mode, empty cover letter, or invalid cover letter id."""
        # Unsupported mode
        opt_req = {
            "cover_letter_id": str(self.cover_letter_id),
            "job_description": "We need python engineers"
        }
        resp = self.client.post("/api/v1/ai/cover-letter/optimize?mode=INVALID_MODE", json=opt_req)
        self.assertEqual(resp.status_code, 400)
        self.assertIn("Unsupported optimization mode", resp.json()["message"])

        # Nonexistent cover letter
        opt_req_nonexistent = {
            "cover_letter_id": str(uuid.uuid4())
        }
        resp_nonexistent = self.client.post("/api/v1/ai/cover-letter/optimize", json=opt_req_nonexistent)
        self.assertEqual(resp_nonexistent.status_code, 400)
        self.assertIn("Cover letter not found", resp_nonexistent.json()["message"])
