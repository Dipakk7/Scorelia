from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str | None = None

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        # Pydantic's min_length=8 takes care of length, but let's double check or provide clear message if it fails.
        # Requirements:
        # - Minimum 8 characters
        # - At least one uppercase letter (A-Z)
        # - At least one lowercase letter (a-z)
        # - At least one digit (0-9)
        # - At least one special character (!@#$%^&*...)
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter (A-Z)")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain at least one lowercase letter (a-z)")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit (0-9)")
        
        # Check if there is at least one character that is not alphanumeric (i.e. special character)
        if not any(not c.isalnum() for c in v):
            raise ValueError("Password must contain at least one special character (!@#$%^&*...)")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str | None = None
    auth_provider: str
    profile_picture: str | None = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    last_login: datetime | None = None

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    full_name: str | None = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str
    email: str
    provider: str
