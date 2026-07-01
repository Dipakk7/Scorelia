import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.resume import Resume
from app.core.enums import ResumeStatus
from app.models.ai_resume_review import AIResumeReview
from app.models.ai_resume_rewrite import AIResumeRewrite
from app.models.ai_resume_optimization import AIResumeOptimization
from app.services.ats.ats_service import calculate_ats_score
from app.services.parser.parser_service import parse_resume

class CoverLetterContext:
    """Consolidated context representing all inputs, previous stages, and metadata for cover letter generation."""

    def __init__(
        self,
        resume: Resume,
        resume_review: Optional[AIResumeReview] = None,
        resume_rewrite: Optional[AIResumeRewrite] = None,
        resume_optimization: Optional[AIResumeOptimization] = None,
        ats_score: Optional[int] = None,
        job_description: Optional[str] = None,
        company_name: Optional[str] = None,
        role: Optional[str] = None,
        prompt_metadata: Optional[Dict[str, Any]] = None,
        interview_context: Optional[Dict[str, Any]] = None,
    ):
        self.resume = resume
        self.resume_review = resume_review
        self.resume_rewrite = resume_rewrite
        self.resume_optimization = resume_optimization
        self.ats_score = ats_score
        self.job_description = job_description
        self.company_name = company_name
        self.role = role
        self.prompt_metadata = prompt_metadata or {}
        self.interview_context = interview_context or {}

    @classmethod
    async def build(
        cls,
        db: Session,
        resume_id: uuid.UUID,
        user_id: uuid.UUID,
        company_name: str,
        job_title: str,
        job_description: Optional[str] = None,
        prompt_metadata: Optional[Dict[str, Any]] = None,
        interview_context: Optional[Dict[str, Any]] = None,
        ats_score: Optional[int] = None,
    ) -> "CoverLetterContext":
        """Build the full context by querying database models and reusing existing parser/ATS services."""
        # 1. Fetch resume
        resume = db.query(Resume).filter(
            Resume.id == resume_id,
            Resume.user_id == user_id
        ).first()

        if not resume:
            raise ValueError(f"Resume with ID '{resume_id}' not found.")

        # 2. Parse resume if not already parsed (Reuse existing parsing)
        if resume.status != ResumeStatus.PARSED:
            parse_resume(db, resume_id)
            db.refresh(resume)

        # 3. Retrieve latest Review
        resume_review = db.query(AIResumeReview).filter(
            AIResumeReview.resume_id == resume_id,
            AIResumeReview.user_id == user_id
        ).order_by(desc(AIResumeReview.created_at)).first()

        # 4. Retrieve latest Rewrite
        resume_rewrite = db.query(AIResumeRewrite).filter(
            AIResumeRewrite.resume_id == resume_id,
            AIResumeRewrite.user_id == user_id
        ).order_by(desc(AIResumeRewrite.created_at)).first()

        # 5. Retrieve latest Optimization
        resume_optimization = db.query(AIResumeOptimization).filter(
            AIResumeOptimization.resume_id == resume_id,
            AIResumeOptimization.user_id == user_id
        ).order_by(desc(AIResumeOptimization.created_at)).first()

        # 6. Calculate ATS score if not provided
        if ats_score is None:
            try:
                ats_response = calculate_ats_score(resume)
                ats_score = ats_response.overall_score
                db.commit()
            except Exception:
                ats_score = getattr(resume, "ats_score", None)

        return cls(
            resume=resume,
            resume_review=resume_review,
            resume_rewrite=resume_rewrite,
            resume_optimization=resume_optimization,
            ats_score=ats_score,
            job_description=job_description,
            company_name=company_name,
            role=job_title,
            prompt_metadata=prompt_metadata,
            interview_context=interview_context
        )

    def to_variables(self) -> Dict[str, Any]:
        """Convert the context to variables passed to the Jinja prompt templates."""
        return {
            "resume": self.resume.parsed_data if self.resume.parsed_data else {},
            "resume_review": self.resume_review.review if self.resume_review else None,
            "resume_rewrite": self.resume_rewrite.rewritten_content if self.resume_rewrite else None,
            "resume_optimization": self.resume_optimization.optimization_result if self.resume_optimization else None,
            "ats_score": self.ats_score,
            "job_description": self.job_description,
            "company_name": self.company_name,
            "role": self.role,
            "prompt_metadata": self.prompt_metadata,
            "interview_context": self.interview_context
        }
