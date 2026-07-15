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
                
                # Sanitize response fields to ensure list types for nested phases
                if "phases" in parsed and isinstance(parsed["phases"], list):
                    for phase in parsed["phases"]:
                        if isinstance(phase, dict):
                            for list_field in ["skills", "projects", "certifications", "resources", "completion_criteria"]:
                                if list_field in phase:
                                    val = phase[list_field]
                                    if isinstance(val, str):
                                        phase[list_field] = [val] if val.strip() else []
                                    elif val is None:
                                        phase[list_field] = []
                                    elif not isinstance(val, list):
                                        phase[list_field] = [str(val)]
                                    else:
                                        phase[list_field] = [str(item) for item in val]
                                else:
                                    phase[list_field] = []

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
                
                # Sanitize response fields to ensure list types for AILearningPlanResponse
                list_fields = ["weekly_plan", "recommendations"]
                for list_field in list_fields:
                    if list_field in parsed:
                        val = parsed[list_field]
                        if isinstance(val, str):
                            parsed[list_field] = [val] if val.strip() else []
                        elif val is None:
                            parsed[list_field] = []
                        elif not isinstance(val, list):
                            parsed[list_field] = [val]

                # Sanitize string list fields to convert dict elements to strings
                string_list_fields = [
                    "monthly_goals", "quarterly_goals", "practice_schedule",
                    "certification_suggestions", "books", "courses", "hands_on_projects",
                    "open_source_contributions", "interview_practice"
                ]
                for list_field in string_list_fields:
                    if list_field in parsed:
                        val = parsed[list_field]
                        if isinstance(val, str):
                            parsed[list_field] = [val] if val.strip() else []
                        elif val is None:
                            parsed[list_field] = []
                        elif isinstance(val, list):
                            new_list = []
                            for item in val:
                                if isinstance(item, dict):
                                    str_val = item.get("title") or item.get("name") or item.get("description") or item.get("goal") or str(item)
                                    new_list.append(str_val)
                                elif item is not None:
                                    new_list.append(str(item))
                            parsed[list_field] = new_list
                        else:
                            parsed[list_field] = [str(val)]

                # Sanitize weekly plan nested items
                if "weekly_plan" in parsed and isinstance(parsed["weekly_plan"], list):
                    for item in parsed["weekly_plan"]:
                        if isinstance(item, dict):
                            for nested_list in ["objectives", "schedule"]:
                                if nested_list in item:
                                    val = item[nested_list]
                                    if isinstance(val, str):
                                        item[nested_list] = [val] if val.strip() else []
                                    elif val is None:
                                        item[nested_list] = []
                                    elif isinstance(val, list):
                                        if nested_list == "objectives":
                                            new_objectives = []
                                            for obj in val:
                                                if isinstance(obj, dict):
                                                    str_obj = obj.get("title") or obj.get("name") or obj.get("objective") or str(obj)
                                                    new_objectives.append(str_obj)
                                                elif obj is not None:
                                                    new_objectives.append(str(obj))
                                            item["objectives"] = new_objectives
                                    else:
                                        item[nested_list] = [val]
                                else:
                                    item[nested_list] = []
                            # Sanitize AIWeeklyPlanDay nested items
                            if "schedule" in item and isinstance(item["schedule"], list):
                                for day in item["schedule"]:
                                    if isinstance(day, dict):
                                        if "tasks" in day:
                                            val = day["tasks"]
                                            if isinstance(val, str):
                                                day["tasks"] = [val] if val.strip() else []
                                            elif val is None:
                                                day["tasks"] = []
                                            elif isinstance(val, list):
                                                new_tasks = []
                                                for t in val:
                                                    if isinstance(t, dict):
                                                        str_t = t.get("title") or t.get("name") or t.get("task") or str(t)
                                                        new_tasks.append(str_t)
                                                    elif t is not None:
                                                        new_tasks.append(str(t))
                                                day["tasks"] = new_tasks
                                            else:
                                                day["tasks"] = [val]
                                        else:
                                            day["tasks"] = []

                # Sanitize recommendations nested items
                if "recommendations" in parsed and isinstance(parsed["recommendations"], list):
                    for rec in parsed["recommendations"]:
                        if isinstance(rec, dict):
                            for rec_list in ["learning_resources", "practice_projects", "success_criteria"]:
                                if rec_list in rec:
                                    val = rec[rec_list]
                                    if isinstance(val, str):
                                        rec[rec_list] = [val] if val.strip() else []
                                    elif val is None:
                                        rec[rec_list] = []
                                    elif isinstance(val, list):
                                        new_rec_list = []
                                        for r_item in val:
                                            if isinstance(r_item, dict):
                                                str_r = r_item.get("title") or r_item.get("name") or r_item.get("resource") or str(r_item)
                                                new_rec_list.append(str_r)
                                            elif r_item is not None:
                                                new_rec_list.append(str(r_item))
                                        rec[rec_list] = new_rec_list
                                    else:
                                        rec[rec_list] = [val]
                                else:
                                    rec[rec_list] = []

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


