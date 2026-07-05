# app/modules/agents/job/agent.py

import time
from typing import Dict, Any, Optional, List
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.job.service import JobMatchAgentService
from app.modules.agents.exceptions import AgentExecutionError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()


class JobMatchAgent(BaseAgent):
    """Job Match Agent specialized in resume vs JD matching, skill gap calculations, and job/course recommendations."""

    def __init__(
        self,
        agent_id: str = "job_match_agent",
        name: str = "Job Match Agent",
        description: str = "Dedicated AI Agent for Job matching, skill gap analysis, and tailored recommendations.",
        supported_tasks: Optional[List[str]] = None,
        required_tools: Optional[List[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or [
                "job_match", "job_matching", "match_score",
                "job_analyze", "skill_gap", "missing_keywords", "missing_skills",
                "education_match", "experience_match", "certification_match",
                "job_recommend", "job_recommendations", "resume_vs_jd_analysis"
            ],
            required_tools=required_tools or ["ai_service", "job_match_service", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates that context has a supported task and resume_id in shared_variables."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("job_match_agent_unsupported_task", task=context.current_task)
            return False

        resume_id = context.shared_variables.get("resume_id")
        if not resume_id:
            logger.warning("job_match_agent_missing_resume_id", task=context.current_task)
            return False

        # If matching or analyzing, job_description is required
        if task in ["job_match", "job_matching", "match_score", "job_analyze", "skill_gap",
                    "missing_keywords", "missing_skills", "education_match", "experience_match",
                    "certification_match", "resume_vs_jd_analysis"]:
            jd = context.shared_variables.get("job_description")
            if not jd or not isinstance(jd, str) or not jd.strip():
                logger.warning("job_match_agent_missing_job_description", task=context.current_task)
                return False

        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specialized job match task on the resume against a JD."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()

        # Privacy compliant logging (NO prompts, NO resume data, NO personal info)
        logger.info(
            "job_match_agent_execution_started",
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
                service = JobMatchAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task in ["job_match", "job_matching", "match_score"]:
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    match_output = await service.match(
                        resume_id=resume_id,
                        user_id=user_id,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                    if task == "match_score":
                        output = {"match_score": match_output.get("match_score", 0)}
                    else:
                        output = match_output

                elif task in ["job_analyze", "skill_gap", "missing_keywords", "missing_skills",
                              "education_match", "experience_match", "certification_match", "resume_vs_jd_analysis"]:
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    gap_output = await service.analyze(
                        resume_id=resume_id,
                        user_id=user_id,
                        job_description=job_description,
                        model_override=model_override,
                        bypass_cache=bypass_cache
                    )

                    if task in ["job_analyze", "resume_vs_jd_analysis"]:
                        output = gap_output
                    elif task in ["skill_gap", "missing_skills"]:
                        output = {"skill_gap": gap_output.get("gap_analysis", {}).get("skill_gap", {})}
                    elif task == "missing_keywords":
                        output = {"keyword_gap": gap_output.get("gap_analysis", {}).get("keyword_gap", {})}
                    elif task == "education_match":
                        output = {
                            "education_gap": gap_output.get("gap_analysis", {}).get("education_gap", {}),
                            "education_match_explanation": gap_output.get("ai_analysis", {}).get("education_match_explanation", "")
                        }
                    elif task == "experience_match":
                        output = {
                            "experience_gap": gap_output.get("gap_analysis", {}).get("experience_gap", {}),
                            "experience_match_explanation": gap_output.get("ai_analysis", {}).get("experience_match_explanation", "")
                        }
                    elif task == "certification_match":
                        output = {
                            "certification_gap": gap_output.get("gap_analysis", {}).get("certification_gap", {}),
                            "certification_match_explanation": gap_output.get("ai_analysis", {}).get("certification_match_explanation", "")
                        }

                elif task in ["job_recommend", "job_recommendations"]:
                    job_description = context.shared_variables.get("job_description")
                    model_override = context.shared_variables.get("model_override")
                    bypass_cache = context.shared_variables.get("bypass_cache", False)

                    output = await service.recommend(
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
                "job_match_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                resume_id=str(context.shared_variables.get("resume_id"))
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "job_match_agent_execution_finished",
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
        msg = "Job Match Agent is operational."
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
