import pytest
from app.services.security_service import SecurityService
from app.services.integration_service import IntegrationService
from fastapi import HTTPException

def test_password_complexity_validation():
    """Test password strength rules."""
    # Valid password
    SecurityService.validate_password_complexity("StrongP@ss123")

    # Short password
    with pytest.raises(HTTPException):
        SecurityService.validate_password_complexity("Pass1!")

    # Missing special char
    with pytest.raises(HTTPException):
        SecurityService.validate_password_complexity("StrongPass123")

    # Missing uppercase
    with pytest.raises(HTTPException):
        SecurityService.validate_password_complexity("strongp@ss123")

    # Missing number
    with pytest.raises(HTTPException):
        SecurityService.validate_password_complexity("StrongP@ssword")

def test_api_key_masking():
    """Test sensitive API key masking."""
    assert IntegrationService.mask_key("sk-proj-1234567890abcdef4a9b") == "sk-proj****4a9b"
    assert IntegrationService.mask_key("short") == "********"
    assert IntegrationService.mask_key(None) is None
