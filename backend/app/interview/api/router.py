import uuid
from typing import Optional, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
import structlog
from pydantic import BaseModel

from app.core.dependencies import get_current_user
from app.models.user import User
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.schemas.schemas import (
    InterviewSessionCreate,
    InterviewSessionResponse,
    InterviewTurnResponse,
    InterviewHistory,
    ValidationErrorResponse,
    AnswerSubmitRequest,
    AdHocEvaluationRequest
)
from app.interview.services.service import InterviewService
from app.interview.services.ai_service import AnswerEvaluationResponse
from app.interview.services.context import InterviewContext
from app.interview.services.manager import InterviewSessionManager
from app.interview.dependencies import (
    get_interview_service,
    get_interview_session_manager,
    get_interview_analytics_service
)
from app.interview.schemas.reports import (
    InterviewAnalyticsResponse,
    ReportRegenerateRequest
)
from app.interview.services.analytics import InterviewAnalyticsService

class GenerateQuestionsRequest(BaseModel):
    mode: str = "entire"
    count: Optional[int] = None

logger = structlog.get_logger()
router = APIRouter()

def map_session_to_response(session: InterviewSession) -> InterviewSessionResponse:
    """Convert database InterviewSession model to Pydantic InterviewSessionResponse schema."""
    turns = [
        InterviewTurnResponse(
            id=turn.id,
            session_id=turn.session_id,
            question_number=turn.question_number,
            question_category=turn.question_category,
            question_text=turn.question_text,
            answer_text=turn.answer_text,
            feedback=turn.feedback,
            score=turn.score,
            created_at=turn.created_at,
            updated_at=turn.updated_at
        )
        for turn in session.turns
    ]
    
    return InterviewSessionResponse(
        id=session.id,
        user_id=session.user_id,
        resume_id=session.resume_id,
        job_id=session.job_id,
        company_name=session.company_name,
        target_role=session.target_role,
        interview_type=session.interview_type,
        difficulty=session.difficulty,
        status=session.status,
        total_questions=session.total_questions,
        current_question=session.current_question,
        provider=session.provider,
        model=session.model,
        prompt_version=session.prompt_version,
        session_metadata=session.session_metadata,
        created_at=session.created_at,
        updated_at=session.updated_at,
        turns=turns
    )

@router.post(
    "/sessions",
    response_model=InterviewSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new interview session",
    responses={
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
        400: {"description": "Bad Request"},
    }
)
async def create_session(
    request: InterviewSessionCreate,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Creates a new AI interview session for the authenticated user."""
    try:
        session = await service.create_session(user_id=current_user.id, request=request)
        return map_session_to_response(session)
    except ValueError as val_err:
        logger.warning(
            "create_interview_session_validation_failed",
            error=str(val_err),
            user_id=str(current_user.id)
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error(
            "create_interview_session_system_error",
            error=str(err),
            user_id=str(current_user.id)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"System error creating interview session: {str(err)}"
        )

@router.get(
    "/sessions",
    response_model=InterviewHistory,
    summary="Retrieve interview session history",
)
async def get_sessions(
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Retrieve history of interview sessions created by the current user."""
    try:
        sessions = await service.list_sessions(user_id=current_user.id)
        return InterviewHistory(
            sessions=[map_session_to_response(s) for s in sessions],
            total=len(sessions)
        )
    except Exception as err:
        logger.error(
            "list_interview_sessions_failed",
            error=str(err),
            user_id=str(current_user.id)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve sessions history: {str(err)}"
        )

@router.get(
    "/sessions/{id}",
    response_model=InterviewSessionResponse,
    summary="Retrieve details of a specific interview session",
)
async def get_session(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Retrieve details of a specific interview session record by its ID."""
    try:
        session = await service.get_session(session_id=id, user_id=current_user.id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Interview session with ID '{id}' not found."
            )
        return map_session_to_response(session)
    except HTTPException:
        raise
    except Exception as err:
        logger.error(
            "get_interview_session_failed",
            error=str(err),
            user_id=str(current_user.id)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve session details: {str(err)}"
        )

@router.delete(
    "/sessions/{id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an interview session record",
)
async def delete_session(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Delete an interview session record from history."""
    try:
        deleted = await service.delete_session(session_id=id, user_id=current_user.id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Interview session with ID '{id}' not found or not owned by user."
            )
        return {
            "success": True,
            "message": "Interview session deleted successfully."
        }
    except HTTPException:
        raise
    except Exception as err:
        logger.error(
            "delete_interview_session_failed",
            error=str(err),
            user_id=str(current_user.id)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete session: {str(err)}"
        )

@router.post(
    "/sessions/{id}/answer",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="Submit answer for a question - Not Implemented",
)
async def submit_answer(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user)
):
    """Placeholder endpoint returning 501 Not Implemented."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Implemented in Phase 10 Part 1B / Part 2"
    )

@router.post(
    "/sessions/{id}/complete",
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
    summary="Complete interview session - Not Implemented",
)
async def complete_session(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user)
):
    """Placeholder endpoint returning 501 Not Implemented."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Implemented in Phase 10 Part 1B / Part 2"
    )

