# app/modules/agents/ats/validator.py

import uuid
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.modules.agents.exceptions import AgentValidationError


class ATSAgentValidator:
    """Validator class for ATS Agent inputs, database records, and AI responses."""

    @staticmethod
    def validate_resume_exists_and_owned(db: Session, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        """Ensures the resume exists and belongs to the user."""
        resume = db.query(Resume).filter(Resume.id == resume_id).first()
        if not resume:
            raise AgentValidationError(f"Resume with ID '{resume_id}' not found.")

        # Accept user_id as either str or UUID
        u_id = uuid.UUID(str(user_id)) if isinstance(user_id, str) else user_id
        if resume.user_id != u_id:
            raise AgentValidationError(f"Access denied: Resume '{resume_id}' does not belong to user '{user_id}'.")

        return resume

    @staticmethod
    def validate_parsed_data(resume: Resume) -> None:
        """Ensures the resume has parsed_data before processing."""
        if not resume.parsed_data or not isinstance(resume.parsed_data, dict):
            raise AgentValidationError("Resume must be parsed before it can be processed by the ATS Agent.")

    @staticmethod
    def validate_ai_response(response: Any, expected_keys: List[str]) -> None:
        """Validates AI structured responses."""
        if not isinstance(response, dict):
            raise AgentValidationError("AI response parser did not return a valid dictionary.")
        missing = [k for k in expected_keys if k not in response]
        if missing:
            raise AgentValidationError(f"AI response is missing required fields: {missing}")
