from datetime import datetime
from typing import List
from sqlalchemy import String, text, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class User(SharedBase):
    """User database model mapping to the users table."""
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )
    hashed_password: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    auth_provider: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        server_default=text("'LOCAL'")
    )
    provider_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    profile_picture: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
    is_active: Mapped[bool] = mapped_column(
        nullable=False,
        default=True
    )
    is_verified: Mapped[bool] = mapped_column(
        nullable=False,
        default=False
    )
    last_login: Mapped[datetime | None] = mapped_column(
        nullable=True
    )

    # User Profile Fields
    bio: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True
    )
    location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    website: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    linkedin: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    github: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    role: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        default="Job Seeker",
        server_default=text("'Job Seeker'")
    )
    skills: Mapped[list[str] | None] = mapped_column(
        JSON,
        nullable=True,
        default=list
    )
    education: Mapped[list[dict] | None] = mapped_column(
        JSON,
        nullable=True,
        default=list
    )
    experience: Mapped[list[dict] | None] = mapped_column(
        JSON,
        nullable=True,
        default=list
    )

    # User Settings Fields
    language: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="en",
        server_default=text("'en'")
    )
    timezone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="UTC",
        server_default=text("'UTC'")
    )
    theme: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="dark",
        server_default=text("'dark'")
    )

    # Notification Settings
    email_notifications: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("true")
    )
    push_notifications: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
        server_default=text("true")
    )
    marketing_emails: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false")
    )

    resumes: Mapped[List["Resume"]] = relationship("Resume", back_populates="user", cascade="all, delete-orphan")

