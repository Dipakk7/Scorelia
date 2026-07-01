import structlog
from typing import Dict, Any, Callable
from app.cover_letter.schemas.schemas import ExperienceLevel, WritingStyle, GenerationMode

logger = structlog.get_logger()

class CoverLetterTemplateResolver:
    """Strategy registry for selecting the appropriate cover letter template."""

    def __init__(self):
        self._registry: Dict[str, Callable[[Any], str]] = {}
        # Register default experience level strategies
        self.register(ExperienceLevel.INTERNSHIP, lambda ctx: "internship")
        self.register(ExperienceLevel.FRESHER, lambda ctx: "fresher")
        self.register(ExperienceLevel.EXPERIENCED, lambda ctx: "experienced")
        self.register(ExperienceLevel.CAREER_CHANGE, lambda ctx: "career_change")
        self.register(ExperienceLevel.REFERRAL, lambda ctx: "referral")
        self.register(ExperienceLevel.EXECUTIVE, lambda ctx: "executive")

    def register(self, key: str | ExperienceLevel, strategy: Callable[[Any], str]) -> None:
        """Register a template resolution strategy for a key."""
        str_key = key.value if hasattr(key, "value") else str(key)
        self._registry[str_key.upper().strip()] = strategy
        logger.debug("registered_cover_letter_template_strategy", key=str_key)

    def resolve(
        self,
        writing_style: str | WritingStyle,
        experience_level: str | ExperienceLevel,
        generation_mode: str | GenerationMode,
        context: Any
    ) -> str:
        """Resolve template name based on context parameters.
        
        Args:
            writing_style: Requested writing style.
            experience_level: Experience level of the applicant.
            generation_mode: Generation mode (FAST, STANDARD, DETAILED).
            context: CoverLetterContext containing resume, job, company details.
            
        Returns:
            The name of the template registered in the PromptRegistry.
        """
        level_str = experience_level.value if hasattr(experience_level, "value") else str(experience_level)
        key = level_str.upper().strip()
        
        strategy = self._registry.get(key)
        if strategy:
            template_name = strategy(context)
            logger.info("resolved_cover_letter_template", key=key, template_name=template_name)
            return template_name
            
        logger.warning("template_strategy_not_found_falling_back_to_default", key=key)
        return "experienced"  # Default fallback template name
