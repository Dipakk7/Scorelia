# app/modules/rag/retrieval/base.py

from abc import ABC, abstractmethod
from typing import List
from app.modules.rag.retrieval.models import SearchRequest, RetrievedChunk


class BaseRetriever(ABC):
    """Abstract base class that all search retrievers must inherit from."""

    @abstractmethod
    async def search(self, request: SearchRequest) -> List[RetrievedChunk]:
        """Perform similarity search for a single query."""
        pass

    @abstractmethod
    async def search_batch(self, requests: List[SearchRequest]) -> List[List[RetrievedChunk]]:
        """Perform batch similarity search for a list of query requests."""
        pass
