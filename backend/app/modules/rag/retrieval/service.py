# app/modules/rag/retrieval/service.py

import time
from typing import List, Optional
import structlog

from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import (
    EmptyQueryError,
    InvalidTopKError,
    SearchFailureError,
    SimilarityThresholdError,
    EmbeddingFailureError,
    InvalidCollectionNameError,
    CollectionNotFoundError
)
from app.modules.rag.retrieval.base import BaseRetriever
from app.modules.rag.retrieval.models import (
    SearchRequest,
    SearchResponse,
    SearchMetadata,
    MetadataFilter,
    RetrievedChunk
)
from app.modules.rag.retrieval.reranker import BaseReranker, NoOpReranker

logger = structlog.get_logger()


class RetrievalService:
    """Orchestrates similarity search and ranking across indexed vector collections.

    Handles input validation, retriever invocation, similarity threshold filtering,
    reranking, duplicate removal, and formatting retrieval metrics.
    """

    def __init__(
        self,
        retriever: BaseRetriever,
        config: RAGConfig,
        reranker: Optional[BaseReranker] = None
    ):
        self.retriever = retriever
        self.config = config
        self.reranker = reranker or NoOpReranker()

    async def retrieve(
        self,
        query: str,
        collection: str,
        top_k: Optional[int] = None,
        similarity_threshold: Optional[float] = None,
        filters: Optional[MetadataFilter] = None
    ) -> SearchResponse:
        """Executes similarity search for a single query."""
        start_time = time.perf_counter()

        # 1. Query validation
        if not query or not query.strip():
            raise EmptyQueryError("Search query string cannot be empty.")

        # Determine parameters
        tk = top_k if top_k is not None else self.config.default_top_k
        if tk <= 0:
            raise InvalidTopKError("top_k must be a positive integer.")
        if tk > self.config.max_top_k:
            tk = self.config.max_top_k

        threshold = similarity_threshold if similarity_threshold is not None else self.config.similarity_threshold
        if not (0.0 <= threshold <= 1.0):
            raise SimilarityThresholdError("similarity_threshold must be between 0.0 and 1.0.")

        request = SearchRequest(
            query=query.strip(),
            collection=collection,
            top_k=tk,
            similarity_threshold=threshold,
            filters=filters
        )

        # 2. Execute retrieval
        try:
            chunks = await self.retriever.search(request)
        except (EmptyQueryError, InvalidTopKError, SimilarityThresholdError, EmbeddingFailureError, SearchFailureError, InvalidCollectionNameError, CollectionNotFoundError) as custom_err:
            raise custom_err
        except Exception as e:
            logger.error("Unhandled retriever exception in search", error=str(e))
            raise SearchFailureError(f"Similarity search failed: {str(e)}") from e

        total_retrieved = len(chunks)

        # 3. Apply threshold filter
        filtered_chunks = [c for c in chunks if c.similarity_score >= threshold]

        # 4. Rerank
        reranked_chunks = await self.reranker.rerank(request.query, filtered_chunks)

        # 5. Remove duplicates
        if self.config.duplicate_removal:
            seen_ids = set()
            seen_contents = set()
            unique_chunks = []
            for c in reranked_chunks:
                norm_content = c.content.strip()
                if c.chunk_id not in seen_ids and norm_content not in seen_contents:
                    seen_ids.add(c.chunk_id)
                    seen_contents.add(norm_content)
                    unique_chunks.append(c)
            reranked_chunks = unique_chunks

        # 6. Sort explicitly by similarity score descending
        reranked_chunks.sort(key=lambda x: x.similarity_score, reverse=True)

        # 7. Apply limit
        final_chunks = reranked_chunks[:tk]

        latency_ms = (time.perf_counter() - start_time) * 1000

        # Privacy compliance logging (never log text, queries, or vectors)
        logger.info(
            "retrieval_completed",
            collection=collection,
            top_k=tk,
            similarity_threshold=threshold,
            retrieved_chunk_count=len(final_chunks),
            latency_ms=round(latency_ms, 2)
        )

        metadata = SearchMetadata(
            total_retrieved=total_retrieved,
            latency_ms=round(latency_ms, 2),
            embedding_model=self.config.embedding_model,
            similarity_threshold=threshold,
            top_k=tk
        )

        return SearchResponse(
            query=request.query,
            collection=collection,
            chunks=final_chunks,
            metadata=metadata
        )

    async def retrieve_batch(self, requests: List[SearchRequest]) -> List[SearchResponse]:
        """Executes similarity searches in batch for high performance and low latency."""
        if not requests:
            return []

        # Validate requests first
        for idx, req in enumerate(requests):
            if not req.query or not req.query.strip():
                raise EmptyQueryError(f"Search query at index {idx} cannot be empty.")
            
            tk = req.top_k if req.top_k is not None else self.config.default_top_k
            if tk <= 0:
                raise InvalidTopKError(f"top_k at index {idx} must be a positive integer.")
            if tk > self.config.max_top_k:
                req.top_k = self.config.max_top_k
            
            threshold = req.similarity_threshold if req.similarity_threshold is not None else self.config.similarity_threshold
            if not (0.0 <= threshold <= 1.0):
                raise SimilarityThresholdError(f"similarity_threshold at index {idx} must be between 0.0 and 1.0.")

        start_time = time.perf_counter()

        # Execute batch retrieval
        try:
            batch_chunks_list = await self.retriever.search_batch(requests)
        except (EmptyQueryError, InvalidTopKError, SimilarityThresholdError, EmbeddingFailureError, SearchFailureError, InvalidCollectionNameError, CollectionNotFoundError) as custom_err:
            raise custom_err
        except Exception as e:
            logger.error("Unhandled retriever exception in batch search", error=str(e))
            raise SearchFailureError(f"Batch similarity search failed: {str(e)}") from e

        responses: List[SearchResponse] = []
        for idx, request in enumerate(requests):
            req_start_time = time.perf_counter()
            chunks = batch_chunks_list[idx]
            total_retrieved = len(chunks)

            # Apply threshold
            threshold = request.similarity_threshold if request.similarity_threshold is not None else self.config.similarity_threshold
            filtered_chunks = [c for c in chunks if c.similarity_score >= threshold]

            # Rerank
            reranked_chunks = await self.reranker.rerank(request.query, filtered_chunks)

            # Deduplicate
            if self.config.duplicate_removal:
                seen_ids = set()
                seen_contents = set()
                unique_chunks = []
                for c in reranked_chunks:
                    norm_content = c.content.strip()
                    if c.chunk_id not in seen_ids and norm_content not in seen_contents:
                        seen_ids.add(c.chunk_id)
                        seen_contents.add(norm_content)
                        unique_chunks.append(c)
                reranked_chunks = unique_chunks

            # Sort
            reranked_chunks.sort(key=lambda x: x.similarity_score, reverse=True)

            # Limit
            tk = request.top_k or self.config.default_top_k
            final_chunks = reranked_chunks[:tk]

            req_latency_ms = (time.perf_counter() - req_start_time) * 1000

            metadata = SearchMetadata(
                total_retrieved=total_retrieved,
                latency_ms=round(req_latency_ms, 2),
                embedding_model=self.config.embedding_model,
                similarity_threshold=threshold,
                top_k=tk
            )

            responses.append(SearchResponse(
                query=request.query,
                collection=request.collection,
                chunks=final_chunks,
                metadata=metadata
            ))

        total_latency_ms = (time.perf_counter() - start_time) * 1000

        # Privacy compliance logging (never log text or queries)
        logger.info(
            "batch_retrieval_completed",
            request_count=len(requests),
            latency_ms=round(total_latency_ms, 2)
        )

        return responses
