import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.career_roadmap.schemas.schemas import RoadmapCreate

class RoadmapCRUD:
    """CRUD operations for the AI Career Roadmap module."""

    @staticmethod
    def create_roadmap(
        db: Session,
        user_id: uuid.UUID,
        schema: RoadmapCreate,
        status: str,
        estimated_duration_months: int,
        current_readiness_score: int,
        provider: str | None = None,
        model: str | None = None,
        prompt_version: str | None = None
    ) -> CareerRoadmap:
        """Create a new career roadmap."""
        db_roadmap = CareerRoadmap(
            user_id=user_id,
            resume_id=schema.resume_id,
            target_role=schema.target_role,
            current_role=schema.current_role,
            experience_level=schema.experience_level,
            target_industry=schema.target_industry,
            roadmap_status=status,
            estimated_duration_months=estimated_duration_months,
            current_readiness_score=current_readiness_score,
            provider=provider,
            model=model,
            prompt_version=prompt_version,
            roadmap_metadata=schema.roadmap_metadata,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(db_roadmap)
        db.commit()
        db.refresh(db_roadmap)
        return db_roadmap

    @staticmethod
    def get_roadmap(db: Session, roadmap_id: uuid.UUID, user_id: uuid.UUID) -> CareerRoadmap | None:
        """Retrieve a specific career roadmap by ID for a user."""
        return db.query(CareerRoadmap).filter(
            CareerRoadmap.id == roadmap_id,
            CareerRoadmap.user_id == user_id
        ).first()

    @staticmethod
    def list_roadmaps(db: Session, user_id: uuid.UUID) -> list[CareerRoadmap]:
        """List all career roadmaps for a user, ordered by creation date descending."""
        return db.query(CareerRoadmap).filter(
            CareerRoadmap.user_id == user_id
        ).order_by(desc(CareerRoadmap.created_at)).all()

    @staticmethod
    def delete_roadmap(db: Session, roadmap: CareerRoadmap) -> bool:
        """Delete a career roadmap from the database."""
        db.delete(roadmap)
        db.commit()
        return True

    @staticmethod
    def create_milestone(
        db: Session,
        roadmap_id: uuid.UUID,
        phase_number: int,
        title: str,
        order_index: int,
        status: str,
        description: str | None = None,
        duration: str | None = None
    ) -> RoadmapMilestone:
        """Create a milestone associated with a career roadmap."""
        db_milestone = RoadmapMilestone(
            roadmap_id=roadmap_id,
            phase_number=phase_number,
            title=title[:100] if title else "",
            description=description,
            duration=duration,
            order_index=order_index,
            status=status,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(db_milestone)
        db.commit()
        db.refresh(db_milestone)
        return db_milestone

    @staticmethod
    def create_learning_recommendation(
        db: Session,
        roadmap_id: uuid.UUID,
        category: str,
        title: str,
        priority: str,
        description: str | None = None,
        resource_url: str | None = None,
        estimated_hours: int | None = None
    ) -> LearningRecommendation:
        """Create a learning recommendation associated with a career roadmap."""
        db_recommendation = LearningRecommendation(
            roadmap_id=roadmap_id,
            category=category,
            title=title[:100] if title else "",
            description=description,
            priority=priority,
            resource_url=resource_url,
            estimated_hours=estimated_hours,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(db_recommendation)
        db.commit()
        db.refresh(db_recommendation)
        return db_recommendation
