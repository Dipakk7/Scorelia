import uuid
from typing import Any
from sqlalchemy.orm import Session
from app.models.settings import UserSettings
from app.repositories.settings_repository import SettingsRepository

class PersonalizationRepository:
    """Repository handling database operations for personalization features."""

    @staticmethod
    def get_personalization(db: Session, user_id: uuid.UUID) -> UserSettings:
        """Fetch or create UserSettings for user."""
        return SettingsRepository.get_by_user_id(db, user_id) or SettingsRepository.create_default(db, user_id)

    @staticmethod
    def update_personalization(db: Session, settings: UserSettings, update_data: dict[str, Any]) -> UserSettings:
        """Update personalization fields on UserSettings."""
        return SettingsRepository.update_settings(db, settings, update_data)
