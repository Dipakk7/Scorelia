import time
import httpx
import structlog
from datetime import datetime, timezone

logger = structlog.get_logger()

class GitHubException(Exception):
    """Base exception for GitHub Service errors."""
    pass

class GitHubUserNotFound(GitHubException):
    """Raised when the username is not found on GitHub."""
    pass

class GitHubRateLimitExceeded(GitHubException):
    """Raised when GitHub API rate limit is exceeded."""
    def __init__(self, message: str, reset_time: str | None = None):
        super().__init__(message)
        self.reset_time = reset_time

class GitHubAPIError(GitHubException):
    """Raised when GitHub API returns a generic non-200 status code."""
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.status_code = status_code

class GitHubRequestTimeout(GitHubException):
    """Raised when GitHub API request times out."""
    pass

class GitHubService:
    def __init__(self, cache_ttl_seconds: int = 900) -> None:
        self.cache_ttl_seconds = cache_ttl_seconds
        # Structure: {lowercase_username: (expiry_timestamp, profile_data, repos_data)}
        self._cache: dict[str, tuple[float, dict, list[dict]]] = {}
        # Structure: {lowercase_username/repo_name: (expiry_timestamp, languages_data)}
        self._repo_languages_cache: dict[str, tuple[float, dict]] = {}
        logger.info("GitHubService initialized", cache_ttl_seconds=cache_ttl_seconds)

    def _get_from_cache(self, username: str) -> tuple[dict, list[dict]] | None:
        """
        Look up username in cache. Returns (profile_data, repos_data) if found and not expired.
        """
        username_key = username.lower().strip()
        if username_key in self._cache:
            expiry, profile_data, repos_data = self._cache[username_key]
            if time.time() < expiry:
                logger.info("GitHub cache hit", username=username)
                return profile_data, repos_data
            else:
                logger.info("GitHub cache expired", username=username)
                del self._cache[username_key]
        else:
            logger.info("GitHub cache miss", username=username)
        return None

    def _set_to_cache(self, username: str, profile_data: dict, repos_data: list[dict]) -> None:
        """
        Store profile and repository data in the cache.
        """
        username_key = username.lower().strip()
        expiry = time.time() + self.cache_ttl_seconds
        self._cache[username_key] = (expiry, profile_data, repos_data)
        logger.info("GitHub data cached", username=username, ttl_seconds=self.cache_ttl_seconds)

    async def fetch_profile_and_repos(self, username: str) -> tuple[dict, list[dict]]:
        """
        Fetch profile data and repository list for the given username.
        Uses cached data if available and not expired.
        """
        cached = self._get_from_cache(username)
        if cached:
            return cached

        # Otherwise, fetch from GitHub API
        start_time = time.perf_counter()
        
        headers = {
            "User-Agent": "CareerPilot-AI-Analytics-Engine",
            "Accept": "application/vnd.github.v3+json"
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                # 1. Fetch user profile
                profile_url = f"https://api.github.com/users/{username}"
                logger.info("GitHub API request profile", username=username, url=profile_url)
                
                try:
                    profile_resp = await client.get(profile_url, headers=headers)
                except httpx.TimeoutException:
                    logger.error("GitHub API profile request timeout", username=username)
                    raise GitHubRequestTimeout("Request to GitHub API timed out.")
                except httpx.RequestError as e:
                    logger.error("GitHub API profile request network error", username=username, error=str(e))
                    raise GitHubAPIError(f"Network error connecting to GitHub API: {str(e)}", 503)

                self._check_response_status(profile_resp, username)
                profile_data = profile_resp.json()

                # 2. Fetch user repositories (limit to 100)
                repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"
                logger.info("GitHub API request repos", username=username, url=repos_url)
                
                try:
                    repos_resp = await client.get(repos_url, headers=headers)
                except httpx.TimeoutException:
                    logger.error("GitHub API repos request timeout", username=username)
                    raise GitHubRequestTimeout("Request to GitHub API timed out.")
                except httpx.RequestError as e:
                    logger.error("GitHub API repos request network error", username=username, error=str(e))
                    raise GitHubAPIError(f"Network error connecting to GitHub API: {str(e)}", 503)

                self._check_response_status(repos_resp, username)
                repos_data = repos_resp.json()
                if not isinstance(repos_data, list):
                    repos_data = []

                # Log metrics
                duration_ms = (time.perf_counter() - start_time) * 1000.0
                rate_remaining = profile_resp.headers.get("x-ratelimit-remaining")
                logger.info(
                    "GitHub API calls completed",
                    username=username,
                    duration_ms=round(duration_ms, 2),
                    rate_limit_remaining=rate_remaining
                )

                # Save to cache
                self._set_to_cache(username, profile_data, repos_data)

                return profile_data, repos_data

            except GitHubException:
                # Re-raise known GitHub exceptions
                raise
            except Exception as e:
                logger.exception("Unexpected error in GitHub Service", error=str(e))
                raise GitHubAPIError(f"Unexpected GitHub API error: {str(e)}", 500)

    def _check_response_status(self, response: httpx.Response, username: str) -> None:
        """Helper to inspect response status and headers for errors / rate limits."""
        status_code = response.status_code
        if status_code == 200:
            return

        # Check rate limits
        rate_remaining = response.headers.get("x-ratelimit-remaining")
        reset_time_epoch = response.headers.get("x-ratelimit-reset")
        
        # If rate limit is hit, or 403/429 occurs with remaining = 0
        if status_code == 429 or (status_code == 403 and rate_remaining == "0"):
            reset_str = "unknown time"
            if reset_time_epoch:
                try:
                    reset_dt = datetime.fromtimestamp(int(reset_time_epoch), tz=timezone.utc)
                    reset_str = reset_dt.strftime("%Y-%m-%d %H:%M:%S UTC")
                except (ValueError, TypeError):
                    pass
            msg = f"GitHub API rate limit exceeded. Resets at {reset_str}."
            logger.warning("GitHub API rate limit hit", username=username, reset_time=reset_str)
            raise GitHubRateLimitExceeded(msg, reset_time=reset_str)

        if status_code == 404:
            logger.warning("GitHub user not found", username=username)
            raise GitHubUserNotFound(f"GitHub username '{username}' not found.")

        # Any other error
        msg = f"GitHub API returned error status {status_code}: {response.text}"
        logger.error("GitHub API error", username=username, status_code=status_code, error=response.text)
        raise GitHubAPIError(msg, status_code)

    async def fetch_languages_for_repos(self, username: str, repos: list[dict]) -> tuple[dict[str, dict], bool]:
        """
        Fetch language distribution data for the top N repositories (by stars).
        Reuses cached per-repo languages if available.
        If a rate limit is hit mid-loop, returns whatever partial data was gathered.
        """
        # 1. Identify the top 10 repos by stargazers_count descending
        sorted_repos = sorted(repos, key=lambda r: r.get("stargazers_count", 0), reverse=True)
        top_repos = sorted_repos[:10]
        
        languages_result: dict[str, dict] = {}
        is_partial = False
        
        headers = {
            "User-Agent": "CareerPilot-AI-Analytics-Engine",
            "Accept": "application/vnd.github.v3+json"
        }
        
        processed_count = 0
        cache_hits = 0
        cache_misses = 0
        
        async with httpx.AsyncClient(timeout=5.0) as client:
            for repo in top_repos:
                repo_name = repo.get("name", "")
                if not repo_name:
                    continue
                    
                processed_count += 1
                cache_key = f"{username.lower().strip()}/{repo_name.lower().strip()}"
                
                # Check cache
                if cache_key in self._repo_languages_cache:
                    expiry, cached_data = self._repo_languages_cache[cache_key]
                    if time.time() < expiry:
                        languages_result[repo_name] = cached_data
                        cache_hits += 1
                        continue
                    else:
                        del self._repo_languages_cache[cache_key]
                        
                cache_misses += 1
                
                # Cache miss - fetch from API
                lang_url = f"https://api.github.com/repos/{username}/{repo_name}/languages"
                try:
                    logger.info("GitHub API request languages", username=username, repo=repo_name, url=lang_url)
                    resp = await client.get(lang_url, headers=headers)
                    self._check_response_status(resp, username)
                    
                    lang_data = resp.json()
                    if isinstance(lang_data, dict):
                        # Cache the successful result
                        expiry = time.time() + self.cache_ttl_seconds
                        self._repo_languages_cache[cache_key] = (expiry, lang_data)
                        languages_result[repo_name] = lang_data
                        
                except (GitHubException, httpx.RequestError) as e:
                    logger.warning("Failed fetching languages for repository mid-loop", username=username, repo=repo_name, error=str(e))
                    is_partial = True
                    break
                    
        # Log performance metrics
        logger.info(
            "Per-repo language fetch summary",
            username=username,
            total_processed=processed_count,
            cache_hits=cache_hits,
            cache_misses=cache_misses,
            cache_ratio=round(cache_hits / max(1, processed_count), 2),
            is_partial=is_partial
        )
        
        return languages_result, is_partial
