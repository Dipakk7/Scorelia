# app/modules/rag/tests/test_retrieval.py

import pytest
import logging
import time
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.rag.config import RAGConfig
from app.modules.rag.dependencies import (
    get_embedding_service,
    get_vector_storage_service,
    get_retrieval_service,
    get_rag_config,
)
from app.modules.rag.exceptions import (
    EmptyQueryError,
    InvalidTopKError,
    SimilarityThresholdError,
    SearchFailureError,
    EmbeddingFailureError,
)
from app.modules.rag.retrieval.models import (
    SearchRequest,
    MetadataFilter,
    RetrievedChunk,
)
from app.modules.rag.retrieval.filters import compile_metadata_filter
from app.modules.rag.retrieval.semantic import SemanticRetriever
from app.modules.rag.retrieval.service import RetrievalService


# ---------------------------------------------------------
# Mocks & Fixtures
# ---------------------------------------------------------

mock_user = User(
    id=1,
    email="test-rag-retrieval@example.com",
    is_active=True,
)


class MockEmbeddingProvider:
    def __init__(self):
        self.model_name = "nomic-embed-text"

    async def embed(self, text: str) -> List[float]:
        return [0.1, 0.2, 0.3]

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        return [[0.1, 0.2, 0.3] for _ in texts]


class MockVectorStore:
    def __init__(self):
        self.last_query_where = None

    def query(
        self,
        collection_name: str,
        query_embeddings: List[List[float]],
        n_results: int = 10,
        where: Optional[Dict[str, Any]] = None,
        include: List[str] = None
    ) -> Dict[str, Any]:
        self.last_query_where = where
        
        # mock chunks database
        raw_ids = ["chunk_1", "chunk_2", "chunk_duplicate"]
        raw_metadatas = [
            {
                "document_id": "doc_abc",
                "page_number": 1,
                "section": "Summary",
                "heading": "Main Heading",
                "source_file": "my_cv.pdf",
                "source_type": "pdf",
                "chunk_index": 0,
                "created_at": "2026-07-04T12:00:00.000000"
            },
            {
                "document_id": "doc_xyz",
                "page_number": 2,
                "section": "Skills",
                "heading": "Technical Skills",
                "source_file": "my_cv.pdf",
                "source_type": "pdf",
                "chunk_index": 1,
                "created_at": "2026-07-04T12:00:00.000000"
            },
            {
                "document_id": "doc_abc",
                "page_number": 1,
                "section": "Summary",
                "heading": "Main Heading",
                "source_file": "my_cv.pdf",
                "source_type": "pdf",
                "chunk_index": 0,
                "created_at": "2026-07-04T12:00:00.000000"
            }
        ]
        raw_documents = ["Experienced Python dev", "FastAPI backend skills", "Experienced Python dev"]
        raw_distances = [0.1, 0.5, 0.1]

        # Apply simple metadata evaluation
        filtered_indices = []
        for idx in range(len(raw_ids)):
            meta = raw_metadatas[idx]
            match = True
            if where:
                # evaluate simple compile structure
                conditions = []
                if "$and" in where:
                    conditions = where["$and"]
                else:
                    conditions = [where]

                for cond in conditions:
                    for key, val in cond.items():
                        meta_val = meta.get(key)
                        if isinstance(val, dict):
                            if "$in" in val:
                                if meta_val not in val["$in"]:
                                    match = False
                            elif "$gte" in val:
                                if str(meta_val) < str(val["$gte"]):
                                    match = False
                            elif "$lte" in val:
                                if str(meta_val) > str(val["$lte"]):
                                    match = False
                        else:
                            if meta_val != val:
                                match = False
            if match:
                filtered_indices.append(idx)

        # Slice results up to n_results
        filtered_indices = filtered_indices[:n_results]

        return {
            "ids": [[raw_ids[i] for i in filtered_indices]],
            "metadatas": [[raw_metadatas[i] for i in filtered_indices]],
            "documents": [[raw_documents[i] for i in filtered_indices]],
            "distances": [[raw_distances[i] for i in filtered_indices]]
        }

    def count(self, collection_name: str) -> int:
        return 3


class MockCollectionManager:
    def validate_collection_name(self, name: str) -> bool:
        return name in ["resume_kb", "company_kb", "resume_kb_dev"]

    def get_collection_details(self, name: str) -> Dict[str, Any]:
        return {
            "name": name,
            "count": 3,
            "metadata": {"hnsw:space": "l2"}
        }