@router.post(
    "/generate",
    response_model=InterviewSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create session and generate questions"
)
async def generate_interview(
    request: InterviewSessionCreate,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Creates a session and generates its questions immediately."""
    try:
        # Create session
        session = await service.create_session(user_id=current_user.id, request=request)
        # Generate questions
        await service.generate_session_questions(session_id=session.id, user_id=current_user.id, mode="entire")
        # Refresh session from DB
        updated_session = await service.get_session(session.id, current_user.id)
        return map_session_to_response(updated_session)
    except ValueError as val_err:
        logger.warning("generate_interview_validation_failed", error=str(val_err), user_id=str(current_user.id))
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("generate_interview_failed", error=str(err), user_id=str(current_user.id))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))

@router.post(
    "/session/{id}/questions",
    response_model=List[InterviewTurnResponse],
    status_code=status.HTTP_200_OK,
    summary="Generate questions for an existing session"
)
async def generate_questions_for_session(
    id: uuid.UUID,
    request: Optional[GenerateQuestionsRequest] = None,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Generate questions for an existing session."""
    try:
        mode = request.mode if request else "entire"
        count = request.count if request else None
        turns = await service.generate_session_questions(
            session_id=id,
            user_id=current_user.id,
            mode=mode,
            count=count
        )
        return [
            InterviewTurnResponse(
                id=turn.id,
                session_id=turn.session_id,
                question_number=turn.question_number,
                question_category=turn.question_category,
                question_text=turn.question_text,
                answer_text=turn.answer_text,
                feedback=turn.feedback,
                score=turn.score,
                created_at=turn.created_at,
                updated_at=turn.updated_at
            )
            for turn in turns
        ]
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("generate_questions_for_session_failed", error=str(err), session_id=str(id))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))

@router.get(
    "/session/{id}/questions",
    response_model=List[InterviewTurnResponse],
    status_code=status.HTTP_200_OK,
    summary="Get questions for a session"
)
async def get_session_questions(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Retrieve all generated questions (turns) for the session."""
    try:
        session = await service.get_session(session_id=id, user_id=current_user.id)
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
        return [
            InterviewTurnResponse(
                id=turn.id,
                session_id=turn.session_id,
                question_number=turn.question_number,
                question_category=turn.question_category,
                question_text=turn.question_text,
                answer_text=turn.answer_text,
                feedback=turn.feedback,
                score=turn.score,
                created_at=turn.created_at,
                updated_at=turn.updated_at
            )
            for turn in session.turns
        ]
    except HTTPException:
        raise
    except Exception as err:
        logger.error("get_session_questions_failed", error=str(err), session_id=str(id))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))

@router.delete(
    "/session/{id}/questions",
    status_code=status.HTTP_200_OK,
    summary="Clear questions for a session"
)
async def clear_session_questions(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Clear all generated questions/turns for the session, resetting it to PENDING."""
    try:
        await service.clear_session_questions(session_id=id, user_id=current_user.id)
        return {"success": True, "message": "Questions cleared successfully."}
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("clear_session_questions_failed", error=str(err), session_id=str(id))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))

