# app/modules/agents/cover_letter/validator.py

import uuid
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.modules.agents.exceptions import AgentValidationError

class CoverLetterAgentValidator:
    """Validator class for Cover Letter Agent inputs, DB states, and AI outputs."""

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
    def validate_cover_letter_exists_and_owned(db: Session, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> AICoverLetter:
        """Validates that a cover letter exists and belongs to the given user."""
        cover_letter = db.query(AICoverLetter).filter(AICoverLetter.id == cover_letter_id).first()
        if not cover_letter:
            raise AgentValidationError(f"Cover letter with ID '{cover_letter_id}' not found.")

        u_id = uuid.UUID(str(user_id)) if isinstance(user_id, str) else user_id
        if cover_letter.user_id != u_id:
            raise AgentValidationError(f"Access denied: Cover letter '{cover_letter_id}' does not belong to user '{user_id}'.")

        return cover_letter

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
