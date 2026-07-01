import time
import structlog
from sqlalchemy.orm import Session

from app.schemas.resume import ResumeResponse
from app.analytics.schemas import (
    DashboardSummaryResponse, 
    LatestJobMatch,
    ResumeAnalyticsData,
    ResumeOverviewAnalytics,
    ResumeSkillsAnalytics,
    ResumeExperienceAnalytics,
    ResumeEducationAnalytics,
    ResumeTimelineAnalytics,
    ATSAnalyticsData,
    ATSOverviewAnalytics,
    ATSGradeDistribution,
    ATSGradeDistributionItem,
    ATSCategoryBreakdown,
    ATSCategoryBreakdownItem,
    ATSTrendAnalytics,
    ATSTrendItem,
    ATSWeaknessInsights,
    ATSInsightItem,
    JobAnalyticsData,
    JobOverviewAnalytics,
    JobDistribution,
    JobDistributionItem,
    JobSkillGapAnalytics,
    JobMissingSkillItem,
    JobTrendAnalytics,
    JobTrendItem,
    JobRecommendationsAnalytics,
    JobRecommendationItem,
    JobHistoryAnalytics,
    JobLatestMatch,
    GitHubAnalyticsData,
    GitHubProfileData,
    GitHubRepositorySummary,
    GitHubMostStarredRepo,
    GitHubTopRepositoryItem,
    GitHubRepositoryInsightsData,
    GitHubLanguagesAnalytics,
    GitHubLanguageDistributionItem,
    GitHubGrowthAnalytics,
    GitHubGrowthYearItem,
    GitHubRepoDateItem,
    GitHubSizeAnalytics,
    GitHubLargestRepoItem,
    GitHubTopicsAnalytics,
    GitHubTopicItem,
    GitHubActivityAnalytics,
    GitHubRepoPushItem,
    GitHubActivityTrendItem,
    GitHubDeveloperScore,
    GitHubDeveloperScoreBreakdown,
    ChartPoint,
    ChartDataset,
    ChartOverviewData
)
from app.analytics.statistics.chart_statistics import CHART_REGISTRY
from app.analytics.statistics import AnalyticsStatistics
from app.analytics.github_service import GitHubService
from app.services.job_match import get_history_summary, JobMatchService

logger = structlog.get_logger()

