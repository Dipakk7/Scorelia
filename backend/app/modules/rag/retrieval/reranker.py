# app/modules/rag/retrieval/reranker.py

from abc import ABC, abstractmethod
from typing import List
import structlog

from app.modules.rag.retrieval.models import RetrievedChunk

logger = structlog.get_logger()


class BaseReranker(ABC):
    """Abstract base class for text chunk reranking algorithms."""

    @abstractmethod
    async def rerank(self, query: str, chunks: List[RetrievedChunk]) -> List[RetrievedChunk]:
        """Reranks the retrieved chunks based on their semantic relevance to the query.

        Args:
            query: The original search query.
            chunks: List of retrieved chunks.

        Returns:
            Reranked list of chunks.
        """
        pass


class NoOpReranker(BaseReranker):
    """A pass-through reranker that returns the retrieved chunks unmodified."""

    async def rerank(self, query: str, chunks: List[RetrievedChunk]) -> List[RetrievedChunk]:
        logger.debug("NoOpReranker: bypass reranking step")
        return chunks
