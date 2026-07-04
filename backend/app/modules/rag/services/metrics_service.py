# app/modules/rag/services/metrics_service.py

import threading
from typing import Dict, Any
import structlog

logger = structlog.get_logger()


class RAGMetricsService:
    """Thread-safe collector and monitor for RAG system metrics and performance indicators."""

    def __init__(self):
        self._lock = threading.Lock()
        
        # Request counts
        self.total_queries = 0
        self.errors = 0

        # Caching
        self.cache_hits = 0
        self.cache_misses = 0

        # Latencies (cumulative in milliseconds)
        self.total_retrieval_latency_ms = 0.0
        self.total_generation_latency_ms = 0.0
        self.total_latency_ms = 0.0

        # Sizes (cumulative)
        self.total_prompt_size_chars = 0
        self.total_context_size_chars = 0
        self.total_retrieved_chunks = 0

        # Tokens
        self.prompt_tokens = 0
        self.completion_tokens = 0
        self.total_tokens = 0

    def record_query(self, total_latency_ms: float, is_error: bool = False) -> None:
        """Record an end-to-end query execution."""
        with self._lock:
            self.total_queries += 1
            if is_error:
                self.errors += 1
            self.total_latency_ms += total_latency_ms

        logger.info(
            "rag_query_metrics_recorded",
            total_latency_ms=round(total_latency_ms, 2),
            is_error=is_error
        )

    def record_retrieval(self, latency_ms: float, chunks_count: int) -> None:
        """Record search retrieval metrics."""
        with self._lock:
            self.total_retrieval_latency_ms += latency_ms
            self.total_retrieved_chunks += chunks_count

        logger.debug(
            "rag_retrieval_metrics_recorded",
            latency_ms=round(latency_ms, 2),
            chunks_count=chunks_count
        )

    def record_generation(
        self,
        latency_ms: float,
        prompt_size: int,
        context_size: int,
        prompt_t: int,
        completion_t: int
    ) -> None:
        """Record model response generation and token usage metrics."""
        with self._lock:
            self.total_generation_latency_ms += latency_ms
            self.total_prompt_size_chars += prompt_size
            self.total_context_size_chars += context_size
            self.prompt_tokens += prompt_t
            self.completion_tokens += completion_t
            self.total_tokens += (prompt_t + completion_t)

        logger.debug(
            "rag_generation_metrics_recorded",
            latency_ms=round(latency_ms, 2),
            prompt_tokens=prompt_t,
            completion_tokens=completion_t
        )

    def record_cache(self, hit: bool) -> None:
        """Record query or retrieval cache hit status."""
        with self._lock:
            if hit:
                self.cache_hits += 1
            else:
                self.cache_misses += 1

        logger.debug("rag_cache_event_recorded", hit=hit)

    def record_error(self) -> None:
        """Increment execution failure counts."""
        with self._lock:
            self.errors += 1
        logger.error("rag_error_recorded")

    def get_metrics(self) -> Dict[str, Any]:
        """Compile and return formatted metrics report."""
        with self._lock:
            total_caches = self.cache_hits + self.cache_misses
            cache_hit_ratio = (self.cache_hits / total_caches) if total_caches > 0 else 0.0
            cache_miss_ratio = (self.cache_misses / total_caches) if total_caches > 0 else 0.0
            error_rate = (self.errors / self.total_queries) if self.total_queries > 0 else 0.0

            # Count of samples for averaging
            generations_count = self.total_queries - self.cache_hits - self.errors
            generations_count = max(1, generations_count)
            queries_count = max(1, self.total_queries)

            return {
                "total_queries": self.total_queries,
                "error_rate": round(error_rate, 4),
                "cache_hit_ratio": round(cache_hit_ratio, 4),
                "cache_miss_ratio": round(cache_miss_ratio, 4),
                "average_retrieval_latency_ms": round(self.total_retrieval_latency_ms / queries_count, 2),
                "average_generation_latency_ms": round(self.total_generation_latency_ms / generations_count, 2),
                "average_total_latency_ms": round(self.total_latency_ms / queries_count, 2),
                "average_prompt_size_chars": round(self.total_prompt_size_chars / generations_count, 2),
                "average_context_size_chars": round(self.total_context_size_chars / generations_count, 2),
                "average_retrieved_chunks": round(self.total_retrieved_chunks / queries_count, 2),
                "token_usage": {
                    "prompt_tokens": self.prompt_tokens,
                    "completion_tokens": self.completion_tokens,
                    "total_tokens": self.total_tokens,
                }
            }

    def reset(self) -> None:
        """Reset all metric counters."""
        with self._lock:
            self.total_queries = 0
            self.errors = 0
            self.cache_hits = 0
            self.cache_misses = 0
            self.total_retrieval_latency_ms = 0.0
            self.total_generation_latency_ms = 0.0
            self.total_latency_ms = 0.0
            self.total_prompt_size_chars = 0
            self.total_context_size_chars = 0
            self.total_retrieved_chunks = 0
            self.prompt_tokens = 0
            self.completion_tokens = 0
            self.total_tokens = 0
        logger.info("rag_metrics_reset_completed")
