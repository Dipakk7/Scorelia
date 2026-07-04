# app/modules/rag/services/indexing_service.py

import hashlib
import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import structlog
from app.modules.rag.schemas.document import LoadedDocument
from app.modules.rag.chunking.service import ChunkingService
from app.modules.rag.embeddings.pipeline import EmbeddingPipeline
from app.modules.rag.vectorstores.service import VectorStorageService
from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import DuplicateDetectionError, VectorStorageError

logger = structlog.get_logger()


class IndexingSummary(BaseModel):
    """Result of document indexing execution containing metrics and processing status."""
    document_id: str = Field(..., description="The unique identifier of the indexed document.")
    chunks_indexed: int = Field(..., description="The total count of chunks stored.")
    embeddings_generated: int = Field(..., description="The count of embeddings computed.")
    processing_time_ms: float = Field(..., description="Execution duration in milliseconds.")
    collection: str = Field(..., description="Target database collection name.")
    status: str = Field(..., description="Overall status ('completed', 'skipped', or 'failed').")
    details: Optional[str] = Field(None, description="Optional extra details/warnings.")


class DocumentIndexingService:
    """Coordinates the full document ingestion-to-index pipeline including chunking and duplicate check."""

    def __init__(
        self,
        chunking_service: ChunkingService,
        embedding_pipeline: EmbeddingPipeline,
        vector_storage_service: VectorStorageService,
        config: RAGConfig
    ):
        self.chunking_service = chunking_service
        self.embedding_pipeline = embedding_pipeline
        self.vector_storage_service = vector_storage_service
        self.config = config

    async def index_document(
        self,
        document: LoadedDocument,
        collection_name: str,
        document_id: Optional[str] = None,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None,
        strategy: Optional[str] = None,
        duplicate_policy: Optional[str] = None
    ) -> IndexingSummary:
        """Executes the indexing pipeline for a loaded document."""
        start_time = time.perf_counter()

        # 1. Resolve document ID
        doc_id = document_id or getattr(document.metadata, "document_id", None)
        if not doc_id:
            # Generate deterministic hash of document content
            doc_id = hashlib.sha256(document.content.encode("utf-8")).hexdigest()

        policy = (duplicate_policy or self.config.duplicate_policy).lower().strip()

        # 2. Check for duplicate document ID in ChromaDB
        existing_records = []
        try:
            existing_records = self.vector_storage_service.vector_store.get_by_document(
                collection_name=collection_name,
                document_id=doc_id
            )
        except Exception as e:
            logger.warning(
                "Could not check existing document vectors in collection",
                collection=collection_name,
                document_id=doc_id,
                error=str(e)
            )

        if existing_records:
            if policy == "skip":
                duration_ms = (time.perf_counter() - start_time) * 1000
                logger.info(
                    "document_indexing_skipped_duplicate_document",
                    document_id=doc_id,
                    collection=collection_name
                )
                return IndexingSummary(
                    document_id=doc_id,
                    chunks_indexed=0,
                    embeddings_generated=0,
                    processing_time_ms=round(duration_ms, 2),
                    collection=collection_name,
                    status="skipped",
                    details="Document already indexed. Policy: skip."
                )
            elif policy == "fail":
                raise DuplicateDetectionError(
                    f"Document '{doc_id}' is already indexed in collection '{collection_name}'. Policy: fail."
                )
            elif policy in ("overwrite", "update"):
                logger.info(
                    "document_indexing_overwriting_existing",
                    document_id=doc_id,
                    collection=collection_name
                )
                self.vector_storage_service.delete_document_vectors(
                    collection_name=collection_name,
                    document_id=doc_id
                )

        # 3. Perform chunking
        chunk_res = self.chunking_service.chunk_document(
            document=document,
            document_id=doc_id,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            strategy=strategy
        )

        if not chunk_res.chunks:
            duration_ms = (time.perf_counter() - start_time) * 1000
            return IndexingSummary(
                document_id=doc_id,
                chunks_indexed=0,
                embeddings_generated=0,
                processing_time_ms=round(duration_ms, 2),
                collection=collection_name,
                status="completed",
                details="No chunks generated."
            )

        # 4. Generate Embeddings
        embed_result = await self.embedding_pipeline.embed_chunks(chunk_res)

        # 5. Build insertions list with duplicate chunk-level checking if document wasn't deleted
        ids = []
        vectors = []
        metadatas = []
        documents_content = []

        existing_chunk_map = {r["id"]: r for r in existing_records} if (existing_records and policy not in ("overwrite", "update")) else {}

        for item in embed_result.embeddings:
            chunk_id = item.chunk_id
            content_hash = hashlib.sha256(item.content.encode("utf-8")).hexdigest()
            item.metadata["content_hash"] = content_hash

            if chunk_id in existing_chunk_map:
                existing_item = existing_chunk_map[chunk_id]
                existing_hash = existing_item.get("metadata", {}).get("content_hash", "")
                
                # Check metadata comparison
                metadata_identical = True
                for k, v in item.metadata.items():
                    if k != "created_at" and existing_item.get("metadata", {}).get(k) != v:
                        metadata_identical = False
                        break

                if existing_hash == content_hash and metadata_identical:
                    if policy == "skip":
                        logger.debug("Skipping chunk index - duplicate chunk detected", chunk_id=chunk_id)
                        continue
                    elif policy == "fail":
                        raise DuplicateDetectionError(f"Duplicate chunk '{chunk_id}' detected. Policy: fail.")

            ids.append(chunk_id)
            vectors.append(item.vector)
            metadatas.append(item.metadata)
            documents_content.append(item.content)

        # 6. Store vectors in ChromaDB
        if ids:
            try:
                self.vector_storage_service.batch_insert(
                    collection_name=collection_name,
                    ids=ids,
                    embeddings=vectors,
                    metadatas=metadatas,
                    documents=documents_content,
                    batch_size=self.config.batch_size
                )
            except Exception as e:
                logger.error("Failed to store vectors in indexing pipeline", document_id=doc_id, error=str(e))
                raise VectorStorageError(f"Failed to store vectors: {str(e)}") from e

        duration_ms = (time.perf_counter() - start_time) * 1000

        # Privacy rules logging (no contents or vectors)
        logger.info(
            "document_indexing_completed",
            document_id=doc_id,
            chunks_indexed=len(ids),
            embeddings_generated=len(vectors),
            collection=collection_name,
            duration_seconds=round(duration_ms / 1000, 4)
        )

        return IndexingSummary(
            document_id=doc_id,
            chunks_indexed=len(ids),
            embeddings_generated=len(vectors),
            processing_time_ms=round(duration_ms, 2),
            collection=collection_name,
            status="completed"
        )
