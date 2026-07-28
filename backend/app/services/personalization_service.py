import uuid
from typing import Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.settings import UserSettings
from app.repositories.personalization_repository import PersonalizationRepository

class PersonalizationService:
    """Service validating personalization business rules."""

    ALLOWED_AI_PROVIDERS = {"openai", "anthropic", "google_gemini", "local_ollama"}
    ALLOWED_LLM_MODELS = {"gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "gemini-1.5-pro", "llama-3-70b"}
    ALLOWED_RESPONSE_LENGTHS = {"concise", "detailed", "comprehensive"}
    ALLOWED_STARTUP_BEHAVIORS = {"dashboard", "last_active", "analytics"}
    ALLOWED_NOTIFICATION_DIGESTS = {"instant", "daily", "weekly", "off"}

    @classmethod
    def get_personalization(cls, db: Session, user_id: uuid.UUID) -> UserSettings:
        """Retrieve user personalization settings."""
        return PersonalizationRepository.get_personalization(db, user_id)

    @classmethod
    def update_workspace(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Validate and update workspace personalization."""
        settings = cls.get_personalization(db, user_id)
        if "recent_modules_limit" in update_data and update_data["recent_modules_limit"] is not None:
            limit = update_data["recent_modules_limit"]
            if limit < 1 or limit > 20:
                raise HTTPException(status_code=400, detail="Recent modules limit must be between 1 and 20.")

        return PersonalizationRepository.update_personalization(db, settings, update_data)

    @classmethod
    def update_ai(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Validate and update AI preferences."""
        settings = cls.get_personalization(db, user_id)

        if "default_ai_provider" in update_data and update_data["default_ai_provider"]:
            prov = update_data["default_ai_provider"]
            if prov not in cls.ALLOWED_AI_PROVIDERS:
                raise HTTPException(status_code=400, detail=f"Invalid AI provider '{prov}'. Must be one of: {sorted(cls.ALLOWED_AI_PROVIDERS)}")

        if "preferred_llm" in update_data and update_data["preferred_llm"]:
            model = update_data["preferred_llm"]
            if model not in cls.ALLOWED_LLM_MODELS:
                raise HTTPException(status_code=400, detail=f"Invalid LLM model '{model}'. Must be one of: {sorted(cls.ALLOWED_LLM_MODELS)}")

        if "ai_temperature" in update_data and update_data["ai_temperature"] is not None:
            temp = update_data["ai_temperature"]
            if temp < 0.0 or temp > 2.0:
                raise HTTPException(status_code=400, detail="AI temperature must be between 0.0 and 2.0.")

        return PersonalizationRepository.update_personalization(db, settings, update_data)

    @classmethod
    def update_accessibility(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Update accessibility preferences."""
        settings = cls.get_personalization(db, user_id)
        return PersonalizationRepository.update_personalization(db, settings, update_data)

    @classmethod
    def update_productivity(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Validate and update productivity preferences."""
        settings = cls.get_personalization(db, user_id)

        if "auto_save_interval" in update_data and update_data["auto_save_interval"] is not None:
            interval = update_data["auto_save_interval"]
            if interval < 5 or interval > 300:
                raise HTTPException(status_code=400, detail="Auto-save interval must be between 5 and 300 seconds.")

        if "session_timeout" in update_data and update_data["session_timeout"] is not None:
            timeout = update_data["session_timeout"]
            if timeout < 15 or timeout > 480:
                raise HTTPException(status_code=400, detail="Session timeout must be between 15 and 480 minutes.")

        return PersonalizationRepository.update_personalization(db, settings, update_data)

    @classmethod
    def reset_personalization(cls, db: Session, user_id: uuid.UUID) -> UserSettings:
        """Reset personalization settings to default."""
        settings = cls.get_personalization(db, user_id)
        defaults = {
            "default_dashboard": "executive",
            "favorite_modules": ["resumes", "ats", "interview"],
            "pinned_modules": ["github", "agents"],
            "recent_modules_limit": 5,
            "dashboard_widgets": ["stats", "timeline", "health"],
            "sidebar_collapsed": False,
            "default_ai_provider": "openai",
            "preferred_llm": "gpt-4o",
            "ai_response_length": "detailed",
            "ai_temperature": 0.7,
            "ai_suggestions_enabled": True,
            "smart_recommendations": True,
            "reduced_motion": False,
            "high_contrast": False,
            "keyboard_navigation": True,
            "screen_reader_mode": False,
            "keyboard_shortcuts": True,
            "auto_save_interval": 30,
            "session_timeout": 60,
            "startup_behavior": "dashboard",
            "notification_digest": "daily",
        }
        return PersonalizationRepository.update_personalization(db, settings, defaults)
