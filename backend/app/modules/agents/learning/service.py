# app/modules/agents/learning/service.py

import json
import uuid
import time
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
import structlog

from app.modules.agents.learning.validator import LearningAgentValidator
from app.modules.agents.learning.prompts import (
    LEARNING_RECOMMEND_PROMPT,
    LEARNING_PATH_PROMPT,
    LEARNING_COURSES_PROMPT,
    LEARNING_CERTIFICATIONS_PROMPT,
    LEARNING_STUDY_PLAN_PROMPT
)
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator
from app.modules.rag.generation.models import RAGRequest

logger = structlog.get_logger()

class LearningAgentService:
    """Service layer coordinating business logic for the Learning Agent."""

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

    def _register_prompts(self):
        """Registers agent-specific prompt templates dynamically in prompt registry."""
        if self.ai_service and self.ai_service.registry:
            try:
                self.ai_service.registry.register_prompt("learning", LEARNING_RECOMMEND_PROMPT)
                self.ai_service.registry.register_prompt("learning", LEARNING_PATH_PROMPT)
                self.ai_service.registry.register_prompt("learning", LEARNING_COURSES_PROMPT)
                self.ai_service.registry.register_prompt("learning", LEARNING_CERTIFICATIONS_PROMPT)
                self.ai_service.registry.register_prompt("learning", LEARNING_STUDY_PLAN_PROMPT)
            except Exception as e:
                logger.error("failed_to_register_learning_agent_prompts", error=str(e))

    async def recommend(
        self,
        user_id: uuid.UUID,
        target_role: str,
        resume_id: Optional[uuid.UUID] = None,
        skills: Optional[List[str]] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Provides learning recommendation details."""
        LearningAgentValidator.validate_target_role(target_role)

        resume_json = None
        if resume_id:
            resume = LearningAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
            resume_json = json.dumps(resume.parsed_data, indent=2, default=str)

        variables = {
            "target_role": target_role,
            "skills": ", ".join(skills) if skills else "None",
            "resume_json": resume_json or "{}"
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="learning",
            name="recommend",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1500
        )

        parsed_rec = structured_response.parsed_response
        LearningAgentValidator.validate_ai_response(parsed_rec, ["recommendations"])

        return parsed_rec

    async def path(
        self,
        user_id: uuid.UUID,
        target_role: str,
        resume_id: Optional[uuid.UUID] = None,
        preferences: Optional[Dict[str, Any]] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Creates personalized study and learning paths."""
        LearningAgentValidator.validate_target_role(target_role)

        resume_json = None
        if resume_id:
            resume = LearningAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
            resume_json = json.dumps(resume.parsed_data, indent=2, default=str)

        variables = {
            "target_role": target_role,
            "preferences": json.dumps(preferences) if preferences else "None",
            "resume_json": resume_json or "{}"
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="learning",
            name="path",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1500
        )

        parsed_path = structured_response.parsed_response
        LearningAgentValidator.validate_ai_response(parsed_path, ["target_role", "phases"])

        return parsed_path

    async def courses(
        self,
        user_id: uuid.UUID,
        query: Optional[str] = None,
        skills: Optional[List[str]] = None,
        target_role: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Queries the Course Knowledge Base (RAG) and ranks the courses."""
        rag_context_str = ""
        
        if self.rag_orchestrator:
            try:
                # Query RAG collection
                rag_query = query or (", ".join(skills) if skills else target_role) or "software engineering courses"
                rag_req = RAGRequest(
                    question=f"List relevant courses for: {rag_query}",
                    collection="course_kb",
                    limit=4
                )
                rag_res = await self.rag_orchestrator.query(rag_req)
                rag_context_str = rag_res.answer or ""
            except Exception as e:
                logger.warning("learning_agent_rag_course_retrieval_failed", error=str(e))

        if not rag_context_str:
            rag_context_str = "No specific course context found in local database RAG."

        variables = {
            "target_role": target_role or "General",
            "skills": ", ".join(skills) if skills else "None",
            "query": query or "None",
            "rag_context": rag_context_str
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="learning",
            name="courses",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1500
        )

        parsed_courses = structured_response.parsed_response
        LearningAgentValidator.validate_ai_response(parsed_courses, ["courses"])

        return parsed_courses

    async def certifications(
        self,
        user_id: uuid.UUID,
        target_role: str,
        skills: Optional[List[str]] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Provides certification recommendations."""
        LearningAgentValidator.validate_target_role(target_role)

        variables = {
            "target_role": target_role,
            "skills": ", ".join(skills) if skills else "None"
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="learning",
            name="certifications",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1200
        )

        parsed_cert = structured_response.parsed_response
        LearningAgentValidator.validate_ai_response(parsed_cert, ["certifications"])

        return parsed_cert

    async def study_plan(
        self,
        user_id: uuid.UUID,
        target_role: str,
        hours_per_week: int = 10,
        duration_weeks: int = 4,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Generates a structured study plan."""
        LearningAgentValidator.validate_target_role(target_role)

        variables = {
            "target_role": target_role,
            "hours_per_week": hours_per_week,
            "duration_weeks": duration_weeks
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="learning",
            name="study_plan",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1500
        )

        parsed_plan = structured_response.parsed_response
        LearningAgentValidator.validate_ai_response(parsed_plan, ["study_plan"])

        return parsed_plan
