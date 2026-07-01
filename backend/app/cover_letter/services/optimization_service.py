import uuid
import structlog
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.cover_letter.crud import crud
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.models.ai_cover_letter_optimization import AICoverLetterOptimization
from app.models.resume import Resume
from app.utils.diff_engine import compute_diff
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.cover_letter.schemas.schemas import (
    CoverLetterOptimizationRequest,
    QualityScore,
    CategoryScore,
    OptimizationSuggestion,
    KeywordAnalysis,
    VersionComparison,
    ModifiedSection,
    CompanyAlignment
)

logger = structlog.get_logger()

# Reuse existing AI mode configurations
OPTIMIZATION_MODES = {
    "FAST": {
        "temperature": 0.3,
        "max_tokens": 1024,
    },
    "STANDARD": {
        "temperature": 0.5,
        "max_tokens": 2048,
    },
    "DETAILED": {
        "temperature": 0.7,
        "max_tokens": 4096,
    }
}

class CoverLetterOptimizationService:
    """Service layer coordinating the cover letter optimization engine workflow."""

    def __init__(self, db: Session):
        self.db = db

    async def get_optimization(self, optimization_id: uuid.UUID, user_id: uuid.UUID) -> Optional[AICoverLetterOptimization]:
        """Fetch a specific cover letter optimization by ID."""
        return crud.get_optimization_by_id(self.db, optimization_id, user_id)

    async def get_optimizations_for_user(self, user_id: uuid.UUID) -> List[AICoverLetterOptimization]:
        """Retrieve all optimizations for a user."""
        return crud.get_optimizations_by_user_id(self.db, user_id)

    async def get_optimizations_for_cover_letter(self, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> List[AICoverLetterOptimization]:
        """Retrieve all optimizations for a specific cover letter."""
        return crud.get_optimizations_by_cover_letter_id(self.db, cover_letter_id, user_id)

    async def delete_optimization(self, optimization_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete an optimization record."""
        opt = crud.get_optimization_by_id(self.db, optimization_id, user_id)
        if not opt:
            return False
        return crud.delete_optimization_record(self.db, opt)

    async def optimize_cover_letter(
        self,
        user_id: uuid.UUID,
        request: CoverLetterOptimizationRequest,
        mode: str = "STANDARD",
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> AICoverLetterOptimization:
        """Optimize cover letter using AIService, perform scoring, keyword analysis, and diffing."""
        # 1. Validate optimization mode
        mode_upper = mode.upper().strip()
        if mode_upper not in OPTIMIZATION_MODES:
            raise ValueError(f"Unsupported optimization mode: {mode}. Supported modes are: {list(OPTIMIZATION_MODES.keys())}")

        # 2. Retrieve original cover letter
        cover_letter = crud.get_cover_letter_by_id(self.db, request.cover_letter_id, user_id)
        if not cover_letter:
            raise ValueError("Cover letter not found or does not belong to the user.")

        # 3. Validate content is not empty
        original_content = cover_letter.generated_content
        if not original_content or not original_content.strip():
            raise ValueError("Cannot optimize an empty cover letter.")

        # 4. Fetch related resume for prompt variables
        resume = self.db.query(Resume).filter(
            Resume.id == cover_letter.resume_id,
            Resume.user_id == user_id
        ).first()
        resume_data = (resume.parsed_data or {}) if resume else {}

        # 5. Resolve Job Description
        job_desc = request.job_description or cover_letter.job_description or ""

        # 6. Resolve AI provider details
        provider = AIProviderFactory.get_provider(model_name=model_override)
        provider_name = provider.provider_name
        model_name = provider.client.model if hasattr(provider, "client") and hasattr(provider.client, "model") else str(provider.client)
        ai_service = AIService(provider)

        # 7. Setup prompt rendering variables
        variables = {
            "resume_json": json.dumps(resume_data, indent=2, default=str),
            "job_description": job_desc,
            "original_cover_letter": original_content
        }

        mode_config = OPTIMIZATION_MODES[mode_upper]
        
        # 8. Execute AIService with retry once on parsing/JSON validation failure
        attempts = 2
        ai_response = None
        parsed_output = None

        for attempt in range(attempts):
            try:
                logger.info(
                    "calling_ai_service_for_cover_letter_optimization",
                    cover_letter_id=str(request.cover_letter_id),
                    mode=mode_upper,
                    attempt=attempt + 1
                )
                structured_response = await ai_service.execute(
                    category="cover_letter",
                    name="optimization",
                    variables=variables,
                    parser_type="json",
                    temperature=mode_config["temperature"],
                    max_tokens=mode_config["max_tokens"]
                )
                parsed_output = structured_response.parsed_response
                if not isinstance(parsed_output, dict):
                    raise ValueError("AI response did not parse as a JSON dictionary.")

                # Validate expected keys and types to reject malformed AI output
                required_keys = [
                    "optimized_content",
                    "overall_score",
                    "category_scores",
                    "suggestions",
                    "keyword_analysis",
                    "company_alignment",
                    "improvement_summary",
                    "estimated_quality_gain"
                ]
                missing = [k for k in required_keys if k not in parsed_output]
                if missing:
                    raise ValueError(f"AI response is missing required keys: {missing}")

                # If all matches, set response and break
                ai_response = structured_response
                break
            except Exception as exc:
                logger.warning(
                    "cover_letter_optimization_attempt_failed",
                    attempt=attempt + 1,
                    error=str(exc)
                )
                if attempt == attempts - 1:
                    raise ValueError(f"AI returned malformed output or failed validation: {str(exc)}")

        # 9. Extract sections
        optimized_content = parsed_output["optimized_content"]
        overall_score = int(parsed_output["overall_score"])
        category_scores_raw = parsed_output["category_scores"]
        suggestions_raw = parsed_output["suggestions"]
        keyword_analysis_raw = parsed_output["keyword_analysis"]
        company_alignment_raw = parsed_output["company_alignment"]
        improvement_summary = parsed_output["improvement_summary"]
        estimated_quality_gain = int(parsed_output["estimated_quality_gain"])

        # Compute local diff comparison
        diff_res = compute_diff(original_content, optimized_content)
        version_comparison_data = {
            "added_content": diff_res.get("added", []),
            "removed_content": diff_res.get("removed", []),
            "modified_sections": [
                {"from": m.get("from", ""), "to": m.get("to", "")} for m in diff_res.get("modified", [])
            ],
            "improvement_summary": improvement_summary,
            "estimated_quality_gain": estimated_quality_gain
        }

        # 10. Combine optimization result dict to be persisted in DB
        optimization_result = {
            "original_content": original_content,
            "optimized_content": optimized_content,
            "suggestions": suggestions_raw,
            "company_alignment": company_alignment_raw,
            "version_comparison": version_comparison_data
        }

        metadata_dict = {
            "latency_ms": ai_response.latency_ms,
            "mode": mode_upper,
            "bypass_cache": bypass_cache
        }

        # 11. Create DB record
        db_opt = crud.create_cover_letter_optimization(
            db=self.db,
            user_id=user_id,
            cover_letter_id=request.cover_letter_id,
            optimization_result=optimization_result,
            quality_score=overall_score,
            category_scores=category_scores_raw,
            keyword_analysis=keyword_analysis_raw,
            provider=ai_response.provider,
            model=ai_response.model,
            prompt_version=ai_response.prompt_version,
            optimization_metadata=metadata_dict
        )

        logger.info(
            "cover_letter_optimization_completed",
            optimization_id=str(db_opt.id),
            user_id=str(user_id)
        )

        return db_opt
