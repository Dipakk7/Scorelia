# app/modules/rag/vectorstores/service.py

from typing import List, Dict, Any, Optional
import structlog
from app.modules.rag.vectorstores.base import VectorStore
from app.modules.rag.services.collection_manager import CollectionManager
from app.modules.rag.exceptions import CollectionNotFoundError, InvalidCollectionNameError, RAGError

logger = structlog.get_logger()


class VectorStorageService:
    """Service to handle high-level vector storage pipeline operations."""

    def __init__(self, vector_store: VectorStore, collection_manager: CollectionManager):
        self.vector_store = vector_store
        self.collection_manager = collection_manager

    def insert_vectors(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str]
    ) -> None:
        """Insert vectors. Validates collection name via collection_manager first."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        self.vector_store.insert(collection_name, ids, embeddings, metadatas, documents)

    def batch_insert(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str],
        batch_size: int = 32
    ) -> None:
        """Insert vectors in batches."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        
        total = len(ids)
        for i in range(0, total, batch_size):
            end_idx = min(i + batch_size, total)
            batch_ids = ids[i:end_idx]
            batch_embeddings = embeddings[i:end_idx]
            batch_metadatas = metadatas[i:end_idx]
            batch_documents = documents[i:end_idx]
            self.vector_store.insert(
                collection_name,
                batch_ids,
                batch_embeddings,
                batch_metadatas,
                batch_documents
            )

    def update_vectors(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str]
    ) -> None:
        """Update existing vectors in the collection."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        self.vector_store.update(collection_name, ids, embeddings, metadatas, documents)

    def delete_vectors(self, collection_name: str, ids: List[str]) -> None:
        """Delete specific vectors by chunk IDs."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        self.vector_store.delete(collection_name, ids)

    def delete_document_vectors(self, collection_name: str, document_id: str) -> None:
        """Delete all vectors for a specific document ID."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        self.vector_store.delete_by_document(collection_name, document_id)

    def get_vector_metadata(self, collection_name: str, ids: List[str]) -> List[Dict[str, Any]]:
        """Retrieve metadata for specified vector chunk IDs."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        records = self.vector_store.get_by_ids(collection_name, ids)
        return [r["metadata"] for r in records]

    def check_duplicate_vectors(self, collection_name: str, ids: List[str]) -> Dict[str, bool]:
        """Check which chunk IDs already exist in the vector store."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        records = self.vector_store.get_by_ids(collection_name, ids)
        existing_ids = {r["id"] for r in records}
        return {cid: (cid in existing_ids) for cid in ids}

    def count_vectors(self, collection_name: str) -> int:
        """Count all vectors in the collection."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        return self.vector_store.count(collection_name)

    def get_collection_statistics(self, collection_name: str) -> Dict[str, Any]:
        """Get collection statistics. Reuses CollectionManager details to avoid duplicating logic."""
        return self.collection_manager.get_collection_details(collection_name)

    def query_vectors(
        self,
        collection_name: str,
        query_embeddings: List[List[float]],
        n_results: int = 10,
        where: Optional[Dict[str, Any]] = None,
        include: List[str] = ["metadatas", "documents", "distances"]
    ) -> Dict[str, Any]:
        """Query vector database for similar embeddings. Validates collection name first."""
        if not self.collection_manager.validate_collection_name(collection_name):
            raise InvalidCollectionNameError(f"Collection '{collection_name}' is not allowed.")
        return self.vector_store.query(
            collection_name=collection_name,
            query_embeddings=query_embeddings,
            n_results=n_results,
            where=where,
            include=include
        )
