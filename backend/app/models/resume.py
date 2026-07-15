import os
import uuid
from datetime import datetime
from sqlalchemy import String, ForeignKey, Text, text, func, Enum as SQLEnum, TypeDecorator
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase
from app.core.enums import StorageProvider, ResumeStatus
from app.core.config import settings

class PortableFilePath(TypeDecorator):
    """Custom type to store relative path in database but return absolute path in code."""
    impl = String(500)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is not None:
            storage_dir = os.path.abspath(settings.LOCAL_STORAGE_PATH)
            abs_value = os.path.abspath(value)
            if abs_value.startswith(storage_dir):
                return os.path.relpath(abs_value, storage_dir)
        return value

    def process_result_value(self, value, dialect):
        if value is not None and not os.path.isabs(value):
            storage_dir = os.path.abspath(settings.LOCAL_STORAGE_PATH)
            return os.path.join(storage_dir, value)
        return value

class Resume(SharedBase):
    """Resume database model mapping to the resumes table."""
    __tablename__ = "resumes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    original_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    stored_filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True
    )
    file_path: Mapped[str] = mapped_column(
        PortableFilePath(),
        nullable=False
    )
    storage_provider: Mapped[StorageProvider] = mapped_column(
        SQLEnum(StorageProvider, native_enum=False, length=20),
        nullable=False,
        server_default=text(f"'{StorageProvider.LOCAL.value}'")
    )
    file_size: Mapped[int] = mapped_column(
        nullable=False
    )
    file_type: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )
    mime_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )
    status: Mapped[ResumeStatus] = mapped_column(
        SQLEnum(ResumeStatus, native_enum=False, length=20),
        nullable=False,
        server_default=text(f"'{ResumeStatus.UPLOADED.value}'")
    )
    raw_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )
    parsed_data: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True
    )
    ats_score: Mapped[int | None] = mapped_column(
        nullable=True
    )
    error_message: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True
    )
    uploaded_at: Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now()
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="resumes")
