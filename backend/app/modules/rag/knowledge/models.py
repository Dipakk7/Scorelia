# app/modules/rag/knowledge/models.py

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, field_validator
from app.modules.rag.retrieval.models import MetadataFilter, RetrievedChunk


class CollectionStatistics(BaseModel):
    """Statistics and metadata for a single collection."""
    name: str = Field(..., description="Collection name.")
    count: int = Field(..., description="Number of document chunks in the collection.")
    space: str = Field("l2", description="ChromaDB distance metric (cosine, ip, l2).")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Collection metadata dictionary.")


class KnowledgeBaseInfo(BaseModel):
    """Detailed metadata and status for a registered Knowledge Base."""
    key: str = Field(..., description="Unique slug identifying the knowledge base (e.g. resume_kb).")
    display_name: str = Field(..., description="Human-readable title (e.g. Resume KB).")
    description: str = Field(..., description="Brief summary of what documents this store contains.")
    collection_name: str = Field(..., description="Actual vector database collection name.")
    enabled: bool = Field(True, description="Whether this knowledge base is active for searches.")
    is_default: bool = Field(False, description="Whether this is included by default or is the primary KB.")
    version: str = Field("1.0.0", description="Semantic version of this knowledge base structure/content.")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary custom metadata fields.")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when registered.")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when last updated.")


class KnowledgeSearchRequest(BaseModel):
    """Request payload for cross-collection or strategy-based searches."""
    query: str = Field(..., description="Semantic search query text.")
    strategy: Optional[str] = Field(None, description="Search strategy to use (e.g. resume_only, global).")
    collections: Optional[List[str]] = Field(None, description="Explicit list of collection keys to search.")
    top_k: Optional[int] = Field(None, description="Number of top chunks to retrieve across collections.")
    similarity_threshold: Optional[float] = Field(None, description="Minimum similarity score threshold [0, 1].")
    filters: Optional[MetadataFilter] = Field(None, description="Metadata filtering parameters.")

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


class KnowledgeSearchResponse(BaseModel):
    """API response container wrapping search results from multi-collection search."""
    query: str = Field(..., description="Original query string.")
    strategy: str = Field(..., description="Search strategy executed.")
    collections_searched: List[str] = Field(..., description="List of actual collection names queried.")
    chunks: List[RetrievedChunk] = Field(..., description="Merged list of top matched chunks.")
    latency_ms: float = Field(..., description="Overall search retrieval latency in milliseconds.")


class KnowledgeRegisterRequest(BaseModel):
    """Payload for registering a new knowledge base collection."""
    key: str = Field(..., description="Unique slug identifying the knowledge base (e.g. custom_kb).")
    display_name: str = Field(..., description="Human-readable title.")
    description: str = Field(..., description="Brief summary of collection contents.")
    collection_name: str = Field(..., description="Actual vector database collection name in ChromaDB.")
    enabled: bool = Field(True, description="Whether this knowledge base is active for searches.")
    is_default: bool = Field(False, description="Whether this is included by default in global searches.")
    version: str = Field("1.0.0", description="Semantic version of this knowledge base.")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary custom metadata fields.")

    @field_validator("key", "collection_name")
    @classmethod
    def validate_slugs(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Identifier slug cannot be empty.")
        return v.strip()

