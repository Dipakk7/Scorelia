import uuid
from datetime import datetime
from sqlalchemy import String, text, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import SharedBase

class Notification(SharedBase):
    """Database model mapping to the notifications table."""
    __tablename__ = "notifications"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    message: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )
    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="INFO",
        server_default=text("'INFO'")
    )
    is_read: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default=text("false")
    )
