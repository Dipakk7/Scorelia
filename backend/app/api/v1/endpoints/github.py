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
    """Connect a GitHub access token or username."""
    service = GitHubService(token=payload.accessToken)
    status_data = await service.get_connection_status()
    if not status_data["isConnected"]:
        raise HTTPException(status_code=400, detail="Invalid GitHub token or account username provided.")
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

@router.get("/hero")
async def get_hero_data(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch hero KPI data and account status."""
    return await service.get_hero_data()

@router.get("/analytics")
async def get_analytics_data(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch activity analytics and contribution breakdown."""
    return await service.get_analytics_data()

@router.get("/repositories")
async def get_repositories(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch user repositories and summary statistics."""
    return await service.get_repositories()

@router.get("/developer-metrics")
async def get_developer_metrics(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch developer quality and productivity metrics."""
    return await service.get_developer_metrics()

@router.get("/insights")
async def get_insights_data(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch AI insights, recommendations, and goals."""
    return await service.get_insights_data()
