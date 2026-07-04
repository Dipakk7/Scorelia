# app/modules/rag/retrieval/retriever.py

from app.modules.rag.retrieval.base import BaseRetriever
from app.modules.rag.retrieval.semantic import SemanticRetriever
from app.modules.rag.retrieval.hybrid import HybridRetriever


class RetrieverFactory:
    """Factory to resolve and create instances of BaseRetriever."""

    @staticmethod
    def get_retriever(
        strategy: str,
        semantic_retriever: SemanticRetriever
    ) -> BaseRetriever:
        strategy_clean = strategy.lower().strip()
        if strategy_clean == "semantic":
            return semantic_retriever
        elif strategy_clean == "hybrid":
            return HybridRetriever(semantic_retriever=semantic_retriever)
        else:
            raise ValueError(f"Unsupported retrieval strategy: '{strategy}'")
