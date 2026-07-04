# app/modules/rag/api/router.py

from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
import structlog
import os

from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.rag.dependencies import (
    get_collection_manager,
    get_embedding_service,
    get_chroma_manager,
    get_document_ingestion_service,
    get_document_validator,
    get_chunking_service,
    get_rag_config,
    get_document_indexing_service,
    get_vector_storage_service,
    get_retrieval_service,
    get_knowledge_base_service,
    get_rag_health_checker,
    get_rag_metrics_service,
    get_response_cache_service,
    get_performance_optimizer,
    get_citation_service,
)
from app.modules.rag.config import RAGConfig
from app.modules.rag.chunking.models import ChunkRequest, ChunkResponse
from app.modules.rag.chunking.service import ChunkingService
from app.modules.rag.services.collection_manager import CollectionManager
from app.modules.rag.embeddings.service import EmbeddingService
from app.modules.rag.vectorstores.chroma import ChromaDBManager
from app.modules.rag.schemas.collection import CollectionCreate, CollectionResponse, RAGHealthResponse
from app.modules.rag.schemas.document import LoadedDocument
from app.modules.rag.exceptions import (
    CollectionNotFoundError,
    InvalidCollectionNameError,
    ChromaDBConnectionError,
    InvalidDocumentError,
    UnsupportedFormatError,
    CorruptedFileError,
    ParsingFailureError,
    EncodingFailureError,
    ValidationFailureError,
    EmptyDocumentError,
    InvalidChunkSizeError,
    UnsupportedChunkerError,
    ChunkValidationError,
    ChunkingError,
    EmptyQueryError,
    InvalidTopKError,
    SimilarityThresholdError,
    CollectionMissingError,
    SearchFailureError,
    EmbeddingFailureError,
    DisabledCollectionError,
    EmptyKnowledgeBaseError,
    InvalidSearchStrategyError,
)
from app.modules.rag.retrieval.models import SearchRequest, SearchResponse
from app.modules.rag.retrieval.service import RetrievalService
from app.modules.rag.knowledge import (
    KnowledgeBaseInfo,
    CollectionStatistics,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
    KnowledgeRegisterRequest
)
from app.modules.rag.dependencies import get_rag_orchestrator
from app.modules.rag.generation.models import (
    RAGRequest,
    RAGResponse,
    RAGBatchRequest,
    RAGBatchResponse
)
from app.modules.rag.generation.templates import PROMPT_TEMPLATES
from app.modules.rag.generation.orchestrator import RAGOrchestrator
from app.modules.rag.exceptions import (
    EmptyContextError,
    ResponseValidationError,
    HallucinationGuardError,
    OllamaUnavailableError,
    InvalidTemplateError,
    TokenLimitExceededError
)


logger = structlog.get_logger()
router = APIRouter()


@router.get("/health", response_model=RAGHealthResponse, status_code=status.HTTP_200_OK)
async def get_rag_health(
    chroma_manager: ChromaDBManager = Depends(get_chroma_manager),
    embedding_service: EmbeddingService = Depends(get_embedding_service)
):
    """Retrieve health information for Ollama embedding model and ChromaDB."""
    # 1. ChromaDB health
    chroma_healthy = chroma_manager.validate_connection()
    heartbeat = chroma_manager.heartbeat()
    chroma_details = {
        "status": "healthy" if chroma_healthy else "unhealthy",
        "heartbeat": heartbeat,
        "storage_dir": chroma_manager.storage_dir
    }

    # 2. Ollama / Embedding Model health
    embed_health = await embedding_service.health_check()
    
    # 3. Overall status
    overall_status = "healthy" if (chroma_healthy and embed_health.get("status") == "healthy") else "unhealthy"

    return {
        "status": overall_status,
        "chromadb": chroma_details,
        "ollama": embed_health,
        "timestamp": datetime.now(timezone.utc).isoformat() + "Z"
    }


