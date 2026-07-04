from datetime import datetime
from uuid import UUID
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.core.enums import RoadmapStatus, ExperienceLevel, LearningPriority, MilestoneStatus

class RoadmapMetadata(BaseModel):
    provider: Optional[str] = None
    model: Optional[str] = None
    prompt_version: Optional[str] = None
    roadmap_metadata: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

class MilestoneResponse(BaseModel):
    id: UUID
    roadmap_id: UUID
    phase_number: int
    title: str
    description: Optional[str] = None
    duration: Optional[str] = None
    order_index: int
    status: str
    created_at: datetime
    updated_at: datetime

    @field_validator("status", mode="before")
    @classmethod
    def validate_status(cls, v):
        if v is None:
            return "NOT_STARTED"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in MilestoneStatus]
        if val_upper not in supported:
            raise ValueError(f"Milestone status '{v}' is not supported. Choose from {supported}")
        return val_upper

    model_config = ConfigDict(from_attributes=True)

class LearningRecommendationResponse(BaseModel):
    id: UUID
    roadmap_id: UUID
    category: str
    title: str
    description: Optional[str] = None
    priority: str
    resource_url: Optional[str] = None
    estimated_hours: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    @field_validator("priority", mode="before")
    @classmethod
    def validate_priority(cls, v):
        if v is None:
            return "MEDIUM"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in LearningPriority]
        if val_upper not in supported:
            raise ValueError(f"Priority '{v}' is not supported. Choose from {supported}")
        return val_upper

    model_config = ConfigDict(from_attributes=True)

class RoadmapCreate(BaseModel):
    resume_id: Optional[UUID] = None
    target_role: str = Field(..., min_length=1, max_length=100)
    current_role: Optional[str] = Field(None, max_length=100)
    experience_level: str
    target_industry: Optional[str] = Field(None, max_length=100)
    estimated_duration_months: Optional[int] = Field(None, ge=1, le=60)
    roadmap_metadata: Optional[Dict[str, Any]] = None

    @field_validator("experience_level", mode="before")
    @classmethod
    def validate_experience_level(cls, v):
        if v is None:
            raise ValueError("Experience level is required")
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in ExperienceLevel]
        if val_upper not in supported:
            raise ValueError(f"Experience level '{v}' is not supported. Choose from {supported}")
        return val_upper

    @field_validator("target_role", mode="before")
    @classmethod
    def validate_non_empty(cls, v):
        if not v or not str(v).strip():
            raise ValueError("Target role cannot be empty or only whitespace")
        return str(v).strip()

class RoadmapResponse(BaseModel):
    id: UUID
    user_id: UUID
    resume_id: Optional[UUID] = None
    target_role: str
    current_role: Optional[str] = None
    experience_level: str
    target_industry: Optional[str] = None
    roadmap_status: str
    estimated_duration_months: int
    current_readiness_score: int
    provider: Optional[str] = None
    model: Optional[str] = None
    prompt_version: Optional[str] = None
    roadmap_metadata: Optional[Dict[str, Any]] = Field(None, alias="roadmap_metadata")
    created_at: datetime
    updated_at: datetime
    milestones: List[MilestoneResponse] = []
    recommendations: List[LearningRecommendationResponse] = []

    @field_validator("roadmap_status", mode="before")
    @classmethod
    def validate_roadmap_status(cls, v):
        if v is None:
            return "PENDING"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in RoadmapStatus]
        if val_upper not in supported:
            raise ValueError(f"Roadmap status '{v}' is not supported. Choose from {supported}")
        return val_upper

    @field_validator("experience_level", mode="before")
    @classmethod
    def validate_experience_level(cls, v):
        if v is None:
            return "ENTRY"
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in ExperienceLevel]
        if val_upper not in supported:
            raise ValueError(f"Experience level '{v}' is not supported. Choose from {supported}")
        return val_upper

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

class RoadmapHistory(BaseModel):
    roadmaps: List[RoadmapResponse]
    total: int

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

