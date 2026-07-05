# app/modules/agents/resume/service.py

import time
import uuid
import json
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
import structlog

from app.models.resume import Resume
from app.modules.agents.resume.validator import ResumeAgentValidator
from app.modules.agents.resume.prompts import RESUME_SUMMARY_PROMPT
from app.services.parser.parser_service import parse_resume
from app.services.review_service import ResumeReviewService
from app.services.rewrite_service import ResumeRewriteService
from app.services.optimization_service import ResumeOptimizationService
from app.services.ats.ats_service import calculate_ats_score
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator

logger = structlog.get_logger()

class ResumeAgentService:
    """Service class coordinating all business logic for the Resume Agent."""

    def __init__(
        self,
        db: Session,
        ai_service: Optional[AIService] = None,
        rag_orchestrator: Optional[RAGOrchestrator] = None
    ):
        self.db = db
        # If ai_service is not provided, initialize standard one
        self.ai_service = ai_service or AIService(AIProviderFactory.get_provider())
        self.rag_orchestrator = rag_orchestrator
        
        # Ensure our custom prompts are registered in AIService PromptRegistry
        self._register_prompts()

    def _register_prompts(self):
        """Registers agent-specific prompt templates dynamically in prompt registry."""
        if self.ai_service and self.ai_service.registry:
            try:
                # Register summary prompt
                self.ai_service.registry.register_prompt("resume", RESUME_SUMMARY_PROMPT)
            except Exception as e:
                logger.error("failed_to_register_resume_agent_prompts", error=str(e))

    async def review(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        mode: str = "STANDARD",
        language: str = "en",
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Runs the Resume Review Engine."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ResumeAgentValidator.validate_parsed_data(resume)

        review_service = ResumeReviewService(self.db)
        db_review = await review_service.review_resume(
            resume_id=resume_id,
            user_id=user_id,
            mode=mode,
            language=language,
            model_override=model_override,
            bypass_cache=bypass_cache
        )
        
        # Validate tool response
        ResumeAgentValidator.validate_tool_response(db_review)
        
        # Return review dict
        return db_review.review

    async def rewrite(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        mode: str = "STANDARD",
        section_name: Optional[str] = None,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Runs the Resume Rewrite Engine."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ResumeAgentValidator.validate_parsed_data(resume)

        rewrite_service = ResumeRewriteService(self.db)
        db_rewrite = await rewrite_service.rewrite_resume(
            resume_id=resume_id,
            user_id=user_id,
            mode=mode,
            section_name=section_name,
            job_description=job_description,
            model_override=model_override,
            bypass_cache=bypass_cache
        )

        ResumeAgentValidator.validate_tool_response(db_rewrite)

        return {
            "rewrite_id": str(db_rewrite.id),
            "rewritten_content": db_rewrite.rewritten_content,
            "original_content": db_rewrite.original_content,
            "rewrite_metadata": db_rewrite.rewrite_metadata
        }

    async def optimize(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: Optional[str] = None,
        mode: str = "STANDARD",
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Runs the Resume Optimization Engine."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ResumeAgentValidator.validate_parsed_data(resume)

        opt_service = ResumeOptimizationService(self.db)
        db_opt = await opt_service.optimize_resume(
            resume_id=resume_id,
            user_id=user_id,
            job_description=job_description,
            mode=mode,
            model_override=model_override,
            bypass_cache=bypass_cache
        )

        ResumeAgentValidator.validate_tool_response(db_opt)

        return db_opt.optimization_result

    async def summarize(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Summarizes a resume using LLM prompt."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ResumeAgentValidator.validate_parsed_data(resume)

        # Use our custom prompt registered under 'resume/summary'
        variables = {
            "resume_json": json.dumps(resume.parsed_data, indent=2, default=str)
        }

        # Initialize AI provider / service
        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="resume",
            name="summary",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1000
        )

        parsed_summary = structured_response.parsed_response
        ResumeAgentValidator.validate_ai_response(
            parsed_summary,
            ["professional_summary", "years_of_experience", "key_expertise", "education_summary", "recent_job_title", "industry"]
        )

        return parsed_summary

    async def parse(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> Dict[str, Any]:
        """Parses a resume if not already parsed."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        
        # Invoke parser tool
        parse_resume(self.db, resume_id)
        self.db.refresh(resume)
        
        ResumeAgentValidator.validate_parsed_data(resume)
        return resume.parsed_data

    async def suggestions(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        """Retrieves improvement suggestions/recommendations for a resume."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        ResumeAgentValidator.validate_parsed_data(resume)

        # Try to retrieve from existing optimizations first
        opt_service = ResumeOptimizationService(self.db)
        opts = await opt_service.get_optimizations_for_resume(resume_id, user_id)
        if opts:
            latest_opt = sorted(opts, key=lambda x: x.created_at, reverse=True)[0]
            if latest_opt.optimization_result and "recommendations" in latest_opt.optimization_result:
                return latest_opt.optimization_result["recommendations"]

        # Re-run fast optimization to generate recommendations
        db_opt = await opt_service.optimize_resume(
            resume_id=resume_id,
            user_id=user_id,
            mode="STANDARD"
        )
        return db_opt.optimization_result.get("recommendations", [])

    async def score(self, resume_id: uuid.UUID, user_id: uuid.UUID) -> Dict[str, Any]:
        """Retrieves and calculates resume score details."""
        resume = ResumeAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        
        # Calculate python-based ATS score
        ats_res = calculate_ats_score(resume)
        
        # Try to retrieve latest optimization quality score
        overall_score = ats_res.score
        details = ats_res.score_details

        opt_service = ResumeOptimizationService(self.db)
        opts = await opt_service.get_optimizations_for_resume(resume_id, user_id)
        if opts:
            latest_opt = sorted(opts, key=lambda x: x.created_at, reverse=True)[0]
            if latest_opt.quality_score:
                overall_score = latest_opt.quality_score.get("overall_score", overall_score)
                details = latest_opt.quality_score

        return {
            "resume_id": str(resume_id),
            "overall_score": overall_score,
            "score_details": details
        }
