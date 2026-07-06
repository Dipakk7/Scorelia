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
        source: Callable[..., Awaitable[tuple[list[dict[str, Any]], dict[str, Any] | None]]],
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

async def get_resume_score_trend(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None,
    user_id: Any = None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve resume ATS score trend over time."""
    from app.models.resume import Resume
    if not user_id:
        return [], None
    resumes = db.query(Resume).filter(Resume.user_id == user_id, Resume.ats_score.isnot(None)).order_by(Resume.uploaded_at.asc()).all()
    points = [{"label": r.original_filename or f"Resume {i+1}", "value": r.ats_score} for i, r in enumerate(resumes)]
    return points, None

async def get_ats_trend(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None,
    user_id: Any = None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve ATS evaluation score trend over time."""
    from app.models.resume import Resume
    if not user_id:
        return [], None
    resumes = db.query(Resume).filter(Resume.user_id == user_id, Resume.ats_score.isnot(None)).order_by(Resume.uploaded_at.asc()).all()
    points = [{"label": r.uploaded_at.strftime("%Y-%m-%d") if r.uploaded_at else f"CV-{i+1}", "value": r.ats_score} for i, r in enumerate(resumes)]
    return points, None

async def get_job_match_trend(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None,
    user_id: Any = None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve job match score trend history."""
    from app.services.job_match.history import _history_cache
    from app.models.resume import Resume
    if not user_id:
        return [], None
    user_resumes = db.query(Resume).filter(Resume.user_id == user_id).all()
    resume_ids = {str(r.id) for r in user_resumes}
    user_matches = [item for item in _history_cache if str(item.get("resume_id")) in resume_ids]
    points = [{"label": item.get("job_title", "Match")[:15], "value": item.get("overall_score", 0)} for item in user_matches]
    return points, None

async def get_interview_performance(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None,
    user_id: Any = None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve interview session performance score history."""
    from app.interview.models.interview import InterviewSession, InterviewTurn
    from sqlalchemy import func
    if not user_id:
        return [], None
    sessions = db.query(InterviewSession).filter(InterviewSession.user_id == user_id).order_by(InterviewSession.created_at.asc()).all()
    points = []
    for i, s in enumerate(sessions):
        avg_score = db.query(func.avg(InterviewTurn.score)).filter(
            InterviewTurn.session_id == s.id, InterviewTurn.score.isnot(None)
        ).scalar()
        score = round(float(avg_score), 1) if avg_score is not None else 0.0
        points.append({
            "label": f"Session {i+1}",
            "value": score
        })
    return points, None

async def get_weekly_activity(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None,
    user_id: Any = None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve aggregated activity counts by day of week for the past 7 days."""
    import datetime
    from app.models.resume import Resume
    from app.interview.models.interview import InterviewSession
    from app.cover_letter.models.ai_cover_letter import AICoverLetter
    
    if not user_id:
        return [], None
        
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    counts = {d: 0 for d in days}
    
    now = datetime.datetime.utcnow()
    start_date = now - datetime.timedelta(days=7)
    
    resumes = db.query(Resume).filter(Resume.user_id == user_id, Resume.uploaded_at >= start_date).all()
    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == user_id, InterviewSession.created_at >= start_date).all()
    letters = db.query(AICoverLetter).filter(AICoverLetter.user_id == user_id, AICoverLetter.created_at >= start_date).all()
    
    for r in resumes:
        d = r.uploaded_at.strftime("%a")
        if d in counts:
            counts[d] += 1
    for iv in interviews:
        d = iv.created_at.strftime("%a")
        if d in counts:
            counts[d] += 1
    for l in letters:
        d = l.created_at.strftime("%a")
        if d in counts:
            counts[d] += 1
            
    points = [{"label": d, "value": counts[d]} for d in days]
    return points, None

async def get_monthly_activity(
    db: Session,
    username: str | None,
    job_match_service: JobMatchService | None,
    user_id: Any = None
) -> tuple[list[dict[str, Any]], dict[str, Any] | None]:
    """Retrieve aggregated activity counts by month for the current year."""
    import datetime
    from app.models.resume import Resume
    from app.interview.models.interview import InterviewSession
    from app.cover_letter.models.ai_cover_letter import AICoverLetter
    
    if not user_id:
        return [], None
        
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    counts = {m: 0 for m in months}
    
    now = datetime.datetime.utcnow()
    start_date = datetime.datetime(now.year, 1, 1)
    
    resumes = db.query(Resume).filter(Resume.user_id == user_id, Resume.uploaded_at >= start_date).all()
    interviews = db.query(InterviewSession).filter(InterviewSession.user_id == user_id, InterviewSession.created_at >= start_date).all()
    letters = db.query(AICoverLetter).filter(AICoverLetter.user_id == user_id, AICoverLetter.created_at >= start_date).all()
    
    for r in resumes:
        m = r.uploaded_at.strftime("%b")
        if m in counts:
            counts[m] += 1
    for iv in interviews:
        m = iv.created_at.strftime("%b")
        if m in counts:
            counts[m] += 1
    for l in letters:
        m = l.created_at.strftime("%b")
        if m in counts:
            counts[m] += 1
            
    points = [{"label": m, "value": counts[m]} for m in months]
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
    ),
    "resume-score-trend": ChartConfig(
        chart_type="line",
        title="Resume Score Trend",
        source=get_resume_score_trend,
        requires_username=False
    ),
    "ats-trend": ChartConfig(
        chart_type="line",
        title="ATS Trend",
        source=get_ats_trend,
        requires_username=False
    ),
    "job-match-trend": ChartConfig(
        chart_type="line",
        title="Job Match Trend",
        source=get_job_match_trend,
        requires_username=False
    ),
    "interview-performance": ChartConfig(
        chart_type="line",
        title="Interview Performance",
        source=get_interview_performance,
        requires_username=False
    ),
    "weekly-activity": ChartConfig(
        chart_type="bar",
        title="Weekly Activity",
        source=get_weekly_activity,
        requires_username=False
    ),
    "monthly-activity": ChartConfig(
        chart_type="bar",
        title="Monthly Activity",
        source=get_monthly_activity,
        requires_username=False
    )
}
