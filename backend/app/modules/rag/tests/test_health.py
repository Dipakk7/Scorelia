# app/modules/rag/tests/test_health.py

import pytest
from unittest.mock import AsyncMock, MagicMock
from app.modules.rag.services.health_checker import RAGHealthChecker


@pytest.mark.anyio
async def test_health_checker_all_healthy():
    chroma_mock = MagicMock()
    chroma_mock.validate_connection.return_value = True
    chroma_mock.heartbeat.return_value = 12345
    
    embedding_mock = AsyncMock()
    embedding_mock.health_check.return_value = {"status": "healthy"}

    retrieval_mock = MagicMock()
    
    kb_mock = MagicMock()
    kb_mock.registry.list_kbs.return_value = ["kb1", "kb2"]

    generator_mock = MagicMock()
    generator_mock.ai_service = MagicMock()

    cache_mock = MagicMock()
    citation_mock = MagicMock()

    checker = RAGHealthChecker(
        chroma_manager=chroma_mock,
        embedding_service=embedding_mock,
        retrieval_service=retrieval_mock,
        knowledge_base_service=kb_mock,
        generator=generator_mock,
        cache_service=cache_mock,
        citation_service=citation_mock
    )

    report = await checker.check_health()
    assert report["status"] == "healthy"
    assert report["components"]["chromadb"] == "healthy"
    assert report["components"]["ollama"] == "healthy"
    assert report["components"]["embedding_service"] == "healthy"
    assert report["components"]["retrieval_service"] == "healthy"
    assert report["components"]["knowledge_registry"] == "healthy"
    assert report["components"]["generation_pipeline"] == "healthy"
    assert report["components"]["cache"] == "healthy"
    assert report["components"]["citation_service"] == "healthy"

    # Verify no credentials, usernames, or absolute file paths are present in output
    for val in report.values():
        if isinstance(val, dict):
            for sub_val in val.values():
                assert "storage" not in str(sub_val)
                assert "/" not in str(sub_val)
                assert "\\" not in str(sub_val)


@pytest.mark.anyio
async def test_health_checker_ollama_unhealthy():
    chroma_mock = MagicMock()
    chroma_mock.validate_connection.return_value = True
    chroma_mock.heartbeat.return_value = 12345
    
    embedding_mock = AsyncMock()
    # Mock Ollama offline
    embedding_mock.health_check.return_value = {"status": "unhealthy", "error": "Connection refused"}

    retrieval_mock = MagicMock()
    kb_mock = MagicMock()
    kb_mock.registry.list_kbs.return_value = ["kb1"]
    generator_mock = MagicMock()
    generator_mock.ai_service = MagicMock()
    cache_mock = MagicMock()
    citation_mock = MagicMock()

    checker = RAGHealthChecker(
        chroma_manager=chroma_mock,
        embedding_service=embedding_mock,
        retrieval_service=retrieval_mock,
        knowledge_base_service=kb_mock,
        generator=generator_mock,
        cache_service=cache_mock,
        citation_service=citation_mock
    )

    report = await checker.check_health()
    assert report["status"] == "unhealthy"
    assert report["components"]["chromadb"] == "healthy"
    assert report["components"]["ollama"] == "unhealthy"
