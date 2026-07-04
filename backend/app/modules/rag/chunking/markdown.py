# app/modules/rag/chunking/markdown.py

import hashlib
from datetime import datetime, timezone
from typing import List, Optional
import structlog

from app.modules.rag.schemas.document import LoadedDocument
from app.modules.rag.chunking.base import BaseChunker
from app.modules.rag.chunking.models import Chunk, ChunkMetadata
from app.modules.rag.exceptions import EmptyDocumentError, InvalidChunkSizeError

logger = structlog.get_logger()


class MarkdownChunker(BaseChunker):
    """Markdown Chunker that preserves headings, lists, tables, code blocks, and section hierarchies."""

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
        """Chunks markdown document preserving structure and heading hierarchies.

        First splits by headings, then sub-splits large sections recursively.

        Args:
            document: Ingested markdown document.

        Returns:
            List of populated Chunk models.
        """
        # Lazy imports of langchain_text_splitters
        from langchain_text_splitters import MarkdownHeaderTextSplitter, MarkdownTextSplitter

        content = document.content
        if not content or not content.strip():
            logger.error("markdown_chunking_failed_empty_document")
            raise EmptyDocumentError("The document contains no text content to chunk.")

        # Extract parameters
        chunk_size = kwargs.get("chunk_size") or self.chunk_size
        chunk_overlap = kwargs.get("chunk_overlap") or self.chunk_overlap
        token_estimate_ratio = self.kwargs.get("token_estimate_ratio", 0.25)
        markdown_headers = self.kwargs.get("markdown_headers") or ["#", "##", "###", "####"]

        if chunk_overlap >= chunk_size:
            raise InvalidChunkSizeError("Chunk overlap must be strictly less than chunk size.")

        # Document ID resolution
        doc_metadata = document.metadata
        source_file = getattr(doc_metadata, "file_name", "unknown")
        source_type = getattr(doc_metadata, "extension", "unknown")
        
        document_id = kwargs.get("document_id") or getattr(doc_metadata, "document_id", None)
        if not document_id:
            document_id = hashlib.sha256(f"{source_file}_{content[:1000]}".encode("utf-8")).hexdigest()[:16]

        # 1. First Pass: Split by headers
        headers_to_split_on = [(h, f"Header {len(h)}") for h in markdown_headers if h]
        header_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=headers_to_split_on,
            strip_headers=False,  # Keep header texts inside page content for full context readability
        )

        header_splits = header_splitter.split_text(content)

        # 2. Second Pass: Sub-split sections exceeding chunk_size
        sub_splitter = MarkdownTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )

        raw_splits = []
        for split in header_splits:
            split_text = split.page_content
            split_meta = split.metadata

            # Extract section hierarchy
            # E.g. split_meta = {"Header 1": "Intro", "Header 2": "Details"}
            headers = [v for k, v in sorted(split_meta.items()) if k.startswith("Header")]
            section = headers[0] if headers else None
            heading = headers[-1] if headers else None

            if len(split_text) <= chunk_size:
                if split_text.strip():
                    raw_splits.append((split_text, section, heading))
            else:
                sub_texts = sub_splitter.split_text(split_text)
                for sub_text in sub_texts:
                    if sub_text.strip():
                        raw_splits.append((sub_text, section, heading))

        total_chunks = len(raw_splits)
        chunks: List[Chunk] = []
        last_found_idx = 0

        # Preserve page number from LoadedDocument page-level info if present
        # In Markdown, typically everything is on page 1
        page_num = 1
        if document.pages and len(document.pages) == 1:
            page_meta = document.pages[0].metadata
            page_num = page_meta.get("page_number") or 1

        for idx, (split_text, section, heading) in enumerate(raw_splits):
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
                section=section,
                heading=heading,
                character_start=start_char,
                character_end=end_char,
                word_count=word_count,
                token_estimate=token_estimate,
                created_at=datetime.now(timezone.utc)
            )

            chunks.append(Chunk(content=split_text, metadata=metadata))

        return chunks
