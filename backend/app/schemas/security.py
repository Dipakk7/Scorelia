import uuid
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., description="User's existing account password")
    new_password: str = Field(..., min_length=8, description="New password complying with complexity rules")
    confirm_password: str = Field(..., min_length=8, description="Confirmation of new password")
    logout_other_sessions: bool = Field(default=True, description="Optionally revoke all other active sessions")

class TwoFactorStatusResponse(BaseModel):
    is_enabled: bool
    method: str
    qr_code_url: str | None = None
    secret_key: str | None = None
    recovery_codes: list[str] = Field(default_factory=list)

class TwoFactorEnableRequest(BaseModel):
    code: str = Field(..., min_length=6, max_length=6, description="6-digit TOTP verification code")

class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    device_name: str
    browser: str
    platform: str
    ip_address: str
    location: str
    is_current: bool
    is_trusted: bool
    last_active_at: datetime

class TrustedDeviceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    device_name: str
    browser: str
    platform: str
    is_trusted: bool
    last_used_at: datetime

class LoginHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    browser: str
    platform: str
    ip_address: str
    location: str
    status: str
    risk_level: str
    created_at: datetime
