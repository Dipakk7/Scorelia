from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class ATSCategoryBreakdownItem(BaseModel):
    average: float = Field(..., description="Average score in this category")
    weight: int = Field(..., description="Contribution weight of this category in the total score")

    model_config = ConfigDict(from_attributes=True)

class ATSTrendItem(BaseModel):
    date: str = Field(..., description="Timeline date formatted as YYYY-MM-DD")
    score: float = Field(..., description="Average score recorded on this date")

    model_config = ConfigDict(from_attributes=True)

class ATSInsightItem(BaseModel):
    name: str = Field(..., description="Name or message detail of the weakness/recommendation")
    count: int = Field(..., description="Occurrence frequency count")
    percentage: float = Field(..., description="Percentage of evaluations matching this insight")

    model_config = ConfigDict(from_attributes=True)

class ATSOverviewAnalytics(BaseModel):
    total_ats_evaluations: int = Field(..., description="Total completed ATS evaluations")
    average_ats_score: float = Field(..., description="Average ATS score across evaluations")
    highest_ats_score: int = Field(..., description="Highest ATS score recorded")
    lowest_ats_score: int = Field(..., description="Lowest ATS score recorded")
    median_ats_score: float = Field(..., description="Median of ATS scores")

    model_config = ConfigDict(from_attributes=True)

class ATSGradeDistributionItem(BaseModel):
    count: int = Field(..., description="Number of evaluations in this grade category")
    percentage: float = Field(..., description="Percentage of evaluations in this grade category")

    model_config = ConfigDict(from_attributes=True)

class ATSGradeDistribution(BaseModel):
    Excellent: ATSGradeDistributionItem = Field(..., alias="Excellent")
    Good: ATSGradeDistributionItem = Field(..., alias="Good")
    Fair: ATSGradeDistributionItem = Field(..., alias="Fair")
    Needs_Improvement: ATSGradeDistributionItem = Field(..., alias="Needs Improvement")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class ATSCategoryBreakdown(BaseModel):
    contact: ATSCategoryBreakdownItem = Field(..., alias="contact")
    skills: ATSCategoryBreakdownItem = Field(..., alias="skills")
    education: ATSCategoryBreakdownItem = Field(..., alias="education")
    experience: ATSCategoryBreakdownItem = Field(..., alias="experience")
    projects: ATSCategoryBreakdownItem = Field(..., alias="projects")
    certifications: ATSCategoryBreakdownItem = Field(..., alias="certifications")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class ATSTrendAnalytics(BaseModel):
    score_trend: list[ATSTrendItem] = Field(..., description="Timeline chart data for score trend")
    improvement_rate: float = Field(..., description="Average change in score between first and last evaluation per candidate")

    model_config = ConfigDict(from_attributes=True)

class ATSWeaknessInsights(BaseModel):
    top_weaknesses: list[ATSInsightItem] = Field(..., description="Top 5 weaknesses frequency details")
    top_recommendations: list[ATSInsightItem] = Field(..., description="Top 5 recommendations frequency details")

    model_config = ConfigDict(from_attributes=True)

class ATSAnalyticsData(BaseModel):
    overview: ATSOverviewAnalytics
    grade_distribution: ATSGradeDistribution
    category_breakdown: ATSCategoryBreakdown
    trend: ATSTrendAnalytics
    weaknesses: ATSWeaknessInsights

    model_config = ConfigDict(from_attributes=True)

class ATSAnalyticsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: ATSAnalyticsData = Field(..., description="ATS analytics metrics container")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "ATS analytics generated successfully",
                "timestamp": "2026-07-01T09:50:00Z",
                "data": {
                    "overview": {
                        "total_ats_evaluations": 0,
                        "average_ats_score": 0.0,
                        "highest_ats_score": 0,
                        "lowest_ats_score": 0,
                        "median_ats_score": 0.0
                    },
                    "grade_distribution": {
                        "Excellent": {"count": 0, "percentage": 0.0},
                        "Good": {"count": 0, "percentage": 0.0},
                        "Fair": {"count": 0, "percentage": 0.0},
                        "Needs Improvement": {"count": 0, "percentage": 0.0}
                    },
                    "category_breakdown": {
                        "contact": {"average": 0.0, "weight": 10},
                        "skills": {"average": 0.0, "weight": 25},
                        "education": {"average": 0.0, "weight": 15},
                        "experience": {"average": 0.0, "weight": 25},
                        "projects": {"average": 0.0, "weight": 15},
                        "certifications": {"average": 0.0, "weight": 10}
                    },
                    "trend": {
                        "score_trend": [],
                        "improvement_rate": 0.0
                    },
                    "weaknesses": {
                        "top_weaknesses": [],
                        "top_recommendations": []
                    }
                }
            }
        }
    )
