from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.resume import ResumeResponse

class ResumeOverviewAnalytics(BaseModel):
    total_resumes: int = Field(..., description="Total uploaded resumes")
    parsed_resumes: int = Field(..., description="Total resumes parsed successfully")
    unparsed_resumes: int = Field(..., description="Total unparsed or failed resumes")
    parsing_success_rate: float = Field(..., description="Percentage of resumes parsed successfully")
    average_resume_length: float = Field(..., description="Average character length of raw resume text")
    oldest_resume: ResumeResponse | None = Field(default=None, description="Oldest resume uploaded")
    newest_resume: ResumeResponse | None = Field(default=None, description="Newest resume uploaded")
    resumes_uploaded_this_week: int = Field(..., description="Number of resumes uploaded in the last 7 days")
    resumes_uploaded_this_month: int = Field(..., description="Number of resumes uploaded in the last 30 days")

    model_config = ConfigDict(from_attributes=True)

class ResumeSkillsAnalytics(BaseModel):
    top_skills: list[str] = Field(..., description="Top 10 most common skills")
    total_unique_skills: int = Field(..., description="Total count of unique skills across all resumes")
    most_common_skill: str | None = Field(default=None, description="Highest frequency skill name")
    skill_frequency: dict[str, int] = Field(..., description="Mapping of skill names to their counts")

    model_config = ConfigDict(from_attributes=True)

class ResumeExperienceAnalytics(BaseModel):
    average_years_experience: float = Field(..., description="Average years of experience across candidates")
    experience_distribution: dict[str, int] = Field(..., description="Experience cohorts counts mapping")

    model_config = ConfigDict(from_attributes=True)

class ResumeEducationAnalytics(BaseModel):
    education_distribution: dict[str, int] = Field(..., description="Degrees counts mapping")

    model_config = ConfigDict(from_attributes=True)

class ResumeTimelineAnalytics(BaseModel):
    daily: dict[str, int] = Field(..., description="Daily upload counts")
    weekly: dict[str, int] = Field(..., description="Weekly upload counts starting on Monday")
    monthly: dict[str, int] = Field(..., description="Monthly upload counts")

    model_config = ConfigDict(from_attributes=True)

class ResumeAnalyticsData(BaseModel):
    overview: ResumeOverviewAnalytics
    skills: ResumeSkillsAnalytics
    experience: ResumeExperienceAnalytics
    education: ResumeEducationAnalytics
    timeline: ResumeTimelineAnalytics

    model_config = ConfigDict(from_attributes=True)

class ResumeAnalyticsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: ResumeAnalyticsData = Field(..., description="Resume analytics dashboard metrics container")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Resume analytics generated successfully",
                "timestamp": "2026-07-01T09:50:00Z",
                "data": {
                    "overview": {
                        "total_resumes": 0,
                        "parsed_resumes": 0,
                        "unparsed_resumes": 0,
                        "parsing_success_rate": 0.0,
                        "average_resume_length": 0.0,
                        "oldest_resume": None,
                        "newest_resume": None,
                        "resumes_uploaded_this_week": 0,
                        "resumes_uploaded_this_month": 0
                    },
                    "skills": {
                        "top_skills": [],
                        "total_unique_skills": 0,
                        "most_common_skill": None,
                        "skill_frequency": {}
                    },
                    "experience": {
                        "average_years_experience": 0.0,
                        "experience_distribution": {
                            "0–1 years": 0,
                            "2–4 years": 0,
                            "5–8 years": 0,
                            "8+ years": 0
                        }
                    },
                    "education": {
                        "education_distribution": {
                            "Bachelor": 0,
                            "Master": 0,
                            "PhD": 0,
                            "Diploma": 0,
                            "Other": 0
                        }
                    },
                    "timeline": {
                        "daily": {},
                        "weekly": {},
                        "monthly": {}
                    }
                }
            }
        }
    )
