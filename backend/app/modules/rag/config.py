# app/modules/rag/config.py

import json
from typing import Dict, List, Any
from app.core.config import settings


class RAGConfig:
    """Configuration class for Retrieval-Augmented Generation (RAG).

    Retrieves configurations dynamically from the global application settings.
    """

    def __init__(self):
        self.chroma_storage_dir: str = settings.CHROMA_STORAGE_DIR
        self.embedding_provider: str = settings.RAG_EMBEDDING_PROVIDER
        self.embedding_model: str = settings.RAG_EMBEDDING_MODEL
        self.top_k: int = settings.RAG_TOP_K
        self.default_top_k: int = settings.RAG_DEFAULT_TOP_K
        self.max_top_k: int = settings.RAG_MAX_TOP_K
        self.similarity_threshold: float = settings.RAG_SIMILARITY_THRESHOLD
        self.retrieval_limit: int = settings.RAG_RETRIEVAL_LIMIT
        self.score_normalization: bool = settings.RAG_SCORE_NORMALIZATION
        self.metadata_filtering: bool = settings.RAG_METADATA_FILTERING
        self.duplicate_removal: bool = settings.RAG_DUPLICATE_REMOVAL

        # Chunking configurations
        self.default_chunk_size: int = settings.RAG_CHUNK_SIZE
        self.default_chunk_overlap: int = settings.RAG_CHUNK_OVERLAP
        self.max_chunk_size: int = settings.RAG_MAX_CHUNK_SIZE
        self.min_chunk_size: int = settings.RAG_MIN_CHUNK_SIZE
        self.token_estimate_ratio: float = settings.RAG_TOKEN_ESTIMATE_RATIO
        self.strip_whitespace: bool = settings.RAG_STRIP_WHITESPACE
        self.keep_separator: bool = settings.RAG_KEEP_SEPARATOR
        self.recursive_separators: List[str] = (
            settings.RAG_RECURSIVE_SEPARATORS
            if isinstance(settings.RAG_RECURSIVE_SEPARATORS, list)
            else json.loads(settings.RAG_RECURSIVE_SEPARATORS)
        )
        self.markdown_headers: List[str] = (
            settings.RAG_MARKDOWN_HEADERS
            if isinstance(settings.RAG_MARKDOWN_HEADERS, list)
            else json.loads(settings.RAG_MARKDOWN_HEADERS)
        )

        # Mapping of collection logical names to their actual database collection names
        self.collections: Dict[str, str] = {
            "resume_kb": settings.RAG_COLLECTION_RESUME,
            "company_kb": settings.RAG_COLLECTION_COMPANY,
            "course_kb": settings.RAG_COLLECTION_COURSE,
            "skills_kb": settings.RAG_COLLECTION_SKILLS,
            "interview_kb": settings.RAG_COLLECTION_INTERVIEW,
            "ats_kb": settings.RAG_COLLECTION_ATS,
            "job_kb": settings.RAG_COLLECTION_JOB,
        }

        # Retrieval default config payload
        self.retrieval_config: Dict[str, Any] = {
            "top_k": self.default_top_k,
            "max_top_k": self.max_top_k,
            "similarity_threshold": self.similarity_threshold,
            "limit": self.retrieval_limit,
            "score_normalization": self.score_normalization,
            "metadata_filtering": self.metadata_filtering,
            "duplicate_removal": self.duplicate_removal,
        }

        # Indexing & Pipeline configurations
        self.batch_size: int = settings.RAG_BATCH_SIZE
        self.embedding_timeout: float = settings.RAG_EMBEDDING_TIMEOUT
        self.retry_count: int = settings.RAG_RETRY_COUNT
        self.max_retries: int = settings.RAG_MAX_RETRIES
        self.duplicate_policy: str = settings.RAG_DUPLICATE_POLICY
        self.async_workers: int = settings.RAG_ASYNC_WORKERS
        self.vector_persistence: bool = settings.RAG_VECTOR_PERSISTENCE
        self.auto_indexing: bool = settings.RAG_AUTO_INDEXING
        self.collection_defaults: Dict[str, Any] = (
            settings.RAG_COLLECTION_DEFAULTS
            if isinstance(settings.RAG_COLLECTION_DEFAULTS, dict)
            else json.loads(settings.RAG_COLLECTION_DEFAULTS)
        )

        self.default_knowledge_base: str = settings.RAG_DEFAULT_KNOWLEDGE_BASE
        self.default_search_strategy: str = settings.RAG_DEFAULT_SEARCH_STRATEGY
        self.collection_priority: Dict[str, int] = (
            settings.RAG_COLLECTION_PRIORITY
            if isinstance(settings.RAG_COLLECTION_PRIORITY, dict)
            else json.loads(settings.RAG_COLLECTION_PRIORITY)
        )
        self.collection_weight: Dict[str, float] = (
            settings.RAG_COLLECTION_WEIGHT
            if isinstance(settings.RAG_COLLECTION_WEIGHT, dict)
            else json.loads(settings.RAG_COLLECTION_WEIGHT)
        )
        self.max_collections: int = settings.RAG_MAX_COLLECTIONS
        self.cross_collection_search: bool = settings.RAG_CROSS_COLLECTION_SEARCH

        # RAG Generation config mappings
        self.max_context_tokens: int = settings.RAG_MAX_CONTEXT_TOKENS
        self.max_retrieved_chunks: int = settings.RAG_MAX_RETRIEVED_CHUNKS
        self.max_prompt_size: int = settings.RAG_MAX_PROMPT_SIZE
        self.default_prompt_template: str = settings.RAG_DEFAULT_PROMPT_TEMPLATE
        self.temperature: float = settings.RAG_TEMPERATURE
        self.top_p: float = settings.RAG_TOP_P
        self.max_output_tokens: int = settings.RAG_MAX_OUTPUT_TOKENS
        self.hallucination_guard: bool = settings.RAG_HALLUCINATION_GUARD
        self.strict_context_mode: bool = settings.RAG_STRICT_CONTEXT_MODE

        # Production optimizations, caching & monitoring configurations
        self.cache_ttl: int = settings.RAG_CACHE_TTL
        self.cache_size: int = settings.RAG_CACHE_SIZE
        self.max_retrieval_time: float = settings.RAG_MAX_RETRIEVAL_TIME
        self.max_generation_time: float = settings.RAG_MAX_GENERATION_TIME
        self.citation_mode: str = settings.RAG_CITATION_MODE
        self.metrics_enabled: bool = settings.RAG_METRICS_ENABLED
        self.observability_enabled: bool = settings.RAG_OBSERVABILITY_ENABLED
        self.health_monitoring: bool = settings.RAG_HEALTH_MONITORING
        self.strict_production_mode: bool = settings.RAG_STRICT_PRODUCTION_MODE


