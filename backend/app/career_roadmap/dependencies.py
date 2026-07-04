from fastapi import Depends
from fastapi.params import Depends as DependsClass
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.ai.dependencies import get_ai_service
from app.ai.services.ai_service import AIService
from app.career_roadmap.services.ai_service import RoadmapAIService
from app.career_roadmap.services.service import RoadmapService
from app.career_roadmap.services.analytics_service import CareerAnalyticsService
from app.career_roadmap.metrics import roadmap_metrics

def get_roadmap_ai_service(
    ai_service: AIService = Depends(get_ai_service)
) -> RoadmapAIService:
    """Dependency injector to retrieve the RoadmapAIService instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(ai_service, DependsClass):
        from app.ai.dependencies import get_ai_service as resolve_ai_service
        ai_service = resolve_ai_service()

    roadmap_metrics.record_dependency_initialized("RoadmapAIService")
    return RoadmapAIService(ai_service=ai_service)

def get_roadmap_service(
    db: Session = Depends(get_db),
    roadmap_ai_service: RoadmapAIService = Depends(get_roadmap_ai_service)
) -> RoadmapService:
    """Dependency injector to retrieve the RoadmapService instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(db, DependsClass):
        from app.core.db import SessionLocal
        db = SessionLocal()
    if isinstance(roadmap_ai_service, DependsClass):
        roadmap_ai_service = get_roadmap_ai_service()

    roadmap_metrics.record_dependency_initialized("RoadmapService")
    return RoadmapService(db=db, roadmap_ai_service=roadmap_ai_service)

def get_career_analytics_service(
    db: Session = Depends(get_db)
) -> CareerAnalyticsService:
    """Dependency injector to retrieve the CareerAnalyticsService instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(db, DependsClass):
        from app.core.db import SessionLocal
        db = SessionLocal()

    roadmap_metrics.record_dependency_initialized("CareerAnalyticsService")
    return CareerAnalyticsService(db=db)
