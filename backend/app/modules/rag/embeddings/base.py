# app/modules/rag/embeddings/base.py

from abc import ABC, abstractmethod
from typing import List, Dict, Any

class EmbeddingProvider(ABC):
    """Abstract base class that all embedding providers must inherit from."""

    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """Generate a single vector embedding for the given text."""
        pass

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate vector embeddings for a list/batch of texts."""
        pass

    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """Perform a connection and model availability check for this provider."""
        pass
