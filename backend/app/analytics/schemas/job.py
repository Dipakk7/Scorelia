from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class JobOverviewAnalytics(BaseModel):
    total_job_matches: int = Field(..., description="Total completed job matches")
    average_match_score: float = Field(..., description="Average match score across matches")
    highest_match_score: int = Field(..., description="Highest match score recorded")
    lowest_match_score: int = Field(..., description="Lowest match score recorded")
    median_match_score: float = Field(..., description="Median of match scores")

    model_config = ConfigDict(from_attributes=True)

class JobDistributionItem(BaseModel):
    count: int = Field(..., description="Count of matches in this bucket")
    percentage: float = Field(..., description="Percentage of matches in this bucket")
    label: str = Field(..., description="Label for chart representation")
    value: int = Field(..., description="Value for chart representation")

    model_config = ConfigDict(from_attributes=True)

class JobDistribution(BaseModel):
    ninety_to_hundred: JobDistributionItem = Field(..., alias="90–100%")
    eighty_to_eightynine: JobDistributionItem = Field(..., alias="80–89%")
    seventy_to_seventynine: JobDistributionItem = Field(..., alias="70–79%")
    sixty_to_sixtynine: JobDistributionItem = Field(..., alias="60–69%")
    below_sixty: JobDistributionItem = Field(..., alias="Below 60%")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class JobMissingSkillItem(BaseModel):
    name: str = Field(..., description="Name of the missing skill")
    count: int = Field(..., description="Missing frequency count")
    percentage: float = Field(..., description="Percentage of matches missing this skill")
    label: str = Field(..., description="Chart ready label")
    value: int = Field(..., description="Chart ready value")

    model_config = ConfigDict(from_attributes=True)

class JobSkillGapAnalytics(BaseModel):
    top_missing_skills: list[JobMissingSkillItem] = Field(..., description="Top missing skills list")
    missing_skill_frequency: dict[str, int] = Field(..., description="Full mapping of missing skills to their count")
    total_unique_missing_skills: int = Field(..., description="Total unique missing skills count")

    model_config = ConfigDict(from_attributes=True)

class JobTrendItem(BaseModel):
    date: str = Field(..., description="Date formatted as YYYY-MM-DD")
    score: float = Field(..., description="Average match score on this date")

    model_config = ConfigDict(from_attributes=True)

class JobTrendAnalytics(BaseModel):
    score_trend: list[JobTrendItem] = Field(..., description="Daily average match scores")

    model_config = ConfigDict(from_attributes=True)

class JobRecommendationItem(BaseModel):
    name: str = Field(..., description="Message text of the match recommendation")
    count: int = Field(..., description="Recommendation frequency count")
    percentage: float = Field(..., description="Percentage of matches recommending this")

    model_config = ConfigDict(from_attributes=True)

class JobRecommendationsAnalytics(BaseModel):
    top_recommendations: list[JobRecommendationItem] = Field(..., description="Top 5 recommendations")

    model_config = ConfigDict(from_attributes=True)

class JobLatestMatch(BaseModel):
    resume_id: str = Field(..., description="Matched resume ID")
    timestamp: datetime = Field(..., description="Timestamp of the calculation")
    overall_score: int = Field(..., description="Overall match score")
    grade: str = Field(..., description="Score grade")
    job_title: str = Field(..., description="Title of the job")
    company: str = Field(..., description="Company name")

    model_config = ConfigDict(from_attributes=True)

class JobHistoryAnalytics(BaseModel):
    total_matches: int = Field(..., description="Total matches recorded")
    latest_match: JobLatestMatch | None = Field(default=None, description="Most recent match details")
    average_matches_per_resume: float = Field(..., description="Average number of matches run per resume")
    repeated_job_descriptions: int = Field(..., description="Count of job descriptions matched more than once")
    historical_match_growth: float = Field(..., description="Percentage growth in matches last 30 days vs 30 days prior")

    model_config = ConfigDict(from_attributes=True)

class JobAnalyticsData(BaseModel):
    overview: JobOverviewAnalytics
    distribution: JobDistribution
    skill_gaps: JobSkillGapAnalytics
    trend: JobTrendAnalytics
    recommendations: JobRecommendationsAnalytics
    history: JobHistoryAnalytics

    model_config = ConfigDict(from_attributes=True)

class JobAnalyticsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: JobAnalyticsData = Field(..., description="Job analytics metrics container")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Job match analytics generated successfully",
                "timestamp": "2026-07-01T09:50:00Z",
                "data": {
                    "overview": {
                        "total_job_matches": 0,
                        "average_match_score": 0.0,
                        "highest_match_score": 0,
                        "lowest_match_score": 0,
                        "median_match_score": 0.0
                    },
                    "distribution": {
                        "90–100%": {"count": 0, "percentage": 0.0, "label": "90–100%", "value": 0},
                        "80–89%": {"count": 0, "percentage": 0.0, "label": "80–89%", "value": 0},
                        "70–79%": {"count": 0, "percentage": 0.0, "label": "70–79%", "value": 0},
                        "60–69%": {"count": 0, "percentage": 0.0, "label": "60–69%", "value": 0},
                        "Below 60%": {"count": 0, "percentage": 0.0, "label": "Below 60%", "value": 0}
                    },
                    "skill_gaps": {
                        "top_missing_skills": [],
                        "missing_skill_frequency": {},
                        "total_unique_missing_skills": 0
                    },
                    "trend": {
                        "score_trend": []
                    },
                    "recommendations": {
                        "top_recommendations": []
                    },
                    "history": {
                        "total_matches": 0,
                        "latest_match": None,
                        "average_matches_per_resume": 0.0,
                        "repeated_job_descriptions": 0,
                        "historical_match_growth": 0.0
                    }
                }
            }
        }
    )
