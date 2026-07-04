# app/modules/rag/embeddings/ollama.py

import math
import httpx
from typing import List, Dict, Any
import structlog
from app.ai.clients.ollama_client import OllamaClient
from app.modules.rag.embeddings.base import EmbeddingProvider
from app.modules.rag.exceptions import EmbeddingInitializationError, OllamaUnavailableError

logger = structlog.get_logger()


class OllamaEmbeddingProvider(EmbeddingProvider):
    """Embedding provider using the Ollama client."""

    def __init__(self, ollama_client: OllamaClient, model_name: str):
        self.client = ollama_client
        self.model_name = model_name

    async def embed(self, text: str) -> List[float]:
        if not text or not isinstance(text, str):
            raise EmbeddingInitializationError("Input text must be a non-empty string.")

        try:
            res = await self.client.embed(input_data=text, model=self.model_name)
            if "embedding" in res:
                vector = res["embedding"]
            elif "embeddings" in res and isinstance(res["embeddings"], list) and len(res["embeddings"]) > 0:
                vector = res["embeddings"][0]
            else:
                raise EmbeddingInitializationError("Failed to extract embedding from Ollama response.")

            return vector
        except Exception as e:
            logger.error("Failed to generate embedding with Ollama", model=self.model_name, error=str(e))
            if "unreachable" in str(e).lower() or "connection" in str(e).lower():
                raise OllamaUnavailableError(f"Ollama server is unavailable: {str(e)}") from e
            raise EmbeddingInitializationError(f"Embedding generation failed: {str(e)}") from e

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        if not texts or not isinstance(texts, list):
            raise EmbeddingInitializationError("Input must be a non-empty list of strings.")

        for idx, text in enumerate(texts):
            if not isinstance(text, str) or not text:
                raise EmbeddingInitializationError(f"Text at index {idx} must be a non-empty string.")

        try:
            res = await self.client.embed(input_data=texts, model=self.model_name)
            if "embeddings" in res and isinstance(res["embeddings"], list):
                embeddings = res["embeddings"]
            elif "embedding" in res and len(texts) == 1:
                embeddings = [res["embedding"]]
            else:
                raise EmbeddingInitializationError("Failed to extract batch embeddings from Ollama response.")

            if len(embeddings) != len(texts):
                raise EmbeddingInitializationError(
                    f"Mismatch in batch embedding output. Input size: {len(texts)}, Output size: {len(embeddings)}"
                )

            return embeddings
        except Exception as e:
            logger.error("Failed to generate batch embeddings with Ollama", model=self.model_name, error=str(e))
            if "unreachable" in str(e).lower() or "connection" in str(e).lower():
                raise OllamaUnavailableError(f"Ollama server is unavailable: {str(e)}") from e
            raise EmbeddingInitializationError(f"Batch embedding generation failed: {str(e)}") from e

    async def health_check(self) -> Dict[str, Any]:
        try:
            client_health = await self.client.health_check()
            if client_health.get("status") != "healthy":
                return {
                    "status": "unhealthy",
                    "error": client_health.get("error", "Ollama client reported unhealthy status.")
                }

            # Verify that our specific embedding model is available
            try:
                async with httpx.AsyncClient(timeout=self.client.timeout) as client:
                    tags_response = await client.get(f"{self.client.host}/api/tags")
                    if tags_response.status_code == 200:
                        data = tags_response.json()
                        models = []
                        for m in data.get("models", []):
                            if m.get("name"):
                                models.append(m["name"])
                            if m.get("model"):
                                models.append(m["model"])
                        
                        models = list(set(models))
                        target = self.model_name
                        found = False
                        for m_name in models:
                            if m_name == target or m_name == f"{target}:latest" or target == f"{m_name}:latest":
                                found = True
                                break
                        if not found:
                            return {
                                "status": "unhealthy",
                                "error": f"Embedding model '{self.model_name}' is not loaded/available on Ollama. Available models: {models}"
                            }
            except Exception as tag_err:
                logger.warning("Could not verify model via /api/tags, fallback to general check", error=str(tag_err))

            return {
                "status": "healthy",
                "model": self.model_name
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": f"Ollama embedding provider health check failed: {str(e)}"
            }
