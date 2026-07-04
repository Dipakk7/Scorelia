# app/modules/rag/retrieval/hybrid.py

from typing import List, Optional
import structlog

from app.modules.rag.retrieval.base import BaseRetriever
from app.modules.rag.retrieval.models import SearchRequest, RetrievedChunk
from app.modules.rag.retrieval.semantic import SemanticRetriever

logger = structlog.get_logger()


class KeywordRetriever(BaseRetriever):
    """Skeletal placeholder for future BM25 / keyword search retriever.

    Currently returns empty results as keyword search is not implemented yet.
    """

    async def search(self, request: SearchRequest) -> List[RetrievedChunk]:
        logger.debug("Keyword search requested (stub execution)")
        return []

    async def search_batch(self, requests: List[SearchRequest]) -> List[List[RetrievedChunk]]:
        logger.debug("Keyword batch search requested (stub execution)")
        return [[] for _ in requests]


class HybridRetriever(BaseRetriever):
    """Foundational Hybrid Retriever designed to merge semantic and keyword search results.

    Currently falls back entirely to semantic search, laying down the injection and method
    signatures to accommodate keyword search (e.g. BM25) and Reciprocal Rank Fusion (RRF) in future phases.
    """

    def __init__(
        self,
        semantic_retriever: SemanticRetriever,
        keyword_retriever: Optional[KeywordRetriever] = None
    ):
        self.semantic_retriever = semantic_retriever
        self.keyword_retriever = keyword_retriever or KeywordRetriever()

    async def search(self, request: SearchRequest) -> List[RetrievedChunk]:
        """Runs hybrid search. Currently delegates to semantic retriever."""
        # Future implementation:
        # 1. semantic_results = await self.semantic_retriever.search(request)
        # 2. keyword_results = await self.keyword_retriever.search(request)
        # 3. fused_results = reciprocal_rank_fusion(semantic_results, keyword_results)
        # 4. return fused_results
        return await self.semantic_retriever.search(request)

    async def search_batch(self, requests: List[SearchRequest]) -> List[List[RetrievedChunk]]:
        """Runs hybrid search in batch. Currently delegates to semantic retriever."""
        return await self.semantic_retriever.search_batch(requests)
