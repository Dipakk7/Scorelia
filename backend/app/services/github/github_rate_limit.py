"""
GitHub Rate Limit Tracker
"""

from typing import Dict, Any, Optional
import time

class GitHubRateLimitInfo:
    """Helper class for parsing and tracking GitHub API rate limits."""
    
    def __init__(self, limit: int = 5000, remaining: int = 5000, reset: int = 0):
        self.limit = limit
        self.remaining = remaining
        self.reset = reset or int(time.time() + 3600)

    @classmethod
    def from_headers(cls, headers: Dict[str, str]) -> "GitHubRateLimitInfo":
        """Parse rate limit headers from a GitHub API response."""
        limit = int(headers.get("x-ratelimit-limit") or headers.get("X-RateLimit-Limit") or 5000)
        remaining = int(headers.get("x-ratelimit-remaining") or headers.get("X-RateLimit-Remaining") or 5000)
        reset = int(headers.get("x-ratelimit-reset") or headers.get("X-RateLimit-Reset") or 0)
        return cls(limit=limit, remaining=remaining, reset=reset)

    def to_dict(self) -> Dict[str, Any]:
        seconds_until_reset = max(0, self.reset - int(time.time()))
        return {
            "limit": self.limit,
            "remaining": self.remaining,
            "reset": self.reset,
            "reset_in_seconds": seconds_until_reset,
            "is_exceeded": self.remaining <= 0
        }
