# app/modules/rag/vectorstores/base.py

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class VectorStore(ABC):
    """Abstract base class for vector database storage backends."""

    @abstractmethod
    def insert(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str]
    ) -> None:
        """Insert vectors and metadata into the collection."""
        pass

    @abstractmethod
    def update(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str]
    ) -> None:
        """Update existing vectors and metadata in the collection."""
        pass

    @abstractmethod
    def delete(self, collection_name: str, ids: List[str]) -> None:
        """Delete vectors by their specific chunk IDs."""
        pass

    @abstractmethod
    def delete_by_document(self, collection_name: str, document_id: str) -> None:
        """Delete all vectors belonging to a specific document ID."""
        pass

    @abstractmethod
    def count(self, collection_name: str) -> int:
        """Get the total number of vectors in a collection."""
        pass

    @abstractmethod
    def get_by_ids(self, collection_name: str, ids: List[str]) -> List[Dict[str, Any]]:
        """Retrieve vector records by specific chunk IDs."""
        pass

    @abstractmethod
    def get_by_document(self, collection_name: str, document_id: str) -> List[Dict[str, Any]]:
        """Retrieve all vector records (metadata, ids, etc.) for a specific document ID."""
        pass

    @abstractmethod
    def query(
        self,
        collection_name: str,
        query_embeddings: List[List[float]],
        n_results: int = 10,
        where: Optional[Dict[str, Any]] = None,
        include: List[str] = ["metadatas", "documents", "distances"]
    ) -> Dict[str, Any]:
        """Query vector database for similar embeddings."""
        pass
