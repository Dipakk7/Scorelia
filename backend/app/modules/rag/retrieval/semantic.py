# app/modules/rag/retrieval/semantic.py

import time
from typing import List, Dict, Any, Optional
import structlog

from app.modules.rag.config import RAGConfig
from app.modules.rag.embeddings.service import EmbeddingService
from app.modules.rag.exceptions import (
    RetrievalError,
    EmbeddingFailureError,
    SearchFailureError,
    InvalidCollectionNameError,
    CollectionNotFoundError
)
from app.modules.rag.retrieval.base import BaseRetriever
from app.modules.rag.retrieval.models import SearchRequest, RetrievedChunk
from app.modules.rag.retrieval.filters import compile_metadata_filter
from app.modules.rag.vectorstores.service import VectorStorageService

logger = structlog.get_logger()


class SemanticRetriever(BaseRetriever):
    """Retriever that executes semantic similarity searches against ChromaDB using vector embeddings."""

    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_storage_service: VectorStorageService,
        config: RAGConfig
    ):
        self.embedding_service = embedding_service
        self.vector_storage_service = vector_storage_service
        self.config = config

    def _normalize_score(self, distance: float, space: str) -> float:
        """Converts distance metric to a normalized similarity score in range [0, 1]."""
        dist = max(0.0, float(distance))
        if space == "cosine":
            # Cosine distance = 1 - cosine_similarity. So cosine_similarity = 1 - distance.
            return max(0.0, min(1.0, 1.0 - dist))
        elif space == "ip":
            # Inner product distance in Chroma is 1 - IP. So IP similarity = 1 - distance.
            return max(0.0, min(1.0, 1.0 - dist))
        else:
            # Default L2 space: similarity = 1 / (1 + distance)
            return 1.0 / (1.0 + dist)

    async def search(self, request: SearchRequest) -> List[RetrievedChunk]:
        """Perform semantic similarity search for a single query."""
        results = await self.search_batch([request])
        return results[0]

    async def search_batch(self, requests: List[SearchRequest]) -> List[List[RetrievedChunk]]:
        """Perform batch semantic similarity search for a list of requests.

        Optimized to batch embed queries and retrieve results concurrently/bulk.
        """
        if not requests:
            return []

        # 1. Generate query embeddings in batch
        queries = [req.query for req in requests]
        try:
            query_embeddings = await self.embedding_service.generate_embeddings_batch(queries)
        except Exception as e:
            logger.error("Embedding generation failed during semantic search batch", error=str(e))
            raise EmbeddingFailureError(f"Failed to generate query embeddings: {str(e)}") from e

        results: List[List[RetrievedChunk]] = []

        # 2. Query vector store for each request (since collection/where filters might differ per request)
        # ChromaDB allows query_embeddings in bulk, but if collection and where filters are identical, we could optimize.
        # But requests typically can target different collections or filters, so we process each search request.
        # To maintain high performance, we run them sequentially or in concurrent tasks if appropriate, but since
        # ChromaDB query is synchronous, we run them sequentially.
        for idx, request in enumerate(requests):
            query_vector = query_embeddings[idx]
            collection_key = request.collection
            
            # Map logical collection name to actual collection name (e.g. resume_kb -> resume_kb_dev)
            actual_collection = self.config.collections.get(collection_key, collection_key)
            
            # Determine Top-K
            top_k = request.top_k or self.config.default_top_k
            if top_k > self.config.max_top_k:
                top_k = self.config.max_top_k

            # Compile where filters
            where_clause = None
            if self.config.metadata_filtering and request.filters:
                where_clause = compile_metadata_filter(request.filters)

            # Get distance space of collection to compute correct similarity scores
            space = "l2"
            try:
                details = self.vector_storage_service.get_collection_statistics(actual_collection)
                col_meta = details.get("metadata") or {}
                space = col_meta.get("hnsw:space", "l2")
            except Exception:
                # Fallback to default
                pass

            try:
                # Query vectors
                res = self.vector_storage_service.query_vectors(
                    collection_name=actual_collection,
                    query_embeddings=[query_vector],
                    n_results=top_k,
                    where=where_clause,
                    include=["metadatas", "documents", "distances"]
                )
            except (InvalidCollectionNameError, CollectionNotFoundError) as known_err:
                raise known_err
            except Exception as e:
                logger.error(
                    "ChromaDB search query failed",
                    collection=actual_collection,
                    error=str(e)
                )
                raise SearchFailureError(f"Failed to execute vector search on '{actual_collection}': {str(e)}") from e

            # Parse results
            chunks: List[RetrievedChunk] = []
            if res and "ids" in res and len(res["ids"]) > 0:
                # res["ids"] is a list of lists of ids
                batch_ids = res["ids"][0]
                batch_metadatas = res["metadatas"][0] if res.get("metadatas") else []
                batch_documents = res["documents"][0] if res.get("documents") else []
                batch_distances = res["distances"][0] if res.get("distances") else []

                for i in range(len(batch_ids)):
                    chunk_id = batch_ids[i]
                    metadata = batch_metadatas[i] or {}
                    content = batch_documents[i] or ""
                    distance = batch_distances[i] if i < len(batch_distances) else 0.0

                    # Calculate normalized similarity score
                    score = self._normalize_score(distance, space) if self.config.score_normalization else float(distance)

                    # Extract metadata fields
                    doc_id = metadata.get("document_id", "")
                    page = metadata.get("page_number")
                    section = metadata.get("section")
                    heading = metadata.get("heading")
                    source = metadata.get("source_file")
                    chunk_idx = metadata.get("chunk_index", 0)

                    chunks.append(RetrievedChunk(
                        chunk_id=chunk_id,
                        document_id=doc_id,
                        similarity_score=score,
                        content=content,
                        page=page,
                        section=section,
                        heading=heading,
                        source=source,
                        chunk_index=chunk_idx,
                        embedding_model=self.config.embedding_model,
                        collection=collection_key
                    ))

            
            results.append(chunks)

        return results
