# app/modules/rag/chunking/recursive.py

import hashlib
from datetime import datetime, timezone
from typing import List, Optional
import structlog

from app.modules.rag.schemas.document import LoadedDocument
from app.modules.rag.chunking.base import BaseChunker
from app.modules.rag.chunking.models import Chunk, ChunkMetadata
from app.modules.rag.exceptions import EmptyDocumentError, InvalidChunkSizeError

logger = structlog.get_logger()


class RecursiveChunker(BaseChunker):
    """Recursive Chunker that splits text dynamically based on standard separators."""

    def __init__(self, chunk_size: int, chunk_overlap: int, max_chunk_size: int, min_chunk_size: int, **kwargs):
        super().__init__(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            max_chunk_size=max_chunk_size,
            min_chunk_size=min_chunk_size,
            **kwargs
        )

        if chunk_overlap >= chunk_size:
            logger.error(
                "invalid_chunk_overlap_settings",
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
            )
            raise InvalidChunkSizeError("Chunk overlap must be strictly less than chunk size.")

    def chunk(self, document: LoadedDocument, **kwargs) -> List[Chunk]:
        """Splits a document into chunks recursively using LangChain's RecursiveCharacterTextSplitter.

        Splits page-by-page to preserve accurate page metadata.

        Args:
            document: Ingested LoadedDocument.

        Returns:
            List of populated Chunk models.
        """
        # Lazy import of langchain_text_splitters to ensure it's loaded only when used
        from langchain_text_splitters import RecursiveCharacterTextSplitter

        content = document.content
        if not content or not content.strip():
            logger.error("chunking_failed_empty_document")
            raise EmptyDocumentError("The document contains no text content to chunk.")

        # Extract parameters (allowing runtime overrides e.g. for preview)
        chunk_size = kwargs.get("chunk_size") or self.chunk_size
        chunk_overlap = kwargs.get("chunk_overlap") or self.chunk_overlap
        token_estimate_ratio = self.kwargs.get("token_estimate_ratio", 0.25)
        separators = self.kwargs.get("recursive_separators") or ["\n\n", "\n", " ", ""]
        keep_separator = self.kwargs.get("keep_separator", True)
        strip_whitespace = self.kwargs.get("strip_whitespace", True)

        if chunk_overlap >= chunk_size:
            raise InvalidChunkSizeError("Chunk overlap must be strictly less than chunk size.")

        # Document ID resolution
        doc_metadata = document.metadata
        source_file = getattr(doc_metadata, "file_name", "unknown")
        source_type = getattr(doc_metadata, "extension", "unknown")
        
        # Build deterministic document_id if not present
        document_id = kwargs.get("document_id") or getattr(doc_metadata, "document_id", None)
        if not document_id:
            # Deterministic hash based on content and file_name
            document_id = hashlib.sha256(f"{source_file}_{content[:1000]}".encode("utf-8")).hexdigest()[:16]

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=separators,
            keep_separator=keep_separator,
            strip_whitespace=strip_whitespace,
        )

        # Collect raw segments and keep track of their page number
        raw_splits = []
        pages = document.pages if document.pages else []
        
        if not pages:
            # Treat entire document as page 1
            splits = splitter.split_text(content)
            for s in splits:
                if s.strip():
                    raw_splits.append((1, s))
        else:
            for page_idx, page in enumerate(pages):
                page_num = page.metadata.get("page_number") if isinstance(page.metadata, dict) else (page_idx + 1)
                splits = splitter.split_text(page.content)
                for s in splits:
                    if s.strip():
                        raw_splits.append((page_num, s))

        total_chunks = len(raw_splits)
        chunks: List[Chunk] = []
        last_found_idx = 0

        for idx, (page_num, split_text) in enumerate(raw_splits):
            # Validate generated chunk
            self.validate_chunk(split_text)

            # Map global offsets sequentially in full content
            start_char = content.find(split_text, last_found_idx)
            if start_char == -1:
                start_char = content.find(split_text)
                if start_char == -1:
                    start_char = last_found_idx
            
            end_char = start_char + len(split_text)
            last_found_idx = end_char

            # Detemining word count & token estimate
            word_count = len(split_text.split())
            token_estimate = int(len(split_text) * token_estimate_ratio)

            # Deterministic chunk ID
            hash_input = f"{document_id}_{idx}_{split_text}"
            chunk_id = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()

            metadata = ChunkMetadata(
                chunk_id=chunk_id,
                document_id=document_id,
                chunk_index=idx,
                total_chunks=total_chunks,
                source_file=source_file,
                source_type=source_type,
                page_number=page_num,
                section=None,
                heading=None,
                character_start=start_char,
                character_end=end_char,
                word_count=word_count,
                token_estimate=token_estimate,
                created_at=datetime.now(timezone.utc)
            )

            chunks.append(Chunk(content=split_text, metadata=metadata))

        return chunks
