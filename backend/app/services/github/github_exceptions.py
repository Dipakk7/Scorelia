"""
GitHub Service Custom Exceptions
"""

class GitHubException(Exception):
    """Base exception for GitHub module errors."""
    pass

class GitHubAuthError(GitHubException):
    """Raised when GitHub OAuth token is missing, expired, or invalid."""
    pass

class GitHubRateLimitError(GitHubException):
    """Raised when GitHub API rate limits are exceeded."""
    def __init__(self, message: str = "GitHub API rate limit exceeded.", reset_timestamp: int = None):
        super().__init__(message)
        self.reset_timestamp = reset_timestamp

class GitHubNotFoundError(GitHubException):
    """Raised when a requested GitHub resource is not found."""
    pass

class GitHubSyncError(GitHubException):
    """Raised when GitHub synchronization fails."""
    pass
