import uuid
import re
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
import structlog
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.career_roadmap.models.roadmap import CareerRoadmap, RoadmapMilestone, LearningRecommendation
from app.models.resume import Resume
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_optimization import AIResumeOptimization
from app.interview.models.interview import InterviewSession
from app.interview.services.analytics import InterviewAnalyticsService
from app.services.ats.ats_service import calculate_ats_score
from app.career_roadmap.services.context import RoadmapContext

logger = structlog.get_logger()


class CareerAnalyticsService:
    """Service layer coordinating career roadmap analytics, readiness scoring, and progress tracking."""

    def __init__(self, db: Session):
        self.db = db

    async def get_roadmap_analytics(self, roadmap_id: uuid.UUID, user_id: uuid.UUID) -> Dict[str, Any]:
        """Fetch and aggregate dashboard metrics for a specific career roadmap."""
        start_time = time.perf_counter()

        # 1. Fetch roadmap
        roadmap = self.db.query(CareerRoadmap).filter(
            CareerRoadmap.id == roadmap_id,
            CareerRoadmap.user_id == user_id
        ).first()

        if not roadmap:
            logger.error("roadmap_not_found_for_analytics", roadmap_id=str(roadmap_id), user_id=str(user_id))
            raise ValueError("Career roadmap not found")

        # 2. Cache Check: Check if analytics are cached and valid
        metadata = roadmap.roadmap_metadata or {}
        cache_data = metadata.get("analytics")
        cache_hit = False

        if cache_data:
            cache_gen_str = metadata.get("analytics_metadata", {}).get("generated_at")
            if cache_gen_str:
                cache_gen = datetime.fromisoformat(cache_gen_str)
                # Invalidate if roadmap or milestones have been updated since cache generation (with 5s tolerance)
                is_dirty = (roadmap.updated_at - cache_gen).total_seconds() > 5.0
                for m in roadmap.milestones:
                    if (m.updated_at - cache_gen).total_seconds() > 5.0:
                        is_dirty = True
                        break
                if not is_dirty:
                    cache_hit = True

        if cache_hit:
            execution_time_ms = (time.perf_counter() - start_time) * 1000.0
            logger.info(
                "career_roadmap_analytics_retrieved",
                roadmap_id=str(roadmap_id),
                analytics_latency=round(execution_time_ms, 2),
                cache_hits=1,
                provider=roadmap.provider,
                execution_time=round(execution_time_ms, 2)
            )
            return cache_data

        # 3. Calculate components
        progress = self.calculate_progress(roadmap)
        # Build context to fetch user profile attributes (resume reviews, interview analytics)
        context = await RoadmapContext.build(
            db=self.db,
            user_id=user_id,
            resume_id=roadmap.resume_id,
            target_role=roadmap.target_role
        )
        readiness = self.calculate_readiness(roadmap, context)
        skills = self.calculate_skill_analytics(roadmap, context)
        timeline = self.calculate_timeline_analytics(roadmap)

        # 4. Generate Overall Metrics
        total_milestones = len(roadmap.milestones)
        completed_milestones = sum(1 for m in roadmap.milestones if m.status == "COMPLETED")
        remaining_milestones = total_milestones - completed_milestones

        # Calculate completed / remaining learning hours
        completed_hours = 0.0
        remaining_hours = 0.0
        for rec in roadmap.recommendations:
            hours = float(rec.estimated_hours or 0.0)
            # Check if this recommendation is mapped to a phase that is completed
            phase_num = self._extract_phase_number(rec.description)
            if phase_num is not None:
                matching_milestone = next((m for m in roadmap.milestones if m.phase_number == phase_num), None)
                if matching_milestone and matching_milestone.status == "COMPLETED":
                    completed_hours += hours
                else:
                    remaining_hours += hours
            else:
                remaining_hours += hours

        # Skill and Certification Progress percentages
        skills_recs = [r for r in roadmap.recommendations if r.category.lower() == "skill"]
        completed_skills = 0
        for s in skills_recs:
            phase_num = self._extract_phase_number(s.description)
            if phase_num is not None:
                m = next((mil for mil in roadmap.milestones if mil.phase_number == phase_num), None)
                if m and m.status == "COMPLETED":
                    completed_skills += 1
        skill_coverage_pct = (completed_skills / len(skills_recs) * 100.0) if skills_recs else 0.0

        certs_recs = [r for r in roadmap.recommendations if r.category.lower() in ("certification", "certifications")]
        completed_certs = 0
        for c in certs_recs:
            phase_num = self._extract_phase_number(c.description)
            if phase_num is not None:
                m = next((mil for mil in roadmap.milestones if mil.phase_number == phase_num), None)
                if m and m.status == "COMPLETED":
                    completed_certs += 1
        cert_progress_pct = (completed_certs / len(certs_recs) * 100.0) if certs_recs else 0.0

        # Estimated Weekly Learning Hours
        total_hours = completed_hours + remaining_hours
        est_duration_weeks = float(roadmap.estimated_duration_months * 4.33)
        avg_weekly_hours = total_hours / est_duration_weeks if est_duration_weeks > 0 else 0.0

        metrics = {
            "overall_progress": progress["completion_percentage"],
            "roadmap_completion_percentage": progress["completion_percentage"],
            "completed_milestones_count": completed_milestones,
            "remaining_milestones_count": remaining_milestones,
            "completed_learning_hours": completed_hours,
            "remaining_learning_hours": remaining_hours,
            "current_readiness_score": readiness["overall_score"],
            "ats_readiness": readiness["breakdown"]["ats_score"],
            "interview_readiness": readiness["breakdown"]["interview_readiness"],
            "github_readiness": readiness["breakdown"]["github_readiness"],
            "skill_coverage_percentage": skill_coverage_pct,
            "certification_progress_percentage": cert_progress_pct,
            "timeline_progress_percentage": progress["completion_percentage"],
            "estimated_remaining_weeks": progress["remaining_weeks"],
            "average_weekly_learning_hours": avg_weekly_hours,
            "current_career_level": roadmap.experience_level,
            "target_career_level": roadmap.experience_level  # Fallback to experience level
        }

        analytics_payload = {
            "roadmap_id": str(roadmap_id),
            "metrics": metrics,
            "progress": progress,
            "readiness": readiness,
            "skills": skills,
            "timeline": timeline
        }

        # 5. Persist to cache
        updated_metadata = {
            **metadata,
            "analytics": analytics_payload,
            "analytics_metadata": {
                "generated_at": (roadmap.updated_at or datetime.utcnow()).isoformat()
            }
        }
        roadmap.roadmap_metadata = updated_metadata
        self.db.commit()

        execution_time_ms = (time.perf_counter() - start_time) * 1000.0
        # Privacy rules: log metadata ONLY
        logger.info(
            "career_roadmap_analytics_generated",
            roadmap_id=str(roadmap_id),
            analytics_latency=round(execution_time_ms, 2),
            cache_hits=0,
            provider=roadmap.provider,
            execution_time=round(execution_time_ms, 2)
        )

        return analytics_payload

    async def get_overall_analytics(self, user_id: uuid.UUID) -> Dict[str, Any]:
        """Aggregate career analytics across all user roadmaps."""
        roadmaps = self.db.query(CareerRoadmap).filter(
            CareerRoadmap.user_id == user_id,
            CareerRoadmap.roadmap_status == "COMPLETED"
        ).all()

        if not roadmaps:
            return {
                "total_roadmaps": 0,
                "completed_roadmaps": 0,
                "average_readiness_score": 0.0,
                "overall_completion_percentage": 0.0,
                "total_completed_milestones": 0,
                "total_learning_hours": 0.0
            }

        total_roadmaps = len(roadmaps)
        total_readiness = 0.0
        total_completion = 0.0
        completed_milestones = 0
        total_hours = 0.0

        for r in roadmaps:
            analytics = await self.get_roadmap_analytics(r.id, user_id)
            total_readiness += analytics["metrics"]["current_readiness_score"]
            total_completion += analytics["metrics"]["roadmap_completion_percentage"]
            completed_milestones += analytics["metrics"]["completed_milestones_count"]
            total_hours += analytics["metrics"]["completed_learning_hours"]

        return {
            "total_roadmaps": total_roadmaps,
            "completed_roadmaps": total_roadmaps,
            "average_readiness_score": round(total_readiness / total_roadmaps, 1),
            "overall_completion_percentage": round(total_completion / total_roadmaps, 1),
            "total_completed_milestones": completed_milestones,
            "total_learning_hours": total_hours
        }

    def calculate_progress(self, roadmap: CareerRoadmap) -> Dict[str, Any]:
        """Compute comprehensive progress metrics including velocity and delay detection."""
        # 1. Completion Percentage
        total_milestones = len(roadmap.milestones)
        completed_milestones = sum(1 for m in roadmap.milestones if m.status == "COMPLETED")
        completion_percentage = (completed_milestones / total_milestones * 100.0) if total_milestones > 0 else 0.0

        # 2. Elapsed Time
        created_at = roadmap.created_at.replace(tzinfo=timezone.utc)
        current_date = datetime.now(timezone.utc)
        elapsed_weeks = max(0.1, (current_date - created_at).days / 7.0)

        # Convert months to weeks
        estimated_duration_weeks = float(roadmap.estimated_duration_months * 4.33)

        # 3. Velocity & Remaining Weeks
        velocity = completion_percentage / elapsed_weeks  # % completed per week
        if completion_percentage >= 100.0:
            remaining_weeks = 0.0
            est_completion_date = roadmap.updated_at.replace(tzinfo=timezone.utc)
        elif velocity > 0:
            remaining_weeks = (100.0 - completion_percentage) / velocity
            est_completion_date = current_date + timedelta(weeks=remaining_weeks)
        else:
            remaining_weeks = max(0.0, estimated_duration_weeks - elapsed_weeks)
            est_completion_date = current_date + timedelta(weeks=remaining_weeks)

        # 4. Delay Detection
        expected_progress = min(100.0, (elapsed_weeks / estimated_duration_weeks * 100.0)) if estimated_duration_weeks > 0 else 100.0
        is_delayed = (completion_percentage < expected_progress) and (elapsed_weeks > 1.0)
        delay_weeks = max(0.0, elapsed_weeks - (completion_percentage / 100.0 * estimated_duration_weeks))

        if not is_delayed:
            delay_severity = "NONE"
        elif delay_weeks > 4:
            delay_severity = "HIGH"
        elif delay_weeks > 2:
            delay_severity = "MEDIUM"
        else:
            delay_severity = "LOW"

        # 5. Weekly/Monthly/Quarterly/Yearly intervals breakdown
        # Try to use timeline milestones bounds if timeline metadata is available
        timeline_meta = roadmap.roadmap_metadata.get("timeline") if roadmap.roadmap_metadata else None
        timeline_milestones = timeline_meta.get("milestones", []) if timeline_meta else []

        weekly_breakdown = {}
        monthly_breakdown = {}
        quarterly_breakdown = {}
        yearly_breakdown = {}

        if timeline_milestones:
            # Build weekly breakdown based on timeline bounds
            for w in range(1, int(estimated_duration_weeks) + 1):
                w_milestones = [m for m in timeline_milestones if m.get("start_week", 1) <= w <= m.get("end_week", 1)]
                total_w = len(w_milestones)
                comp_w = sum(1 for m in w_milestones if m.get("completion_status") == "COMPLETED")
                pct_w = (comp_w / total_w * 100.0) if total_w > 0 else 0.0
                status_w = "COMPLETED" if pct_w == 100.0 and total_w > 0 else "IN_PROGRESS" if pct_w > 0 else "NOT_STARTED"
                weekly_breakdown[w] = {
                    "total_items": total_w,
                    "completed_items": comp_w,
                    "completion_percentage": pct_w,
                    "status": status_w
                }

            # Monthly breakdown (4 weeks per month)
            total_months = int(roadmap.estimated_duration_months)
            for m_idx in range(1, total_months + 1):
                start_w = (m_idx - 1) * 4 + 1
                end_w = m_idx * 4
                m_milestones = [m for m in timeline_milestones if not (m.get("end_week", 1) < start_w or m.get("start_week", 1) > end_w)]
                total_m = len(m_milestones)
                comp_m = sum(1 for m in m_milestones if m.get("completion_status") == "COMPLETED")
                pct_m = (comp_m / total_m * 100.0) if total_m > 0 else 0.0
                status_m = "COMPLETED" if pct_m == 100.0 and total_m > 0 else "IN_PROGRESS" if pct_m > 0 else "NOT_STARTED"
                monthly_breakdown[m_idx] = {
                    "total_items": total_m,
                    "completed_items": comp_m,
                    "completion_percentage": pct_m,
                    "status": status_m
                }

            # Quarterly breakdown
            total_quarters = int((total_months - 1) / 3) + 1
            for q_idx in range(1, total_quarters + 1):
                start_w = (q_idx - 1) * 12 + 1
                end_w = q_idx * 12
                q_milestones = [m for m in timeline_milestones if not (m.get("end_week", 1) < start_w or m.get("start_week", 1) > end_w)]
                total_q = len(q_milestones)
                comp_q = sum(1 for m in q_milestones if m.get("completion_status") == "COMPLETED")
                pct_q = (comp_q / total_q * 100.0) if total_q > 0 else 0.0
                status_q = "COMPLETED" if pct_q == 100.0 and total_q > 0 else "IN_PROGRESS" if pct_q > 0 else "NOT_STARTED"
                quarterly_breakdown[q_idx] = {
                    "total_items": total_q,
                    "completed_items": comp_q,
                    "completion_percentage": pct_q,
                    "status": status_q
                }

            # Yearly breakdown
            total_years = int((total_months - 1) / 12) + 1
            for y_idx in range(1, total_years + 1):
                start_w = (y_idx - 1) * 48 + 1
                end_w = y_idx * 48
                y_milestones = [m for m in timeline_milestones if not (m.get("end_week", 1) < start_w or m.get("start_week", 1) > end_w)]
                total_y = len(y_milestones)
                comp_y = sum(1 for m in y_milestones if m.get("completion_status") == "COMPLETED")
                pct_y = (comp_y / total_y * 100.0) if total_y > 0 else 0.0
                status_y = "COMPLETED" if pct_y == 100.0 and total_y > 0 else "IN_PROGRESS" if pct_y > 0 else "NOT_STARTED"
                yearly_breakdown[y_idx] = {
                    "total_items": total_y,
                    "completed_items": comp_y,
                    "completion_percentage": pct_y,
                    "status": status_y
                }
        else:
            # Fallback: Partition database milestones evenly across the duration
            milestones = sorted(roadmap.milestones, key=lambda mil: mil.phase_number)
            total_m = len(milestones)

            # Weekly fallback (split milestones list into weekly buckets)
            for w in range(1, int(estimated_duration_weeks) + 1):
                m_idx = min(total_m - 1, int((w - 1) / estimated_duration_weeks * total_m)) if total_m > 0 else -1
                m_list = [milestones[m_idx]] if m_idx >= 0 else []
                total_w = len(m_list)
                comp_w = sum(1 for mil in m_list if mil.status == "COMPLETED")
                pct_w = (comp_w / total_w * 100.0) if total_w > 0 else 0.0
                status_w = "COMPLETED" if pct_w == 100.0 and total_w > 0 else "IN_PROGRESS" if pct_w > 0 else "NOT_STARTED"
                weekly_breakdown[w] = {
                    "total_items": total_w,
                    "completed_items": comp_w,
                    "completion_percentage": pct_w,
                    "status": status_w
                }

            # Monthly fallback
            total_months = int(roadmap.estimated_duration_months)
            for m_idx in range(1, total_months + 1):
                start_idx = int((m_idx - 1) / total_months * total_m) if total_months > 0 else 0
                end_idx = max(start_idx + 1, int(m_idx / total_months * total_m)) if total_months > 0 else 0
                m_list = milestones[start_idx:end_idx]
                total_m_items = len(m_list)
                comp_m = sum(1 for mil in m_list if mil.status == "COMPLETED")
                pct_m = (comp_m / total_m_items * 100.0) if total_m_items > 0 else 0.0
                status_m = "COMPLETED" if pct_m == 100.0 and total_m_items > 0 else "IN_PROGRESS" if pct_m > 0 else "NOT_STARTED"
                monthly_breakdown[m_idx] = {
                    "total_items": total_m_items,
                    "completed_items": comp_m,
                    "completion_percentage": pct_m,
                    "status": status_m
                }

            # Quarterly fallback
            total_quarters = int((total_months - 1) / 3) + 1
            for q_idx in range(1, total_quarters + 1):
                start_idx = int((q_idx - 1) / total_quarters * total_m) if total_quarters > 0 else 0
                end_idx = max(start_idx + 1, int(q_idx / total_quarters * total_m)) if total_quarters > 0 else 0
                m_list = milestones[start_idx:end_idx]
                total_q = len(m_list)
                comp_q = sum(1 for mil in m_list if mil.status == "COMPLETED")
                pct_q = (comp_q / total_q * 100.0) if total_q > 0 else 0.0
                status_q = "COMPLETED" if pct_q == 100.0 and total_q > 0 else "IN_PROGRESS" if pct_q > 0 else "NOT_STARTED"
                quarterly_breakdown[q_idx] = {
                    "total_items": total_q,
                    "completed_items": comp_q,
                    "completion_percentage": pct_q,
                    "status": status_q
                }

            # Yearly fallback
            total_years = int((total_months - 1) / 12) + 1
            for y_idx in range(1, total_years + 1):
                start_idx = int((y_idx - 1) / total_years * total_m) if total_years > 0 else 0
                end_idx = max(start_idx + 1, int(y_idx / total_years * total_m)) if total_years > 0 else 0
                m_list = milestones[start_idx:end_idx]
                total_y = len(m_list)
                comp_y = sum(1 for mil in m_list if mil.status == "COMPLETED")
                pct_y = (comp_y / total_y * 100.0) if total_y > 0 else 0.0
                status_y = "COMPLETED" if pct_y == 100.0 and total_y > 0 else "IN_PROGRESS" if pct_y > 0 else "NOT_STARTED"
                yearly_breakdown[y_idx] = {
                    "total_items": total_y,
                    "completed_items": comp_y,
                    "completion_percentage": pct_y,
                    "status": status_y
                }

        return {
            "roadmap_id": str(roadmap.id),
            "completion_percentage": completion_percentage,
            "velocity_percentage_per_week": velocity,
            "expected_progress_percentage": expected_progress,
            "estimated_completion_date": est_completion_date.isoformat(),
            "remaining_weeks": remaining_weeks,
            "delay_status": {
                "is_delayed": is_delayed,
                "delay_weeks": delay_weeks,
                "delay_severity": delay_severity
            },
            "breakdown": {
                "weekly": weekly_breakdown,
                "monthly": monthly_breakdown,
                "quarterly": quarterly_breakdown,
                "yearly": yearly_breakdown
            }
        }

    def calculate_readiness(self, roadmap: CareerRoadmap, context: RoadmapContext) -> Dict[str, Any]:
        """Compute the career readiness score based on resume reviews, optimization, ATS, interviews, skill gaps, and projects."""
        # 1. Resume Review
        review_score = None
        if context.resume_review:
            review_score = float(context.resume_review.review.get("overall_score", 0.0))

        # 2. Resume Optimization
        opt_score = None
        if context.resume_optimization:
            opt_score = float(context.resume_optimization.quality_score.get("overall_score", 0.0))

        # 3. ATS Score
        ats_score = None
        if context.ats_score is not None:
            ats_score = float(context.ats_score)

        # 4. Interview Scores
        interview_score = None
        if context.interview_analytics and context.interview_analytics.get("average_score") is not None:
            interview_score = float(context.interview_analytics["average_score"])

        # 5. Skill Gap Readiness
        skill_gap_score = float(roadmap.current_readiness_score)

        # 6. GitHub Profile Developer Score
        github_score = None
        if context.github_insights:
            dev_score_obj = context.github_insights.get("developer_score") or {}
            if isinstance(dev_score_obj, dict):
                github_score = float(dev_score_obj.get("developer_score", 0.0))
            elif hasattr(dev_score_obj, "developer_score"):
                github_score = float(dev_score_obj.developer_score)

        # 7. Learning Completion
        total_milestones = len(roadmap.milestones)
        completed_milestones = sum(1 for m in roadmap.milestones if m.status == "COMPLETED")
        learning_completion_score = (completed_milestones / total_milestones * 100.0) if total_milestones > 0 else 0.0

        # Calculate Overall readiness as a simple average of available indicators
        scores_list = [
            s for s in [review_score, opt_score, ats_score, interview_score, skill_gap_score, github_score, learning_completion_score]
            if s is not None
        ]
        overall = sum(scores_list) / len(scores_list) if scores_list else 50.0

        # Recommendations based on categories
        recs = []
        if review_score is None:
            recs.append({
                "category": "Resume Review",
                "recommendation": "Review your resume using the AI Resume Reviewer to identify structural errors and phrasing gaps."
            })
        elif review_score < 70.0:
            recs.append({
                "category": "Resume Review",
                "recommendation": "Your resume review score is low. Address formatting and grammar issues found in the latest review."
            })

        if opt_score is None:
            recs.append({
                "category": "Resume Optimization",
                "recommendation": "Optimize your resume for your target role using the Resume Optimizer to tailor keywords."
            })
        elif opt_score < 70.0:
            recs.append({
                "category": "Resume Optimization",
                "recommendation": "Your resume optimization score is low. Tailor your resume descriptions to match target industry criteria."
            })

        if ats_score is None or ats_score < 70.0:
            recs.append({
                "category": "ATS Score",
                "recommendation": "Your resume has a low ATS match rate. Ensure you add missing key skills and use standard headers."
            })

        if interview_score is None:
            recs.append({
                "category": "Interview Readiness",
                "recommendation": "Start an AI mock interview practice session for your target role to build confidence."
            })
        elif interview_score < 70.0:
            recs.append({
                "category": "Interview Readiness",
                "recommendation": "Review the feedback from your recent mock interviews and focus on improving communication and star structure."
            })

        if skill_gap_score < 70.0:
            recs.append({
                "category": "Skill Gap",
                "recommendation": "Focus on acquiring missing technical skills and tools highlighted in the skill gap analysis."
            })

        if github_score is None:
            recs.append({
                "category": "GitHub Profile",
                "recommendation": "Link a GitHub profile and create coding portfolios to demonstrate hands-on experience."
            })
        elif github_score < 70.0:
            recs.append({
                "category": "GitHub Profile",
                "recommendation": "Improve your GitHub developer score by pushing code consistently and writing clear project READMEs."
            })

        if learning_completion_score < 50.0:
            recs.append({
                "category": "Learning Completion",
                "recommendation": "You have completed less than half of your roadmap phases. Focus on completing active milestones."
            })

        return {
            "overall_score": round(overall, 1),
            "breakdown": {
                "resume_review": review_score,
                "resume_optimization": opt_score,
                "ats_score": ats_score,
                "interview_readiness": interview_score,
                "skill_gap": skill_gap_score,
                "github_readiness": github_score,
                "learning_completion": learning_completion_score
            },
            "recommendations": recs
        }

    def calculate_skill_analytics(self, roadmap: CareerRoadmap, context: RoadmapContext) -> Dict[str, Any]:
        """Compile detailed statistics on completed, remaining, missing, and strong skills."""
        # 1. Fetch skills from generated roadmap phases
        skills_completed = []
        skills_remaining = []
        skills_in_progress = []
        difficulty_distribution = {"Beginner": 0, "Intermediate": 0, "Advanced": 0}
        category_distribution = {"Technical": 0, "Soft Skills": 0, "Frameworks": 0, "Tools": 0, "Domain Knowledge": 0}

        # Retrieve skill recommendations
        skills_recs = [r for r in roadmap.recommendations if r.category.lower() == "skill"]
        
        # Categorize and assign status
        for s in skills_recs:
            # Status matching based on phase milestone
            phase_num = self._extract_phase_number(s.description)
            status = "NOT_STARTED"
            diff = "Intermediate"
            
            if phase_num is not None:
                m = next((mil for mil in roadmap.milestones if mil.phase_number == phase_num), None)
                if m:
                    status = m.status
                    # Parse difficulty from milestone description if available
                    if m.description:
                        for key in difficulty_distribution.keys():
                            if key.lower() in m.description.lower():
                                diff = key
                                break

            # Populate lists
            if status == "COMPLETED":
                skills_completed.append(s.title)
            elif status == "IN_PROGRESS":
                skills_in_progress.append(s.title)
            else:
                skills_remaining.append(s.title)

            # Difficulty tally
            difficulty_distribution[diff] = difficulty_distribution.get(diff, 0) + 1

            # Category matching
            cat = "Technical"
            skill_gap_meta = roadmap.roadmap_metadata.get("skill_gap_analysis") if roadmap.roadmap_metadata else None
            if skill_gap_meta:
                if any(s.title.lower() == item.get("skill", "").lower() for item in skill_gap_meta.get("framework_gaps", [])):
                    cat = "Frameworks"
                elif any(s.title.lower() == item.get("skill", "").lower() for item in skill_gap_meta.get("tool_gaps", [])):
                    cat = "Tools"
                elif any(s.title.lower() == item.get("skill", "").lower() for item in skill_gap_meta.get("soft_skill_gaps", [])):
                    cat = "Soft Skills"
                elif any(s.title.lower() == item.get("skill", "").lower() for item in skill_gap_meta.get("domain_knowledge_gaps", [])):
                    cat = "Domain Knowledge"

            category_distribution[cat] = category_distribution.get(cat, 0) + 1

        # 2. Extract Top Missing Skills from Skill Gap Analysis
        top_missing_skills = []
        skill_gap_meta = roadmap.roadmap_metadata.get("skill_gap_analysis") if roadmap.roadmap_metadata else None
        if skill_gap_meta:
            gaps = (
                skill_gap_meta.get("technical_gaps", []) +
                skill_gap_meta.get("framework_gaps", []) +
                skill_gap_meta.get("tool_gaps", []) +
                skill_gap_meta.get("domain_knowledge_gaps", [])
            )
            # Filter high/medium gaps
            filtered_gaps = [g for g in gaps if g.get("gap_severity", "").upper() in ("HIGH", "MEDIUM")]
            top_missing_skills = [g.get("skill") for g in filtered_gaps if g.get("skill")]
            top_missing_skills = top_missing_skills[:5]

        # 3. Extract Top Strong Skills from Resume
        top_strong_skills = []
        if context.resume and context.resume.parsed_data:
            top_strong_skills = context.resume.parsed_data.get("skills", [])
            if isinstance(top_strong_skills, dict):
                flat = []
                for lst in top_strong_skills.values():
                    if isinstance(lst, list):
                        flat.extend(lst)
                top_strong_skills = flat
            top_strong_skills = [str(s) for s in top_strong_skills][:8]

        # 4. Learning Velocity (skills completed per week)
        created_at = roadmap.created_at.replace(tzinfo=timezone.utc)
        elapsed_weeks = max(0.1, (datetime.now(timezone.utc) - created_at).days / 7.0)
        velocity = len(skills_completed) / elapsed_weeks

        return {
            "roadmap_id": str(roadmap.id),
            "skills_completed": list(set(skills_completed)),
            "skills_remaining": list(set(skills_remaining)),
            "skills_in_progress": list(set(skills_in_progress)),
            "top_missing_skills": list(set(top_missing_skills)),
            "top_strong_skills": list(set(top_strong_skills)),
            "learning_velocity_skills_per_week": round(velocity, 2),
            "difficulty_distribution": difficulty_distribution,
            "category_distribution": category_distribution
        }

    def calculate_timeline_analytics(self, roadmap: CareerRoadmap) -> Dict[str, Any]:
        """Calculate overdue milestones, upcoming phases, and overall schedule health."""
        # 1. Timeline stats
        upcoming_milestones = []
        overdue_milestones = []
        completed_milestones = []

        # Current Week & Month
        created_at = roadmap.created_at.replace(tzinfo=timezone.utc)
        current_date = datetime.now(timezone.utc)
        elapsed_days = (current_date - created_at).days
        current_week = (elapsed_days // 7) + 1
        current_month = (elapsed_days // 30) + 1

        # Check for timeline in metadata
        timeline_meta = roadmap.roadmap_metadata.get("timeline") if roadmap.roadmap_metadata else None
        timeline_mils = timeline_meta.get("milestones", []) if timeline_meta else []

        # Estimated duration in weeks
        est_duration_weeks = float(roadmap.estimated_duration_months * 4.33)

        # Expected completion date
        expected_completion_date = created_at + timedelta(weeks=est_duration_weeks)

        for m in sorted(roadmap.milestones, key=lambda mil: mil.phase_number):
            # Serialize milestone
            m_dict = {
                "id": str(m.id),
                "roadmap_id": str(m.roadmap_id),
                "phase_number": m.phase_number,
                "title": m.title,
                "description": m.description,
                "duration": m.duration,
                "order_index": m.order_index,
                "status": m.status,
                "created_at": m.created_at.isoformat() if m.created_at else current_date.isoformat(),
                "updated_at": m.updated_at.isoformat() if m.updated_at else current_date.isoformat()
            }

            if m.status == "COMPLETED":
                completed_milestones.append(m_dict)
            else:
                overdue = False
                if timeline_mils:
                    matching_t_mil = next((tm for tm in timeline_mils if tm.get("title", "").lower() in m.title.lower() or m.title.lower() in tm.get("title", "").lower()), None)
                    if matching_t_mil:
                        end_week = matching_t_mil.get("end_week", 0)
                        if current_week > end_week:
                            overdue = True
                else:
                    total_phases = len(roadmap.milestones)
                    weeks_per_phase = est_duration_weeks / total_phases if total_phases > 0 else est_duration_weeks
                    expected_end_week = m.phase_number * weeks_per_phase
                    if current_week > expected_end_week:
                        overdue = True

                if overdue:
                    overdue_milestones.append(m_dict)
                else:
                    upcoming_milestones.append(m_dict)

        # 2. Timeline Health
        if overdue_milestones:
            timeline_health = "BEHIND_SCHEDULE"
        elif len(upcoming_milestones) > 0 and current_week > (est_duration_weeks * 0.75):
            timeline_health = "AT_RISK"
        else:
            timeline_health = "HEALTHY"

        return {
            "roadmap_id": str(roadmap.id),
            "upcoming_milestones": upcoming_milestones,
            "overdue_milestones": overdue_milestones,
            "completed_milestones": completed_milestones,
            "current_week": current_week,
            "current_month": current_month,
            "expected_completion_date": expected_completion_date.isoformat(),
            "timeline_health": timeline_health
        }

    def _extract_phase_number(self, text: Optional[str]) -> Optional[int]:
        """Extract Phase number from text (e.g. 'Recommended skill for Phase 1...')."""
        if not text:
            return None
        match = re.search(r"Phase\s+(\d+)", text, re.IGNORECASE)
        if match:
            return int(match.group(1))
        return None
