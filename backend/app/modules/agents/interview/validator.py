# app/modules/agents/interview/validator.py

import uuid
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.modules.agents.exceptions import AgentValidationError

class InterviewAgentValidator:
    """Validator class for Interview Agent inputs, DB state, and AI outputs."""

    @staticmethod
    def validate_resume_exists_and_owned(db: Session, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        """Validates that a resume exists and belongs to the given user."""
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            raise AgentValidationError(f"Resume with ID '{resume_id}' not found.")

        u_id = uuid.UUID(str(user_id)) if isinstance(user_id, str) else user_id
        if resume.user_id != u_id:
            raise AgentValidationError(f"Access denied: Resume '{resume_id}' does not belong to user '{user_id}'.")

        return resume

    @staticmethod
    def validate_session_exists_and_owned(db: Session, session_id: uuid.UUID, user_id: uuid.UUID) -> InterviewSession:
        """Validates that an interview session exists and belongs to the given user."""
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        if not session:
            raise AgentValidationError(f"Interview session with ID '{session_id}' not found.")

        u_id = uuid.UUID(str(user_id)) if isinstance(user_id, str) else user_id
        if session.user_id != u_id:
            raise AgentValidationError(f"Access denied: Interview session '{session_id}' does not belong to user '{user_id}'.")

        return session

    @staticmethod
    def validate_difficulty(difficulty: str) -> None:
        """Enforces valid difficulty levels."""
        val = difficulty.upper().strip()
        if val not in ("EASY", "MEDIUM", "HARD", "ADAPTIVE"):
            raise AgentValidationError(f"Unsupported difficulty level: '{difficulty}'.")

    @staticmethod
    def validate_interview_type(interview_type: str) -> None:
        """Enforces valid interview types."""
        val = interview_type.upper().strip()
        supported = ("BEHAVIORAL", "TECHNICAL", "FIT", "HR", "SYSTEM_DESIGN", "RESUME_BASED", "MIXED")
        if val not in supported:
            raise AgentValidationError(f"Unsupported interview type: '{interview_type}'. Choose from {supported}")

    @staticmethod
    def validate_ai_response(response: Any, expected_keys: List[str]) -> None:
        """Validates structured response from AI service."""
        if not isinstance(response, dict):
            raise AgentValidationError("AI response parser did not return a valid dictionary.")
        missing = [k for k in expected_keys if k not in response]
        if missing:
            raise AgentValidationError(f"AI response is missing required fields: {missing}")

    @staticmethod
    def validate_tool_response(response: Any, expected_type: Any = None) -> None:
        """Validates responses returned from internal tools / services."""
        if response is None:
            raise AgentValidationError("Tool response was empty.")
        if expected_type and not isinstance(response, expected_type):
            raise AgentValidationError(f"Tool response type mismatch. Expected {expected_type}, got {type(response)}")
