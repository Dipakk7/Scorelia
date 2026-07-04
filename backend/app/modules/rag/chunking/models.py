# app/modules/rag/chunking/models.py

from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, field_validator

from app.modules.rag.schemas.document import LoadedDocument


class ChunkMetadata(BaseModel):
    """Metadata specific to an individual document chunk."""
    chunk_id: str = Field(..., description="Unique deterministic identifier for the chunk.")
    document_id: str = Field(..., description="Identifier of the parent document.")
    chunk_index: int = Field(..., description="0-indexed position of this chunk within the document sequence.")
    total_chunks: int = Field(..., description="Total number of chunks generated for this document.")
    source_file: str = Field(..., description="Name of the original source file.")
    source_type: str = Field(..., description="File extension or format type.")
    page_number: Optional[int] = Field(None, description="1-indexed page number where the chunk content is located.")
    section: Optional[str] = Field(None, description="Logical document section heading.")
    heading: Optional[str] = Field(None, description="Immediate heading context (lowest level header).")
    character_start: int = Field(..., description="Starting character index of the chunk in the document.")
    character_end: int = Field(..., description="Ending character index of the chunk in the document.")
    word_count: int = Field(..., description="Number of words in this chunk.")
    token_estimate: int = Field(..., description="Estimated number of tokens in this chunk.")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp of when chunk was created.")


class Chunk(BaseModel):
    """A segment of text and its corresponding metadata."""
    content: str = Field(..., description="Textual content of the chunk segment.")
    metadata: ChunkMetadata = Field(..., description="Metadata describing this chunk.")


class ChunkRequest(BaseModel):
    """Request schema for document chunking endpoints."""
    document: LoadedDocument = Field(..., description="The fully loaded document model.")
    document_id: Optional[str] = Field(None, description="Explicit document ID. If not provided, a deterministic hash is generated.")
    chunk_size: Optional[int] = Field(None, description="Override for chunk size. Must be greater than 0.")
    chunk_overlap: Optional[int] = Field(None, description="Override for chunk overlap. Must be >= 0.")
    chunking_strategy: Optional[str] = Field(None, description="Strategy to use: 'recursive', 'markdown', 'semantic', 'auto'. Defaults to auto.")

    @field_validator("chunk_size")
    @classmethod
    def validate_chunk_size(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v <= 0:
            raise ValueError("chunk_size must be a positive integer.")
        return v

    @field_validator("chunk_overlap")
    @classmethod
    def validate_chunk_overlap(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("chunk_overlap must be a non-negative integer.")
        return v


class ChunkResponse(BaseModel):
    """Response schema returning list of chunks and processing metadata."""
    document_id: str = Field(..., description="Unique identifier of the source document.")
    strategy_used: str = Field(..., description="The chunking strategy applied.")
    total_chunks: int = Field(..., description="Total number of chunks returned.")
    chunks: List[Chunk] = Field(..., description="List of generated document chunks.")
    processing_time_ms: float = Field(..., description="Time taken to chunk the document in milliseconds.")
