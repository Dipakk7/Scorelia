# app/modules/rag/embeddings/pipeline.py

import time
import asyncio
from typing import List, Dict, Any
from pydantic import BaseModel, Field
import structlog
from app.modules.rag.chunking.models import ChunkResponse, Chunk
from app.modules.rag.embeddings.service import EmbeddingService
from app.modules.rag.config import RAGConfig

logger = structlog.get_logger()


class ChunkEmbedding(BaseModel):
    chunk_id: str = Field(..., description="Unique deterministic identifier for the chunk.")
    vector: List[float] = Field(..., description="The embedding vector.")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata associated with this chunk vector.")
    content: str = Field(..., description="Text content of the chunk.")


class EmbeddingResult(BaseModel):
    document_id: str = Field(..., description="ID of the parent document.")
    embeddings: List[ChunkEmbedding] = Field(..., description="List of generated chunk embeddings.")
    model: str = Field(..., description="Name of the embedding model used.")
    generation_time_ms: float = Field(..., description="Time taken to generate embeddings in ms.")


class EmbeddingPipeline:
    """Pipeline to batch process chunks, generate embeddings concurrently, and validate vectors."""

    def __init__(self, embedding_service: EmbeddingService, config: RAGConfig):
        self.embedding_service = embedding_service
        self.config = config

    async def embed_chunks(self, chunk_response: ChunkResponse) -> EmbeddingResult:
        """Converts all chunks inside ChunkResponse into a list of ChunkEmbedding objects."""
        start_time = time.perf_counter()
        chunks = chunk_response.chunks
        if not chunks:
            return EmbeddingResult(
                document_id=chunk_response.document_id,
                embeddings=[],
                model=self.embedding_service.provider.model_name,
                generation_time_ms=0.0
            )

        texts = [c.content for c in chunks]
        batch_size = self.config.batch_size
        
        # Split into batches
        batches = [texts[i:i + batch_size] for i in range(0, len(texts), batch_size)]
        
        # Semaphore to limit max concurrent workers
        semaphore = asyncio.Semaphore(self.config.async_workers)
        
        async def embed_batch_with_sem(batch_idx: int, batch_texts: List[str]) -> List[List[float]]:
            async with semaphore:
                logger.debug("Starting batch embedding generation", batch_index=batch_idx, size=len(batch_texts))
                return await self.embedding_service.generate_embeddings_batch(batch_texts)

        tasks = [embed_batch_with_sem(idx, b) for idx, b in enumerate(batches)]
        
        # Run concurrently
        batch_results = await asyncio.gather(*tasks)
        
        all_vectors = []
        for r in batch_results:
            all_vectors.extend(r)

        # Map metadata and assemble ChunkEmbedding
        chunk_embeddings = []
        for idx, chunk in enumerate(chunks):
            meta = chunk.metadata.model_dump()
            
            # Convert datetime to ISO string
            if "created_at" in meta and meta["created_at"]:
                meta["created_at"] = meta["created_at"].isoformat()
            
            # Ensure core IDs are set in flat metadata for ChromaDB querying
            meta["document_id"] = chunk_response.document_id
            meta["chunk_id"] = chunk.metadata.chunk_id
            
            chunk_embeddings.append(ChunkEmbedding(
                chunk_id=chunk.metadata.chunk_id,
                vector=all_vectors[idx],
                metadata=meta,
                content=chunk.content
            ))

        duration_ms = (time.perf_counter() - start_time) * 1000

        # Privacy compliance logging: no content/vector data logged
        logger.info(
            "embeddings_generation_completed",
            document_id=chunk_response.document_id,
            chunk_count=len(chunks),
            generation_time_ms=round(duration_ms, 2),
            model=self.embedding_service.provider.model_name
        )

        return EmbeddingResult(
            document_id=chunk_response.document_id,
            embeddings=chunk_embeddings,
            model=self.embedding_service.provider.model_name,
            generation_time_ms=round(duration_ms, 2)
        )
