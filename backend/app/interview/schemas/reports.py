from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid

class CategoryScores(BaseModel):
    scores: Dict[str, float] = Field(default_factory=dict, description="Map of category names to average scores")

class TrendAnalysis(BaseModel):
    performance_trend: List[int] = Field(default_factory=list, description="Overall scores over turns or sessions")
    difficulty_trend: List[str] = Field(default_factory=list, description="Difficulty of turns or sessions")
    communication_trend: List[int] = Field(default_factory=list, description="Communication scores trend")
    confidence_trend: List[int] = Field(default_factory=list, description="Confidence scores trend")
    star_trend: List[int] = Field(default_factory=list, description="STAR scores trend")
    response_time_trend: List[float] = Field(default_factory=list, description="Response time trend (seconds)")
    session_comparison: Optional[Dict[str, Any]] = Field(None, description="Comparison of session to prior sessions")
    skill_improvement_trend: Optional[Dict[str, Any]] = Field(None, description="Skill score progress details")

class SkillGapAnalysis(BaseModel):
    strong_skills: List[str] = Field(default_factory=list)
    weak_skills: List[str] = Field(default_factory=list)
    missing_topics: List[str] = Field(default_factory=list)
    repeated_mistakes: List[str] = Field(default_factory=list)
    knowledge_gaps: List[str] = Field(default_factory=list)
    behavioral_weaknesses: List[str] = Field(default_factory=list)
    technical_weaknesses: List[str] = Field(default_factory=list)
    communication_issues: List[str] = Field(default_factory=list)
    improvement_priorities: List[str] = Field(default_factory=list)

class Recommendations(BaseModel):
    learning_recommendations: List[str] = Field(default_factory=list)
    practice_topics: List[str] = Field(default_factory=list)
    suggested_projects: List[str] = Field(default_factory=list)
    certification_suggestions: List[str] = Field(default_factory=list)
    interview_tips: List[str] = Field(default_factory=list)
    resume_improvement_suggestions: List[str] = Field(default_factory=list)
    cover_letter_suggestions: List[str] = Field(default_factory=list)
    career_guidance: List[str] = Field(default_factory=list)

class SessionStatistics(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    technical_score: int = Field(..., ge=0, le=100)
    behavioral_score: int = Field(..., ge=0, le=100)
    hr_score: int = Field(..., ge=0, le=100)
    communication_score: int = Field(..., ge=0, le=100)
    grammar_score: int = Field(..., ge=0, le=100)
    confidence_score: int = Field(..., ge=0, le=100)
    professionalism_score: int = Field(..., ge=0, le=100)
    problem_solving_score: int = Field(..., ge=0, le=100)
    star_score: int = Field(..., ge=0, le=100)
    question_accuracy: float = Field(..., ge=0.0, le=100.0)
    average_response_time: float = Field(..., ge=0.0)
    session_completion_rate: float = Field(..., ge=0.0, le=100.0)
    difficulty_progression: List[str] = Field(default_factory=list)
    question_category_distribution: Dict[str, int] = Field(default_factory=dict)
    follow_up_question_rate: float = Field(..., ge=0.0, le=100.0)

class ResponseTimeAnalysis(BaseModel):
    average_response_time: float = Field(..., ge=0.0)
    response_time_trend: List[float] = Field(default_factory=list)
    total_duration_seconds: Optional[float] = None
    total_paused_seconds: float = 0.0

class InterviewAnalyticsResponse(BaseModel):
    session_id: uuid.UUID
    overall_score: int = Field(..., ge=0, le=100)
    category_scores: Dict[str, float] = Field(default_factory=dict)
    trend_analysis: TrendAnalysis
    skill_gap_analysis: SkillGapAnalysis
    recommendations: Recommendations
    session_statistics: SessionStatistics
    difficulty_progression: List[str] = Field(default_factory=list)
    response_time_analysis: ResponseTimeAnalysis
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    improvement_plan: List[str] = Field(default_factory=list)
    summary: str

    model_config = ConfigDict(from_attributes=True)

class ReportRegenerateRequest(BaseModel):
    session_id: uuid.UUID
