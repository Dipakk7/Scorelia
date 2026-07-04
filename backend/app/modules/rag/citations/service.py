# app/modules/rag/citations/service.py

import threading
from typing import List, Dict, Optional
import structlog

from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.citations.models import Citation, CitationStyle
from app.modules.rag.citations.builder import build_citations_from_chunks
from app.modules.rag.citations.formatter import format_citations

logger = structlog.get_logger()


class CitationService:
    """Service to build, merge, sort, format, and cache citations for RAG execution requests."""

    def __init__(self, max_cached_requests: int = 1000):
        self._lock = threading.Lock()
        self._citation_store: Dict[str, List[Citation]] = {}
        self.max_cached_requests = max_cached_requests

    def build_citations(
        self,
        chunks: List[RetrievedChunk],
        collection_override: Optional[str] = None
    ) -> List[Citation]:
        """Builds, deduplicates, and sorts citations from retrieved chunks.

        Args:
            chunks: Chunks retrieved during semantic search.
            collection_override: Optional override for collection metadata attribute.

        Returns:
            Deduplicated and sorted list of Citation objects.
        """
        if not chunks:
            return []

        # 1. Build initial list of citations
        raw_citations = build_citations_from_chunks(chunks, collection_override)

        # 2. Merge duplicate citations (deduplicate by chunk_id, keeping the highest similarity score)
        merged: Dict[str, Citation] = {}
        for citation in raw_citations:
            existing = merged.get(citation.chunk_id)
            if not existing or citation.similarity_score > existing.similarity_score:
                merged[citation.chunk_id] = citation

        citations_list = list(merged.values())

        # 3. Sort by similarity score descending
        citations_list.sort(key=lambda x: x.similarity_score, reverse=True)

        return citations_list

    def format_citations(self, citations: List[Citation], style: CitationStyle) -> List[str]:
        """Formats citations based on style."""
        return format_citations(citations, style)

    def save_citations(self, request_id: str, citations: List[Citation]) -> None:
        """Stores citations in-memory for a request_id."""
        with self._lock:
            # Enforce cache size limit using a simple eviction policy
            if len(self._citation_store) >= self.max_cached_requests:
                # Evict one item (arbitrary first key since dict is insertion-ordered in Python 3.7+)
                evict_key = next(iter(self._citation_store))
                self._citation_store.pop(evict_key, None)
                logger.debug("evicted_citation_cache_entry", request_id=evict_key)

            self._citation_store[request_id] = citations
        logger.debug("saved_citations_for_request", request_id=request_id, count=len(citations))

    def get_citations(self, request_id: str) -> Optional[List[Citation]]:
        """Retrieves cached citations for a request_id."""
        with self._lock:
            return self._citation_store.get(request_id)

    def clear(self) -> None:
        """Clears the cached citations."""
        with self._lock:
            self._citation_store.clear()
        logger.info("citations_cache_cleared")
