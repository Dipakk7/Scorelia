import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, JSON, text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class UserSettings(SharedBase):
    """Database model storing user settings and configuration preferences."""
    __tablename__ = "user_settings"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    # General Preferences
    language: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'en-US'"))
    timezone: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'Asia/Kolkata'"))
    date_format: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'YYYY-MM-DD'"))
    time_format: Mapped[str] = mapped_column(String(10), nullable=False, server_default=text("'12h'"))
    default_module: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'general'"))
    items_per_page: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("25"))

    # System Preferences
    auto_save: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    cloud_sync: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    analytics_tracking: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    performance_mode: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    compact_layout: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    beta_features: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    email_notifications: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    smart_suggestions: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    sound_effects: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))

    # Appearance
    theme: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'dark'"))
    accent_color: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'indigo'"))
    density: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'comfortable'"))
    font_size: Mapped[str] = mapped_column(String(10), nullable=False, server_default=text("'md'"))
    dashboard_layout: Mapped[str] = mapped_column(String(30), nullable=False, server_default=text("'executive'"))

    # Privacy
    telemetry_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    retention_policy: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'365'"))
    export_requested: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))

    # Workspace Personalization (Phase 8)
    default_dashboard: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'executive'"))
    favorite_modules: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    pinned_modules: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    recent_modules_limit: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("5"))
    dashboard_widgets: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    sidebar_collapsed: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))

    # AI Preferences (Phase 8)
    default_ai_provider: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'openai'"))
    preferred_llm: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'gpt-4o'"))
    ai_response_length: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'detailed'"))
    ai_temperature: Mapped[float] = mapped_column(Float, nullable=False, server_default=text("0.7"))
    ai_suggestions_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    smart_recommendations: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))

    # Accessibility (Phase 8)
    reduced_motion: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    high_contrast: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))
    keyboard_navigation: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    screen_reader_mode: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("false"))

    # Productivity (Phase 8)
    keyboard_shortcuts: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    auto_save_interval: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("30"))
    session_timeout: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text("60"))
    startup_behavior: Mapped[str] = mapped_column(String(50), nullable=False, server_default=text("'dashboard'"))
    notification_digest: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'daily'"))

    # Metadata
    personalization_version: Mapped[str] = mapped_column(String(20), nullable=False, server_default=text("'v3.0.0'"))

    # Relationships
    user = relationship("User", backref="settings")
