"""
GitHub Pydantic Schemas
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class RateLimitSchema(BaseModel):
    limit: int = 5000
    remaining: int = 5000
    reset: int = 0
    reset_in_seconds: int = 3600
    is_exceeded: bool = False

class GitHubConnectionSchema(BaseModel):
    isConnected: bool
    username: str
    avatarUrl: Optional[str] = None
    rateLimit: RateLimitSchema
    lastSyncedAt: str

class ConnectTokenRequest(BaseModel):
    accessToken: str = Field(..., description="Personal Access Token or OAuth Access Token")

class SyncResponseSchema(BaseModel):
    status: str
    message: str
    syncedAt: str
    connection: GitHubConnectionSchema
    repositoriesCount: int
