from fastapi import Depends
from fastapi.params import Depends as DependsClass
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.ai.dependencies import get_ai_service
from app.ai.services.ai_service import AIService
from app.interview.services.service import InterviewService
from app.interview.services.ai_service import InterviewAIService
from app.interview.services.manager import InterviewSessionManager
from app.interview.services.analytics import InterviewAnalyticsService
from app.interview.metrics import interview_metrics

def get_interview_ai_service(
    ai_service: AIService = Depends(get_ai_service)
) -> InterviewAIService:
    """Dependency injector to retrieve the InterviewAIService instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(ai_service, DependsClass):
        from app.ai.dependencies import get_ai_service as resolve_ai_service
        ai_service = resolve_ai_service()

    interview_metrics.record_dependency_initialized("InterviewAIService")
    return InterviewAIService(ai_service=ai_service)

def get_interview_service(
    db: Session = Depends(get_db),
    interview_ai_service: InterviewAIService = Depends(get_interview_ai_service)
) -> InterviewService:
    """Dependency injector to retrieve the InterviewService instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(db, DependsClass):
        from app.core.db import SessionLocal
        db = SessionLocal()
    if isinstance(interview_ai_service, DependsClass):
        interview_ai_service = get_interview_ai_service()

    interview_metrics.record_dependency_initialized("InterviewService")
    return InterviewService(db=db, interview_ai_service=interview_ai_service)

def get_interview_session_manager(
    db: Session = Depends(get_db),
    interview_service: InterviewService = Depends(get_interview_service)
) -> InterviewSessionManager:
    """Dependency injector to retrieve the InterviewSessionManager instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(db, DependsClass):
        from app.core.db import SessionLocal
        db = SessionLocal()
    if isinstance(interview_service, DependsClass):
        interview_service = get_interview_service()

    return InterviewSessionManager(db=db, interview_service=interview_service)

def get_interview_analytics_service(
    db: Session = Depends(get_db),
    interview_service: InterviewService = Depends(get_interview_service)
) -> InterviewAnalyticsService:
    """Dependency injector to retrieve the InterviewAnalyticsService instance."""
    # Resolve Depends wrapper when called directly in tests
    if isinstance(db, DependsClass):
        from app.core.db import SessionLocal
        db = SessionLocal()
    if isinstance(interview_service, DependsClass):
        interview_service = get_interview_service()

    return InterviewAnalyticsService(db=db, interview_service=interview_service)

