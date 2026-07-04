# app/modules/rag/tests/test_production_api.py

import pytest
from fastapi import status
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.rag.dependencies import (
    get_rag_health_checker,
    get_rag_metrics_service,
    get_response_cache_service,
    get_performance_optimizer,
    get_citation_service
)
from app.modules.rag.citations.models import Citation


# Simple mock user
mock_user = User(
    id=1,
    email="test-production-api@example.com",
    is_active=True
)


def mock_get_current_user():
    return mock_user


def test_status_endpoint():
    app.dependency_overrides[get_current_user] = mock_get_current_user

    # Mock health checker check_health method
    mock_health_checker = MagicMock()
    mock_health_checker.check_health = AsyncMock(return_value={
        "status": "healthy",
        "components": {
            "ollama": "healthy",
            "chromadb": "healthy",
            "cache": "healthy"
        }
    })
    app.dependency_overrides[get_rag_health_checker] = lambda: mock_health_checker

    client = TestClient(app)
    response = client.get("/api/v1/rag/status")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert data["components"]["ollama"] == "healthy"
    assert data["components"]["chromadb"] == "healthy"
    assert data["components"]["cache"] == "healthy"

    app.dependency_overrides.clear()


def test_metrics_endpoint():
    app.dependency_overrides[get_current_user] = mock_get_current_user

    mock_metrics_service = MagicMock()
    mock_metrics_service.get_metrics.return_value = {
        "total_queries": 42,
        "error_rate": 0.05,
        "cache_hit_ratio": 0.8,
        "average_total_latency_ms": 150.0,
        "token_usage": {"total_tokens": 1000}
    }
    app.dependency_overrides[get_rag_metrics_service] = lambda: mock_metrics_service

    client = TestClient(app)
    response = client.get("/api/v1/rag/metrics")
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total_queries"] == 42
    assert data["error_rate"] == 0.05
    assert data["cache_hit_ratio"] == 0.8
    assert data["average_total_latency_ms"] == 150.0

    app.dependency_overrides.clear()


def test_cache_stats_and_delete_endpoints():
    app.dependency_overrides[get_current_user] = mock_get_current_user

    mock_cache_service = MagicMock()
    mock_cache_service.get_stats.return_value = {
        "hits": 10,
        "misses": 5,
        "total_requests": 15,
        "query_cache_size": 2
    }
    app.dependency_overrides[get_response_cache_service] = lambda: mock_cache_service

    mock_optimizer = MagicMock()
    app.dependency_overrides[get_performance_optimizer] = lambda: mock_optimizer

    client = TestClient(app)
    
    # Test GET /cache
    response = client.get("/api/v1/rag/cache")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["hits"] == 10
    assert data["query_cache_size"] == 2

    # Test DELETE /cache
    response_del = client.delete("/api/v1/rag/cache")
    assert response_del.status_code == status.HTTP_200_OK
    assert response_del.json()["message"] == "Cache cleared successfully."
    mock_cache_service.clear.assert_called_once()
    mock_optimizer.clear.assert_called_once()

    app.dependency_overrides.clear()


def test_citations_by_request_endpoint():
    app.dependency_overrides[get_current_user] = mock_get_current_user

    mock_citation_service = MagicMock()
    mock_citations = [
        Citation(
            document_id="doc_1",
            chunk_id="chk_1",
            source_file="resume.pdf",
            page_number=1,
            section="Summary",
            similarity_score=0.9
        )
    ]
    
    # Mock lookup hit
    mock_citation_service.get_citations.side_effect = lambda req_id: mock_citations if req_id == "req_valid" else None
    app.dependency_overrides[get_citation_service] = lambda: mock_citation_service

    client = TestClient(app)

    # Test 404
    response_404 = client.get("/api/v1/rag/citations/req_invalid")
    assert response_404.status_code == status.HTTP_404_NOT_FOUND

    # Test 200
    response_200 = client.get("/api/v1/rag/citations/req_valid")
    assert response_200.status_code == status.HTTP_200_OK
    data = response_200.json()
    assert len(data) == 1
    assert data[0]["document_id"] == "doc_1"
    assert data[0]["source_file"] == "resume.pdf"

    app.dependency_overrides.clear()
