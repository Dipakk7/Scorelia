import os
import sys
import unittest
from unittest.mock import MagicMock

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.config import settings
from app.services.parser.extractor import extract_pdf_text, extract_docx_text
from app.services.parser.parser_service import extract_entities
from app.services.parser.entity_extractor import (
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

FIXTURES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "fixtures"))

class TestParserAccuracy(unittest.TestCase):
    def setUp(self):
        self.sample_pdf = os.path.join(FIXTURES_DIR, "sample_resume.pdf")
        self.sample_docx = os.path.join(FIXTURES_DIR, "sample_resume.docx")
        
        # Extract text from fixtures to use in tests
        self.pdf_text = extract_pdf_text(self.sample_pdf)
        self.docx_text = extract_docx_text(self.sample_docx)

    def test_name_extraction(self):
        """Verify name is extracted correctly."""
        self.assertEqual(extract_name(self.pdf_text), "John Doe")
        self.assertEqual(extract_name(self.docx_text), "John Doe")

    def test_email_extraction(self):
        """Verify email is extracted correctly."""
        self.assertEqual(extract_email(self.pdf_text), "john.doe@email.com")
        self.assertEqual(extract_email(self.docx_text), "john.doe@email.com")

    def test_phone_extraction(self):
        """Verify phone number is extracted correctly."""
        self.assertEqual(extract_phone(self.pdf_text), "123-456-7890")
        self.assertEqual(extract_phone(self.docx_text), "123-456-7890")

    def test_skills_extraction(self):
        """Verify technical skills are extracted with correct casing and order."""
        expected_skills = ["Docker", "FastAPI", "Git", "GitHub", "Oracle", "Python", "PyTorch", "SQL"]
        
        pdf_skills = extract_skills(self.pdf_text)
        self.assertEqual(pdf_skills, expected_skills)
        
        docx_skills = extract_skills(self.docx_text)
        self.assertEqual(docx_skills, expected_skills)

    def test_links_extraction(self):
        """Verify unique links are extracted and normalized."""
        expected_links = [
            "https://linkedin.com/in/johndoe",
            "https://github.com/johndoe",
            "https://leetcode.com/johndoe",
            "https://johndoe.dev"
        ]
        
        pdf_links = extract_links(self.pdf_text)
        # Check that we have exactly these unique URLs
        self.assertEqual(set(pdf_links), set(expected_links))
        self.assertEqual(len(pdf_links), len(expected_links))
        
        docx_links = extract_links(self.docx_text)
        self.assertEqual(set(docx_links), set(expected_links))
        self.assertEqual(len(docx_links), len(expected_links))

    def test_education_extraction(self):
        """Verify education items are parsed correctly with degree, institution, and year."""
        # PDF Education
        pdf_edu = extract_education(self.pdf_text)
        self.assertEqual(len(pdf_edu), 2)
        
        # Item 1
        self.assertEqual(pdf_edu[0]["degree"], "B.Tech in Computer Science")
        self.assertEqual(pdf_edu[0]["institution"], "Stanford University")
        self.assertEqual(pdf_edu[0]["year"], "2020")
        self.assertIn("Stanford University", pdf_edu[0]["raw_text"])
        
        # Item 2
        self.assertEqual(pdf_edu[1]["degree"], "Master of Science in Artificial Intelligence")
        self.assertEqual(pdf_edu[1]["institution"], "MIT")
        self.assertEqual(pdf_edu[1]["year"], "2022")
        self.assertIn("MIT", pdf_edu[1]["raw_text"])

        # DOCX Education
        docx_edu = extract_education(self.docx_text)
        self.assertEqual(len(docx_edu), 2)
        self.assertEqual(docx_edu[0]["degree"], "B.Tech in Computer Science")
        self.assertEqual(docx_edu[0]["institution"], "Stanford University")
        self.assertEqual(docx_edu[0]["year"], "2020")
        
        self.assertEqual(docx_edu[1]["degree"], "Master of Science in Artificial Intelligence")
        self.assertEqual(docx_edu[1]["institution"], "MIT")
        self.assertEqual(docx_edu[1]["year"], "2022")

    def test_experience_extraction(self):
        """Verify work experience entries are parsed correctly."""
        # PDF Experience
        pdf_exp = extract_experience(self.pdf_text)
        self.assertEqual(len(pdf_exp), 2)
        
        # Item 1
        self.assertEqual(pdf_exp[0]["title"], "Software Engineer")
        self.assertEqual(pdf_exp[0]["company"], "Google")
        self.assertEqual(pdf_exp[0]["duration"], "2020-01 - Present")
        self.assertIn("FastAPI", pdf_exp[0]["description"])
        self.assertIn("Google", pdf_exp[0]["raw_text"])
        
        # Item 2
        self.assertEqual(pdf_exp[1]["title"], "ML Engineer")
        self.assertEqual(pdf_exp[1]["company"], "Meta")
        self.assertEqual(pdf_exp[1]["duration"], "2019-06 - 2019-08")
        self.assertIn("Deep Learning", pdf_exp[1]["description"])
        self.assertIn("Meta", pdf_exp[1]["raw_text"])

        # DOCX Experience
        docx_exp = extract_experience(self.docx_text)
        self.assertEqual(len(docx_exp), 2)
        self.assertEqual(docx_exp[0]["title"], "Software Engineer")
        self.assertEqual(docx_exp[0]["company"], "Google")
        self.assertEqual(docx_exp[0]["duration"], "2020-01 - Present")
        
        self.assertEqual(docx_exp[1]["title"], "ML Engineer")
        self.assertEqual(docx_exp[1]["company"], "Meta")
        self.assertEqual(docx_exp[1]["duration"], "2019-06 - 2019-08")

    def test_projects_extraction(self):
        """Verify personal/academic projects are parsed correctly."""
        # PDF Projects
        pdf_proj = extract_projects(self.pdf_text)
        self.assertEqual(len(pdf_proj), 1)
        self.assertEqual(pdf_proj[0]["name"], "CareerPilot AI")
        self.assertIn("parser backend", pdf_proj[0]["description"])
        self.assertEqual(set(pdf_proj[0]["technologies"]), {"Python", "FastAPI"})
        self.assertIn("CareerPilot AI", pdf_proj[0]["raw_text"])

        # DOCX Projects
        docx_proj = extract_projects(self.docx_text)
        self.assertEqual(len(docx_proj), 1)
        self.assertEqual(docx_proj[0]["name"], "CareerPilot AI")
        self.assertIn("parser backend", docx_proj[0]["description"])
        self.assertEqual(set(docx_proj[0]["technologies"]), {"Python", "FastAPI"})

    def test_certifications_extraction(self):
        """Verify certifications are parsed correctly."""
        expected_certs = ["Oracle AI Foundations", "OCI Architect Associate"]
        
        pdf_certs = extract_certifications(self.pdf_text)
        self.assertEqual(pdf_certs, expected_certs)
        
        docx_certs = extract_certifications(self.docx_text)
        self.assertEqual(docx_certs, expected_certs)

    def test_statistics_and_pipeline_output(self):
        """Verify the full pipeline entity wrapper, statistics, and metadata."""
        # Test flat entity pipeline output
        flat_entities = extract_entities(self.pdf_text)
        self.assertEqual(flat_entities["name"], "John Doe")
        self.assertEqual(flat_entities["email"], "john.doe@email.com")
        self.assertEqual(flat_entities["phone"], "123-456-7890")
        self.assertEqual(len(flat_entities["skills"]), 8)
        self.assertEqual(len(flat_entities["education"]), 2)
        self.assertEqual(len(flat_entities["experience"]), 2)
        self.assertEqual(len(flat_entities["projects"]), 1)
        self.assertEqual(len(flat_entities["certifications"]), 2)
        self.assertEqual(len(flat_entities["links"]), 4)

        # Test outer parsed data wrapping
        from app.services.parser.parser_service import parse_resume
        from app.models.resume import Resume
        from app.core.enums import ResumeStatus
        
        db = MagicMock()
        resume = Resume(
            id=MagicMock(),
            file_path=self.sample_pdf,
            file_type="pdf",
            status=ResumeStatus.UPLOADED,
            raw_text=self.pdf_text
        )
        
        # Mock db query
        db.query().filter().first.return_value = resume
        
        parsed_data = parse_resume(db, resume.id)
        
        self.assertEqual(parsed_data.parser_version, "v2")
        self.assertEqual(parsed_data.model, "en_core_web_sm")
        self.assertIsNotNone(parsed_data.parsed_at)
        
        stats = parsed_data.statistics
        self.assertEqual(stats.text_length, len(self.pdf_text))
        self.assertEqual(stats.skills_found, 8)
        self.assertEqual(stats.education_found, 2)
        self.assertEqual(stats.experience_found, 2)
        self.assertEqual(stats.projects_found, 1)
        self.assertEqual(stats.certifications_found, 2)
        
        data = parsed_data.data
        self.assertEqual(data.name.value, "John Doe")
        self.assertEqual(data.email.value, "john.doe@email.com")
        self.assertEqual(data.phone.value, "123-456-7890")
        self.assertEqual(len(data.skills.value), 8)
        self.assertEqual(len(data.links.value), 4)

if __name__ == "__main__":
    unittest.main()
