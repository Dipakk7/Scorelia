# app/modules/agents/resume/agent.py

import time
from typing import Dict, Any, Optional
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.resume.service import ResumeAgentService
from app.modules.agents.exceptions import AgentExecutionError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()

class ResumeAgent(BaseAgent):
    """Resume Agent acting as a dedicated specialist for every resume-related workflow."""

    def __init__(
        self,
        agent_id: str = "resume_agent",
        name: str = "Resume Agent",
        description: str = "Dedicated AI Agent for resume review, rewrite, optimization, and parsing integration.",
        supported_tasks: Optional[list[str]] = None,
        required_tools: Optional[list[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or ["review", "rewrite", "optimize", "summary", "suggestions", "score", "parse", "feedback", "improvement_plan"],
            required_tools=required_tools or ["ai_service", "resume_review_service", "resume_rewrite_service", "resume_optimization_service", "resume_parser_service", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates that context has the required resume_id in shared_variables and a supported task."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("resume_agent_unsupported_task", task=context.current_task)
            return False
            
        resume_id = context.shared_variables.get("resume_id")
        if not resume_id:
            logger.warning("resume_agent_missing_resume_id", task=context.current_task)
            return False
            
        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specialized task on the resume."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()
        
        # Privacy compliant logging (NO prompts, NO resume data, NO personal info)
        logger.info(
            "resume_agent_execution_started",
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
                service = ResumeAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task in ["review", "review_resume", "feedback", "generate_feedback"]:
                    mode = context.shared_variables.get("mode", "STANDARD")
                    language = context.shared_variables.get("language", "en")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)
                    output = await service.review(
                        resume_id=resume_id,
                        user_id=user_id,
                        mode=mode,
                        language=language,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["rewrite", "rewrite_resume"]:
                    mode = context.shared_variables.get("mode", "STANDARD")
                    section_name = context.shared_variables.get("section_name")
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)
                    output = await service.rewrite(
                        resume_id=resume_id,
                        user_id=user_id,
                        mode=mode,
                        section_name=section_name,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["optimize", "optimize_resume", "improvement_plan", "generate_improvement_plan"]:
                    mode = context.shared_variables.get("mode", "STANDARD")
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)
                    output = await service.optimize(
                        resume_id=resume_id,
                        user_id=user_id,
                        job_description=job_description,
                        mode=mode,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["summary", "summarize_resume"]:
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)
                    output = await service.summarize(
                        resume_id=resume_id,
                        user_id=user_id,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task in ["suggestions", "generate_suggestions"]:
                    output = {"recommendations": await service.suggestions(resume_id=resume_id, user_id=user_id)}

                elif task in ["score", "retrieve_score", "quality_analysis"]:
                    output = await service.score(resume_id=resume_id, user_id=user_id)

                elif task in ["parse", "parse_resume"]:
                    output = await service.parse(resume_id=resume_id, user_id=user_id)

                else:
                    raise AgentExecutionError(f"Unsupported task type: '{task}'")

        except Exception as e:
            status = "failed"
            errors.append(str(e))
            output = {"error": str(e)}
            logger.error(
                "resume_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                resume_id=str(context.shared_variables.get("resume_id"))
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "resume_agent_execution_finished",
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
        msg = "Resume Agent is operational."
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
