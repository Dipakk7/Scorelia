# app/modules/rag/schemas/collection.py

from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class CollectionCreate(BaseModel):
    """Schema for collection creation request."""
    name: str = Field(..., description="The name of the collection to create.")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Optional metadata associated with the collection.")


class CollectionResponse(BaseModel):
    """Schema for collection response."""
    name: str
    metadata: Optional[Dict[str, Any]] = None
    count: int


class CollectionStats(BaseModel):
    """Schema for collection statistics."""
    name: str
    count: int
    metadata: Optional[Dict[str, Any]] = None


class RAGHealthResponse(BaseModel):
    """Schema for RAG system health check response."""
    status: str = Field(..., description="Overall status ('healthy' or 'unhealthy')")
    chromadb: Dict[str, Any] = Field(..., description="ChromaDB specific health metrics and connectivity status.")
    ollama: Dict[str, Any] = Field(..., description="Ollama embedding model status and details.")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp of the health check.")
