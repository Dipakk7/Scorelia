# app/modules/rag/tests/test_cache.py

import time
import pytest
from app.modules.rag.services.cache_service import ResponseCacheService
from app.modules.rag.generation.models import (
    RAGResponse,
    PromptMetadata,
    GenerationMetadata,
    TokenUsage
)
from app.modules.rag.retrieval.models import RetrievedChunk


def test_cache_hits_and_misses():
    cache = ResponseCacheService()
    stats = cache.get_stats()
    assert stats["hits"] == 0
    assert stats["misses"] == 0

    # Retrieval cache test
    chunks = [
        RetrievedChunk(
            chunk_id="chk_1",
            document_id="doc_1",
            similarity_score=0.9,
            content="Testing retrieval cache.",
            chunk_index=0,
            embedding_model="nomic"
        )
    ]
    
    # Query miss
    res = cache.get_retrieved_chunks("query text", ["resume_kb"], 5, 0.7)
    assert res is None
    assert cache.get_stats()["misses"] == 1

    # Query set
    cache.set_retrieved_chunks("query text", ["resume_kb"], 5, 0.7, chunks, ttl=60)
    
    # Query hit
    hit_res = cache.get_retrieved_chunks("query text", ["resume_kb"], 5, 0.7)
    assert hit_res == chunks
    assert cache.get_stats()["hits"] == 1


def test_cache_ttl_expiration():
    cache = ResponseCacheService()
    
    # Cache with very short TTL
    cache.set_generation("prompt content", "system content", "generated answer", ttl=1)
    
    # Instant lookup should hit
    assert cache.get_generation("prompt content", "system content") == "generated answer"
    
    # Sleep to expire
    time.sleep(1.1)
    assert cache.get_generation("prompt content", "system content") is None


def test_query_cache_response():
    cache = ResponseCacheService()
    
    resp = RAGResponse(
        answer="Hello, this is a response.",
        context_documents=[],
        prompt_metadata=PromptMetadata(template_name="general", prompt_size=10, variables={}),
        generation_metadata=GenerationMetadata(model="qwen", provider="ollama", latency_ms=10.0, temperature=0.3, top_p=0.9),
        token_usage=TokenUsage(prompt_tokens=10, completion_tokens=10, total_tokens=20),
        retrieved_document_count=0,
        retrieved_chunk_count=0,
        context_size=0,
        prompt_size=10,
        latency_ms=10.0,
        model="qwen",
        citations=[],
        request_id="req_123",
        cache_status="miss"
    )

    # Miss
    retrieved = cache.get_query("test query", "resume_kb", None, "general", 4, "qwen")
    assert retrieved is None

    # Set
    cache.set_query("test query", "resume_kb", None, "general", 4, "qwen", resp, ttl=100)

    # Hit
    retrieved = cache.get_query("test query", "resume_kb", None, "general", 4, "qwen")
    assert retrieved is not None
    assert retrieved.answer == resp.answer
    assert retrieved.request_id == "req_123"


def test_cache_invalidation():
    cache = ResponseCacheService()
    cache.set_generation("prompt", "sys", "ans", ttl=100)
    assert cache.get_generation("prompt", "sys") == "ans"

    cache.clear()
    assert cache.get_generation("prompt", "sys") is None
    stats = cache.get_stats()
    assert stats["prompt_cache_size"] == 0
    assert stats["query_cache_size"] == 0
