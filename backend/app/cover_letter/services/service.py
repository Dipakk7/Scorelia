import uuid
import structlog
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from app.cover_letter.crud import crud
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.cover_letter.schemas.schemas import (
    CoverLetterRequest,
    ExperienceLevel,
    GenerationMode,
    AICoverLetterOutput,
    ValidationErrorDetail
)
from app.cover_letter.services.context import CoverLetterContext
from app.cover_letter.services.resolver import CoverLetterTemplateResolver
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory

from app.ai.exceptions import ModelNotFound, AIProviderUnavailable, AIRequestTimeout, InvalidPrompt

logger = structlog.get_logger()

class FactValidationError(Exception):
    def __init__(self, details: List[ValidationErrorDetail]):
        self.details = details
        super().__init__("Fact validation failed.")

COVER_LETTER_MODES = {
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

class CoverLetterService:
    """Service layer coordinating the cover letter foundation workflow."""

    def __init__(self, db: Session):
        self.db = db
        self.resolver = CoverLetterTemplateResolver()

    async def get_cover_letter(self, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> Optional[AICoverLetter]:
        """Fetch a specific cover letter."""
        return crud.get_cover_letter_by_id(self.db, cover_letter_id, user_id)

    async def get_history(self, user_id: uuid.UUID, resume_id: Optional[uuid.UUID] = None) -> List[AICoverLetter]:
        """Retrieve cover letter history (filtered optionally by resume_id)."""
        if resume_id:
            return crud.get_cover_letters_by_resume_id(self.db, resume_id, user_id)
        return crud.get_cover_letters_by_user_id(self.db, user_id)

    async def delete_cover_letter(self, cover_letter_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a cover letter record."""
        cover_letter = crud.get_cover_letter_by_id(self.db, cover_letter_id, user_id)
        if not cover_letter:
            return False
        return crud.delete_cover_letter_record(self.db, cover_letter)

    async def generate_cover_letter(
        self,
        user_id: uuid.UUID,
        request: CoverLetterRequest,
        model_override: Optional[str] = None
    ) -> AICoverLetter:
        """Orchestrate the cover letter context assembly, generate via AIService, fact-check, and save to DB."""
        # 1. Validation of request properties
        if not request.company_name or not request.company_name.strip():
            raise ValueError("Company name must not be empty.")
        if not request.job_title or not request.job_title.strip():
            raise ValueError("Job title must not be empty.")

        # 2. Build CoverLetterContext (automatically parses resume if needed)
        ats_override = request.metadata.ats_score if request.metadata else None
        context = await CoverLetterContext.build(
            db=self.db,
            resume_id=request.resume_id,
            user_id=user_id,
            company_name=request.company_name,
            job_title=request.job_title,
            job_description=request.job_description,
            prompt_metadata=request.metadata.prompt_metadata if request.metadata else None,
            interview_context=request.metadata.interview_context if request.metadata else None,
            ats_score=ats_override,
        )

        # 3. Resolve AI provider details using AIProviderFactory
        provider = AIProviderFactory.get_provider(model_name=model_override)
        provider_name = provider.provider_name
        model_name = provider.client.model if hasattr(provider, "client") and hasattr(provider.client, "model") else str(provider.client)
        ai_service = AIService(provider)

        # 4. Resolve Template Name
        experience_level = request.experience_level or ExperienceLevel.EXPERIENCED
        template_name = self.resolver.resolve(
            writing_style=request.writing_style,
            experience_level=experience_level,
            generation_mode=request.generation_mode,
            context=context
        )

        # 5. Populate Rendering Variables
        variables = {
            "resume_json": json.dumps(context.resume.parsed_data or {}, default=str),
            "resume_review_json": json.dumps(context.resume_review.review or {} if context.resume_review else {}, default=str),
            "resume_optimization_json": json.dumps(context.resume_optimization.optimization_result or {} if context.resume_optimization else {}, default=str),
            "interview_context": json.dumps(context.interview_context or {}, default=str),
            "ats_score": context.ats_score or 0,
            "job_description": context.job_description or "",
            "company_name": context.company_name,
            "role": context.role,
            "writing_style": request.writing_style,
            "generation_mode": request.generation_mode.value if hasattr(request.generation_mode, "value") else request.generation_mode,
            "provider": provider_name,
            "model": model_name,
            "prompt_version": "1.0.0",
            "current_time": datetime.utcnow().isoformat() + "Z"
        }

        # Filter variables to exactly match the resolved template's expected variables
        template = ai_service.registry.get_prompt("cover_letter", template_name)
        expected_vars = ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}

        # 6. Execute AIService with Retry logic (Retry once if invalid JSON/Pydantic validation fails)
        mode_val = request.generation_mode.value if hasattr(request.generation_mode, "value") else request.generation_mode
        mode_config = COVER_LETTER_MODES.get(str(mode_val).upper(), COVER_LETTER_MODES["STANDARD"])
        
        attempts = 2
        ai_response = None
        parsed_output = None
        
        for attempt in range(attempts):
            try:
                logger.info(
                    "calling_ai_service_for_cover_letter",
                    resume_id=str(request.resume_id),
                    template_name=template_name,
                    attempt=attempt + 1
                )
                structured_response = await ai_service.execute(
                    category="cover_letter",
                    name=template_name,
                    variables=filtered_variables,
                    parser_type="json",
                    temperature=mode_config["temperature"],
                    max_tokens=mode_config["max_tokens"]
                )
                parsed_output = structured_response.parsed_response
                if not isinstance(parsed_output, dict):
                    raise ValueError("AI response did not parse as a JSON dictionary.")
                
                # Pydantic validation
                AICoverLetterOutput.model_validate(parsed_output)
                ai_response = structured_response
                break
            except (ModelNotFound, AIProviderUnavailable, AIRequestTimeout, InvalidPrompt) as exc:
                logger.error(
                    "ai_cover_letter_generation_critical_failed",
                    error=str(exc)
                )
                raise
            except Exception as exc:
                logger.warning(
                    "ai_cover_letter_generation_attempt_failed",
                    attempt=attempt + 1,
                    error=str(exc)
                )
                if attempt == attempts - 1:
                    raise ValueError(f"AI returned malformed output or failed validation: {str(exc)}")

        output_obj = AICoverLetterOutput.model_validate(parsed_output)
        
        # 7. Reconstruct generated content string
        generated_content = (
            f"{output_obj.title}\n\n"
            f"{output_obj.greeting}\n\n"
            f"{output_obj.introduction}\n\n"
            f"{output_obj.body}\n\n"
            f"{output_obj.closing}\n\n"
            f"{output_obj.signature}"
        )

        # 8. Fact Validation Verification
        check_variables = {
            "resume_json": json.dumps(context.resume.parsed_data or {}, default=str),
            "generated_letter": generated_content
        }
        
        try:
            logger.info("running_fact_check_on_generated_cover_letter")
            check_response = await ai_service.execute(
                category="cover_letter",
                name="fact_check",
                variables=check_variables,
                parser_type="json",
                temperature=0.0
            )
            check_result = check_response.parsed_response
        except Exception as check_err:
            logger.warning("fact_check_execution_failed_permitting_generation", error=str(check_err))
            check_result = {"is_valid": True, "fabrications": []}

        if not check_result.get("is_valid", True) or check_result.get("fabrications"):
            fabrications = check_result.get("fabrications", [])
            validation_details = []
            resume_data = context.resume.parsed_data or {}

            # Helper to extract all text values from the resume dictionary
            def extract_texts(val):
                texts = []
                if isinstance(val, str):
                    texts.append(val.lower())
                elif isinstance(val, (list, tuple)):
                    for v in val:
                        texts.extend(extract_texts(v))
                elif isinstance(val, dict):
                    for v in val.values():
                        texts.extend(extract_texts(v))
                return texts

            resume_texts = extract_texts(resume_data)

            for fab in fabrications:
                item = fab.get("fabricated_item", "")
                if not item:
                    continue
                item_lower = str(item).lower().strip()

                # Check if supposedly fabricated item is actually in the resume data (case-insensitive)
                is_false_positive = False
                for t in resume_texts:
                    if item_lower in t or t in item_lower:
                        is_false_positive = True
                        break

                if not is_false_positive:
                    # Token/keyword-based matching for company names / degrees / skills
                    words = [w for w in item_lower.split() if len(w) > 3 and w not in ["with", "from", "that", "this", "were", "been", "role", "position"]]
                    for word in words:
                        for t in resume_texts:
                            if word in t:
                                is_false_positive = True
                                break
                        if is_false_positive:
                            break

                if is_false_positive:
                    logger.info("disregarding_false_positive_fabrication", item=item)
                    continue

                validation_details.append(ValidationErrorDetail(
                    loc=["body", fab.get("field", "unknown")],
                    msg=f"Fabrication detected: {fab.get('fabricated_item')} - {fab.get('reason')}",
                    type="value_error.fabrication"
                ))
            if validation_details:
                logger.error("cover_letter_fact_validation_failed", fabrications=fabrications)
                raise FactValidationError(validation_details)

        # 9. Compile metadata dict
        metadata_dict = {
            "ats_score": output_obj.ats_score,
            "review_id": str(context.resume_review.id) if context.resume_review else None,
            "rewrite_id": str(context.resume_rewrite.id) if context.resume_rewrite else None,
            "optimization_id": str(context.resume_optimization.id) if context.resume_optimization else None,
            "prompt_metadata": context.prompt_metadata,
            "interview_context": context.interview_context,
            "latency_ms": ai_response.latency_ms,
            "experience_level": experience_level.value if hasattr(experience_level, "value") else experience_level,
            "writing_style": output_obj.writing_style,
            "tone": output_obj.tone,
            "overall_quality": output_obj.overall_quality,
            "category_scores": output_obj.category_scores.model_dump()
        }

        # 10. Save history record using CRUD
        db_cover_letter = crud.create_cover_letter(
            db=self.db,
            user_id=user_id,
            resume_id=request.resume_id,
            company_name=request.company_name,
            job_title=request.job_title,
            job_description=request.job_description,
            writing_style=output_obj.writing_style,
            generation_mode=mode_val,
            generated_content=generated_content,
            cover_letter_metadata=metadata_dict,
            provider=ai_response.provider,
            model=ai_response.model,
            prompt_version=ai_response.prompt_version
        )

        logger.info(
            "cover_letter_generation_completed",
            cover_letter_id=str(db_cover_letter.id),
            user_id=str(user_id)
        )

        return db_cover_letter

