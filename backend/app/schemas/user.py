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
    
    # Profile fields
    bio: str | None = None
    location: str | None = None
    website: str | None = None
    linkedin: str | None = None
    github: str | None = None
    role: str | None = "Job Seeker"
    skills: list[str] | None = []
    education: list[dict] | None = []
    experience: list[dict] | None = []

    # Settings fields
    language: str = "en"
    timezone: str = "UTC"
    theme: str = "dark"

    # Notification preferences
    email_notifications: bool = True
    push_notifications: bool = True
    marketing_emails: bool = False

    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    full_name: str | None = None
    bio: str | None = None
    location: str | None = None
    website: str | None = None
    linkedin: str | None = None
    github: str | None = None
    role: str | None = None
    skills: list[str] | None = None
    education: list[dict] | None = None
    experience: list[dict] | None = None
    language: str | None = None
    timezone: str | None = None
    theme: str | None = None
    email_notifications: bool | None = None
    push_notifications: bool | None = None
    marketing_emails: bool | None = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str
    email: str
    provider: str
