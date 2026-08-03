import uuid
from typing import Any
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.settings import UserSettings
from app.repositories.settings_repository import SettingsRepository

class SettingsService:
    """Service layer enforcing business rules and validation for user settings."""

    ALLOWED_LANGUAGES = {"en-US", "en-GB", "es", "fr", "de", "hi"}
    ALLOWED_TIMEZONES = {"Asia/Kolkata", "UTC", "EST", "PST", "GMT", "CET"}
    ALLOWED_THEMES = {"dark"}
    ALLOWED_ACCENT_COLORS = {"indigo", "emerald", "blue", "cyan", "amber", "rose"}
    ALLOWED_DENSITIES = {"comfortable", "compact", "spacious"}
    ALLOWED_FONT_SIZES = {"sm", "md", "lg"}
    ALLOWED_RETENTION_POLICIES = {"90", "180", "365", "indefinite"}

    @classmethod
    def get_or_create_settings(cls, db: Session, user_id: uuid.UUID) -> UserSettings:
        """Retrieve existing user settings or auto-initialize default settings record."""
        settings = SettingsRepository.get_by_user_id(db, user_id)
        if not settings:
            settings = SettingsRepository.create_default(db, user_id)
        return settings

    @classmethod
    def update_general(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Validate and update general settings."""
        settings = cls.get_or_create_settings(db, user_id)

        if "language" in update_data and update_data["language"] and update_data["language"] not in cls.ALLOWED_LANGUAGES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid language '{update_data['language']}'. Must be one of: {sorted(cls.ALLOWED_LANGUAGES)}"
            )

        if "timezone" in update_data and update_data["timezone"] and update_data["timezone"] not in cls.ALLOWED_TIMEZONES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid timezone '{update_data['timezone']}'. Must be one of: {sorted(cls.ALLOWED_TIMEZONES)}"
            )

        return SettingsRepository.update_settings(db, settings, update_data)

    @classmethod
    def update_system(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Update system settings toggles."""
        settings = cls.get_or_create_settings(db, user_id)
        return SettingsRepository.update_settings(db, settings, update_data)

    @classmethod
    def update_appearance(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Validate and update appearance settings."""
        settings = cls.get_or_create_settings(db, user_id)

        if "theme" in update_data and update_data["theme"] and update_data["theme"] not in cls.ALLOWED_THEMES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid theme '{update_data['theme']}'. Must be one of: {sorted(cls.ALLOWED_THEMES)}"
            )

        if "accent_color" in update_data and update_data["accent_color"] and update_data["accent_color"] not in cls.ALLOWED_ACCENT_COLORS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid accent color '{update_data['accent_color']}'. Must be one of: {sorted(cls.ALLOWED_ACCENT_COLORS)}"
            )

        if "density" in update_data and update_data["density"] and update_data["density"] not in cls.ALLOWED_DENSITIES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid density '{update_data['density']}'. Must be one of: {sorted(cls.ALLOWED_DENSITIES)}"
            )

        if "font_size" in update_data and update_data["font_size"] and update_data["font_size"] not in cls.ALLOWED_FONT_SIZES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid font size '{update_data['font_size']}'. Must be one of: {sorted(cls.ALLOWED_FONT_SIZES)}"
            )

        return SettingsRepository.update_settings(db, settings, update_data)

    @classmethod
    def update_notifications(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Update notification settings toggles."""
        settings = cls.get_or_create_settings(db, user_id)
        return SettingsRepository.update_settings(db, settings, update_data)

    @classmethod
    def update_privacy(cls, db: Session, user_id: uuid.UUID, update_data: dict[str, Any]) -> UserSettings:
        """Validate and update privacy settings."""
        settings = cls.get_or_create_settings(db, user_id)

        if "retention_policy" in update_data and update_data["retention_policy"] and update_data["retention_policy"] not in cls.ALLOWED_RETENTION_POLICIES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid retention policy '{update_data['retention_policy']}'. Must be one of: {sorted(cls.ALLOWED_RETENTION_POLICIES)}"
            )

        return SettingsRepository.update_settings(db, settings, update_data)

    @classmethod
    def reset_defaults(cls, db: Session, user_id: uuid.UUID) -> UserSettings:
        """Reset user settings back to initial production defaults."""
        settings = cls.get_or_create_settings(db, user_id)
        return SettingsRepository.reset_to_defaults(db, settings)