@pytest.fixture(autouse=True)
def setup_overrides():
    from app.modules.rag.embeddings.service import EmbeddingService
    from app.modules.rag.vectorstores.service import VectorStorageService

    provider = MockEmbeddingProvider()
    mock_embed_service = EmbeddingService(provider=provider)

    mock_store = MockVectorStore()
    col_mgr = MockCollectionManager()
    mock_vector_service = VectorStorageService(vector_store=mock_store, collection_manager=col_mgr)

    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_embedding_service] = lambda: mock_embed_service
    app.dependency_overrides[get_vector_storage_service] = lambda: mock_vector_service

    yield mock_store

    app.dependency_overrides.clear()


client = TestClient(app)


# ---------------------------------------------------------
# 1. Metadata Filter Compilation Tests
# ---------------------------------------------------------

def test_metadata_filter_compilation_single():
    filt = MetadataFilter(document_id="doc_123", file_type="pdf")
    compiled = compile_metadata_filter(filt)
    assert compiled is not None
    assert "$and" in compiled
    assert len(compiled["$and"]) == 2
    assert {"document_id": "doc_123"} in compiled["$and"]
    assert {"source_type": "pdf"} in compiled["$and"]


def test_metadata_filter_compilation_list():
    filt = MetadataFilter(
        page_number=[1, 2, 3],
        source=["resume.pdf", "cv.docx"]
    )
    compiled = compile_metadata_filter(filt)
    assert compiled is not None
    assert "$and" in compiled
    assert {"page_number": {"$in": [1, 2, 3]}} in compiled["$and"]
    assert {"source_file": {"$in": ["resume.pdf", "cv.docx"]}} in compiled["$and"]


def test_metadata_filter_compilation_date_range():
    start = datetime(2026, 7, 1, tzinfo=timezone.utc)
    end = datetime(2026, 7, 5, tzinfo=timezone.utc)
    filt = MetadataFilter(start_date=start, end_date=end)
    compiled = compile_metadata_filter(filt)
    assert compiled is not None
    assert "$and" in compiled
    assert {"created_at": {"$gte": start.isoformat()}} in compiled["$and"]
    assert {"created_at": {"$lte": end.isoformat()}} in compiled["$and"]


# ---------------------------------------------------------
# 2. Semantic Retriever Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_semantic_retriever_search():
    cfg = get_rag_config()
    
    # Use self-contained mocks instead of calling global dependencies to avoid Ollama calls
    from app.modules.rag.embeddings.service import EmbeddingService
    from app.modules.rag.vectorstores.service import VectorStorageService

    embed_service = EmbeddingService(provider=MockEmbeddingProvider())
    mock_store = MockVectorStore()
    col_mgr = MockCollectionManager()
    vector_service = VectorStorageService(vector_store=mock_store, collection_manager=col_mgr)

    retriever = SemanticRetriever(
        embedding_service=embed_service,
        vector_storage_service=vector_service,
        config=cfg
    )

    req = SearchRequest(query="FastAPI python", collection="resume_kb", top_k=2)
    results = await retriever.search(req)

    # Note: Mock returns maximum 3 results, sliced to top_k = 2 in our MockVectorStore query method
    assert len(results) == 2
    first = results[0]
    assert first.chunk_id == "chunk_1"
    assert first.document_id == "doc_abc"
    assert first.similarity_score > 0.0
    assert first.content == "Experienced Python dev"
    assert first.page == 1
    assert first.source == "my_cv.pdf"
    assert first.embedding_model == "nomic-embed-text"


# ---------------------------------------------------------
# 3. Retrieval Service & Deduplication Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_retrieval_service_deduplication():
    cfg = get_rag_config()
    cfg.duplicate_removal = True

    from app.modules.rag.embeddings.service import EmbeddingService
    from app.modules.rag.vectorstores.service import VectorStorageService

    embed_service = EmbeddingService(provider=MockEmbeddingProvider())
    mock_store = MockVectorStore()
    col_mgr = MockCollectionManager()
    vector_service = VectorStorageService(vector_store=mock_store, collection_manager=col_mgr)

    retriever = SemanticRetriever(
        embedding_service=embed_service,
        vector_storage_service=vector_service,
        config=cfg
    )
    service = RetrievalService(retriever=retriever, config=cfg)

    response = await service.retrieve(
        query="Experienced python FastAPI developer",
        collection="resume_kb",
        top_k=5,
        similarity_threshold=0.5
    )

    # chunk_1 and chunk_duplicate have identical content, so after deduplication, we expect 2 chunks.
    assert len(response.chunks) == 2
    assert response.chunks[0].chunk_id == "chunk_1"
    assert response.chunks[1].chunk_id == "chunk_2"


