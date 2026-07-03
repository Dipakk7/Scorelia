import os
import sys
import uuid
import unittest
from fastapi.testclient import TestClient

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.config import settings
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_rewrite import AIResumeRewrite
from app.models.ai_resume_optimization import AIResumeOptimization
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.core.enums import ResumeStatus, StorageProvider
from app.services import auth_service
from app.schemas.user import UserCreate

from app.interview.dependencies import get_interview_service, get_interview_ai_service
from app.interview.services.workflow import InterviewWorkflow, InterviewWorkflowState
from app.interview.services.context import InterviewContext
from app.interview.services.ai_service import InterviewAIService
from app.interview.metrics import interview_metrics

class TestAIInterviewIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        db = SessionLocal()
        cls.db = db
        try:
            # Clean up old test user
            for email in ["int_integration@careerpilot.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(AIResumeReview).filter(AIResumeReview.user_id == test_user.id).delete()
                    db.query(AIResumeRewrite).filter(AIResumeRewrite.user_id == test_user.id).delete()
                    db.query(AIResumeOptimization).filter(AIResumeOptimization.user_id == test_user.id).delete()
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create test user
            user_in = UserCreate(
                email="int_integration@careerpilot.com",
                password="SecurePassword@2026",
                full_name="Integration User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create resume
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="int_res.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/int_res.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={"skills": ["Python"]}
            )
            db.add(cls.resume)
            db.flush()

            # Create review
            cls.review = AIResumeReview(
                user_id=cls.user_id,
                resume_id=cls.resume.id,
                review={"overall_score": 80},
                provider="mock",
                model="mock",
                prompt_version="1.0.0"
            )
            db.add(cls.review)

            # Create rewrite
            cls.rewrite = AIResumeRewrite(
                user_id=cls.user_id,
                resume_id=cls.resume.id,
                original_content={"text": "orig"},
                rewritten_content={"text": "rewritten"},
                rewrite_mode="STANDARD",
                provider="mock",
                model="mock",
                prompt_version="1.0.0"
            )
            db.add(cls.rewrite)

            # Create optimization
            cls.optimization = AIResumeOptimization(
                user_id=cls.user_id,
                resume_id=cls.resume.id,
                optimization_result={"suggestions": []},
                quality_score={"overall_score": 85},
                provider="mock",
                model="mock",
                prompt_version="1.0.0"
            )
            db.add(cls.optimization)

            # Create cover letter
            cls.cover_letter = AICoverLetter(
                user_id=cls.user_id,
                resume_id=cls.resume.id,
                company_name="Acme",
                job_title="Engineer",
                writing_style="PROFESSIONAL",
                generation_mode="STANDARD",
                generated_content="Dear Acme...",
                provider="mock",
                model="mock",
                prompt_version="1.0.0"
            )
            db.add(cls.cover_letter)

            db.commit()
            db.refresh(cls.resume)
            db.refresh(cls.review)
            db.refresh(cls.rewrite)
            db.refresh(cls.optimization)
            db.refresh(cls.cover_letter)
            cls.resume_id = cls.resume.id
        finally:
            db.close()

    @classmethod
    def tearDownClass(cls):
        db = SessionLocal()
        try:
            test_user = db.query(User).filter(User.email == "int_integration@careerpilot.com").first()
            if test_user:
                db.query(AIResumeReview).filter(AIResumeReview.user_id == test_user.id).delete()
                db.query(AIResumeRewrite).filter(AIResumeRewrite.user_id == test_user.id).delete()
                db.query(AIResumeOptimization).filter(AIResumeOptimization.user_id == test_user.id).delete()
                db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                db.delete(test_user)
            db.commit()
        finally:
            db.close()

    def setUp(self):
        self.db = SessionLocal()
        self.client = TestClient(app)

    def tearDown(self):
        self.db.close()

    def test_01_configuration(self):
        """Verify new configurations are present in settings."""
        self.assertEqual(settings.INTERVIEW_PROMPT_VERSION, "1.0.0")
        self.assertTrue(settings.INTERVIEW_CONTEXT_CACHE)
        self.assertEqual(settings.INTERVIEW_WORKFLOW_VERSION, "1.0.0")

    def test_02_workflow_states(self):
        """Verify Workflow State Enum and Transition Logic."""
        wf = InterviewWorkflow()
        self.assertEqual(wf.state, InterviewWorkflowState.CREATED)
        
        # Test transition
        wf.transition_to(InterviewWorkflowState.CONTEXT_READY)
        self.assertEqual(wf.state, InterviewWorkflowState.CONTEXT_READY)
        
        # Test states list
        states = InterviewWorkflow.get_all_states()
        self.assertIn("Created", states)
        self.assertIn("Context Ready", states)
        self.assertIn("Waiting For Questions", states)
        self.assertIn("Waiting For Answers", states)
        self.assertIn("Evaluation Pending", states)
        self.assertIn("Completed", states)
        self.assertIn("Cancelled", states)
        self.assertEqual(len(states), 7)

    def test_03_prompt_registry(self):
        """Verify prompt registry contains interview prompts."""
        # Get AI service dependency
        from app.ai.dependencies import get_ai_service
        ai_service = get_ai_service()
        
        # Initialize InterviewAIService (should register templates)
        int_ai_service = InterviewAIService(ai_service=ai_service)
        
        # Verify prompts are registered under namespace 'interview'
        registered_templates = ["system_prompt", "hr", "technical", "behavioral", "resume_based", "followup"]
        for t_name in registered_templates:
            template = ai_service.registry.get_prompt("interview", t_name)
            self.assertIsNotNone(template)
            self.assertEqual(template.metadata.name, t_name)
            self.assertEqual(template.metadata.version, "1.0.0")

    def test_04_dependency_injection(self):
        """Verify DI helper functions and metrics registration."""
        interview_metrics.reset()
        
        # Check callable
        self.assertTrue(callable(get_interview_ai_service))
        self.assertTrue(callable(get_interview_service))
        
        # Resolve via helper
        int_ai_service = get_interview_ai_service()
        self.assertIsNotNone(int_ai_service)
        self.assertEqual(interview_metrics.sessions_created, 0)
        self.assertEqual(interview_metrics.get_metrics()["dependencies_initialized"], 1)

    def test_05_health_check_endpoint(self):
        """Verify the health check endpoint returns interview module status."""
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        
        # Verify structure
        self.assertIn("interview", data)
        int_health = data["interview"]
        self.assertEqual(int_health["status"], "healthy")
        self.assertEqual(int_health["interview_module"], "healthy")
        self.assertEqual(int_health["prompt_registry"], "healthy")
        self.assertEqual(int_health["dependency_injection"], "healthy")
        self.assertEqual(int_health["workflow_skeleton"], "healthy")
        self.assertEqual(int_health["context_builder"], "healthy")

    def test_06_context_builder_graceful_missing(self):
        """Verify context builder handles empty inputs gracefully."""
        import asyncio
        ctx = asyncio.run(InterviewContext.build(
            db=self.db,
            user_id=uuid.uuid4(),
            resume_id=None,
            job_id=None
        ))
        self.assertIsNone(ctx.resume)
        self.assertIsNone(ctx.resume_review)
        self.assertIsNone(ctx.resume_rewrite)
        self.assertIsNone(ctx.resume_optimization)
        self.assertIsNone(ctx.company)
        self.assertIsNone(ctx.target_role)
        
        ctx_dict = ctx.to_dict()
        self.assertIsNone(ctx_dict["resume_id"])
        self.assertIsNone(ctx_dict["resume_review"])
        self.assertIsNone(ctx_dict["company"])
        self.assertIsNone(ctx_dict["target_role"])

    def test_07_context_builder_with_data(self):
        """Verify context builder loads database records correctly."""
        import asyncio
        db = SessionLocal()
        try:
            ctx = asyncio.run(InterviewContext.build(
                db=db,
                user_id=self.user_id,
                resume_id=self.resume_id,
                job_id=None
            ))
            self.assertIsNotNone(ctx.resume)
            self.assertIsNotNone(ctx.resume_review)
            self.assertIsNotNone(ctx.resume_rewrite)
            self.assertIsNotNone(ctx.resume_optimization)
            self.assertIsNotNone(ctx.cover_letter)
            self.assertEqual(ctx.company, "Acme")
            self.assertEqual(ctx.target_role, "Engineer")
            
            ctx_dict = ctx.to_dict()
            self.assertEqual(ctx_dict["resume_id"], str(self.resume_id))
            self.assertEqual(ctx_dict["resume_review"]["review"]["overall_score"], 80)
            self.assertEqual(ctx_dict["resume_rewrite"]["rewrite_mode"], "STANDARD")
            self.assertEqual(ctx_dict["resume_optimization"]["quality_score"]["overall_score"], 85)
            self.assertEqual(ctx_dict["company"], "Acme")
            self.assertEqual(ctx_dict["target_role"], "Engineer")
        finally:
            db.close()
