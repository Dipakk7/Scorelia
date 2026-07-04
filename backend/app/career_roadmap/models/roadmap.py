from __future__ import annotations
import uuid
from sqlalchemy import String, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import SharedBase

class CareerRoadmap(SharedBase):
    """Database model mapping to the career_roadmaps table."""
    __tablename__ = "career_roadmaps"

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
    target_role: Mapped[str] = mapped_column(String(100), nullable=False)
    current_role: Mapped[str | None] = mapped_column(String(100), nullable=True)
    experience_level: Mapped[str] = mapped_column(String(50), nullable=False)
    target_industry: Mapped[str | None] = mapped_column(String(100), nullable=True)
    roadmap_status: Mapped[str] = mapped_column(String(50), nullable=False)
    estimated_duration_months: Mapped[int] = mapped_column(Integer, nullable=False)
    current_readiness_score: Mapped[int] = mapped_column(Integer, nullable=False)
    
    provider: Mapped[str | None] = mapped_column(String(50), nullable=True)
    model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    prompt_version: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    # SQLAlchemy maps roadmap_metadata attribute to the 'metadata' database column
    roadmap_metadata: Mapped[dict | None] = mapped_column("metadata", JSONB, nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User")
    resume: Mapped["Resume"] = relationship("Resume")
    milestones: Mapped[list["RoadmapMilestone"]] = relationship(
        "RoadmapMilestone",
        cascade="all, delete-orphan",
        back_populates="roadmap",
        order_by="RoadmapMilestone.order_index"
    )
    recommendations: Mapped[list["LearningRecommendation"]] = relationship(
        "LearningRecommendation",
        cascade="all, delete-orphan",
        back_populates="roadmap"
    )

class RoadmapMilestone(SharedBase):
    """Database model mapping to the roadmap_milestones table."""
    __tablename__ = "roadmap_milestones"

    roadmap_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("career_roadmaps.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    phase_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration: Mapped[str | None] = mapped_column(String(50), nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)

    # Relationships
    roadmap: Mapped["CareerRoadmap"] = relationship("CareerRoadmap", back_populates="milestones")

class LearningRecommendation(SharedBase):
    """Database model mapping to the learning_recommendations table."""
    __tablename__ = "learning_recommendations"

    roadmap_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("career_roadmaps.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    priority: Mapped[str] = mapped_column(String(50), nullable=False)
    resource_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    estimated_hours: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Relationships
    roadmap: Mapped["CareerRoadmap"] = relationship("CareerRoadmap", back_populates="recommendations")
