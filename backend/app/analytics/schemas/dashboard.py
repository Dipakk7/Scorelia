from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.resume import ResumeResponse

class LatestJobMatch(BaseModel):
    resume_id: str = Field(..., description="ID of the matched resume")
    timestamp: datetime = Field(..., description="UTC timestamp of the match calculation")
    overall_score: int = Field(..., description="Overall match score")
    grade: str = Field(..., description="Grade awarded for the match")
    job_title: str = Field(..., description="Title of the job description matched")
    company: str = Field(..., description="Company name of the job description matched")

    model_config = ConfigDict(from_attributes=True)

class DashboardSummaryResponse(BaseModel):
    total_users: int = Field(..., description="Total registered users")
    total_resumes: int = Field(..., description="Total uploaded resumes")
    parsed_resumes: int = Field(..., description="Total resumes parsed successfully")
    total_job_matches: int = Field(..., description="Total job matches completed")
    average_ats_score: float = Field(..., description="Average ATS score across resumes")
    average_match_score: float = Field(..., description="Average match score across job matches")
    latest_resume: ResumeResponse | None = Field(default=None, description="Metadata of the latest uploaded resume")
    latest_job_match: LatestJobMatch | None = Field(default=None, description="Details of the latest job match calculation")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "total_users": 25,
                "total_resumes": 18,
                "parsed_resumes": 17,
                "total_job_matches": 42,
                "average_ats_score": 81.4,
                "average_match_score": 76.8,
                "latest_resume": None,
                "latest_job_match": None
            }
        }
    )

class BaseAnalyticsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")

    model_config = ConfigDict(from_attributes=True)

class DashboardAnalyticsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: DashboardSummaryResponse = Field(..., description="Analytics data summary container")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "Dashboard analytics generated successfully",
                "timestamp": "2026-07-01T09:50:00Z",
                "data": {
                    "total_users": 0,
                    "total_resumes": 0,
                    "parsed_resumes": 0,
                    "total_job_matches": 0,
                    "average_ats_score": 0.0,
                    "average_match_score": 0.0,
                    "latest_resume": None,
                    "latest_job_match": None
                }
            }
        }
    )
