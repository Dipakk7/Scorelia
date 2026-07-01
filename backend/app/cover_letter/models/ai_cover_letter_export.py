from __future__ import annotations
import uuid
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class AICoverLetterExport(SharedBase):
    """Database model mapping to the ai_cover_letter_exports table."""
    __tablename__ = "ai_cover_letter_exports"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    cover_letter_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("ai_cover_letters.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    optimization_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("ai_cover_letter_optimizations.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    export_format: Mapped[str] = mapped_column(String(20), nullable=False)
    template_name: Mapped[str] = mapped_column(String(50), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)

    # Database column is 'metadata'. We name the attribute 'export_metadata' to avoid SQLAlchemy conflicts.
    export_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    cover_letter: Mapped["AICoverLetter"] = relationship("AICoverLetter")
    optimization: Mapped["AICoverLetterOptimization"] = relationship("AICoverLetterOptimization")
