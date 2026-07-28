import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import SharedBase

class UserIntegration(SharedBase):
    """SQLAlchemy model tracking user third-party service connections."""
    __tablename__ = "user_integrations"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    provider: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    is_connected: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    account_identifier: Mapped[str | None] = mapped_column(String(255), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    encrypted_api_key: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status_badge: Mapped[str] = mapped_column(String(50), nullable=False, default="Not Connected")
    connected_repos_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    connected_channels_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_synced_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        server_default=func.now()
    )