@router.post(
    "/session/{id}/evaluate",
    response_model=AnswerEvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Evaluate candidate's answer for the active turn in a session",
    responses={
        400: {"description": "Bad Request"},
        404: {"description": "Session or turn not found"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    }
)
async def evaluate_session_answer(
    id: uuid.UUID,
    request: AnswerSubmitRequest,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Evaluate candidate's answer for the active turn in a session."""
    try:
        evaluation = await service.evaluate_turn_answer(
            session_id=id,
            user_id=current_user.id,
            answer_text=request.answer
        )
        return evaluation
    except ValueError as val_err:
        logger.warning(
            "evaluate_session_answer_validation_failed",
            session_id=str(id),
            error=str(val_err)
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error(
            "evaluate_session_answer_failed",
            session_id=str(id),
            error=str(err)
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(err)
        )

@router.post(
    "/evaluate",
    response_model=AnswerEvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Ad-hoc evaluation of a single interview answer",
    responses={
        400: {"description": "Bad Request"},
        422: {"model": ValidationErrorResponse, "description": "Validation Error"},
    }
)
async def evaluate_ad_hoc_answer(
    request: AdHocEvaluationRequest,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Ad-hoc evaluation of a single interview answer without a session record."""
    try:
        # Create dummy structures
        session = InterviewSession(
            id=uuid.uuid4(),
            user_id=current_user.id,
            interview_type=request.interview_type,
            difficulty=request.difficulty,
            target_role=request.role,
            company_name=request.company,
            total_questions=1,
            current_question=1,
            status="IN_PROGRESS"
        )
        turn = InterviewTurn(
            id=uuid.uuid4(),
            session_id=session.id,
            question_number=1,
            question_text=request.question,
            question_category=request.interview_type
        )
        
        # Build context
        context = InterviewContext(
            company=request.company,
            target_role=request.role
        )
        
        # Run evaluation directly using interview_ai_service
        evaluation, ai_response = await service.interview_ai_service.evaluate_answer(
            session=session,
            turn=turn,
            context=context,
            answer_text=request.answer
        )
        
        return AnswerEvaluationResponse(
            overall_score=evaluation.overall_score,
            technical_score=evaluation.technical_score,
            communication_score=evaluation.communication_score,
            grammar_score=evaluation.grammar_score,
            confidence_score=evaluation.confidence_score,
            professionalism_score=evaluation.professionalism_score,
            star_score=evaluation.star_score,
            strengths=evaluation.strengths,
            weaknesses=evaluation.weaknesses,
            missing_topics=evaluation.missing_topics,
            improvements=evaluation.improvements,
            followup_questions=evaluation.followup_questions,
            summary=evaluation.summary
        )
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("ad_hoc_evaluation_failed", error=str(err))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(err)
        )

@router.get(
    "/session/{id}/evaluation",
    status_code=status.HTTP_200_OK,
    summary="Get aggregated evaluations for a session"
)
async def get_session_evaluation(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Retrieve evaluation details and overall metrics for a session."""
    try:
        res = await service.get_session_evaluation(session_id=id, user_id=current_user.id)
        return res
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("get_session_evaluation_failed", session_id=str(id), error=str(err))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(err)
        )

@router.delete(
    "/session/{id}/evaluation",
    status_code=status.HTTP_200_OK,
    summary="Clear all evaluation records for a session"
)
async def delete_session_evaluation(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service)
):
    """Clear all answers and evaluation scores/feedback for a session, resetting progress."""
    try:
        await service.clear_session_evaluation(session_id=id, user_id=current_user.id)
        return {
            "success": True,
            "message": "Evaluations cleared successfully."
        }
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(val_err)
        )
    except Exception as err:
        logger.error("delete_session_evaluation_failed", session_id=str(id), error=str(err))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(err)
        )


