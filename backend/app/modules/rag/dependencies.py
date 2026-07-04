# app/modules/rag/dependencies.py

from typing import Any
from fastapi import Depends
from fastapi.params import Depends as DependsClass

from app.core.config import settings
from app.ai.clients.ollama_client import OllamaClient
from app.modules.rag.config import RAGConfig
from app.modules.rag.vectorstores.chroma import ChromaDBManager
from app.modules.rag.embeddings.service import EmbeddingService
from app.modules.rag.services.collection_manager import CollectionManager

# Module-level instances to avoid singleton duplication and re-initialization overhead
_rag_config = None
_chroma_manager = None
_embedding_service = None
_collection_manager = None
_document_validator = None
_document_ingestion_service = None
_chunking_service = None

_embedding_provider = None
_vector_store = None
_vector_storage_service = None
_embedding_pipeline = None
_document_indexing_service = None

_semantic_retriever = None
_hybrid_retriever = None
_retrieval_service = None

_citation_service = None
_response_cache_service = None
_performance_optimizer = None
_rag_metrics_service = None



def get_rag_config() -> RAGConfig:
    """Dependency injector to retrieve the RAGConfig instance."""
    global _rag_config
    if _rag_config is None:
        _rag_config = RAGConfig()
    return _rag_config


def get_chroma_manager(
    config: RAGConfig = Depends(get_rag_config)
) -> ChromaDBManager:
    """Dependency injector to retrieve the ChromaDBManager instance."""
    global _chroma_manager
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _chroma_manager is None:
        _chroma_manager = ChromaDBManager(storage_dir=config.chroma_storage_dir)
    return _chroma_manager


