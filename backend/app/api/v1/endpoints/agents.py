# app/api/v1/endpoints/agents.py

import time
import uuid
from typing import List, Any, Optional, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import structlog

from app.core.dependencies import get_current_user
from app.core.db import get_db
from app.models.user import User
from app.modules.agents.context import AgentContext
from app.modules.agents.dependencies import (
    get_agent_registry,
    get_agent_orchestrator,
    get_workflow_engine,
    get_tool_registry,
    get_tool_executor,
    get_memory_manager
)
from app.modules.agents.registry import AgentRegistry

from app.modules.agents.orchestrator import AgentOrchestrator
from app.modules.agents.models import (
    AgentMetadata,
    AgentHealthStatus,
    ExecutionRequest,
    ExecutionResponse,
)
from app.modules.agents.exceptions import AgentNotFoundError, AgentValidationError, OrchestrationError
from app.modules.agents.resume.models import (
    ResumeReviewRequest,
    ResumeRewriteRequest,
    ResumeOptimizeRequest,
    ResumeSummaryRequest,
    ResumeSummaryResponse
)
from app.modules.agents.ats.models import (
    ATSReviewRequest,
    ATSScoreRequest,
    ATSImproveRequest
)
from app.modules.agents.job.models import (
    JobMatchRequest,
    JobAnalyzeRequest,
    JobRecommendRequest
)
from app.modules.agents.cover_letter.models import (
    CoverLetterAgentGenerateRequest,
    CoverLetterAgentReviewRequest,
    CoverLetterAgentRewriteRequest
)
from app.modules.agents.interview.models import (
    InterviewAgentQuestionsRequest,
    InterviewAgentEvaluateRequest,
    InterviewAgentMockRequest,
    InterviewAgentReadinessRequest
)
from app.modules.agents.career_coach.models import (
    CareerCoachRoadmapRequest,
    CareerCoachAnalyzeRequest,
    CareerCoachProgressRequest,
    CareerCoachWeeklyPlanRequest,
    CareerCoachMonthlyPlanRequest
)
from app.modules.agents.learning.models import (
    LearningRecommendRequest,
    LearningPathRequest,
    LearningCoursesRequest,
    LearningCertificationsRequest,
    LearningStudyPlanRequest
)


logger = structlog.get_logger()
router = APIRouter()


@router.get("", response_model=List[AgentMetadata], status_code=status.HTTP_200_OK)
async def list_agents(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves all dynamically registered agents in the system. Requires authentication."""
    try:
        return registry.list_metadata()
    except Exception as e:
        logger.error("api_list_agents_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve agent list."
        )


@router.get("/status", response_model=List[AgentHealthStatus], status_code=status.HTTP_200_OK)
async def get_agents_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Gathers health diagnostic checks across all registered agents. Requires authentication."""
    try:
        return await registry.get_all_health()
    except Exception as e:
        logger.error("api_get_agents_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve agents health status."
        )
from app.modules.agents.workflow.workflow_models import Workflow
from app.modules.agents.workflow.tools.tool_models import ToolExecutionRequest


@router.get("/workflows", status_code=status.HTTP_200_OK)
async def list_workflows(
    current_user: User = Depends(get_current_user)
):
    """Retrieves pre-configured workflow execution templates. Requires authentication."""
    return [
        {
            "name": "Resume Optimization Pipeline",
            "description": "Sequential workflow reviewing a resume, scoring ATS compliance, analyzing job matching, and recommending learning.",
            "execution_mode": "sequential",
            "steps": [
                {"name": "Review Resume", "type": "tool", "target": "resume_tool"},
                {"name": "ATS Scoring", "type": "tool", "target": "ats_tool"},
                {"name": "Job Matching", "type": "tool", "target": "job_match_tool"},
                {"name": "Recommend Studies", "type": "tool", "target": "learning_tool"}
            ]
        }
    ]


@router.post("/workflows/execute", status_code=status.HTTP_200_OK)
async def execute_workflow(
    payload: Workflow,
    current_user: User = Depends(get_current_user),
    workflow_engine: Any = Depends(get_workflow_engine)
):
    """Dynamically parses and executes a multi-agent workflow graph. Requires authentication."""
    try:
        from app.modules.agents.security import (
            sanitize_input,
            detect_prompt_injection,
            filter_sensitive_info,
            log_security_event
        )

        # Sanitize workflow variables
        if payload.variables:
            clean_vars = {}
            for k, v in payload.variables.items():
                if isinstance(v, str):
                    v_clean = sanitize_input(v)
                    is_inj, reason = detect_prompt_injection(v_clean)
                    if is_inj:
                        log_security_event(
                            "prompt_injection_attempt",
                            str(current_user.id),
                            {"input_field": f"workflow.variables.{k}", "reason": reason}
                        )
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Security threat detected: Prompt injection block."
                        )
                    clean_vars[k] = filter_sensitive_info(v_clean)
                else:
                    clean_vars[k] = v
            payload.variables = clean_vars

        context = {
            "user_id": str(current_user.id),
            "session_id": payload.workflow_id
        }
        result = await workflow_engine.execute_workflow(payload, context)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_execute_workflow_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/tools", status_code=status.HTTP_200_OK)
