"""
Tests for GitHub Backend Services and Endpoints
"""

import pytest
from app.services.github.github_rate_limit import GitHubRateLimitInfo
from app.services.github.github_mapper import GitHubDataMapper
from app.services.github.github_service import GitHubService

@pytest.fixture
def anyio_backend():
    return 'asyncio'

def test_rate_limit_info_defaults():
    info = GitHubRateLimitInfo()
    data = info.to_dict()
    assert data["limit"] == 5000
    assert data["remaining"] == 5000
    assert data["is_exceeded"] is False

def test_rate_limit_from_headers():
    headers = {"x-ratelimit-limit": "60", "x-ratelimit-remaining": "45", "x-ratelimit-reset": "1700000000"}
    info = GitHubRateLimitInfo.from_headers(headers)
    assert info.limit == 60
    assert info.remaining == 45
    assert info.reset == 1700000000

def test_github_mapper_repository():
    raw_repo = {
        "id": 101,
        "name": "scorelia-v3",
        "description": "AI Career Copilot",
        "private": False,
        "language": "TypeScript",
        "stargazers_count": 42,
        "forks_count": 10,
        "open_issues_count": 2,
    }
    mapped = GitHubDataMapper.map_repository(raw_repo)
    assert mapped["name"] == "scorelia-v3"
    assert mapped["visibility"] == "Public"
    assert mapped["language"] == "TypeScript"
    assert mapped["stars"] == 42
    assert mapped["health"] == "Excellent"

@pytest.mark.anyio
async def test_github_service_unauthenticated():
    service = GitHubService(token=None)
    status = await service.get_connection_status()
    assert status["isConnected"] is False
    assert status["username"] == "Guest User"
