# app/modules/rag/tests/test_knowledge.py

import pytest
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
    get_semantic_retriever,
    get_rag_config,
    get_knowledge_base_registry,
    get_multi_collection_retriever,
    get_knowledge_base_service,
)
from app.modules.rag.exceptions import (
    CollectionNotFoundError,
    DisabledCollectionError,
    InvalidSearchStrategyError,
    EmptyKnowledgeBaseError,
    InvalidCollectionNameError,
)
from app.modules.rag.retrieval.models import RetrievedChunk
from app.modules.rag.knowledge.models import (
    KnowledgeSearchRequest,
    KnowledgeRegisterRequest
)
from app.modules.rag.knowledge.registry import KnowledgeBaseRegistry
from app.modules.rag.knowledge.manager import MultiCollectionRetriever
from app.modules.rag.knowledge.service import KnowledgeBaseService

# ---------------------------------------------------------
# Mocks & Fixtures
# ---------------------------------------------------------

mock_user = User(
    id=1,
    email="test-rag-knowledge@example.com",
    is_active=True,
)


class MockEmbeddingService:
    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        return [[0.1, 0.2, 0.3] for _ in texts]


class MockSemanticRetriever:
    def __init__(self):
        pass

    async def search_batch(self, requests: List[Any]) -> List[List[RetrievedChunk]]:
        results = []
        for req in requests:
            col = req.collection
            if req.query == "tie":
                results.append([
                    RetrievedChunk(
                        chunk_id=f"chunk_{col}_tie",
                        document_id=f"doc_{col}_tie",
                        similarity_score=0.9,
                        content=f"Tie chunk from {col}",
                        chunk_index=0,
                        embedding_model="nomic-embed-text"
                    )
                ])
                continue
            # Generate deterministic chunks depending on target collection name
            if col == "resume_kb":
                results.append([
                    RetrievedChunk(
                        chunk_id="chunk_resume_1",
                        document_id="doc_res_1",
                        similarity_score=0.9,
                        content="Resume of dipak, Python Backend Developer",
                        chunk_index=0,
                        embedding_model="nomic-embed-text"
                    ),
                    RetrievedChunk(
                        chunk_id="chunk_dup",
                        document_id="doc_res_dup",
                        similarity_score=0.8,
                        content="Duplicate chunk across collections",
                        chunk_index=1,
                        embedding_model="nomic-embed-text"
                    )
                ])
            elif col == "job_kb":
                results.append([
                    RetrievedChunk(
                        chunk_id="chunk_job_1",
                        document_id="doc_job_1",
                        similarity_score=0.85,
                        content="FastAPI backend engineer job details",
                        chunk_index=0,
                        embedding_model="nomic-embed-text"
                    ),
                    RetrievedChunk(
                        chunk_id="chunk_dup",
                        document_id="doc_job_dup",
                        similarity_score=0.7,
                        content="Duplicate chunk across collections",
                        chunk_index=1,
                        embedding_model="nomic-embed-text"
                    )
                ])
            else:
                results.append([
                    RetrievedChunk(
                        chunk_id=f"chunk_{col}_1",
                        document_id=f"doc_{col}_1",
                        similarity_score=0.6,
                        content=f"General chunk from {col}",
                        chunk_index=0,
                        embedding_model="nomic-embed-text"
                    )
                ])
        return results


