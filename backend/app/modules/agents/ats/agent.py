# app/modules/agents/ats/agent.py

import time
from typing import Dict, Any, Optional, List
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.ats.service import ATSAgentService
from app.modules.agents.exceptions import AgentExecutionError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()


class ATSAgent(BaseAgent):
    """ATS Agent specialized in Applicant Tracking System compliance, keyword matches, scoring, and reviews."""

    def __init__(
        self,
        agent_id: str = "ats_agent",
        name: str = "ATS Agent",
        description: str = "Dedicated AI Agent for ATS compliance, scoring, resume optimization, and recommendations.",
        supported_tasks: Optional[List[str]] = None,
        required_tools: Optional[List[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or [
                "ats_review", "ats_score", "ats_improve",
                "ats_keyword_analysis", "ats_missing_skills",
                "ats_readiness", "ats_recommendations"
            ],
            required_tools=required_tools or ["ai_service", "ats_service", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates that context has a supported task and resume_id in shared_variables."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("ats_agent_unsupported_task", task=context.current_task)
            return False

        resume_id = context.shared_variables.get("resume_id")
        if not resume_id:
            logger.warning("ats_agent_missing_resume_id", task=context.current_task)
            return False

        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specific ATS task on the resume."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()

        # Privacy compliant logging (NO prompts, NO resume data, NO personal info)
        logger.info(
            "ats_agent_execution_started",
            agent_name=self.name,
            task=task,
            request_id=context.request_id,
            resume_id=str(context.shared_variables.get("resume_id"))
        )

        errors = []
        output = {}
        status = "success"

        try:
            resume_id = context.shared_variables.get("resume_id")
            user_id = context.user_id

            with SessionLocal() as db:
                service = ATSAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task in ["ats_review", "ats_keyword_analysis", "ats_missing_skills", "ats_readiness", "ats_recommendations"]:
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    full_review = await service.review(
                        resume_id=resume_id,
                        user_id=user_id,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                    if task == "ats_review":
                        output = full_review
                    elif task == "ats_keyword_analysis":
                        output = {"keyword_analysis": full_review.get("keyword_analysis", [])}
                    elif task == "ats_missing_skills":
                        output = {"missing_skills": full_review.get("missing_skills", [])}
                    elif task == "ats_readiness":
                        output = {"ats_readiness": full_review.get("ats_readiness", "Medium")}
                    elif task == "ats_recommendations":
                        output = {"recommendations": full_review.get("recommendations", [])}

                elif task == "ats_score":
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)
                    output = await service.score(
                        resume_id=resume_id,
                        user_id=user_id,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "ats_improve":
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)
                    output = await service.improve(
                        resume_id=resume_id,
                        user_id=user_id,
                        job_description=job_description,
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
                "ats_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                resume_id=str(context.shared_variables.get("resume_id"))
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "ats_agent_execution_finished",
            agent_name=self.name,
            task=task,
            status=status,
            execution_time_ms=duration_ms,
            request_id=context.request_id,
            resume_id=str(context.shared_variables.get("resume_id"))
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
        msg = "ATS Agent is operational."
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
