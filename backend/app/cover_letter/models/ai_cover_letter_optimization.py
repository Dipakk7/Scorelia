from __future__ import annotations
import uuid
from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class AICoverLetterOptimization(SharedBase):
    """Database model mapping to the ai_cover_letter_optimizations table."""
    __tablename__ = "ai_cover_letter_optimizations"

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

    optimization_result: Mapped[dict] = mapped_column(JSONB, nullable=False)
    quality_score: Mapped[int] = mapped_column(Integer, nullable=False)
    category_scores: Mapped[dict] = mapped_column(JSONB, nullable=False)
    keyword_analysis: Mapped[dict] = mapped_column(JSONB, nullable=False)

    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    model: Mapped[str] = mapped_column(String(100), nullable=False)
    prompt_version: Mapped[str] = mapped_column(String(20), nullable=False)

    # Database column is 'metadata'. We name the attribute 'optimization_metadata' to avoid SQLAlchemy conflicts.
    optimization_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    cover_letter: Mapped["AICoverLetter"] = relationship("AICoverLetter")
