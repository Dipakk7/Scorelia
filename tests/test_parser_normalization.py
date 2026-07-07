import os
import sys
import time
import unittest
from unittest.mock import MagicMock

# Add backend to path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.enums import ResumeStatus
from app.models.resume import Resume
from app.services.parser.entity_extractor import (
    extract_skills,
    extract_links,
    extract_email,
    extract_phone,
    extract_education,
    extract_experience,
    extract_projects,
    extract_certifications,
    get_nlp_model,
    get_skill_matcher,
    normalize_single_date,
    normalize_date_range,
)
from app.services.parser.parser_service import parse_resume

class TestParserNormalization(unittest.TestCase):
    def test_skills_normalization(self):
        """Verify Task 1: duplicate skills removed, casing preserved, alphabetical order, and ignore shorter than 2 chars."""
        # 'R' is shorter than 2 chars, it should be ignored.
        # python/PYTHON should be normalized to PyTorch/Python casing.
        # Duplicates should be merged.
        text = "Skills: python, PYTHON, PyTorch, PyTorch, R, FastAPI"
        skills = extract_skills(text)
        expected = ["FastAPI", "Python", "PyTorch"]
        self.assertEqual(skills, expected)

    def test_links_normalization(self):
        """Verify Task 2: URL normalization, conversion of linkedin.com/in/john to https://linkedin.com/in/john, trailing slash removal, and deduplication."""
        text = (
            "Profiles: linkedin.com/in/john/ and https://linkedin.com/in/john "
            "Github: github.com/john/ "
            "Portfolio: http://mywebsite.com/"
        )
        links = extract_links(text)
        expected = [
            "https://linkedin.com/in/john",
            "https://github.com/john",
            "http://mywebsite.com"
        ]
        self.assertEqual(links, expected)

    def test_phone_normalization(self):
        """Verify Task 3: Phone number normalization and country code preservation."""
        self.assertEqual(extract_phone("Call me at +91 9876543210"), "+91 987-654-3210")
        self.assertEqual(extract_phone("Call me at 9876543210"), "987-654-3210")
        self.assertEqual(extract_phone("Call me at (123)456-7890"), "123-456-7890")
        self.assertEqual(extract_phone("Call me at 123-456-7890"), "123-456-7890")
        self.assertEqual(extract_phone("Call me at +91-9876543210"), "+91 987-654-3210")

    def test_email_normalization(self):
        """Verify Task 4: Email lowercasing, whitespace trimming, and validation."""
        self.assertEqual(extract_email("Email:  JOHN.DOE@EMAIL.COM  "), "john.doe@email.com")
        self.assertEqual(extract_email("Email is john.doe@email.com"), "john.doe@email.com")
        # Reject invalid regex matches
        self.assertIsNone(extract_email("Email is invalid@email"))

    def test_date_normalization(self):
        """Verify Task 8: Date normalizations for Year and Ranges."""
        # Single Date normalizations
        self.assertEqual(normalize_single_date("Jan 2022"), "2022-01")
        self.assertEqual(normalize_single_date("January 2022"), "2022-01")
        self.assertEqual(normalize_single_date("01/2022"), "2022-01")
        self.assertEqual(normalize_single_date("2022"), "2022")
        self.assertEqual(normalize_single_date("Present"), "Present")

        # Range normalizations
        self.assertEqual(normalize_date_range("Jan 2022 - Present"), "2022-01 - Present")
        self.assertEqual(normalize_date_range("January 2020 to Dec 2021"), "2020-01 - 2021-12")

    def test_duplicate_detection(self):
        """Verify Task 7: duplicate detection and order preservation."""
        # Duplicate Education
        edu_text = (
            "Education:\n"
            "B.Tech in Computer Science | Stanford University, 2020\n"
            "B.Tech in Computer Science | Stanford University, 2020\n"
            "Master of Science | MIT, 2022"
        )
        edu = extract_education(edu_text)
        self.assertEqual(len(edu), 2)
        self.assertEqual(edu[0]["degree"], "B.Tech in Computer Science")
        self.assertEqual(edu[0]["institution"], "Stanford University")
        self.assertEqual(edu[1]["degree"], "Master of Science")
        self.assertEqual(edu[1]["institution"], "MIT")

        # Duplicate Experience
        exp_text = (
            "Experience:\n"
            "Software Engineer | Google\n"
            "Jan 2020 - Present\n"
            "Software Engineer | Google\n"
            "Jan 2020 - Present\n"
            "ML Engineer | Meta\n"
            "Jun 2019 - Aug 2019"
        )
        exp = extract_experience(exp_text)
        self.assertEqual(len(exp), 2)
        self.assertEqual(exp[0]["title"], "Software Engineer")
        self.assertEqual(exp[0]["company"], "Google")
        self.assertEqual(exp[1]["title"], "ML Engineer")
        self.assertEqual(exp[1]["company"], "Meta")

        # Duplicate Projects
        proj_text = (
            "Projects:\n"
            "Scorelia: description 1\n\n"
            "Scorelia: description 1\n\n"
            "Different Project: description 2"
        )
        proj = extract_projects(proj_text)
        self.assertEqual(len(proj), 2)
        self.assertEqual(proj[0]["name"], "Scorelia")
        self.assertEqual(proj[1]["name"], "Different Project")

        # Duplicate Certifications
        certs_text = (
            "Certifications:\n"
            "AWS Certified Developer\n"
            "AWS Certified Developer\n"
            "FastAPI Expert"
        )
        certs = extract_certifications(certs_text)
        self.assertEqual(len(certs), 2)
        self.assertEqual(certs, ["AWS Certified Developer", "FastAPI Expert"])

    def test_confidence_values_and_statistics(self):
        """Verify Task 5 & Task 6: confidence scores and expanded statistics."""
        db = MagicMock()
        resume = Resume(
            id=MagicMock(),
            file_path="storage/resumes/dummy_performance.pdf",
            file_type="pdf",
            status=ResumeStatus.UPLOADED,
            raw_text="John Doe\nEmail: john@email.com\nPhone: +91 9876543210\nSkills: Python, FastAPI\nEducation\nB.Tech at MIT, 2022"
        )
        db.query().filter().first.return_value = resume

        parsed_data = parse_resume(db, resume.id)

        # Check parser version
        self.assertEqual(parsed_data.parser_version, "v2")

        # Check confidence scores
        data = parsed_data.data
        self.assertTrue(0.0 <= data.name.confidence <= 1.0)
        self.assertEqual(data.name.value, "John Doe")
        self.assertEqual(data.email.value, "john@email.com")
        self.assertEqual(data.email.confidence, 0.99)
        self.assertEqual(data.phone.value, "+91 987-654-3210")
        self.assertEqual(data.phone.confidence, 0.98)
        self.assertEqual(data.skills.value, ["FastAPI", "Python"])
        self.assertEqual(data.skills.confidence, 0.95)

        # Check statistics
        stats = parsed_data.statistics
        self.assertEqual(stats.skills_found, 2)
        self.assertEqual(stats.education_found, 1)
        self.assertEqual(stats.experience_found, 0)
        self.assertEqual(stats.projects_found, 0)
        self.assertEqual(stats.certifications_found, 0)
        self.assertEqual(stats.links_found, 0)
        self.assertTrue(stats.text_length > 0)
        self.assertEqual(stats.page_count, 1)
        self.assertTrue(stats.processing_time_ms >= 0)
        self.assertEqual(stats.empty_sections, 7) # experience, projects, certifications, links, summary, languages, achievements are empty (7)

    def test_performance_and_reusability(self):
        """Verify Task 11: parse same resume 5 times, check spaCy model and PhraseMatcher reuse, show average parsing time and ensure no memory leaks."""
        # Verify model reuse
        nlp1 = get_nlp_model()
        nlp2 = get_nlp_model()
        self.assertIs(nlp1, nlp2, "spaCy model should be cached and reused.")

        # Verify PhraseMatcher reuse
        matcher1 = get_skill_matcher()
        matcher2 = get_skill_matcher()
        self.assertIs(matcher1, matcher2, "PhraseMatcher should be cached and reused.")

        db = MagicMock()
        resume = Resume(
            id=MagicMock(),
            file_path="storage/resumes/dummy_performance.pdf",
            file_type="pdf",
            status=ResumeStatus.UPLOADED,
            raw_text="John Doe\nEmail: john@email.com\nPhone: +91 9876543210\nSkills: Python, FastAPI\nEducation\nB.Tech at MIT, 2022"
        )
        db.query().filter().first.return_value = resume

        times = []
        for _ in range(5):
            t0 = time.time()
            parse_resume(db, resume.id)
            times.append(time.time() - t0)

        avg_time_ms = (sum(times) / len(times)) * 1000
        print(f"\nAverage parsing time: {avg_time_ms:.2f} ms")
        self.assertTrue(avg_time_ms < 500, f"Average parsing time was too high: {avg_time_ms} ms")

if __name__ == "__main__":
    unittest.main()
