# app/modules/rag/citations/models.py

from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class CitationStyle(str, Enum):
    """Supported citation formatting styles."""
    STANDARD = "standard"  # [1] filename.pdf (Section: section_name)
    APA = "apa"            # (filename.pdf, p. page_number)
    IEEE = "ieee"          # [1]
    INLINE = "inline"      # [filename.pdf:page_number]
    NONE = "none"          # empty/raw representation


class Citation(BaseModel):
    """Represents a citation reference for generated text from a retrieved chunk."""
    document_id: str = Field(..., description="The ID of the source document.")
    chunk_id: str = Field(..., description="The deterministic ID of the retrieved chunk.")
    source_file: Optional[str] = Field(None, description="The filename or URI of the source document.")
    page_number: Optional[int] = Field(None, description="1-indexed page number where the chunk resides.")
    section: Optional[str] = Field(None, description="Section heading context.")
    heading: Optional[str] = Field(None, description="Subheading context.")
    collection: Optional[str] = Field(None, description="Logical collection name chunk belongs to.")
    similarity_score: float = Field(..., description="Relevance score matching the user query.")
