"""
GitHub Synchronization Manager
"""

from typing import Dict, Any, Optional
import time
from app.services.github.github_service import GitHubService
from app.services.github.github_cache import github_cache

class GitHubSyncManager:
    """Orchestrates manual and background GitHub repository synchronization."""

    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.service = GitHubService(token=token)

    async def sync_now(self) -> Dict[str, Any]:
        """Trigger an immediate cache invalidation and fresh fetch."""
        github_cache.clear()
        connection = await self.service.get_connection_status()
        repos = await self.service.get_repositories()

        return {
            "status": "success",
            "message": "GitHub synchronization completed successfully.",
            "syncedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "connection": connection,
            "repositoriesCount": len(repos.get("repositories", [])),
        }
