# app/modules/agents/resume/models.py

import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ResumeReviewRequest(BaseModel):
    resume_id: uuid.UUID = Field(..., description="The unique identifier of the resume to review.")
    mode: str = Field("STANDARD", description="Review mode: FAST, STANDARD, or DETAILED.")
    language: str = Field("en", description="Target language of the review feedback.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass database caching.")

class ResumeRewriteRequest(BaseModel):
    resume_id: uuid.UUID = Field(..., description="The unique identifier of the resume to rewrite.")
    mode: str = Field("STANDARD", description="Rewrite mode: STANDARD, PROFESSIONAL, CONCISE, etc.")
    section_name: Optional[str] = Field(None, description="Specific resume section to rewrite.")
    job_description: Optional[str] = Field(None, description="Optional target job description to tailor the rewrite.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass database caching.")

class ResumeOptimizeRequest(BaseModel):
    resume_id: uuid.UUID = Field(..., description="The unique identifier of the resume to optimize.")
    job_description: Optional[str] = Field(None, description="Optional target job description to match against.")
    mode: str = Field("STANDARD", description="Optimization mode: STANDARD, etc.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass database caching.")

class ResumeSummaryRequest(BaseModel):
    resume_id: uuid.UUID = Field(..., description="The unique identifier of the resume to summarize.")
    model_override: Optional[str] = Field(None, description="Optional LLM model override.")
    bypass_cache: bool = Field(False, description="Whether to bypass database caching.")

class ResumeSummaryResponse(BaseModel):
    professional_summary: str = Field(..., description="Comprehensive professional summary of the candidate.")
    years_of_experience: float = Field(..., description="Calculated years of experience based on resume dates.")
    key_expertise: List[str] = Field(..., description="List of core areas of expertise or skills.")
    education_summary: str = Field(..., description="Summary of highest degree, major, and school.")
    recent_job_title: str = Field(..., description="Most recent job title held by the candidate.")
    industry: str = Field(..., description="Candidate's primary industry alignment.")
    confidence_score: float = Field(..., description="AI confidence score for the extraction (0.0 to 1.0).")