def get_embedding_provider(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the EmbeddingProvider instance."""
    global _embedding_provider
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _embedding_provider is None:
        from app.modules.rag.embeddings.factory import EmbeddingProviderFactory
        _embedding_provider = EmbeddingProviderFactory.get_provider(config=config)
    return _embedding_provider


def get_embedding_service(
    config: RAGConfig = Depends(get_rag_config),
    provider: Any = Depends(get_embedding_provider)
) -> EmbeddingService:
    """Dependency injector to retrieve the EmbeddingService instance."""
    global _embedding_service
    if isinstance(config, DependsClass):
        config = get_rag_config()
    if isinstance(provider, DependsClass):
        provider = get_embedding_provider()

    if _embedding_service is None:
        _embedding_service = EmbeddingService(provider=provider, retry_count=config.retry_count)
    return _embedding_service


def get_collection_manager(
    chroma_manager: ChromaDBManager = Depends(get_chroma_manager)
) -> CollectionManager:
    """Dependency injector to retrieve the CollectionManager instance."""
    global _collection_manager
    if isinstance(chroma_manager, DependsClass):
        chroma_manager = get_chroma_manager()

    if _collection_manager is None:
        _collection_manager = CollectionManager(chroma_manager=chroma_manager)
    return _collection_manager


def get_document_validator() -> Any:
    """Dependency injector to retrieve the DocumentValidator instance."""
    global _document_validator
    if _document_validator is None:
        from app.modules.rag.services.validator import DocumentValidator
        _document_validator = DocumentValidator()
    return _document_validator


def get_document_ingestion_service(
    validator: Any = Depends(get_document_validator)
) -> Any:
    """Dependency injector to retrieve the DocumentIngestionService instance."""
    global _document_ingestion_service
    if isinstance(validator, DependsClass):
        validator = get_document_validator()

    if _document_ingestion_service is None:
        from app.modules.rag.services.ingestion import DocumentIngestionService
        _document_ingestion_service = DocumentIngestionService(validator=validator)
    return _document_ingestion_service


def get_chunking_service(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the ChunkingService instance."""
    global _chunking_service
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _chunking_service is None:
        from app.modules.rag.chunking.service import ChunkingService
        _chunking_service = ChunkingService(config=config)
    return _chunking_service


def get_vector_store(
    config: RAGConfig = Depends(get_rag_config),
    chroma_manager: ChromaDBManager = Depends(get_chroma_manager)
) -> Any:
    """Dependency injector to retrieve the VectorStore instance."""
    global _vector_store
    if isinstance(config, DependsClass):
        config = get_rag_config()
    if isinstance(chroma_manager, DependsClass):
        chroma_manager = get_chroma_manager()

    if _vector_store is None:
        from app.modules.rag.vectorstores.factory import VectorStoreFactory
        _vector_store = VectorStoreFactory.get_vector_store(config=config, chroma_manager=chroma_manager)
    return _vector_store


def get_vector_storage_service(
    vector_store: Any = Depends(get_vector_store),
    collection_manager: CollectionManager = Depends(get_collection_manager)
) -> Any:
    """Dependency injector to retrieve the VectorStorageService instance."""
    global _vector_storage_service
    if isinstance(vector_store, DependsClass):
        vector_store = get_vector_store()
    if isinstance(collection_manager, DependsClass):
        collection_manager = get_collection_manager()

    if _vector_storage_service is None:
        from app.modules.rag.vectorstores.service import VectorStorageService
        _vector_storage_service = VectorStorageService(vector_store=vector_store, collection_manager=collection_manager)
    return _vector_storage_service


def get_embedding_pipeline(
    embedding_service: EmbeddingService = Depends(get_embedding_service),
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the EmbeddingPipeline instance."""
    global _embedding_pipeline
    if isinstance(embedding_service, DependsClass):
        embedding_service = get_embedding_service()
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _embedding_pipeline is None:
        from app.modules.rag.embeddings.pipeline import EmbeddingPipeline
        _embedding_pipeline = EmbeddingPipeline(embedding_service=embedding_service, config=config)
    return _embedding_pipeline


def get_document_indexing_service(
    chunking_service: Any = Depends(get_chunking_service),
    embedding_pipeline: Any = Depends(get_embedding_pipeline),
    vector_storage_service: Any = Depends(get_vector_storage_service),
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the DocumentIndexingService instance."""
    global _document_indexing_service
    if isinstance(chunking_service, DependsClass):
        chunking_service = get_chunking_service()
    if isinstance(embedding_pipeline, DependsClass):
        embedding_pipeline = get_embedding_pipeline()
    if isinstance(vector_storage_service, DependsClass):
        vector_storage_service = get_vector_storage_service()
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _document_indexing_service is None:
        from app.modules.rag.services.indexing_service import DocumentIndexingService
        _document_indexing_service = DocumentIndexingService(
            chunking_service=chunking_service,
            embedding_pipeline=embedding_pipeline,
            vector_storage_service=vector_storage_service,
            config=config
        )
    return _document_indexing_service


def get_semantic_retriever(
    embedding_service: EmbeddingService = Depends(get_embedding_service),
    vector_storage_service: Any = Depends(get_vector_storage_service),
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the SemanticRetriever instance."""
    global _semantic_retriever
    if isinstance(embedding_service, DependsClass):
        embedding_service = get_embedding_service()
    if isinstance(vector_storage_service, DependsClass):
        vector_storage_service = get_vector_storage_service()
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _semantic_retriever is None:
        from app.modules.rag.retrieval.semantic import SemanticRetriever
        _semantic_retriever = SemanticRetriever(
            embedding_service=embedding_service,
            vector_storage_service=vector_storage_service,
            config=config
        )
    return _semantic_retriever


def get_hybrid_retriever(
    semantic_retriever: Any = Depends(get_semantic_retriever)
) -> Any:
    """Dependency injector to retrieve the HybridRetriever instance."""
    global _hybrid_retriever
    if isinstance(semantic_retriever, DependsClass):
        semantic_retriever = get_semantic_retriever()

    if _hybrid_retriever is None:
        from app.modules.rag.retrieval.hybrid import HybridRetriever
        _hybrid_retriever = HybridRetriever(semantic_retriever=semantic_retriever)
    return _hybrid_retriever


def get_retrieval_service(
    retriever: Any = Depends(get_semantic_retriever),
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the RetrievalService instance."""
    global _retrieval_service
    if isinstance(retriever, DependsClass):
        retriever = get_semantic_retriever()
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _retrieval_service is None:
        from app.modules.rag.retrieval.service import RetrievalService
        _retrieval_service = RetrievalService(retriever=retriever, config=config)
    return _retrieval_service


_knowledge_base_registry = None
_multi_collection_retriever = None
_knowledge_base_service = None


def get_knowledge_base_registry(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the KnowledgeBaseRegistry instance."""
    global _knowledge_base_registry
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _knowledge_base_registry is None:
        from app.modules.rag.knowledge.registry import KnowledgeBaseRegistry
        _knowledge_base_registry = KnowledgeBaseRegistry(config=config)
    return _knowledge_base_registry


def get_multi_collection_retriever(
    semantic_retriever: Any = Depends(get_semantic_retriever),
    registry: Any = Depends(get_knowledge_base_registry),
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the MultiCollectionRetriever instance."""
    global _multi_collection_retriever
    if isinstance(semantic_retriever, DependsClass):
        semantic_retriever = get_semantic_retriever()
    if isinstance(registry, DependsClass):
        registry = get_knowledge_base_registry()
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _multi_collection_retriever is None:
        from app.modules.rag.knowledge.manager import MultiCollectionRetriever
        _multi_collection_retriever = MultiCollectionRetriever(
            semantic_retriever=semantic_retriever,
            registry=registry,
            config=config
        )
    return _multi_collection_retriever


def get_knowledge_base_service(
    collection_manager: CollectionManager = Depends(get_collection_manager),
    registry: Any = Depends(get_knowledge_base_registry),
    retriever: Any = Depends(get_multi_collection_retriever)
) -> Any:
    """Dependency injector to retrieve the KnowledgeBaseService instance."""
    global _knowledge_base_service
    if isinstance(collection_manager, DependsClass):
        collection_manager = get_collection_manager()
    if isinstance(registry, DependsClass):
        registry = get_knowledge_base_registry()
    if isinstance(retriever, DependsClass):
        retriever = get_multi_collection_retriever()

    if _knowledge_base_service is None:
        from app.modules.rag.knowledge.service import KnowledgeBaseService
        _knowledge_base_service = KnowledgeBaseService(
            collection_manager=collection_manager,
            registry=registry,
            retriever=retriever
        )
    return _knowledge_base_service


_context_builder = None
_prompt_builder = None
_rag_generator = None
_rag_orchestrator = None


def get_context_builder(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the ContextBuilder instance."""
    global _context_builder
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _context_builder is None:
        from app.modules.rag.generation.context_builder import ContextBuilder
        _context_builder = ContextBuilder(config=config)
    return _context_builder


def get_prompt_builder(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the PromptBuilder instance."""
    global _prompt_builder
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _prompt_builder is None:
        from app.modules.rag.generation.prompt_builder import PromptBuilder
        _prompt_builder = PromptBuilder(config=config)
    return _prompt_builder


def get_rag_generator(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the RAGGenerator instance."""
    global _rag_generator
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _rag_generator is None:
        from app.ai.dependencies import get_ai_service
        ai_service = get_ai_service()
        from app.modules.rag.generation.generator import RAGGenerator
        _rag_generator = RAGGenerator(ai_service=ai_service, config=config)
    return _rag_generator


def get_citation_service() -> Any:
    """Dependency injector to retrieve the CitationService instance."""
    global _citation_service
    if _citation_service is None:
        from app.modules.rag.citations.service import CitationService
        _citation_service = CitationService()
    return _citation_service


def get_response_cache_service() -> Any:
    """Dependency injector to retrieve the ResponseCacheService instance."""
    global _response_cache_service
    if _response_cache_service is None:
        from app.modules.rag.services.cache_service import ResponseCacheService
        _response_cache_service = ResponseCacheService()
    return _response_cache_service


def get_performance_optimizer(
    config: RAGConfig = Depends(get_rag_config)
) -> Any:
    """Dependency injector to retrieve the PerformanceOptimizer instance."""
    global _performance_optimizer
    if isinstance(config, DependsClass):
        config = get_rag_config()

    if _performance_optimizer is None:
        from app.modules.rag.services.optimizer import PerformanceOptimizer
        _performance_optimizer = PerformanceOptimizer(token_estimate_ratio=config.token_estimate_ratio)
    return _performance_optimizer


def get_rag_metrics_service() -> Any:
    """Dependency injector to retrieve the RAGMetricsService instance."""
    global _rag_metrics_service
    if _rag_metrics_service is None:
        from app.modules.rag.services.metrics_service import RAGMetricsService
        _rag_metrics_service = RAGMetricsService()
    return _rag_metrics_service


def get_rag_health_checker(
    chroma_manager: ChromaDBManager = Depends(get_chroma_manager),
    embedding_service: EmbeddingService = Depends(get_embedding_service),
    retrieval_service: Any = Depends(get_retrieval_service),
    knowledge_base_service: Any = Depends(get_knowledge_base_service),
    generator: Any = Depends(get_rag_generator),
    cache_service: Any = Depends(get_response_cache_service),
    citation_service: Any = Depends(get_citation_service)
) -> Any:
    """Dependency injector to retrieve the RAGHealthChecker instance."""
    if isinstance(chroma_manager, DependsClass):
        chroma_manager = get_chroma_manager()
    if isinstance(embedding_service, DependsClass):
        embedding_service = get_embedding_service()
    if isinstance(retrieval_service, DependsClass):
        retrieval_service = get_retrieval_service()
    if isinstance(knowledge_base_service, DependsClass):
        knowledge_base_service = get_knowledge_base_service()
    if isinstance(generator, DependsClass):
        generator = get_rag_generator()
    if isinstance(cache_service, DependsClass):
        cache_service = get_response_cache_service()
    if isinstance(citation_service, DependsClass):
        citation_service = get_citation_service()

    from app.modules.rag.services.health_checker import RAGHealthChecker
    return RAGHealthChecker(
        chroma_manager=chroma_manager,
        embedding_service=embedding_service,
        retrieval_service=retrieval_service,
        knowledge_base_service=knowledge_base_service,
        generator=generator,
        cache_service=cache_service,
        citation_service=citation_service
    )


def get_rag_orchestrator(
    retrieval_service: Any = Depends(get_retrieval_service),
    knowledge_base_service: Any = Depends(get_knowledge_base_service),
    context_builder: Any = Depends(get_context_builder),
    prompt_builder: Any = Depends(get_prompt_builder),
    generator: Any = Depends(get_rag_generator),
    config: RAGConfig = Depends(get_rag_config),
    citation_service: Any = Depends(get_citation_service),
    cache_service: Any = Depends(get_response_cache_service),
    optimizer: Any = Depends(get_performance_optimizer),
    metrics_service: Any = Depends(get_rag_metrics_service)
) -> Any:
    """Dependency injector to retrieve the RAGOrchestrator instance."""
    global _rag_orchestrator
    if isinstance(retrieval_service, DependsClass):
        retrieval_service = get_retrieval_service()
    if isinstance(knowledge_base_service, DependsClass):
        knowledge_base_service = get_knowledge_base_service()
    if isinstance(context_builder, DependsClass):
        context_builder = get_context_builder()
    if isinstance(prompt_builder, DependsClass):
        prompt_builder = get_prompt_builder()
    if isinstance(generator, DependsClass):
        generator = get_rag_generator()
    if isinstance(config, DependsClass):
        config = get_rag_config()
    if isinstance(citation_service, DependsClass):
        citation_service = get_citation_service()
    if isinstance(cache_service, DependsClass):
        cache_service = get_response_cache_service()
    if isinstance(optimizer, DependsClass):
        optimizer = get_performance_optimizer()
    if isinstance(metrics_service, DependsClass):
        metrics_service = get_rag_metrics_service()

    if _rag_orchestrator is None:
        from app.modules.rag.generation.orchestrator import RAGOrchestrator
        _rag_orchestrator = RAGOrchestrator(
            retrieval_service=retrieval_service,
            knowledge_base_service=knowledge_base_service,
            context_builder=context_builder,
            prompt_builder=prompt_builder,
            generator=generator,
            config=config,
            citation_service=citation_service,
            cache_service=cache_service,
            optimizer=optimizer,
            metrics_service=metrics_service
        )
    return _rag_orchestrator


