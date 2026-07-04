# app/modules/rag/services/optimizer.py

import threading
from typing import List, Dict, Any, Optional
import structlog

from app.modules.rag.retrieval.models import RetrievedChunk

logger = structlog.get_logger()


class PerformanceOptimizer:
    """Optimizes RAG retrieval and context assembly by deduplicating chunks, trimming content, and caching embeddings."""

    def __init__(self, token_estimate_ratio: float = 0.25):
        self._lock = threading.Lock()
        self._embedding_cache: Dict[str, List[float]] = {}
        self.token_estimate_ratio = token_estimate_ratio

        # Performance optimization metrics
        self.duplicates_removed = 0
        self.chunks_trimmed = 0
        self.chunks_rejected_budget = 0
        self.embedding_hits = 0
        self.embedding_misses = 0

    # --- Query Embedding Caching ---
    def get_cached_embedding(self, query: str) -> Optional[List[float]]:
        """Retrieve a cached query embedding."""
        query_key = query.strip()
        with self._lock:
            if query_key in self._embedding_cache:
                self.embedding_hits += 1
                logger.debug("embedding_cache_hit", query_length=len(query_key))
                return self._embedding_cache[query_key]
            self.embedding_misses += 1
            logger.debug("embedding_cache_miss", query_length=len(query_key))
            return None

    def set_cached_embedding(self, query: str, embedding: List[float]) -> None:
        """Store a query embedding in the cache."""
        query_key = query.strip()
        with self._lock:
            # Simple eviction if cache exceeds arbitrary bounds (e.g. 5000 items)
            if len(self._embedding_cache) >= 5000:
                self._embedding_cache.pop(next(iter(self._embedding_cache)), None)
            self._embedding_cache[query_key] = embedding
        logger.debug("embedding_cache_set", query_length=len(query_key))

    # --- Chunk Optimization and Trimming ---
    def optimize_chunks(self, chunks: List[RetrievedChunk]) -> List[RetrievedChunk]:
        """Performs duplicate elimination and text trimming on retrieved chunks."""
        seen_ids = set()
        seen_contents = set()
        optimized = []

        for chunk in chunks:
            # 1. Duplicate detection
            norm_content = chunk.content.strip()
            if chunk.chunk_id in seen_ids or norm_content in seen_contents:
                self.duplicates_removed += 1
                continue
            seen_ids.add(chunk.chunk_id)
            seen_contents.add(norm_content)

            # 2. Text trimming
            original_len = len(chunk.content)
            trimmed_text = " ".join(chunk.content.split())  # Normalize whitespaces
            if len(trimmed_text) < original_len:
                self.chunks_trimmed += 1
                chunk.content = trimmed_text

            optimized.append(chunk)

        return optimized

    # --- Context Budget Optimization ---
    def optimize_context(self, chunks: List[RetrievedChunk], max_tokens: int) -> List[RetrievedChunk]:
        """Trims and selects only the top chunks that fit within the context token limit."""
        selected_chunks = []
        accumulated_tokens = 0

        # Estimate tokens (using configuration token_estimate_ratio, typical for RAG models)
        for chunk in chunks:
            estimated_tokens = int(len(chunk.content) * self.token_estimate_ratio)
            # Ensure estimated tokens is at least 1 for non-empty content
            if estimated_tokens <= 0 and len(chunk.content) > 0:
                estimated_tokens = 1

            if accumulated_tokens + estimated_tokens <= max_tokens:
                selected_chunks.append(chunk)
                accumulated_tokens += estimated_tokens
            else:
                self.chunks_rejected_budget += 1

        return selected_chunks

    # --- Prompt Optimization ---
    def optimize_prompt(self, prompt: str) -> str:
        """Optimizes rendered prompt body by cleaning redundant whitespaces."""
        if not prompt:
            return ""
        # Strip trailing/leading space, and replace multiple newlines with double newlines
        lines = [line.strip() for line in prompt.splitlines()]
        cleaned_prompt = "\n".join(line for line in lines if line)
        return cleaned_prompt.strip()

    # --- Invalidation ---
    def clear(self) -> None:
        """Clear embedding cache."""
        with self._lock:
            self._embedding_cache.clear()
        logger.info("performance_optimizer_embedding_cache_cleared")

    def get_optimization_metrics(self) -> Dict[str, Any]:
        """Returns collected optimization metrics."""
        return {
            "duplicates_removed": self.duplicates_removed,
            "chunks_trimmed": self.chunks_trimmed,
            "chunks_rejected_budget": self.chunks_rejected_budget,
            "embedding_cache_hits": self.embedding_hits,
            "embedding_cache_misses": self.embedding_misses,
            "embedding_cache_size": len(self._embedding_cache),
        }
