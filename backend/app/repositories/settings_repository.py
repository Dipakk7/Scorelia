import uuid
from typing import Any
from sqlalchemy.orm import Session
from app.models.settings import UserSettings

class SettingsRepository:
    """Repository handling database operations for UserSettings."""

    @staticmethod
    def get_by_user_id(db: Session, user_id: uuid.UUID) -> UserSettings | None:
        """Fetch user settings record by user_id."""
        return db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

    @staticmethod
    def create_default(db: Session, user_id: uuid.UUID) -> UserSettings:
        """Create initial default user settings record."""
        settings = UserSettings(
            user_id=user_id,
            favorite_modules=["resumes", "ats", "interview"],
            pinned_modules=["github", "agents"],
            dashboard_widgets=["stats", "timeline", "health"]
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
        return settings

    @staticmethod
    def update_settings(db: Session, settings: UserSettings, update_data: dict[str, Any]) -> UserSettings:
        """Update fields on an existing UserSettings record."""
        for field, value in update_data.items():
            if value is not None and hasattr(settings, field):
                setattr(settings, field, value)
        db.commit()
        db.refresh(settings)
        return settings

    @staticmethod
    def reset_to_defaults(db: Session, settings: UserSettings) -> UserSettings:
        """Reset all user settings back to initial production defaults."""
        defaults = {
            "language": "en-US",
            "timezone": "Asia/Kolkata",
            "date_format": "YYYY-MM-DD",
            "time_format": "12h",
            "default_module": "general",
            "items_per_page": 25,
            "auto_save": True,
            "cloud_sync": True,
            "analytics_tracking": True,
            "performance_mode": False,
            "compact_layout": False,
            "beta_features": False,
            "email_notifications": True,
            "smart_suggestions": True,
            "sound_effects": False,
            "theme": "dark",
            "accent_color": "indigo",
            "density": "comfortable",
            "font_size": "md",
            "dashboard_layout": "executive",
            "telemetry_enabled": True,
            "retention_policy": "365",
            "export_requested": False,
            # Personalization Defaults
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
            "personalization_version": "v3.0.0",
        }
        for field, val in defaults.items():
            setattr(settings, field, val)
        db.commit()
        db.refresh(settings)
        return settings
