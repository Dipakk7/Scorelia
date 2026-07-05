# app/modules/agents/learning/validator.py

import uuid
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.modules.agents.exceptions import AgentValidationError

class LearningAgentValidator:
    """Validator class for Learning Agent inputs, DB state, and AI outputs."""

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
    def validate_target_role(target_role: Optional[str]) -> str:
        """Validates that target role is non-empty."""
        if not target_role or not str(target_role).strip():
            raise AgentValidationError("Target role cannot be empty.")
        return str(target_role).strip()

    @staticmethod
    def validate_ai_response(response: Any, expected_keys: List[str]) -> None:
        """Validates structured response from AI service."""
        if not isinstance(response, dict):
            raise AgentValidationError("AI response parser did not return a valid dictionary.")
        missing = [k for k in expected_keys if k not in response]
        if missing:
            raise AgentValidationError(f"AI response is missing required fields: {missing}")