@router.get("/collections", response_model=List[CollectionResponse], status_code=status.HTTP_200_OK)
async def list_collections(
    current_user: User = Depends(get_current_user),
    collection_manager: CollectionManager = Depends(get_collection_manager)
):
    """List all RAG KB collections. Requires authentication."""
    try:
        return collection_manager.list_collections()
    except ChromaDBConnectionError as conn_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(conn_err)}"
        )
    except Exception as e:
        logger.error("Unhandled error listing collections", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.post("/collections", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def create_collection(
    payload: CollectionCreate,
    current_user: User = Depends(get_current_user),
    collection_manager: CollectionManager = Depends(get_collection_manager)
):
    """Create a new RAG collection. Requires authentication."""
    try:
        return collection_manager.create_collection(name=payload.name, metadata=payload.metadata)
    except InvalidCollectionNameError as name_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(name_err)
        )
    except ChromaDBConnectionError as conn_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(conn_err)}"
        )
    except Exception as e:
        logger.error("Unhandled error creating collection", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.delete("/collections/{collection_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(
    collection_name: str,
    current_user: User = Depends(get_current_user),
    collection_manager: CollectionManager = Depends(get_collection_manager)
):
    """Delete a RAG collection by name. Requires authentication."""
    try:
        collection_manager.delete_collection(name=collection_name)
    except InvalidCollectionNameError as name_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(name_err)
        )
    except CollectionNotFoundError as not_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(not_found)
        )
    except ChromaDBConnectionError as conn_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(conn_err)}"
        )
    except Exception as e:
        logger.error("Unhandled error deleting collection", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("/documents/formats", status_code=status.HTTP_200_OK)
async def get_supported_formats(
    current_user: User = Depends(get_current_user)
):
    """Retrieve lists of supported file extensions and their accepted MIME types."""
    from app.modules.rag.services.validator import SUPPORTED_MIME_TYPES
    formats = {ext: list(mimes) for ext, mimes in SUPPORTED_MIME_TYPES.items()}
    return {"supported_formats": formats}


@router.post("/documents/validate", status_code=status.HTTP_200_OK)
async def validate_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    validator: Any = Depends(get_document_validator),
):
    """Validate document metadata, size, extension, and mime-type without processing."""
    file_name = file.filename or "unknown"
    content_type = file.content_type or "application/octet-stream"

    file_size = file.size
    if file_size is None:
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)


    try:
        val_info = validator.validate_file_info(file_name, content_type, file_size)
        return {
            "valid": True,
            "file_name": file_name,
            "file_type": val_info["extension"],
            "file_size": file_size,
            "mime_type": val_info["mime_type"],
            "errors": []
        }
    except Exception as e:
        return {
            "valid": False,
            "file_name": file_name,
            "file_type": file_name.split(".")[-1].lower() if "." in file_name else "unknown",
            "file_size": file_size,
            "mime_type": content_type,
            "errors": [str(e)]
        }


@router.post("/documents/load", response_model=LoadedDocument, status_code=status.HTTP_200_OK)
async def load_document(
    file: UploadFile = File(...),
    metadata: Optional[str] = Form(None, description="Optional custom metadata JSON string"),
    current_user: User = Depends(get_current_user),
    ingestion_service: Any = Depends(get_document_ingestion_service),
):
    """Upload and process a document. Returns standardized LoadedDocument JSON."""
    import json
    custom_metadata = None
    if metadata:
        try:
            custom_metadata = json.loads(metadata)
            if not isinstance(custom_metadata, dict):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Custom metadata form field must be a valid JSON object."
                )
        except json.JSONDecodeError as jde:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid JSON in custom metadata: {str(jde)}"
            )

    try:
        loaded_doc = await ingestion_service.ingest_uploaded_file(
            upload_file=file,
            custom_metadata=custom_metadata
        )
        return loaded_doc
    except (InvalidDocumentError, UnsupportedFormatError, CorruptedFileError, ValidationFailureError, EmptyDocumentError) as doc_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(doc_err)
        )
    except (ParsingFailureError, EncodingFailureError) as parse_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(parse_err)
        )
    except Exception as e:
        logger.error("Unhandled error loading document", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error processing document."
        )


