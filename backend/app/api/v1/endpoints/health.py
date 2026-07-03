from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.core.db import get_db
from datetime import datetime, timezone
import structlog

from app.ai.dependencies import get_ai_provider
from app.ai.providers.base import BaseAIProvider

logger = structlog.get_logger()
router = APIRouter()


@router.get("/health", tags=["System"])
async def health_check(
    db: Session = Depends(get_db),
    ai_provider: BaseAIProvider = Depends(get_ai_provider)
):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error("Health check database connection failed", error=str(e))
        db_status = "unhealthy"

    # AI health check
    ai_status = "healthy"
    ai_details = {}
    try:
        ai_details = await ai_provider.health_check()
        if ai_details.get("status") != "healthy":
            ai_status = "unhealthy"
    except Exception as e:
        logger.error("Health check AI provider failed", error=str(e))
        ai_status = "unhealthy"
        ai_details = {"status": "unhealthy", "error": str(e)}

    # 1. Interview Module
    interview_module_status = "healthy"
    try:
        from app.interview.services.service import InterviewService
    except Exception as e:
        logger.error("Health check Interview Module failed", error=str(e))
        interview_module_status = "unhealthy"

    # 2. Prompt Registry
    prompt_registry_status = "healthy"
    try:
        from app.ai.services.ai_service import _global_registry
        assert _global_registry is not None
    except Exception as e:
        logger.error("Health check Prompt Registry failed", error=str(e))
        prompt_registry_status = "unhealthy"

    # 3. Dependency Injection
    dependency_injection_status = "healthy"
    try:
        from app.interview.dependencies import get_interview_service, get_interview_ai_service
        assert callable(get_interview_service)
        assert callable(get_interview_ai_service)
    except Exception as e:
        logger.error("Health check Dependency Injection failed", error=str(e))
        dependency_injection_status = "unhealthy"

    # 4. Workflow Skeleton
    workflow_skeleton_status = "healthy"
    try:
        from app.interview.services.workflow import InterviewWorkflow
        # Verify workflow states are present
        assert len(InterviewWorkflow.get_all_states()) == 7
    except Exception as e:
        logger.error("Health check Workflow Skeleton failed", error=str(e))
        workflow_skeleton_status = "unhealthy"

    # 5. Context Builder
    context_builder_status = "healthy"
    try:
        from app.interview.services.context import InterviewContext
    except Exception as e:
        logger.error("Health check Context Builder failed", error=str(e))
        context_builder_status = "unhealthy"

    interview_health = {
        "status": "healthy" if (
            interview_module_status == "healthy" and
            prompt_registry_status == "healthy" and
            dependency_injection_status == "healthy" and
            workflow_skeleton_status == "healthy" and
            context_builder_status == "healthy"
        ) else "unhealthy",
        "interview_module": interview_module_status,
        "prompt_registry": prompt_registry_status,
        "dependency_injection": dependency_injection_status,
        "workflow_skeleton": workflow_skeleton_status,
        "context_builder": context_builder_status
    }

    overall_status = "healthy" if (
        db_status == "healthy" and 
        ai_status == "healthy" and 
        interview_health["status"] == "healthy"
    ) else "unhealthy"

    return {
        "status": overall_status,
        "database": db_status,
        "ai": ai_details,
        "interview": interview_health,
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
    }
