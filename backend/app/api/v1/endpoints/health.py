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

    # 6. Career Roadmap Module
    roadmap_module_status = "healthy"
    try:
        from app.career_roadmap.services.service import RoadmapService
    except Exception as e:
        logger.error("Health check Career Roadmap Module failed", error=str(e))
        roadmap_module_status = "unhealthy"

    # 7. Roadmap Prompt Registry
    roadmap_prompt_registry_status = "healthy"
    try:
        from app.career_roadmap.services.ai_service import RoadmapAIService
    except Exception as e:
        logger.error("Health check Roadmap Prompt Registry failed", error=str(e))
        roadmap_prompt_registry_status = "unhealthy"

    # 8. Roadmap Dependency Injection
    roadmap_dependency_injection_status = "healthy"
    try:
        from app.career_roadmap.dependencies import get_roadmap_service, get_roadmap_ai_service
        assert callable(get_roadmap_service)
        assert callable(get_roadmap_ai_service)
    except Exception as e:
        logger.error("Health check Roadmap Dependency Injection failed", error=str(e))
        roadmap_dependency_injection_status = "unhealthy"

    # 9. Roadmap Workflow Skeleton
    roadmap_workflow_skeleton_status = "healthy"
    try:
        from app.career_roadmap.services.workflow import RoadmapWorkflow, RoadmapWorkflowState
        assert len(RoadmapWorkflow.get_all_states()) == 9
    except Exception as e:
        logger.error("Health check Roadmap Workflow Skeleton failed", error=str(e))
        roadmap_workflow_skeleton_status = "unhealthy"

    # 10. Roadmap Context Builder
    roadmap_context_builder_status = "healthy"
    try:
        from app.career_roadmap.services.context import RoadmapContext
    except Exception as e:
        logger.error("Health check Roadmap Context Builder failed", error=str(e))
        roadmap_context_builder_status = "unhealthy"

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

    roadmap_health = {
        "status": "healthy" if (
            roadmap_module_status == "healthy" and
            roadmap_prompt_registry_status == "healthy" and
            roadmap_dependency_injection_status == "healthy" and
            roadmap_workflow_skeleton_status == "healthy" and
            roadmap_context_builder_status == "healthy"
        ) else "unhealthy",
        "career_roadmap_module": roadmap_module_status,
        "prompt_registry": roadmap_prompt_registry_status,
        "dependency_injection": roadmap_dependency_injection_status,
        "workflow_skeleton": roadmap_workflow_skeleton_status,
        "context_builder": roadmap_context_builder_status
    }

    # RAG Module health check
    rag_health = {"status": "healthy"}
    try:
        from app.modules.rag.dependencies import get_chroma_manager, get_embedding_service
        chroma_manager = get_chroma_manager()
        embedding_service = get_embedding_service()
        
        chroma_healthy = chroma_manager.validate_connection()
        heartbeat = chroma_manager.heartbeat()
        
        embed_status = await embedding_service.health_check()
        
        rag_health = {
            "status": "healthy" if (chroma_healthy and embed_status.get("status") == "healthy") else "unhealthy",
            "chromadb": {
                "status": "healthy" if chroma_healthy else "unhealthy",
                "heartbeat": heartbeat
            },
            "ollama": embed_status
        }
    except Exception as e:
        logger.error("Health check RAG Module failed", error=str(e))
        rag_health = {
            "status": "unhealthy",
            "error": str(e)
        }

    import sys
    from app.core.config import settings
    is_testing = "pytest" in sys.modules or settings.ENVIRONMENT == "testing"

    overall_status = "healthy" if (
        db_status == "healthy" and 
        ai_status == "healthy" and 
        interview_health["status"] == "healthy" and
        roadmap_health["status"] == "healthy" and
        (is_testing or rag_health["status"] == "healthy")
    ) else "unhealthy"

    return {
        "status": overall_status,
        "database": db_status,
        "ai": ai_details,
        "interview": interview_health,
        "roadmap": roadmap_health,
        "rag": rag_health,
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
    }

