import re
from fastapi import APIRouter, Depends, status, Response
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import structlog

from app.core.db import get_db
from app.core.dependencies import get_current_user, get_job_match_service
from app.models.user import User
from app.services.job_match import JobMatchService
from app.analytics.schemas import (
    DashboardAnalyticsResponse, 
    ResumeAnalyticsResponse,
    ATSAnalyticsResponse,
    JobAnalyticsResponse,
    GitHubAnalyticsResponse,
    BaseAnalyticsResponse,
    GitHubRepositoryInsightsResponse,
    ChartOverviewResponse,
    SingleChartResponse
)
from app.analytics.statistics.chart_statistics import CHART_REGISTRY
from app.analytics.github_service import (
    GitHubUserNotFound,
    GitHubRateLimitExceeded,
    GitHubAPIError,
    GitHubRequestTimeout
)
from app.analytics.service import analytics_service

logger = structlog.get_logger()
router = APIRouter()

@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Analytics health check",
    description="Returns the status and health of the Analytics module.",
    response_model=dict,
    responses={
        200: {
            "description": "Module is healthy",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "module": "analytics"
                    }
                }
            }
        }
    }
)
async def health_check() -> dict:
    """Perform a health check on the Analytics module."""
    logger.info("Health endpoint accessed")
    return {
        "status": "healthy",
        "module": "analytics"
    }

@router.get(
    "/dashboard",
    response_model=DashboardAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard analytics summary",
    description="Retrieve system summary analytics including total users, resumes, parsed resumes, job matches, and averages of ATS and match scores. Requires a valid user session.",
    responses={
        200: {
            "description": "Dashboard summary retrieved successfully",
            "model": DashboardAnalyticsResponse
        },
        401: {
            "description": "Not authenticated or invalid/expired session token"
        }
    }
)
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> DashboardAnalyticsResponse:
    """Retrieve aggregate statistics for the admin dashboard."""
    logger.info("Dashboard endpoint accessed")
    summary = await analytics_service.get_dashboard_summary(db=db)
    return DashboardAnalyticsResponse(
        success=True,
        message="Dashboard analytics generated successfully",
        timestamp=datetime.now(timezone.utc),
        data=summary
    )

@router.get(
    "/resumes",
    response_model=ResumeAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get resume analytics metrics",
    description="Retrieve complex analytics on resumes including parsing overview, skill counts, experience and education distribution, and upload timeline data. Requires an authenticated user session.",
    responses={
        200: {
            "description": "Resume analytics retrieved successfully",
            "model": ResumeAnalyticsResponse
        },
        401: {
            "description": "Not authenticated or invalid/expired session token"
        }
    }
)
async def get_resumes_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ResumeAnalyticsResponse:
    """Retrieve system-wide detailed statistics on resume uploads and content parsing."""
    logger.info("Resume analytics requested")
    analytics_data = await analytics_service.get_resume_analytics(db=db)
    return ResumeAnalyticsResponse(
        success=True,
        message="Resume analytics generated successfully",
        timestamp=datetime.now(timezone.utc),
        data=analytics_data
    )

@router.get(
    "/ats",
    response_model=ATSAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get ATS analytics metrics",
    description="Retrieve detailed analytics on ATS scoring, including average score stats, grade distribution, category breakdowns (weight + score), trends, weaknesses, and recommendations. Requires a valid user session.",
    responses={
        200: {
            "description": "ATS analytics retrieved successfully",
            "model": ATSAnalyticsResponse
        },
        401: {
            "description": "Not authenticated or invalid/expired session token"
        }
    }
)
async def get_ats_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ATSAnalyticsResponse:
    """Retrieve system-wide detailed statistics on ATS evaluations, grades, and insights."""
    logger.info("ATS analytics endpoint accessed")
    analytics_data = await analytics_service.get_ats_analytics(db=db)
    return ATSAnalyticsResponse(
        success=True,
        message="ATS analytics generated successfully",
        timestamp=datetime.now(timezone.utc),
        data=analytics_data
    )

@router.get(
    "/jobs",
    response_model=JobAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Job Match analytics metrics",
    description="Retrieve detailed analytics on Job Matches, including average match scores, grade distribution (with chart-ready fields), top missing skills (with chart-ready fields), trend timeline, recommendations, and history metrics. Requires a valid user session.",
    responses={
        200: {
            "description": "Job match analytics retrieved successfully",
            "model": JobAnalyticsResponse
        },
        401: {
            "description": "Not authenticated or invalid/expired session token"
        }
    }
)
async def get_jobs_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    job_match_service: JobMatchService = Depends(get_job_match_service)
) -> JobAnalyticsResponse:
    """Retrieve system-wide statistics on Job Matching calculations, trends, and skill gaps."""
    logger.info("Job analytics requested")
    analytics_data = await analytics_service.get_job_analytics(db=db, job_match_service=job_match_service)
    return JobAnalyticsResponse(
        success=True,
        message="Job match analytics generated successfully",
        timestamp=datetime.now(timezone.utc),
        data=analytics_data
    )


