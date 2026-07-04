# app/modules/rag/knowledge/service.py

from typing import List, Dict, Any, Optional
import time
import structlog

from app.modules.rag.services.collection_manager import CollectionManager
from app.modules.rag.knowledge.registry import KnowledgeBaseRegistry
from app.modules.rag.knowledge.manager import MultiCollectionRetriever
from app.modules.rag.knowledge.models import (
    KnowledgeBaseInfo,
    CollectionStatistics,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse
)
from app.modules.rag.exceptions import (
    CollectionNotFoundError,
    InvalidCollectionNameError,
)

logger = structlog.get_logger()


class KnowledgeBaseService:
    """Orchestrates Knowledge Base registry, collection lifecycle, and cross-collection retrievals."""

    def __init__(
        self,
        collection_manager: CollectionManager,
        registry: KnowledgeBaseRegistry,
        retriever: MultiCollectionRetriever
    ):
        self.collection_manager = collection_manager
        self.registry = registry
        self.retriever = retriever

    def register_collection(
        self,
        key: str,
        display_name: str,
        description: str,
        collection_name: str,
        enabled: bool = True,
        is_default: bool = False,
        version: str = "1.0.0",
        metadata: Optional[Dict[str, Any]] = None
    ) -> KnowledgeBaseInfo:
        """Register a collection in the registry, and ensure it exists/is created in ChromaDB."""
        logger.info("Registering RAG knowledge collection", key=key, collection_name=collection_name)
        
        # 1. Create or verify collection in ChromaDB
        # This will raise InvalidCollectionNameError if name is not allowed in core constants
        try:
            self.collection_manager.create_collection(name=collection_name, metadata=metadata)
        except InvalidCollectionNameError as e:
            logger.error("Failed to create collection in DB during registration", name=collection_name, error=str(e))
            raise e

        # 2. Register in KB registry
        kb_info = self.registry.register_kb(
            key=key,
            display_name=display_name,
            description=description,
            collection_name=collection_name,
            enabled=enabled,
            is_default=is_default,
            version=version,
            metadata=metadata
        )
        return kb_info

    def delete_collection(self, key: str) -> None:
        """Delete a collection from the registry and remove it from ChromaDB."""
        logger.info("Deleting RAG knowledge collection", key=key)
        
        # 1. Fetch from registry
        try:
            kb = self.registry.get_kb(key)
        except KeyError as e:
            raise CollectionNotFoundError(f"Knowledge base '{key}' is not registered.") from e

        # 2. Delete from ChromaDB
        self.collection_manager.delete_collection(name=kb.collection_name)

        # 3. Remove from registry
        self.registry.remove_kb(key)

    def refresh_collections(self) -> List[KnowledgeBaseInfo]:
        """Validate and synchronize registered collection statistics and active status."""
        logger.info("Refreshing RAG knowledge base registry against ChromaDB")
        
        # We can list active collections in ChromaDB
        try:
            db_collections = {col["name"] for col in self.collection_manager.list_collections()}
        except Exception as e:
            logger.error("Failed to fetch collections from database during refresh", error=str(e))
            db_collections = set()

        # Update enabled/disabled status in registry based on actual existence in DB, if needed
        for kb in self.registry.list_kbs():
            if kb.collection_name not in db_collections:
                # If collection doesn't exist in ChromaDB, mark disabled
                logger.warning("Registered collection not found in database, disabling", key=kb.key, collection=kb.collection_name)
                kb.enabled = False
            else:
                kb.enabled = True

        return self.registry.list_kbs()

    def get_collection_statistics(self, key: str) -> CollectionStatistics:
        """Get database stats and metadata for a specific registered knowledge base."""
        try:
            kb = self.registry.get_kb(key)
        except KeyError as e:
            raise CollectionNotFoundError(f"Knowledge base '{key}' is not registered.") from e

        # Get details from CollectionManager
        try:
            details = self.collection_manager.get_collection_details(kb.collection_name)
        except CollectionNotFoundError:
            # If not found, count is 0
            return CollectionStatistics(
                name=kb.collection_name,
                count=0,
                space="l2",
                metadata=kb.metadata
            )

        col_meta = details.get("metadata") or {}
        space = col_meta.get("hnsw:space", "l2")

        return CollectionStatistics(
            name=details["name"],
            count=details.get("count", 0),
            space=space,
            metadata=details.get("metadata")
        )

    def get_all_collection_statistics(self) -> List[CollectionStatistics]:
        """Get database stats for all registered knowledge bases."""
        stats = []
        for kb in self.registry.list_kbs():
            try:
                stat = self.get_collection_statistics(kb.key)
                stats.append(stat)
            except Exception as e:
                logger.error("Error retrieving statistics for knowledge base", key=kb.key, error=str(e))
        return stats

    def get_collection_health(self, key: str) -> Dict[str, Any]:
        """Retrieve health check status of a specific collection."""
        try:
            kb = self.registry.get_kb(key)
        except KeyError:
            return {"status": "unhealthy", "error": f"Knowledge base '{key}' not registered."}

        try:
            self.collection_manager.get_collection_details(kb.collection_name)
            return {
                "status": "healthy" if kb.enabled else "disabled",
                "collection_name": kb.collection_name,
                "enabled": kb.enabled
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "collection_name": kb.collection_name,
                "error": str(e)
            }

    async def search(self, request: KnowledgeSearchRequest) -> KnowledgeSearchResponse:
        """Perform cross-collection semantic search based on strategy and return response."""
        start_time = time.perf_counter()
        
        # Delegate search to MultiCollectionRetriever
        chunks = await self.retriever.search(
            query=request.query,
            strategy=request.strategy,
            collections=request.collections,
            top_k=request.top_k,
            similarity_threshold=request.similarity_threshold,
            filters=request.filters
        )

        latency = (time.perf_counter() - start_time) * 1000.0
        
        # Resolve target collections that were searched
        strategy_str = request.strategy or self.retriever.config.default_search_strategy
        resolved_keys = self.retriever._resolve_collections_for_strategy(
            request.strategy, request.collections
        )
        resolved_collection_names = []
        for key in resolved_keys:
            try:
                kb = self.registry.get_kb(key)
                resolved_collection_names.append(kb.collection_name)
            except KeyError:
                resolved_collection_names.append(key)

        return KnowledgeSearchResponse(
            query=request.query,
            strategy=strategy_str,
            collections_searched=resolved_collection_names,
            chunks=chunks,
            latency_ms=latency
        )
