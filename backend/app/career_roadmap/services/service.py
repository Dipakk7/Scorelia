import uuid
import structlog
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.enums import RoadmapStatus
from app.career_roadmap.crud.crud import RoadmapCRUD
from app.career_roadmap.models.roadmap import CareerRoadmap
from app.career_roadmap.schemas.schemas import RoadmapCreate, SkillGapRequest, LearningPlanRequest, TimelineRequest
from app.career_roadmap.services.context import RoadmapContext

logger = structlog.get_logger()

from app.career_roadmap.services.ai_service import RoadmapAIService

class RoadmapService:
    """Service layer coordinating career roadmap CRUD operations and context retrieval."""

    def __init__(self, db: Session, roadmap_ai_service: RoadmapAIService):
        self.db = db
        self.roadmap_ai_service = roadmap_ai_service

    async def create_roadmap(
        self,
        user_id: uuid.UUID,
        request: RoadmapCreate
    ) -> CareerRoadmap:
        """Create a new career roadmap shell record in the database."""
        # Use default provider configuration settings
        provider_name = settings.AI_PROVIDER
        model_name = settings.OLLAMA_MODEL
        prompt_version = "1.0.0"

        # Duration months override check
        months = request.estimated_duration_months or settings.ROADMAP_DEFAULT_MONTHS
        readiness_score = 50  # Starting default readiness score

        db_roadmap = RoadmapCRUD.create_roadmap(
            db=self.db,
            user_id=user_id,
            schema=request,
            status=RoadmapStatus.PENDING.value,
            estimated_duration_months=months,
            current_readiness_score=readiness_score,
            provider=provider_name,
            model=model_name,
            prompt_version=prompt_version
        )

        logger.info(
            "career_roadmap_created",
            roadmap_id=str(db_roadmap.id),
            user_id=str(user_id),
            target_role=db_roadmap.target_role,
            experience_level=db_roadmap.experience_level,
            provider=provider_name,
            model=model_name,
            prompt_version=prompt_version
        )
        return db_roadmap

    async def get_roadmap(
        self,
        roadmap_id: uuid.UUID,
        user_id: uuid.UUID
    ) -> Optional[CareerRoadmap]:
        """Fetch a specific career roadmap and check ownership."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            logger.warning(
                "career_roadmap_not_found",
                roadmap_id=str(roadmap_id),
                user_id=str(user_id)
            )
            return None
        
        logger.info(
            "career_roadmap_retrieved",
            roadmap_id=str(roadmap_id),
            user_id=str(user_id)
        )
        return roadmap

    async def list_roadmaps(self, user_id: uuid.UUID) -> List[CareerRoadmap]:
        """Retrieve career roadmap history for a user."""
        roadmaps = RoadmapCRUD.list_roadmaps(self.db, user_id)
        logger.info(
            "career_roadmaps_listed",
            user_id=str(user_id),
            count=len(roadmaps)
        )
        return roadmaps

    async def delete_roadmap(self, roadmap_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        """Delete a career roadmap record."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            logger.warning(
                "career_roadmap_delete_failed_not_found",
                roadmap_id=str(roadmap_id),
                user_id=str(user_id)
            )
            return False

        RoadmapCRUD.delete_roadmap(self.db, roadmap)
        logger.info(
            "career_roadmap_deleted",
            roadmap_id=str(roadmap_id),
            user_id=str(user_id)
        )
        return True

    async def build_context(
        self,
        user_id: uuid.UUID,
        resume_id: Optional[uuid.UUID] = None,
        target_role: Optional[str] = None
    ) -> RoadmapContext:
        """Build consolidated profile context for roadmap generation."""
        logger.info(
            "career_roadmap_context_requested",
            user_id=str(user_id),
            resume_id=str(resume_id) if resume_id else None,
            target_role=target_role
        )
        context = await RoadmapContext.build(
            db=self.db,
            user_id=user_id,
            resume_id=resume_id,
            target_role=target_role
        )
        logger.info(
            "career_roadmap_context_completed",
            user_id=str(user_id),
            has_resume=context.resume is not None,
            has_github=context.github_insights is not None,
            has_interview=context.interview_analytics is not None
        )
        return context

    async def generate_and_save_roadmap(
        self,
        user_id: uuid.UUID,
        roadmap_id: uuid.UUID
    ) -> CareerRoadmap:
        """Assembles context, generates AI career roadmap, maps to database milestones and learning recommendations, and updates status."""
        from datetime import datetime, timezone
        from app.core.enums import MilestoneStatus, LearningPriority
        from app.career_roadmap.models.roadmap import RoadmapMilestone, LearningRecommendation

        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            logger.error("roadmap_not_found_for_generation", roadmap_id=str(roadmap_id), user_id=str(user_id))
            raise ValueError("Career roadmap not found")

        roadmap.roadmap_status = RoadmapStatus.IN_PROGRESS.value
        self.db.commit()

        try:
            # 1. Build profile context
            context = await self.build_context(
                user_id=user_id,
                resume_id=roadmap.resume_id,
                target_role=roadmap.target_role
            )
            
            # 2. Call AIService generator
            gen_result = await self.roadmap_ai_service.generate_roadmap(roadmap, context)
            parsed_data = gen_result["parsed_response"]
            
            # 3. Clear existing milestones & recommendations if any (to support regeneration)
            self.db.query(RoadmapMilestone).filter(RoadmapMilestone.roadmap_id == roadmap_id).delete()
            self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap_id).delete()
            self.db.commit()
            
            # 4. Create and save new Milestones and Recommendations
            for phase in parsed_data.get("phases", []):
                duration_weeks = phase.get("estimated_duration_weeks", 4)
                duration_str = f"{duration_weeks} weeks"
                
                milestone_desc = (
                    f"Objective: {phase.get('objective', '')}\n\n"
                    f"Description: {phase.get('description', '')}\n\n"
                    f"Completion Criteria:\n" + "\n".join(f"- {c}" for c in phase.get("completion_criteria", [])) + "\n\n"
                    f"Career Outcome: {phase.get('career_outcome', '')}"
                )
                
                # Create Milestone
                RoadmapCRUD.create_milestone(
                    db=self.db,
                    roadmap_id=roadmap_id,
                    phase_number=phase.get("phase_number", 1),
                    title=phase.get("title", ""),
                    order_index=phase.get("phase_number", 1),
                    status=MilestoneStatus.NOT_STARTED.value,
                    description=milestone_desc,
                    duration=duration_str
                )
                
                # Create learning recommendations:
                # category: Skill
                for skill in phase.get("skills", []):
                    RoadmapCRUD.create_learning_recommendation(
                        db=self.db,
                        roadmap_id=roadmap_id,
                        category="Skill",
                        title=skill,
                        priority=LearningPriority.HIGH.value if phase.get("phase_number", 1) == 1 else LearningPriority.MEDIUM.value,
                        description=f"Recommended skill for Phase {phase.get('phase_number', 1)} ({phase.get('title', '')})."
                    )
                
                # category: Project
                for proj in phase.get("projects", []):
                    RoadmapCRUD.create_learning_recommendation(
                        db=self.db,
                        roadmap_id=roadmap_id,
                        category="Project",
                        title=proj,
                        priority=LearningPriority.HIGH.value,
                        description=f"Portfolio project for Phase {phase.get('phase_number', 1)} ({phase.get('title', '')})."
                    )

                # category: Certification
                for cert in phase.get("certifications", []):
                    RoadmapCRUD.create_learning_recommendation(
                        db=self.db,
                        roadmap_id=roadmap_id,
                        category="Certification",
                        title=cert,
                        priority=LearningPriority.MEDIUM.value,
                        description=f"Industry certification recommended in Phase {phase.get('phase_number', 1)} ({phase.get('title', '')})."
                    )

                # category: Resource
                for res in phase.get("resources", []):
                    RoadmapCRUD.create_learning_recommendation(
                        db=self.db,
                        roadmap_id=roadmap_id,
                        category="Resource",
                        title=res,
                        priority=LearningPriority.MEDIUM.value,
                        description=f"Reference resource for Phase {phase.get('phase_number', 1)} ({phase.get('title', '')})."
                    )

            # 5. Update root roadmap fields
            roadmap.roadmap_status = RoadmapStatus.COMPLETED.value
            roadmap.current_readiness_score = parsed_data.get("current_readiness_score", 50)
            roadmap.provider = gen_result["provider"]
            roadmap.model = gen_result["model"]
            roadmap.prompt_version = gen_result["prompt_version"]
            
            # Store full generated roadmap and latency in roadmap_metadata
            roadmap.roadmap_metadata = {
                "generated_roadmap": parsed_data,
                "latency_ms": gen_result["latency_ms"],
                "generated_at": datetime.now(timezone.utc).isoformat() + "Z"
            }
            
            self.db.commit()
            self.db.refresh(roadmap)
            
            # Privacy log requirements: only log metadata
            logger.info(
                "career_roadmap_generation_completed",
                roadmap_id=str(roadmap.id),
                latency_ms=gen_result["latency_ms"],
                provider=gen_result["provider"],
                prompt_version=gen_result["prompt_version"]
            )
            
            return roadmap

        except Exception as err:
            self.db.rollback()
            try:
                roadmap.roadmap_status = RoadmapStatus.FAILED.value
                self.db.commit()
            except Exception:
                pass
            logger.error(
                "career_roadmap_generation_failed",
                roadmap_id=str(roadmap_id),
                error=str(err)
            )
            raise

    async def get_or_create_roadmap_shell(
        self,
        user_id: uuid.UUID,
        roadmap_id: Optional[uuid.UUID],
        target_role: Optional[str],
        experience_level: Optional[str],
        current_role: Optional[str] = None,
        target_industry: Optional[str] = None,
        resume_id: Optional[uuid.UUID] = None
    ) -> CareerRoadmap:
        """Helper to get an existing roadmap or create a new shell if roadmap_id is not provided."""
        if roadmap_id:
            roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
            if not roadmap:
                raise ValueError("Career roadmap not found")
            return roadmap
        
        # Validation checks for target_role and experience_level when creating a new roadmap
        if not target_role:
            raise ValueError("Target role is required to create a roadmap")
        if not experience_level:
            raise ValueError("Experience level is required to create a roadmap")
            
        # Create a new RoadmapCreate schema object and create roadmap
        req_schema = RoadmapCreate(
            resume_id=resume_id,
            target_role=target_role,
            current_role=current_role,
            experience_level=experience_level,
            target_industry=target_industry,
            estimated_duration_months=settings.ROADMAP_DEFAULT_MONTHS
        )
        return await self.create_roadmap(user_id=user_id, request=req_schema)

    async def generate_and_save_skill_gap(
        self,
        user_id: uuid.UUID,
        roadmap_id: Optional[uuid.UUID],
        target_role: Optional[str] = None,
        experience_level: Optional[str] = None,
        current_role: Optional[str] = None,
        target_industry: Optional[str] = None,
        resume_id: Optional[uuid.UUID] = None
    ) -> Dict[str, Any]:
        """Generate and save skill gap analysis for a roadmap, utilizing DB cache if available."""
        # 1. Resolve target roadmap (fetch or create shell)
        roadmap = await self.get_or_create_roadmap_shell(
            user_id=user_id,
            roadmap_id=roadmap_id,
            target_role=target_role,
            experience_level=experience_level,
            current_role=current_role,
            target_industry=target_industry,
            resume_id=resume_id
        )

        # 2. Cache Check: check if skill_gap_analysis already exists in metadata
        metadata = roadmap.roadmap_metadata or {}
        if "skill_gap_analysis" in metadata:
            logger.info("returning_cached_skill_gap_analysis", roadmap_id=str(roadmap.id))
            return metadata["skill_gap_analysis"]

        # 3. Build profile context
        context = await self.build_context(
            user_id=user_id,
            resume_id=roadmap.resume_id,
            target_role=roadmap.target_role
        )

        # 4. Invoke AI Generation
        gen_result = await self.roadmap_ai_service.generate_skill_gap(roadmap, context)
        parsed_data = gen_result["parsed_response"]

        # 5. Persist to DB metadata
        from datetime import datetime, timezone
        updated_metadata = {
            **metadata,
            "skill_gap_analysis": parsed_data,
            "skill_gap_metadata": {
                "provider": gen_result["provider"],
                "model": gen_result["model"],
                "latency_ms": gen_result["latency_ms"],
                "prompt_version": gen_result["prompt_version"],
                "generated_at": datetime.now(timezone.utc).isoformat() + "Z"
            }
        }
        roadmap.roadmap_metadata = updated_metadata
        roadmap.provider = gen_result["provider"]
        roadmap.model = gen_result["model"]
        roadmap.prompt_version = gen_result["prompt_version"]
        
        # update readiness score if returned
        if "readiness_score" in parsed_data:
            roadmap.current_readiness_score = parsed_data["readiness_score"]
            
        self.db.commit()
        self.db.refresh(roadmap)

        # Privacy requirements: only log metadata
        logger.info(
            "skill_gap_generation_completed",
            roadmap_id=str(roadmap.id),
            latency_ms=gen_result["latency_ms"],
            provider=gen_result["provider"],
            prompt_version=gen_result["prompt_version"]
        )

        return parsed_data

    async def generate_and_save_learning_plan(
        self,
        user_id: uuid.UUID,
        roadmap_id: Optional[uuid.UUID],
        target_role: Optional[str] = None,
        experience_level: Optional[str] = None,
        current_role: Optional[str] = None,
        target_industry: Optional[str] = None,
        resume_id: Optional[uuid.UUID] = None
    ) -> Dict[str, Any]:
        """Generate and save personalized learning plan & recommendations, utilizing DB cache if available."""
        from app.career_roadmap.models.roadmap import LearningRecommendation
        from datetime import datetime, timezone

        # 1. Resolve target roadmap (fetch or create shell)
        roadmap = await self.get_or_create_roadmap_shell(
            user_id=user_id,
            roadmap_id=roadmap_id,
            target_role=target_role,
            experience_level=experience_level,
            current_role=current_role,
            target_industry=target_industry,
            resume_id=resume_id
        )

        # 2. Cache Check: check if learning_plan already exists in metadata
        metadata = roadmap.roadmap_metadata or {}
        if "learning_plan" in metadata:
            logger.info("returning_cached_learning_plan", roadmap_id=str(roadmap.id))
            return metadata["learning_plan"]

        # 3. Build profile context
        context = await self.build_context(
            user_id=user_id,
            resume_id=roadmap.resume_id,
            target_role=roadmap.target_role
        )

        # 4. Invoke AI Generation
        gen_result = await self.roadmap_ai_service.generate_learning_plan(roadmap, context)
        parsed_data = gen_result["parsed_response"]

        # 5. Clear existing recommendations in DB
        self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap.id).delete()
        self.db.commit()

        # 6. Save new recommendations to learning_recommendations table
        for rec in parsed_data.get("recommendations", []):
            resource_url = rec.get("learning_resources", [None])[0] if rec.get("learning_resources") else None
            RoadmapCRUD.create_learning_recommendation(
                db=self.db,
                roadmap_id=roadmap.id,
                category=rec.get("category", "General"),
                title=rec.get("title", "Resource"),
                priority=rec.get("priority", "MEDIUM"),
                description=rec.get("reason", ""),
                resource_url=resource_url,
                estimated_hours=rec.get("estimated_hours", 0)
            )

        # 7. Persist to DB metadata
        updated_metadata = {
            **metadata,
            "learning_plan": parsed_data,
            "learning_plan_metadata": {
                "provider": gen_result["provider"],
                "model": gen_result["model"],
                "latency_ms": gen_result["latency_ms"],
                "prompt_version": gen_result["prompt_version"],
                "generated_at": datetime.now(timezone.utc).isoformat() + "Z"
            }
        }
        roadmap.roadmap_metadata = updated_metadata
        roadmap.provider = gen_result["provider"]
        roadmap.model = gen_result["model"]
        roadmap.prompt_version = gen_result["prompt_version"]
        
        self.db.commit()
        self.db.refresh(roadmap)

        # Privacy requirements: only log metadata
        logger.info(
            "learning_plan_generation_completed",
            roadmap_id=str(roadmap.id),
            latency_ms=gen_result["latency_ms"],
            provider=gen_result["provider"],
            prompt_version=gen_result["prompt_version"]
        )

        return parsed_data

    async def get_roadmap_recommendations(self, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> List[Dict[str, Any]]:
        """Retrieve detailed learning recommendations for a career roadmap."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            raise ValueError("Career roadmap not found")
        
        metadata = roadmap.roadmap_metadata or {}
        if "learning_plan" in metadata and "recommendations" in metadata["learning_plan"]:
            return metadata["learning_plan"]["recommendations"]
        
        # fallback to database rows if learning_plan metadata is not generated yet
        from app.career_roadmap.models.roadmap import LearningRecommendation
        recs = self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap_id).all()
        result = []
        for r in recs:
            result.append({
                "recommendation_id": 1,  # fallback index
                "title": r.title,
                "category": r.category,
                "priority": r.priority,
                "estimated_hours": r.estimated_hours or 0,
                "difficulty": "Intermediate",
                "reason": r.description or "",
                "learning_resources": [r.resource_url] if r.resource_url else [],
                "practice_projects": [],
                "success_criteria": [],
                "career_impact": "Medium"
            })
        return result

    async def get_roadmap_skill_gap(self, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> Dict[str, Any]:
        """Retrieve skill gap analysis for a career roadmap."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            raise ValueError("Career roadmap not found")
        
        metadata = roadmap.roadmap_metadata or {}
        if "skill_gap_analysis" in metadata:
            return metadata["skill_gap_analysis"]
        
        # Return default empty structure if not generated yet
        return {
            "target_role": roadmap.target_role,
            "readiness_score": roadmap.current_readiness_score,
            "technical_gaps": [],
            "soft_skill_gaps": [],
            "domain_knowledge_gaps": [],
            "tool_gaps": [],
            "framework_gaps": [],
            "communication_gaps": [],
            "confidence_gaps": []
        }

    async def delete_roadmap_recommendations(self, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> bool:
        """Clear/delete recommendations for a roadmap."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            raise ValueError("Career roadmap not found")
        
        from app.career_roadmap.models.roadmap import LearningRecommendation
        self.db.query(LearningRecommendation).filter(LearningRecommendation.roadmap_id == roadmap_id).delete()
        
        # Clear learning plan metadata
        metadata = dict(roadmap.roadmap_metadata or {})
        metadata.pop("learning_plan", None)
        metadata.pop("learning_plan_metadata", None)
        roadmap.roadmap_metadata = metadata
        
        self.db.commit()
        logger.info("learning_recommendations_deleted", roadmap_id=str(roadmap_id), user_id=str(user_id))
        return True

    async def generate_and_save_timeline(
        self,
        user_id: uuid.UUID,
        request: TimelineRequest
    ) -> Dict[str, Any]:
        """Generate and save execution timeline for a roadmap, utilizing DB cache if available."""
        # 1. Resolve roadmap
        if not request.roadmap_id:
            # Look for the latest completed roadmap of this user
            from sqlalchemy import desc
            query = self.db.query(CareerRoadmap).filter(
                CareerRoadmap.user_id == user_id,
                CareerRoadmap.roadmap_status == "COMPLETED"
            )
            if request.target_role:
                query = query.filter(CareerRoadmap.target_role == request.target_role.strip())
            roadmap = query.order_by(desc(CareerRoadmap.created_at)).first()
            if not roadmap:
                raise ValueError("No completed career roadmap found to generate timeline from.")
        else:
            roadmap = RoadmapCRUD.get_roadmap(self.db, request.roadmap_id, user_id)
            if not roadmap:
                raise ValueError("Career roadmap not found")

        # 2. Reject Empty/Incomplete Roadmap
        if roadmap.roadmap_status != "COMPLETED" or not roadmap.milestones:
            raise ValueError("Cannot generate timeline for an empty or incomplete roadmap.")

        # 3. Validate Duration
        duration_months = request.estimated_duration_months or roadmap.estimated_duration_months
        if duration_months not in (3, 6, 12, 18, 24):
            raise ValueError(f"Invalid duration: {duration_months} months. Supported durations: 3, 6, 12, 18, 24 months.")

        # 4. Cache Check: Check if timeline already exists in metadata
        metadata = roadmap.roadmap_metadata or {}
        if "timeline" in metadata:
            logger.info("returning_cached_timeline", roadmap_id=str(roadmap.id))
            timeline_data = dict(metadata["timeline"])
            timeline_data["roadmap_id"] = str(roadmap.id)
            return timeline_data

        # 5. Build profile context
        context = await self.build_context(
            user_id=user_id,
            resume_id=roadmap.resume_id,
            target_role=roadmap.target_role
        )

        # 6. Invoke AI Generation
        # Temporarily update the roadmap's estimated duration if requested duration is different
        original_duration = roadmap.estimated_duration_months
        if request.estimated_duration_months and request.estimated_duration_months != original_duration:
            roadmap.estimated_duration_months = request.estimated_duration_months
            self.db.commit()

        try:
            gen_result = await self.roadmap_ai_service.generate_timeline(roadmap, context)
            parsed_data = dict(gen_result["parsed_response"])
            parsed_data["roadmap_id"] = str(roadmap.id)
        except Exception:
            # Restore original duration if AI generation fails
            if request.estimated_duration_months and request.estimated_duration_months != original_duration:
                roadmap.estimated_duration_months = original_duration
                self.db.commit()
            raise

        # 7. Persist to DB metadata
        from datetime import datetime, timezone
        updated_metadata = {
            **metadata,
            "timeline": parsed_data,
            "timeline_metadata": {
                "provider": gen_result["provider"],
                "model": gen_result["model"],
                "latency_ms": gen_result["latency_ms"],
                "prompt_version": gen_result["prompt_version"],
                "generated_at": datetime.now(timezone.utc).isoformat() + "Z"
            }
        }
        roadmap.roadmap_metadata = updated_metadata
        roadmap.provider = gen_result["provider"]
        roadmap.model = gen_result["model"]
        roadmap.prompt_version = gen_result["prompt_version"]
        
        self.db.commit()
        self.db.refresh(roadmap)

        # Privacy requirements: only log metadata
        logger.info(
            "timeline_generation_completed",
            roadmap_id=str(roadmap.id),
            latency_ms=gen_result["latency_ms"],
            provider=gen_result["provider"],
            prompt_version=gen_result["prompt_version"]
        )

        return parsed_data

    async def get_roadmap_timeline(self, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> Dict[str, Any]:
        """Retrieve detailed timeline for a career roadmap."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            raise ValueError("Career roadmap not found")
        
        metadata = roadmap.roadmap_metadata or {}
        if "timeline" in metadata:
            timeline_data = dict(metadata["timeline"])
            timeline_data["roadmap_id"] = str(roadmap_id)
            return timeline_data
        
        raise ValueError("Timeline not generated for this roadmap.")

    async def delete_roadmap_timeline(self, user_id: uuid.UUID, roadmap_id: uuid.UUID) -> bool:
        """Clear/delete timeline for a roadmap."""
        roadmap = RoadmapCRUD.get_roadmap(self.db, roadmap_id, user_id)
        if not roadmap:
            raise ValueError("Career roadmap not found")
        
        # Clear timeline metadata
        metadata = dict(roadmap.roadmap_metadata or {})
        has_timeline = "timeline" in metadata
        metadata.pop("timeline", None)
        metadata.pop("timeline_metadata", None)
        roadmap.roadmap_metadata = metadata
        
        self.db.commit()
        logger.info("timeline_deleted", roadmap_id=str(roadmap_id), user_id=str(user_id))
        return has_timeline


