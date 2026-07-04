# app/modules/rag/knowledge/manager.py

import time
from typing import List, Dict, Any, Optional
import structlog

from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import (
    RetrievalError,
    CollectionNotFoundError,
    DisabledCollectionError,
    InvalidSearchStrategyError,
    EmptyKnowledgeBaseError,
)
from app.modules.rag.retrieval.models import SearchRequest, RetrievedChunk, MetadataFilter
from app.modules.rag.retrieval.semantic import SemanticRetriever
from app.modules.rag.knowledge.registry import KnowledgeBaseRegistry

logger = structlog.get_logger()


class MultiCollectionRetriever:
    """Retriever capable of searching across multiple ChromaDB collections with custom merge strategies."""

    def __init__(
        self,
        semantic_retriever: SemanticRetriever,
        registry: KnowledgeBaseRegistry,
        config: RAGConfig
    ):
        self.semantic_retriever = semantic_retriever
        self.registry = registry
        self.config = config

    def _resolve_collections_for_strategy(
        self,
        strategy: Optional[str],
        requested_collections: Optional[List[str]] = None
    ) -> List[str]:
        """Resolves target collection keys based on the search strategy and custom collection overrides."""
        # 1. Resolve strategy default if strategy not explicitly supplied
        strat = strategy or self.config.default_search_strategy
        
        # 2. Check strategy
        if strat == "resume_only":
            target_keys = ["resume_kb"]
        elif strat == "company_only":
            target_keys = ["company_kb"]
        elif strat == "job_only":
            target_keys = ["job_kb"]
        elif strat == "course_only":
            target_keys = ["course_kb"]
        elif strat == "skills_only":
            target_keys = ["skills_kb"]
        elif strat == "global":
            target_keys = [kb.key for kb in self.registry.list_kbs(enabled_only=True)]
        elif strat == "custom":
            if not requested_collections:
                raise InvalidSearchStrategyError(
                    "Custom strategy requires a list of explicit collections to search."
                )
            target_keys = requested_collections
        else:
            # If strategy is unrecognized but matches a valid KB key, search only that KB
            try:
                kb = self.registry.get_kb(strat)
                target_keys = [kb.key]
            except KeyError as e:
                raise InvalidSearchStrategyError(
                    f"Unknown search strategy or knowledge base key '{strat}'."
                ) from e

        # Ensure we have active collections
        resolved_collections = []
        for key in target_keys:
            try:
                kb = self.registry.get_kb(key)
                if not kb.enabled:
                    raise DisabledCollectionError(f"Knowledge base collection '{key}' is disabled.")
                resolved_collections.append(key)
            except KeyError as e:
                raise CollectionNotFoundError(
                    f"Collection '{key}' is not registered in the Knowledge Base."
                ) from e

        # Limit to max collections from configuration
        max_colls = self.config.max_collections
        if len(resolved_collections) > max_colls:
            logger.warning(
                "Truncating requested collections count to max configured limit",
                requested=len(resolved_collections),
                max_allowed=max_colls
            )
            resolved_collections = resolved_collections[:max_colls]

        return resolved_collections

    async def search(
        self,
        query: str,
        strategy: Optional[str] = None,
        collections: Optional[List[str]] = None,
        top_k: Optional[int] = None,
        similarity_threshold: Optional[float] = None,
        filters: Optional[MetadataFilter] = None
    ) -> List[RetrievedChunk]:
        """Execute cross-collection semantic search and merge/score/deduplicate chunks."""
        start_time = time.perf_counter()
        
        # 1. Resolve strategy and collections
        resolved_keys = self._resolve_collections_for_strategy(strategy, collections)
        if not resolved_keys:
            raise EmptyKnowledgeBaseError("No active collections identified for retrieval.")

        # 2. Build search requests for SemanticRetriever
        req_top_k = top_k or self.config.default_top_k
        req_threshold = similarity_threshold if similarity_threshold is not None else self.config.similarity_threshold

        search_requests = []
        for key in resolved_keys:
            search_requests.append(
                SearchRequest(
                    query=query,
                    collection=key,
                    top_k=req_top_k,
                    similarity_threshold=req_threshold,
                    filters=filters
                )
            )

        # 3. Batch retrieve from SemanticRetriever (leveraging concurrent/batch embedding generation)
        try:
            batch_results = await self.semantic_retriever.search_batch(search_requests)
        except Exception as e:
            logger.error("Batch retrieval failed across collections", error=str(e))
            raise RetrievalError(f"Failed to retrieve chunks: {str(e)}") from e

        # 4. Merge results & apply Collection Weighting
        all_chunks: List[RetrievedChunk] = []
        for idx, key in enumerate(resolved_keys):
            chunks = batch_results[idx]
            weight = self.config.collection_weight.get(key, 1.0)
            
            for chunk in chunks:
                # Apply weight to similarity score
                chunk.similarity_score = chunk.similarity_score * weight
                all_chunks.append(chunk)

        # 5. Duplicate Removal (deduplicate by chunk_id, keep highest score)
        deduplicated: Dict[str, RetrievedChunk] = {}
        for chunk in all_chunks:
            existing = deduplicated.get(chunk.chunk_id)
            if existing is None or chunk.similarity_score > existing.similarity_score:
                deduplicated[chunk.chunk_id] = chunk

        merged_list = list(deduplicated.values())

        # 6. Sort results based on weighted similarity score (descending) and priority (descending)
        chunk_priorities = {}
        for idx, key in enumerate(resolved_keys):
            chunks = batch_results[idx]
            priority = self.config.collection_priority.get(key, 0)
            for chunk in chunks:
                chunk_priorities[chunk.chunk_id] = priority

        merged_list.sort(key=lambda x: (x.similarity_score, chunk_priorities.get(x.chunk_id, 0)), reverse=True)

        # 7. Apply similarity threshold check if requested
        if req_threshold is not None:
            merged_list = [c for c in merged_list if c.similarity_score >= req_threshold]

        # 8. Limit to requested top_k overall
        final_chunks = merged_list[:req_top_k]

        # 9. Logging & Privacy (Task 10)
        # NEVER log: Query text, resume contents, retrieved chunk text, embedding vectors, personal info.
        # Only log: collections searched, search strategy, retrieved chunk count, execution time.
        latency = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            "Multi-collection search execution completed",
            collections_searched=resolved_keys,
            strategy=strategy or self.config.default_search_strategy,
            retrieved_chunk_count=len(final_chunks),
            latency_ms=latency
        )

        return final_chunks
