import uuid
import structlog
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.resume import Resume
from app.core.enums import ResumeStatus
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_rewrite import AIResumeRewrite
from app.models.ai_resume_optimization import AIResumeOptimization
from app.cover_letter.models.ai_cover_letter import AICoverLetter
from app.services.ats.ats_service import calculate_ats_score
from app.services.parser.parser_service import parse_resume
from app.services.job_match.history import get_recent_matches

logger = structlog.get_logger()

class InterviewContext:
    """Consolidated context containing resume, reviews, rewrites, optimizations, ATS, Job Match, Skill Gap, and Cover Letter information."""

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
        company: Optional[str] = None,
        target_role: Optional[str] = None
    ):
        self.resume = resume
        self.ats_score = ats_score
        self.job_match = job_match
        self.skill_gap = skill_gap
        self.cover_letter = cover_letter
        self.resume_review = resume_review
        self.resume_rewrite = resume_rewrite
        self.resume_optimization = resume_optimization
        self.company = company
        self.target_role = target_role

    @classmethod
    async def build(
        cls,
        db: Session,
        user_id: uuid.UUID,
        resume_id: Optional[uuid.UUID] = None,
        job_id: Optional[uuid.UUID] = None
    ) -> "InterviewContext":
        """Build the full context by querying database models and history caches, handling missing data gracefully."""
        resume = None
        ats_score = None
        job_match = None
        skill_gap = None
        cover_letter = None
        resume_review = None
        resume_rewrite = None
        resume_optimization = None
        company = None
        target_role = None

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
                            logger.warning("interview_context_resume_parsing_failed", resume_id=str(resume_id), error=str(parse_err))

                    # 3. Retrieve or calculate ATS score
                    if resume.ats_score is not None:
                        ats_score = resume.ats_score
                    else:
                        try:
                            ats_response = calculate_ats_score(resume)
                            ats_score = ats_response.overall_score
                            db.commit()
                        except Exception as ats_err:
                            logger.warning("interview_context_ats_calculation_failed", resume_id=str(resume_id), error=str(ats_err))
                            ats_score = getattr(resume, "ats_score", None)

                    # 4. Fetch recent job matches and extract matching job_id details
                    recent_matches = get_recent_matches(resume.id)
                    if recent_matches:
                        # If a specific job_id is requested, find it in history
                        matched_record = None
                        if job_id:
                            for record in recent_matches:
                                if record.get("job_id") == str(job_id) or record.get("resume_id") == str(resume_id):
                                    matched_record = record
                                    break
                        
                        # Fallback to the latest match if no specific matched record found
                        if not matched_record:
                            matched_record = recent_matches[0]

                        job_match = {
                            "overall_score": matched_record.get("overall_score"),
                            "grade": matched_record.get("grade"),
                            "job_title": matched_record.get("job_title"),
                            "company": matched_record.get("company")
                        }

                        # Skill Gap extracted from matched record's missing skills
                        skill_gap = {
                            "missing_skills": matched_record.get("missing_skills", []),
                            "recommendations": matched_record.get("recommendations", [])
                        }

                        # Populate company and target_role from job match
                        company = job_match.get("company")
                        target_role = job_match.get("job_title")

                    # 5. Fetch latest cover letter for the resume
                    cover_letter = db.query(AICoverLetter).filter(
                        AICoverLetter.user_id == user_id,
                        AICoverLetter.resume_id == resume_id
                    ).order_by(desc(AICoverLetter.created_at)).first()

                    if cover_letter:
                        company = company or cover_letter.company_name
                        target_role = target_role or cover_letter.job_title

                    # 6. Fetch latest resume review
                    resume_review = db.query(AIResumeReview).filter(
                        AIResumeReview.user_id == user_id,
                        AIResumeReview.resume_id == resume_id
                    ).order_by(desc(AIResumeReview.created_at)).first()

                    # 7. Fetch latest resume rewrite
                    resume_rewrite = db.query(AIResumeRewrite).filter(
                        AIResumeRewrite.user_id == user_id,
                        AIResumeRewrite.resume_id == resume_id
                    ).order_by(desc(AIResumeRewrite.created_at)).first()

                    # 8. Fetch latest resume optimization
                    resume_optimization = db.query(AIResumeOptimization).filter(
                        AIResumeOptimization.user_id == user_id,
                        AIResumeOptimization.resume_id == resume_id
                    ).order_by(desc(AIResumeOptimization.created_at)).first()

            except Exception as context_err:
                logger.error("interview_context_assembly_failed", user_id=str(user_id), error=str(context_err))

        return cls(
            resume=resume,
            ats_score=ats_score,
            job_match=job_match,
            skill_gap=skill_gap,
            cover_letter=cover_letter,
            resume_review=resume_review,
            resume_rewrite=resume_rewrite,
            resume_optimization=resume_optimization,
            company=company,
            target_role=target_role
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
            "company": self.company,
            "target_role": self.target_role
        }
