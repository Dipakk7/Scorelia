# app/modules/rag/tests/test_e2e_rag.py

import pytest
from unittest.mock import AsyncMock, MagicMock
from app.modules.rag.generation.orchestrator import RAGOrchestrator
from app.modules.rag.generation.models import RAGRequest
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.generation.context_builder import ContextBuilder
from app.modules.rag.generation.prompt_builder import PromptBuilder
from app.modules.rag.generation.generator import RAGGenerator
from app.modules.rag.config import RAGConfig
from app.modules.rag.citations.service import CitationService
from app.modules.rag.services.cache_service import ResponseCacheService
from app.modules.rag.services.optimizer import PerformanceOptimizer
from app.modules.rag.services.metrics_service import RAGMetricsService


class MockAIResponse:
    def __init__(self, text: str):
        self.text = text
        self.model = "qwen2.5:3b"
        self.provider = "ollama"
        self.usage = {"prompt_tokens": 120, "completion_tokens": 80, "total_tokens": 200}


@pytest.mark.anyio
async def test_e2e_rag_workflow():
    # 1. Setup mock components
    config = RAGConfig()
    # Force caching to be active
    config.cache_ttl = 300
    config.strict_context_mode = False

    chunk_1 = RetrievedChunk(
        chunk_id="chunk_resume_1",
        document_id="doc_resume_a",
        similarity_score=0.9,
        content="Applicant has 5 years of experience in Python and FastAPI backend engineering.",
        page=1,
        section="Summary",
        source="resume.pdf",
        chunk_index=0,
        embedding_model="nomic",
        collection="resume_kb"
    )

    # Mock Knowledge Base search
    kb_response = MagicMock()
    kb_response.chunks = [chunk_1]
    kb_service_mock = AsyncMock()
    kb_service_mock.search.return_value = kb_response

    # Mock Generator
    generator_res = MockAIResponse(text="The applicant is a Python engineer with 5 years experience.")
    generator_mock = AsyncMock()
    generator_mock.generate_response.return_value = generator_res
    generator_mock.model = "qwen2.5:3b"

    # Services
    retrieval_service_mock = MagicMock()
    context_builder = ContextBuilder(config=config)
    prompt_builder = PromptBuilder(config=config)
    
    citation_service = CitationService()
    cache_service = ResponseCacheService()
    optimizer = PerformanceOptimizer()
    metrics_service = RAGMetricsService()

    orchestrator = RAGOrchestrator(
        retrieval_service=retrieval_service_mock,
        knowledge_base_service=kb_service_mock,
        context_builder=context_builder,
        prompt_builder=prompt_builder,
        generator=generator_mock,
        config=config,
        citation_service=citation_service,
        cache_service=cache_service,
        optimizer=optimizer,
        metrics_service=metrics_service
    )

    # 2. Query 1 (Cache Miss)
    req = RAGRequest(
        question="What is the applicant's experience?",
        collection="resume_kb",
        prompt_template="general"
    )

    resp1 = await orchestrator.query(req)
    
    # Assertions for response 1
    assert resp1 is not None
    assert resp1.cache_status == "miss"
    assert resp1.request_id is not None
    assert "Python" in resp1.answer
    assert len(resp1.citations) == 1
    assert resp1.citations[0].chunk_id == "chunk_resume_1"
    assert resp1.citations[0].similarity_score == 0.9

    # Verify metrics
    m_stats = metrics_service.get_metrics()
    assert m_stats["total_queries"] == 1
    assert m_stats["cache_hit_ratio"] == 0.0
    assert m_stats["token_usage"]["total_tokens"] == 200

    # Verify citation was saved in citation service lookup
    citations_saved = citation_service.get_citations(resp1.request_id)
    assert citations_saved is not None
    assert len(citations_saved) == 1
    assert citations_saved[0].document_id == "doc_resume_a"

    # 3. Query 2 (Cache Hit)
    # Perform same query. It should hit the query cache.
    resp2 = await orchestrator.query(req)

    # Assertions for response 2
    assert resp2 is not None
    assert resp2.cache_status == "hit"
    assert resp2.request_id is not None
    assert resp2.request_id != resp1.request_id  # Should have a fresh request ID
    assert resp2.answer == resp1.answer
    assert len(resp2.citations) == 1
    assert resp2.citations[0].chunk_id == "chunk_resume_1"

    # Verify metrics updated to hit
    m_stats_2 = metrics_service.get_metrics()
    assert m_stats_2["total_queries"] == 2
    # One hit out of two caches checked (actually cache events recorded for retrieval, prompt, query, etc.)
    # Let's verify hits grew
    assert cache_service.get_stats()["hits"] > 0

    # Verify citation lookup works for the new request ID
    citations_saved_2 = citation_service.get_citations(resp2.request_id)
    assert citations_saved_2 is not None
    assert len(citations_saved_2) == 1
    assert citations_saved_2[0].document_id == "doc_resume_a"
