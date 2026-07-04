import uuid
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
import structlog

from app.core.dependencies import get_current_user
from app.models.user import User
from app.career_roadmap.schemas.schemas import (
    RoadmapCreate,
    RoadmapResponse,
    RoadmapHistory,
    ValidationErrorResponse,
    AISkillGapResponse,
    AILearningPlanResponse,
    SkillGapRequest,
    LearningPlanRequest,
    AILearningRecommendation,
    TimelineRequest,
    AITimelineResponse,
    RoadmapAnalyticsResponse,
    ProgressResponse,
    CareerReadinessResponse,
    SkillAnalyticsResponse,
    TimelineAnalyticsResponse
)
from app.career_roadmap.dependencies import get_roadmap_service, get_career_analytics_service
from app.career_roadmap.services.analytics_service import CareerAnalyticsService
from app.career_roadmap.services.service import RoadmapService
from app.career_roadmap.services.context import RoadmapContext

logger = structlog.get_logger()
router = APIRouter()

@router.post(
    "/roadmaps",
    response_model=RoadmapResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create career roadmap record",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        401: {"description": "Not authenticated"}
    }
)
async def create_roadmap(
    request: RoadmapCreate,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Creates a new career roadmap shell record in the database."""
    logger.info("API create roadmap requested", user_id=str(current_user.id), target_role=request.target_role)
    db_roadmap = await service.create_roadmap(user_id=current_user.id, request=request)
    return db_roadmap

@router.get(
    "/roadmaps",
    response_model=RoadmapHistory,
    status_code=status.HTTP_200_OK,
    summary="List career roadmaps",
    responses={
        401: {"description": "Not authenticated"}
    }
)
async def list_roadmaps(
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """List all career roadmaps for the authenticated user, ordered descending by creation time."""
    logger.info("API list roadmaps requested", user_id=str(current_user.id))
    roadmaps = await service.list_roadmaps(user_id=current_user.id)
    return RoadmapHistory(roadmaps=roadmaps, total=len(roadmaps))

@router.get(
    "/roadmaps/{id}",
    response_model=RoadmapResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap details",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Retrieve detailed properties of a specific career roadmap, verifying ownership."""
    logger.info("API get roadmap details requested", user_id=str(current_user.id), roadmap_id=str(id))
    roadmap = await service.get_roadmap(roadmap_id=id, user_id=current_user.id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found"
        )
    return roadmap

@router.delete(
    "/roadmaps/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete career roadmap",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def delete_roadmap(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Delete a specific career roadmap record, verifying ownership."""
    logger.info("API delete roadmap requested", user_id=str(current_user.id), roadmap_id=str(id))
    success = await service.delete_roadmap(roadmap_id=id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found or delete failed"
        )
    return {"success": True, "message": "Career roadmap deleted successfully"}

@router.post(
    "/generate",
    response_model=RoadmapResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate AI Career Roadmap",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        401: {"description": "Not authenticated"}
    }
)
async def generate_roadmap(
    request: RoadmapCreate,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Generate a career roadmap, caching identical requests from the same user to prevent duplicate generations."""
    from app.career_roadmap.models.roadmap import CareerRoadmap
    from app.core.config import settings
    from sqlalchemy import desc

    # 1. Caching check: Check for identical completed roadmap
    months = request.estimated_duration_months or settings.ROADMAP_DEFAULT_MONTHS
    query = service.db.query(CareerRoadmap).filter(
        CareerRoadmap.user_id == current_user.id,
        CareerRoadmap.target_role == request.target_role.strip(),
        CareerRoadmap.experience_level == request.experience_level.upper().strip(),
        CareerRoadmap.roadmap_status == "COMPLETED",
        CareerRoadmap.estimated_duration_months == months
    )
    
    if request.current_role:
        query = query.filter(CareerRoadmap.current_role == request.current_role.strip())
    else:
        query = query.filter(CareerRoadmap.current_role.is_(None) | (CareerRoadmap.current_role == "None"))

    if request.target_industry:
        query = query.filter(CareerRoadmap.target_industry == request.target_industry.strip())
    else:
        query = query.filter(CareerRoadmap.target_industry.is_(None) | (CareerRoadmap.target_industry == "None"))

    if request.resume_id:
        query = query.filter(CareerRoadmap.resume_id == request.resume_id)
    else:
        query = query.filter(CareerRoadmap.resume_id.is_(None))

    cached_roadmap = query.order_by(desc(CareerRoadmap.created_at)).first()
    if cached_roadmap:
        logger.info("returning_cached_identical_roadmap", roadmap_id=str(cached_roadmap.id), user_id=str(current_user.id))
        return cached_roadmap

    # 2. If not cached, create pending roadmap shell
    db_roadmap = await service.create_roadmap(user_id=current_user.id, request=request)
    
    # 3. Call service to run AI generation and map/save milestones/recommendations
    db_roadmap = await service.generate_and_save_roadmap(user_id=current_user.id, roadmap_id=db_roadmap.id)
    return db_roadmap


@router.post(
    "/{id}/generate",
    response_model=RoadmapResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate/regenerate AI Career Roadmap for an existing ID",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def generate_roadmap_by_id(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Generate or regenerate the career roadmap details for a specific existing roadmap shell, bypassing cache."""
    logger.info("API generate/regenerate roadmap by ID requested", user_id=str(current_user.id), roadmap_id=str(id))
    db_roadmap = await service.generate_and_save_roadmap(user_id=current_user.id, roadmap_id=id)
    return db_roadmap


@router.get(
    "/history",
    response_model=RoadmapHistory,
    status_code=status.HTTP_200_OK,
    summary="List career roadmaps history",
    responses={
        401: {"description": "Not authenticated"}
    }
)
async def list_roadmaps_history(
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """List all career roadmaps for the authenticated user, ordered descending by creation time."""
    logger.info("API list roadmaps history requested", user_id=str(current_user.id))
    roadmaps = await service.list_roadmaps(user_id=current_user.id)
    return RoadmapHistory(roadmaps=roadmaps, total=len(roadmaps))

@router.get(
    "/analytics",
    status_code=status.HTTP_200_OK,
    summary="Get user overall roadmap analytics",
    responses={
        401: {"description": "Not authenticated"}
    }
)
async def get_overall_analytics(
    current_user: User = Depends(get_current_user),
    service: CareerAnalyticsService = Depends(get_career_analytics_service)
):
    """Retrieve aggregated overall analytics for all of the authenticated user's completed roadmaps."""
    logger.info("API get overall analytics requested", user_id=str(current_user.id))
    return await service.get_overall_analytics(user_id=current_user.id)


@router.get(
    "/{id}",
    response_model=RoadmapResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap details by ID",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_by_id(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Retrieve detailed properties of a specific career roadmap, verifying ownership."""
    logger.info("API get roadmap details by ID requested", user_id=str(current_user.id), roadmap_id=str(id))
    roadmap = await service.get_roadmap(roadmap_id=id, user_id=current_user.id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found"
        )
    return roadmap


@router.delete(
    "/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete career roadmap by ID",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def delete_roadmap_by_id(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Delete a specific career roadmap record, verifying ownership."""
    logger.info("API delete roadmap by ID requested", user_id=str(current_user.id), roadmap_id=str(id))
    success = await service.delete_roadmap(roadmap_id=id, user_id=current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found or delete failed"
        )
    return {"success": True, "message": "Career roadmap deleted successfully"}


@router.post(
    "/regenerate",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="Regenerate AI Career Roadmap (Stub)",
    description="Stub endpoint for future AI roadmap regeneration. Currently returns 501 Not Implemented."
)
async def regenerate_roadmap():
    """Returns 501 Not Implemented."""
    logger.info("API regenerate roadmap stub requested")
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="AI Career Roadmap regeneration is not implemented in this phase"
    )


@router.post(
    "/skill-gap",
    response_model=AISkillGapResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate skill gap analysis",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        401: {"description": "Not authenticated"},
        400: {"description": "Bad Request"}
    }
)
async def generate_skill_gap(
    request: SkillGapRequest,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Generate or retrieve a skill gap analysis for a career roadmap."""
    if not request.roadmap_id:
        if not request.target_role or not request.experience_level:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Target role and experience level are required when roadmap_id is not provided."
            )
    try:
        result = await service.generate_and_save_skill_gap(
            user_id=current_user.id,
            roadmap_id=request.roadmap_id,
            target_role=request.target_role,
            experience_level=request.experience_level,
            current_role=request.current_role,
            target_industry=request.target_industry,
            resume_id=request.resume_id
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in str(e).lower() else status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/learning-plan",
    response_model=AILearningPlanResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate personalized learning plan",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        401: {"description": "Not authenticated"},
        400: {"description": "Bad Request"}
    }
)
async def generate_learning_plan(
    request: LearningPlanRequest,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Generate or retrieve a personalized learning plan for a career roadmap."""
    if not request.roadmap_id:
        if not request.target_role or not request.experience_level:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Target role and experience level are required when roadmap_id is not provided."
            )
    try:
        result = await service.generate_and_save_learning_plan(
            user_id=current_user.id,
            roadmap_id=request.roadmap_id,
            target_role=request.target_role,
            experience_level=request.experience_level,
            current_role=request.current_role,
            target_industry=request.target_industry,
            resume_id=request.resume_id
        )
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in str(e).lower() else status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/{id}/recommendations",
    response_model=List[AILearningRecommendation],
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap recommendations",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_recommendations(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Retrieve all learning recommendations for a career roadmap, verifying ownership."""
    try:
        result = await service.get_roadmap_recommendations(user_id=current_user.id, roadmap_id=id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get(
    "/{id}/skill-gap",
    response_model=AISkillGapResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap skill gap analysis",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_skill_gap(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Retrieve the skill gap analysis for a career roadmap, verifying ownership."""
    try:
        result = await service.get_roadmap_skill_gap(user_id=current_user.id, roadmap_id=id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete(
    "/{id}/recommendations",
    status_code=status.HTTP_200_OK,
    summary="Delete career roadmap recommendations",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def delete_roadmap_recommendations(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Clear/delete recommendations for a specific career roadmap, verifying ownership."""
    try:
        await service.delete_roadmap_recommendations(user_id=current_user.id, roadmap_id=id)
        return {"success": True, "message": "Career roadmap recommendations cleared successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post(
    "/timeline",
    response_model=AITimelineResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate AI Career Timeline",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        401: {"description": "Not authenticated"},
        400: {"description": "Bad Request"},
        404: {"description": "Roadmap not found"}
    }
)
async def generate_timeline(
    request: TimelineRequest,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Generate an execution timeline for a career roadmap, caching identical requests."""
    logger.info("API generate timeline requested", user_id=str(current_user.id), roadmap_id=str(request.roadmap_id) if request.roadmap_id else None)
    try:
        result = await service.generate_and_save_timeline(user_id=current_user.id, request=request)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in str(e).lower() else status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/{id}/timeline",
    response_model=AITimelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate/regenerate AI Career Timeline by ID",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"},
        400: {"description": "Bad Request"}
    }
)
async def generate_timeline_by_id(
    id: uuid.UUID,
    request: Optional[TimelineRequest] = None,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Generate or regenerate execution timeline for a specific career roadmap, bypassing cache."""
    logger.info("API generate timeline by ID requested", user_id=str(current_user.id), roadmap_id=str(id))
    if not request:
        request = TimelineRequest(roadmap_id=id)
    else:
        request.roadmap_id = id
    
    # Bypass cache by clearing existing timeline from metadata before generating
    roadmap = await service.get_roadmap(roadmap_id=id, user_id=current_user.id)
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found"
        )
    # Clear cached timeline to force regeneration
    metadata = dict(roadmap.roadmap_metadata or {})
    metadata.pop("timeline", None)
    metadata.pop("timeline_metadata", None)
    roadmap.roadmap_metadata = metadata
    service.db.commit()

    try:
        result = await service.generate_and_save_timeline(user_id=current_user.id, request=request)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if "not found" in str(e).lower() else status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get(
    "/{id}/timeline",
    response_model=AITimelineResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap timeline details",
    responses={
        404: {"description": "Timeline or Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_timeline(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Retrieve execution timeline details of a specific career roadmap, verifying ownership."""
    logger.info("API get roadmap timeline requested", user_id=str(current_user.id), roadmap_id=str(id))
    try:
        result = await service.get_roadmap_timeline(user_id=current_user.id, roadmap_id=id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.delete(
    "/{id}/timeline",
    status_code=status.HTTP_200_OK,
    summary="Delete career roadmap timeline",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def delete_timeline(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: RoadmapService = Depends(get_roadmap_service)
):
    """Delete the execution timeline for a specific career roadmap, verifying ownership."""
    logger.info("API delete roadmap timeline requested", user_id=str(current_user.id), roadmap_id=str(id))
    try:
        deleted = await service.delete_roadmap_timeline(user_id=current_user.id, roadmap_id=id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Timeline not found for this roadmap"
            )
        return {"success": True, "message": "Career roadmap timeline deleted successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )



@router.get(
    "/{id}/analytics",
    response_model=RoadmapAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap analytics dashboard",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_analytics(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CareerAnalyticsService = Depends(get_career_analytics_service)
):
    """Retrieve comprehensive analytics metrics and breakdowns for a specific roadmap, verifying ownership."""
    logger.info("API get roadmap analytics requested", user_id=str(current_user.id), roadmap_id=str(id))
    try:
        return await service.get_roadmap_analytics(roadmap_id=id, user_id=current_user.id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get(
    "/{id}/progress",
    response_model=ProgressResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap progress details",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_progress(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CareerAnalyticsService = Depends(get_career_analytics_service)
):
    """Retrieve detailed progress stats, velocity, delay analysis, and breakdowns for a specific roadmap."""
    logger.info("API get roadmap progress requested", user_id=str(current_user.id), roadmap_id=str(id))
    from app.career_roadmap.models.roadmap import CareerRoadmap
    roadmap = service.db.query(CareerRoadmap).filter(CareerRoadmap.id == id, CareerRoadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found"
        )
    return service.calculate_progress(roadmap)


@router.get(
    "/{id}/readiness",
    response_model=CareerReadinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap readiness score",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_readiness(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CareerAnalyticsService = Depends(get_career_analytics_service)
):
    """Retrieve normalized career readiness scores and personalized categories recommendations for a specific roadmap."""
    logger.info("API get roadmap readiness requested", user_id=str(current_user.id), roadmap_id=str(id))
    from app.career_roadmap.models.roadmap import CareerRoadmap
    roadmap = service.db.query(CareerRoadmap).filter(CareerRoadmap.id == id, CareerRoadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found"
        )
    context = await RoadmapContext.build(
        db=service.db,
        user_id=current_user.id,
        resume_id=roadmap.resume_id,
        target_role=roadmap.target_role
    )
    return service.calculate_readiness(roadmap, context)


@router.get(
    "/{id}/skills",
    response_model=SkillAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get career roadmap skill progress analytics",
    responses={
        404: {"description": "Roadmap not found"},
        401: {"description": "Not authenticated"}
    }
)
async def get_roadmap_skills(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CareerAnalyticsService = Depends(get_career_analytics_service)
):
    """Retrieve skill progress aggregates (completed, remaining, strong, missing, velocity) for a specific roadmap."""
    logger.info("API get roadmap skills requested", user_id=str(current_user.id), roadmap_id=str(id))
    from app.career_roadmap.models.roadmap import CareerRoadmap
    roadmap = service.db.query(CareerRoadmap).filter(CareerRoadmap.id == id, CareerRoadmap.user_id == current_user.id).first()
    if not roadmap:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career roadmap not found"
        )
    context = await RoadmapContext.build(
        db=service.db,
        user_id=current_user.id,
        resume_id=roadmap.resume_id,
        target_role=roadmap.target_role
    )
    return service.calculate_skill_analytics(roadmap, context)