@router.post("/chunks/create", response_model=ChunkResponse, status_code=status.HTTP_200_OK)
async def create_chunks(
    payload: ChunkRequest,
    current_user: User = Depends(get_current_user),
    chunk_service: ChunkingService = Depends(get_chunking_service),
):
    """Segmentize a LoadedDocument into semantic chunks. Do NOT store vectors."""
    try:
        return chunk_service.chunk_document(
            document=payload.document,
            document_id=payload.document_id,
            chunk_size=payload.chunk_size,
            chunk_overlap=payload.chunk_overlap,
            strategy=payload.chunking_strategy,
        )
    except (InvalidChunkSizeError, UnsupportedChunkerError, ChunkValidationError, EmptyDocumentError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception("Unhandled error during chunk creation", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate chunks: {str(e)}"
        )


@router.post("/chunks/preview", response_model=ChunkResponse, status_code=status.HTTP_200_OK)
async def preview_chunks(
    payload: ChunkRequest,
    current_user: User = Depends(get_current_user),
    chunk_service: ChunkingService = Depends(get_chunking_service),
):
    """Preview document chunking configuration and metadata without side effects."""
    try:
        return chunk_service.chunk_document(
            document=payload.document,
            document_id=payload.document_id,
            chunk_size=payload.chunk_size,
            chunk_overlap=payload.chunk_overlap,
            strategy=payload.chunking_strategy,
        )
    except (InvalidChunkSizeError, UnsupportedChunkerError, ChunkValidationError, EmptyDocumentError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.exception("Unhandled error during chunk preview", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to preview chunks: {str(e)}"
        )


@router.get("/chunks/config", status_code=status.HTTP_200_OK)
async def get_chunk_config(
    current_user: User = Depends(get_current_user),
    config: RAGConfig = Depends(get_rag_config),
):
    """Retrieve default and constraint configurations for the chunking engine."""
    return {
        "default_chunk_size": config.default_chunk_size,
        "default_chunk_overlap": config.default_chunk_overlap,
        "max_chunk_size": config.max_chunk_size,
        "min_chunk_size": config.min_chunk_size,
        "token_estimate_ratio": config.token_estimate_ratio,
        "strip_whitespace": config.strip_whitespace,
        "keep_separator": config.keep_separator,
        "recursive_separators": config.recursive_separators,
        "markdown_headers": config.markdown_headers,
    }


from fastapi import BackgroundTasks
import hashlib
from pydantic import BaseModel
from app.modules.rag.services.indexing_service import DocumentIndexingService, IndexingSummary
from app.modules.rag.vectorstores.service import VectorStorageService
from app.modules.rag.exceptions import DuplicateDetectionError, VectorStorageError


class IndexRequest(BaseModel):
    document: LoadedDocument
    collection_name: str
    document_id: Optional[str] = None
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    strategy: Optional[str] = None
    duplicate_policy: Optional[str] = None


class BatchIndexRequest(BaseModel):
    documents: List[LoadedDocument]
    collection_name: str
    chunk_size: Optional[int] = None
    chunk_overlap: Optional[int] = None
    strategy: Optional[str] = None
    duplicate_policy: Optional[str] = None
    run_in_background: bool = False


# In-memory background task status cache
INDEXING_STATUS_CACHE: Dict[str, str] = {}


async def run_background_indexing(
    indexing_service: DocumentIndexingService,
    document: LoadedDocument,
    collection_name: str,
    doc_id: str,
    chunk_size: Optional[int],
    chunk_overlap: Optional[int],
    strategy: Optional[str],
    duplicate_policy: Optional[str]
):
    INDEXING_STATUS_CACHE[doc_id] = "processing"
    try:
        await indexing_service.index_document(
            document=document,
            collection_name=collection_name,
            document_id=doc_id,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            strategy=strategy,
            duplicate_policy=duplicate_policy
        )
        INDEXING_STATUS_CACHE[doc_id] = "completed"
    except Exception as e:
        logger.error("Background indexing task failed", document_id=doc_id, error=str(e))
        INDEXING_STATUS_CACHE[doc_id] = f"failed: {str(e)}"


async def run_background_batch_indexing(
    indexing_service: DocumentIndexingService,
    documents: List[LoadedDocument],
    collection_name: str,
    chunk_size: Optional[int],
    chunk_overlap: Optional[int],
    strategy: Optional[str],
    duplicate_policy: Optional[str]
):
    for doc in documents:
        doc_id = getattr(doc.metadata, "document_id", None)
        if not doc_id:
            doc_id = hashlib.sha256(doc.content.encode("utf-8")).hexdigest()
        
        await run_background_indexing(
            indexing_service=indexing_service,
            document=doc,
            collection_name=collection_name,
            doc_id=doc_id,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            strategy=strategy,
            duplicate_policy=duplicate_policy
        )


@router.post("/index", status_code=status.HTTP_200_OK)
async def index_document_api(
    payload: IndexRequest,
    background_tasks: BackgroundTasks,
    run_in_background: bool = False,
    current_user: User = Depends(get_current_user),
    indexing_service: DocumentIndexingService = Depends(get_document_indexing_service)
):
    """Index a single LoadedDocument into ChromaDB."""
    doc_id = payload.document_id
    if not doc_id:
        doc_id = hashlib.sha256(payload.document.content.encode("utf-8")).hexdigest()

    if run_in_background:
        INDEXING_STATUS_CACHE[doc_id] = "processing"
        background_tasks.add_task(
            run_background_indexing,
            indexing_service,
            payload.document,
            payload.collection_name,
            doc_id,
            payload.chunk_size,
            payload.chunk_overlap,
            payload.strategy,
            payload.duplicate_policy
        )
        return {
            "document_id": doc_id,
            "status": "processing",
            "message": "Indexing has been scheduled in the background."
        }

    try:
        summary = await indexing_service.index_document(
            document=payload.document,
            collection_name=payload.collection_name,
            document_id=doc_id,
            chunk_size=payload.chunk_size,
            chunk_overlap=payload.chunk_overlap,
            strategy=payload.strategy,
            duplicate_policy=payload.duplicate_policy
        )
        return summary
    except DuplicateDetectionError as dup_err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(dup_err)
        )
    except (InvalidCollectionNameError, CollectionNotFoundError) as col_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(col_err)
        )
    except Exception as e:
        logger.error("Indexing endpoint failed", document_id=doc_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to index document: {str(e)}"
        )


