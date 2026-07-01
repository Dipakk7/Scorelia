from __future__ import annotations
import uuid
from sqlalchemy import String, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class AICoverLetter(SharedBase):
    """Database model mapping to the ai_cover_letters table."""
    __tablename__ = "ai_cover_letters"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    resume_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    company_name: Mapped[str] = mapped_column(String(100), nullable=False)
    job_title: Mapped[str] = mapped_column(String(100), nullable=False)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    writing_style: Mapped[str] = mapped_column(String(50), nullable=False)
    generation_mode: Mapped[str] = mapped_column(String(50), nullable=False)
    generated_content: Mapped[str | None] = mapped_column(Text, nullable=True)

    provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    prompt_version: Mapped[str | None] = mapped_column(String(20), nullable=True)

    # In SQLAlchemy, calling column 'metadata' clashes with Base.metadata.
    # Therefore, we name the attribute 'cover_letter_metadata' and map it to database column 'metadata'.
    cover_letter_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    resume: Mapped["Resume"] = relationship("Resume")