@router.post(
    "/session/start",
    response_model=InterviewSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new interview session immediately"
)
async def start_session(
    request: InterviewSessionCreate,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        session = await service.create_session(user_id=current_user.id, request=request)
        started_session = await manager.start_interview(session_id=session.id, user_id=current_user.id)
        return map_session_to_response(started_session)
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except HTTPException:
        raise
    except Exception as err:
        logger.error("start_session_endpoint_failed", error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/session/{id}/answer",
    response_model=AnswerEvaluationResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit answer for the current question"
)
async def submit_session_answer(
    id: uuid.UUID,
    request: AnswerSubmitRequest,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        res = await manager.submit_answer(session_id=id, user_id=current_user.id, answer_text=request.answer)
        return res
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("submit_answer_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/session/{id}/next",
    response_model=InterviewTurnResponse,
    status_code=status.HTTP_200_OK,
    summary="Get next question (or follow-up question) in session"
)
async def next_session_question(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        turn = await manager.get_next_question(session_id=id, user_id=current_user.id)
        return InterviewTurnResponse(
            id=turn.id,
            session_id=turn.session_id,
            question_number=turn.question_number,
            question_category=turn.question_category,
            question_text=turn.question_text,
            answer_text=turn.answer_text,
            feedback=turn.feedback,
            score=turn.score,
            created_at=turn.created_at,
            updated_at=turn.updated_at
        )
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("next_question_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/session/{id}/pause",
    status_code=status.HTTP_200_OK,
    summary="Pause session timer"
)
async def pause_session(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        await manager.pause_interview(session_id=id, user_id=current_user.id)
        return {"success": True, "message": "Interview session paused successfully."}
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("pause_session_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/session/{id}/resume",
    status_code=status.HTTP_200_OK,
    summary="Resume session timer"
)
async def resume_session(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        await manager.resume_interview(session_id=id, user_id=current_user.id)
        return {"success": True, "message": "Interview session resumed successfully."}
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("resume_session_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/session/{id}/cancel",
    status_code=status.HTTP_200_OK,
    summary="Cancel active interview session"
)
async def cancel_session(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        await manager.cancel_interview(session_id=id, user_id=current_user.id)
        return {"success": True, "message": "Interview session cancelled successfully."}
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("cancel_session_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/session/{id}/complete",
    status_code=status.HTTP_200_OK,
    summary="Complete active interview session"
)
async def complete_session_endpoint(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        await manager.complete_interview(session_id=id, user_id=current_user.id)
        return {"success": True, "message": "Interview session completed successfully."}
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("complete_session_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.get(
    "/session/{id}/status",
    status_code=status.HTTP_200_OK,
    summary="Get session status and timers"
)
async def get_session_status(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        res = await manager.get_status(session_id=id, user_id=current_user.id)
        return res
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(val_err))
    except Exception as err:
        logger.error("get_status_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.get(
    "/session/{id}/progress",
    status_code=status.HTTP_200_OK,
    summary="Get session progress metrics"
)
async def get_session_progress(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    manager: InterviewSessionManager = Depends(get_interview_session_manager)
):
    try:
        res = await manager.get_progress(session_id=id, user_id=current_user.id)
        return res
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(val_err))
    except Exception as err:
        logger.error("get_progress_endpoint_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.get(
    "/session/{id}/analytics",
    response_model=InterviewAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get quantitative analytics for a session"
)
async def get_session_analytics_endpoint(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: InterviewService = Depends(get_interview_service),
    analytics_service: InterviewAnalyticsService = Depends(get_interview_analytics_service)
):
    try:
        session = await service.get_session(session_id=id, user_id=current_user.id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Interview session with ID '{id}' not found."
            )
        res = analytics_service.calculate_session_analytics(session)
        return res
    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("get_session_analytics_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.get(
    "/session/{id}/report",
    response_model=InterviewAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get full feedback and analytics report for a session"
)
async def get_session_report_endpoint(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    analytics_service: InterviewAnalyticsService = Depends(get_interview_analytics_service)
):
    try:
        res = await analytics_service.get_or_create_report(session_id=id, user_id=current_user.id)
        return res
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(val_err))
    except Exception as err:
        logger.error("get_session_report_failed", session_id=str(id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.get(
    "/history/analytics",
    status_code=status.HTTP_200_OK,
    summary="Get historical interview analytics for the user"
)
async def get_history_analytics_endpoint(
    current_user: User = Depends(get_current_user),
    analytics_service: InterviewAnalyticsService = Depends(get_interview_analytics_service)
):
    try:
        res = await analytics_service.get_history_analytics(user_id=current_user.id)
        return res
    except Exception as err:
        logger.error("get_history_analytics_failed", user_id=str(current_user.id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


@router.post(
    "/report/regenerate",
    response_model=InterviewAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Force regenerate qualitative AI feedback report"
)
async def regenerate_report_endpoint(
    request: ReportRegenerateRequest,
    current_user: User = Depends(get_current_user),
    analytics_service: InterviewAnalyticsService = Depends(get_interview_analytics_service)
):
    try:
        res = await analytics_service.regenerate_report(session_id=request.session_id, user_id=current_user.id)
        return res
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        logger.error("regenerate_report_failed", session_id=str(request.session_id), error=str(err))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(err))


