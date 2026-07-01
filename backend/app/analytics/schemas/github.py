from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

class GitHubMostStarredRepo(BaseModel):
    name: str = Field(..., description="Name of the most starred repository")
    stars: int = Field(..., description="Number of stars")
    url: str = Field(..., description="URL of the repository")

    model_config = ConfigDict(from_attributes=True)

class GitHubTopRepositoryItem(BaseModel):
    name: str = Field(..., description="Name of the repository")
    description: str | None = Field(None, description="Description of the repository")
    stars: int = Field(..., description="Number of stars")
    forks: int = Field(..., description="Number of forks")
    url: str = Field(..., description="URL of the repository")

    model_config = ConfigDict(from_attributes=True)

class GitHubProfileData(BaseModel):
    username: str = Field(..., description="GitHub username")
    name: str | None = Field(None, description="User's display name")
    bio: str | None = Field(None, description="User's biography")
    avatar_url: str = Field(..., description="User's avatar URL")
    followers: int = Field(..., description="Number of followers")
    following: int = Field(..., description="Number of following users")
    public_repos_count: int = Field(..., description="Number of public repositories in profile")
    account_created_at: str = Field(..., description="Account creation date (ISO string)")
    account_age_years: float = Field(..., description="Account age in years")

    model_config = ConfigDict(from_attributes=True)

class GitHubRepositorySummary(BaseModel):
    total_repos: int = Field(..., description="Total repositories fetched")
    total_stars: int = Field(..., description="Total stars across repositories")
    total_forks: int = Field(..., description="Total forks across repositories")
    average_stars_per_repo: float = Field(..., description="Average stars per repository")
    most_starred_repo: GitHubMostStarredRepo | None = Field(None, description="Most starred repository details")
    top_repositories: list[GitHubTopRepositoryItem] = Field(default_factory=list, description="Top 5 repositories sorted by stars")

    model_config = ConfigDict(from_attributes=True)

class GitHubAnalyticsData(BaseModel):
    profile: GitHubProfileData = Field(..., description="Profile-level analytics data")
    repository_summary: GitHubRepositorySummary = Field(..., description="Repository summary metrics")

    model_config = ConfigDict(from_attributes=True)

class GitHubAnalyticsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: GitHubAnalyticsData | None = Field(None, description="GitHub analytics data container")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "GitHub profile analytics generated successfully",
                "timestamp": "2026-07-01T10:00:00Z",
                "data": {
                    "profile": {
                        "username": "octocat",
                        "name": "The Octocat",
                        "bio": "There once was a cat...",
                        "avatar_url": "https://avatars.githubusercontent.com/u/5832347?v=4",
                        "followers": 120,
                        "following": 9,
                        "public_repos_count": 8,
                        "account_created_at": "2011-01-25T18:44:36Z",
                        "account_age_years": 15.4
                    },
                    "repository_summary": {
                        "total_repos": 8,
                        "total_stars": 1500,
                        "total_forks": 300,
                        "average_stars_per_repo": 187.5,
                        "most_starred_repo": {
                            "name": "boysenberry-repo-1",
                            "stars": 1000,
                            "url": "https://github.com/octocat/boysenberry-repo-1"
                        },
                        "top_repositories": [
                            {
                                "name": "boysenberry-repo-1",
                                "description": "Testing repo",
                                "stars": 1000,
                                "forks": 200,
                                "url": "https://github.com/octocat/boysenberry-repo-1"
                            }
                        ]
                    }
                }
            }
        }
    )


class GitHubLanguageDistributionItem(BaseModel):
    label: str = Field(..., description="Language name")
    value: float = Field(..., description="Percentage of total bytes")

    model_config = ConfigDict(from_attributes=True)

class GitHubLanguagesAnalytics(BaseModel):
    top_languages: list[GitHubLanguageDistributionItem] = Field(default_factory=list, description="Top 5 languages as label/value pairs")
    total_languages_used: int = Field(..., description="Total count of unique languages used")
    primary_language: str | None = Field(None, description="Most used language across repositories")

    model_config = ConfigDict(from_attributes=True)

class GitHubGrowthYearItem(BaseModel):
    date: str = Field(..., description="Year string")
    value: int = Field(..., description="Number of repositories created")

    model_config = ConfigDict(from_attributes=True)

class GitHubRepoDateItem(BaseModel):
    name: str = Field(..., description="Repository name")
    created_at: str = Field(..., description="Creation date string")

    model_config = ConfigDict(from_attributes=True)

class GitHubGrowthAnalytics(BaseModel):
    repos_created_by_year: list[GitHubGrowthYearItem] = Field(default_factory=list, description="Timeline of repo creations by year")
    newest_repo: GitHubRepoDateItem | None = Field(None, description="Details of the newest repository")
    oldest_repo: GitHubRepoDateItem | None = Field(None, description="Details of the oldest repository")

    model_config = ConfigDict(from_attributes=True)

class GitHubLargestRepoItem(BaseModel):
    name: str = Field(..., description="Repository name")
    size_kb: int = Field(..., description="Size in KB")

    model_config = ConfigDict(from_attributes=True)

