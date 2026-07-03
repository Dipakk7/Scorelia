from __future__ import annotations
import uuid
from sqlalchemy import String, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class InterviewSession(SharedBase):
    """Database model mapping to the interview_sessions table."""
    __tablename__ = "interview_sessions"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    resume_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("resumes.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    job_id: Mapped[uuid.UUID | None] = mapped_column(
        nullable=True,
        index=True
    )
    company_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    target_role: Mapped[str | None] = mapped_column(String(100), nullable=True)
    interview_type: Mapped[str] = mapped_column(String(50), nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, nullable=False)
    current_question: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    
    provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    prompt_version: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    # SQLAlchemy maps session_metadata attribute to the 'metadata' database column
    session_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    resume: Mapped["Resume"] = relationship("Resume")
    turns: Mapped[list["InterviewTurn"]] = relationship(
        "InterviewTurn",
        cascade="all, delete-orphan",
        back_populates="session"
    )

class InterviewTurn(SharedBase):
    """Database model mapping to the interview_turns table."""
    __tablename__ = "interview_turns"

    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("interview_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    question_category: Mapped[str | None] = mapped_column(String(50), nullable=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    answer_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)

    prompt_version: Mapped[str | None] = mapped_column(String(20), nullable=True)
    provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    latency: Mapped[float | None] = mapped_column(nullable=True)
    scores: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    evaluation_metadata: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    # Relationships
    session: Mapped["InterviewSession"] = relationship("InterviewSession", back_populates="turns")
