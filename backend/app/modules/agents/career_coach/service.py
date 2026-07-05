# app/modules/agents/career_coach/service.py

import json
import uuid
import time
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
import structlog

from app.modules.agents.career_coach.validator import CareerCoachAgentValidator
from app.modules.agents.career_coach.prompts import (
    CAREER_COACH_ANALYZE_PROMPT,
    CAREER_COACH_PROGRESS_PROMPT,
    CAREER_COACH_WEEKLY_PLAN_PROMPT,
    CAREER_COACH_MONTHLY_PLAN_PROMPT
)
from app.career_roadmap.dependencies import get_roadmap_service, get_career_analytics_service
from app.career_roadmap.schemas.schemas import RoadmapCreate
from app.ai.services.ai_service import AIService
from app.ai.providers.factory import AIProviderFactory
from app.modules.rag.generation.orchestrator import RAGOrchestrator

logger = structlog.get_logger()

class CareerCoachAgentService:
    """Service layer coordinating business logic for the Career Coach Agent."""

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
                self.ai_service.registry.register_prompt("career_coach", CAREER_COACH_ANALYZE_PROMPT)
                self.ai_service.registry.register_prompt("career_coach", CAREER_COACH_PROGRESS_PROMPT)
                self.ai_service.registry.register_prompt("career_coach", CAREER_COACH_WEEKLY_PLAN_PROMPT)
                self.ai_service.registry.register_prompt("career_coach", CAREER_COACH_MONTHLY_PLAN_PROMPT)
            except Exception as e:
                logger.error("failed_to_register_career_coach_agent_prompts", error=str(e))

    async def generate_roadmap(
        self,
        user_id: uuid.UUID,
        target_role: str,
        experience_level: str,
        current_role: Optional[str] = None,
        target_industry: Optional[str] = None,
        estimated_duration_months: Optional[int] = 12,
        resume_id: Optional[uuid.UUID] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Creates and generates a full Career Roadmap."""
        # 1. Validation
        CareerCoachAgentValidator.validate_target_role(target_role)
        if resume_id:
            CareerCoachAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)

        # 2. Reuse RoadmapService
        roadmap_service = get_roadmap_service(db=self.db)
        
        req = RoadmapCreate(
            resume_id=resume_id,
            target_role=target_role,
            current_role=current_role,
            experience_level=experience_level,
            target_industry=target_industry,
            estimated_duration_months=estimated_duration_months
        )
        
        db_roadmap = await roadmap_service.create_roadmap(user_id=user_id, request=req)
        db_roadmap = await roadmap_service.generate_and_save_roadmap(user_id=user_id, roadmap_id=db_roadmap.id)
        
        # Format response
        milestones = []
        for m in db_roadmap.milestones:
            milestones.append({
                "phase_number": m.phase_number,
                "title": m.title,
                "description": m.description,
                "duration": m.duration,
                "status": m.status
            })
            
        recommendations = []
        for r in db_roadmap.recommendations:
            recommendations.append({
                "category": r.category,
                "title": r.title,
                "description": r.description,
                "priority": r.priority,
                "resource_url": r.resource_url,
                "estimated_hours": r.estimated_hours
            })

        return {
            "roadmap_id": str(db_roadmap.id),
            "target_role": db_roadmap.target_role,
            "current_role": db_roadmap.current_role,
            "experience_level": db_roadmap.experience_level,
            "target_industry": db_roadmap.target_industry,
            "status": db_roadmap.roadmap_status,
            "readiness_score": db_roadmap.current_readiness_score,
            "milestones": milestones,
            "recommendations": recommendations
        }

    async def analyze(
        self,
        user_id: uuid.UUID,
        target_role: str,
        resume_id: Optional[uuid.UUID] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Runs Career Readiness and Risk Analysis."""
        CareerCoachAgentValidator.validate_target_role(target_role)

        resume_json = None
        experience_level = "MID"
        if resume_id:
            resume = CareerCoachAgentValidator.validate_resume_exists_and_owned(self.db, resume_id, user_id)
            resume_json = json.dumps(resume.parsed_data, indent=2, default=str)
            # Try to get experience level from parsing metadata/data
            try:
                experience_level = resume.parsed_data.get("data", {}).get("experience_level", "MID")
            except Exception:
                pass

        variables = {
            "target_role": target_role,
            "experience_level": experience_level,
            "resume_json": resume_json or "{}"
        }

        # Initialize AI provider / service
        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="career_coach",
            name="analyze",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1500
        )

        parsed_analysis = structured_response.parsed_response
        CareerCoachAgentValidator.validate_ai_response(
            parsed_analysis,
            ["readiness_score", "technical_skills_analysis", "soft_skills_analysis", "career_risks", "actionable_insights", "guidance_summary"]
        )

        return parsed_analysis

    async def progress(
        self,
        user_id: uuid.UUID,
        roadmap_id: uuid.UUID,
        completed_milestones: Optional[List[int]] = None,
        current_milestone: Optional[int] = None,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Performs Goal Tracking and progress analysis."""
        roadmap = CareerCoachAgentValidator.validate_roadmap_exists_and_owned(self.db, roadmap_id, user_id)
        
        milestones_list = sorted(roadmap.milestones, key=lambda x: x.phase_number)
        milestones_details = ""
        for i, m in enumerate(milestones_list):
            milestones_details += f"Phase {m.phase_number}: {m.title}\nDescription: {m.description}\nStatus: {m.status}\n\n"

        variables = {
            "target_role": roadmap.target_role,
            "total_milestones": len(roadmap.milestones),
            "completed_milestones": completed_milestones or [m.phase_number for m in roadmap.milestones if m.status == "COMPLETED"],
            "current_milestone": current_milestone or (completed_milestones[-1] + 1 if completed_milestones else 1),
            "milestones_details": milestones_details
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="career_coach",
            name="progress",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1000
        )

        parsed_progress = structured_response.parsed_response
        CareerCoachAgentValidator.validate_ai_response(
            parsed_progress,
            ["completion_percentage", "completed_milestones", "current_milestone", "next_steps", "recommendations"]
        )

        return parsed_progress

    async def weekly_plan(
        self,
        user_id: uuid.UUID,
        roadmap_id: uuid.UUID,
        week_number: int = 1,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Generates weekly study and action plan."""
        roadmap = CareerCoachAgentValidator.validate_roadmap_exists_and_owned(self.db, roadmap_id, user_id)

        milestones_list = sorted(roadmap.milestones, key=lambda x: x.phase_number)
        milestones_details = ""
        for m in milestones_list:
            milestones_details += f"Phase {m.phase_number}: {m.title}\nDescription: {m.description}\n\n"

        variables = {
            "target_role": roadmap.target_role,
            "week_number": week_number,
            "milestones_details": milestones_details
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="career_coach",
            name="weekly_plan",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1000
        )

        parsed_plan = structured_response.parsed_response
        CareerCoachAgentValidator.validate_ai_response(
            parsed_plan,
            ["week_number", "focus_areas", "tasks", "estimated_hours", "success_criteria"]
        )

        return parsed_plan

    async def monthly_plan(
        self,
        user_id: uuid.UUID,
        roadmap_id: uuid.UUID,
        month_number: int = 1,
        model_override: Optional[str] = None,
        bypass_cache: bool = False
    ) -> Dict[str, Any]:
        """Generates monthly study and action plan."""
        roadmap = CareerCoachAgentValidator.validate_roadmap_exists_and_owned(self.db, roadmap_id, user_id)

        milestones_list = sorted(roadmap.milestones, key=lambda x: x.phase_number)
        milestones_details = ""
        for m in milestones_list:
            milestones_details += f"Phase {m.phase_number}: {m.title}\nDescription: {m.description}\n\n"

        variables = {
            "target_role": roadmap.target_role,
            "month_number": month_number,
            "milestones_details": milestones_details
        }

        provider = AIProviderFactory.get_provider(model_name=model_override)
        active_ai_service = AIService(provider, registry=self.ai_service.registry)

        structured_response = await active_ai_service.execute(
            category="career_coach",
            name="monthly_plan",
            variables=variables,
            parser_type="json",
            temperature=0.3,
            max_tokens=1200
        )

        parsed_plan = structured_response.parsed_response
        CareerCoachAgentValidator.validate_ai_response(
            parsed_plan,
            ["month_number", "milestones", "key_focus", "weekly_breakdown", "monthly_goals"]
        )

        return parsed_plan