class GitHubSizeAnalytics(BaseModel):
    average_repo_size_kb: float = Field(..., description="Average repository size in KB")
    largest_repo: GitHubLargestRepoItem | None = Field(None, description="Details of the largest repository")

    model_config = ConfigDict(from_attributes=True)

class GitHubTopicItem(BaseModel):
    label: str = Field(..., description="Topic name")
    value: int = Field(..., description="Frequency of the topic")

    model_config = ConfigDict(from_attributes=True)

class GitHubTopicsAnalytics(BaseModel):
    top_topics: list[GitHubTopicItem] = Field(default_factory=list, description="Top 5 topics as label/value pairs")
    total_unique_topics: int = Field(..., description="Total count of unique topics")

    model_config = ConfigDict(from_attributes=True)

class GitHubRepoPushItem(BaseModel):
    name: str = Field(..., description="Repository name")
    pushed_at: str = Field(..., description="Most recent pushed timestamp")

    model_config = ConfigDict(from_attributes=True)

class GitHubActivityTrendItem(BaseModel):
    date: str = Field(..., description="Timeline period key (e.g. YYYY-MM)")
    value: int = Field(..., description="Number of repositories pushed to in this period")

    model_config = ConfigDict(from_attributes=True)

class GitHubActivityAnalytics(BaseModel):
    most_recently_active_repo: GitHubRepoPushItem | None = Field(None, description="Details of the most recently active repository")
    repos_updated_this_month: int = Field(..., description="Count of repositories pushed to in the current calendar month")
    activity_trend: list[GitHubActivityTrendItem] = Field(default_factory=list, description="Timeline of push activity grouped by month")

    model_config = ConfigDict(from_attributes=True)

class GitHubDeveloperScoreBreakdown(BaseModel):
    language_diversity: int = Field(..., description="Language diversity subscore (0-100)")
    activity: int = Field(..., description="Repository recency subscore (0-100)")
    community_engagement: int = Field(..., description="Stars and forks engagement subscore (0-100)")
    consistency: int = Field(..., description="Creation longevity and consistency subscore (0-100)")
    documentation: int = Field(..., description="Documentation completeness subscore (0-100)")

    model_config = ConfigDict(from_attributes=True)

class GitHubDeveloperScore(BaseModel):
    developer_score: int = Field(..., description="Weighted composite Developer Score (0-100)")
    breakdown: GitHubDeveloperScoreBreakdown = Field(..., description="Subscores breakdown")

    model_config = ConfigDict(from_attributes=True)

class GitHubRepositoryInsightsData(BaseModel):
    languages: GitHubLanguagesAnalytics
    growth: GitHubGrowthAnalytics
    size: GitHubSizeAnalytics
    topics: GitHubTopicsAnalytics
    activity: GitHubActivityAnalytics
    developer_score: GitHubDeveloperScore
    is_partial: bool = Field(default=False, description="Flag indicating if the language stats are partial due to rate limiting")
    partial_reason: str | None = Field(default=None, description="Detailed explanation if results are partial")

    model_config = ConfigDict(from_attributes=True)

class GitHubRepositoryInsightsResponse(BaseModel):
    success: bool = Field(..., description="Success flag")
    message: str = Field(..., description="Response message detail")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="UTC timestamp of the response")
    data: GitHubRepositoryInsightsData | None = Field(None, description="GitHub repository insights data container")

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "success": True,
                "message": "GitHub repository insights generated successfully",
                "timestamp": "2026-07-01T10:00:00Z",
                "data": {
                    "languages": {
                        "top_languages": [
                            {"label": "Python", "value": 60.5},
                            {"label": "JavaScript", "value": 39.5}
                        ],
                        "total_languages_used": 2,
                        "primary_language": "Python"
                    },
                    "growth": {
                        "repos_created_by_year": [
                            {"date": "2025", "value": 2},
                            {"date": "2026", "value": 1}
                        ],
                        "newest_repo": {"name": "repo-new", "created_at": "2026-01-10T12:00:00Z"},
                        "oldest_repo": {"name": "repo-old", "created_at": "2025-05-15T09:30:00Z"}
                    },
                    "size": {
                        "average_repo_size_kb": 150.5,
                        "largest_repo": {"name": "repo-big", "size_kb": 300}
                    },
                    "topics": {
                        "top_topics": [
                            {"label": "fastapi", "value": 2},
                            {"label": "nlp", "value": 1}
                        ],
                        "total_unique_topics": 2
                    },
                    "activity": {
                        "most_recently_active_repo": {"name": "repo-new", "pushed_at": "2026-07-01T09:00:00Z"},
                        "repos_updated_this_month": 1,
                        "activity_trend": [
                            {"date": "2026-07", "value": 1}
                        ]
                    },
                    "developer_score": {
                        "developer_score": 75,
                        "breakdown": {
                            "language_diversity": 40,
                            "activity": 100,
                            "community_engagement": 10,
                            "consistency": 50,
                            "documentation": 100
                        }
                    },
                    "is_partial": False,
                    "partial_reason": None
                }
            }
        }
    )