class AnalyticsService:
    def __init__(self) -> None:
        self.github_service = GitHubService()
        logger.info("Analytics module initialized")

    async def get_dashboard_summary(self, db: Session) -> DashboardSummaryResponse:
        """
        Orchestrate system-wide metrics calculation for the dashboard.
        Uses the Statistics layer for DB queries and decoupled service calls for job matches.
        """
        logger.info("Dashboard analytics requested")
        start_time = time.perf_counter()

        # Retrieve DB stats from the Statistics layer
        db_stats = AnalyticsStatistics.get_dashboard_db_stats(db)

        # Retrieve Job Match stats via public service function (decoupled)
        history_summary = get_history_summary()
        total_job_matches = history_summary["total_matches"]
        average_match_score = round(float(history_summary["average_score"]), 1)

        latest_job_match = None
        latest_match_entry = history_summary["latest_match"]
        if latest_match_entry:
            latest_job_match = LatestJobMatch(
                resume_id=str(latest_match_entry["resume_id"]),
                timestamp=latest_match_entry["timestamp"],
                overall_score=latest_match_entry["overall_score"],
                grade=latest_match_entry["grade"],
                job_title=latest_match_entry["job_title"],
                company=latest_match_entry["company"]
            )

        # Map DB latest resume if it exists
        latest_resume_db = db_stats["latest_resume"]
        latest_resume = ResumeResponse.model_validate(latest_resume_db) if latest_resume_db else None

        # Log completion metrics
        execution_time_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info("Dashboard generated successfully", execution_time_ms=round(execution_time_ms, 2))

        return DashboardSummaryResponse(
            total_users=db_stats["total_users"],
            total_resumes=db_stats["total_resumes"],
            parsed_resumes=db_stats["parsed_resumes"],
            total_job_matches=total_job_matches,
            average_ats_score=db_stats["average_ats_score"],
            average_match_score=average_match_score,
            latest_resume=latest_resume,
            latest_job_match=latest_job_match
        )

    async def get_resume_analytics(self, db: Session) -> ResumeAnalyticsData:
        """
        Orchestrate and calculate comprehensive Resume Analytics.
        Delegates database querying and math aggregations to the Statistics layer.
        """
        logger.info("Resume analytics requested")
        start_time = time.perf_counter()

        # 1. Retrieve raw database aggregates and metrics
        overview_stats = AnalyticsStatistics.get_resume_overview_stats(db)
        parsed_resumes_data = AnalyticsStatistics.get_parsed_resumes_data(db)
        upload_timeline_dates = AnalyticsStatistics.get_upload_timeline_dates(db)

        # 2. Run statistical calculations and normalizations
        skills_stats = AnalyticsStatistics.calculate_skills_analytics(parsed_resumes_data)
        experience_stats = AnalyticsStatistics.calculate_experience_analytics(parsed_resumes_data)
        education_stats = AnalyticsStatistics.calculate_education_analytics(parsed_resumes_data)
        timeline_stats = AnalyticsStatistics.calculate_timeline_analytics(upload_timeline_dates)

        # 3. Format into validated Pydantic sub-schemas
        overview = ResumeOverviewAnalytics(
            total_resumes=overview_stats["total_resumes"],
            parsed_resumes=overview_stats["parsed_resumes"],
            unparsed_resumes=overview_stats["unparsed_resumes"],
            parsing_success_rate=overview_stats["parsing_success_rate"],
            average_resume_length=overview_stats["average_resume_length"],
            oldest_resume=ResumeResponse.model_validate(overview_stats["oldest_resume"]) if overview_stats["oldest_resume"] else None,
            newest_resume=ResumeResponse.model_validate(overview_stats["newest_resume"]) if overview_stats["newest_resume"] else None,
            resumes_uploaded_this_week=overview_stats["resumes_uploaded_this_week"],
            resumes_uploaded_this_month=overview_stats["resumes_uploaded_this_month"]
        )

        skills = ResumeSkillsAnalytics(
            top_skills=skills_stats["top_skills"],
            total_unique_skills=skills_stats["total_unique_skills"],
            most_common_skill=skills_stats["most_common_skill"],
            skill_frequency=skills_stats["skill_frequency"]
        )

        experience = ResumeExperienceAnalytics(
            average_years_experience=experience_stats["average_years_experience"],
            experience_distribution=experience_stats["experience_distribution"]
        )

        education = ResumeEducationAnalytics(
            education_distribution=education_stats["education_distribution"]
        )

        timeline = ResumeTimelineAnalytics(
            daily=timeline_stats["daily"],
            weekly=timeline_stats["weekly"],
            monthly=timeline_stats["monthly"]
        )

        # Log completion metrics
        execution_time_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info("Resume analytics generated successfully", execution_time_ms=round(execution_time_ms, 2))

        return ResumeAnalyticsData(
            overview=overview,
            skills=skills,
            experience=experience,
            education=education,
            timeline=timeline
        )

    async def get_ats_analytics(self, db: Session) -> ATSAnalyticsData:
        """
        Orchestrate and calculate comprehensive ATS Scoring Analytics.
        Delegates queries and score aggregates to the ATSStatistics layer.
        """
        logger.info("ATS analytics requested")
        start_time = time.perf_counter()

        # Retrieve computed statistical aggregates
        ats_data = AnalyticsStatistics.get_ats_analytics_data(db)

        # Map to sub-schemas
        overview = ATSOverviewAnalytics(
            total_ats_evaluations=ats_data["overview"]["total_ats_evaluations"],
            average_ats_score=ats_data["overview"]["average_ats_score"],
            highest_ats_score=ats_data["overview"]["highest_ats_score"],
            lowest_ats_score=ats_data["overview"]["lowest_ats_score"],
            median_ats_score=ats_data["overview"]["median_ats_score"]
        )

        grade_distribution = ATSGradeDistribution(
            Excellent=ATSGradeDistributionItem(**ats_data["grade_distribution"]["Excellent"]),
            Good=ATSGradeDistributionItem(**ats_data["grade_distribution"]["Good"]),
            Fair=ATSGradeDistributionItem(**ats_data["grade_distribution"]["Fair"]),
            Needs_Improvement=ATSGradeDistributionItem(**ats_data["grade_distribution"]["Needs Improvement"])
        )

        category_breakdown = ATSCategoryBreakdown(
            contact=ATSCategoryBreakdownItem(**ats_data["category_breakdown"]["contact"]),
            skills=ATSCategoryBreakdownItem(**ats_data["category_breakdown"]["skills"]),
            education=ATSCategoryBreakdownItem(**ats_data["category_breakdown"]["education"]),
            experience=ATSCategoryBreakdownItem(**ats_data["category_breakdown"]["experience"]),
            projects=ATSCategoryBreakdownItem(**ats_data["category_breakdown"]["projects"]),
            certifications=ATSCategoryBreakdownItem(**ats_data["category_breakdown"]["certifications"])
        )

        trend = ATSTrendAnalytics(
            score_trend=[ATSTrendItem(**item) for item in ats_data["trend"]["score_trend"]],
            improvement_rate=ats_data["trend"]["improvement_rate"]
        )

        weaknesses = ATSWeaknessInsights(
            top_weaknesses=[ATSInsightItem(**item) for item in ats_data["weaknesses"]["top_weaknesses"]],
            top_recommendations=[ATSInsightItem(**item) for item in ats_data["weaknesses"]["top_recommendations"]]
        )

        # Log completion metrics
        execution_time_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info("ATS analytics generated successfully", execution_time_ms=round(execution_time_ms, 2))

        return ATSAnalyticsData(
            overview=overview,
            grade_distribution=grade_distribution,
            category_breakdown=category_breakdown,
            trend=trend,
            weaknesses=weaknesses
        )

    async def get_job_analytics(self, db: Session, job_match_service: JobMatchService) -> JobAnalyticsData:
        """
        Orchestrate and calculate Job Match analytics.
        Uses JobMatchService dependency injection to pull statistics.
        """
        logger.info("Job analytics requested")
        start_time = time.perf_counter()

        try:
            # Measure JobMatchService call duration
            start_service_call = time.perf_counter()
            stats_data = job_match_service.get_match_statistics()
            service_call_duration_ms = (time.perf_counter() - start_service_call) * 1000.0
            logger.info("JobMatchService call duration", duration_ms=round(service_call_duration_ms, 2))
        except Exception as e:
            logger.error("JobMatchService call failure", error=str(e))
            # Gracefully handle service failures with empty metrics
            stats_data = {"matches": []}

        # Calculate statistics using JobStatistics package
        job_data = AnalyticsStatistics.get_job_analytics_data(stats_data.get("matches", []))

        # Map to sub-schemas
        overview = JobOverviewAnalytics(
            total_job_matches=job_data["overview"]["total_job_matches"],
            average_match_score=job_data["overview"]["average_match_score"],
            highest_match_score=job_data["overview"]["highest_match_score"],
            lowest_match_score=job_data["overview"]["lowest_match_score"],
            median_match_score=job_data["overview"]["median_match_score"]
        )

        distribution = JobDistribution(
            **{
                "90–100%": JobDistributionItem(**job_data["distribution"]["90–100%"]),
                "80–89%": JobDistributionItem(**job_data["distribution"]["80–89%"]),
                "70–79%": JobDistributionItem(**job_data["distribution"]["70–79%"]),
                "60–69%": JobDistributionItem(**job_data["distribution"]["60–69%"]),
                "Below 60%": JobDistributionItem(**job_data["distribution"]["Below 60%"])
            }
        )

        skill_gaps = JobSkillGapAnalytics(
            top_missing_skills=[JobMissingSkillItem(**item) for item in job_data["skill_gaps"]["top_missing_skills"]],
            missing_skill_frequency=job_data["skill_gaps"]["missing_skill_frequency"],
            total_unique_missing_skills=job_data["skill_gaps"]["total_unique_missing_skills"]
        )

        trend = JobTrendAnalytics(
            score_trend=[JobTrendItem(**item) for item in job_data["trend"]["score_trend"]]
        )

        recommendations = JobRecommendationsAnalytics(
            top_recommendations=[JobRecommendationItem(**item) for item in job_data["recommendations"]["top_recommendations"]]
        )

        latest_match_data = job_data["history"]["latest_match"]
        latest_match = JobLatestMatch(**latest_match_data) if latest_match_data else None

        history = JobHistoryAnalytics(
            total_matches=job_data["history"]["total_matches"],
            latest_match=latest_match,
            average_matches_per_resume=job_data["history"]["average_matches_per_resume"],
            repeated_job_descriptions=job_data["history"]["repeated_job_descriptions"],
            historical_match_growth=job_data["history"]["historical_match_growth"]
        )

        # Log completion metrics
        execution_time_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info("Job analytics generated successfully", execution_time_ms=round(execution_time_ms, 2))

        return JobAnalyticsData(
            overview=overview,
            distribution=distribution,
            skill_gaps=skill_gaps,
            trend=trend,
            recommendations=recommendations,
            history=history
        )

    async def get_github_profile_analytics(self, username: str) -> GitHubAnalyticsData:
        """
        Orchestrates GitHub profile analytics retrieval and calculation.
        """
        logger.info("GitHub profile analytics requested", username=username)
        start_time = time.perf_counter()
        
        # 1. Fetch data through the service
        profile_data, repos_data = await self.github_service.fetch_profile_and_repos(username)
        
        # 2. Run calculations in GitHubStatistics
        age_years = AnalyticsStatistics.calculate_profile_age(profile_data.get("created_at", ""))
        repo_summary = AnalyticsStatistics.calculate_repository_summary(repos_data)
        
        # 3. Format profile info
        profile = GitHubProfileData(
            username=profile_data.get("login", username),
            name=profile_data.get("name"),
            bio=profile_data.get("bio"),
            avatar_url=profile_data.get("avatar_url", ""),
            followers=profile_data.get("followers", 0),
            following=profile_data.get("following", 0),
            public_repos_count=profile_data.get("public_repos", 0),
            account_created_at=profile_data.get("created_at", ""),
            account_age_years=age_years
        )
        
        # 4. Format repository summary
        most_starred = None
        if repo_summary["most_starred_repo"]:
            most_starred = GitHubMostStarredRepo(
                name=repo_summary["most_starred_repo"]["name"],
                stars=repo_summary["most_starred_repo"]["stars"],
                url=repo_summary["most_starred_repo"]["url"]
            )
            
        top_repos = [
            GitHubTopRepositoryItem(
                name=item["name"],
                description=item["description"],
                stars=item["stars"],
                forks=item["forks"],
                url=item["url"]
            ) for item in repo_summary["top_repositories"]
        ]
        
        repository_summary = GitHubRepositorySummary(
            total_repos=repo_summary["total_repos"],
            total_stars=repo_summary["total_stars"],
            total_forks=repo_summary["total_forks"],
            average_stars_per_repo=repo_summary["average_stars_per_repo"],
            most_starred_repo=most_starred,
            top_repositories=top_repos
        )
        
        duration_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info("GitHub profile analytics generated successfully", username=username, duration_ms=round(duration_ms, 2))

        return GitHubAnalyticsData(
            profile=profile,
            repository_summary=repository_summary
        )

    async def get_github_repository_insights(self, username: str) -> tuple[GitHubRepositoryInsightsData, bool]:
        """
        Orchestrates calculation of GitHub repository insights.
        Returns the insights data and a boolean indicating if it is partial due to rate limits.
        """
        logger.info("GitHub insights requested", username=username)
        start_time = time.perf_counter()

        # 1. Fetch user data (repos list)
        profile_data, repos_data = await self.github_service.fetch_profile_and_repos(username)

        # 2. Fetch language data for repos (capped to top 10 and cached)
        repos_languages, is_partial = await self.github_service.fetch_languages_for_repos(username, repos_data)

        # 3. Calculate statistics
        languages_summary = AnalyticsStatistics.calculate_languages_analytics(repos_languages)
        growth_summary = AnalyticsStatistics.calculate_growth_analytics(repos_data)
        size_summary = AnalyticsStatistics.calculate_size_analytics(repos_data)
        topics_summary = AnalyticsStatistics.calculate_topics_analytics(repos_data)
        activity_summary = AnalyticsStatistics.calculate_activity_analytics(repos_data)

        # Collect unique languages to calculate developer score
        unique_languages = set()
        for langs in repos_languages.values():
            if isinstance(langs, dict):
                unique_languages.update(langs.keys())
        
        dev_score_summary = AnalyticsStatistics.calculate_developer_score(repos_data, list(unique_languages))

        # 4. Map to Pydantic schemas
        languages_schema = GitHubLanguagesAnalytics(
            top_languages=[
                GitHubLanguageDistributionItem(label=item["label"], value=item["value"])
                for item in languages_summary["top_languages"]
            ],
            total_languages_used=languages_summary["total_languages_used"],
            primary_language=languages_summary["primary_language"]
        )

        growth_schema = GitHubGrowthAnalytics(
            repos_created_by_year=[
                GitHubGrowthYearItem(date=item["date"], value=item["value"])
                for item in growth_summary["repos_created_by_year"]
            ],
            newest_repo=GitHubRepoDateItem(**growth_summary["newest_repo"]) if growth_summary["newest_repo"] else None,
            oldest_repo=GitHubRepoDateItem(**growth_summary["oldest_repo"]) if growth_summary["oldest_repo"] else None
        )

        largest_repo = None
        if size_summary["largest_repo"]:
            largest_repo = GitHubLargestRepoItem(
                name=size_summary["largest_repo"]["name"],
                size_kb=size_summary["largest_repo"]["size_kb"]
            )
        size_schema = GitHubSizeAnalytics(
            average_repo_size_kb=size_summary["average_repo_size_kb"],
            largest_repo=largest_repo
        )

        topics_schema = GitHubTopicsAnalytics(
            top_topics=[
                GitHubTopicItem(label=item["label"], value=item["value"])
                for item in topics_summary["top_topics"]
            ],
            total_unique_topics=topics_summary["total_unique_topics"]
        )

        most_recently_active = None
        if activity_summary["most_recently_active_repo"]:
            most_recently_active = GitHubRepoPushItem(
                name=activity_summary["most_recently_active_repo"]["name"],
                pushed_at=activity_summary["most_recently_active_repo"]["pushed_at"]
            )
        activity_schema = GitHubActivityAnalytics(
            most_recently_active_repo=most_recently_active,
            repos_updated_this_month=activity_summary["repos_updated_this_month"],
            activity_trend=[
                GitHubActivityTrendItem(date=item["date"], value=item["value"])
                for item in activity_summary["activity_trend"]
            ]
        )

        dev_score_schema = GitHubDeveloperScore(
            developer_score=dev_score_summary["developer_score"],
            breakdown=GitHubDeveloperScoreBreakdown(**dev_score_summary["breakdown"])
        )

        partial_reason = None
        if is_partial:
            partial_reason = "GitHub API rate limit or warning hit during language fetch. Returned partial analytics."

        insights_data = GitHubRepositoryInsightsData(
            languages=languages_schema,
            growth=growth_schema,
            size=size_schema,
            topics=topics_schema,
            activity=activity_schema,
            developer_score=dev_score_schema,
            is_partial=is_partial,
            partial_reason=partial_reason
        )

        duration_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            "GitHub repository insights generated successfully",
            username=username,
            duration_ms=round(duration_ms, 2),
            is_partial=is_partial
        )

        return insights_data, is_partial

    async def get_chart_by_id(
        self,
        db: Session,
        chart_id: str,
        username: str | None = None,
        job_match_service: JobMatchService | None = None
    ) -> ChartDataset:
        """
        Retrieve a single chart by its ID, validating inputs and invoking the source registry.
        """
        logger.info("Single chart requested", chart_id=chart_id)
        start_time = time.perf_counter()

        if chart_id not in CHART_REGISTRY:
            logger.warning("Unknown chart_id requested", chart_id=chart_id)
            raise KeyError(f"Unknown chart_id: '{chart_id}'")

        config = CHART_REGISTRY[chart_id]

        if config.requires_username and (not username or not username.strip()):
            logger.warning("Username missing for user-scoped chart", chart_id=chart_id)
            raise ValueError(f"GitHub username is required for chart: '{chart_id}'")

        try:
            data, metadata = await config.source(db, username, job_match_service)
            points = [ChartPoint(label=p["label"], value=p["value"]) for p in data]

            execution_time_ms = (time.perf_counter() - start_time) * 1000.0
            logger.info(
                "Chart generated successfully",
                chart_id=chart_id,
                execution_time_ms=round(execution_time_ms, 2)
            )

            return ChartDataset(
                chart_id=chart_id,
                chart_type=config.chart_type,
                title=config.title,
                data=points,
                metadata=metadata
            )
        except Exception as e:
            logger.exception("Failed to execute chart source query", chart_id=chart_id, error=str(e))
            raise

    async def get_charts_overview(
        self,
        db: Session,
        job_match_service: JobMatchService | None = None
    ) -> ChartOverviewData:
        """
        Retrieve a curated set of general dashboard overview charts, skipping failed modules.
        """
        logger.info("Charts overview requested")
        start_time = time.perf_counter()

        curated_ids = [
            "ats-score-distribution",
            "job-match-distribution",
            "resume-upload-timeline",
            "top-skills"
        ]

        charts = []
        omitted_charts = {}

        for chart_id in curated_ids:
            try:
                # Overview charts do not require username
                chart_dataset = await self.get_chart_by_id(
                    db=db,
                    chart_id=chart_id,
                    job_match_service=job_match_service
                )
                charts.append(chart_dataset)
            except Exception as e:
                logger.error(
                    "Skipping chart in overview due to error",
                    chart_id=chart_id,
                    error=str(e)
                )
                omitted_charts[chart_id] = str(e)

        execution_time_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            "Charts overview generated",
            execution_time_ms=round(execution_time_ms, 2),
            successful_charts=len(charts),
            omitted_charts=len(omitted_charts)
        )

        return ChartOverviewData(
            charts=charts,
            omitted_charts=omitted_charts if omitted_charts else None
        )


# Global service instance
analytics_service = AnalyticsService()
