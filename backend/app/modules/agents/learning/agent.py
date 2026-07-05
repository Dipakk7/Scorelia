# app/modules/agents/learning/agent.py

import time
import uuid
from typing import Dict, Any, Optional, List
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.learning.service import LearningAgentService
from app.modules.agents.exceptions import AgentExecutionError, AgentValidationError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()

class LearningAgent(BaseAgent):
    """Learning Agent managing course suggestions, learning paths, certification mapping, and study plan scheduling."""

    def __init__(
        self,
        agent_id: str = "learning_agent",
        name: str = "Learning Agent",
        description: str = "Dedicated AI Agent for learning recommendations, personalized study paths, course discovery, and certifications.",
        supported_tasks: Optional[List[str]] = None,
        required_tools: Optional[List[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or [
                "recommend", "path", "courses", "certifications", "study_plan", "study-plan"
            ],
            required_tools=required_tools or ["ai_service", "learning_recommendation_engine", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates input context requirements based on task types."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("learning_agent_unsupported_task", task=context.current_task)
            return False

        if task in ["recommend", "path", "certifications", "study_plan", "study-plan"]:
            if not context.shared_variables.get("target_role"):
                logger.warning("learning_agent_missing_target_role", task=task)
                return False

        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specialized learning tasks."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()

        # Privacy compliant logging (NO study plans, NO prompts, NO personal data)
        logger.info(
            "learning_agent_execution_started",
            agent_name=self.name,
            task=task,
            request_id=context.request_id,
            resume_id=str(context.shared_variables.get("resume_id")) if context.shared_variables.get("resume_id") else None
        )

        errors = []
        output = {}
        status = "success"

        try:
            user_id = uuid.UUID(str(context.user_id)) if isinstance(context.user_id, str) else context.user_id
            
            with SessionLocal() as db:
                service = LearningAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task == "recommend":
                    resume_id = context.shared_variables.get("resume_id")
                    if resume_id:
                        resume_id = uuid.UUID(str(resume_id))
                    target_role = context.shared_variables.get("target_role")
                    skills = context.shared_variables.get("skills")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.recommend(
                        user_id=user_id,
                        target_role=target_role,
                        resume_id=resume_id,
                        skills=skills,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "path":
                    resume_id = context.shared_variables.get("resume_id")
                    if resume_id:
                        resume_id = uuid.UUID(str(resume_id))
                    target_role = context.shared_variables.get("target_role")
                    preferences = context.shared_variables.get("preferences")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.path(
                        user_id=user_id,
                        target_role=target_role,
                        resume_id=resume_id,
                        preferences=preferences,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "courses":
                    query = context.shared_variables.get("query")
                    skills = context.shared_variables.get("skills")
                    target_role = context.shared_variables.get("target_role")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.courses(
                        user_id=user_id,
                        query=query,
                        skills=skills,
                        target_role=target_role,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "certifications":
                    target_role = context.shared_variables.get("target_role")
                    skills = context.shared_variables.get("skills")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.certifications(
                        user_id=user_id,
                        target_role=target_role,
                        skills=skills,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["study_plan", "study-plan"]:
                    target_role = context.shared_variables.get("target_role")
                    hours_per_week = context.shared_variables.get("hours_per_week", 10)
                    duration_weeks = context.shared_variables.get("duration_weeks", 4)
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.study_plan(
                        user_id=user_id,
                        target_role=target_role,
                        hours_per_week=hours_per_week,
                        duration_weeks=duration_weeks,
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
                "learning_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                resume_id=str(context.shared_variables.get("resume_id")) if context.shared_variables.get("resume_id") else None
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "learning_agent_execution_finished",
            agent_name=self.name,
            task=task,
            status=status,
            execution_time_ms=duration_ms,
            request_id=context.request_id,
            resume_id=str(context.shared_variables.get("resume_id")) if context.shared_variables.get("resume_id") else None
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
        msg = "Learning Agent is operational."
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
