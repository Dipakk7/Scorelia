from __future__ import annotations
# app/modules/rag/services/cache_service.py

import json
import hashlib
import time
import threading
from typing import TYPE_CHECKING, Dict, Any, Optional, List, Tuple
import structlog

if TYPE_CHECKING:
    from app.modules.rag.generation.models import RAGResponse
from app.modules.rag.retrieval.models import RetrievedChunk

logger = structlog.get_logger()



class ResponseCacheService:
    """In-memory, thread-safe cache service for RAG response caching, retrieval caching, and prompt caching with TTL."""

    def __init__(self):
        self._lock = threading.Lock()
        self._query_cache: Dict[str, Tuple[RAGResponse, float]] = {}
        self._retrieval_cache: Dict[str, Tuple[List[RetrievedChunk], float]] = {}
        self._context_cache: Dict[str, Tuple[Dict[str, Any], float]] = {}
        self._prompt_cache: Dict[str, Tuple[str, float]] = {}

        # Cache metrics
        self.hits = 0
        self.misses = 0

    def _hash_key(self, raw_key: str) -> str:
        """Helper to hash key using SHA-256."""
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()

    # --- Query Cache ---
    def get_query(
        self,
        query: str,
        collection: Optional[str],
        collections: Optional[List[str]],
        template: Optional[str],
        top_k: Optional[int],
        model: str
    ) -> Optional[RAGResponse]:
        """Retrieves cached RAGResponse if valid and not expired."""
        coll_str = collection or ""
        if collections:
            coll_str = ",".join(sorted(collections))

        raw_key = f"query:{query.strip()}:coll:{coll_str}:tmpl:{template or ''}:top_k:{top_k or 0}:model:{model}"
        key = self._hash_key(raw_key)

        with self._lock:
            if key in self._query_cache:
                response, expiry = self._query_cache[key]
                if time.time() < expiry:
                    self.hits += 1
                    logger.debug("query_cache_hit", key=key)
                    return response
                else:
                    del self._query_cache[key]
            self.misses += 1
            logger.debug("query_cache_miss", key=key)
            return None

    def set_query(
        self,
        query: str,
        collection: Optional[str],
        collections: Optional[List[str]],
        template: Optional[str],
        top_k: Optional[int],
        model: str,
        response: RAGResponse,
        ttl: int = 300
    ) -> None:
        """Stores RAGResponse in cache with TTL."""
        if ttl <= 0:
            return
        coll_str = collection or ""
        if collections:
            coll_str = ",".join(sorted(collections))

        raw_key = f"query:{query.strip()}:coll:{coll_str}:tmpl:{template or ''}:top_k:{top_k or 0}:model:{model}"
        key = self._hash_key(raw_key)
        expiry = time.time() + ttl

        with self._lock:
            self._query_cache[key] = (response, expiry)
        logger.debug("query_cache_set", key=key, ttl=ttl)

    # --- Retrieval Cache ---
    def get_retrieved_chunks(
        self,
        query: str,
        collections: List[str],
        top_k: int,
        threshold: float
    ) -> Optional[List[RetrievedChunk]]:
        """Retrieves cached chunks if valid and not expired."""
        coll_str = ",".join(sorted(collections))
        raw_key = f"retrieval:{query.strip()}:coll:{coll_str}:top_k:{top_k}:thresh:{threshold}"
        key = self._hash_key(raw_key)

        with self._lock:
            if key in self._retrieval_cache:
                chunks, expiry = self._retrieval_cache[key]
                if time.time() < expiry:
                    self.hits += 1
                    logger.debug("retrieval_cache_hit", key=key)
                    return chunks
                else:
                    del self._retrieval_cache[key]
            self.misses += 1
            logger.debug("retrieval_cache_miss", key=key)
            return None

    def set_retrieved_chunks(
        self,
        query: str,
        collections: List[str],
        top_k: int,
        threshold: float,
        chunks: List[RetrievedChunk],
        ttl: int = 300
    ) -> None:
        """Stores retrieved chunks in cache with TTL."""
        if ttl <= 0:
            return
        coll_str = ",".join(sorted(collections))
        raw_key = f"retrieval:{query.strip()}:coll:{coll_str}:top_k:{top_k}:thresh:{threshold}"
        key = self._hash_key(raw_key)
        expiry = time.time() + ttl

        with self._lock:
            self._retrieval_cache[key] = (chunks, expiry)
        logger.debug("retrieval_cache_set", key=key, ttl=ttl)

    # --- Context Cache ---
    def get_context(self, chunk_ids: List[str]) -> Optional[Dict[str, Any]]:
        """Retrieves cached context dictionary if valid and not expired."""
        if not chunk_ids:
            return None
        raw_key = f"context:{'-'.join(sorted(chunk_ids))}"
        key = self._hash_key(raw_key)

        with self._lock:
            if key in self._context_cache:
                context_data, expiry = self._context_cache[key]
                if time.time() < expiry:
                    self.hits += 1
                    logger.debug("context_cache_hit", key=key)
                    return context_data
                else:
                    del self._context_cache[key]
            self.misses += 1
            logger.debug("context_cache_miss", key=key)
            return None

    def set_context(self, chunk_ids: List[str], context_data: Dict[str, Any], ttl: int = 300) -> None:
        """Stores context dictionary in cache with TTL."""
        if ttl <= 0 or not chunk_ids:
            return
        raw_key = f"context:{'-'.join(sorted(chunk_ids))}"
        key = self._hash_key(raw_key)
        expiry = time.time() + ttl

        with self._lock:
            self._context_cache[key] = (context_data, expiry)
        logger.debug("context_cache_set", key=key, ttl=ttl)

    # --- Prompt Cache ---
    def get_generation(self, prompt: str, system_prompt: str) -> Optional[str]:
        """Retrieves cached LLM response if valid and not expired."""
        raw_key = f"prompt:{prompt}:sys:{system_prompt}"
        key = self._hash_key(raw_key)

        with self._lock:
            if key in self._prompt_cache:
                val, expiry = self._prompt_cache[key]
                if time.time() < expiry:
                    self.hits += 1
                    logger.debug("prompt_cache_hit", key=key)
                    return val
                else:
                    del self._prompt_cache[key]
            self.misses += 1
            logger.debug("prompt_cache_miss", key=key)
            return None

    def set_generation(self, prompt: str, system_prompt: str, response_text: str, ttl: int = 300) -> None:
        """Stores LLM response in cache with TTL."""
        if ttl <= 0:
            return
        raw_key = f"prompt:{prompt}:sys:{system_prompt}"
        key = self._hash_key(raw_key)
        expiry = time.time() + ttl

        with self._lock:
            self._prompt_cache[key] = (response_text, expiry)
        logger.debug("prompt_cache_set", key=key, ttl=ttl)

    # --- Management and Invalidation ---
    def invalidate_query(self, query: str, collection: Optional[str], collections: Optional[List[str]], template: Optional[str], top_k: Optional[int], model: str) -> None:
        """Remove a query cache entry."""
        coll_str = collection or ""
        if collections:
            coll_str = ",".join(sorted(collections))
        raw_key = f"query:{query.strip()}:coll:{coll_str}:tmpl:{template or ''}:top_k:{top_k or 0}:model:{model}"
        key = self._hash_key(raw_key)
        with self._lock:
            self._query_cache.pop(key, None)
        logger.info("invalidated_query_cache_entry", key=key)

    def clear(self) -> None:
        """Clear all cache structures."""
        with self._lock:
            self._query_cache.clear()
            self._retrieval_cache.clear()
            self._context_cache.clear()
            self._prompt_cache.clear()
        logger.info("response_cache_service_cleared")

    def get_stats(self) -> Dict[str, Any]:
        """Compile cache statistics."""
        with self._lock:
            total_requests = self.hits + self.misses
            hit_ratio = (self.hits / total_requests) if total_requests > 0 else 0.0
            miss_ratio = (self.misses / total_requests) if total_requests > 0 else 0.0
            return {
                "hits": self.hits,
                "misses": self.misses,
                "total_requests": total_requests,
                "hit_ratio": round(hit_ratio, 4),
                "miss_ratio": round(miss_ratio, 4),
                "query_cache_size": len(self._query_cache),
                "retrieval_cache_size": len(self._retrieval_cache),
                "context_cache_size": len(self._context_cache),
                "prompt_cache_size": len(self._prompt_cache),
            }
