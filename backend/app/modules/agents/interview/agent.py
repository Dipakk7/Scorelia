# app/modules/agents/interview/agent.py

import time
import uuid
from typing import Dict, Any, Optional, List
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.interview.service import InterviewAgentService
from app.modules.agents.exceptions import AgentExecutionError, AgentValidationError
from app.core.db import SessionLocal
import structlog

logger = structlog.get_logger()

class InterviewAgent(BaseAgent):
    """Interview Agent acting as a dedicated specialist for prep mock sessions, question generation, and STAR reviews."""

    def __init__(
        self,
        agent_id: str = "interview_agent",
        name: str = "Interview Agent",
        description: str = "Dedicated AI Agent for HR, technical, behavioral, and mock interviews, answer evaluation, and readiness assessment.",
        supported_tasks: Optional[List[str]] = None,
        required_tools: Optional[List[str]] = None,
        **kwargs: Any
    ):
        super().__init__(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks or [
                "questions", "generate_questions",
                "evaluate", "evaluate_answer",
                "mock", "mock_interview",
                "readiness", "readiness_report",
                "feedback"
            ],
            required_tools=required_tools or ["ai_service", "interview_service", "interview_session_manager", "interview_analytics_service", "rag_orchestrator"],
            **kwargs
        )

    async def validate(self, context: AgentContext) -> bool:
        """Validates that context has the required fields and task type."""
        task = context.current_task.lower().strip()
        if task not in self.supported_tasks:
            logger.warning("interview_agent_unsupported_task", task=context.current_task)
            return False

        if task in ["questions", "generate_questions"]:
            session_id = context.shared_variables.get("session_id")
            if not session_id:
                logger.warning("interview_agent_missing_session_id", task=context.current_task)
                return False

        elif task in ["evaluate", "evaluate_answer"]:
            session_id = context.shared_variables.get("session_id")
            answer = context.shared_variables.get("answer")
            if not session_id or not answer:
                logger.warning("interview_agent_missing_evaluation_parameters", task=context.current_task)
                return False

        elif task in ["mock", "mock_interview"]:
            # resume_id is optional but checked if provided
            pass

        elif task in ["readiness", "readiness_report"]:
            # session_id is optional (can pull historical aggregates if empty)
            pass

        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the specialized task on the interview setup."""
        start_time = time.perf_counter()
        task = context.current_task.lower().strip()

        # Privacy compliant logging (NO answers, NO questions, NO personal info, NO prompts)
        logger.info(
            "interview_agent_execution_started",
            agent_name=self.name,
            task=task,
            request_id=context.request_id,
            session_id=str(context.shared_variables.get("session_id")) if context.shared_variables.get("session_id") else None
        )

        errors = []
        output = {}
        status = "success"

        try:
            user_id = uuid.UUID(str(context.user_id)) if isinstance(context.user_id, str) else context.user_id

            with SessionLocal() as db:
                service = InterviewAgentService(
                    db=db,
                    ai_service=self.ai_service,
                    rag_orchestrator=self.rag_orchestrator
                )

                if task in ["questions", "generate_questions"]:
                    session_id = uuid.UUID(str(context.shared_variables.get("session_id")))
                    count = int(context.shared_variables.get("count", 1))

                    questions_list = await service.questions(
                        session_id=session_id,
                        user_id=user_id,
                        count=count
                    )
                    output = {"questions": questions_list}

                elif task in ["evaluate", "evaluate_answer"]:
                    session_id = uuid.UUID(str(context.shared_variables.get("session_id")))
                    answer = context.shared_variables.get("answer")

                    output = await service.evaluate(
                        session_id=session_id,
                        user_id=user_id,
                        answer=answer
                    )

                elif task in ["mock", "mock_interview"]:
                    resume_id_str = context.shared_variables.get("resume_id")
                    resume_id = uuid.UUID(str(resume_id_str)) if resume_id_str else None

                    job_id_str = context.shared_variables.get("job_id")
                    job_id = uuid.UUID(str(job_id_str)) if job_id_str else None

                    company_name = context.shared_variables.get("company_name", "Target Company")
                    target_role = context.shared_variables.get("target_role", "Software Engineer")
                    interview_type = context.shared_variables.get("interview_type", "BEHAVIORAL")
                    difficulty = context.shared_variables.get("difficulty", "MEDIUM")
                    total_questions = int(context.shared_variables.get("total_questions", 5))

                    output = await service.mock(
                        user_id=user_id,
                        resume_id=resume_id,
                        job_id=job_id,
                        company_name=company_name,
                        target_role=target_role,
                        interview_type=interview_type,
                        difficulty=difficulty,
                        total_questions=total_questions
                    )

                elif task in ["readiness", "readiness_report"]:
                    session_id_str = context.shared_variables.get("session_id")
                    session_id = uuid.UUID(str(session_id_str)) if session_id_str else None

                    output = await service.readiness(
                        user_id=user_id,
                        session_id=session_id
                    )

                elif task == "feedback":
                    session_id_str = context.shared_variables.get("session_id")
                    session_id = uuid.UUID(str(session_id_str)) if session_id_str else None

                    output = await service.readiness(
                        user_id=user_id,
                        session_id=session_id
                    )

                else:
                    raise AgentExecutionError(f"Unsupported task type: '{task}'")

        except Exception as e:
            status = "failed"
            errors.append(str(e))
            output = {"error": str(e)}
            logger.error(
                "interview_agent_execution_failed",
                task=task,
                error=str(e),
                request_id=context.request_id,
                session_id=str(context.shared_variables.get("session_id")) if context.shared_variables.get("session_id") else None
            )

        duration_ms = (time.perf_counter() - start_time) * 1000

        logger.info(
            "interview_agent_execution_finished",
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
        msg = "Interview Agent is operational."
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
