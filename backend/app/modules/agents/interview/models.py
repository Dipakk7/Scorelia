# app/modules/agents/interview/models.py

import uuid
from typing import Optional
from pydantic import BaseModel, Field

class InterviewAgentQuestionsRequest(BaseModel):
    session_id: uuid.UUID = Field(..., description="The unique identifier of the interview session.")
    count: Optional[int] = Field(1, description="Number of questions to generate.")

class InterviewAgentEvaluateRequest(BaseModel):
    session_id: uuid.UUID = Field(..., description="The unique identifier of the interview session.")
    answer: str = Field(..., min_length=1, description="Candidate's answer text for the current turn.")

class InterviewAgentMockRequest(BaseModel):
    resume_id: Optional[uuid.UUID] = Field(None, description="Optional resume identifier.")
    job_id: Optional[uuid.UUID] = Field(None, description="Optional job description identifier.")
    company_name: Optional[str] = Field("Target Company", description="Name of company preparing for.")
    target_role: Optional[str] = Field("Software Engineer", description="Target role preparing for.")
    interview_type: Optional[str] = Field("BEHAVIORAL", description="Type of interview: BEHAVIORAL, TECHNICAL, HR, etc.")
    difficulty: Optional[str] = Field("MEDIUM", description="Difficulty: EASY, MEDIUM, HARD, or ADAPTIVE.")
    total_questions: Optional[int] = Field(5, description="Number of questions in mock interview.")

class InterviewAgentReadinessRequest(BaseModel):
    session_id: Optional[uuid.UUID] = Field(None, description="Optional specific session ID. If empty, evaluates global history readiness.")
