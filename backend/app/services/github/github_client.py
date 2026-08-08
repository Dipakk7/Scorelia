"""
GitHub Async HTTP Client
"""

from typing import Dict, Any, Optional
import httpx
from app.services.github.github_exceptions import (
    GitHubAuthError,
    GitHubRateLimitError,
    GitHubNotFoundError,
    GitHubException,
)
from app.services.github.github_rate_limit import GitHubRateLimitInfo

class GitHubClient:
    """Async client wrapper for GitHub REST API calls."""

    BASE_URL = "https://api.github.com"

    def __init__(self, token: Optional[str] = None):
        self.token = token
        self.rate_limit_info = GitHubRateLimitInfo()

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Scorelia-V3-GitHub-Intelligence",
        }
        if self.token and not self.token.startswith("username:"):
            token_val = self.token
            if token_val.startswith("Bearer "):
                token_val = token_val.replace("Bearer ", "")
            headers["Authorization"] = f"token {token_val}"
        return headers

    async def request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute async HTTP request against GitHub REST API."""
        url = f"{self.BASE_URL}/{endpoint.lstrip('/')}"
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=self._get_headers(),
                params=params,
                json=json_data,
            )

            # Update rate limit info
            self.rate_limit_info = GitHubRateLimitInfo.from_headers(dict(response.headers))

            if response.status_code == 401:
                raise GitHubAuthError("Unauthorized: Invalid or expired GitHub access token.")
            elif response.status_code == 403:
                if self.rate_limit_info.remaining == 0:
                    raise GitHubRateLimitError(reset_timestamp=self.rate_limit_info.reset)
                raise GitHubAuthError("Forbidden: Insufficient permissions for GitHub resource.")
            elif response.status_code == 404:
                raise GitHubNotFoundError(f"Resource not found at endpoint: {endpoint}")
            elif response.status_code >= 400:
                raise GitHubException(f"GitHub API error ({response.status_code}): {response.text}")

            return response.json()

    async def get_user_profile(self) -> Dict[str, Any]:
        """Fetch authenticated GitHub user profile or public profile."""
        if self.token and self.token.startswith("username:"):
            uname = self.token.split("username:")[1].strip()
            return await self.request("GET", f"users/{uname}")
        return await self.request("GET", "user")

    async def list_repositories(self, per_page: int = 30) -> list:
        """Fetch repository list for authenticated user or public user."""
        if self.token and self.token.startswith("username:"):
            uname = self.token.split("username:")[1].strip()
            return await self.request("GET", f"users/{uname}/repos", params={"per_page": per_page, "sort": "updated"})
        return await self.request("GET", "user/repos", params={"per_page": per_page, "sort": "updated"})
