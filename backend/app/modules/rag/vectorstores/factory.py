# app/modules/rag/vectorstores/factory.py

from app.modules.rag.config import RAGConfig
from app.modules.rag.vectorstores.base import VectorStore
from app.modules.rag.vectorstores.chroma import ChromaVectorStore, ChromaDBManager


class VectorStoreFactory:
    """Factory to resolve and create instances of VectorStore."""

    @staticmethod
    def get_vector_store(config: RAGConfig, chroma_manager: ChromaDBManager) -> VectorStore:
        # In the future, we could support other providers (e.g. PgVector, Pinecone).
        # Currently, default to ChromaVectorStore.
        return ChromaVectorStore(chroma_manager=chroma_manager)
