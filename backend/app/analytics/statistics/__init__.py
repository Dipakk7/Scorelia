from app.analytics.statistics.resume_statistics import ResumeStatistics
from app.analytics.statistics.ats_statistics import ATSStatistics
from app.analytics.statistics.job_statistics import JobStatistics
from app.analytics.statistics.github_statistics import GitHubStatistics

class AnalyticsStatistics(ResumeStatistics, ATSStatistics, JobStatistics, GitHubStatistics):
    """
    Backward-compatible facade class forwarding query calls to ResumeStatistics,
    ATSStatistics, JobStatistics, and GitHubStatistics.
    """
    pass

__all__ = ["ResumeStatistics", "ATSStatistics", "JobStatistics", "GitHubStatistics", "AnalyticsStatistics"]
