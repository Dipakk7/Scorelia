import os
import structlog
from typing import Dict, Any, Optional
from app.ai.services.ai_service import AIService
from app.ai.prompts.loader import load_prompt_file
from app.career_roadmap.models.roadmap import CareerRoadmap
from app.career_roadmap.services.context import RoadmapContext
from app.career_roadmap.metrics import roadmap_metrics

logger = structlog.get_logger()

class RoadmapAIService:
    """Service layer for AI Career Roadmap prompt registration, selection, validation and preparation."""

    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self._load_and_register_prompts()

    def _load_and_register_prompts(self) -> None:
        """Register career roadmap prompt templates with the global Prompt Registry."""
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        prompts_dir = os.path.join(current_dir, "prompts")

        if not os.path.exists(prompts_dir):
            logger.warning("career_roadmap_prompts_directory_not_found", path=prompts_dir)
            return

        logger.info("loading_career_roadmap_prompts_from_directory", path=prompts_dir)
        for file in os.listdir(prompts_dir):
            if file.endswith(".jinja"):
                filepath = os.path.join(prompts_dir, file)
                try:
                    template = load_prompt_file(filepath)
                    # Register under category 'career_roadmap'
                    self.ai_service.registry.register_prompt("career_roadmap", template)
                except Exception as e:
                    logger.error("failed_to_load_career_roadmap_prompt", file=file, error=str(e))
                    raise

    def select_prompt(self, step: str) -> str:
        """Select prompt template name based on roadmap step.
        
        Supported steps: system_prompt, career_roadmap, learning_path, projects, certifications, timeline, skill_gap, resources, weekly_plan, milestones, monthly_plan, weekly_schedule.
        """
        norm_step = step.lower().strip()
        if norm_step in ("system_prompt", "career_roadmap", "learning_path", "projects", "certifications", "timeline", "skill_gap", "resources", "weekly_plan", "milestones", "monthly_plan", "weekly_schedule"):
            prompt_name = norm_step
        else:
            prompt_name = "career_roadmap"

        # Record metrics
        roadmap_metrics.record_prompt_selected(prompt_name)
        logger.info("prompt_selected", step=step, prompt_name=prompt_name)
        return prompt_name

    def prepare_variables(
        self,
        roadmap: CareerRoadmap,
        context: RoadmapContext,
        additional_vars: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Prepare context variables dict for prompt template rendering."""
        variables = {
            "target_role": roadmap.target_role,
            "current_role": roadmap.current_role or "None",
            "experience_level": roadmap.experience_level,
            "target_industry": roadmap.target_industry or "None",
            "estimated_duration_months": roadmap.estimated_duration_months,
            "context": context.to_dict()
        }
        if additional_vars:
            variables.update(additional_vars)

        logger.info("prompt_variables_prepared", roadmap_id=str(roadmap.id))
        return variables

    def validate_variables(self, prompt_name: str, variables: Dict[str, Any]) -> None:
        """Validate context variables against prompt template definition."""
        try:
            template = self.ai_service.registry.get_prompt("career_roadmap", prompt_name)
            self.ai_service.validator.validate_variables(template.template_body, variables)
            logger.info("prompt_variables_validated", prompt_name=prompt_name)
        except Exception as e:
            logger.error("prompt_variables_validation_failed", prompt_name=prompt_name, error=str(e))
            raise

    def prepare_request(
        self,
        roadmap: CareerRoadmap,
        variables: Dict[str, Any],
        prompt_name: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """Assemble target payload parameters for future execution (no inference)."""
        logger.info("request_prepared_for_execution", roadmap_id=str(roadmap.id), prompt_name=prompt_name)
        return {
            "category": "career_roadmap",
            "name": prompt_name,
            "variables": variables,
            "temperature": temperature or 0.3,
            "max_tokens": max_tokens or 2048,
            "provider": roadmap.provider or "ollama",
            "model": roadmap.model or "qwen2.5:3b"
        }

    async def execute_placeholder_hook(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Future execution hook placeholder. Does not perform inference in Part 1B."""
        logger.info("future_execution_hook_invoked", payload_keys=list(request_payload.keys()))
        return {
            "status": "placeholder_success",
            "message": "Hook executed successfully. No inference performed in Phase 11 Part 1B."
        }

    async def generate_roadmap(
        self,
        roadmap: CareerRoadmap,
        context: RoadmapContext
    ) -> Dict[str, Any]:
        """Generate a career roadmap by calling the AIService, validating the JSON output, and retrying once on failure."""
        prompt_name = self.select_prompt("career_roadmap")
        
        # Prepare variables
        variables = self.prepare_variables(roadmap, context)
        
        # Get expected variables from template and filter variables to avoid validation errors
        template = self.ai_service.registry.get_prompt("career_roadmap", prompt_name)
        expected_vars = self.ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}
        
        # Validate variables
        self.validate_variables(prompt_name, filtered_variables)
        
        # Get system prompt template if present
        system_prompt_str = None
        try:
            sys_template = self.ai_service.registry.get_prompt("career_roadmap", "system_prompt")
            system_prompt_str = sys_template.template_body
        except Exception:
            pass

        from app.career_roadmap.schemas.schemas import AICareerRoadmapResponse
        
        attempts = 2
        for attempt in range(attempts):
            try:
                logger.info(
                    "calling_ai_service_for_roadmap",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1
                )
                structured_response = await self.ai_service.execute(
                    category="career_roadmap",
                    name=prompt_name,
                    variables=filtered_variables,
                    parser_type="markdown_json",
                    system_prompt=system_prompt_str,
                    temperature=0.3,
                    max_tokens=3000
                )
                
                parsed = structured_response.parsed_response
                if not isinstance(parsed, dict):
                    raise ValueError("AI response did not parse as a JSON dictionary.")
                
                # Strict schema validation
                AICareerRoadmapResponse.model_validate(parsed)
                
                # Privacy rules check:
                # "Never log: Resume, Prompt, Generated roadmap, Personal information"
                # "Only log: Roadmap ID, Latency, Provider, Prompt version, Generation duration"
                logger.info(
                    "roadmap_ai_generation_success",
                    roadmap_id=str(roadmap.id),
                    latency_ms=structured_response.latency_ms,
                    provider=structured_response.provider,
                    prompt_version=structured_response.prompt_version,
                    attempt=attempt + 1
                )
                
                return {
                    "parsed_response": parsed,
                    "provider": structured_response.provider,
                    "model": structured_response.model,
                    "latency_ms": structured_response.latency_ms,
                    "prompt_version": structured_response.prompt_version
                }
            except Exception as e:
                logger.warning(
                    "roadmap_ai_generation_attempt_failed",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1,
                    error=str(e)
                )
                if attempt == attempts - 1:
                    raise ValueError(f"AI returned malformed output or failed validation after {attempts} attempts: {str(e)}")

    async def generate_skill_gap(
        self,
        roadmap: CareerRoadmap,
        context: RoadmapContext
    ) -> Dict[str, Any]:
        """Generate skill gap analysis by calling the AIService, validating the JSON output, and retrying once on failure."""
        prompt_name = self.select_prompt("skill_gap")
        
        # Prepare variables
        variables = self.prepare_variables(roadmap, context)
        
        # Get expected variables from template and filter variables to avoid validation errors
        template = self.ai_service.registry.get_prompt("career_roadmap", prompt_name)
        expected_vars = self.ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}
        
        # Validate variables
        self.validate_variables(prompt_name, filtered_variables)
        
        # Get system prompt template if present
        system_prompt_str = None
        try:
            sys_template = self.ai_service.registry.get_prompt("career_roadmap", "system_prompt")
            system_prompt_str = sys_template.template_body
        except Exception:
            pass

        from app.career_roadmap.schemas.schemas import AISkillGapResponse
        
        attempts = 2
        for attempt in range(attempts):
            try:
                logger.info(
                    "calling_ai_service_for_skill_gap",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1
                )
                structured_response = await self.ai_service.execute(
                    category="career_roadmap",
                    name=prompt_name,
                    variables=filtered_variables,
                    parser_type="markdown_json",
                    system_prompt=system_prompt_str,
                    temperature=0.3,
                    max_tokens=3000
                )
                
                parsed = structured_response.parsed_response
                if not isinstance(parsed, dict):
                    raise ValueError("AI response did not parse as a JSON dictionary.")
                
                # Strict schema validation
                AISkillGapResponse.model_validate(parsed)
                
                logger.info(
                    "skill_gap_ai_generation_success",
                    roadmap_id=str(roadmap.id),
                    latency_ms=structured_response.latency_ms,
                    provider=structured_response.provider,
                    prompt_version=structured_response.prompt_version,
                    attempt=attempt + 1
                )
                
                return {
                    "parsed_response": parsed,
                    "provider": structured_response.provider,
                    "model": structured_response.model,
                    "latency_ms": structured_response.latency_ms,
                    "prompt_version": structured_response.prompt_version
                }
            except Exception as e:
                logger.warning(
                    "skill_gap_ai_generation_attempt_failed",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1,
                    error=str(e)
                )
                if attempt == attempts - 1:
                    raise ValueError(f"AI returned malformed output or failed validation after {attempts} attempts: {str(e)}")

    async def generate_learning_plan(
        self,
        roadmap: CareerRoadmap,
        context: RoadmapContext
    ) -> Dict[str, Any]:
        """Generate personalized learning plan by calling the AIService, validating the JSON output, and retrying once on failure."""
        prompt_name = self.select_prompt("learning_path")
        
        # Prepare variables
        variables = self.prepare_variables(roadmap, context)
        
        # Get expected variables from template and filter variables to avoid validation errors
        template = self.ai_service.registry.get_prompt("career_roadmap", prompt_name)
        expected_vars = self.ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}
        
        # Validate variables
        self.validate_variables(prompt_name, filtered_variables)
        
        # Get system prompt template if present
        system_prompt_str = None
        try:
            sys_template = self.ai_service.registry.get_prompt("career_roadmap", "system_prompt")
            system_prompt_str = sys_template.template_body
        except Exception:
            pass

        from app.career_roadmap.schemas.schemas import AILearningPlanResponse
        
        attempts = 2
        for attempt in range(attempts):
            try:
                logger.info(
                    "calling_ai_service_for_learning_plan",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1
                )
                structured_response = await self.ai_service.execute(
                    category="career_roadmap",
                    name=prompt_name,
                    variables=filtered_variables,
                    parser_type="markdown_json",
                    system_prompt=system_prompt_str,
                    temperature=0.3,
                    max_tokens=3000
                )
                
                parsed = structured_response.parsed_response
                if not isinstance(parsed, dict):
                    raise ValueError("AI response did not parse as a JSON dictionary.")
                
                # Strict schema validation
                AILearningPlanResponse.model_validate(parsed)
                
                logger.info(
                    "learning_plan_ai_generation_success",
                    roadmap_id=str(roadmap.id),
                    latency_ms=structured_response.latency_ms,
                    provider=structured_response.provider,
                    prompt_version=structured_response.prompt_version,
                    attempt=attempt + 1
                )
                
                return {
                    "parsed_response": parsed,
                    "provider": structured_response.provider,
                    "model": structured_response.model,
                    "latency_ms": structured_response.latency_ms,
                    "prompt_version": structured_response.prompt_version
                }
            except Exception as e:
                logger.warning(
                    "learning_plan_ai_generation_attempt_failed",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1,
                    error=str(e)
                )
                if attempt == attempts - 1:
                    raise ValueError(f"AI returned malformed output or failed validation after {attempts} attempts: {str(e)}")

    async def generate_timeline(
        self,
        roadmap: CareerRoadmap,
        context: RoadmapContext
    ) -> Dict[str, Any]:
        """Generate a career roadmap timeline by calling the AIService, validating the JSON output, and retrying once on failure."""
        prompt_name = self.select_prompt("timeline")
        
        # Prepare variables
        variables = self.prepare_variables(roadmap, context)
        
        # Add roadmap phases context for the timeline template
        phases_data = []
        for milestone in roadmap.milestones:
            phases_data.append({
                "phase_number": milestone.phase_number,
                "title": milestone.title,
                "description": milestone.description or "",
                "duration": milestone.duration or ""
            })
        variables["roadmap_phases"] = phases_data
        
        # Get expected variables from template and filter variables to avoid validation errors
        template = self.ai_service.registry.get_prompt("career_roadmap", prompt_name)
        expected_vars = self.ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}
        
        # Validate variables
        self.validate_variables(prompt_name, filtered_variables)
        
        # Get system prompt template if present
        system_prompt_str = None
        try:
            sys_template = self.ai_service.registry.get_prompt("career_roadmap", "system_prompt")
            system_prompt_str = sys_template.template_body
        except Exception:
            pass

        from app.career_roadmap.schemas.schemas import AITimelineResponse
        
        attempts = 2
        for attempt in range(attempts):
            try:
                logger.info(
                    "calling_ai_service_for_timeline",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1
                )
                structured_response = await self.ai_service.execute(
                    category="career_roadmap",
                    name=prompt_name,
                    variables=filtered_variables,
                    parser_type="markdown_json",
                    system_prompt=system_prompt_str,
                    temperature=0.3,
                    max_tokens=3000
                )
                
                parsed = structured_response.parsed_response
                if not isinstance(parsed, dict):
                    raise ValueError("AI response did not parse as a JSON dictionary.")
                
                # We need to set the roadmap_id inside the parsed dictionary to pass schema validation
                parsed["roadmap_id"] = str(roadmap.id)
                
                # Strict schema validation
                AITimelineResponse.model_validate(parsed)
                
                logger.info(
                    "timeline_ai_generation_success",
                    roadmap_id=str(roadmap.id),
                    latency_ms=structured_response.latency_ms,
                    provider=structured_response.provider,
                    prompt_version=structured_response.prompt_version,
                    attempt=attempt + 1
                )
                
                return {
                    "parsed_response": parsed,
                    "provider": structured_response.provider,
                    "model": structured_response.model,
                    "latency_ms": structured_response.latency_ms,
                    "prompt_version": structured_response.prompt_version
                }
            except Exception as e:
                logger.warning(
                    "timeline_ai_generation_attempt_failed",
                    roadmap_id=str(roadmap.id),
                    attempt=attempt + 1,
                    error=str(e)
                )
                if attempt == attempts - 1:
                    raise ValueError(f"AI returned malformed output or failed validation after {attempts} attempts: {str(e)}")


