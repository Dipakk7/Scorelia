# app/modules/rag/tests/test_metrics.py

import pytest
from app.modules.rag.services.metrics_service import RAGMetricsService


def test_metrics_service_accumulation():
    metrics = RAGMetricsService()
    
    # Check default stats
    report = metrics.get_metrics()
    assert report["total_queries"] == 0
    assert report["error_rate"] == 0.0
    assert report["cache_hit_ratio"] == 0.0

    # Record first query (cache hit)
    metrics.record_cache(hit=True)
    metrics.record_query(total_latency_ms=15.0)

    # Record second query (cache miss + generation)
    metrics.record_cache(hit=False)
    metrics.record_retrieval(latency_ms=10.0, chunks_count=3)
    metrics.record_generation(
        latency_ms=100.0,
        prompt_size=500,
        context_size=1000,
        prompt_t=100,
        completion_t=50
    )
    metrics.record_query(total_latency_ms=120.0)

    # Record third query (error)
    metrics.record_cache(hit=False)
    metrics.record_query(total_latency_ms=50.0, is_error=True)


    report = metrics.get_metrics()
    
    # Verify totals
    assert report["total_queries"] == 3
    assert report["error_rate"] == 0.3333
    assert report["cache_hit_ratio"] == 0.3333
    assert report["cache_miss_ratio"] == 0.6667

    # Verify averages
    # total_latency = 15 + 120 + 50 = 185; avg = 185 / 3 = 61.67
    assert report["average_total_latency_ms"] == 61.67
    
    # average retrieval latency: retrieval recorded once with 10.0, total queries = 3; avg = 10.0 / 3 = 3.33
    assert report["average_retrieval_latency_ms"] == 3.33

    # average generation latency: generation recorded once with 100.0, successful generations = 1; avg = 100.0 / 1 = 100.0
    assert report["average_generation_latency_ms"] == 100.0

    # Token counts
    assert report["token_usage"]["prompt_tokens"] == 100
    assert report["token_usage"]["completion_tokens"] == 50
    assert report["token_usage"]["total_tokens"] == 150


def test_metrics_service_reset():
    metrics = RAGMetricsService()
    metrics.record_query(total_latency_ms=100.0)
    metrics.record_error()
    
    report = metrics.get_metrics()
    assert report["total_queries"] == 1
    assert report["error_rate"] == 1.0

    metrics.reset()
    report = metrics.get_metrics()
    assert report["total_queries"] == 0
    assert report["error_rate"] == 0.0
    assert report["token_usage"]["total_tokens"] == 0
