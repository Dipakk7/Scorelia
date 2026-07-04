# app/modules/rag/services/loaders/base.py

from abc import ABC, abstractmethod
from typing import Generator, List, Dict, Any
from app.modules.rag.schemas.document import Document


class BaseDocumentLoader(ABC):
    """Abstract base class defining the interface for all document loaders."""

    @abstractmethod
    def load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> List[Document]:
        """Completely load the document and return it as a list of Document objects.

        Args:
            file_path: The absolute path of the file to load.
            custom_metadata: Optional dictionary of additional metadata to inject.

        Returns:
            A list of Document objects containing text and chunk metadata.
        """
        pass

    @abstractmethod
    def lazy_load(self, file_path: str, custom_metadata: Dict[str, Any] = None) -> Generator[Document, None, None]:
        """Lazily load the document, yielding Document objects one page or section at a time.

        Args:
            file_path: The absolute path of the file to load.
            custom_metadata: Optional dictionary of additional metadata to inject.

        Yields:
            Document objects containing text and chunk metadata.
        """
        pass
