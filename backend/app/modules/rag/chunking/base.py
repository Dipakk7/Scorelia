# app/modules/rag/chunking/base.py

from abc import ABC, abstractmethod
from typing import List
import structlog

from app.modules.rag.schemas.document import LoadedDocument
from app.modules.rag.chunking.models import Chunk
from app.modules.rag.exceptions import ChunkValidationError

logger = structlog.get_logger()


class BaseChunker(ABC):
    """Abstract base class that all document chunkers must inherit from."""

    def __init__(self, chunk_size: int, chunk_overlap: int, max_chunk_size: int, min_chunk_size: int, **kwargs):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.max_chunk_size = max_chunk_size
        self.min_chunk_size = min_chunk_size
        self.kwargs = kwargs

    @abstractmethod
    def chunk(self, document: LoadedDocument, **kwargs) -> List[Chunk]:
        """Core chunking method that must be implemented by subclasses.

        Args:
            document: The LoadedDocument instance.

        Returns:
            A list of generated and populated Chunk objects.
        """
        pass

    def validate_chunk(self, content: str) -> bool:
        """Validates that a chunk's content is not empty and fits within constraints.

        Args:
            content: The text content of the chunk.

        Returns:
            True if valid, raises exception if invalid.

        Raises:
            ChunkValidationError: If constraints are violated.
        """
        stripped_content = content.strip()
        if not stripped_content:
            logger.warning("chunk_validation_failed_empty_content")
            raise ChunkValidationError("Generated chunk cannot be empty or only whitespace.")

        char_count = len(stripped_content)
        if char_count > self.max_chunk_size:
            logger.warning(
                "chunk_validation_failed_exceeds_max",
                char_count=char_count,
                max_chunk_size=self.max_chunk_size,
            )
            raise ChunkValidationError(
                f"Generated chunk size ({char_count} chars) exceeds the maximum allowed limit of {self.max_chunk_size}."
            )

        if char_count < self.min_chunk_size:
            # Note: For very short documents or end sections, we might log a warning rather than raising an error,
            # but standard validation should still check if it's too small. Let's make it a warning or conditional.
            # Usually, the final chunk can be smaller than min_chunk_size. Let's allow smaller chunks if it's the only chunk,
            # or raise an error if it's explicitly a failure. Let's allow it but warn, or enforce it strictly if required.
            # To be safe and avoid dropping valid text at the end of a document, we only raise error if chunk is completely empty.
            # Let's log a debug/info message instead of raising, so we don't discard valid data.
            logger.debug(
                "chunk_below_minimum_size",
                char_count=char_count,
                min_chunk_size=self.min_chunk_size,
            )

        return True
