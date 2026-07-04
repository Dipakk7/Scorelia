# app/modules/rag/vectorstores/chroma.py

import os
from typing import Any, List, Dict, Optional
import structlog
from app.modules.rag.exceptions import ChromaDBConnectionError, CollectionNotFoundError
from app.modules.rag.vectorstores.base import VectorStore

logger = structlog.get_logger()


class ChromaDBManager:
    """Manages connections and operations on the ChromaDB persistent database."""

    def __init__(self, storage_dir: str):
        self.storage_dir = storage_dir
        self.client = None
        self._initialize_client()

    def _initialize_client(self) -> None:
        """Initialize the PersistentClient."""
        try:
            import chromadb
            # Ensure storage directory exists
            os.makedirs(self.storage_dir, exist_ok=True)
            self.client = chromadb.PersistentClient(path=self.storage_dir)
            logger.info("ChromaDB PersistentClient successfully initialized.", storage_dir=self.storage_dir)
        except Exception as e:
            logger.error("Failed to initialize ChromaDB PersistentClient", storage_dir=self.storage_dir, error=str(e))
            raise ChromaDBConnectionError(f"Failed to connect to ChromaDB: {str(e)}")

    def get_client(self) -> Any:
        """Get the underlying ChromaDB client."""
        if not self.client:
            self._initialize_client()
        return self.client

    def validate_connection(self) -> bool:
        """Validate connection to ChromaDB by checking heartbeat."""
        try:
            if not self.client:
                return False
            heartbeat = self.client.heartbeat()
            return heartbeat is not None
        except Exception as e:
            logger.error("ChromaDB connection validation failed", error=str(e))
            return False

    def heartbeat(self) -> Optional[int]:
        """Get the heartbeat nanosecond timestamp from ChromaDB."""
        try:
            if not self.client:
                return None
            return self.client.heartbeat()
        except Exception as e:
            logger.error("ChromaDB heartbeat request failed", error=str(e))
            return None

    def get_or_create_collection(self, name: str, metadata: Optional[Dict[str, Any]] = None) -> Any:
        """Retrieve or create a collection by name."""
        client = self.get_client()
        try:
            return client.get_or_create_collection(name=name, metadata=metadata)
        except Exception as e:
            logger.error("Failed to get or create collection", name=name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB collection operation failed: {str(e)}")

    def delete_collection(self, name: str) -> None:
        """Delete a collection by name."""
        client = self.get_client()
        try:
            client.delete_collection(name=name)
            logger.info("ChromaDB collection deleted successfully", name=name)
        except Exception as e:
            logger.error("Failed to delete collection", name=name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB collection deletion failed: {str(e)}")

    def list_collections(self) -> List[Any]:
        """List all collections in ChromaDB."""
        client = self.get_client()
        try:
            return client.list_collections()
        except Exception as e:
            logger.error("Failed to list collections", error=str(e))
            raise ChromaDBConnectionError(f"Failed to list collections: {str(e)}")

    def get_collection_stats(self, name: str) -> Dict[str, Any]:
        """Get collection record counts and metadata."""
        client = self.get_client()
        try:
            try:
                collection = client.get_collection(name=name)
            except Exception as get_err:
                # Typically chromadb raises ValueError if collection does not exist
                raise CollectionNotFoundError(f"Collection '{name}' does not exist.") from get_err
            
            count = collection.count()
            return {
                "name": name,
                "count": count,
                "metadata": collection.metadata
            }
        except CollectionNotFoundError:
            raise
        except Exception as e:
            logger.error("Failed to get collection stats", name=name, error=str(e))
            raise ChromaDBConnectionError(f"Failed to get collection stats: {str(e)}")


class ChromaVectorStore(VectorStore):
    """VectorStore implementation utilizing ChromaDB."""

    def __init__(self, chroma_manager: ChromaDBManager):
        self.chroma_manager = chroma_manager

    def _get_collection(self, name: str) -> Any:
        """Retrieve the target collection from the ChromaDB client."""
        return self.chroma_manager.get_or_create_collection(name=name)

    def insert(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str]
    ) -> None:
        try:
            collection = self._get_collection(collection_name)
            collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents
            )
            logger.info("Successfully inserted vectors into ChromaDB", collection=collection_name, count=len(ids))
        except Exception as e:
            logger.error("Failed to insert vectors into ChromaDB", collection=collection_name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB write failed: {str(e)}")

    def update(
        self,
        collection_name: str,
        ids: List[str],
        embeddings: List[List[float]],
        metadatas: List[Dict[str, Any]],
        documents: List[str]
    ) -> None:
        try:
            collection = self._get_collection(collection_name)
            collection.update(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents
            )
            logger.info("Successfully updated vectors in ChromaDB", collection=collection_name, count=len(ids))
        except Exception as e:
            logger.error("Failed to update vectors in ChromaDB", collection=collection_name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB update failed: {str(e)}")

    def delete(self, collection_name: str, ids: List[str]) -> None:
        try:
            collection = self._get_collection(collection_name)
            collection.delete(ids=ids)
            logger.info("Successfully deleted vectors from ChromaDB", collection=collection_name, count=len(ids))
        except Exception as e:
            logger.error("Failed to delete vectors from ChromaDB", collection=collection_name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB delete failed: {str(e)}")

    def delete_by_document(self, collection_name: str, document_id: str) -> None:
        try:
            collection = self._get_collection(collection_name)
            collection.delete(where={"document_id": document_id})
            logger.info("Successfully deleted document vectors from ChromaDB", collection=collection_name, document_id=document_id)
        except Exception as e:
            logger.error("Failed to delete document vectors from ChromaDB", collection=collection_name, document_id=document_id, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB delete by document_id failed: {str(e)}")

    def count(self, collection_name: str) -> int:
        try:
            collection = self._get_collection(collection_name)
            return collection.count()
        except Exception as e:
            logger.error("Failed to count vectors in ChromaDB", collection=collection_name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB count failed: {str(e)}")

    def get_by_ids(self, collection_name: str, ids: List[str]) -> List[Dict[str, Any]]:
        try:
            collection = self._get_collection(collection_name)
            res = collection.get(ids=ids)
            records = []
            if res and "ids" in res:
                for idx, cid in enumerate(res["ids"]):
                    records.append({
                        "id": cid,
                        "metadata": res["metadatas"][idx] if res.get("metadatas") else {},
                        "document": res["documents"][idx] if res.get("documents") else "",
                        "embedding": res["embeddings"][idx] if (res.get("embeddings") and idx < len(res["embeddings"])) else None
                    })
            return records
        except Exception as e:
            logger.error("Failed to get vectors by ids from ChromaDB", collection=collection_name, count=len(ids), error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB get failed: {str(e)}")

    def get_by_document(self, collection_name: str, document_id: str) -> List[Dict[str, Any]]:
        try:
            collection = self._get_collection(collection_name)
            res = collection.get(where={"document_id": document_id})
            records = []
            if res and "ids" in res:
                for idx, cid in enumerate(res["ids"]):
                    records.append({
                        "id": cid,
                        "metadata": res["metadatas"][idx] if res.get("metadatas") else {},
                        "document": res["documents"][idx] if res.get("documents") else "",
                        "embedding": res["embeddings"][idx] if (res.get("embeddings") and idx < len(res["embeddings"])) else None
                    })
            return records
        except Exception as e:
            logger.error("Failed to get vectors by document from ChromaDB", collection=collection_name, document_id=document_id, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB get by document failed: {str(e)}")

    def query(
        self,
        collection_name: str,
        query_embeddings: List[List[float]],
        n_results: int = 10,
        where: Optional[Dict[str, Any]] = None,
        include: List[str] = ["metadatas", "documents", "distances"]
    ) -> Dict[str, Any]:
        try:
            collection = self._get_collection(collection_name)
            # Perform query. ChromaDB expects n_results and accepts optional where metadata filters
            res = collection.query(
                query_embeddings=query_embeddings,
                n_results=n_results,
                where=where,
                include=include
            )
            return res
        except Exception as e:
            logger.error("Failed to query vectors from ChromaDB", collection=collection_name, error=str(e))
            raise ChromaDBConnectionError(f"ChromaDB query failed: {str(e)}")
