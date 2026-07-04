# app/modules/rag/embeddings/service.py

import math
import httpx
import asyncio
from typing import List, Dict, Any, Optional
import structlog
from app.ai.clients.ollama_client import OllamaClient
from app.modules.rag.exceptions import EmbeddingInitializationError, OllamaUnavailableError
from app.modules.rag.embeddings.base import EmbeddingProvider

logger = structlog.get_logger()


class EmbeddingService:
    """Service to handle vector embedding operations using an injected provider."""

    def __init__(
        self,
        ollama_client: Optional[OllamaClient] = None,
        model_name: Optional[str] = None,
        provider: Optional[EmbeddingProvider] = None,
        retry_count: int = 3
    ):
        self.retry_count = retry_count
        self._cache: Dict[str, List[float]] = {}
        if provider is not None:
            self.provider = provider
        elif ollama_client is not None and model_name is not None:
            from app.modules.rag.embeddings.ollama import OllamaEmbeddingProvider
            self.provider = OllamaEmbeddingProvider(ollama_client=ollama_client, model_name=model_name)
        else:
            raise EmbeddingInitializationError(
                "Either provider or both ollama_client and model_name must be supplied."
            )

    async def _execute_with_retry(self, operation, *args, **kwargs):
        """Execute an async operation with exponential backoff retries on transient errors."""
        max_attempts = max(1, self.retry_count)
        last_error = None
        for attempt in range(1, max_attempts + 1):
            try:
                return await operation(*args, **kwargs)
            except (OllamaUnavailableError, httpx.RequestError, httpx.HTTPStatusError) as e:
                last_error = e
                logger.warning(
                    "Embedding operation failed on transient error, retrying...",
                    attempt=attempt,
                    max_attempts=max_attempts,
                    error=str(e)
                )
                if attempt < max_attempts:
                    # Exponential backoff
                    await asyncio.sleep(0.5 * (2 ** (attempt - 1)))
            except Exception as e:
                # Do not retry on non-transient errors (e.g. ValidationError, config issues)
                raise e
        
        # If we exhausted attempts, wrap or re-raise
        if last_error:
            if isinstance(last_error, (OllamaUnavailableError, EmbeddingInitializationError)):
                raise last_error
            raise EmbeddingInitializationError(f"Embedding operation failed after {max_attempts} attempts: {str(last_error)}") from last_error

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate a single vector embedding for the given text, validating the output and caching."""
        if not text or not isinstance(text, str):
            raise EmbeddingInitializationError("Input text must be a non-empty string.")

        if text in self._cache:
            return self._cache[text]

        vector = await self._execute_with_retry(self.provider.embed, text)

        if not self.validate_embedding(vector):
            raise EmbeddingInitializationError("Generated embedding failed validation checks.")

        # Simple cache size control (prevent unbounded growth)
        if len(self._cache) >= 1000:
            self._cache.clear()
        self._cache[text] = vector

        return vector

    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate a batch of vector embeddings for the list of texts, validating the output and utilizing cache."""
        if not texts or not isinstance(texts, list):
            raise EmbeddingInitializationError("Input must be a non-empty list of strings.")

        results: List[Optional[List[float]]] = [None] * len(texts)
        missing_indices: List[int] = []
        missing_texts: List[str] = []

        for idx, text in enumerate(texts):
            if not isinstance(text, str) or not text:
                raise EmbeddingInitializationError(f"Text at index {idx} must be a non-empty string.")
            if text in self._cache:
                results[idx] = self._cache[text]
            else:
                missing_indices.append(idx)
                missing_texts.append(text)

        if missing_texts:
            embeddings = await self._execute_with_retry(self.provider.embed_batch, missing_texts)

            if len(embeddings) != len(missing_texts):
                raise EmbeddingInitializationError(
                    f"Mismatch in batch embedding output. Input size: {len(missing_texts)}, Output size: {len(embeddings)}"
                )

            # Prevent cache size blowup
            if len(self._cache) + len(embeddings) >= 1000:
                self._cache.clear()

            for idx, vector in enumerate(embeddings):
                if not self.validate_embedding(vector):
                    raise EmbeddingInitializationError(f"Generated embedding at index {idx} failed validation.")
                
                orig_idx = missing_indices[idx]
                results[orig_idx] = vector
                self._cache[missing_texts[idx]] = vector

        # Ensure all items in results are populated
        return [r for r in results if r is not None]

    def validate_embedding(self, vector: List[float]) -> bool:
        """Validate if the vector is a list of floats, has expected dimensions and has no NaN/Inf values."""
        if not isinstance(vector, list) or len(vector) == 0:
            return False

        for val in vector:
            if not isinstance(val, (int, float)):
                return False
            if math.isnan(val) or math.isinf(val):
                return False
        return True

    async def health_check(self) -> Dict[str, Any]:
        """Check if the embedding service provider is functional."""
        try:
            return await self.provider.health_check()
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": f"Embedding service health check failed: {str(e)}"
            }
