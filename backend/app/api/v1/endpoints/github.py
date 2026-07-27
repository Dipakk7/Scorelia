"""
FastAPI Endpoints for GitHub Intelligence Module
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, Header
from app.schemas.github import (
    GitHubConnectionSchema,
    ConnectTokenRequest,
    SyncResponseSchema,
)
from app.services.github.github_service import GitHubService
from app.services.github.github_sync import GitHubSyncManager
from app.services.github.github_exceptions import (
    GitHubAuthError,
    GitHubRateLimitError,
    GitHubNotFoundError,
)

router = APIRouter()

def get_github_service(authorization: Optional[str] = Header(None)) -> GitHubService:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    return GitHubService(token=token)

@router.get("/connection", response_model=GitHubConnectionSchema)
async def get_connection_status(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch user GitHub connection status and rate limits."""
    return await service.get_connection_status()

@router.post("/oauth/connect", response_model=GitHubConnectionSchema)
async def connect_github_token(
    payload: ConnectTokenRequest,
):
    """Connect a GitHub access token."""
    service = GitHubService(token=payload.accessToken)
    status_data = await service.get_connection_status()
    if not status_data["isConnected"]:
        raise HTTPException(status_code=400, detail="Invalid GitHub token provided.")
    return status_data

@router.post("/oauth/disconnect")
async def disconnect_github():
    """Disconnect GitHub token."""
    return {"status": "success", "message": "GitHub account disconnected."}

@router.post("/sync", response_model=SyncResponseSchema)
async def trigger_sync(
    authorization: Optional[str] = Header(None),
):
    """Trigger manual GitHub synchronization."""
    token = authorization.replace("Bearer ", "") if authorization and authorization.startswith("Bearer ") else None
    sync_mgr = GitHubSyncManager(token=token)
    return await sync_mgr.sync_now()

@router.get("/repositories")
async def get_repositories(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch user repositories and summary statistics."""
    return await service.get_repositories()
