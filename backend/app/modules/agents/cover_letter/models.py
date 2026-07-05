# app/modules/agents/cover_letter/models.py

import uuid
from typing import Optional
from pydantic import BaseModel, Field

class CoverLetterAgentGenerateRequest(BaseModel):
    resume_id: uuid.UUID = Field(..., description="The unique identifier of the resume to use.")
    company_name: str = Field(..., min_length=1, max_length=100, description="The name of the company.")
    job_title: str = Field(..., min_length=1, max_length=100, description="The target job title.")
    job_description: Optional[str] = Field(None, description="The target job description text.")
    writing_style: Optional[str] = Field("PROFESSIONAL", description="Target writing style (e.g. PROFESSIONAL, STARTUP).")
    generation_mode: Optional[str] = Field("STANDARD", description="Generation mode: FAST, STANDARD, or DETAILED.")
    experience_level: Optional[str] = Field("EXPERIENCED", description="Experience level: INTERNSHIP, FRESHER, EXPERIENCED, etc.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass cache.")

class CoverLetterAgentReviewRequest(BaseModel):
    cover_letter_id: uuid.UUID = Field(..., description="The unique identifier of the cover letter to review.")
    job_description: Optional[str] = Field(None, description="Optional target job description to match against.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass database caching.")

class CoverLetterAgentRewriteRequest(BaseModel):
    cover_letter_id: uuid.UUID = Field(..., description="The unique identifier of the cover letter to rewrite.")
    instructions: str = Field(..., min_length=1, description="Instructions specifying how to rewrite the cover letter.")
    job_description: Optional[str] = Field(None, description="Optional target job description.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass database caching.")
