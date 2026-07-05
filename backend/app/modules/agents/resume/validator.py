# app/modules/agents/resume/validator.py

import uuid
from typing import Any, Dict, List
from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.modules.agents.exceptions import AgentValidationError

class ResumeAgentValidator:
    """Validator class for Resume Agent inputs, DB state, and AI outputs."""

    @staticmethod
    def validate_resume_exists_and_owned(db: Session, resume_id: uuid.UUID, user_id: uuid.UUID) -> Resume:
        """Validates that a resume exists and belongs to the given user."""
        resume = db.query(Resume).filter(
            Resume.id == resume_id
        ).first()

        if not resume:
            raise AgentValidationError(f"Resume with ID '{resume_id}' not found.")

        # Handle user_id as string or uuid
        u_id = uuid.UUID(str(user_id)) if isinstance(user_id, str) else user_id
        if resume.user_id != u_id:
            raise AgentValidationError(f"Access denied: Resume '{resume_id}' does not belong to user '{user_id}'.")

        return resume

    @staticmethod
    def validate_parsed_data(resume: Resume) -> None:
        """Ensures the resume has been successfully parsed before processing agent tasks."""
        if not resume.parsed_data or not isinstance(resume.parsed_data, dict):
            raise AgentValidationError("Resume must be parsed before it can be processed by the Resume Agent.")

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
