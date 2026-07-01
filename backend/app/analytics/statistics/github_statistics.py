from datetime import datetime, timezone
from collections import Counter
import structlog
from app.analytics.statistics.base import BaseStatistics

logger = structlog.get_logger()

# Developer Score heuristic weights
WEIGHT_LANGUAGE_DIVERSITY = 0.20
WEIGHT_ACTIVITY = 0.25
WEIGHT_COMMUNITY_ENGAGEMENT = 0.20
WEIGHT_CONSISTENCY = 0.20
WEIGHT_DOCUMENTATION = 0.15

class GitHubStatistics(BaseStatistics):
    """
    Calculations for GitHub profile and repository metadata.
    Operates on fetched GitHub API responses.
    """
    
    @classmethod
    def calculate_profile_age(cls, created_at_str: str) -> float:
        """
        Calculate account age in years from ISO-8601 creation string.
        """
        if not created_at_str:
            return 0.0
        try:
            clean_str = created_at_str.replace("Z", "+00:00")
            created_dt = datetime.fromisoformat(clean_str)
            now_dt = datetime.now(timezone.utc)
            delta = now_dt - created_dt
            age_years = delta.days / 365.25
            return round(max(0.0, age_years), 1)
        except Exception as e:
            logger.error("Failed to calculate GitHub profile age", created_at=created_at_str, error=str(e))
            return 0.0

    @classmethod
    def calculate_repository_summary(cls, repos: list[dict]) -> dict:
        """
        Calculate repository summary stats from the raw repository list.
        """
        total_repos = len(repos)
        if total_repos == 0:
            return {
                "total_repos": 0,
                "total_stars": 0,
                "total_forks": 0,
                "average_stars_per_repo": 0.0,
                "most_starred_repo": None,
                "top_repositories": []
            }

        total_stars = sum(repo.get("stargazers_count", 0) for repo in repos)
        total_forks = sum(repo.get("forks_count", 0) for repo in repos)
        average_stars = cls.safe_divide(total_stars, total_repos)

        sorted_repos = sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)

        most_starred = None
        if sorted_repos:
            best_repo = sorted_repos[0]
            most_starred = {
                "name": best_repo.get("name", ""),
                "stars": best_repo.get("stargazers_count", 0),
                "url": best_repo.get("html_url", "")
            }

        top_repos = []
        for r in sorted_repos[:5]:
            top_repos.append({
                "name": r.get("name", ""),
                "description": r.get("description", ""),
                "stars": r.get("stargazers_count", 0),
                "forks": r.get("forks_count", 0),
                "url": r.get("html_url", "")
            })

        return {
            "total_repos": total_repos,
            "total_stars": total_stars,
            "total_forks": total_forks,
            "average_stars_per_repo": round(average_stars, 1),
            "most_starred_repo": most_starred,
            "top_repositories": top_repos
        }

    @classmethod
    def calculate_languages_analytics(cls, repos_languages: dict[str, dict]) -> dict:
        """
        Aggregate language usage bytes across repos.
        Computes percentages and identifies primary language.
        """
        language_bytes: dict[str, int] = {}
        for repo_name, langs in repos_languages.items():
            if not isinstance(langs, dict):
                continue
            for lang, bytes_val in langs.items():
                language_bytes[lang] = language_bytes.get(lang, 0) + bytes_val

        total_bytes = sum(language_bytes.values())
        if total_bytes == 0:
            return {
                "top_languages": [],
                "total_languages_used": 0,
                "primary_language": None
            }

        # Calculate percentages
        languages_list = []
        for lang, val in language_bytes.items():
            pct = cls.percentage(val, total_bytes)
            languages_list.append({
                "label": lang,
                "value": pct
            })

        # Sort by percentage descending
        sorted_languages = sorted(languages_list, key=lambda l: l["value"], reverse=True)
        primary_lang = sorted_languages[0]["label"] if sorted_languages else None

        return {
            "top_languages": sorted_languages[:5],
            "total_languages_used": len(language_bytes),
            "primary_language": primary_lang
        }

    @classmethod
    def calculate_growth_analytics(cls, repos: list[dict]) -> dict:
        """
        Analyze repository creation dates for growth timeline.
        """
        if not repos:
            return {
                "repos_created_by_year": [],
                "newest_repo": None,
                "oldest_repo": None
            }

        years = []
        dated_repos = []
        for r in repos:
            created_str = r.get("created_at")
            if created_str:
                try:
                    dt = datetime.fromisoformat(created_str.replace("Z", "+00:00"))
                    years.append(str(dt.year))
                    dated_repos.append((dt, r.get("name", "")))
                except ValueError:
                    pass

        # Timeline grouped by year
        year_counts = Counter(years)
        growth_timeline = [{"date": yr, "value": count} for yr, count in sorted(year_counts.items())]

        # Newest and oldest repos
        newest_repo = None
        oldest_repo = None

        if dated_repos:
            sorted_by_date = sorted(dated_repos, key=lambda item: item[0])
            oldest_dt, oldest_name = sorted_by_date[0]
            newest_dt, newest_name = sorted_by_date[-1]

            oldest_repo = {
                "name": oldest_name,
                "created_at": oldest_dt.isoformat().replace("+00:00", "Z")
            }
            newest_repo = {
                "name": newest_name,
                "created_at": newest_dt.isoformat().replace("+00:00", "Z")
            }

        return {
            "repos_created_by_year": growth_timeline,
            "newest_repo": newest_repo,
            "oldest_repo": oldest_repo
        }

    @classmethod
    def calculate_size_analytics(cls, repos: list[dict]) -> dict:
        """
        Calculate repository size statistics in KB.
        """
        if not repos:
            return {
                "average_repo_size_kb": 0.0,
                "largest_repo": None
            }

        sizes = [r.get("size", 0) for r in repos]
        avg_size = cls.calculate_average(sizes)

        largest_repo = None
        sorted_by_size = sorted(repos, key=lambda r: r.get("size", 0), reverse=True)
        if sorted_by_size:
            big_repo = sorted_by_size[0]
            largest_repo = {
                "name": big_repo.get("name", ""),
                "size_kb": big_repo.get("size", 0)
            }

        return {
            "average_repo_size_kb": avg_size,
            "largest_repo": largest_repo
        }

    @classmethod
    def calculate_topics_analytics(cls, repos: list[dict]) -> dict:
        """
        Aggregate topics tags across all repos.
        """
        all_topics = []
        for r in repos:
            topics_list = r.get("topics")
            if topics_list and isinstance(topics_list, list):
                all_topics.extend(topics_list)

        if not all_topics:
            return {
                "top_topics": [],
                "total_unique_topics": 0
            }

        counts = Counter(all_topics)
        total_unique = len(counts)

        # Convert to label/value list
        topic_items = [{"label": topic, "value": count} for topic, count in counts.items()]
        # Sort by frequency descending
        sorted_topics = sorted(topic_items, key=lambda t: t["value"], reverse=True)

        return {
            "top_topics": sorted_topics[:5],
            "total_unique_topics": total_unique
        }

    @classmethod
    def calculate_activity_analytics(cls, repos: list[dict]) -> dict:
        """
        Analyze push events to compute activity metrics.
        """
        if not repos:
            return {
                "most_recently_active_repo": None,
                "repos_updated_this_month": 0,
                "activity_trend": []
            }

        now = datetime.now(timezone.utc)
        current_year_month = now.strftime("%Y-%m")

        dated_repos = []
        push_year_months = []
        repos_updated_this_month_count = 0

        for r in repos:
            pushed_str = r.get("pushed_at")
            if pushed_str:
                try:
                    dt = datetime.fromisoformat(pushed_str.replace("Z", "+00:00"))
                    ym = dt.strftime("%Y-%m")
                    push_year_months.append(ym)
                    dated_repos.append((dt, r.get("name", "")))
                    if ym == current_year_month:
                        repos_updated_this_month_count += 1
                except ValueError:
                    pass

        # Sort activity timeline by date
        ym_counts = Counter(push_year_months)
        activity_trend = [{"date": ym, "value": count} for ym, count in sorted(ym_counts.items())]

        most_recent = None
        if dated_repos:
            sorted_by_push = sorted(dated_repos, key=lambda item: item[0], reverse=True)
            active_dt, active_name = sorted_by_push[0]
            most_recent = {
                "name": active_name,
                "pushed_at": active_dt.isoformat().replace("+00:00", "Z")
            }

        return {
            "most_recently_active_repo": most_recent,
            "repos_updated_this_month": repos_updated_this_month_count,
            "activity_trend": activity_trend
        }

    @classmethod
    def calculate_developer_score(cls, repos: list[dict], unique_languages: list[str]) -> dict:
        """
        Compute CareerPilot-specific Developer Score heuristic.
        """
        if not repos:
            return {
                "developer_score": 0,
                "breakdown": {
                    "language_diversity": 0,
                    "activity": 0,
                    "community_engagement": 0,
                    "consistency": 0,
                    "documentation": 0
                }
            }

        # 1. Language diversity subscore
        # 5+ unique languages gives maximum score of 100
        diversity_score = min(100, len(unique_languages) * 20)

        # 2. Activity subscore
        # Recency of pushes (in days)
        now = datetime.now(timezone.utc)
        pushed_at_dates = []
        for r in repos:
            pushed_str = r.get("pushed_at")
            if pushed_str:
                try:
                    dt = datetime.fromisoformat(pushed_str.replace("Z", "+00:00"))
                    pushed_at_dates.append(dt)
                except ValueError:
                    pass

        if pushed_at_dates:
            most_recent_push = max(pushed_at_dates)
            days_since_push = (now - most_recent_push).days
            if days_since_push <= 30:
                activity_score = 100
            elif days_since_push <= 90:
                activity_score = 80
            elif days_since_push <= 180:
                activity_score = 50
            else:
                activity_score = 20
        else:
            activity_score = 0

        # 3. Community engagement subscore
        # Stars count heavily, forks count double. Cap at 100.
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        total_forks = sum(r.get("forks_count", 0) for r in repos)
        community_score = min(100, (total_stars * 4) + (total_forks * 8))

        # 4. Consistency subscore
        # Number of unique creation years (each year gives 25 points, capped at 4 years = 100)
        creation_years = set()
        for r in repos:
            created_str = r.get("created_at")
            if created_str:
                try:
                    dt = datetime.fromisoformat(created_str.replace("Z", "+00:00"))
                    creation_years.add(dt.year)
                except ValueError:
                    pass
        consistency_score = min(100, len(creation_years) * 25)

        # 5. Documentation subscore
        # Percentage of repos with a non-empty description
        repos_with_desc = sum(1 for r in repos if r.get("description") and r.get("description").strip())
        documentation_score = int(cls.percentage(repos_with_desc, len(repos)))

        # Composite score
        weighted_score = (
            (diversity_score * WEIGHT_LANGUAGE_DIVERSITY) +
            (activity_score * WEIGHT_ACTIVITY) +
            (community_score * WEIGHT_COMMUNITY_ENGAGEMENT) +
            (consistency_score * WEIGHT_CONSISTENCY) +
            (documentation_score * WEIGHT_DOCUMENTATION)
        )
        final_score = int(round(weighted_score))

        logger.info(
            "Developer score calculation completed",
            diversity_score=diversity_score,
            activity_score=activity_score,
            community_score=community_score,
            consistency_score=consistency_score,
            documentation_score=documentation_score,
            final_score=final_score
        )

        return {
            "developer_score": final_score,
            "breakdown": {
                "language_diversity": diversity_score,
                "activity": activity_score,
                "community_engagement": community_score,
                "consistency": consistency_score,
                "documentation": documentation_score
            }
        }
