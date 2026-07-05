# app/modules/agents/career_coach/agent.py

import time
import uuid
from typing import Dict, Any, Optional, List
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.career_coach.service import CareerCoachAgentService
from app.modules.agents.exceptions import AgentExecutionError, AgentValidationError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()

class CareerCoachAgent(BaseAgent):
    """Career Coach Agent managing career roadmaps, readiness analysis, risk identification, and study planning."""

    def __init__(
        self,
        agent_id: str = "career_coach_agent",
        name: str = "Career Coach Agent",
        description: str = "Dedicated AI Agent for personalized career guidance, roadmap generation, risk assessment, and progress tracking.",
        supported_tasks: Optional[List[str]] = None,
        required_tools: Optional[List[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or [
                "roadmap", "analyze", "progress", "weekly_plan", "weekly-plan", "monthly_plan", "monthly-plan"
            ],
            required_tools=required_tools or ["ai_service", "roadmap_service", "career_analytics_service", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates input context requirements based on task types."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("career_coach_agent_unsupported_task", task=context.current_task)
            return False

        if task == "roadmap":
            if not context.shared_variables.get("target_role"):
                logger.warning("career_coach_agent_missing_target_role", task=task)
                return False
            if not context.shared_variables.get("experience_level"):
                logger.warning("career_coach_agent_missing_experience_level", task=task)
                return False
        elif task == "analyze":
            if not context.shared_variables.get("target_role"):
                logger.warning("career_coach_agent_missing_target_role", task=task)
                return False
        elif task in ["progress", "weekly_plan", "weekly-plan", "monthly_plan", "monthly-plan"]:
            if not context.shared_variables.get("roadmap_id"):
                logger.warning("career_coach_agent_missing_roadmap_id", task=task)
                return False

        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specialized career coach tasks."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()

        # Privacy compliant logging (NO career roadmaps, NO prompts, NO personal data)
        logger.info(
            "career_coach_agent_execution_started",
            agent_name=self.name,
            task=task,
            request_id=context.request_id,
            roadmap_id=str(context.shared_variables.get("roadmap_id")) if context.shared_variables.get("roadmap_id") else None
        )

        errors = []
        output = {}
        status = "success"

        try:
            user_id = uuid.UUID(str(context.user_id)) if isinstance(context.user_id, str) else context.user_id
            
            with SessionLocal() as db:
                service = CareerCoachAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task == "roadmap":
                    resume_id = context.shared_variables.get("resume_id")
                    if resume_id:
                        resume_id = uuid.UUID(str(resume_id))
                    target_role = context.shared_variables.get("target_role")
                    current_role = context.shared_variables.get("current_role")
                    experience_level = context.shared_variables.get("experience_level")
                    target_industry = context.shared_variables.get("target_industry")
                    estimated_duration_months = context.shared_variables.get("estimated_duration_months", 12)
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.generate_roadmap(
                        user_id=user_id,
                        target_role=target_role,
                        experience_level=experience_level,
                        current_role=current_role,
                        target_industry=target_industry,
                        estimated_duration_months=estimated_duration_months,
                        resume_id=resume_id,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "analyze":
                    resume_id = context.shared_variables.get("resume_id")
                    if resume_id:
                        resume_id = uuid.UUID(str(resume_id))
                    target_role = context.shared_variables.get("target_role")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.analyze(
                        user_id=user_id,
                        target_role=target_role,
                        resume_id=resume_id,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "progress":
                    roadmap_id = uuid.UUID(str(context.shared_variables.get("roadmap_id")))
                    completed_milestones = context.shared_variables.get("completed_milestones")
                    current_milestone = context.shared_variables.get("current_milestone")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.progress(
                        user_id=user_id,
                        roadmap_id=roadmap_id,
                        completed_milestones=completed_milestones,
                        current_milestone=current_milestone,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["weekly_plan", "weekly-plan"]:
                    roadmap_id = uuid.UUID(str(context.shared_variables.get("roadmap_id")))
                    week_number = context.shared_variables.get("week_number", 1)
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.weekly_plan(
                        user_id=user_id,
                        roadmap_id=roadmap_id,
                        week_number=week_number,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["monthly_plan", "monthly-plan"]:
                    roadmap_id = uuid.UUID(str(context.shared_variables.get("roadmap_id")))
                    month_number = context.shared_variables.get("month_number", 1)
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.monthly_plan(
                        user_id=user_id,
                        roadmap_id=roadmap_id,
                        month_number=month_number,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                else:
                    raise AgentExecutionError(f"Unsupported task type: '{task}'")

        except Exception as e:
            status = "failed"
            errors.append(str(e))
            output = {"error": str(e)}
            logger.error(
                "career_coach_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                roadmap_id=str(context.shared_variables.get("roadmap_id")) if context.shared_variables.get("roadmap_id") else None
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "career_coach_agent_execution_finished",
            agent_name=self.name,
            task=task,
            status=status,
            execution_time_ms=duration_ms,
            request_id=context.request_id,
            roadmap_id=str(context.shared_variables.get("roadmap_id")) if context.shared_variables.get("roadmap_id") else None
        )

        return AgentResponse(
            agent_id=self.agent_id,
            status=status,
            output=output,
            errors=errors if errors else None,
            execution_time_ms=duration_ms
        )

    async def health(self) -> AgentHealthStatus:
        """Diagnose agent status, checking active AI service provider connection."""
        status_val = "healthy"
        msg = "Career Coach Agent is operational."
        details = {}
        
        try:
            if self.ai_service and self.ai_service.provider:
                details["provider"] = self.ai_service.provider.provider_name
                if not self.ai_service.provider.client:
                    status_val = "unhealthy"
                    msg = "AI provider client is not initialized."
            else:
                status_val = "unhealthy"
                msg = "AI Service is not configured."
        except Exception as e:
            status_val = "unhealthy"
            msg = f"Health check failed: {str(e)}"
            details["error"] = str(e)

        return AgentHealthStatus(
            agent_id=self.agent_id,
            name=self.name,
            status=status_val,
            message=msg,
            details=details
        )