class AICareerRoadmapPhase(BaseModel):
    phase_number: int = Field(..., ge=1)
    title: str = Field(..., min_length=1, max_length=100)
    objective: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    estimated_duration_weeks: int = Field(..., ge=1)
    difficulty: str = Field(..., min_length=1)
    skills: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    resources: List[str] = Field(default_factory=list)
    completion_criteria: List[str] = Field(default_factory=list)
    career_outcome: str = Field(..., min_length=1)

class AICareerRoadmapResponse(BaseModel):
    roadmap_title: str = Field(..., min_length=1)
    target_role: str = Field(..., min_length=1)
    experience_level: str = Field(..., min_length=1)
    estimated_duration_months: int = Field(..., ge=1)
    current_readiness_score: int = Field(..., ge=0, le=100)
    phases: List[AICareerRoadmapPhase] = Field(..., min_length=1)


class AISkillGapItem(BaseModel):
    skill: str = Field(..., min_length=1)
    gap_severity: str = Field(..., pattern="^(High|Medium|Low|HIGH|MEDIUM|LOW)$")
    remediation_action: str = Field(..., min_length=1)


class AISkillGapResponse(BaseModel):
    target_role: str = Field(..., min_length=1)
    readiness_score: int = Field(..., ge=0, le=100)
    technical_gaps: List[AISkillGapItem] = Field(default_factory=list)
    soft_skill_gaps: List[AISkillGapItem] = Field(default_factory=list)
    domain_knowledge_gaps: List[AISkillGapItem] = Field(default_factory=list)
    tool_gaps: List[AISkillGapItem] = Field(default_factory=list)
    framework_gaps: List[AISkillGapItem] = Field(default_factory=list)
    communication_gaps: List[AISkillGapItem] = Field(default_factory=list)
    confidence_gaps: List[AISkillGapItem] = Field(default_factory=list)


class AILearningRecommendation(BaseModel):
    recommendation_id: int = Field(..., ge=1)
    title: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    priority: str = Field(..., pattern="^(High|Medium|Low|HIGH|MEDIUM|LOW)$")
    estimated_hours: int = Field(..., ge=0)
    difficulty: str = Field(..., min_length=1)
    reason: str = Field(..., min_length=1)
    learning_resources: List[str] = Field(default_factory=list)
    practice_projects: List[str] = Field(default_factory=list)
    success_criteria: List[str] = Field(default_factory=list)
    career_impact: str = Field(..., min_length=1)


class AIWeeklyPlanDay(BaseModel):
    day: str = Field(..., min_length=1)
    focus: str = Field(..., min_length=1)
    tasks: List[str] = Field(default_factory=list)


class AIWeeklyPlanItem(BaseModel):
    week_number: int = Field(..., ge=1)
    topic: str = Field(..., min_length=1)
    focus: str = Field(..., min_length=1)
    objectives: List[str] = Field(default_factory=list)
    schedule: List[AIWeeklyPlanDay] = Field(default_factory=list)


class AILearningPlanResponse(BaseModel):
    weekly_plan: List[AIWeeklyPlanItem] = Field(default_factory=list)
    monthly_goals: List[str] = Field(default_factory=list)
    quarterly_goals: List[str] = Field(default_factory=list)
    practice_schedule: List[str] = Field(default_factory=list)
    certification_suggestions: List[str] = Field(default_factory=list)
    books: List[str] = Field(default_factory=list)
    courses: List[str] = Field(default_factory=list)
    hands_on_projects: List[str] = Field(default_factory=list)
    open_source_contributions: List[str] = Field(default_factory=list)
    interview_practice: List[str] = Field(default_factory=list)
    recommendations: List[AILearningRecommendation] = Field(..., min_length=1)


class SkillGapRequest(BaseModel):
    roadmap_id: Optional[UUID] = None
    target_role: Optional[str] = None
    current_role: Optional[str] = None
    experience_level: Optional[str] = None
    target_industry: Optional[str] = None
    resume_id: Optional[UUID] = None

    @field_validator("experience_level", mode="before")
    @classmethod
    def validate_experience_level(cls, v):
        if v is None:
            return v
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in ExperienceLevel]
        if val_upper not in supported:
            raise ValueError(f"Experience level '{v}' is not supported. Choose from {supported}")
        return val_upper

    @field_validator("target_role", mode="before")
    @classmethod
    def validate_target_role(cls, v):
        if v is not None and not str(v).strip():
            raise ValueError("Target role cannot be empty")
        return v


