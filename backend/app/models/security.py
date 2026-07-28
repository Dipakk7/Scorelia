import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class UserSession(SharedBase):
    """SQLAlchemy model tracking user active device login sessions."""
    __tablename__ = "user_sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    device_name: Mapped[str] = mapped_column(String(255), nullable=False)
    browser: Mapped[str] = mapped_column(String(100), nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    ip_address: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(String(150), nullable=False, server_default="'Unknown'")
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_trusted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_active_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

class TrustedDevice(SharedBase):
    """SQLAlchemy model tracking authorized trusted devices."""
    __tablename__ = "trusted_devices"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    device_name: Mapped[str] = mapped_column(String(255), nullable=False)
    browser: Mapped[str] = mapped_column(String(100), nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    is_trusted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    last_used_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

class LoginHistory(SharedBase):
    """SQLAlchemy model recording security login audit logs."""
    __tablename__ = "login_history"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    browser: Mapped[str] = mapped_column(String(100), nullable=False)
    platform: Mapped[str] = mapped_column(String(100), nullable=False)
    ip_address: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(String(150), nullable=False, server_default="'Unknown'")
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="SUCCESS")
    risk_level: Mapped[str] = mapped_column(String(20), nullable=False, default="LOW")

class User2FASetting(SharedBase):
    """SQLAlchemy model storing two-factor authentication configuration."""
    __tablename__ = "user_2fa_settings"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )
    is_enabled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    method: Mapped[str] = mapped_column(String(50), nullable=False, default="Authenticator App (TOTP)")
    secret_key: Mapped[str | None] = mapped_column(String(255), nullable=True)
    backup_codes: Mapped[dict | None] = mapped_column(JSON, nullable=True)
