import uuid
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class WorkspacePersonalizationUpdate(BaseModel):
    default_dashboard: str | None = Field(default=None, description="Default landing dashboard layout")
    favorite_modules: list[str] | None = Field(default=None, description="List of favorite module IDs")
    pinned_modules: list[str] | None = Field(default=None, description="List of pinned module IDs")
    recent_modules_limit: int | None = Field(default=None, ge=1, le=20, description="Max recent modules count")
    dashboard_widgets: list[str] | None = Field(default=None, description="Visible dashboard widgets list")
    sidebar_collapsed: bool | None = Field(default=None, description="Default sidebar collapsed state")

class AIPersonalizationUpdate(BaseModel):
    default_ai_provider: str | None = Field(default=None, description="Primary AI provider (openai, anthropic, google_gemini, local_ollama)")
    preferred_llm: str | None = Field(default=None, description="Preferred LLM model string")
    ai_response_length: str | None = Field(default=None, description="Response length detail level (concise, detailed, comprehensive)")
    ai_temperature: float | None = Field(default=None, ge=0.0, le=2.0, description="LLM sampling temperature (0.0 to 2.0)")
    ai_suggestions_enabled: bool | None = Field(default=None, description="Enable AI real-time suggestions")
    smart_recommendations: bool | None = Field(default=None, description="Enable smart career recommendations")

class AccessibilityPersonalizationUpdate(BaseModel):
    reduced_motion: bool | None = Field(default=None, description="Enable reduced motion animations")
    high_contrast: bool | None = Field(default=None, description="Enable high contrast color mode")
    keyboard_navigation: bool | None = Field(default=None, description="Enable enhanced keyboard navigation ring")
    screen_reader_mode: bool | None = Field(default=None, description="Enable screen reader optimized ARIA announcements")

class ProductivityPersonalizationUpdate(BaseModel):
    keyboard_shortcuts: bool | None = Field(default=None, description="Enable global keyboard hotkeys")
    auto_save_interval: int | None = Field(default=None, ge=5, le=300, description="Background auto-save interval in seconds")
    session_timeout: int | None = Field(default=None, ge=15, le=480, description="Inactivity session timeout in minutes")
    startup_behavior: str | None = Field(default=None, description="Workspace initial startup page")
    notification_digest: str | None = Field(default=None, description="Notification summary frequency (instant, daily, weekly)")

class PersonalizationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID

    # Workspace
    default_dashboard: str
    favorite_modules: list[str] | None = None
    pinned_modules: list[str] | None = None
    recent_modules_limit: int
    dashboard_widgets: list[str] | None = None
    sidebar_collapsed: bool

    # AI
    default_ai_provider: str
    preferred_llm: str
    ai_response_length: str
    ai_temperature: float
    ai_suggestions_enabled: bool
    smart_recommendations: bool

    # Accessibility
    reduced_motion: bool
    high_contrast: bool
    keyboard_navigation: bool
    screen_reader_mode: bool

    # Productivity
    keyboard_shortcuts: bool
    auto_save_interval: int
    session_timeout: int
    startup_behavior: str
    notification_digest: str

    personalization_version: str
    updated_at: datetime
