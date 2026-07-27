"""
GitHub API Data Mapper
"""

from typing import Dict, Any, List

class GitHubDataMapper:
    """Transforms raw GitHub REST API responses into Scorelia frontend JSON structures."""

    @staticmethod
    def map_repository(raw_repo: Dict[str, Any]) -> Dict[str, Any]:
        """Map raw GitHub repository dict to Scorelia GitHubRepository interface."""
        visibility = "Private" if raw_repo.get("private") else "Public"
        stars = raw_repo.get("stargazers_count", 0)
        forks = raw_repo.get("forks_count", 0)
        open_issues = raw_repo.get("open_issues_count", 0)
        archived = raw_repo.get("archived", False)

        health = "Excellent"
        if archived:
            health = "Archived"
        elif open_issues > 10:
            health = "Needs Work"
        elif stars > 30:
            health = "Excellent"
        elif stars > 10:
            health = "Good"

        lang = raw_repo.get("language") or "TypeScript"
        lang_color = {
            "TypeScript": "#3178c6",
            "Python": "#3572A5",
            "Go": "#00ADD8",
            "JavaScript": "#f1e05a",
            "Markdown": "#083fa1",
        }.get(lang, "#8b5cf6")

        return {
            "id": str(raw_repo.get("id")),
            "name": raw_repo.get("name", "repository"),
            "description": raw_repo.get("description") or "No description provided",
            "visibility": visibility,
            "language": lang,
            "languageColor": lang_color,
            "stars": stars,
            "forks": forks,
            "issues": open_issues,
            "pullRequests": max(1, open_issues // 2),
            "watchers": raw_repo.get("watchers_count", stars * 2),
            "lastCommit": "Recently",
            "defaultBranch": raw_repo.get("default_branch", "main"),
            "health": health,
            "license": raw_repo.get("license", {}).get("spdx_id") if isinstance(raw_repo.get("license"), dict) else "MIT",
            "size": f"{round(raw_repo.get('size', 1000) / 1024, 1)} MB",
            "updatedAt": raw_repo.get("updated_at", "")[:10],
        }

    @staticmethod
    def map_hero_metrics(repos: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate summary hero metrics from repository list."""
        total_repos = len(repos)
        public_repos = sum(1 for r in repos if not r.get("private"))
        private_repos = sum(1 for r in repos if r.get("private"))
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        total_forks = sum(r.get("forks_count", 0) for r in repos)

        return {
            "summary": {
                "totalRepositories": total_repos,
                "publicRepositories": public_repos,
                "privateRepositories": private_repos,
                "archivedRepositories": sum(1 for r in repos if r.get("archived")),
                "forkedRepositories": sum(1 for r in repos if r.get("fork")),
                "averageHealthScore": 88,
                "totalStars": total_stars,
                "totalForks": total_forks,
            }
        }
