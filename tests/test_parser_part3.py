import os
import sys
import uuid
import unittest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient

# Add backend to path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.db import SessionLocal
from app.models.user import User
from app.models.resume import Resume
from app.core.enums import ResumeStatus
from app.services.parser.entity_extractor import (
    get_nlp_model,
    get_skill_matcher,
    extract_name,
    extract_email,
    extract_phone,
    extract_links,
    extract_skills,
    extract_education,
    extract_experience,
    extract_projects,
    extract_certifications,
)
from app.services.parser.parser_service import extract_entities, parse_resume

class TestParserPart3(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up a test user and obtain authenticated TestClient cookies."""
        db = SessionLocal()
        cls.db = db
        try:
            # Delete any existing test user to clean up state
            test_user = db.query(User).filter(User.email == "parser_test@scorelia.com").first()
            if test_user:
                # Delete any associated resumes
                resumes = db.query(Resume).filter(Resume.user_id == test_user.id).all()
                for r in resumes:
                    db.delete(r)
                db.delete(test_user)
                db.commit()

            # Create test user
            from app.services import auth_service
            from app.schemas.user import UserCreate
            user_in = UserCreate(
                email="parser_test@scorelia.com",
                password="SecurePassword@2026",
                full_name="Parser Test User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id
            db.commit()
        finally:
            db.close()

        cls.client = TestClient(app)
        login_payload = {
            "email": "parser_test@scorelia.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            test_user = db.query(User).filter(User.email == "parser_test@scorelia.com").first()
            if test_user:
                resumes = db.query(Resume).filter(Resume.user_id == test_user.id).all()
                for r in resumes:
                    db.delete(r)
                db.delete(test_user)
                db.commit()
        finally:
            db.close()

    def test_lazy_loaders(self):
        """Verify lazy loading and caching of spaCy model and PhraseMatcher."""
        nlp1 = get_nlp_model()
        nlp2 = get_nlp_model()
        self.assertIs(nlp1, nlp2, "get_nlp_model should return the cached instance.")

        matcher1 = get_skill_matcher()
        matcher2 = get_skill_matcher()
        self.assertIs(matcher1, matcher2, "get_skill_matcher should return the cached instance.")

    def test_extract_email(self):
        """Verify regex extraction of email address."""
        text = "Hello, my email is test.user_123@sub.domain.com. Please write me."
        self.assertEqual(extract_email(text), "test.user_123@sub.domain.com")
        self.assertIsNone(extract_email("No email here."))

    def test_extract_phone(self):
        """Verify regex extraction of various phone number formats."""
        formats = [
            ("+91 9876543210", "+91 987-654-3210"),
            ("+91-9876543210", "+91 987-654-3210"),
            ("9876543210", "987-654-3210"),
            ("(123) 456-7890", "123-456-7890"),
            ("123.456.7890", "123-456-7890"),
        ]
        for num_str, expected in formats:
            text = f"Contact me at {num_str} today."
            self.assertEqual(extract_phone(text), expected)
        self.assertIsNone(extract_phone("No phone here."))

    def test_extract_links(self):
        """Verify extraction of unique social/portfolio URLs."""
        text = (
            "Check my github: https://github.com/myuser, "
            "linkedin: https://www.linkedin.com/in/myprofile and website: http://myportfolio.dev. "
            "Duplicate github: https://github.com/myuser. Also ignore user@domain.com."
        )
        links = extract_links(text)
        self.assertIn("https://github.com/myuser", links)
        self.assertIn("https://www.linkedin.com/in/myprofile", links)
        self.assertIn("http://myportfolio.dev", links)
        self.assertNotIn("user@domain.com", links)
        self.assertEqual(len(links), 3, "Links should be unique and non-email.")

    def test_extract_name(self):
        """Verify name extraction returns first PERSON entity in first 500 chars."""
        # Simple name detection
        text = "John Doe\nSoftware Engineer\nSpecialist in Python..."
        name = extract_name(text)
        self.assertEqual(name, "John Doe")

        # Name outside 500 characters should not be detected
        long_text = "A" * 600 + "\nJane Doe\n"
        self.assertIsNone(extract_name(long_text))

    def test_extract_skills(self):
        """Verify skill matching detects TECH_SKILLS and preserves exact TECH_SKILLS casing."""
        text = "I love python, FASTAPI, and PyTorch."
        skills = extract_skills(text)
        # Expected from skills_data.py (cased properly): "Python", "FastAPI", "PyTorch"
        self.assertIn("Python", skills)
        self.assertIn("FastAPI", skills)
        self.assertIn("PyTorch", skills)

    def test_section_heuristics(self):
        """Verify simple section heuristic partition based on headers."""
        resume_text = (
            "John Doe\n"
            "Education:\n"
            "BS in Computer Science, State University, 2020\n"
            "Experience:\n"
            "Software Engineer, Tech Corp, 2020-Present\n"
            "Projects\n"
            "Scorelia: Side project.\n"
            "Certifications\n"
            "AWS Certified Developer\n"
            "FastAPI Expert Certification"
        )
        
        education = extract_education(resume_text)
        self.assertEqual(len(education), 1)
        self.assertIn("BS in Computer Science", education[0]["raw_text"])

        experience = extract_experience(resume_text)
        self.assertEqual(len(experience), 1)
        self.assertIn("Software Engineer, Tech Corp", experience[0]["raw_text"])

        projects = extract_projects(resume_text)
        self.assertEqual(len(projects), 1)
        self.assertIn("Scorelia", projects[0]["raw_text"])

        certifications = extract_certifications(resume_text)
        self.assertEqual(len(certifications), 2)
        self.assertIn("AWS Certified Developer", certifications)
        self.assertIn("FastAPI Expert Certification", certifications)

    def test_orchestration_and_endpoint(self):
        """Verify parse_resume service function and POST parse endpoint."""
        db = SessionLocal()
        try:
            # 1. Create a dummy resume record
            resume = Resume(
                user_id=self.user_id,
                original_filename="test_resume.pdf",
                stored_filename=f"{uuid.uuid4()}.pdf",
                file_path="storage/resumes/dummy_path.pdf",
                file_size=100,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.UPLOADED,
                raw_text="Alice Smith\nEmail: alice@test.com\nPhone: (123) 456-7890\nSkills: Python, FastAPI\nEducation\nMS in CS at MIT, 2022"
            )
            db.add(resume)
            db.commit()
            db.refresh(resume)

            # 2. Run parse_resume service method
            parsed_data = parse_resume(db, resume.id)
            self.assertEqual(parsed_data.data.name.value, "Alice Smith")
            self.assertEqual(parsed_data.data.email.value, "alice@test.com")
            self.assertEqual(parsed_data.data.phone.value, "123-456-7890")
            self.assertIn("Python", parsed_data.data.skills.value)
            self.assertIn("FastAPI", parsed_data.data.skills.value)
            self.assertEqual(resume.status, ResumeStatus.PARSED)
            self.assertEqual(resume.parsed_data["parser_version"], "v2")

            # 3. Test API parsing endpoint
            # Create another resume record to parse via HTTP
            resume_api = Resume(
                user_id=self.user_id,
                original_filename="api_resume.pdf",
                stored_filename=f"{uuid.uuid4()}.pdf",
                file_path="storage/resumes/dummy_api_path.pdf",
                file_size=120,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.UPLOADED,
                raw_text="Bob Jones\nEmail: bob@test.com\nPhone: 123.456.7890\nSkills: Go, Docker\nExperience\nGo Dev at Uber, 2021"
            )
            db.add(resume_api)
            db.commit()
            db.refresh(resume_api)

            response = self.client.post(f"/api/v1/resumes/{resume_api.id}/parse")
            self.assertEqual(response.status_code, 200, response.text)
            
            resp_data = response.json()
            self.assertEqual(resp_data["message"], "Resume parsed successfully")
            self.assertEqual(resp_data["status"], "PARSED")
            self.assertEqual(resp_data["parsed_data"]["data"]["name"]["value"], "Bob Jones")
            self.assertEqual(resp_data["parsed_data"]["data"]["email"]["value"], "bob@test.com")
            self.assertEqual(resp_data["parsed_data"]["data"]["phone"]["value"], "123-456-7890")
            self.assertIn("Go", resp_data["parsed_data"]["data"]["skills"]["value"])
            self.assertIn("Docker", resp_data["parsed_data"]["data"]["skills"]["value"])

        finally:
            db.close()

if __name__ == "__main__":
    unittest.main()
