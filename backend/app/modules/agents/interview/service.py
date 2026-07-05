# app/modules/agents/interview/service.py

import uuid
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
import structlog

from app.interview.services.service import InterviewService
from app.interview.services.manager import InterviewSessionManager
from app.interview.services.analytics import InterviewAnalyticsService
from app.interview.services.ai_service import InterviewAIService
from app.interview.schemas.schemas import InterviewSessionCreate
from app.interview.crud.crud import InterviewCRUD
from app.modules.agents.interview.validator import InterviewAgentValidator
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator

logger = structlog.get_logger()

class InterviewAgentService:
    """Service class coordinating all business logic for the Interview Agent."""

    def __init__(
        self,
        db: Session,
        ai_service: Optional[AIService] = None,
        rag_orchestrator: Optional[RAGOrchestrator] = None
    ):
        self.db = db
        self.ai_service = ai_service or AIService(AIProviderFactory.get_provider())
        self.rag_orchestrator = rag_orchestrator
        self.interview_ai_service = InterviewAIService(self.ai_service)

    async def questions(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        count: int = 1
    ) -> List[Dict[str, Any]]:
        """Generates interview questions for an existing session."""
        InterviewAgentValidator.validate_session_exists_and_owned(self.db, session_id, user_id)

        service = InterviewService(self.db, self.interview_ai_service)
        turns = await service.generate_session_questions(
            session_id=session_id,
            user_id=user_id,
            mode="entire",
            count=count
        )

        InterviewAgentValidator.validate_tool_response(turns)

        return [
            {
                "id": str(turn.id),
                "session_id": str(turn.session_id),
                "question_number": turn.question_number,
                "question_category": turn.question_category,
                "question_text": turn.question_text,
                "answer_text": turn.answer_text,
                "feedback": turn.feedback,
                "score": turn.score,
                "created_at": turn.created_at,
                "updated_at": turn.updated_at
            }
            for turn in turns
        ]

    async def evaluate(
        self,
        session_id: uuid.UUID,
        user_id: uuid.UUID,
        answer: str
    ) -> Dict[str, Any]:
        """Evaluates answer text submission against the current turn question."""
        InterviewAgentValidator.validate_session_exists_and_owned(self.db, session_id, user_id)

        service = InterviewService(self.db, self.interview_ai_service)
        manager = InterviewSessionManager(self.db, service)

        res = await manager.submit_answer(
            session_id=session_id,
            user_id=user_id,
            answer_text=answer
        )

        InterviewAgentValidator.validate_tool_response(res)

        return {
            "overall_score": res.overall_score,
            "technical_score": res.technical_score,
            "communication_score": res.communication_score,
            "grammar_score": res.grammar_score,
            "confidence_score": res.confidence_score,
            "professionalism_score": res.professionalism_score,
            "star_score": res.star_score,
            "strengths": res.strengths,
            "weaknesses": res.weaknesses,
            "missing_topics": res.missing_topics,
            "improvements": res.improvements,
            "followup_questions": res.followup_questions,
            "summary": res.summary
        }

    async def mock(
        self,
        user_id: uuid.UUID,
        resume_id: Optional[uuid.UUID] = None,
        job_id: Optional[uuid.UUID] = None,
        company_name: Optional[str] = "Target Company",
        target_role: Optional[str] = "Software Engineer",
        interview_type: Optional[str] = "BEHAVIORAL",
        difficulty: Optional[str] = "MEDIUM",
        total_questions: Optional[int] = 5
    ) -> Dict[str, Any]:
        """Creates a mock interview session and initializes it (generates first question)."""
        if resume_id:
            InterviewAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)

        InterviewAgentValidator.validate_difficulty(difficulty)
        InterviewAgentValidator.validate_interview_type(interview_type)

        session_create = InterviewSessionCreate(
            resume_id=resume_id,
            job_id=job_id,
            company_name=company_name,
            target_role=target_role,
            interview_type=interview_type,
            difficulty=difficulty,
            total_questions=total_questions
        )

        service = InterviewService(self.db, self.interview_ai_service)
        manager = InterviewSessionManager(self.db, service)

        db_session = await service.create_session(user_id=user_id, request=session_create)
        started_session = await manager.start_interview(session_id=db_session.id, user_id=user_id)

        InterviewAgentValidator.validate_tool_response(started_session)

        turns = [
            {
                "id": str(turn.id),
                "session_id": str(turn.session_id),
                "question_number": turn.question_number,
                "question_category": turn.question_category,
                "question_text": turn.question_text,
                "answer_text": turn.answer_text,
                "feedback": turn.feedback,
                "score": turn.score,
                "created_at": turn.created_at,
                "updated_at": turn.updated_at
            }
            for turn in started_session.turns
        ]

        return {
            "session_id": str(started_session.id),
            "user_id": str(started_session.user_id),
            "resume_id": str(started_session.resume_id) if started_session.resume_id else None,
            "job_id": str(started_session.job_id) if started_session.job_id else None,
            "company_name": started_session.company_name,
            "target_role": started_session.target_role,
            "interview_type": started_session.interview_type,
            "difficulty": started_session.difficulty,
            "status": started_session.status,
            "total_questions": started_session.total_questions,
            "current_question": started_session.current_question,
            "provider": started_session.provider,
            "model": started_session.model,
            "prompt_version": started_session.prompt_version,
            "session_metadata": started_session.session_metadata,
            "created_at": started_session.created_at,
            "updated_at": started_session.updated_at,
            "turns": turns
        }

    async def readiness(
        self,
        user_id: uuid.UUID,
        session_id: Optional[uuid.UUID] = None
    ) -> Dict[str, Any]:
        """Formulates an interview readiness report based on mock session history or active session."""
        service = InterviewService(self.db, self.interview_ai_service)
        analytics_service = InterviewAnalyticsService(self.db, service)

        if session_id:
            session = InterviewAgentValidator.validate_session_exists_and_owned(self.db, session_id, user_id)
            analytics = analytics_service.calculate_session_analytics(session)
            overall_score = analytics.overall_score
            strong_skills = analytics.skill_gap_analysis.strong_skills
            weak_skills = analytics.skill_gap_analysis.weak_skills
            recommendations = analytics.recommendations.learning_recommendations
        else:
            history = await analytics_service.get_history_analytics(user_id)
            overall_score = history.get("average_overall_score", 0.0)
            strong_skills = history.get("skill_gap_analysis", {}).get("strong_skills", [])
            weak_skills = history.get("skill_gap_analysis", {}).get("weak_skills", [])
            recommendations = history.get("recommendations", {}).get("learning_recommendations", [])

        # Readiness Rating Levels
        if overall_score >= 85:
            level = "EXCELLENT"
            feedback = "You are highly prepared for interviews. Keep refining your key details."
        elif overall_score >= 70:
            level = "GOOD"
            feedback = "You have solid capabilities. Address the remaining skill gaps."
        elif overall_score >= 50:
            level = "NEEDS_PRACTICE"
            feedback = "You show progress but require focused practice on technical or behavioral domains."
        else:
            level = "POOR"
            feedback = "Significant preparation needed. Complete mock interviews and learn key frameworks."

        return {
            "user_id": str(user_id),
            "session_id": str(session_id) if session_id else None,
            "readiness_score": float(overall_score),
            "readiness_level": level,
            "feedback": feedback,
            "strong_skills": strong_skills,
            "weak_skills": weak_skills,
            "recommendations": recommendations
        }
