from datetime import datetime
from uuid import UUID
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.core.enums import InterviewType, InterviewDifficulty, QuestionCategory

class AnswerSubmitRequest(BaseModel):
    answer: str = Field(..., min_length=1, description="Candidate's answer text")

    @field_validator("answer", mode="before")
    @classmethod
    def check_non_empty(cls, v):
        if not v or not str(v).strip():
            raise ValueError("Answer cannot be empty or only whitespace")
        return str(v).strip()

class AdHocEvaluationRequest(BaseModel):
    question: str = Field(..., min_length=1, description="The interview question asked")
    answer: str = Field(..., min_length=1, description="The candidate's answer")
    interview_type: Optional[str] = "BEHAVIORAL"
    difficulty: Optional[str] = "MEDIUM"
    role: Optional[str] = "Software Engineer"
    company: Optional[str] = "Target Company"
    expected_topics: Optional[List[str]] = Field(default_factory=list)

    @field_validator("question", "answer", mode="before")
    @classmethod
    def check_non_empty(cls, v):
        if not v or not str(v).strip():
            raise ValueError("Field cannot be empty or only whitespace")
        return str(v).strip()

    @field_validator("interview_type", mode="before")
    @classmethod
    def check_interview_type(cls, v):
        if v is None:
            return "BEHAVIORAL"
        val_upper = str(v).upper().strip()
        supported = [e.value for e in InterviewType]
        if val_upper not in supported:
            raise ValueError(f"Unsupported interview type: {v}. Choose from {supported}")
        return val_upper

    @field_validator("difficulty", mode="before")
    @classmethod
    def check_difficulty(cls, v):
        if v is None:
            return "MEDIUM"
        val_upper = str(v).upper().strip()
        supported = [e.value for e in InterviewDifficulty]
        if val_upper not in supported:
            raise ValueError(f"Unsupported difficulty: {v}. Choose from {supported}")
        return val_upper

class InterviewSessionCreate(BaseModel):
    resume_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    company_name: Optional[str] = Field(None, max_length=100)
    target_role: Optional[str] = Field(None, max_length=100)
    interview_type: Optional[str] = "BEHAVIORAL"
    difficulty: Optional[str] = "MEDIUM"
    total_questions: Optional[int] = Field(5, ge=1, le=15)
    session_metadata: Optional[Dict[str, Any]] = None

    @field_validator("interview_type", mode="before")
    @classmethod
    def validate_interview_type(cls, v):
        if v is None:
            return "BEHAVIORAL"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in InterviewType]
        if val_upper not in supported:
            raise ValueError(f"Interview type '{v}' is not supported. Choose from {supported}")
        return val_upper

    @field_validator("difficulty", mode="before")
    @classmethod
    def validate_difficulty(cls, v):
        if v is None:
            return "MEDIUM"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in InterviewDifficulty] + ["ADAPTIVE"]
        if val_upper not in supported:
            raise ValueError(f"Difficulty '{v}' is not supported. Choose from {supported}")
        return val_upper

class InterviewTurnResponse(BaseModel):
    id: UUID
    session_id: UUID
    question_number: int
    question_category: Optional[str] = None
    question_text: str
    answer_text: Optional[str] = None
    feedback: Optional[str] = None
    score: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    @field_validator("question_category", mode="before")
    @classmethod
    def validate_question_category(cls, v):
        if v is None:
            return None
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in QuestionCategory]
        if val_upper not in supported:
            raise ValueError(f"Question category '{v}' is not supported. Choose from {supported}")
        return val_upper

    model_config = ConfigDict(from_attributes=True)

class InterviewSessionResponse(BaseModel):
    id: UUID
    user_id: UUID
    resume_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    company_name: Optional[str] = None
    target_role: Optional[str] = None
    interview_type: str
    difficulty: str
    status: str
    total_questions: int
    current_question: int
    provider: Optional[str] = None
    model: Optional[str] = None
    prompt_version: Optional[str] = None
    session_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    turns: List[InterviewTurnResponse] = []

    model_config = ConfigDict(from_attributes=True)

class InterviewHistory(BaseModel):
    sessions: List[InterviewSessionResponse]
    total: int

    model_config = ConfigDict(from_attributes=True)

class InterviewMetadata(BaseModel):
    provider: Optional[str] = None
    model: Optional[str] = None
    prompt_version: Optional[str] = None
    session_metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class ValidationErrorDetail(BaseModel):
    loc: List[str]
    msg: str
    type: str

class ValidationErrorResponse(BaseModel):
    error: bool = True
    status_code: int = 422
    message: str = "Validation error"
    detail: List[ValidationErrorDetail]

    model_config = ConfigDict(from_attributes=True)
