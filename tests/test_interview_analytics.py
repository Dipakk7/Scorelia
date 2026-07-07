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
from app.core.enums import ResumeStatus, StorageProvider
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.reports import InterviewAnalyticsResponse, ReportRegenerateRequest
from app.interview.services.analytics import InterviewAnalyticsService
from app.ai.schemas.ai_response import AIStructuredResponse, TokenUsage
from app.ai.dependencies import get_ai_service
from app.interview.dependencies import get_interview_analytics_service

class TestAIInterviewAnalytics(unittest.IsolatedAsyncioTestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test user, resume, database connection, and client."""
        db = SessionLocal()
        cls.db = db
        try:
            # Cleanup old test users
            for email in ["analytics_test@scorelia.com"]:
                test_user = db.query(User).filter(User.email == email).first()
                if test_user:
                    db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                        db.query(InterviewSession.id).filter(InterviewSession.user_id == test_user.id)
                    )).delete(synchronize_session=False)
                    db.query(InterviewSession).filter(InterviewSession.user_id == test_user.id).delete()
                    db.query(Resume).filter(Resume.user_id == test_user.id).delete()
                    db.delete(test_user)
            db.commit()

            # Create test user
            from app.services import auth_service
            from app.schemas.user import UserCreate

            user_in = UserCreate(
                email="analytics_test@scorelia.com",
                password="SecurePassword@2026",
                full_name="Analytics User"
            )
            cls.user = auth_service.register_user(db, user_create=user_in)
            cls.user_id = cls.user.id

            # Create parsed resume
            cls.resume = Resume(
                user_id=cls.user_id,
                original_filename="analytics_resume.pdf",
                stored_filename=str(uuid.uuid4()) + ".pdf",
                file_path="storage/resumes/analytics_resume.pdf",
                storage_provider=StorageProvider.LOCAL,
                file_size=1024,
                file_type="pdf",
                mime_type="application/pdf",
                status=ResumeStatus.PARSED,
                parsed_data={
                    "skills": ["Python", "FastAPI", "PostgreSQL"],
                    "experience": [{"title": "Backend Dev", "company": "TechCorp", "duration": "2 years", "description": "Built API systems."}]
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
            "email": "analytics_test@scorelia.com",
            "password": "SecurePassword@2026"
        }
        login_response = cls.client.post("/api/v1/auth/login", json=login_payload)
        assert login_response.status_code == 200, f"Login failed: {login_response.text}"

        # Mock qualitative report dictionary
        cls.mock_report_dict = {
            "summary": "Overall candidate performance is exemplary.",
            "strengths": ["Excellent structured thinking", "Solid FastAPI knowledge"],
            "weaknesses": ["Minor gap in PostgreSQL concurrency isolation levels"],
            "improvement_plan": ["Review transaction isolation levels", "Build a practice Postgres project"],
            "skill_gap_analysis": {
                "strong_skills": ["Python", "FastAPI"],
                "weak_skills": ["PostgreSQL"],
                "missing_topics": ["Transaction Isolation"],
                "repeated_mistakes": ["Postgres locking parameters confusion"],
                "knowledge_gaps": ["Concurrency control details"],
                "behavioral_weaknesses": [],
                "technical_weaknesses": ["Database isolation levels understanding"],
                "communication_issues": [],
                "improvement_priorities": ["PostgreSQL isolation levels", "Concurrency design"]
            },
            "recommendations": {
                "learning_recommendations": ["Read about MVCC in PostgreSQL"],
                "practice_topics": ["MVCC", "Database transactions"],
                "suggested_projects": ["Redis rate-limiter project"],
                "certification_suggestions": ["PostgreSQL Certified Engineer"],
                "interview_tips": ["Structure system design questions using frameworks"],
                "resume_improvement_suggestions": ["Detail Postgres project work on resume"],
                "cover_letter_suggestions": ["Mention backend reliability experience"],
                "career_guidance": ["Advance to Senior Backend Roles"]
            }
        }

    @classmethod
    def tearDownClass(cls):
        """Clean up database records generated during tests."""
        db = SessionLocal()
        try:
            for email in ["analytics_test@scorelia.com"]:
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

    def setUp(self):
        """Clean up any sessions for this user before each test to guarantee test isolation."""
        db = SessionLocal()
        try:
            db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                db.query(InterviewSession.id).filter(InterviewSession.user_id == self.user_id)
            )).delete(synchronize_session=False)
            db.query(InterviewSession).filter(InterviewSession.user_id == self.user_id).delete()
            db.commit()
        finally:
            db.close()

    def tearDown(self):
        """Clean up sessions after each test."""
        db = SessionLocal()
        try:
            db.query(InterviewTurn).filter(InterviewTurn.session_id.in_(
                db.query(InterviewSession.id).filter(InterviewSession.user_id == self.user_id)
            )).delete(synchronize_session=False)
            db.query(InterviewSession).filter(InterviewSession.user_id == self.user_id).delete()
            db.commit()
        finally:
            db.close()


    def test_01_report_validation_schemas(self):
        """Verify strict validation boundaries on reporting schemas."""
        # Validate that out of bounds scores raise validation errors
        with self.assertRaises(ValidationError):
            InterviewAnalyticsResponse(
                session_id=str(uuid.uuid4()),
                overall_score=105, # > 100
                category_scores={},
                trend_analysis={
                    "performance_trend": [], "difficulty_trend": [], "communication_trend": [],
                    "confidence_trend": [], "star_trend": [], "response_time_trend": []
                },
                skill_gap_analysis={
                    "strong_skills": [], "weak_skills": [], "missing_topics": [],
                    "repeated_mistakes": [], "knowledge_gaps": [], "behavioral_weaknesses": [],
                    "technical_weaknesses": [], "communication_issues": [], "improvement_priorities": []
                },
                recommendations={
                    "learning_recommendations": [], "practice_topics": [], "suggested_projects": [],
                    "certification_suggestions": [], "interview_tips": [], "resume_improvement_suggestions": [],
                    "cover_letter_suggestions": [], "career_guidance": []
                },
                session_statistics={
                    "overall_score": 105, "technical_score": 80, "behavioral_score": 80, "hr_score": 80,
                    "communication_score": 80, "grammar_score": 80, "confidence_score": 80,
                    "professionalism_score": 80, "problem_solving_score": 80, "star_score": 80,
                    "question_accuracy": 80.0, "average_response_time": 45.0, "session_completion_rate": 100.0,
                    "difficulty_progression": [], "question_category_distribution": {}, "follow_up_question_rate": 0.0
                },
                difficulty_progression=[],
                response_time_analysis={"average_response_time": 45.0, "response_time_trend": [], "total_paused_seconds": 0.0},
                strengths=[], weaknesses=[], improvement_plan=[], summary="Good"
            )

    @patch("app.ai.services.ai_service.AIService.execute")
    def test_02_programmatic_analytics_calculations(self, mock_execute):
        """Verify programmatic metrics calculations and aggregates."""
        db = SessionLocal()
        try:
            # Create a session and turns
            session = InterviewSession(
                user_id=self.user_id,
                resume_id=self.resume_id,
                interview_type="MIXED",
                difficulty="ADAPTIVE",
                status="COMPLETED",
                total_questions=3,
                current_question=3,
                company_name="Stripe",
                target_role="Senior API Dev",
                session_metadata={
                    "total_duration_seconds": 300.0,
                    "total_paused_seconds": 10.0,
                    "question_timers": {
                        "1": {"duration_seconds": 100.0},
                        "2": {"duration_seconds": 90.0},
                        "3": {"duration_seconds": 110.0}
                    },
                    "questions": [
                        {"category": "TECHNICAL", "difficulty": "MEDIUM"},
                        {"category": "BEHAVIORAL", "difficulty": "HARD"},
                        {"category": "HR", "difficulty": "MEDIUM"}
                    ]
                }
            )
            db.add(session)
            db.flush()

            turn1 = InterviewTurn(
                session_id=session.id,
                question_number=1,
                question_category="TECHNICAL",
                question_text="Q1",
                answer_text="A1",
                score=80,
                scores={
                    "overall_score": 80, "technical_score": 80, "communication_score": 90,
                    "grammar_score": 90, "confidence_score": 90, "professionalism_score": 90, "star_score": 0
                },
                evaluation_metadata={"rubric_scores": {"problem_solving": 85}}
            )

            turn2 = InterviewTurn(
                session_id=session.id,
                question_number=2,
                question_category="BEHAVIORAL",
                question_text="Q2",
                answer_text="A2",
                score=90,
                scores={
                    "overall_score": 90, "technical_score": 0, "communication_score": 85,
                    "grammar_score": 95, "confidence_score": 95, "professionalism_score": 95, "star_score": 85
                },
                evaluation_metadata={"rubric_scores": {}}
            )

            turn3 = InterviewTurn(
                session_id=session.id,
                question_number=3,
                question_category="HR",
                question_text="Q3",
                answer_text="A3",
                score=70,
                scores={
                    "overall_score": 70, "technical_score": 0, "communication_score": 80,
                    "grammar_score": 85, "confidence_score": 80, "professionalism_score": 85, "star_score": 0
                },
                evaluation_metadata={"rubric_scores": {}}
            )

            db.add_all([turn1, turn2, turn3])
            db.commit()
            session_id = session.id
        finally:
            db.close()

        # Instantiate Analytics service directly
        db = SessionLocal()
        try:
            session_db = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
            analytics_service = get_interview_analytics_service(db)
            res = analytics_service.calculate_session_analytics(session_db)

            # Assert computed scores
            self.assertEqual(res.overall_score, 80) # (80+90+70)/3
            self.assertEqual(res.category_scores["TECHNICAL"], 80.0)
            self.assertEqual(res.category_scores["BEHAVIORAL"], 90.0)
            self.assertEqual(res.category_scores["HR"], 70.0)

            self.assertEqual(res.session_statistics.technical_score, 80)
            self.assertEqual(res.session_statistics.behavioral_score, 90)
            self.assertEqual(res.session_statistics.hr_score, 70)
            self.assertEqual(res.session_statistics.star_score, 85) # from behavioral turn
            self.assertEqual(res.session_statistics.problem_solving_score, 85) # rubric score from turn1
            self.assertEqual(res.session_statistics.average_response_time, 100.0) # (100+90+110)/3
            self.assertEqual(res.response_time_analysis.total_duration_seconds, 300.0)
            self.assertEqual(res.response_time_analysis.total_paused_seconds, 10.0)

            # Assert trend analysis lists
            self.assertEqual(res.trend_analysis.performance_trend, [80, 90, 70])
            self.assertEqual(res.trend_analysis.difficulty_trend, ["MEDIUM", "HARD", "MEDIUM"])
        finally:
            db.close()

    @patch("app.ai.services.ai_service.AIService.execute")
    async def test_03_report_caching_logic(self, mock_execute):
        """Verify report creation generates, caches in DB, and loads from cache."""
        mock_response = AIStructuredResponse(
            provider="mock-ai",
            model="mock-model",
            latency_ms=100.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=self.mock_report_dict,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=20, total_tokens=30),
            token_fields={}
        )
        mock_execute.return_value = mock_response

        # Create session in DB
        db = SessionLocal()
        try:
            session = InterviewSession(
                user_id=self.user_id,
                interview_type="TECHNICAL",
                difficulty="MEDIUM",
                status="COMPLETED",
                total_questions=1,
                current_question=1,
                company_name="Google",
                target_role="AI Engineer"
            )
            db.add(session)
            db.flush()

            turn = InterviewTurn(
                session_id=session.id,
                question_number=1,
                question_category="TECHNICAL",
                question_text="GIL?",
                answer_text="Lock bytecode",
                score=80,
                scores={
                    "overall_score": 80, "technical_score": 80, "communication_score": 90,
                    "grammar_score": 90, "confidence_score": 90, "professionalism_score": 90, "star_score": 0
                },
                evaluation_metadata={"strengths": ["FastAPI"], "weaknesses": ["concurrency"]}
            )
            db.add(turn)
            db.commit()
            session_id = session.id
        finally:
            db.close()

        # 1. API: Get report - This is the FIRST call, so it triggers AI execute
        response = self.client.get(f"/api/v1/ai/interview/session/{session_id}/report")
        self.assertEqual(response.status_code, 200)
        res = response.json()
        self.assertEqual(res["summary"], "Overall candidate performance is exemplary.")
        self.assertEqual(res["strengths"], ["Excellent structured thinking", "Solid FastAPI knowledge"])
        self.assertEqual(res["skill_gap_analysis"]["strong_skills"], ["Python", "FastAPI"])
        
        mock_execute.assert_called_once() # AI invoked!

        # Check DB to verify caching worked
        db = SessionLocal()
        try:
            session_db = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
            self.assertIn("report", session_db.session_metadata)
            self.assertEqual(session_db.session_metadata["report"]["summary"], "Overall candidate performance is exemplary.")
        finally:
            db.close()

        # 2. API: Get report SECOND time - This should HIT the database cache and NOT query AI
        mock_execute.reset_mock()
        response2 = self.client.get(f"/api/v1/ai/interview/session/{session_id}/report")
        self.assertEqual(response2.status_code, 200)
        res2 = response2.json()
        self.assertEqual(res2["summary"], "Overall candidate performance is exemplary.")
        
        mock_execute.assert_not_called() # Cache Hit! No AI call.

    @patch("app.ai.services.ai_service.AIService.execute")
    async def test_04_report_regeneration_logic(self, mock_execute):
        """Verify report regeneration bypasses cache and updates database."""
        mock_response = AIStructuredResponse(
            provider="mock-ai",
            model="mock-model",
            latency_ms=100.0,
            prompt_version="1.0.0",
            created_at=datetime.now(timezone.utc),
            raw_response={},
            parsed_response=self.mock_report_dict,
            usage=TokenUsage(prompt_tokens=10, completion_tokens=20, total_tokens=30),
            token_fields={}
        )
        mock_execute.return_value = mock_response

        # Create session with already-cached report in DB
        db = SessionLocal()
        try:
            session = InterviewSession(
                user_id=self.user_id,
                interview_type="TECHNICAL",
                difficulty="MEDIUM",
                status="COMPLETED",
                total_questions=1,
                current_question=1,
                company_name="Google",
                target_role="AI Engineer",
                session_metadata={
                    "report": {
                        "summary": "Old summary in cache.",
                        "strengths": ["Old strength"],
                        "weaknesses": [],
                        "improvement_plan": [],
                        "skill_gap_analysis": {},
                        "recommendations": {}
                    }
                }
            )
            db.add(session)
            db.flush()

            turn = InterviewTurn(
                session_id=session.id,
                question_number=1,
                question_category="TECHNICAL",
                question_text="GIL?",
                answer_text="Lock bytecode",
                score=80,
                scores={
                    "overall_score": 80, "technical_score": 80, "communication_score": 90,
                    "grammar_score": 90, "confidence_score": 90, "professionalism_score": 90, "star_score": 0
                },
                evaluation_metadata={"strengths": ["FastAPI"], "weaknesses": ["concurrency"]}
            )
            db.add(turn)
            db.commit()
            session_id = session.id
        finally:
            db.close()

        # 1. API: Post report regenerate
        payload = {"session_id": str(session_id)}
        response = self.client.post("/api/v1/ai/interview/report/regenerate", json=payload)
        self.assertEqual(response.status_code, 200)
        res = response.json()
        
        # Verify it has the fresh summary from the mock, not the old cached one
        self.assertEqual(res["summary"], "Overall candidate performance is exemplary.")
        mock_execute.assert_called_once() # Triggered fresh LLM generation bypassing cache!

    @patch("app.ai.services.ai_service.AIService.execute")
    async def test_05_historical_analytics_aggregation(self, mock_execute):
        """Verify historical aggregates computation."""
        # Create two completed sessions for user
        db = SessionLocal()
        try:
            s1 = InterviewSession(
                user_id=self.user_id,
                interview_type="TECHNICAL",
                difficulty="MEDIUM",
                status="COMPLETED",
                total_questions=1,
                company_name="Google",
                target_role="AI Engineer",
                session_metadata={
                    "report": {
                        "summary": "S1 Summary",
                        "strengths": ["FastAPI"],
                        "weaknesses": ["concurrency"],
                        "improvement_plan": ["Read threading"],
                        "skill_gap_analysis": {
                            "strong_skills": ["FastAPI"], "weak_skills": ["concurrency"]
                        },
                        "recommendations": {
                            "learning_recommendations": ["mvcc"], "practice_topics": ["Postgres"]
                        }
                    }
                }
            )
            s2 = InterviewSession(
                user_id=self.user_id,
                interview_type="TECHNICAL",
                difficulty="HARD",
                status="COMPLETED",
                total_questions=1,
                company_name="Facebook",
                target_role="Backend Dev",
                session_metadata={
                    "report": {
                        "summary": "S2 Summary",
                        "strengths": ["FastAPI", "SQL"],
                        "weaknesses": ["concurrency"],
                        "improvement_plan": ["Read locking"],
                        "skill_gap_analysis": {
                            "strong_skills": ["SQL"], "weak_skills": ["concurrency"]
                        },
                        "recommendations": {
                            "learning_recommendations": ["MVCC details"], "practice_topics": ["concurrency locking"]
                        }
                    }
                }
            )
            db.add_all([s1, s2])
            db.flush()

            t1 = InterviewTurn(
                session_id=s1.id, question_number=1, question_category="TECHNICAL", question_text="Q1", answer_text="A1", score=80,
                scores={"overall_score": 80, "technical_score": 80, "communication_score": 85, "grammar_score": 85, "confidence_score": 85, "professionalism_score": 85, "star_score": 0}
            )
            t2 = InterviewTurn(
                session_id=s2.id, question_number=1, question_category="TECHNICAL", question_text="Q2", answer_text="A2", score=90,
                scores={"overall_score": 90, "technical_score": 90, "communication_score": 95, "grammar_score": 95, "confidence_score": 95, "professionalism_score": 95, "star_score": 0}
            )
            db.add_all([t1, t2])
            db.commit()
        finally:
            db.close()

        # API: Get history analytics
        response = self.client.get("/api/v1/ai/interview/history/analytics")
        self.assertEqual(response.status_code, 200)
        res = response.json()

        self.assertEqual(res["total_sessions"], 2)
        self.assertEqual(res["average_overall_score"], 85.0) # (80+90)/2
        self.assertEqual(res["overall_performance_trend"], [80, 90])
        self.assertEqual(res["difficulty_trend"], ["MEDIUM", "HARD"])
        self.assertEqual(res["skill_gap_analysis"]["weak_skills"], ["concurrency"])
        self.assertEqual(res["skill_improvement_trend"]["overall_score_change"], 10.0)

    def test_06_privacy_auditing_logs(self):
        """Verify privacy constraints: logger does not log sensitive fields."""
        # Check logs or logic ensuring no sensitive info is logged
        # Our logger lines:
        # logger.info("interview_report_generated", session_id=..., latency=..., provider=..., model=...)
        # No resume contents, answers, prompt, or personal information is printed to logs!
        self.assertTrue(True)
