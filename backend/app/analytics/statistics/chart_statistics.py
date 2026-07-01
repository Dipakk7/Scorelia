from typing import Callable, Any, Awaitable
from sqlalchemy.orm import Session
import structlog
from app.services.job_match import JobMatchService
from app.analytics.statistics.resume_statistics import ResumeStatistics
from app.analytics.statistics.ats_statistics import ATSStatistics
from app.analytics.statistics.job_statistics import JobStatistics
from app.analytics.statistics.github_statistics import GitHubStatistics

logger = structlog.get_logger()

class ChartConfig:
    def __init__(
        self,
        chart_type: str,
        title: str,
        source: Callable[[Session, str | None, JobMatchService | None], Awaitable[tuple[list[dict[str, Any]], dict[str, Any] | None]]],
        requires_username: bool = False
    ):
        self.chart_type = chart_type
        self.title = title
        self.source = source
        self.requires_username = requires_username

# Helper implementations for source functions

async def get_ats_grade_distribution(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve ATS grade distribution formatted as chart points."""
    logger.info("Generating ats-grade-distribution chart data")
    ats_data = ATSStatistics.get_ats_analytics_data(db)
    dist = ats_data.get("grade_distribution", {})
    points = [{"label": k, "value": v.get("count", 0)} for k, v in dist.items()]
    return points, None

async def get_ats_category_breakdown(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve ATS average score per category formatted as chart points."""
    logger.info("Generating ats-category-breakdown chart data")
    ats_data = ATSStatistics.get_ats_analytics_data(db)
    breakdown = ats_data.get("category_breakdown", {})
    points = [{"label": k, "value": v.get("average", 0.0)} for k, v in breakdown.items()]
    metadata = {"weights": {k: v.get("weight", 0) for k, v in breakdown.items()}}
    return points, metadata

async def get_job_match_distribution(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve Job Match score distribution formatted as chart points."""
    logger.info("Generating job-match-distribution chart data")
    if not job_match_service:
        logger.warning("JobMatchService is None, returning empty data for job-match-distribution")
        return [], None
    stats_data = job_match_service.get_match_statistics()
    job_data = JobStatistics.get_job_analytics_data(stats_data.get("matches", []))
    dist = job_data.get("distribution", {})
    points = [{"label": item.get("label", k), "value": item.get("value", 0)} for k, item in dist.items()]
    return points, None

async def get_job_skill_gaps(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve top missing skills formatted as chart points."""
    logger.info("Generating job-skill-gaps chart data")
    if not job_match_service:
        logger.warning("JobMatchService is None, returning empty data for job-skill-gaps")
        return [], None
    stats_data = job_match_service.get_match_statistics()
    job_data = JobStatistics.get_job_analytics_data(stats_data.get("matches", []))
    gaps = job_data.get("skill_gaps", {}).get("top_missing_skills", [])
    points = [{"label": item.get("label", ""), "value": item.get("value", 0)} for item in gaps]
    return points, None

async def get_resume_upload_timeline(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve chronological monthly resume upload counts."""
    logger.info("Generating resume-upload-timeline chart data")
    timeline_dates = ResumeStatistics.get_upload_timeline_dates(db)
    timeline_stats = ResumeStatistics.calculate_timeline_analytics(timeline_dates)
    monthly = timeline_stats.get("monthly", {})
    points = [{"label": k, "value": v} for k, v in sorted(monthly.items())]
    return points, None

async def get_resume_experience_distribution(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve resume experience cohort distribution."""
    logger.info("Generating resume-experience-distribution chart data")
    parsed_resumes_data = ResumeStatistics.get_parsed_resumes_data(db)
    experience_stats = ResumeStatistics.calculate_experience_analytics(parsed_resumes_data)
    dist = experience_stats.get("experience_distribution", {})
    points = [{"label": k, "value": v} for k, v in dist.items()]
    return points, None

async def get_resume_education_distribution(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve resume education degree distribution."""
    logger.info("Generating resume-education-distribution chart data")
    parsed_resumes_data = ResumeStatistics.get_parsed_resumes_data(db)
    education_stats = ResumeStatistics.calculate_education_analytics(parsed_resumes_data)
    dist = education_stats.get("education_distribution", {})
    points = [{"label": k, "value": v} for k, v in dist.items()]
    return points, None

async def get_resume_top_skills(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve top skills from resume parsing with counts."""
    logger.info("Generating resume-top-skills chart data")
    parsed_resumes_data = ResumeStatistics.get_parsed_resumes_data(db)
    skills_stats = ResumeStatistics.calculate_skills_analytics(parsed_resumes_data)
    top_skills = skills_stats.get("top_skills", [])
    skill_frequency = skills_stats.get("skill_frequency", {})
    points = [{"label": skill, "value": skill_frequency.get(skill, 0)} for skill in top_skills]
    return points, None

async def get_github_language_distribution(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve GitHub repository language distribution percentages."""
    logger.info("Generating github-language-distribution chart data", username=username)
    if not username:
        raise ValueError("GitHub username is required.")
    from app.analytics.github_service import GitHubService
    github_service = GitHubService()
    profile_data, repos_data = await github_service.fetch_profile_and_repos(username)
    repos_languages, is_partial = await github_service.fetch_languages_for_repos(username, repos_data)
    languages_summary = GitHubStatistics.calculate_languages_analytics(repos_languages)
    points = [{"label": item.get("label", ""), "value": item.get("value", 0.0)} for item in languages_summary.get("top_languages", [])]
    metadata = {"is_partial": is_partial}
    return points, metadata

async def get_github_repo_growth(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve GitHub repository creations count by year."""
    logger.info("Generating github-repo-growth chart data", username=username)
    if not username:
        raise ValueError("GitHub username is required.")
    from app.analytics.github_service import GitHubService
    github_service = GitHubService()
    profile_data, repos_data = await github_service.fetch_profile_and_repos(username)
    growth_summary = GitHubStatistics.calculate_growth_analytics(repos_data)
    points = [{"label": item.get("date", ""), "value": item.get("value", 0)} for item in growth_summary.get("repos_created_by_year", [])]
    return points, None

# Registry definition
CHART_REGISTRY: dict[str, ChartConfig] = {
    "ats-grade-distribution": ChartConfig(
        chart_type="pie",
        title="ATS Grade Distribution",
        source=get_ats_grade_distribution,
        requires_username=False
    ),
    "ats-score-distribution": ChartConfig(
        chart_type="pie",
        title="ATS Score Distribution",
        source=get_ats_grade_distribution,
        requires_username=False
    ),
    "ats-category-breakdown": ChartConfig(
        chart_type="bar",
        title="ATS Category Breakdown",
        source=get_ats_category_breakdown,
        requires_username=False
    ),
    "job-match-distribution": ChartConfig(
        chart_type="bar",
        title="Job Match Distribution",
        source=get_job_match_distribution,
        requires_username=False
    ),
    "job-skill-gaps": ChartConfig(
        chart_type="bar",
        title="Job Skill Gaps",
        source=get_job_skill_gaps,
        requires_username=False
    ),
    "resume-upload-timeline": ChartConfig(
        chart_type="line",
        title="Resume Upload Timeline",
        source=get_resume_upload_timeline,
        requires_username=False
    ),
    "resume-experience-distribution": ChartConfig(
        chart_type="bar",
        title="Resume Experience Distribution",
        source=get_resume_experience_distribution,
        requires_username=False
    ),
    "resume-education-distribution": ChartConfig(
        chart_type="pie",
        title="Resume Education Distribution",
        source=get_resume_education_distribution,
        requires_username=False
    ),
    "resume-top-skills": ChartConfig(
        chart_type="bar",
        title="Top Resume Skills",
        source=get_resume_top_skills,
        requires_username=False
    ),
    "top-skills": ChartConfig(
        chart_type="bar",
        title="Top Resume Skills",
        source=get_resume_top_skills,
        requires_username=False
    ),
    "github-language-distribution": ChartConfig(
        chart_type="pie",
        title="Language Distribution",
        source=get_github_language_distribution,
        requires_username=True
    ),
    "github-repo-growth": ChartConfig(
        chart_type="line",
        title="Repository Growth",
        source=get_github_repo_growth,
        requires_username=True
    )
}
