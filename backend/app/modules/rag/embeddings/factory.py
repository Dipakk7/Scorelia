# app/modules/rag/embeddings/factory.py

from app.core.config import settings
from app.ai.clients.ollama_client import OllamaClient
from app.modules.rag.config import RAGConfig
from app.modules.rag.embeddings.base import EmbeddingProvider
from app.modules.rag.embeddings.ollama import OllamaEmbeddingProvider
from app.modules.rag.exceptions import EmbeddingInitializationError


class EmbeddingProviderFactory:
    """Factory to create and retrieve instances of EmbeddingProvider."""

    @staticmethod
    def get_provider(config: RAGConfig) -> EmbeddingProvider:
        provider_name = config.embedding_provider.lower().strip()
        
        if provider_name == "ollama":
            ollama_client = OllamaClient(
                host=settings.OLLAMA_HOST,
                model=config.embedding_model,
                timeout=float(config.embedding_timeout)
            )
            return OllamaEmbeddingProvider(ollama_client=ollama_client, model_name=config.embedding_model)
        else:
            raise EmbeddingInitializationError(f"Unsupported embedding provider: {config.embedding_provider}")