GITHUB_USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$")

@router.get(
    "/github/{username}/profile",
    response_model=GitHubAnalyticsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get GitHub profile analytics",
    description="Retrieve real-time GitHub profile information and top-level repository summary statistics for a given username. Uses public GitHub REST API and includes caching.",
    responses={
        200: {
            "description": "GitHub profile analytics retrieved successfully",
            "model": GitHubAnalyticsResponse
        },
        400: {
            "description": "Invalid or empty username supplied",
            "model": BaseAnalyticsResponse
        },
        404: {
            "description": "GitHub username not found",
            "model": BaseAnalyticsResponse
        },
        429: {
            "description": "GitHub API rate limit exceeded",
            "model": BaseAnalyticsResponse
        },
        503: {
            "description": "GitHub API service unavailable or timeout",
            "model": BaseAnalyticsResponse
        }
    }
)
async def get_github_profile_analytics(
    username: str,
    current_user: User = Depends(get_current_user)
) -> Response:
    """Retrieve profile and repository stats for a given GitHub username."""
    logger.info("GitHub profile analytics endpoint accessed", username=username)
    
    # 1. Validation check for malformed or empty username
    if not username or not username.strip():
        logger.warning("Empty username provided for GitHub analytics")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Username parameter cannot be empty.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )

    if not GITHUB_USERNAME_REGEX.match(username):
        logger.warning("Malformed username provided for GitHub analytics", username=username)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Malformed GitHub username. Usernames must contain only alphanumeric characters or single hyphens and cannot start/end with hyphens or exceed 39 characters.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )

    try:
        analytics_data = await analytics_service.get_github_profile_analytics(username=username)
        return GitHubAnalyticsResponse(
            success=True,
            message="GitHub profile analytics generated successfully",
            timestamp=datetime.now(timezone.utc),
            data=analytics_data
        )
    except GitHubUserNotFound as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except GitHubRateLimitExceeded as e:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except (GitHubAPIError, GitHubRequestTimeout) as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except Exception as e:
        logger.exception("Unexpected error in GitHub analytics endpoint", error=str(e))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "An unexpected error occurred while processing GitHub analytics.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )


@router.get(
    "/github/{username}/insights",
    response_model=GitHubRepositoryInsightsResponse,
    status_code=status.HTTP_200_OK,
    summary="Get GitHub repository insights",
    description="Retrieve detailed repository-level insights for a GitHub username, including languages, growth, sizes, topics, activity, and Developer Score.",
    responses={
        200: {
            "description": "GitHub repository insights retrieved successfully",
            "model": GitHubRepositoryInsightsResponse
        },
        206: {
            "description": "Partial content returned due to API rate limit mid-loop",
            "model": GitHubRepositoryInsightsResponse
        },
        400: {
            "description": "Invalid or empty username supplied",
            "model": BaseAnalyticsResponse
        },
        404: {
            "description": "GitHub username not found",
            "model": BaseAnalyticsResponse
        },
        429: {
            "description": "GitHub API rate limit exceeded",
            "model": BaseAnalyticsResponse
        },
        503: {
            "description": "GitHub API service unavailable or timeout",
            "model": BaseAnalyticsResponse
        }
    }
)
async def get_github_repository_insights(
    username: str,
    current_user: User = Depends(get_current_user)
) -> Response:
    """Retrieve deep repository-level insights and Developer Score."""
    logger.info("GitHub repository insights endpoint accessed", username=username)
    
    if not username or not username.strip():
        logger.warning("Empty username provided for GitHub repository insights")
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Username parameter cannot be empty.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )

    if not GITHUB_USERNAME_REGEX.match(username):
        logger.warning("Malformed username provided for GitHub repository insights", username=username)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Malformed GitHub username. Usernames must contain only alphanumeric characters or single hyphens and cannot start/end with hyphens or exceed 39 characters.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )

    try:
        insights_data, is_partial = await analytics_service.get_github_repository_insights(username=username)
        status_code = status.HTTP_206_PARTIAL_CONTENT if is_partial else status.HTTP_200_OK
        msg = "GitHub repository insights generated successfully (partial data due to rate limits)" if is_partial else "GitHub repository insights generated successfully"
        
        return JSONResponse(
            status_code=status_code,
            content={
                "success": True,
                "message": msg,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": jsonable_encoder(insights_data)
            }
        )
    except GitHubUserNotFound as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except GitHubRateLimitExceeded as e:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except (GitHubAPIError, GitHubRequestTimeout) as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except Exception as e:
        logger.exception("Unexpected error in GitHub repository insights endpoint", error=str(e))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "An unexpected error occurred while processing GitHub repository insights.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )


