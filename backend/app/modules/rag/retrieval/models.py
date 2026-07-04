# app/modules/rag/retrieval/models.py

from datetime import datetime
from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field, field_validator


class MetadataFilter(BaseModel):
    """Filter parameters for document and chunk metadata fields."""
    collection: Optional[str] = Field(None, description="Filter by collection name")
    document_id: Optional[Union[str, List[str]]] = Field(None, description="Filter by document ID(s)")
    file_type: Optional[Union[str, List[str]]] = Field(None, description="Filter by file type / source_type")
    page_number: Optional[Union[int, List[int]]] = Field(None, description="Filter by page number(s)")
    section: Optional[Union[str, List[str]]] = Field(None, description="Filter by section heading(s)")
    source: Optional[Union[str, List[str]]] = Field(None, description="Filter by original source file name(s)")
    version: Optional[Union[str, List[str]]] = Field(None, description="Filter by document version(s)")
    start_date: Optional[datetime] = Field(None, description="Filter by start date (inclusive)")
    end_date: Optional[datetime] = Field(None, description="Filter by end date (inclusive)")


class SearchRequest(BaseModel):
    """Request schema for semantic similarity search."""
    query: str = Field(..., description="Semantic search query text.")
    collection: str = Field(..., description="Target database collection key or name.")
    top_k: Optional[int] = Field(None, description="Number of top chunks to retrieve.")
    similarity_threshold: Optional[float] = Field(None, description="Minimum similarity score threshold.")
    filters: Optional[MetadataFilter] = Field(None, description="Optional metadata filter properties.")

    @field_validator("query")
    @classmethod
    def validate_query(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Query string cannot be empty.")
        return v.strip()

    @field_validator("top_k")
    @classmethod
    def validate_top_k(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v <= 0:
            raise ValueError("top_k must be a positive integer.")
        return v

    @field_validator("similarity_threshold")
    @classmethod
    def validate_threshold(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and not (0.0 <= v <= 1.0):
            raise ValueError("similarity_threshold must be between 0.0 and 1.0.")
        return v


class RetrievedChunk(BaseModel):
    """Represents a matching retrieved text segment and its metadata from the index."""
    chunk_id: str = Field(..., description="Deterministic unique identifier for the chunk.")
    document_id: str = Field(..., description="Identifier of the parent document.")
    similarity_score: float = Field(..., description="Relevance similarity score (normalized to [0, 1]).")
    content: str = Field(..., description="Text content of the retrieved chunk.")
    page: Optional[int] = Field(None, description="1-indexed page number of the chunk.")
    section: Optional[str] = Field(None, description="Section heading context.")
    heading: Optional[str] = Field(None, description="Subheading context.")
    source: Optional[str] = Field(None, description="Original source file name or URI.")
    chunk_index: int = Field(..., description="Position index of chunk within parent document.")
    embedding_model: str = Field(..., description="Model used to generate the vector embeddings.")
    collection: Optional[str] = Field(None, description="Logical collection name chunk belongs to.")



class SearchMetadata(BaseModel):
    """Metadata regarding similarity search execution."""
    total_retrieved: int = Field(..., description="Total count of retrieved chunks before deduplication/filtering.")
    latency_ms: float = Field(..., description="Search retrieval latency in milliseconds.")
    embedding_model: str = Field(..., description="Name of the embedding model used.")
    similarity_threshold: float = Field(..., description="Similarity threshold applied during search.")
    top_k: int = Field(..., description="Requested top-k parameter value.")


class SearchResult(BaseModel):
    """Structured search result containing retrieved chunks and metrics."""
    query: str = Field(..., description="Original query executed.")
    collection: str = Field(..., description="Collection that was searched.")
    chunks: List[RetrievedChunk] = Field(..., description="List of relevant retrieved chunks.")
    metadata: SearchMetadata = Field(..., description="Details and stats about the execution pipeline.")


class SearchResponse(BaseModel):
    """API response container wrapping search results."""
    query: str = Field(..., description="Original query executed.")
    collection: str = Field(..., description="Collection that was searched.")
    chunks: List[RetrievedChunk] = Field(..., description="List of relevant retrieved chunks.")
    metadata: SearchMetadata = Field(..., description="Details and stats about the execution pipeline.")
