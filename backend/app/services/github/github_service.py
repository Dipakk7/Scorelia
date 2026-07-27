"""
GitHub Service Coordinator
"""

from typing import Dict, Any, Optional
from app.services.github.github_client import GitHubClient
from app.services.github.github_mapper import GitHubDataMapper
from app.services.github.github_cache import github_cache

class GitHubService:
    """Service layer managing GitHub requests, caching, and data mapping."""

    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.client = GitHubClient(token=token)

    async def get_connection_status(self) -> Dict[str, Any]:
        """Fetch connection status and rate limit details."""
        connected = bool(self.token)
        username = None

        if connected:
            cached_profile = github_cache.get("user_profile")
            if cached_profile:
                username = cached_profile.get("login")
            else:
                try:
                    profile = await self.client.get_user_profile()
                    github_cache.set("user_profile", profile, custom_ttl=600)
                    username = profile.get("login")
                except Exception:
                    connected = False

        return {
            "isConnected": connected,
            "username": username or "Guest User",
            "avatarUrl": f"https://github.com/{username}.png" if username else None,
            "rateLimit": self.client.rate_limit_info.to_dict(),
            "lastSyncedAt": "Just now",
        }

    async def get_repositories(self) -> Dict[str, Any]:
        """Fetch mapped repository list."""
        cached_repos = github_cache.get("mapped_repositories")
        if cached_repos:
            return cached_repos

        if not self.token:
            return {}

        try:
            raw_repos = await self.client.list_repositories()
            mapped = [GitHubDataMapper.map_repository(r) for r in raw_repos]
            summary = GitHubDataMapper.map_hero_metrics(raw_repos)["summary"]
            
            result = {
                "summary": summary,
                "repositories": mapped,
            }
            github_cache.set("mapped_repositories", result, custom_ttl=300)
            return result
        except Exception:
            return {}
