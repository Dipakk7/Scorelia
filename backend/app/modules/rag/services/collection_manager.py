# app/modules/rag/services/collection_manager.py

from typing import List, Dict, Any, Optional
import structlog
from app.modules.rag.constants import ALLOWED_COLLECTIONS
from app.modules.rag.exceptions import InvalidCollectionNameError, CollectionNotFoundError
from app.modules.rag.vectorstores.chroma import ChromaDBManager

logger = structlog.get_logger()


class CollectionManager:
    """Manages ChromaDB collections, validation, statistics, and lifecycle."""

    def __init__(self, chroma_manager: ChromaDBManager):
        self.chroma_manager = chroma_manager

    def validate_collection_name(self, name: str) -> bool:
        """Check if the given collection name is supported."""
        return name in ALLOWED_COLLECTIONS

    def create_collection(self, name: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Create a new collection if it's valid."""
        if not self.validate_collection_name(name):
            logger.error("Attempted to create collection with invalid name", name=name)
            raise InvalidCollectionNameError(
                f"Collection name '{name}' is invalid. Allowed collections: {list(ALLOWED_COLLECTIONS)}"
            )

        logger.info("Creating RAG collection", name=name, metadata=metadata)
        collection = self.chroma_manager.get_or_create_collection(name=name, metadata=metadata)
        return {
            "name": collection.name,
            "metadata": collection.metadata,
            "count": collection.count()
        }

    def delete_collection(self, name: str) -> None:
        """Delete an existing collection."""
        if not self.validate_collection_name(name):
            logger.error("Attempted to delete collection with invalid name", name=name)
            raise InvalidCollectionNameError(
                f"Collection name '{name}' is invalid. Allowed collections: {list(ALLOWED_COLLECTIONS)}"
            )

        # Check if the collection exists before attempting deletion to raise 404
        existing_names = [col.name for col in self.chroma_manager.list_collections()]
        if name not in existing_names:
            logger.error("Collection not found for deletion", name=name)
            raise CollectionNotFoundError(f"Collection '{name}' does not exist.")

        logger.info("Deleting RAG collection", name=name)
        self.chroma_manager.delete_collection(name=name)

    def list_collections(self) -> List[Dict[str, Any]]:
        """List all collections along with their record counts and metadata."""
        collections = self.chroma_manager.list_collections()
        result = []
        for col in collections:
            result.append({
                "name": col.name,
                "metadata": col.metadata,
                "count": col.count()
            })
        return result

    def get_collection_details(self, name: str) -> Dict[str, Any]:
        """Get stats and metadata for a specific collection name."""
        if not self.validate_collection_name(name):
            raise InvalidCollectionNameError(
                f"Collection name '{name}' is invalid. Allowed collections: {list(ALLOWED_COLLECTIONS)}"
            )
        
        # This raises CollectionNotFoundError if not exists
        return self.chroma_manager.get_collection_stats(name=name)
