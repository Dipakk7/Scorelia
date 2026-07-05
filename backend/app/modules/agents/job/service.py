# app/modules/agents/job/service.py

import json
import uuid
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
import structlog

from app.models.resume import Resume
from app.modules.agents.job.validator import JobMatchAgentValidator
from app.modules.agents.job.prompts import JOB_ANALYZE_PROMPT, JOB_RECOMMEND_PROMPT
from app.services.job_match.parser import parse_job_description
from app.services.job_match.job_match_service import calculate_job_match, analyze_resume_gap
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator
from app.modules.rag.generation.models import RAGRequest

logger = structlog.get_logger()


class JobMatchAgentService:
    """Service class coordinating business logic for the Job Match Agent."""

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
                self.ai_service.registry.register_prompt("job", JOB_ANALYZE_PROMPT)
                self.ai_service.registry.register_prompt("job", JOB_RECOMMEND_PROMPT)
            except Exception as e:
                logger.error("failed_to_register_job_agent_prompts", error=str(e))

    async def match(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: str,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Calculates python-based job matching results against a job description."""
        resume = JobMatchAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        JobMatchAgentValidator.validate_parsed_data(resume)
        JobMatchAgentValidator.validate_job_description(job_description)

        job_desc_model = parse_job_description(job_description)
        match_response = calculate_job_match(resume, job_desc_model)

        # Convert JobMatchResponse to dict
        return {
            "resume_id": str(match_response.resume_id),
            "match_score": match_response.match_score,
            "grade": match_response.grade,
            "breakdown": match_response.breakdown.model_dump() if hasattr(match_response.breakdown, "model_dump") else match_response.breakdown,
            "matched_skills": match_response.matched_skills,
            "missing_skills": match_response.missing_skills,
            "extra_skills": match_response.extra_skills,
            "recommendations": match_response.recommendations,
            "parser_version": match_response.parser_version,
            "ats_version": match_response.ats_version,
            "job_match_version": match_response.job_match_version,
            "generated_at": match_response.generated_at.isoformat() if hasattr(match_response.generated_at, "isoformat") else str(match_response.generated_at)
        }

    async def analyze(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: str,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Runs gap analysis and compares resume vs JD using both python rules and LLM."""
        resume = JobMatchAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        JobMatchAgentValidator.validate_parsed_data(resume)
        JobMatchAgentValidator.validate_job_description(job_description)

        job_desc_model = parse_job_description(job_description)
        gap_response = analyze_resume_gap(resume, job_desc_model)

        # Build context variables for the LLM
        variables = {
            "resume_json": json.dumps(resume.parsed_data, indent=2, default=str),
            "job_description": job_description,
            "gap_analysis_output": gap_response.model_dump_json(indent=2) if hasattr(gap_response, "model_dump_json") else json.dumps(gap_response)
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="job",
            name="analyze",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1500
        )

        parsed_analysis = structured_response.parsed_response
        JobMatchAgentValidator.validate_ai_response(
            parsed_analysis,
            ["match_summary", "education_match_explanation", "experience_match_explanation", "skills_match_explanation", "certification_match_explanation"]
        )

        # Format gap_response dict
        gap_dict = {
            "overall_match": gap_response.overall_match,
            "skill_gap": gap_response.skill_gap,
            "experience_gap": gap_response.experience_gap,
            "education_gap": gap_response.education_gap,
            "certification_gap": gap_response.certification_gap,
            "keyword_gap": gap_response.keyword_gap,
            "priority_improvements": gap_response.priority_improvements
        }

        return {
            "gap_analysis": gap_dict,
            "ai_analysis": parsed_analysis
        }

    async def recommend(
        self,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        job_description: Optional[str] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Provides recommendations to bridge gaps using optional RAG context."""
        resume = JobMatchAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
        JobMatchAgentValidator.validate_parsed_data(resume)

        # 1. Fetch relevant RAG context from job knowledge base if orchestrator is initialized
        rag_context_str = ""
        if self.rag_orchestrator:
            try:
                # Extract primary skills to query jobs database/RAG
                data = resume.parsed_data.get("data", {})
                skills_list = []
                skills_node = data.get("skills", {})
                if isinstance(skills_node, dict):
                    skills_list = skills_node.get("value", [])
                elif isinstance(skills_node, list):
                    skills_list = skills_node

                query_skills = ", ".join(skills_list[:5]) if skills_list else "software engineering"
                query_str = f"What are the typical job requirements, missing skills, and roles for skills like: {query_skills}?"

                rag_req = RAGRequest(
                    question=query_str,
                    collection="job_kb",
                    limit=3
                )
                rag_res = await self.rag_orchestrator.query(rag_req)
                rag_context_str = rag_res.answer or ""
            except Exception as e:
                logger.warning("job_agent_rag_context_retrieval_failed", error=str(e))

        # 2. Invoke LLM to generate recommendations
        variables = {
            "resume_json": json.dumps(resume.parsed_data, indent=2, default=str),
            "job_description": job_description or "",
            "rag_context": rag_context_str
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="job",
            name="recommend",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1200
        )

        parsed_recs = structured_response.parsed_response
        JobMatchAgentValidator.validate_ai_response(
            parsed_recs,
            ["recommendations"]
        )

        return parsed_recs