class MockCollectionManager:
    def __init__(self):
        self.collections = [
            {"name": "resume_kb", "count": 10, "metadata": {"hnsw:space": "cosine"}},
            {"name": "job_kb", "count": 5, "metadata": {"hnsw:space": "l2"}},
        ]

    def validate_collection_name(self, name: str) -> bool:
        return name in ["resume_kb", "job_kb", "company_kb", "course_kb", "skills_kb", "interview_kb", "ats_kb", "custom_kb", "invalid_kb"]

    def create_collection(self, name: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if name == "invalid_kb":
            raise InvalidCollectionNameError("Collection name is invalid.")
        col = {"name": name, "count": 0, "metadata": metadata or {}}
        self.collections.append(col)
        return col

    def delete_collection(self, name: str) -> None:
        self.collections = [c for c in self.collections if c["name"] != name]

    def list_collections(self) -> List[Dict[str, Any]]:
        return self.collections

    def get_collection_details(self, name: str) -> Dict[str, Any]:
        for c in self.collections:
            if c["name"] == name:
                return c
        raise CollectionNotFoundError(f"Collection '{name}' not found.")


@pytest.fixture(autouse=True)
def setup_overrides():
    mock_sem = MockSemanticRetriever()
    col_mgr = MockCollectionManager()
    
    # Setup registry and retriever using real objects with mock configs/services
    config = RAGConfig()
    # Explicitly configure priorities and weights for tests
    config.collection_priority = {"resume_kb": 1, "job_kb": 2, "company_kb": 3}
    config.collection_weight = {"resume_kb": 1.0, "job_kb": 0.9}
    
    registry = KnowledgeBaseRegistry(config=config)
    retriever = MultiCollectionRetriever(semantic_retriever=mock_sem, registry=registry, config=config)
    kb_service = KnowledgeBaseService(collection_manager=col_mgr, registry=registry, retriever=retriever)

    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_rag_config] = lambda: config
    app.dependency_overrides[get_knowledge_base_registry] = lambda: registry
    app.dependency_overrides[get_multi_collection_retriever] = lambda: retriever
    app.dependency_overrides[get_knowledge_base_service] = lambda: kb_service

    yield {
        "registry": registry,
        "retriever": retriever,
        "service": kb_service,
        "config": config,
        "col_mgr": col_mgr
    }

    app.dependency_overrides.clear()


client = TestClient(app)

# ---------------------------------------------------------
# 1. Registry Tests
# ---------------------------------------------------------

def test_registry_initialize_defaults(setup_overrides):
    registry = setup_overrides["registry"]
    kbs = registry.list_kbs()
    assert len(kbs) == 7
    keys = {kb.key for kb in kbs}
    assert "resume_kb" in keys
    assert "job_kb" in keys
    assert "company_kb" in keys


def test_registry_register_and_remove(setup_overrides):
    registry = setup_overrides["registry"]
    kb = registry.register_kb(
        key="custom_kb",
        display_name="Custom KB",
        description="Custom Test Store",
        collection_name="custom_kb",
        metadata={"owner": "dipak"}
    )
    assert kb.key == "custom_kb"
    assert kb.enabled is True
    
    registered = registry.get_kb("custom_kb")
    assert registered.display_name == "Custom KB"

    # Disable and Enable
    registry.disable_kb("custom_kb")
    assert registry.get_kb("custom_kb").enabled is False
    
    registry.enable_kb("custom_kb")
    assert registry.get_kb("custom_kb").enabled is True

    # Remove
    registry.remove_kb("custom_kb")
    with pytest.raises(KeyError):
        registry.get_kb("custom_kb")


# ---------------------------------------------------------
# 2. Multi Collection Retrieval Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_retriever_search_deduplication_and_weights(setup_overrides):
    retriever = setup_overrides["retriever"]
    
    # We query two collections: resume_kb and job_kb
    # resume_kb outputs: chunk_resume_1 (0.9), chunk_dup (0.8)
    # job_kb outputs: chunk_job_1 (0.85), chunk_dup (0.7)
    # Weights: resume_kb (1.0), job_kb (0.9)
    # Weighted scores:
    # chunk_resume_1: 0.9 * 1.0 = 0.9
    # chunk_dup (from resume): 0.8 * 1.0 = 0.8
    # chunk_job_1: 0.85 * 0.9 = 0.765
    # chunk_dup (from job): 0.7 * 0.9 = 0.63
    
    # Deduplication will keep chunk_dup with score 0.8 (since 0.8 > 0.63).
    # Total unique chunks: chunk_resume_1 (0.9), chunk_dup (0.8), chunk_job_1 (0.765).
    # Sorted order: chunk_resume_1, chunk_dup, chunk_job_1.
    chunks = await retriever.search(
        query="developer",
        strategy="custom",
        collections=["resume_kb", "job_kb"],
        similarity_threshold=0.5
    )
    
    assert len(chunks) == 3
    assert chunks[0].chunk_id == "chunk_resume_1"
    assert chunks[0].similarity_score == 0.9
    assert chunks[1].chunk_id == "chunk_dup"
    assert chunks[1].similarity_score == 0.8
    assert chunks[2].chunk_id == "chunk_job_1"
    assert abs(chunks[2].similarity_score - 0.765) < 0.0001


