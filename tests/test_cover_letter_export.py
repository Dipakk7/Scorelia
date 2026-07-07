import os
import sys
import uuid
import unittest
from datetime import datetime
from fastapi.testclient import TestClient

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus, StorageProvider
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.models.ai_cover_letter_optimization import AICoverLetterOptimization
from app.cover_letter.models.ai_cover_letter_export import AICoverLetterExport
from app.cover_letter.services.export_service import CoverLetterExportService

class TestAICoverLetterExport(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test database connection, users, and clients."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["export_unit_test@scorelia.com", "export_unit_other@scorelia.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(AICoverLetterExport).filter(AICoverLetterExport.user_id == test_user.id).delete()
                    db.query(AICoverLetterOptimization).filter(AICoverLetterOptimization.user_id == test_user.id).delete()
                    db.query(AICoverLetter).filter(AICoverLetter.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create primary test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="export_unit_test@scorelia.com",
                password="SecurePassword@2026",
                full_name="Export User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create secondary test user
            other_user_in = UserCreate(
                email="export_unit_other@scorelia.com",
                password="SecurePassword@2026",
                full_name="Other Export User"
            )
            cls.other_user = auth_service.register_user(db, user_create=other_user_in)
            cls.other_user_id = cls.other_user.id

            # Create parsed resume for primary user
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "personal_info": {
                        "name": "Export User",
                        "email": "export_unit_test@scorelia.com",
                        "phone": "555-0199",
                        "links": ["linkedin.com/in/exportuser"]
                    },
                    "skills": ["Python", "FastAPI"],
                    "parser_version": "1.0.0"
                }
            )
            db.add(cls.resume)
            db.commit()
            db.refresh(cls.resume)
            cls.resume_id = cls.resume.id

            # Create cover letter for primary user
            cls.cover_letter = AICoverLetter(
                user_id=cls.user_id,
                resume_id=cls.resume_id,
                company_name="Google",
                job_title="Software Engineer",
                job_description="We need a Python engineer.",
                writing_style="PROFESSIONAL",
                generation_mode="STANDARD",
                generated_content="Subject: Software Engineer Application\n\nDear Hiring Team,\n\nI am writing to apply for the position.\n\nHere is my professional body text.\n\nSincerely,\n\nExport User",
                provider="ollama",
                model="qwen2.5:3b",
                prompt_version="1.0.0"
            )
            db.add(cls.cover_letter)
            db.commit()
            db.refresh(cls.cover_letter)
            cls.cover_letter_id = cls.cover_letter.id

            # Create optimization for primary user
            cls.optimization = AICoverLetterOptimization(
                user_id=cls.user_id,
                cover_letter_id=cls.cover_letter_id,
                optimization_result={
                    "original_content": cls.cover_letter.generated_content,
                    "optimized_content": "Subject: Optimized Software Engineer Application\n\nDear Google Team,\n\nI am thrilled to apply.\n\nThis is my optimized body text with Python and FastAPI.\n\nSincerely,\n\nExport User",
                    "suggestions": {},
                    "company_alignment": {},
                    "version_comparison": {}
                },
                quality_score=95,
                category_scores={"grammar": 95, "professional_tone": 95, "readability": 95, "ats": 95, "keyword_usage": 95, "company_alignment": 95, "job_alignment": 95, "personalization": 95, "structure": 95, "closing": 95},
                keyword_analysis={},
                provider="ollama",
                model="qwen2.5:3b",
                prompt_version="1.0.0"
            )
            db.add(cls.optimization)
            db.commit()
            db.refresh(cls.optimization)
            cls.optimization_id = cls.optimization.id

        finally:
            db.close()

        # Set up authenticated TestClients
        cls.client = TestClient(app)
        cls.other_client = TestClient(app)

        # Login primary user
        login_res = cls.client.post("/api/v1/auth/login", json={
            "email": "export_unit_test@scorelia.com",
            "password": "SecurePassword@2026"
        })
        assert login_res.status_code == 200, f"Primary login failed: {login_res.text}"

        # Login secondary user
        login_res_other = cls.other_client.post("/api/v1/auth/login", json={
            "email": "export_unit_other@scorelia.com",
            "password": "SecurePassword@2026"
        })
        assert login_res_other.status_code == 200, f"Other login failed: {login_res_other.text}"

    @classmethod
    def tearDownClass(cls):
        """Clean up test databases and created files."""
        db = SessionLocal()
        try:
            # Delete exports first
            db.query(AICoverLetterExport).filter(AICoverLetterExport.user_id.in_([cls.user_id, cls.other_user_id])).delete()
            db.query(AICoverLetterOptimization).filter(AICoverLetterOptimization.user_id.in_([cls.user_id, cls.other_user_id])).delete()
            db.query(AICoverLetter).filter(AICoverLetter.user_id.in_([cls.user_id, cls.other_user_id])).delete()
            db.query(Resume).filter(Resume.user_id.in_([cls.user_id, cls.other_user_id])).delete()
            
            # Delete users
            for email in ["export_unit_test@scorelia.com", "export_unit_other@scorelia.com"]:
                u = db.query(User).filter(User.email == email).first()
                if u:
                    db.delete(u)
            db.commit()
        finally:
            db.close()

        # Clean up files in storage
        export_dir = "storage/cover_letter_exports"
        if os.path.exists(export_dir):
            for f in os.listdir(export_dir):
                if f.endswith((".pdf", ".docx", ".md", ".txt")):
                    try:
                        os.remove(os.path.join(export_dir, f))
                    except:
                        pass

    def test_01_export_service_pdf(self):
        """Test generating PDF export through the service layer."""
        db = SessionLocal()
        try:
            service = CoverLetterExportService(db)
            
            import asyncio
            res = asyncio.run(service.export_cover_letter(
                user_id=self.user_id,
                cover_letter_id=self.cover_letter_id,
                export_format="PDF",
                template_name="Professional"
            ))

            self.assertIsNotNone(res)
            self.assertEqual(res.export_format, "PDF")
            self.assertEqual(res.template_name, "Professional")
            self.assertIn("cover_letter_Google_professional.pdf", res.file_name)
            
            # Check file on disk
            file_path = os.path.join(service.export_dir, f"{res.id}.pdf")
            self.assertTrue(os.path.exists(file_path))
            self.assertGreater(os.path.getsize(file_path), 0)
        finally:
            db.close()

    def test_02_export_service_docx_optimized(self):
        """Test generating DOCX export from optimized cover letter."""
        db = SessionLocal()
        try:
            service = CoverLetterExportService(db)
            import asyncio
            res = asyncio.run(service.export_cover_letter(
                user_id=self.user_id,
                cover_letter_id=self.cover_letter_id,
                export_format="DOCX",
                template_name="Modern",
                optimization_id=self.optimization_id
            ))

            self.assertIsNotNone(res)
            self.assertEqual(res.export_format, "DOCX")
            self.assertEqual(res.template_name, "Modern")
            self.assertEqual(res.optimization_id, self.optimization_id)
            self.assertIn("cover_letter_Google_modern.docx", res.file_name)
            
            file_path = os.path.join(service.export_dir, f"{res.id}.docx")
            self.assertTrue(os.path.exists(file_path))
            self.assertGreater(os.path.getsize(file_path), 0)
        finally:
            db.close()

    def test_03_export_service_md_and_txt(self):
        """Test Markdown and plain text exports."""
        db = SessionLocal()
        try:
            service = CoverLetterExportService(db)
            import asyncio
            
            # MD
            res_md = asyncio.run(service.export_cover_letter(
                user_id=self.user_id,
                cover_letter_id=self.cover_letter_id,
                export_format="MD",
                template_name="Minimal"
            ))
            self.assertEqual(res_md.export_format, "MD")
            self.assertTrue(os.path.exists(os.path.join(service.export_dir, f"{res_md.id}.md")))

            # TXT
            res_txt = asyncio.run(service.export_cover_letter(
                user_id=self.user_id,
                cover_letter_id=self.cover_letter_id,
                export_format="TXT",
                template_name="Corporate"
            ))
            self.assertEqual(res_txt.export_format, "TXT")
            self.assertTrue(os.path.exists(os.path.join(service.export_dir, f"{res_txt.id}.txt")))
        finally:
            db.close()

    def test_04_export_api_endpoints_pdf(self):
        """Test API endpoints for generating, downloading and deleting PDF exports."""
        # 1. Post export
        payload = {
            "cover_letter_id": str(self.cover_letter_id),
            "template_name": "Executive"
        }
        response = self.client.post("/api/v1/ai/cover-letter/export/pdf", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        export_id = data["id"]
        self.assertEqual(data["export_format"], "PDF")
        self.assertEqual(data["template_name"], "Executive")

        # 2. List exports
        list_res = self.client.get("/api/v1/ai/cover-letter/exports")
        self.assertEqual(list_res.status_code, 200)
        list_data = list_res.json()
        self.assertGreater(list_data["total"], 0)
        self.assertTrue(any(e["id"] == export_id for e in list_data["exports"]))

        # 3. Download export
        dl_res = self.client.get(f"/api/v1/ai/cover-letter/export/{export_id}")
        self.assertEqual(dl_res.status_code, 200)
        self.assertEqual(dl_res.headers["content-type"], "application/pdf")
        self.assertIn("attachment; filename=", dl_res.headers["content-disposition"])

        # 4. Delete export
        del_res = self.client.delete(f"/api/v1/ai/cover-letter/export/{export_id}")
        self.assertEqual(del_res.status_code, 200)
        self.assertTrue(del_res.json()["success"])

        # Check deleted from DB
        check_res = self.client.get(f"/api/v1/ai/cover-letter/export/{export_id}")
        self.assertEqual(check_res.status_code, 404)

    def test_05_export_api_endpoints_docx(self):
        """Test API endpoints for generating DOCX exports."""
        payload = {
            "cover_letter_id": str(self.cover_letter_id),
            "template_name": "Startup"
        }
        response = self.client.post("/api/v1/ai/cover-letter/export/docx", json=payload)
        self.assertEqual(response.status_code, 201)
        data = response.json()
        export_id = data["id"]
        self.assertEqual(data["export_format"], "DOCX")

        # Download DOCX
        dl_res = self.client.get(f"/api/v1/ai/cover-letter/export/{export_id}")
        self.assertEqual(dl_res.status_code, 200)
        self.assertEqual(dl_res.headers["content-type"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    def test_06_unauthorized_access(self):
        """Verify endpoints reject unauthorized users."""
        unauth_client = TestClient(app)
        
        # Post PDF
        res = unauth_client.post("/api/v1/ai/cover-letter/export/pdf", json={"cover_letter_id": str(self.cover_letter_id)})
        self.assertEqual(res.status_code, 401)

        # Get list
        res = unauth_client.get("/api/v1/ai/cover-letter/exports")
        self.assertEqual(res.status_code, 401)

        # Download
        res = unauth_client.get(f"/api/v1/ai/cover-letter/export/{uuid.uuid4()}")
        self.assertEqual(res.status_code, 401)

    def test_07_cross_user_isolation(self):
        """Verify users cannot access or delete other users' exports."""
        # 1. Create export for primary user
        payload = {
            "cover_letter_id": str(self.cover_letter_id),
            "template_name": "Government"
        }
        response = self.client.post("/api/v1/ai/cover-letter/export/pdf", json=payload)
        self.assertEqual(response.status_code, 201)
        export_id = response.json()["id"]

        # 2. Attempt to download with other user client
        res = self.other_client.get(f"/api/v1/ai/cover-letter/export/{export_id}")
        self.assertEqual(res.status_code, 404)

        # 3. Attempt to delete with other user client
        res_del = self.other_client.delete(f"/api/v1/ai/cover-letter/export/{export_id}")
        self.assertEqual(res_del.status_code, 404)

    def test_08_invalid_inputs_validation(self):
        """Verify validation errors are handled correctly."""
        # 1. Invalid template
        payload = {
            "cover_letter_id": str(self.cover_letter_id),
            "template_name": "InvalidTemplate"
        }
        res = self.client.post("/api/v1/ai/cover-letter/export/pdf", json=payload)
        self.assertEqual(res.status_code, 422)

        # 2. Non-existent cover letter
        payload = {
            "cover_letter_id": str(uuid.uuid4()),
            "template_name": "Minimal"
        }
        res = self.client.post("/api/v1/ai/cover-letter/export/pdf", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("not found or not owned by user", res.json()["message"])

