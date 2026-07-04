# app/modules/rag/services/health_checker.py

from typing import Dict, Any
import structlog

logger = structlog.get_logger()


class RAGHealthChecker:
    """Consolidated health verification service for all modules of the RAG pipeline."""

    def __init__(
        self,
        chroma_manager,
        embedding_service,
        retrieval_service,
        knowledge_base_service,
        generator,
        cache_service,
        citation_service
    ):
        self.chroma_manager = chroma_manager
        self.embedding_service = embedding_service
        self.retrieval_service = retrieval_service
        self.knowledge_base_service = knowledge_base_service
        self.generator = generator
        self.cache_service = cache_service
        self.citation_service = citation_service

    async def check_health(self) -> Dict[str, Any]:
        """Runs health checks on all pipeline components and aggregates operational status."""
        components = {}

        # 1. ChromaDB health
        try:
            chroma_ok = self.chroma_manager.validate_connection()
            heartbeat = self.chroma_manager.heartbeat()
            components["chromadb"] = "healthy" if (chroma_ok and heartbeat is not None) else "unhealthy"
        except Exception as e:
            logger.error("health_check_failed_chromadb", error=str(e))
            components["chromadb"] = "unhealthy"

        # 2. Ollama / Embedding provider health
        try:
            ollama_health = await self.embedding_service.health_check()
            components["ollama"] = "healthy" if ollama_health.get("status") == "healthy" else "unhealthy"
        except Exception as e:
            logger.error("health_check_failed_ollama", error=str(e))
            components["ollama"] = "unhealthy"

        # 3. Embedding Service
        components["embedding_service"] = "healthy" if self.embedding_service is not None else "unhealthy"

        # 4. Retrieval Service
        components["retrieval_service"] = "healthy" if self.retrieval_service is not None else "unhealthy"

        # 5. Knowledge Registry
        try:
            kbs = self.knowledge_base_service.registry.list_kbs()
            components["knowledge_registry"] = "healthy" if kbs is not None else "unhealthy"
        except Exception as e:
            logger.error("health_check_failed_knowledge_registry", error=str(e))
            components["knowledge_registry"] = "unhealthy"

        # 6. Generation Pipeline
        components["generation_pipeline"] = "healthy" if (self.generator and self.generator.ai_service) else "unhealthy"

        # 7. Cache Service
        components["cache"] = "healthy" if self.cache_service is not None else "unhealthy"

        # 8. Citation Service
        components["citation_service"] = "healthy" if self.citation_service is not None else "unhealthy"

        # Determine overall status
        all_healthy = all(status == "healthy" for status in components.values())
        overall_status = "healthy" if all_healthy else "unhealthy"

        # Clean, privacy-centric response: operational status only, no local files, absolute paths, or model versions.
        return {
            "status": overall_status,
            "components": components
        }