@pytest.mark.anyio
async def test_retriever_search_priorities_sorting(setup_overrides):
    retriever = setup_overrides["retriever"]
    config = setup_overrides["config"]
    
    # Test resolving tie in score.
    # Set weights to 1.0 for both.
    config.collection_weight = {"resume_kb": 1.0, "company_kb": 1.0}
    
    # Set priority: company_kb has higher priority than resume_kb
    config.collection_priority = {"resume_kb": 1, "company_kb": 10}
    
    # We query with query="tie". Both resume_kb and company_kb will return chunk with score 0.9.
    # Since company_kb has priority 10 > resume_kb's priority 1,
    # company_kb's chunk should come BEFORE resume_kb's chunk.
    chunks = await retriever.search(
        query="tie",
        strategy="custom",
        collections=["resume_kb", "company_kb"],
        similarity_threshold=0.5
    )
    
    assert len(chunks) == 2
    assert chunks[0].chunk_id == "chunk_company_kb_tie"
    assert chunks[1].chunk_id == "chunk_resume_kb_tie"


# ---------------------------------------------------------
# 3. Strategy Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_strategies_resolution(setup_overrides):
    retriever = setup_overrides["retriever"]
    
    # Strategy 'resume_only' searches only resume_kb
    chunks_resume = await retriever.search(query="test", strategy="resume_only", similarity_threshold=0.5)
    assert len(chunks_resume) == 2
    assert all("resume" in c.chunk_id or "dup" in c.chunk_id for c in chunks_resume)

    # Strategy 'job_only' searches only job_kb
    chunks_job = await retriever.search(query="test", strategy="job_only", similarity_threshold=0.5)
    assert len(chunks_job) == 2
    assert all("job" in c.chunk_id or "dup" in c.chunk_id for c in chunks_job)

    # Invalid strategy
    with pytest.raises(InvalidSearchStrategyError):
        await retriever.search(query="test", strategy="invalid_strat")


# ---------------------------------------------------------
# 4. API Endpoints Tests
# ---------------------------------------------------------

def test_api_list_knowledge_bases():
    response = client.get("/api/v1/rag/knowledge")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 7


def test_api_get_knowledge_base_details():
    response = client.get("/api/v1/rag/knowledge/resume_kb")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["key"] == "resume_kb"
    assert data["display_name"] == "Resume KB"


def test_api_get_knowledge_base_details_not_found():
    response = client.get("/api/v1/rag/knowledge/unknown_kb")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_api_register_knowledge_base():
    payload = {
        "key": "custom_kb",
        "display_name": "Custom KB Store",
        "description": "API Custom Store",
        "collection_name": "custom_kb",
        "enabled": True,
        "is_default": False,
        "version": "2.0.0",
        "metadata": {"source": "manual"}
    }
    response = client.post("/api/v1/rag/knowledge/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["key"] == "custom_kb"
    assert data["version"] == "2.0.0"


def test_api_delete_knowledge_base():
    # Register first
    payload = {
        "key": "custom_kb",
        "display_name": "Custom KB Store",
        "description": "API Custom Store",
        "collection_name": "custom_kb",
        "enabled": True,
        "is_default": False,
        "version": "2.0.0",
        "metadata": {"source": "manual"}
    }
    client.post("/api/v1/rag/knowledge/register", json=payload)

    # Delete
    response = client.delete("/api/v1/rag/knowledge/custom_kb")
    assert response.status_code == status.HTTP_204_NO_CONTENT


def test_api_get_all_stats():
    response = client.get("/api/v1/rag/knowledge/stats")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
    # Check details of first collection stats
    assert data[0]["name"] == "resume_kb"
    assert data[0]["count"] == 10
    assert data[0]["space"] == "cosine"


def test_api_knowledge_search():
    payload = {
        "query": "FastAPI backend",
        "strategy": "custom",
        "collections": ["resume_kb", "job_kb"],
        "top_k": 3,
        "similarity_threshold": 0.5
    }
    response = client.post("/api/v1/rag/knowledge/search", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["query"] == "FastAPI backend"
    assert len(data["chunks"]) == 3
    assert data["chunks"][0]["chunk_id"] == "chunk_resume_1"


# ---------------------------------------------------------
# 5. Error Handling Tests
# ---------------------------------------------------------

def test_api_search_disabled_collection(setup_overrides):
    registry = setup_overrides["registry"]
    registry.disable_kb("resume_kb")

    payload = {
        "query": "FastAPI backend",
        "strategy": "resume_only"
    }
    response = client.post("/api/v1/rag/knowledge/search", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "disabled" in response.json()["message"]


def test_api_search_empty_query():
    payload = {
        "query": "   ",
        "strategy": "global"
    }
    response = client.post("/api/v1/rag/knowledge/search", json=payload)
    # Pydantic validation error or standard empty query error
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