class LearningPlanRequest(BaseModel):
    roadmap_id: Optional[UUID] = None
    target_role: Optional[str] = None
    current_role: Optional[str] = None
    experience_level: Optional[str] = None
    target_industry: Optional[str] = None
    resume_id: Optional[UUID] = None

    @field_validator("experience_level", mode="before")
    @classmethod
    def validate_experience_level(cls, v):
        if v is None:
            return v
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in ExperienceLevel]
        if val_upper not in supported:
            raise ValueError(f"Experience level '{v}' is not supported. Choose from {supported}")
        return val_upper

    @field_validator("target_role", mode="before")
    @classmethod
    def validate_target_role(cls, v):
        if v is not None and not str(v).strip():
            raise ValueError("Target role cannot be empty")
        return v


class LearningRecommendationsListResponse(BaseModel):
    recommendations: List[AILearningRecommendation]


class TimelineRequest(BaseModel):
    roadmap_id: Optional[UUID] = None
    target_role: Optional[str] = None
    current_role: Optional[str] = None
    experience_level: Optional[str] = None
    target_industry: Optional[str] = None
    resume_id: Optional[UUID] = None
    estimated_duration_months: Optional[int] = None

    @field_validator("estimated_duration_months", mode="before")
    @classmethod
    def validate_duration(cls, v):
        if v is None:
            return v
        try:
            val_int = int(v)
        except (ValueError, TypeError):
            raise ValueError("Duration must be an integer")
        if val_int not in (3, 6, 12, 18, 24):
            raise ValueError("Duration must be one of: 3, 6, 12, 18, 24 months")
        return val_int

    @field_validator("experience_level", mode="before")
    @classmethod
    def validate_experience_level(cls, v):
        if v is None:
            return v
        if hasattr(v, "value"):
            v = v.value
        val_upper = str(v).upper().strip()
        supported = [e.value for e in ExperienceLevel]
        if val_upper not in supported:
            raise ValueError(f"Experience level '{v}' is not supported. Choose from {supported}")
        return val_upper

    @field_validator("target_role", mode="before")
    @classmethod
    def validate_target_role(cls, v):
        if v is not None and not str(v).strip():
            raise ValueError("Target role cannot be empty")
        return v


class AIMilestone(BaseModel):
    id: str = Field(..., description="Unique ID for the milestone")
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    start_week: int = Field(..., ge=1)
    end_week: int = Field(..., ge=1)
    estimated_hours: int = Field(..., ge=0)
    prerequisite_skills: List[str] = Field(default_factory=list)
    expected_outcome: str = Field(..., min_length=1)
    completion_status: str = Field("NOT_STARTED")

    @field_validator("completion_status", mode="before")
    @classmethod
    def validate_status(cls, v):
        if v is None:
            return "NOT_STARTED"
        val_upper = str(v).upper().strip()
        supported = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]
        if val_upper not in supported:
            raise ValueError(f"Milestone status '{v}' is not supported. Choose from {supported}")
        return val_upper


class AIWeeklyGoal(BaseModel):
    week_number: int = Field(..., ge=1)
    goal: str = Field(..., min_length=1)
    tasks: List[str] = Field(default_factory=list)


class AIMonthlyMilestone(BaseModel):
    month_number: int = Field(..., ge=1)
    milestone: str = Field(..., min_length=1)


class AIQuarterlyObjective(BaseModel):
    quarter_number: int = Field(..., ge=1)
    objective: str = Field(..., min_length=1)


