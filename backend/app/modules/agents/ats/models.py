# app/modules/agents/ats/models.py

import uuid
from typing import Optional
from pydantic import BaseModel, Field


class ATSReviewRequest(BaseModel):
    """Payload to review a resume from an ATS perspective."""
    resume_id: uuid.UUID
    job_description: Optional[str] = None
    model_override: Optional[str] = None
    bypass_cache: bool = False


class ATSScoreRequest(BaseModel):
    """Payload to score a resume from an ATS perspective."""
    resume_id: uuid.UUID
    model_override: Optional[str] = None
    bypass_cache: bool = False


class ATSImproveRequest(BaseModel):
    """Payload to get ATS optimization and improvement recommendations."""
    resume_id: uuid.UUID
    job_description: Optional[str] = None
    model_override: Optional[str] = None
    bypass_cache: bool = False
