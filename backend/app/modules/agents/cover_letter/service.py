# app/modules/agents/cover_letter/service.py

import json
import uuid
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
import structlog

from app.cover_letter.services.service import CoverLetterService
from app.cover_letter.services.optimization_service import CoverLetterOptimizationService
from app.cover_letter.schemas.schemas import CoverLetterRequest, CoverLetterOptimizationRequest, GenerationMode, ExperienceLevel
from app.modules.agents.cover_letter.validator import CoverLetterAgentValidator
from app.modules.agents.cover_letter.prompts import COVER_LETTER_REVIEW_PROMPT, COVER_LETTER_REWRITE_PROMPT
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator

logger = structlog.get_logger()

class CoverLetterAgentService:
    """Service class coordinating all business logic for the Cover Letter Agent."""

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
        """Register custom agent prompts dynamically."""
        if self.ai_service and self.ai_service.registry:
            try:
                self.ai_service.registry.register_prompt("cover_letter", COVER_LETTER_REVIEW_PROMPT)
                self.ai_service.registry.register_prompt("cover_letter", COVER_LETTER_REWRITE_PROMPT)
            except Exception as e:
                logger.error("failed_to_register_cover_letter_agent_prompts", error=str(e))

    async def generate(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        company_name: str,
        job_title: str,
        job_description: Optional[str] = None,
        writing_style: Optional[str] = "PROFESSIONAL",
        generation_mode: Optional[str] = "STANDARD",
        experience_level: Optional[str] = "EXPERIENCED",
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Generates a cover letter by reusing the existing CoverLetterService."""
        # Validate resume exists and belongs to user
        CoverLetterAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)

        # Build request schema
        mode_val = GenerationMode(generation_mode.upper().strip() if generation_mode else "STANDARD")
        level_val = ExperienceLevel(experience_level.upper().strip() if experience_level else "EXPERIENCED")

        request = CoverLetterRequest(
            resume_id=resume_id,
            company_name=company_name,
            job_title=job_title,
            job_description=job_description,
            writing_style=writing_style,
            generation_mode=mode_val,
            experience_level=level_val
        )

        cl_service = CoverLetterService(self.db)
        db_cl = await cl_service.generate_cover_letter(
            user_id=user_id,
            request=request,
            model_override=model_override
        )

        CoverLetterAgentValidator.validate_tool_response(db_cl)

        return {
            "cover_letter_id": str(db_cl.id),
            "generated_content": db_cl.generated_content,
            "company_name": db_cl.company_name,
            "job_title": db_cl.job_title,
            "writing_style": db_cl.writing_style,
            "generation_mode": db_cl.generation_mode,
            "metadata": db_cl.cover_letter_metadata
        }

    async def review(
        self,
        cover_letter_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Reviews an existing cover letter using LLM evaluation."""
        cl = CoverLetterAgentValidator.validate_cover_letter_exists_and_owned(self.db, cover_letter_id, user_id)

        variables = {
            "cover_letter_content": cl.generated_content,
            "job_description": job_description or cl.job_description or ""
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="cover_letter",
            name="review",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1000
        )

        parsed_review = structured_response.parsed_response
        CoverLetterAgentValidator.validate_ai_response(
            parsed_review,
            ["overall_score", "strengths", "weaknesses", "recommendations"]
        )

        return {
            "cover_letter_id": str(cover_letter_id),
            "overall_score": parsed_review["overall_score"],
            "strengths": parsed_review["strengths"],
            "weaknesses": parsed_review["weaknesses"],
            "recommendations": parsed_review["recommendations"]
        }

    async def rewrite(
        self,
        cover_letter_id: uuid.UUID,
        user_id: uuid.UUID,
        instructions: str,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Rewrites cover letter text using target instructions."""
        cl = CoverLetterAgentValidator.validate_cover_letter_exists_and_owned(self.db, cover_letter_id, user_id)

        variables = {
            "cover_letter_content": cl.generated_content,
            "instructions": instructions,
            "job_description": job_description or cl.job_description or ""
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="cover_letter",
            name="rewrite",
            variables=variables,
            parser_type="json",
            temperature=0.5,
            max_tokens=2048
        )

        parsed_rewrite = structured_response.parsed_response
        CoverLetterAgentValidator.validate_ai_response(parsed_rewrite, ["rewritten_content"])

        return {
            "cover_letter_id": str(cover_letter_id),
            "original_content": cl.generated_content,
            "rewritten_content": parsed_rewrite["rewritten_content"]
        }

    async def optimize(
        self,
        cover_letter_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Optimizes the cover letter using the CoverLetterOptimizationService."""
        CoverLetterAgentValidator.validate_cover_letter_exists_and_owned(self.db, cover_letter_id, user_id)

        request = CoverLetterOptimizationRequest(
            cover_letter_id=cover_letter_id,
            job_description=job_description
        )

        opt_service = CoverLetterOptimizationService(self.db)
        db_opt = await opt_service.optimize_cover_letter(
            user_id=user_id,
            request=request,
            mode="STANDARD",
            model_override=model_override,
            bypass_cache=bypass_cache
        )

        CoverLetterAgentValidator.validate_tool_response(db_opt)

        return {
            "optimization_id": str(db_opt.id),
            "cover_letter_id": str(db_opt.cover_letter_id),
            "quality_score": db_opt.quality_score,
            "category_scores": db_opt.category_scores,
            "keyword_analysis": db_opt.keyword_analysis,
            "suggestions": db_opt.optimization_result.get("suggestions"),
            "company_alignment": db_opt.optimization_result.get("company_alignment"),
            "version_comparison": db_opt.optimization_result.get("version_comparison")
        }

    async def suggestions(self, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> List[Dict[str, Any]]:
        """Retrieves improvement suggestions/recommendations for a cover letter."""
        CoverLetterAgentValidator.validate_cover_letter_exists_and_owned(self.db, cover_letter_id, user_id)

        # Try to retrieve from existing optimizations first
        opt_service = CoverLetterOptimizationService(self.db)
        opts = await opt_service.get_optimizations_for_cover_letter(cover_letter_id, user_id)
        if opts:
            latest_opt = sorted(opts, key=lambda x: x.created_at, reverse=True)[0]
            suggestions = latest_opt.optimization_result.get("suggestions")
            if suggestions:
                # If recommendations exists or format as flat list of suggestions
                flat_list = []
                if isinstance(suggestions, dict):
                    for cat, sug_list in suggestions.items():
                        if isinstance(sug_list, list):
                            flat_list.extend(sug_list)
                elif isinstance(suggestions, list):
                    flat_list = suggestions
                return flat_list

        # Re-run optimization to generate suggestions if none found
        request = CoverLetterOptimizationRequest(cover_letter_id=cover_letter_id)
        db_opt = await opt_service.optimize_cover_letter(
            user_id=user_id,
            request=request,
            mode="STANDARD"
        )
        suggestions = db_opt.optimization_result.get("suggestions", {})
        flat_list = []
        if isinstance(suggestions, dict):
            for cat, sug_list in suggestions.items():
                if isinstance(sug_list, list):
                    flat_list.extend(sug_list)
        elif isinstance(suggestions, list):
            flat_list = suggestions
        return flat_list
