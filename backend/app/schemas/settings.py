import uuid
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class GeneralSettingsUpdate(BaseModel):
    language: str | None = Field(default=None, description="Preferred language code (e.g. en-US, es)")
    timezone: str | None = Field(default=None, description="Preferred timezone identifier (e.g. Asia/Kolkata)")
    date_format: str | None = Field(default=None, description="Preferred date display format (e.g. YYYY-MM-DD)")
    time_format: str | None = Field(default=None, description="Preferred time display format (12h or 24h)")
    default_module: str | None = Field(default=None, description="Default landing workspace module")
    items_per_page: int | None = Field(default=None, ge=5, le=100, description="Items per page limit")

class SystemSettingsUpdate(BaseModel):
    auto_save: bool | None = Field(default=None, description="Enable background auto-save")
    cloud_sync: bool | None = Field(default=None, description="Enable automatic cloud synchronization")
    analytics_tracking: bool | None = Field(default=None, description="Enable usage analytics telemetry")
    performance_mode: bool | None = Field(default=None, description="Enable high performance rendering mode")
    compact_layout: bool | None = Field(default=None, description="Enable compact workspace density")
    beta_features: bool | None = Field(default=None, description="Enable experimental beta features")
    email_notifications: bool | None = Field(default=None, description="Enable email alert notifications")
    smart_suggestions: bool | None = Field(default=None, description="Enable AI smart suggestions")
    sound_effects: bool | None = Field(default=None, description="Enable UI sound effects")

class AppearanceSettingsUpdate(BaseModel):
    theme: str | None = Field(default=None, description="Color mode theme (dark, light, system)")
    accent_color: str | None = Field(default=None, description="Primary accent color (indigo, emerald, blue, cyan, amber, rose)")
    density: str | None = Field(default=None, description="Workspace padding density (comfortable, compact, spacious)")
    font_size: str | None = Field(default=None, description="Typography scale (sm, md, lg)")
    dashboard_layout: str | None = Field(default=None, description="Dashboard layout preset (executive, compact, analytical)")

class NotificationSettingsUpdate(BaseModel):
    email_notifications: bool | None = Field(default=None, description="Enable email alert notifications")
    smart_suggestions: bool | None = Field(default=None, description="Enable AI smart suggestions")
    sound_effects: bool | None = Field(default=None, description="Enable audio sound effects")

class PrivacySettingsUpdate(BaseModel):
    telemetry_enabled: bool | None = Field(default=None, description="Enable anonymous telemetry data collection")
    retention_policy: str | None = Field(default=None, description="Data retention policy duration in days")
    export_requested: bool | None = Field(default=None, description="Request user data export archive")

class SettingsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID

    # General
    language: str
    timezone: str
    date_format: str
    time_format: str
    default_module: str
    items_per_page: int

    # System
    auto_save: bool
    cloud_sync: bool
    analytics_tracking: bool
    performance_mode: bool
    compact_layout: bool
    beta_features: bool
    email_notifications: bool
    smart_suggestions: bool
    sound_effects: bool

    # Appearance
    theme: str
    accent_color: str
    density: str
    font_size: str
    dashboard_layout: str

    # Privacy
    telemetry_enabled: bool
    retention_policy: str
    export_requested: bool

    # Personalization (Phase 8)
    default_dashboard: str
    favorite_modules: list[str] | None = None
    pinned_modules: list[str] | None = None
    recent_modules_limit: int
    dashboard_widgets: list[str] | None = None
    sidebar_collapsed: bool

    default_ai_provider: str
    preferred_llm: str
    ai_response_length: str
    ai_temperature: float
    ai_suggestions_enabled: bool
    smart_recommendations: bool

    reduced_motion: bool
    high_contrast: bool
    keyboard_navigation: bool
    screen_reader_mode: bool

    keyboard_shortcuts: bool
    auto_save_interval: int
    session_timeout: int
    startup_behavior: str
    notification_digest: str

    personalization_version: str
    created_at: datetime
    updated_at: datetime

class SettingsSummaryResponse(BaseModel):
    user_id: uuid.UUID
    language: str
    timezone: str
    theme: str
    accent_color: str
    updated_at: datetime
