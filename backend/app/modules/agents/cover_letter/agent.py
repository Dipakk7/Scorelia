# app/modules/agents/cover_letter/agent.py

import time
import uuid
from typing import Dict, Any, Optional, List
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.cover_letter.service import CoverLetterAgentService
from app.modules.agents.exceptions import AgentExecutionError, AgentValidationError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()

class CoverLetterAgent(BaseAgent):
    """Cover Letter Agent acting as a dedicated specialist for cover letter creation and refinement."""

    def __init__(
        self,
        agent_id: str = "cover_letter_agent",
        name: str = "Cover Letter Agent",
        description: str = "Dedicated AI Agent for generating, reviewing, rewriting, and optimizing cover letters.",
        supported_tasks: Optional[List[str]] = None,
        required_tools: Optional[List[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or [
                "generate", "review", "rewrite", "optimize", "suggestions",
                "generate_company_specific", "generate_internship", "generate_fresher", "generate_experienced"
            ],
            required_tools=required_tools or ["ai_service", "cover_letter_service", "cover_letter_optimization_service", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates that context has the required fields and task type."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("cover_letter_agent_unsupported_task", task=context.current_task)
            return False

        if task in ["generate", "generate_company_specific", "generate_internship", "generate_fresher", "generate_experienced"]:
            resume_id = context.shared_variables.get("resume_id")
            if not resume_id:
                logger.warning("cover_letter_agent_missing_resume_id", task=context.current_task)
                return False
            # Check company_name and job_title
            company_name = context.shared_variables.get("company_name")
            job_title = context.shared_variables.get("job_title")
            if not company_name or not job_title:
                logger.warning("cover_letter_agent_missing_generation_parameters", task=context.current_task)
                return False
        else:
            # optimize, suggestions, review, rewrite require cover_letter_id
            cover_letter_id = context.shared_variables.get("cover_letter_id")
            if not cover_letter_id:
                logger.warning("cover_letter_agent_missing_cover_letter_id", task=context.current_task)
                return False
            
            if task == "rewrite" and not context.shared_variables.get("instructions"):
                logger.warning("cover_letter_agent_missing_rewrite_instructions")
                return False

        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specialized task on the cover letter."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()

        # Privacy compliant logging (NO cover letter text, NO personal info, NO prompts)
        logger.info(
            "cover_letter_agent_execution_started",
            agent_name=self.name,
            task=task,
            request_id=context.request_id,
            resume_id=str(context.shared_variables.get("resume_id")) if context.shared_variables.get("resume_id") else None,
            cover_letter_id=str(context.shared_variables.get("cover_letter_id")) if context.shared_variables.get("cover_letter_id") else None
        )

        errors = []
        output = {}
        status = "success"

        try:
            user_id = uuid.UUID(str(context.user_id)) if isinstance(context.user_id, str) else context.user_id

            with SessionLocal() as db:
                service = CoverLetterAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task in ["generate", "generate_company_specific", "generate_internship", "generate_fresher", "generate_experienced"]:
                    resume_id = uuid.UUID(str(context.shared_variables.get("resume_id")))
                    company_name = context.shared_variables.get("company_name")
                    job_title = context.shared_variables.get("job_title")
                    job_description = context.shared_variables.get("job_description")
                    writing_style = context.shared_variables.get("writing_style", "PROFESSIONAL")
                    generation_mode = context.shared_variables.get("generation_mode", "STANDARD")
                    
                    # Map task to experience level
                    experience_level = context.shared_variables.get("experience_level", "EXPERIENCED")
                    if task == "generate_internship":
                        experience_level = "INTERNSHIP"
                    elif task == "generate_fresher":
                        experience_level = "FRESHER"
                    elif task == "generate_experienced":
                        experience_level = "EXPERIENCED"

                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.generate(
                        resume_id=resume_id,
                        user_id=user_id,
                        company_name=company_name,
                        job_title=job_title,
                        job_description=job_description,
                        writing_style=writing_style,
                        generation_mode=generation_mode,
                        experience_level=experience_level,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "review":
                    cover_letter_id = uuid.UUID(str(context.shared_variables.get("cover_letter_id")))
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.review(
                        cover_letter_id=cover_letter_id,
                        user_id=user_id,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "rewrite":
                    cover_letter_id = uuid.UUID(str(context.shared_variables.get("cover_letter_id")))
                    instructions = context.shared_variables.get("instructions")
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.rewrite(
                        cover_letter_id=cover_letter_id,
                        user_id=user_id,
                        instructions=instructions,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "optimize":
                    cover_letter_id = uuid.UUID(str(context.shared_variables.get("cover_letter_id")))
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.optimize(
                        cover_letter_id=cover_letter_id,
                        user_id=user_id,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                elif task == "suggestions":
                    cover_letter_id = uuid.UUID(str(context.shared_variables.get("cover_letter_id")))
                    suggestions_list = await service.suggestions(
                        cover_letter_id=cover_letter_id,
                        user_id=user_id
                    )
                    output = {"suggestions": suggestions_list}

                else:
                    raise AgentExecutionError(f"Unsupported task type: '{task}'")

        except Exception as e:
            status = "failed"
            errors.append(str(e))
            output = {"error": str(e)}
            logger.error(
                "cover_letter_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                cover_letter_id=str(context.shared_variables.get("cover_letter_id")) if context.shared_variables.get("cover_letter_id") else None
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "cover_letter_agent_execution_finished",
            agent_name=self.name,
            task=task,
            status=status,
            execution_time_ms=duration_ms,
            request_id=context.request_id
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
        msg = "Cover Letter Agent is operational."
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
