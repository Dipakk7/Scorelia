import pytest
from app.services.settings_service import SettingsService
from app.schemas.settings import GeneralSettingsUpdate, AppearanceSettingsUpdate

def test_settings_service_validation():
    """Test service layer validation rules for user settings."""
    # Allowed languages
    assert "en-US" in SettingsService.ALLOWED_LANGUAGES
    assert "es" in SettingsService.ALLOWED_LANGUAGES
    assert "invalid_lang" not in SettingsService.ALLOWED_LANGUAGES

    # Allowed themes
    assert "dark" in SettingsService.ALLOWED_THEMES
    assert "light" not in SettingsService.ALLOWED_THEMES
    assert "system" not in SettingsService.ALLOWED_THEMES

    # Allowed accent colors
    assert "indigo" in SettingsService.ALLOWED_ACCENT_COLORS
    assert "emerald" in SettingsService.ALLOWED_ACCENT_COLORS

def test_pydantic_schema_serialization():
    """Test Pydantic schema validation for Settings requests."""
    gen_req = GeneralSettingsUpdate(language="en-US", timezone="Asia/Kolkata", items_per_page=50)
    assert gen_req.language == "en-US"
    assert gen_req.timezone == "Asia/Kolkata"
    assert gen_req.items_per_page == 50

    app_req = AppearanceSettingsUpdate(theme="dark", accent_color="emerald", font_size="lg")
    assert app_req.theme == "dark"
    assert app_req.accent_color == "emerald"
    assert app_req.font_size == "lg"
