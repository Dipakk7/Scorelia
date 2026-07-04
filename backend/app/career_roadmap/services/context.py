import uuid
import re
import structlog
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.resume import Resume
from app.core.enums import ResumeStatus
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_rewrite import AIResumeRewrite
from app.models.ai_resume_optimization import AIResumeOptimization
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.interview.models.interview import InterviewSession
from app.interview.services.analytics import InterviewAnalyticsService
from app.services.ats.ats_service import calculate_ats_score
from app.services.parser.parser_service import parse_resume
from app.services.job_match.history import get_recent_matches
from app.analytics.service import analytics_service
from app.career_roadmap.metrics import roadmap_metrics

logger = structlog.get_logger()

class RoadmapContext:
    """Consolidated context containing resume, reviews, rewrites, optimizations, ATS, Job Match, Cover Letter, Interview Analytics, and GitHub Insights information for Roadmap generation."""

    def __init__(
        self,
        resume: Optional[Resume] = None,
        ats_score: Optional[int] = None,
        job_match: Optional[Dict[str, Any]] = None,
        skill_gap: Optional[Dict[str, Any]] = None,
        cover_letter: Optional[AICoverLetter] = None,
        resume_review: Optional[AIResumeReview] = None,
        resume_rewrite: Optional[AIResumeRewrite] = None,
        resume_optimization: Optional[AIResumeOptimization] = None,
        interview_analytics: Optional[Dict[str, Any]] = None,
        github_insights: Optional[Dict[str, Any]] = None,
        target_role: Optional[str] = None,
        current_role: Optional[str] = None,
        experience_level: Optional[str] = None,
        preferred_industry: Optional[str] = None,
        context_version: str = "1.0.0",
        generated_at: Optional[str] = None
    ):
        self.resume = resume
        self.ats_score = ats_score
        self.job_match = job_match
        self.skill_gap = skill_gap
        self.cover_letter = cover_letter
        self.resume_review = resume_review
        self.resume_rewrite = resume_rewrite
        self.resume_optimization = resume_optimization
        self.interview_analytics = interview_analytics
        self.github_insights = github_insights
        self.target_role = target_role
        self.current_role = current_role
        self.experience_level = experience_level
        self.preferred_industry = preferred_industry
        self.context_version = context_version
        from datetime import datetime, timezone
        self.generated_at = generated_at or datetime.now(timezone.utc).isoformat() + "Z"

    @classmethod
    async def build(
        cls,
        db: Session,
        user_id: uuid.UUID,
        resume_id: Optional[uuid.UUID] = None,
        target_role: Optional[str] = None,
        current_role: Optional[str] = None,
        experience_level: Optional[str] = None,
        preferred_industry: Optional[str] = None
    ) -> "RoadmapContext":
        """Build the full context by querying database models and history caches, handling missing data gracefully."""
        resume = None
        ats_score = None
        job_match = None
        skill_gap = None
        cover_letter = None
        resume_review = None
        resume_rewrite = None
        resume_optimization = None
        interview_analytics = None
        github_insights = None

        if resume_id:
            try:
                # 1. Fetch resume
                resume = db.query(Resume).filter(
                    Resume.id == resume_id,
                    Resume.user_id == user_id
                ).first()

                if resume:
                    # 2. Parse if not already parsed
                    if resume.status != ResumeStatus.PARSED:
                        try:
                            parse_resume(db, resume_id)
                            db.refresh(resume)
                        except Exception as parse_err:
                            logger.warning("roadmap_context_resume_parsing_failed", resume_id=str(resume_id), error=str(parse_err))

                    # 3. Retrieve or calculate ATS score
                    if resume.ats_score is not None:
                        ats_score = resume.ats_score
                    else:
                        try:
                            ats_response = calculate_ats_score(resume)
                            ats_score = ats_response.overall_score
                            db.commit()
                        except Exception as ats_err:
                            logger.warning("roadmap_context_ats_calculation_failed", resume_id=str(resume_id), error=str(ats_err))
                            ats_score = getattr(resume, "ats_score", None)

                    # 4. Fetch recent job matches
                    recent_matches = get_recent_matches(resume.id)
                    if recent_matches:
                        matched_record = None
                        if target_role:
                            # Try to match the target role in recent matches
                            for record in recent_matches:
                                if record.get("job_title", "").lower() == target_role.lower():
                                    matched_record = record
                                    break
                        if not matched_record:
                            matched_record = recent_matches[0]

                        job_match = {
                            "overall_score": matched_record.get("overall_score"),
                            "grade": matched_record.get("grade"),
                            "job_title": matched_record.get("job_title"),
                            "company": matched_record.get("company")
                        }

                        skill_gap = {
                            "missing_skills": matched_record.get("missing_skills", []),
                            "recommendations": matched_record.get("recommendations", [])
                        }

                    # 5. Fetch latest cover letter
                    cover_letter = db.query(AICoverLetter).filter(
                        AICoverLetter.user_id == user_id,
                        AICoverLetter.resume_id == resume_id
                    ).order_by(desc(AICoverLetter.created_at)).first()

                    # 6. Fetch latest resume review, rewrite, and optimization
                    resume_review = db.query(AIResumeReview).filter(
                        AIResumeReview.user_id == user_id,
                        AIResumeReview.resume_id == resume_id
                    ).order_by(desc(AIResumeReview.created_at)).first()

                    resume_rewrite = db.query(AIResumeRewrite).filter(
                        AIResumeRewrite.user_id == user_id,
                        AIResumeRewrite.resume_id == resume_id
                    ).order_by(desc(AIResumeRewrite.created_at)).first()

                    resume_optimization = db.query(AIResumeOptimization).filter(
                        AIResumeOptimization.user_id == user_id,
                        AIResumeOptimization.resume_id == resume_id
                    ).order_by(desc(AIResumeOptimization.created_at)).first()

                    # 7. Extract GitHub username and fetch insights
                    github_username = None
                    parsed_data = resume.parsed_data or {}
                    links = []
                    if "data" in parsed_data and "links" in parsed_data["data"]:
                        links = parsed_data["data"]["links"].get("value", [])
                    elif "links" in parsed_data:
                        links = parsed_data["links"]

                    for link in links:
                        if "github.com" in link.lower():
                            match = re.search(r"github\.com/([^/]+)", link, re.IGNORECASE)
                            if match:
                                github_username = match.group(1)
                                break
                    
                    if github_username:
                        try:
                            # Try to retrieve insights from the global service
                            insights_data, _ = await analytics_service.get_github_repository_insights(github_username)
                            github_insights = insights_data
                        except Exception as e:
                            logger.warning("roadmap_context_github_insights_failed", username=github_username, error=str(e))

            except Exception as context_err:
                logger.error("roadmap_context_resume_assembly_failed", user_id=str(user_id), error=str(context_err))

        # 8. Fetch Interview Sessions & Analytics
        try:
            sessions = db.query(InterviewSession).filter(
                InterviewSession.user_id == user_id
            ).all()

            if sessions:
                analytics_service_inst = InterviewAnalyticsService(db=db, interview_service=None)
                completed_sessions = [s for s in sessions if s.status == "COMPLETED"]
                
                session_summaries = []
                total_score_sum = 0
                completed_count = 0

                for s in sessions:
                    sum_dict = {
                        "session_id": str(s.id),
                        "target_role": s.target_role,
                        "company_name": s.company_name,
                        "interview_type": s.interview_type,
                        "difficulty": s.difficulty,
                        "status": s.status,
                        "created_at": s.created_at.isoformat()
                    }
                    if s.status == "COMPLETED":
                        try:
                            report = analytics_service_inst.calculate_session_analytics(s)
                            sum_dict["overall_score"] = report.overall_score
                            total_score_sum += report.overall_score
                            completed_count += 1
                            sum_dict["strengths"] = report.skill_gap_analysis.strong_skills
                            sum_dict["weaknesses"] = report.skill_gap_analysis.weak_skills
                        except Exception as s_err:
                            logger.warning("roadmap_context_session_analytics_failed", session_id=str(s.id), error=str(s_err))
                    session_summaries.append(sum_dict)

                interview_analytics = {
                    "total_sessions": len(sessions),
                    "completed_sessions": completed_count,
                    "average_score": round(total_score_sum / completed_count, 1) if completed_count > 0 else None,
                    "sessions": session_summaries
                }
        except Exception as interview_err:
            logger.warning("roadmap_context_interview_analytics_failed", user_id=str(user_id), error=str(interview_err))

        # Record metrics (excluding AI call metrics)
        roadmap_metrics.record_context_built(str(user_id))

        return cls(
            resume=resume,
            ats_score=ats_score,
            job_match=job_match,
            skill_gap=skill_gap,
            cover_letter=cover_letter,
            resume_review=resume_review,
            resume_rewrite=resume_rewrite,
            resume_optimization=resume_optimization,
            interview_analytics=interview_analytics,
            github_insights=github_insights,
            target_role=target_role,
            current_role=current_role,
            experience_level=experience_level,
            preferred_industry=preferred_industry
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert the assembled context into a clean serializable dictionary."""
        return {
            "resume_id": str(self.resume.id) if self.resume else None,
            "resume_parsed_data": self.resume.parsed_data if self.resume else None,
            "ats_score": self.ats_score,
            "job_match": self.job_match,
            "skill_gap": self.skill_gap,
            "cover_letter": {
                "id": str(self.cover_letter.id),
                "company_name": self.cover_letter.company_name,
                "job_title": self.cover_letter.job_title,
                "generated_content": self.cover_letter.generated_content
            } if self.cover_letter else None,
            "resume_review": {
                "id": str(self.resume_review.id),
                "review": self.resume_review.review,
                "provider": self.resume_review.provider,
                "model": self.resume_review.model
            } if self.resume_review else None,
            "resume_rewrite": {
                "id": str(self.resume_rewrite.id),
                "original_content": self.resume_rewrite.original_content,
                "rewritten_content": self.resume_rewrite.rewritten_content,
                "rewrite_mode": self.resume_rewrite.rewrite_mode
            } if self.resume_rewrite else None,
            "resume_optimization": {
                "id": str(self.resume_optimization.id),
                "optimization_result": self.resume_optimization.optimization_result,
                "quality_score": self.resume_optimization.quality_score
            } if self.resume_optimization else None,
            "interview_analytics": self.interview_analytics,
            "github_insights": {
                "profile": self.github_insights.get("profile") if self.github_insights else None,
                "score_breakdown": self.github_insights.get("score_breakdown") if self.github_insights else None
            } if self.github_insights else None,
            "target_role": self.target_role,
            "current_role": self.current_role,
            "experience_level": self.experience_level,
            "preferred_industry": self.preferred_industry,
            "context_version": self.context_version,
            "generated_at": self.generated_at
        }
