import os
import structlog
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.ai.services.ai_service import AIService
from app.ai.prompts.loader import load_prompt_file
from app.interview.services.context import InterviewContext
from app.interview.models.interview import InterviewSession, InterviewTurn
from app.interview.metrics import interview_metrics

logger = structlog.get_logger()

class GeneratedQuestion(BaseModel):
    question_id: int
    category: str
    difficulty: str
    question: str
    expected_topics: List[str]
    recommended_answer_framework: str
    estimated_time_seconds: int
    evaluation_weight: int
    followup_possible: bool

class GeneratedQuestionBatch(BaseModel):
    questions: List[GeneratedQuestion]

class AnswerEvaluationResponse(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    technical_score: int = Field(..., ge=0, le=100)
    communication_score: int = Field(..., ge=0, le=100)
    grammar_score: int = Field(..., ge=0, le=100)
    confidence_score: int = Field(..., ge=0, le=100)
    professionalism_score: int = Field(..., ge=0, le=100)
    star_score: int = Field(..., ge=0, le=100)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_topics: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    followup_questions: List[str] = Field(default_factory=list)
    summary: str = Field(default="")

    model_config = ConfigDict(from_attributes=True)

class AIEvaluationOutput(AnswerEvaluationResponse):
    rubric_scores: Dict[str, int] = Field(default_factory=dict)
    star_analysis: Dict[str, Any] = Field(default_factory=dict)
    quality_analysis: Dict[str, Any] = Field(default_factory=dict)
    followup_metadata: Dict[str, Any] = Field(default_factory=dict)

    model_config = ConfigDict(from_attributes=True)

class InterviewAIService:
    """Service layer for AI Interview Prompt orchestration, selection, and validation."""

    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self._load_and_register_prompts()

    def _load_and_register_prompts(self) -> None:
        """Register the interview prompt templates with the global Prompt Registry."""
        # Find prompts directory relative to this service file
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        prompts_dir = os.path.join(current_dir, "prompts")

        if not os.path.exists(prompts_dir):
            logger.warning("interview_prompts_directory_not_found", path=prompts_dir)
            return

        logger.info("loading_interview_prompts_from_directory", path=prompts_dir)
        for file in os.listdir(prompts_dir):
            if file.endswith(".jinja"):
                filepath = os.path.join(prompts_dir, file)
                try:
                    template = load_prompt_file(filepath)
                    # Register under category 'interview'
                    self.ai_service.registry.register_prompt("interview", template)
                except Exception as e:
                    logger.error("failed_to_load_interview_prompt", file=file, error=str(e))
                    raise

    def select_prompt(self, interview_type: str) -> str:
        """Select prompt template name based on interview type.
        
        Supported types: BEHAVIORAL, TECHNICAL, FIT, HR, SYSTEM_DESIGN, RESUME_BASED, MIXED.
        """
        # Select the appropriate template
        norm_type = interview_type.upper().strip()
        if norm_type == "BEHAVIORAL":
            prompt_name = "behavioral"
        elif norm_type == "TECHNICAL":
            prompt_name = "technical"
        elif norm_type in ("FIT", "HR"):
            prompt_name = "hr"
        elif norm_type == "SYSTEM_DESIGN":
            prompt_name = "technical"
        elif norm_type == "RESUME_BASED":
            prompt_name = "resume_based"
        elif norm_type == "MIXED":
            prompt_name = "mixed"
        else:
            prompt_name = "behavioral"

        # Record metrics (excluding AI call metrics)
        interview_metrics.record_prompt_selected(prompt_name)
        logger.info("prompt_selected", interview_type=interview_type, prompt_name=prompt_name)
        return prompt_name

    def prepare_variables(
        self,
        session: InterviewSession,
        context: InterviewContext,
        additional_vars: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Prepare context variables dict for prompt template rendering."""
        variables = {
            "company": session.company_name or "Unknown Company",
            "role": session.target_role or "Unknown Role",
            "difficulty": session.difficulty or "MEDIUM",
            "interview_type": session.interview_type or "BEHAVIORAL",
            "total_questions": session.total_questions or 5,
            "current_question": session.current_question or 1,
            "context": context.to_dict()
        }
        if additional_vars:
            variables.update(additional_vars)

        logger.info("prompt_variables_prepared", session_id=str(session.id))
        return variables

    def validate_variables(self, prompt_name: str, variables: Dict[str, Any]) -> None:
        """Validate context variables against prompt template definition."""
        try:
            template = self.ai_service.registry.get_prompt("interview", prompt_name)
            self.ai_service.validator.validate_variables(template.template_body, variables)
            logger.info("prompt_variables_validated", prompt_name=prompt_name)
        except Exception as e:
            logger.error("prompt_variables_validation_failed", prompt_name=prompt_name, error=str(e))
            raise

    def prepare_request(
        self,
        session: InterviewSession,
        variables: Dict[str, Any],
        prompt_name: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """Assemble target payload parameters for future execution (no inference)."""
        logger.info("request_prepared_for_execution", session_id=str(session.id), prompt_name=prompt_name)
        return {
            "category": "interview",
            "name": prompt_name,
            "variables": variables,
            "temperature": temperature or 0.3,
            "max_tokens": max_tokens or 2048,
            "provider": session.provider or "ollama",
            "model": session.model or "qwen2.5:3b"
        }

    async def execute_placeholder_hook(self, request_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Future execution hook placeholder. Does not perform inference in Part 1B."""
        logger.info("future_execution_hook_invoked", payload_keys=list(request_payload.keys()))
        return {
            "status": "placeholder_success",
            "message": "Hook executed successfully. No inference performed in Phase 10 Part 1B."
        }

    async def generate_questions(
        self,
        session: InterviewSession,
        context: InterviewContext,
        count: int = 1,
        last_turn: Optional[InterviewTurn] = None,
        prompt_name: Optional[str] = None
    ):
        """Generate structured questions from the LLM.
        
        This builds variables, selects the correct prompt template,
        executes it, validates the JSON output, and retries once on failure.
        """
        # Determine current difficulty
        difficulty = session.difficulty
        if difficulty.upper().strip() == "ADAPTIVE":
            difficulty = self._resolve_adaptive_difficulty(session)

        # Select prompt template
        if last_turn:
            prompt_name = "followup"
        elif not prompt_name:
            prompt_name = self.select_prompt(session.interview_type)
        
        # Prepare previous questions list
        previous_questions = [t.question_text for t in session.turns]

        # Prepare variables
        additional_vars = {
            "count": count,
            "current_question": session.current_question,
            "previous_questions": previous_questions,
            "difficulty": difficulty
        }
        if last_turn:
            additional_vars.update({
                "last_question": last_turn.question_text,
                "last_answer": last_turn.answer_text or ""
            })

        variables = self.prepare_variables(session, context, additional_vars)
        
        # Filter variables to only include those expected by the template to avoid validator errors
        template = self.ai_service.registry.get_prompt("interview", prompt_name)
        expected_vars = self.ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}

        self.validate_variables(prompt_name, filtered_variables)

        # Execute AI call with retry once on invalid JSON/validation failure
        try:
            response = await self.ai_service.execute(
                category="interview",
                name=prompt_name,
                variables=filtered_variables,
                parser_type="json",
                temperature=0.3,
                max_tokens=2048
            )
            questions = self._parse_and_validate(response.parsed_response)
        except Exception as exc:
            logger.warning(
                "question_generation_failed_retrying",
                session_id=str(session.id),
                prompt_name=prompt_name,
                error=str(exc)
            )
            # Retry exactly once
            response = await self.ai_service.execute(
                category="interview",
                name=prompt_name,
                variables=filtered_variables,
                parser_type="json",
                temperature=0.3,
                max_tokens=2048
            )
            questions = self._parse_and_validate(response.parsed_response)

        return questions, response

    def _resolve_adaptive_difficulty(self, session: InterviewSession) -> str:
        """Resolve the current difficulty dynamically based on prior turn performance."""
        turns = sorted(session.turns, key=lambda t: t.question_number)
        if not turns:
            return "MEDIUM"

        latest_scored_turn = None
        for turn in reversed(turns):
            if turn.score is not None:
                latest_scored_turn = turn
                break

        if not latest_scored_turn:
            return "MEDIUM"

        prev_difficulty = "MEDIUM"
        questions_meta = (session.session_metadata or {}).get("questions", [])
        for q in questions_meta:
            if q.get("question_id") == latest_scored_turn.question_number:
                prev_difficulty = q.get("difficulty", "MEDIUM").upper().strip()
                break

        score = latest_scored_turn.score
        if score >= 85:
            if prev_difficulty == "EASY":
                return "MEDIUM"
            elif prev_difficulty == "MEDIUM":
                return "HARD"
            else:
                return "HARD"
        elif score <= 55:
            if prev_difficulty == "HARD":
                return "MEDIUM"
            elif prev_difficulty == "MEDIUM":
                return "EASY"
            else:
                return "EASY"
        else:
            return prev_difficulty

    def _parse_and_validate(self, parsed_response: Any) -> List[GeneratedQuestion]:
        """Validate the JSON structure using Pydantic."""
        if not isinstance(parsed_response, dict):
            if isinstance(parsed_response, list):
                parsed_response = {"questions": parsed_response}
            else:
                raise ValueError("Parsed response is not a dictionary.")

        batch = GeneratedQuestionBatch(**parsed_response)
        if not batch.questions:
            raise ValueError("No questions found in AI response.")
        return batch.questions

    async def evaluate_answer(
        self,
        session: InterviewSession,
        turn: InterviewTurn,
        context: InterviewContext,
        answer_text: str
    ) -> tuple[AIEvaluationOutput, Any]:
        """Evaluate the candidate's answer using the AI Service."""
        if not answer_text or not answer_text.strip():
            raise ValueError("Answer cannot be empty.")
        if not turn.question_text or not turn.question_text.strip():
            raise ValueError("Question text is missing or empty.")

        # Determine prompt template
        cat = (turn.question_category or "").upper().strip()
        if session.interview_type == "FOLLOWUP" or cat == "FOLLOWUP":
            prompt_name = "followup_evaluation"
        elif cat == "TECHNICAL" or session.interview_type in ("TECHNICAL", "SYSTEM_DESIGN"):
            prompt_name = "technical_evaluation"
        elif cat == "BEHAVIORAL" or session.interview_type == "BEHAVIORAL":
            prompt_name = "behavioral_evaluation"
        elif cat in ("HR", "FIT") or session.interview_type in ("HR", "FIT"):
            prompt_name = "hr_evaluation"
        else:
            prompt_name = "answer_evaluation"

        # Check if the prompt template actually exists in prompt registry, otherwise fallback
        try:
            self.ai_service.registry.get_prompt("interview", prompt_name)
        except Exception:
            prompt_name = "answer_evaluation"

        # Resolve expected topics from metadata if possible
        expected_topics = []
        questions_meta = (session.session_metadata or {}).get("questions", [])
        for q in questions_meta:
            if q.get("question_id") == turn.question_number:
                expected_topics = q.get("expected_topics", [])
                break

        # Prepare variables
        variables = {
            "company": session.company_name or "Unknown Company",
            "role": session.target_role or "Unknown Role",
            "difficulty": session.difficulty or "MEDIUM",
            "question": turn.question_text,
            "answer": answer_text,
            "expected_topics": expected_topics
        }

        # Filter variables to only include those expected by the template to avoid validation errors
        template = self.ai_service.registry.get_prompt("interview", prompt_name)
        expected_vars = self.ai_service.validator.validate_template(template.template_body)
        filtered_variables = {k: v for k, v in variables.items() if k in expected_vars}

        self.validate_variables(prompt_name, filtered_variables)

        # AI Call with retry once on parsing/validation failure
        try:
            response = await self.ai_service.execute(
                category="interview",
                name=prompt_name,
                variables=filtered_variables,
                parser_type="json",
                temperature=0.3,
                max_tokens=2048
            )
            evaluation = AIEvaluationOutput(**response.parsed_response)
        except Exception as exc:
            logger.warning(
                "answer_evaluation_failed_retrying",
                session_id=str(session.id),
                turn_id=str(turn.id),
                prompt_name=prompt_name,
                error=str(exc)
            )
            # Retry exactly once
            response = await self.ai_service.execute(
                category="interview",
                name=prompt_name,
                variables=filtered_variables,
                parser_type="json",
                temperature=0.3,
                max_tokens=2048
            )
            evaluation = AIEvaluationOutput(**response.parsed_response)

        return evaluation, response
