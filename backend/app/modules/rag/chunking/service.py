# app/modules/rag/chunking/service.py

import time
import structlog
from typing import List, Optional

from app.modules.rag.config import RAGConfig
from app.modules.rag.schemas.document import LoadedDocument
from app.modules.rag.chunking.models import Chunk, ChunkResponse
from app.modules.rag.chunking.factory import ChunkFactory
from app.modules.rag.exceptions import EmptyDocumentError, InvalidChunkSizeError

logger = structlog.get_logger()


class ChunkingService:
    """Service coordinates document splitting and chunk generation, adhering to safety/privacy rules."""

    def __init__(self, config: RAGConfig):
        self.config = config

    def chunk_document(
        self,
        document: LoadedDocument,
        document_id: Optional[str] = None,
        chunk_size: Optional[int] = None,
        chunk_overlap: Optional[int] = None,
        strategy: Optional[str] = None,
    ) -> ChunkResponse:
        """Processes LoadedDocument and returns ChunkResponse with generated Chunks.

        Args:
            document: LoadedDocument input.
            document_id: Optional document ID override.
            chunk_size: Optional chunk size override.
            chunk_overlap: Optional chunk overlap override.
            strategy: Optional strategy override ('recursive', 'markdown', 'semantic', 'auto').

        Returns:
            A structured ChunkResponse.
        """
        start_time = time.perf_counter()

        # 1. Validation
        if not document.content or not document.content.strip():
            logger.error("chunking_failed_empty_document_content")
            raise EmptyDocumentError("The document contains no text content to chunk.")

        # Determine overrides
        c_size = chunk_size or self.config.default_chunk_size
        c_overlap = chunk_overlap if chunk_overlap is not None else self.config.default_chunk_overlap
        
        if c_overlap >= c_size:
            logger.error(
                "invalid_chunk_size_configuration",
                chunk_size=c_size,
                chunk_overlap=c_overlap,
            )
            raise InvalidChunkSizeError("Chunk overlap must be strictly less than chunk size.")

        # Resolve strategy
        source_ext = document.metadata.extension or "txt"
        strategy_used = strategy or "auto"
        if strategy_used == "auto":
            # Select based on file type
            if source_ext.lower().strip() in ["md", "markdown"]:
                strategy_used = "markdown"
            else:
                strategy_used = "recursive"

        # 2. Instantiate chunker from Factory
        chunker = ChunkFactory.get_chunker(
            strategy=strategy_used,
            chunk_size=c_size,
            chunk_overlap=c_overlap,
            max_chunk_size=self.config.max_chunk_size,
            min_chunk_size=self.config.min_chunk_size,
            recursive_separators=self.config.recursive_separators,
            keep_separator=self.config.keep_separator,
            strip_whitespace=self.config.strip_whitespace,
            markdown_headers=self.config.markdown_headers,
            token_estimate_ratio=self.config.token_estimate_ratio,
        )

        # 3. Perform chunking
        chunks: List[Chunk] = chunker.chunk(
            document=document,
            document_id=document_id,
            chunk_size=c_size,
            chunk_overlap=c_overlap,
        )

        # 4. Final Verification / Validation of chunk counts
        total_chunks = len(chunks)

        # Calculate metrics
        duration = time.perf_counter() - start_time
        duration_ms = duration * 1000
        avg_chunk_size = sum(len(c.content) for c in chunks) / total_chunks if total_chunks > 0 else 0.0

        # Retrieve resolved document_id from the first chunk's metadata, or fallback to passed ID
        resolved_doc_id = chunks[0].metadata.document_id if total_chunks > 0 else (document_id or "unknown")

        # 5. Privacy Logging (log only metrics, never log raw text/PII)
        logger.info(
            "document_segmentation_completed",
            document_id=resolved_doc_id,
            chunk_count=total_chunks,
            processing_duration_seconds=round(duration, 4),
            strategy_used=strategy_used,
            average_chunk_size=round(avg_chunk_size, 2)
        )

        return ChunkResponse(
            document_id=resolved_doc_id,
            strategy_used=strategy_used,
            total_chunks=total_chunks,
            chunks=chunks,
            processing_time_ms=round(duration_ms, 2)
        )
