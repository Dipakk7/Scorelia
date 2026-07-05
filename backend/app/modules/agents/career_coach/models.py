# app/modules/agents/career_coach/models.py

import uuid
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class CareerCoachRoadmapRequest(BaseModel):
    resume_id: Optional[uuid.UUID] = Field(None, description="Optional resume ID for experience mapping.")
    target_role: str = Field(..., min_length=1, description="Target career role.")
    current_role: Optional[str] = Field(None, description="Current job role.")
    experience_level: str = Field(..., description="Target experience level (e.g. ENTRY, MID, SENIOR).")
    target_industry: Optional[str] = Field(None, description="Target industry segment.")
    estimated_duration_months: Optional[int] = Field(12, description="Target duration in months.", ge=1, le=60)
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached roadmap check.")

class CareerCoachAnalyzeRequest(BaseModel):
    resume_id: Optional[uuid.UUID] = Field(None, description="Optional resume ID for context.")
    target_role: str = Field(..., min_length=1, description="Target role to analyze readiness and risk against.")
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class CareerCoachProgressRequest(BaseModel):
    roadmap_id: uuid.UUID = Field(..., description="The roadmap ID to evaluate progress for.")
    completed_milestones: Optional[List[int]] = Field(None, description="Optional list of milestone indices completed.")
    current_milestone: Optional[int] = Field(None, description="Optional current milestone index.")
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class CareerCoachWeeklyPlanRequest(BaseModel):
    roadmap_id: uuid.UUID = Field(..., description="The roadmap ID to base the weekly plan on.")
    week_number: int = Field(1, description="Week number within the timeline.", ge=1)
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")

class CareerCoachMonthlyPlanRequest(BaseModel):
    roadmap_id: uuid.UUID = Field(..., description="The roadmap ID to base the monthly plan on.")
    month_number: int = Field(1, description="Month number within the timeline.", ge=1)
    model_override: Optional[str] = Field(None, description="LLM model override.")
    bypass_cache: bool = Field(False, description="Bypass cached results.")
