# app/modules/rag/schemas/document.py

from datetime import datetime
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field


class DocumentMetadata(BaseModel):
    """Standardized metadata model for ingested documents."""
    file_name: str = Field(..., description="Name of the file including extension.")
    extension: str = Field(..., description="Normalized file extension (e.g. pdf, docx, txt, md, html).")
    mime_type: str = Field(..., description="MIME type of the file.")
    file_size: int = Field(..., description="File size in bytes.")
    upload_timestamp: datetime = Field(..., description="Timestamp of when the document was loaded/uploaded.")
    last_modified: datetime = Field(..., description="Timestamp of when the document was last modified.")
    num_pages: int = Field(1, description="Number of pages in the document.")
    num_characters: int = Field(0, description="Total character count.")
    num_words: int = Field(0, description="Total word count.")
    estimated_reading_time: float = Field(0.0, description="Estimated reading time in minutes.")
    language: Optional[str] = Field(None, description="Detected language code (e.g. 'en', 'es', 'fr', 'de').")
    custom_metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional custom metadata fields.")


class Document(BaseModel):
    """Represents a segment, page, or chunk of a document."""
    content: str = Field(..., description="The textual content of the document segment.")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Metadata associated with this segment.")


class LoadedDocument(BaseModel):
    """The complete result of the document ingestion pipeline."""
    content: str = Field(..., description="The fully normalized text content of the entire document.")
    metadata: DocumentMetadata = Field(..., description="Document metadata.")
    pages: List[Document] = Field(default_factory=list, description="The list of page-level or block-level Document segments.")
