"""
FastAPI Endpoints for Deep GitHub Intelligence
"""

from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from app.schemas.github_intelligence import DeepIntelligenceSchema, HealthSchema
from app.services.github.intelligence.intelligence_service import IntelligenceService
from app.services.github.github_service import GitHubService, get_github_service

router = APIRouter()

@router.get("/intelligence", response_model=DeepIntelligenceSchema)
async def get_deep_intelligence(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch unified deep GitHub engineering intelligence."""
    repos_data = await service.get_repositories()
    repos = repos_data.get("repositories", [])
    return IntelligenceService.get_unified_intelligence(repos)

@router.get("/health", response_model=HealthSchema)
async def get_health_intelligence(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch repository health analysis."""
    repos_data = await service.get_repositories()
    repos = repos_data.get("repositories", [])
    intel = IntelligenceService.get_unified_intelligence(repos)
    return intel["health"]

@router.get("/risk")
async def get_risk_intelligence(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch engineering risk detections."""
    repos_data = await service.get_repositories()
    repos = repos_data.get("repositories", [])
    intel = IntelligenceService.get_unified_intelligence(repos)
    return intel["risks"]

@router.get("/productivity")
async def get_productivity_intelligence(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch productivity and velocity metrics."""
    repos_data = await service.get_repositories()
    repos = repos_data.get("repositories", [])
    intel = IntelligenceService.get_unified_intelligence(repos)
    return intel["productivity"]

@router.get("/release-readiness")
async def get_release_readiness_intelligence(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch release readiness score."""
    repos_data = await service.get_repositories()
    repos = repos_data.get("repositories", [])
    intel = IntelligenceService.get_unified_intelligence(repos)
    return intel["releaseReadiness"]

@router.get("/trends")
async def get_trends_intelligence(
    service: GitHubService = Depends(get_github_service),
):
    """Fetch historical trends."""
    repos_data = await service.get_repositories()
    repos = repos_data.get("repositories", [])
    intel = IntelligenceService.get_unified_intelligence(repos)
    return intel["trends"]
