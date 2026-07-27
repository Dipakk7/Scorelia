"""
GitHub In-Memory Response Cache
"""

from typing import Dict, Any, Optional
import time

class GitHubCache:
    """In-memory cache for GitHub API data to reduce API calls and respect rate limits."""
    
    def __init__(self, ttl_seconds: int = 300):
        self.ttl_seconds = ttl_seconds
        self._store: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self._store:
            entry = self._store[key]
            if time.time() < entry["expires_at"]:
                return entry["data"]
            del self._store[key]
        return None

    def set(self, key: str, data: Any, custom_ttl: Optional[int] = None):
        ttl = custom_ttl if custom_ttl is not None else self.ttl_seconds
        self._store[key] = {
            "data": data,
            "expires_at": time.time() + ttl
        }

    def clear(self):
        self._store.clear()

# Global cache singleton instance
github_cache = GitHubCache(ttl_seconds=300)
