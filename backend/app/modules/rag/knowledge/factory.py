# app/modules/rag/knowledge/factory.py

from app.modules.rag.config import RAGConfig
from app.modules.rag.knowledge.registry import KnowledgeBaseRegistry
from app.modules.rag.knowledge.manager import MultiCollectionRetriever
from app.modules.rag.retrieval.semantic import SemanticRetriever

class KnowledgeBaseFactory:
    """Factory to create Knowledge Base Registry and Retriever components."""

    @staticmethod
    def create_registry(config: RAGConfig) -> KnowledgeBaseRegistry:
        return KnowledgeBaseRegistry(config=config)

    @staticmethod
    def create_retriever(
        semantic_retriever: SemanticRetriever,
        registry: KnowledgeBaseRegistry,
        config: RAGConfig
    ) -> MultiCollectionRetriever:
        return MultiCollectionRetriever(
            semantic_retriever=semantic_retriever,
            registry=registry,
            config=config
        )
