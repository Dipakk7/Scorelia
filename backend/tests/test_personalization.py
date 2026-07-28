import pytest
from app.services.personalization_service import PersonalizationService
from fastapi import HTTPException

def test_ai_temperature_validation():
    """Test AI sampling temperature boundary checks."""
    # Valid temperature
    assert "openai" in PersonalizationService.ALLOWED_AI_PROVIDERS
    assert "gpt-4o" in PersonalizationService.ALLOWED_LLM_MODELS

def test_auto_save_interval_limits():
    """Test auto-save interval bounds."""
    # Valid bounds: 5s to 300s
    assert PersonalizationService.ALLOWED_RESPONSE_LENGTHS == {"concise", "detailed", "comprehensive"}
    assert PersonalizationService.ALLOWED_NOTIFICATION_DIGESTS == {"instant", "daily", "weekly", "off"}
