# app/modules/agents/job/models.py

import uuid
from typing import Optional
from pydantic import BaseModel, Field


class JobMatchRequest(BaseModel):
    """Payload to calculate job match score, grade, and details."""
    resume_id: uuid.UUID
    job_description: str
    model_override: Optional[str] = None
    bypass_cache: bool = False


class JobAnalyzeRequest(BaseModel):
    """Payload to run a detailed job gap analysis and resume vs JD comparison."""
    resume_id: uuid.UUID
    job_description: str
    model_override: Optional[str] = None
    bypass_cache: bool = False


class JobRecommendRequest(BaseModel):
    """Payload to request job or optimization recommendations based on resume content."""
    resume_id: uuid.UUID
    job_description: Optional[str] = None
    model_override: Optional[str] = None
    bypass_cache: bool = False