async def list_tools(
    current_user: User = Depends(get_current_user),
    tool_registry: Any = Depends(get_tool_registry)
):
    """Lists all registered tools and parameter validation schemas. Requires authentication."""
    try:
        return tool_registry.list_tools()
    except Exception as e:
        logger.exception("api_list_tools_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tool definitions."
        )


@router.post("/tools/execute", status_code=status.HTTP_200_OK)
async def execute_tool(
    payload: ToolExecutionRequest,
    current_user: User = Depends(get_current_user),
    tool_executor: Any = Depends(get_tool_executor)
):
    """Invokes a specific tool directly. Requires authentication."""
    try:
        from app.modules.agents.security import (
            sanitize_input,
            detect_prompt_injection,
            filter_sensitive_info,
            log_security_event
        )

        if not payload.user_id:
            payload.user_id = str(current_user.id)

        # Sanitize tool arguments
        if payload.arguments:
            clean_args = {}
            for k, v in payload.arguments.items():
                if isinstance(v, str):
                    v_clean = sanitize_input(v)
                    is_inj, reason = detect_prompt_injection(v_clean)
                    if is_inj:
                        log_security_event(
                            "prompt_injection_attempt",
                            str(current_user.id),
                            {"input_field": f"tool.arguments.{k}", "reason": reason}
                        )
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Security threat detected: Prompt injection block."
                        )
                    clean_args[k] = filter_sensitive_info(v_clean)
                else:
                    clean_args[k] = v
            payload.arguments = clean_args

        context = {
            "user_id": str(current_user.id),
            "session_id": payload.session_id or str(uuid.uuid4())
        }

        result = await tool_executor.execute_tool(payload, context)
        if not result.success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.error
            )
        
        # Filter sensitive info in output
        if result.output:
            if isinstance(result.output, dict):
                for k, v in result.output.items():
                    if isinstance(v, str):
                        result.output[k] = filter_sensitive_info(v)
            elif isinstance(result.output, str):
                result.output = filter_sensitive_info(result.output)
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_execute_tool_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )



@router.get("/memory", status_code=status.HTTP_200_OK)
async def get_session_memory(
    session_id: str,
    current_user: User = Depends(get_current_user),
    memory_manager: Any = Depends(get_memory_manager)
):
    """Inspects the shared memory state of a session. Requires authentication."""
    try:
        return memory_manager.get_full_status(session_id)
    except Exception as e:
        logger.exception("api_get_memory_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve session memory."
        )


