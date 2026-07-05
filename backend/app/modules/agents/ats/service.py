# app/modules/agents/ats/service.py

import json
import uuid
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
import structlog

from app.models.resume import Resume
from app.modules.agents.ats.validator import ATSAgentValidator
from app.modules.agents.ats.prompts import ATS_REVIEW_PROMPT, ATS_IMPROVE_PROMPT
from app.services.ats.ats_service import calculate_ats_score
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator

logger = structlog.get_logger()


class ATSAgentService:
    """Service class coordinating business logic for the ATS Agent."""

    def __init__(
        self,
        db: Session,
        ai_service: Optional[AIService] = None,
        rag_orchestrator: Optional[RAGOrchestrator] = None
    ):
        self.db = db
        self.ai_service = ai_service or AIService(AIProviderFactory.get_provider())
        self.rag_orchestrator = rag_orchestrator
        self._register_prompts()

    def _register_prompts(self) -> None:
        """Dynamically registers agent-specific prompt templates in the PromptRegistry."""
        if self.ai_service and self.ai_service.registry:
            try:
                self.ai_service.registry.register_prompt("ats", ATS_REVIEW_PROMPT)
                self.ai_service.registry.register_prompt("ats", ATS_IMPROVE_PROMPT)
            except Exception as e:
                logger.error("failed_to_register_ats_agent_prompts", error=str(e))

    async def review(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Performs structured ATS review on a resume."""
        resume = ATSAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ATSAgentValidator.validate_parsed_data(resume)

        variables = {
            "resume_json": json.dumps(resume.parsed_data, indent=2, default=str),
            "job_description": job_description or ""
        }

        # Initialize AI provider / service with potential model override
        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="ats",
            name="review",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1000
        )

        parsed_review = structured_response.parsed_response
        ATSAgentValidator.validate_ai_response(
            parsed_review,
            ["overall_review", "ats_readiness", "keyword_analysis", "missing_skills", "recommendations"]
        )

        return parsed_review

    async def score(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Calculates live Python-based ATS score for the resume."""
        resume = ATSAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ATSAgentValidator.validate_parsed_data(resume)

        # Reuse existing python ATS Scoring logic
        score_response = calculate_ats_score(resume)
        self.db.commit()

        # Convert schemas to dict cleanly
        return {
            "resume_id": str(score_response.resume_id),
            "overall_score": score_response.overall_score,
            "grade": score_response.grade,
            "grade_summary": score_response.grade_summary,
            "breakdown": score_response.breakdown.model_dump() if hasattr(score_response.breakdown, "model_dump") else score_response.breakdown,
            "strengths": score_response.strengths,
            "weaknesses": score_response.weaknesses,
            "recommendations": score_response.recommendations,
            "parser_version": score_response.parser_version,
            "ats_version": score_response.ats_version,
            "scored_at": score_response.scored_at.isoformat() if hasattr(score_response.scored_at, "isoformat") else str(score_response.scored_at)
        }

    async def improve(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Generates structured improvement suggestions for the resume."""
        resume = ATSAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ATSAgentValidator.validate_parsed_data(resume)

        variables = {
            "resume_json": json.dumps(resume.parsed_data, indent=2, default=str),
            "job_description": job_description or ""
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="ats",
            name="improve",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1000
        )

        parsed_improve = structured_response.parsed_response
        ATSAgentValidator.validate_ai_response(
            parsed_improve,
            ["improvement_suggestions"]
        )

        return parsed_improve