@router.post("/index/batch", status_code=status.HTTP_200_OK)
async def batch_index_document_api(
    payload: BatchIndexRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    indexing_service: DocumentIndexingService = Depends(get_document_indexing_service)
):
    """Index a batch of LoadedDocuments into ChromaDB."""
    doc_ids = []
    for doc in payload.documents:
        doc_id = getattr(doc.metadata, "document_id", None)
        if not doc_id:
            doc_id = hashlib.sha256(doc.content.encode("utf-8")).hexdigest()
        doc_ids.append(doc_id)

    if payload.run_in_background:
        for d_id in doc_ids:
            INDEXING_STATUS_CACHE[d_id] = "processing"
        background_tasks.add_task(
            run_background_batch_indexing,
            indexing_service,
            payload.documents,
            payload.collection_name,
            payload.chunk_size,
            payload.chunk_overlap,
            payload.strategy,
            payload.duplicate_policy
        )
        return {
            "document_ids": doc_ids,
            "status": "processing",
            "message": f"Batch indexing for {len(payload.documents)} documents scheduled in the background."
        }

    summaries = []
    try:
        for doc in payload.documents:
            doc_id = getattr(doc.metadata, "document_id", None)
            if not doc_id:
                doc_id = hashlib.sha256(doc.content.encode("utf-8")).hexdigest()
            summary = await indexing_service.index_document(
                document=doc,
                collection_name=payload.collection_name,
                document_id=doc_id,
                chunk_size=payload.chunk_size,
                chunk_overlap=payload.chunk_overlap,
                strategy=payload.strategy,
                duplicate_policy=payload.duplicate_policy
            )
            summaries.append(summary)
        return summaries
    except DuplicateDetectionError as dup_err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(dup_err)
        )
    except (InvalidCollectionNameError, CollectionNotFoundError) as col_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(col_err)
        )
    except Exception as e:
        logger.error("Batch indexing endpoint failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to batch index: {str(e)}"
        )


