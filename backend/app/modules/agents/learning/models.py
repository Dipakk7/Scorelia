# app/modules/agents/learning/models.py

import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class LearningRecommendRequest(BaseModel):
    resume_id: Optional[uuid.UUID] = Field(None, description="Optional resume ID for context.")
    target_role: str = Field(..., min_length=1, description="Target career role.")
    skills: Optional[List[str]] = Field(None, description="Optional list of active skills.")
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class LearningPathRequest(BaseModel):
    resume_id: Optional[uuid.UUID] = Field(None, description="Optional resume ID for context.")
    target_role: str = Field(..., min_length=1, description="Target career role.")
    preferences: Optional[Dict[str, Any]] = Field(None, description="Optional learning preferences.")
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class LearningCoursesRequest(BaseModel):
    query: Optional[str] = Field(None, description="Search term for Course Knowledge Base.")
    skills: Optional[List[str]] = Field(None, description="Target skills for course search.")
    target_role: Optional[str] = Field(None, description="Target career role.")
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class LearningCertificationsRequest(BaseModel):
    target_role: str = Field(..., min_length=1, description="Target career role.")
    skills: Optional[List[str]] = Field(None, description="Optional skills list.")
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class LearningStudyPlanRequest(BaseModel):
    target_role: str = Field(..., min_length=1, description="Target career role.")
    hours_per_week: Optional[int] = Field(10, description="Hours per week to study.", ge=1, le=100)
    duration_weeks: Optional[int] = Field(4, description="Duration of study plan in weeks.", ge=1, le=52)
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")