# ---------------------------------------------------------
# 4. Error Handling Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_retrieval_service_validation_errors():
    cfg = get_rag_config()
    
    from app.modules.rag.embeddings.service import EmbeddingService
    from app.modules.rag.vectorstores.service import VectorStorageService

    embed_service = EmbeddingService(provider=MockEmbeddingProvider())
    mock_store = MockVectorStore()
    col_mgr = MockCollectionManager()
    vector_service = VectorStorageService(vector_store=mock_store, collection_manager=col_mgr)

    retriever = SemanticRetriever(
        embedding_service=embed_service,
        vector_storage_service=vector_service,
        config=cfg
    )
    service = RetrievalService(retriever=retriever, config=cfg)

    # Empty query
    with pytest.raises(EmptyQueryError):
        await service.retrieve(query="   ", collection="resume_kb")

    # Invalid top_k
    with pytest.raises(InvalidTopKError):
        await service.retrieve(query="test", collection="resume_kb", top_k=0)

    # Invalid threshold
    with pytest.raises(SimilarityThresholdError):
        await service.retrieve(query="test", collection="resume_kb", similarity_threshold=1.5)


# ---------------------------------------------------------
# 5. REST API Endpoints & Batch Tests
# ---------------------------------------------------------

def test_api_search_config():
    response = client.get("/api/v1/rag/search/config")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "top_k" in data
    assert "similarity_threshold" in data
    assert "limit" in data


def test_api_search_single():
    payload = {
        "query": "fastapi coding",
        "collection": "resume_kb",
        "top_k": 3,
        "similarity_threshold": 0.5,
        "filters": {
            "file_type": "pdf",
            "page_number": 1
        }
    }
    response = client.post("/api/v1/rag/search", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["query"] == "fastapi coding"
    assert data["collection"] == "resume_kb"
    assert len(data["chunks"]) > 0
    
    for chunk in data["chunks"]:
        assert chunk["page"] == 1 or chunk["page"] is None


def test_api_search_batch():
    payload = [
        {
            "query": "query number one",
            "collection": "resume_kb",
            "top_k": 2,
            "similarity_threshold": 0.5
        },
        {
            "query": "query number two",
            "collection": "resume_kb",
            "top_k": 2,
            "similarity_threshold": 0.5
        }
    ]
    response = client.post("/api/v1/rag/search/batch", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert data[0]["query"] == "query number one"
    assert data[1]["query"] == "query number two"


def test_api_search_error_cases():
    # Empty query
    payload = {"query": "", "collection": "resume_kb"}
    response = client.post("/api/v1/rag/search", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Invalid threshold
    payload = {"query": "test", "collection": "resume_kb", "similarity_threshold": -0.5}
    response = client.post("/api/v1/rag/search", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Bad collection name
    payload = {"query": "test", "collection": "invalid_collection_name"}
    response = client.post("/api/v1/rag/search", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST


# ---------------------------------------------------------
# 6. Performance & Embedding Caching Verification
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_embedding_caching_performance():
    from app.modules.rag.embeddings.service import EmbeddingService
    embed_service = EmbeddingService(provider=MockEmbeddingProvider())
    
    # Clear cache first to ensure a fresh benchmark
    embed_service._cache.clear()

    # Generate once (cache miss)
    start_miss = time.perf_counter()
    v1 = await embed_service.generate_embedding("caching test query")
    time_miss = time.perf_counter() - start_miss

    # Generate again (cache hit)
    start_hit = time.perf_counter()
    v2 = await embed_service.generate_embedding("caching test query")
    time_hit = time.perf_counter() - start_hit

    assert v1 == v2
    assert len(embed_service._cache) == 1
    assert "caching test query" in embed_service._cache


# ---------------------------------------------------------
# 7. Privacy Compliance Logging Verification
# ---------------------------------------------------------

def test_privacy_logging_rules(capsys):
    # Perform a retrieval via the test client which triggers log messages.
    client.post("/api/v1/rag/search", json={
        "query": "Top secret resume content",
        "collection": "resume_kb"
    })

    # Check structlog output written to stdout
    captured = capsys.readouterr()
    log_text = captured.out or captured.err

    # Assert that sensitive data was not logged
    assert "Top secret resume content" not in log_text
    assert "Experienced Python dev" not in log_text
    assert "vector" not in log_text.lower()
    
    # Assert that only metadata details were logged
    assert "retrieval_completed" in log_text
    assert "collection" in log_text
    assert "latency_ms" in log_text