@router.delete("/index/{document_id}", status_code=status.HTTP_200_OK)
async def delete_index_api(
    document_id: str,
    collection_name: str,
    current_user: User = Depends(get_current_user),
    vector_storage_service: VectorStorageService = Depends(get_vector_storage_service)
):
    """Delete all chunks and vectors belonging to a document from the index."""
    try:
        vector_storage_service.delete_document_vectors(
            collection_name=collection_name,
            document_id=document_id
        )
        if document_id in INDEXING_STATUS_CACHE:
            del INDEXING_STATUS_CACHE[document_id]
        return {
            "document_id": document_id,
            "status": "deleted",
            "message": f"Successfully deleted vectors for document '{document_id}' from collection '{collection_name}'."
        }
    except (InvalidCollectionNameError, CollectionNotFoundError) as col_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(col_err)
        )
    except Exception as e:
        logger.error("Delete index endpoint failed", document_id=document_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document index: {str(e)}"
        )


@router.get("/index/status/{document_id}", status_code=status.HTTP_200_OK)
async def get_index_status_api(
    document_id: str,
    collection_name: str,
    current_user: User = Depends(get_current_user),
    vector_storage_service: VectorStorageService = Depends(get_vector_storage_service)
):
    """Check indexing status of a document."""
    # Check background cache first
    bg_status = INDEXING_STATUS_CACHE.get(document_id)
    if bg_status:
        return {
            "document_id": document_id,
            "status": bg_status,
            "chunk_count": 0,
            "collection": collection_name
        }

    try:
        # Check ChromaDB store
        records = vector_storage_service.vector_store.get_by_document(
            collection_name=collection_name,
            document_id=document_id
        )
        if records:
            return {
                "document_id": document_id,
                "status": "indexed",
                "chunk_count": len(records),
                "collection": collection_name
            }
        
        return {
            "document_id": document_id,
            "status": "not_indexed",
            "chunk_count": 0,
            "collection": collection_name
        }
    except (InvalidCollectionNameError, CollectionNotFoundError) as col_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(col_err)
        )
    except Exception as e:
        logger.error("Get index status endpoint failed", document_id=document_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve index status: {str(e)}"
        )


@router.get("/collections/{collection_name}/stats", status_code=status.HTTP_200_OK)
async def get_collection_stats_api(
    collection_name: str,
    current_user: User = Depends(get_current_user),
    vector_storage_service: VectorStorageService = Depends(get_vector_storage_service)
):
    """Retrieve detailed metadata and counts for a collection."""
    try:
        return vector_storage_service.get_collection_statistics(collection_name)
    except (InvalidCollectionNameError, CollectionNotFoundError) as col_err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND if isinstance(col_err, CollectionNotFoundError) else status.HTTP_400_BAD_REQUEST,
            detail=str(col_err)
        )
    except Exception as e:
        logger.error("Get collection stats endpoint failed", collection=collection_name, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get collection stats: {str(e)}"
        )


@router.post("/search", response_model=SearchResponse, status_code=status.HTTP_200_OK)
async def search_rag(
    request: SearchRequest,
    current_user: User = Depends(get_current_user),
    retrieval_service: RetrievalService = Depends(get_retrieval_service)
):
    """Retrieve semantically relevant chunks for a given query. Requires authentication."""
    try:
        return await retrieval_service.retrieve(
            query=request.query,
            collection=request.collection,
            top_k=request.top_k,
            similarity_threshold=request.similarity_threshold,
            filters=request.filters
        )
    except (EmptyQueryError, InvalidTopKError, SimilarityThresholdError, CollectionMissingError, InvalidCollectionNameError) as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except CollectionNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )
    except EmbeddingFailureError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Embedding generation failed: {str(err)}"
        )
    except SearchFailureError as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval search execution failed: {str(err)}"
        )
    except Exception as e:
        logger.error("Unhandled error in retrieval search endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/search/batch", response_model=List[SearchResponse], status_code=status.HTTP_200_OK)
async def search_rag_batch(
    requests: List[SearchRequest],
    current_user: User = Depends(get_current_user),
    retrieval_service: RetrievalService = Depends(get_retrieval_service)
):
    """Retrieve semantically relevant chunks in batch. Requires authentication."""
    try:
        return await retrieval_service.retrieve_batch(requests)
    except (EmptyQueryError, InvalidTopKError, SimilarityThresholdError, CollectionMissingError, InvalidCollectionNameError) as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except CollectionNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )
    except EmbeddingFailureError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Embedding generation failed: {str(err)}"
        )
    except SearchFailureError as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval search execution failed: {str(err)}"
        )
    except Exception as e:
        logger.error("Unhandled error in retrieval batch search endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/search/config", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
async def get_search_config(
    current_user: User = Depends(get_current_user),
    config: RAGConfig = Depends(get_rag_config)
):
    """Retrieve default and maximum settings for RAG similarity search. Requires authentication."""
    return config.retrieval_config


from app.modules.rag.knowledge.service import KnowledgeBaseService

@router.get("/knowledge", response_model=List[KnowledgeBaseInfo], status_code=status.HTTP_200_OK)
async def list_knowledge_bases(
    current_user: User = Depends(get_current_user),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
):
    """List all registered Knowledge Bases. Requires authentication."""
    try:
        service.refresh_collections()
        return service.registry.list_kbs()
    except Exception as e:
        logger.error("Unhandled error listing knowledge bases", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/knowledge/stats", response_model=List[CollectionStatistics], status_code=status.HTTP_200_OK)
async def get_all_knowledge_stats(
    current_user: User = Depends(get_current_user),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
):
    """Retrieve statistics and metadata for all registered knowledge bases. Requires authentication."""
    try:
        service.refresh_collections()
        return service.get_all_collection_statistics()
    except Exception as e:
        logger.error("Unhandled error fetching all knowledge base stats", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/knowledge/{collection}", response_model=KnowledgeBaseInfo, status_code=status.HTTP_200_OK)
async def get_knowledge_base(
    collection: str,
    current_user: User = Depends(get_current_user),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
):
    """Retrieve details of a specific registered Knowledge Base. Requires authentication."""
    try:
        return service.registry.get_kb(collection)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Knowledge base '{collection}' is not registered."
        )
    except Exception as e:
        logger.error("Unhandled error fetching knowledge base details", collection=collection, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/knowledge/search", response_model=KnowledgeSearchResponse, status_code=status.HTTP_200_OK)
async def search_knowledge(
    payload: KnowledgeSearchRequest,
    current_user: User = Depends(get_current_user),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
):
    """Perform cross-collection semantic search based on strategy and filters. Requires authentication."""
    try:
        return await service.search(payload)
    except (EmptyQueryError, InvalidTopKError, SimilarityThresholdError, InvalidSearchStrategyError, EmptyKnowledgeBaseError, DisabledCollectionError) as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except CollectionNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )
    except EmbeddingFailureError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Embedding generation failed: {str(err)}"
        )
    except SearchFailureError as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Retrieval search execution failed: {str(err)}"
        )
    except Exception as e:
        logger.error("Unhandled error in cross-collection search endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/knowledge/register", response_model=KnowledgeBaseInfo, status_code=status.HTTP_201_CREATED)
async def register_knowledge_base(
    payload: KnowledgeRegisterRequest,
    current_user: User = Depends(get_current_user),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
):
    """Register a new Knowledge Base collection. Requires authentication."""
    try:
        return service.register_collection(
            key=payload.key,
            display_name=payload.display_name,
            description=payload.description,
            collection_name=payload.collection_name,
            enabled=payload.enabled,
            is_default=payload.is_default,
            version=payload.version,
            metadata=payload.metadata
        )
    except InvalidCollectionNameError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except Exception as e:
        logger.error("Unhandled error registering knowledge base", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.delete("/knowledge/{collection}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge_base(
    collection: str,
    current_user: User = Depends(get_current_user),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
):
    """Delete a registered knowledge base and its vector index collection. Requires authentication."""
    try:
        service.delete_collection(collection)
    except CollectionNotFoundError as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err)
        )
    except InvalidCollectionNameError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except Exception as e:
        logger.error("Unhandled error deleting knowledge base", collection=collection, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/query", response_model=RAGResponse, status_code=status.HTTP_200_OK)
async def query_rag(
    payload: RAGRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: RAGOrchestrator = Depends(get_rag_orchestrator)
):
    """Query the RAG pipeline with a career advisor prompt template and context search. Requires authentication."""
    try:
        return await orchestrator.query(payload)
    except (EmptyQueryError, InvalidCollectionNameError, InvalidTemplateError, EmptyContextError) as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except (TokenLimitExceededError) as err:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=str(err)
        )
    except (ResponseValidationError, HallucinationGuardError) as err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(err)
        )
    except OllamaUnavailableError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(err)
        )
    except Exception as e:
        logger.error("Unhandled error in RAG query endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.post("/query/batch", response_model=RAGBatchResponse, status_code=status.HTTP_200_OK)
async def query_rag_batch(
    payload: RAGBatchRequest,
    current_user: User = Depends(get_current_user),
    orchestrator: RAGOrchestrator = Depends(get_rag_orchestrator)
):
    """Batch query the RAG pipeline with multiple query payloads. Requires authentication."""
    try:
        return await orchestrator.query_batch(payload)
    except Exception as e:
        logger.error("Unhandled error in RAG batch query endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/query/config", status_code=status.HTTP_200_OK)
async def get_rag_query_config(
    current_user: User = Depends(get_current_user),
    config: RAGConfig = Depends(get_rag_config)
):
    """Retrieve active configuration details for RAG generation. Requires authentication."""
    try:
        return {
            "max_context_tokens": config.max_context_tokens,
            "max_retrieved_chunks": config.max_retrieved_chunks,
            "max_prompt_size": config.max_prompt_size,
            "default_prompt_template": config.default_prompt_template,
            "temperature": config.temperature,
            "top_p": config.top_p,
            "max_output_tokens": config.max_output_tokens,
            "hallucination_guard": config.hallucination_guard,
            "strict_context_mode": config.strict_context_mode,
            "available_templates": list(PROMPT_TEMPLATES.keys())
        }
    except Exception as e:
        logger.error("Unhandled error in RAG config endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/status", status_code=status.HTTP_200_OK)
async def get_rag_status(
    current_user: User = Depends(get_current_user),
    health_checker: Any = Depends(get_rag_health_checker)
):
    """Retrieve operational status health checks of all RAG components. Requires authentication."""
    try:
        return await health_checker.check_health()
    except Exception as e:
        logger.error("Unhandled error in RAG status endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check RAG health: {str(e)}"
        )


@router.get("/metrics", status_code=status.HTTP_200_OK)
async def get_rag_metrics(
    current_user: User = Depends(get_current_user),
    metrics_service: Any = Depends(get_rag_metrics_service)
):
    """Retrieve e2e pipeline latencies, token counts, and hit rates. Requires authentication."""
    try:
        return metrics_service.get_metrics()
    except Exception as e:
        logger.error("Unhandled error in RAG metrics endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get RAG metrics: {str(e)}"
        )


@router.get("/cache", status_code=status.HTTP_200_OK)
async def get_rag_cache_stats(
    current_user: User = Depends(get_current_user),
    cache_service: Any = Depends(get_response_cache_service)
):
    """Retrieve RAG cache sizes and hit/miss statistics. Requires authentication."""
    try:
        return cache_service.get_stats()
    except Exception as e:
        logger.error("Unhandled error in RAG cache stats endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get RAG cache statistics: {str(e)}"
        )


@router.delete("/cache", status_code=status.HTTP_200_OK)
async def clear_rag_cache(
    current_user: User = Depends(get_current_user),
    cache_service: Any = Depends(get_response_cache_service),
    optimizer: Any = Depends(get_performance_optimizer)
):
    """Clear all cached query responses, retrieval chunks, and prompt templates. Requires authentication."""
    try:
        cache_service.clear()
        optimizer.clear()
        return {"message": "Cache cleared successfully."}
    except Exception as e:
        logger.error("Unhandled error in clear RAG cache endpoint", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear RAG cache: {str(e)}"
        )


@router.get("/citations/{request_id}", status_code=status.HTTP_200_OK)
async def get_rag_citations(
    request_id: str,
    current_user: User = Depends(get_current_user),
    citation_service: Any = Depends(get_citation_service)
):
    """Retrieve full citation attribution list for a previous RAG query. Requires authentication."""
    try:
        citations = citation_service.get_citations(request_id)
        if citations is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Citations for request ID '{request_id}' not found."
            )
        return citations
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        logger.error("Unhandled error in RAG citations lookup endpoint", request_id=request_id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to lookup RAG citations: {str(e)}"
        )