@router.get(
    "/charts/overview",
    response_model=ChartOverviewResponse,
    status_code=status.HTTP_200_OK,
    summary="Get charts overview",
    description="Retrieve a curated set of general dashboard overview charts (ATS Grade/Score Distribution, Job Match Distribution, Resume Upload Timeline, and Top Resume Skills). Skips failed modules and returns a list of omitted charts in the metadata.",
    responses={
        200: {
            "description": "Charts overview retrieved successfully",
            "model": ChartOverviewResponse
        },
        401: {
            "description": "Not authenticated or invalid session"
        }
    }
)
async def get_charts_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    job_match_service: JobMatchService = Depends(get_job_match_service)
) -> ChartOverviewResponse:
    """Retrieve a curated list of dashboard-level chart datasets."""
    logger.info("Charts overview endpoint accessed")
    overview_data = await analytics_service.get_charts_overview(db=db, job_match_service=job_match_service)
    return ChartOverviewResponse(
        success=True,
        message="Chart overview generated successfully",
        timestamp=datetime.now(timezone.utc),
        data=overview_data
    )


@router.get(
    "/charts/{chart_id}",
    response_model=SingleChartResponse,
    status_code=status.HTTP_200_OK,
    summary="Get single chart by ID",
    description=(
        "Retrieve a single named chart dataset. Valid chart IDs: \n"
        "- `ats-grade-distribution` (alias: `ats-score-distribution`)\n"
        "- `ats-category-breakdown`\n"
        "- `job-match-distribution`\n"
        "- `job-skill-gaps`\n"
        "- `resume-upload-timeline`\n"
        "- `resume-experience-distribution`\n"
        "- `resume-education-distribution`\n"
        "- `resume-top-skills` (alias: `top-skills`)\n"
        "- `github-language-distribution` (requires username query param)\n"
        "- `github-repo-growth` (requires username query param)\n"
    ),
    responses={
        200: {
            "description": "Chart generated successfully",
            "model": SingleChartResponse
        },
        400: {
            "description": "Invalid parameter (missing username for GitHub charts)",
            "model": BaseAnalyticsResponse
        },
        401: {
            "description": "Not authenticated"
        },
        404: {
            "description": "Unknown chart_id",
            "model": BaseAnalyticsResponse
        }
    }
)
async def get_chart(
    chart_id: str,
    username: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    job_match_service: JobMatchService = Depends(get_job_match_service)
) -> Response:
    """Retrieve a single named chart dataset on demand."""
    logger.info("Single chart endpoint accessed", chart_id=chart_id)

    if chart_id not in CHART_REGISTRY:
        logger.warning("Unknown chart_id requested", chart_id=chart_id)
        valid_ids = sorted(list(CHART_REGISTRY.keys()))
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": f"Chart ID '{chart_id}' not found. Valid chart IDs: {', '.join(valid_ids)}",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )

    config = CHART_REGISTRY[chart_id]

    # GitHub validation
    if config.requires_username:
        if not username or not username.strip():
            logger.warning("Missing required username parameter for GitHub chart", chart_id=chart_id)
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "message": f"Username query parameter is required for chart: '{chart_id}'",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "data": None
                }
            )
        
        if not GITHUB_USERNAME_REGEX.match(username):
            logger.warning("Malformed username provided for GitHub chart", username=username, chart_id=chart_id)
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "success": False,
                    "message": "Malformed GitHub username. Usernames must contain only alphanumeric characters or single hyphens and cannot start/end with hyphens or exceed 39 characters.",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "data": None
                }
            )

    try:
        chart_dataset = await analytics_service.get_chart_by_id(
            db=db,
            chart_id=chart_id,
            username=username,
            job_match_service=job_match_service
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "success": True,
                "message": "Chart generated successfully",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": jsonable_encoder(chart_dataset)
            }
        )
    except GitHubUserNotFound as e:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except GitHubRateLimitExceeded as e:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except (GitHubAPIError, GitHubRequestTimeout) as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "message": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )
    except Exception as e:
        logger.exception("Unexpected error in single chart endpoint", chart_id=chart_id, error=str(e))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": f"An unexpected error occurred while generating chart '{chart_id}'.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "data": None
            }
        )