class AITimelineResponse(BaseModel):
    roadmap_id: UUID
    weekly_goals: List[AIWeeklyGoal] = Field(default_factory=list)
    monthly_milestones: List[AIMonthlyMilestone] = Field(default_factory=list)
    quarterly_objectives: List[AIQuarterlyObjective] = Field(default_factory=list)
    estimated_completion_date: str = Field(..., min_length=1)
    time_estimates: str = Field(..., min_length=1)
    dependencies: List[str] = Field(default_factory=list)
    priority_ordering: List[str] = Field(default_factory=list)
    milestones: List[AIMilestone] = Field(default_factory=list)


# Pydantic v2 schemas for dashboard analytics
class CareerReadinessRecommendation(BaseModel):
    category: str
    recommendation: str

class CareerReadinessBreakdown(BaseModel):
    resume_review: Optional[float] = None
    resume_optimization: Optional[float] = None
    ats_score: Optional[float] = None
    interview_readiness: Optional[float] = None
    skill_gap: Optional[float] = None
    github_readiness: Optional[float] = None
    learning_completion: Optional[float] = None

class CareerReadinessResponse(BaseModel):
    overall_score: float
    breakdown: CareerReadinessBreakdown
    recommendations: List[CareerReadinessRecommendation] = Field(default_factory=list)

class ProgressDelayStatus(BaseModel):
    is_delayed: bool
    delay_weeks: float
    delay_severity: str

class ProgressIntervalItem(BaseModel):
    total_items: int
    completed_items: int
    completion_percentage: float
    status: str

class ProgressIntervalBreakdown(BaseModel):
    weekly: Dict[int, ProgressIntervalItem] = Field(default_factory=dict)
    monthly: Dict[int, ProgressIntervalItem] = Field(default_factory=dict)
    quarterly: Dict[int, ProgressIntervalItem] = Field(default_factory=dict)
    yearly: Dict[int, ProgressIntervalItem] = Field(default_factory=dict)

class ProgressResponse(BaseModel):
    roadmap_id: UUID
    completion_percentage: float
    velocity_percentage_per_week: float
    expected_progress_percentage: float
    estimated_completion_date: Optional[datetime] = None
    remaining_weeks: float
    delay_status: ProgressDelayStatus
    breakdown: ProgressIntervalBreakdown

class SkillAnalyticsResponse(BaseModel):
    roadmap_id: UUID
    skills_completed: List[str] = Field(default_factory=list)
    skills_remaining: List[str] = Field(default_factory=list)
    skills_in_progress: List[str] = Field(default_factory=list)
    top_missing_skills: List[str] = Field(default_factory=list)
    top_strong_skills: List[str] = Field(default_factory=list)
    learning_velocity_skills_per_week: float
    difficulty_distribution: Dict[str, int] = Field(default_factory=dict)
    category_distribution: Dict[str, int] = Field(default_factory=dict)

class TimelineAnalyticsResponse(BaseModel):
    roadmap_id: UUID
    upcoming_milestones: List[MilestoneResponse] = Field(default_factory=list)
    overdue_milestones: List[MilestoneResponse] = Field(default_factory=list)
    completed_milestones: List[MilestoneResponse] = Field(default_factory=list)
    current_week: int
    current_month: int
    expected_completion_date: Optional[datetime] = None
    timeline_health: str

class DashboardMetricsResponse(BaseModel):
    overall_progress: float
    roadmap_completion_percentage: float
    completed_milestones_count: int
    remaining_milestones_count: int
    completed_learning_hours: float
    remaining_learning_hours: float
    current_readiness_score: float
    ats_readiness: Optional[float] = None
    interview_readiness: Optional[float] = None
    github_readiness: Optional[float] = None
    skill_coverage_percentage: float
    certification_progress_percentage: float
    timeline_progress_percentage: float
    estimated_remaining_weeks: float
    average_weekly_learning_hours: float
    current_career_level: str
    target_career_level: str

class RoadmapAnalyticsResponse(BaseModel):
    roadmap_id: UUID
    metrics: DashboardMetricsResponse
    progress: ProgressResponse
    readiness: CareerReadinessResponse
    skills: SkillAnalyticsResponse
    timeline: TimelineAnalyticsResponse