@router.delete("/memory/{session_id}", status_code=status.HTTP_200_OK)
async def delete_session_memory(
    session_id: str,
    current_user: User = Depends(get_current_user),
    memory_manager: Any = Depends(get_memory_manager)
):
    """Completely clears the shared memory space for a session. Requires authentication."""
    try:
        memory_manager.clear_session(session_id)
        return {"status": "success", "message": f"Memory session '{session_id}' cleared."}
    except Exception as e:
        logger.exception("api_delete_memory_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete session memory."
        )


from app.modules.agents.dependencies import get_analytics_service
from app.modules.agents.analytics import (
    SystemAnalyticsSummary,
    CollaborationMetrics,
    PerformanceStats,
    HealthStatus,
    AgentExecutionStats,
    WorkflowExecutionStats,
    ToolStats
)

@router.get("/analytics", response_model=SystemAnalyticsSummary, status_code=status.HTTP_200_OK)
async def get_system_analytics(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Retrieves high-level summary statistics of agentic workflows. Requires authentication."""
    try:
        return analytics_service.get_summary()
    except Exception as e:
        logger.exception("api_get_system_analytics_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve system analytics summary."
        )


@router.get("/analytics/agents", response_model=Dict[str, AgentExecutionStats], status_code=status.HTTP_200_OK)
async def get_agents_analytics(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Retrieves execution statistics per agent. Requires authentication."""
    try:
        return analytics_service.get_agents_metrics()
    except Exception as e:
        logger.exception("api_get_agents_analytics_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve agents execution analytics."
        )


@router.get("/analytics/workflows", response_model=List[WorkflowExecutionStats], status_code=status.HTTP_200_OK)
async def get_workflows_analytics(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Retrieves workflows step execution statistics. Requires authentication."""
    try:
        return analytics_service.get_workflows_metrics()
    except Exception as e:
        logger.exception("api_get_workflows_analytics_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve workflows analytics."
        )


@router.get("/analytics/tools", response_model=Dict[str, ToolStats], status_code=status.HTTP_200_OK)
async def get_tools_analytics(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Retrieves tool execution statistics. Requires authentication."""
    try:
        return analytics_service.get_tools_metrics()
    except Exception as e:
        logger.exception("api_get_tools_analytics_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve tool execution analytics."
        )


@router.get("/analytics/performance", response_model=PerformanceStats, status_code=status.HTTP_200_OK)
async def get_performance_analytics(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Retrieves cache utilization and optimization reports. Requires authentication."""
    try:
        return analytics_service.get_performance_metrics()
    except Exception as e:
        logger.exception("api_get_performance_analytics_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve performance analytics."
        )


@router.get("/analytics/health", response_model=HealthStatus, status_code=status.HTTP_200_OK)
async def get_analytics_health(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Retrieves diagnostic and system health status. Requires authentication."""
    try:
        return analytics_service.get_health()
    except Exception as e:
        logger.exception("api_get_analytics_health_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve analytics diagnostics."
        )


@router.post("/analytics/cleanup", status_code=status.HTTP_200_OK)
async def trigger_analytics_memory_cleanup(
    current_user: User = Depends(get_current_user),
    analytics_service: Any = Depends(get_analytics_service)
):
    """Triggers scan to release memory spaces. Requires authentication."""
    try:
        return analytics_service.trigger_memory_cleanup()
    except Exception as e:
        logger.exception("api_trigger_memory_cleanup_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to trigger memory cleanup."
        )


@router.get("/{agent_id}", response_model=AgentMetadata, status_code=status.HTTP_200_OK)
async def get_agent_details(
    agent_id: str,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves detailed metadata for a specific agent. Requires authentication."""
    try:
        agent = registry.get(agent_id)
        return AgentMetadata(
            agent_id=agent.agent_id,
            name=agent.name,
            description=agent.description,
            supported_tasks=agent.supported_tasks,
            required_tools=agent.required_tools,
            enabled=agent.enabled
        )
    except AgentNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error("api_get_agent_details_failed", agent_id=agent_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve agent details."
        )


@router.post("/execute", response_model=ExecutionResponse, status_code=status.HTTP_200_OK)
async def execute_agent_task(
    payload: ExecutionRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: AgentOrchestrator = Depends(get_agent_orchestrator)
):
    """Dispatches a task request through the Agent Orchestrator. Requires authentication."""
    try:
        # Override user_id from token for security compliance
        payload.user_id = str(current_user.id)
        
        # Security sanitization, prompt injection check, sensitive info filtering
        from app.modules.agents.security import (
            sanitize_input,
            detect_prompt_injection,
            filter_sensitive_info,
            log_security_event
        )

        # 1. Validate & sanitize task field
        payload.task = sanitize_input(payload.task)
        is_inj, reason = detect_prompt_injection(payload.task)
        if is_inj:
            log_security_event(
                "prompt_injection_attempt",
                str(current_user.id),
                {"input_field": "task", "reason": reason}
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Security threat detected: Prompt injection block."
            )
        payload.task = filter_sensitive_info(payload.task)

        # 2. Validate & sanitize input_data dict
        if payload.input_data:
            clean_input_data = {}
            for k, v in payload.input_data.items():
                if isinstance(v, str):
                    v_clean = sanitize_input(v)
                    is_inj, reason = detect_prompt_injection(v_clean)
                    if is_inj:
                        log_security_event(
                            "prompt_injection_attempt",
                            str(current_user.id),
                            {"input_field": f"input_data.{k}", "reason": reason}
                        )
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Security threat detected: Prompt injection block."
                        )
                    clean_input_data[k] = filter_sensitive_info(v_clean)
                elif isinstance(v, dict):
                    clean_sub = {}
                    for sk, sv in v.items():
                        if isinstance(sv, str):
                            sv_clean = sanitize_input(sv)
                            is_inj, reason = detect_prompt_injection(sv_clean)
                            if is_inj:
                                log_security_event(
                                    "prompt_injection_attempt",
                                    str(current_user.id),
                                    {"input_field": f"input_data.{k}.{sk}", "reason": reason}
                                )
                                raise HTTPException(
                                    status_code=status.HTTP_400_BAD_REQUEST,
                                    detail="Security threat detected: Prompt injection block."
                                )
                            clean_sub[sk] = filter_sensitive_info(sv_clean)
                        else:
                            clean_sub[sk] = sv
                    clean_input_data[k] = clean_sub
                else:
                    clean_input_data[k] = v
            payload.input_data = clean_input_data

        response = await orchestrator.execute_task(payload)
        
        # Mask outputs inside response object
        if response.output:
            if isinstance(response.output, dict):
                for k, v in response.output.items():
                    if isinstance(v, str):
                        response.output[k] = filter_sensitive_info(v)
            elif isinstance(response.output, str):
                response.output = filter_sensitive_info(response.output)
        for step in response.steps:
            if step.output:
                if isinstance(step.output, dict):
                    for k, v in step.output.items():
                        if isinstance(v, str):
                            step.output[k] = filter_sensitive_info(v)
                elif isinstance(step.output, str):
                    step.output = filter_sensitive_info(step.output)

        if response.status == "failed":
            # Determine if it was due to validation error or normal failure
            has_validation_err = any("Validation failed" in err for step in response.steps if step.errors for err in step.errors)
            if has_validation_err:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=response.output.get("error", "Validation error occurred.")
                )
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_execute_agent_task_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Orchestrator failed to execute task: {str(e)}"
        )



@router.get("/resume/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_resume_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the Resume Agent. Requires authentication."""
    try:
        return await registry.get_health("resume_agent")
    except AgentNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error("api_get_resume_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Resume Agent health status."
        )


@router.post("/resume/review", status_code=status.HTTP_200_OK)
async def review_resume(
    payload: ResumeReviewRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes Resume Review workflow via the Resume Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_resume_review_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("resume_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="review",
            shared_variables={
                "resume_id": payload.resume_id,
                "mode": payload.mode,
                "language": payload.language,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Resume review failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_resume_review_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_resume_review_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/resume/rewrite", status_code=status.HTTP_200_OK)
async def rewrite_resume(
    payload: ResumeRewriteRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes Resume Rewrite workflow via the Resume Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_resume_rewrite_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("resume_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="rewrite",
            shared_variables={
                "resume_id": payload.resume_id,
                "mode": payload.mode,
                "section_name": payload.section_name,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Resume rewrite failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_resume_rewrite_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_resume_rewrite_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/resume/optimize", status_code=status.HTTP_200_OK)
async def optimize_resume(
    payload: ResumeOptimizeRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes Resume Optimization workflow via the Resume Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_resume_optimize_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("resume_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="optimize",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_description": payload.job_description,
                "mode": payload.mode,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Resume optimization failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_resume_optimize_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_resume_optimize_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/resume/summary", response_model=ResumeSummaryResponse, status_code=status.HTTP_200_OK)
async def summarize_resume(
    payload: ResumeSummaryRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes Resume Summary workflow via the Resume Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_resume_summary_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("resume_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="summary",
            shared_variables={
                "resume_id": payload.resume_id,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Resume summary failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_resume_summary_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_resume_summary_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/ats/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_ats_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the ATS Agent. Requires authentication."""
    try:
        return await registry.get_health("ats_agent")
    except AgentNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error("api_get_ats_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve ATS Agent health status."
        )


@router.post("/ats/review", status_code=status.HTTP_200_OK)
async def review_ats(
    payload: ATSReviewRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Runs ATS Review workflow via the ATS Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_ats_review_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("ats_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="ats_review",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "ATS review failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_ats_review_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_ats_review_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/ats/score", status_code=status.HTTP_200_OK)
async def score_ats(
    payload: ATSScoreRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Calculates ATS Score workflow via the ATS Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_ats_score_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("ats_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="ats_score",
            shared_variables={
                "resume_id": payload.resume_id,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "ATS score calculation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_ats_score_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_ats_score_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/ats/improve", status_code=status.HTTP_200_OK)
async def improve_ats(
    payload: ATSImproveRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Runs ATS improvement recommendations workflow via the ATS Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_ats_improve_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("ats_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="ats_improve",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "ATS improvement recommendations failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_ats_improve_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_ats_improve_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/job/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_job_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the Job Match Agent. Requires authentication."""
    try:
        return await registry.get_health("job_match_agent")
    except AgentNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        logger.error("api_get_job_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Job Match Agent health status."
        )


@router.post("/job/match", status_code=status.HTTP_200_OK)
async def match_job(
    payload: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Runs Job Matching workflow via the Job Match Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_job_match_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("job_match_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="job_match",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Job matching failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_job_match_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_job_match_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/job/analyze", status_code=status.HTTP_200_OK)
async def analyze_job(
    payload: JobAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Runs Job Gap Analysis workflow via the Job Match Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_job_analyze_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("job_match_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="job_analyze",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Job analysis failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_job_analyze_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_job_analyze_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/job/recommend", status_code=status.HTTP_200_OK)
async def recommend_job(
    payload: JobRecommendRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Runs Job Recommendations workflow via the Job Match Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_job_recommend_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("job_match_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="job_recommend",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Job recommendations failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_job_recommend_finished",
            user_id=str(current_user.id),
            resume_id=str(payload.resume_id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_job_recommend_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/cover-letter/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_cover_letter_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the Cover Letter Agent. Requires authentication."""
    try:
        return await registry.get_health("cover_letter_agent")
    except AgentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error("api_get_cover_letter_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Cover Letter Agent health status."
        )


@router.post("/cover-letter/generate", status_code=status.HTTP_200_OK)
async def generate_cover_letter_agent(
    payload: CoverLetterAgentGenerateRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates a Cover Letter using the Cover Letter Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_cover_letter_generate_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id)
    )
    try:
        agent = registry.get("cover_letter_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="generate",
            shared_variables={
                "resume_id": payload.resume_id,
                "company_name": payload.company_name,
                "job_title": payload.job_title,
                "job_description": payload.job_description,
                "writing_style": payload.writing_style,
                "generation_mode": payload.generation_mode,
                "experience_level": payload.experience_level,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Cover letter generation failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_cover_letter_generate_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_cover_letter_generate_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/cover-letter/review", status_code=status.HTTP_200_OK)
async def review_cover_letter_agent(
    payload: CoverLetterAgentReviewRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Reviews an existing cover letter via the Cover Letter Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_cover_letter_review_started",
        user_id=str(current_user.id),
        cover_letter_id=str(payload.cover_letter_id)
    )
    try:
        agent = registry.get("cover_letter_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="review",
            shared_variables={
                "cover_letter_id": payload.cover_letter_id,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Cover letter review failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_cover_letter_review_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_cover_letter_review_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/cover-letter/rewrite", status_code=status.HTTP_200_OK)
async def rewrite_cover_letter_agent(
    payload: CoverLetterAgentRewriteRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Rewrites an existing cover letter via the Cover Letter Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_cover_letter_rewrite_started",
        user_id=str(current_user.id),
        cover_letter_id=str(payload.cover_letter_id)
    )
    try:
        agent = registry.get("cover_letter_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="rewrite",
            shared_variables={
                "cover_letter_id": payload.cover_letter_id,
                "instructions": payload.instructions,
                "job_description": payload.job_description,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Cover letter rewrite failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_cover_letter_rewrite_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_cover_letter_rewrite_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/interview/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_interview_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the Interview Agent. Requires authentication."""
    try:
        return await registry.get_health("interview_agent")
    except AgentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error("api_get_interview_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Interview Agent health status."
        )


@router.post("/interview/questions", status_code=status.HTTP_200_OK)
async def generate_interview_agent_questions(
    payload: InterviewAgentQuestionsRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates interview questions using the Interview Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_interview_questions_started",
        user_id=str(current_user.id),
        session_id=str(payload.session_id)
    )
    try:
        agent = registry.get("interview_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(payload.session_id),
            request_id=str(uuid.uuid4()),
            current_task="questions",
            shared_variables={
                "session_id": payload.session_id,
                "count": payload.count
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Questions generation failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_interview_questions_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_interview_questions_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/interview/evaluate", status_code=status.HTTP_200_OK)
async def evaluate_interview_agent_answer(
    payload: InterviewAgentEvaluateRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Evaluates an answer response turn via the Interview Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_interview_evaluate_started",
        user_id=str(current_user.id),
        session_id=str(payload.session_id)
    )
    try:
        agent = registry.get("interview_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(payload.session_id),
            request_id=str(uuid.uuid4()),
            current_task="evaluate",
            shared_variables={
                "session_id": payload.session_id,
                "answer": payload.answer
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Answer evaluation failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_interview_evaluate_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_interview_evaluate_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/interview/mock", status_code=status.HTTP_200_OK)
async def start_mock_interview_agent(
    payload: InterviewAgentMockRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Starts a mock interview session and generates the first question. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_interview_mock_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id) if payload.resume_id else None
    )
    try:
        agent = registry.get("interview_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="mock",
            shared_variables={
                "resume_id": payload.resume_id,
                "job_id": payload.job_id,
                "company_name": payload.company_name,
                "target_role": payload.target_role,
                "interview_type": payload.interview_type,
                "difficulty": payload.difficulty,
                "total_questions": payload.total_questions
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Mock interview initiation failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_interview_mock_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_interview_mock_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/interview/readiness", status_code=status.HTTP_200_OK)
async def get_interview_agent_readiness(
    payload: InterviewAgentReadinessRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves interview readiness metrics and recommendation feedback. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_interview_readiness_started",
        user_id=str(current_user.id),
        session_id=str(payload.session_id) if payload.session_id else None
    )
    try:
        agent = registry.get("interview_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(payload.session_id) if payload.session_id else str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="readiness",
            shared_variables={
                "session_id": payload.session_id
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Readiness report failed."
            )

        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_interview_readiness_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_interview_readiness_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# Career Coach Agent Endpoints

@router.get("/career-coach/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_career_coach_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the Career Coach Agent. Requires authentication."""
    try:
        return await registry.get_health("career_coach_agent")
    except AgentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error("api_get_career_coach_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Career Coach Agent health status."
        )


@router.post("/career-coach/roadmap", status_code=status.HTTP_200_OK)
async def generate_career_roadmap(
    payload: CareerCoachRoadmapRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes Career Roadmap generation via Career Coach Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_career_coach_roadmap_started",
        user_id=str(current_user.id),
        resume_id=str(payload.resume_id) if payload.resume_id else None
    )
    try:
        agent = registry.get("career_coach_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="roadmap",
            shared_variables={
                "resume_id": payload.resume_id,
                "target_role": payload.target_role,
                "current_role": payload.current_role,
                "experience_level": payload.experience_level,
                "target_industry": payload.target_industry,
                "estimated_duration_months": payload.estimated_duration_months,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Roadmap generation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_career_coach_roadmap_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_career_coach_roadmap_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/career-coach/analyze", status_code=status.HTTP_200_OK)
async def analyze_career(
    payload: CareerCoachAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes Career Readiness and Risk Analysis via Career Coach Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_career_coach_analyze_started",
        user_id=str(current_user.id),
        target_role=payload.target_role
    )
    try:
        agent = registry.get("career_coach_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="analyze",
            shared_variables={
                "resume_id": payload.resume_id,
                "target_role": payload.target_role,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Career analysis failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_career_coach_analyze_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_career_coach_analyze_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/career-coach/progress", status_code=status.HTTP_200_OK)
async def track_career_progress(
    payload: CareerCoachProgressRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Executes progress goal tracking via Career Coach Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_career_coach_progress_started",
        user_id=str(current_user.id),
        roadmap_id=str(payload.roadmap_id)
    )
    try:
        agent = registry.get("career_coach_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="progress",
            shared_variables={
                "roadmap_id": payload.roadmap_id,
                "completed_milestones": payload.completed_milestones,
                "current_milestone": payload.current_milestone,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Progress tracking failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_career_coach_progress_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_career_coach_progress_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/career-coach/weekly-plan", status_code=status.HTTP_200_OK)
async def generate_weekly_career_plan(
    payload: CareerCoachWeeklyPlanRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates a weekly plan via Career Coach Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_career_coach_weekly_plan_started",
        user_id=str(current_user.id),
        roadmap_id=str(payload.roadmap_id),
        week_number=payload.week_number
    )
    try:
        agent = registry.get("career_coach_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="weekly_plan",
            shared_variables={
                "roadmap_id": payload.roadmap_id,
                "week_number": payload.week_number,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Weekly plan generation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_career_coach_weekly_plan_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_career_coach_weekly_plan_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/career-coach/monthly-plan", status_code=status.HTTP_200_OK)
async def generate_monthly_career_plan(
    payload: CareerCoachMonthlyPlanRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates a monthly plan via Career Coach Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_career_coach_monthly_plan_started",
        user_id=str(current_user.id),
        roadmap_id=str(payload.roadmap_id),
        month_number=payload.month_number
    )
    try:
        agent = registry.get("career_coach_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="monthly_plan",
            shared_variables={
                "roadmap_id": payload.roadmap_id,
                "month_number": payload.month_number,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Monthly plan generation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_career_coach_monthly_plan_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_career_coach_monthly_plan_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# Learning Agent Endpoints

@router.get("/learning/status", response_model=AgentHealthStatus, status_code=status.HTTP_200_OK)
async def get_learning_agent_status(
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Retrieves health status of the Learning Agent. Requires authentication."""
    try:
        return await registry.get_health("learning_agent")
    except AgentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error("api_get_learning_agent_status_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve Learning Agent health status."
        )


@router.post("/learning/recommend", status_code=status.HTTP_200_OK)
async def get_learning_recommendation(
    payload: LearningRecommendRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates study recommendation via Learning Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_learning_recommend_started",
        user_id=str(current_user.id),
        target_role=payload.target_role
    )
    try:
        agent = registry.get("learning_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="recommend",
            shared_variables={
                "resume_id": payload.resume_id,
                "target_role": payload.target_role,
                "skills": payload.skills,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Learning recommendation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_learning_recommend_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_learning_recommend_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/learning/path", status_code=status.HTTP_200_OK)
async def generate_learning_path(
    payload: LearningPathRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates study paths via Learning Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_learning_path_started",
        user_id=str(current_user.id),
        target_role=payload.target_role
    )
    try:
        agent = registry.get("learning_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="path",
            shared_variables={
                "resume_id": payload.resume_id,
                "target_role": payload.target_role,
                "preferences": payload.preferences,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Learning path generation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_learning_path_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_learning_path_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/learning/courses", status_code=status.HTTP_200_OK)
async def search_learning_courses(
    payload: LearningCoursesRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Searches and suggests courses via Learning Agent and Course KB RAG context. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_learning_courses_started",
        user_id=str(current_user.id),
        query=payload.query
    )
    try:
        agent = registry.get("learning_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="courses",
            shared_variables={
                "query": payload.query,
                "skills": payload.skills,
                "target_role": payload.target_role,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Course recommendation search failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_learning_courses_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_learning_courses_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/learning/certifications", status_code=status.HTTP_200_OK)
async def recommend_certifications(
    payload: LearningCertificationsRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Recommends certifications via Learning Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_learning_certifications_started",
        user_id=str(current_user.id),
        target_role=payload.target_role
    )
    try:
        agent = registry.get("learning_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="certifications",
            shared_variables={
                "target_role": payload.target_role,
                "skills": payload.skills,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Certification recommendation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_learning_certifications_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_learning_certifications_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.post("/learning/study-plan", status_code=status.HTTP_200_OK)
async def generate_study_plan(
    payload: LearningStudyPlanRequest,
    current_user: User = Depends(get_current_user),
    registry: AgentRegistry = Depends(get_agent_registry)
):
    """Generates study plans via Learning Agent. Requires authentication."""
    start_time = time.perf_counter()
    logger.info(
        "api_learning_study_plan_started",
        user_id=str(current_user.id),
        target_role=payload.target_role
    )
    try:
        agent = registry.get("learning_agent")
        context = AgentContext(
            user_id=str(current_user.id),
            session_id=str(uuid.uuid4()),
            request_id=str(uuid.uuid4()),
            current_task="study_plan",
            shared_variables={
                "target_role": payload.target_role,
                "hours_per_week": payload.hours_per_week,
                "duration_weeks": payload.duration_weeks,
                "model_override": payload.model_override,
                "bypass_cache": payload.bypass_cache
            }
        )
        response = await agent.execute(context)
        if response.status == "failed":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=response.errors[0] if response.errors else "Study plan generation failed."
            )
        
        duration_ms = (time.perf_counter() - start_time) * 1000
        logger.info(
            "api_learning_study_plan_finished",
            user_id=str(current_user.id),
            status=response.status,
            execution_time_ms=duration_ms
        )
        return response.output
    except AgentValidationError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("api_learning_study_plan_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )









