# tests/test_rag_part4.py

import os
import sys
import unittest
import asyncio
import hashlib
from datetime import datetime, timezone
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import status
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.dependencies import get_current_user
from app.modules.rag.config import RAGConfig
from app.modules.rag.exceptions import (
    EmbeddingInitializationError,
    OllamaUnavailableError,
    DuplicateDetectionError,
    VectorStorageError,
)
from app.modules.rag.embeddings.base import EmbeddingProvider
from app.modules.rag.embeddings.ollama import OllamaEmbeddingProvider
from app.modules.rag.embeddings.factory import EmbeddingProviderFactory
from app.modules.rag.embeddings.service import EmbeddingService
from app.modules.rag.embeddings.pipeline import EmbeddingPipeline
from app.modules.rag.vectorstores.base import VectorStore
from app.modules.rag.vectorstores.chroma import ChromaVectorStore, ChromaDBManager
from app.modules.rag.vectorstores.factory import VectorStoreFactory
from app.modules.rag.vectorstores.service import VectorStorageService
from app.modules.rag.services.indexing_service import DocumentIndexingService
from app.modules.rag.chunking.models import ChunkResponse, Chunk, ChunkMetadata
from app.modules.rag.schemas.document import LoadedDocument, DocumentMetadata, Document
from app.modules.rag.dependencies import (
    get_document_indexing_service,
    get_vector_storage_service,
    get_embedding_service,
)


class TestRAGPart4(unittest.IsolatedAsyncioTestCase):
    """Test suite covering Phase 12 Part 4 implementation requirements."""

    def setUp(self):
        self.config = RAGConfig()
        self.config.embedding_provider = "ollama"
        self.config.embedding_model = "nomic-embed-text"
        self.config.batch_size = 2
        self.config.async_workers = 2
        self.config.retry_count = 2

        # Mock Ollama Client
        self.mock_ollama = MagicMock()
        self.mock_ollama.embed = AsyncMock()
        self.mock_ollama.health_check = AsyncMock()
        self.mock_ollama.timeout = 10
        self.mock_ollama.host = "http://localhost:11434"

        # Mock ChromaDB persistent client and manager
        self.mock_chroma_client = MagicMock()
        self.mock_chroma_manager = MagicMock()
        self.mock_chroma_manager.get_or_create_collection = MagicMock()
        self.mock_chroma_manager.list_collections = MagicMock()
        self.mock_chroma_manager.get_collection_stats = MagicMock()

        # Mock User
        self.mock_user = MagicMock()
        self.mock_user.id = 1
        self.mock_user.is_active = True

        # Mock Services
        self.mock_indexing_service = MagicMock()
        self.mock_vector_storage_service = MagicMock()
        self.mock_embedding_service = MagicMock()

        # Set up dependency overrides
        app.dependency_overrides[get_current_user] = lambda: self.mock_user
        app.dependency_overrides[get_document_indexing_service] = lambda: self.mock_indexing_service
        app.dependency_overrides[get_vector_storage_service] = lambda: self.mock_vector_storage_service
        app.dependency_overrides[get_embedding_service] = lambda: self.mock_embedding_service

    def tearDown(self):
        app.dependency_overrides.clear()

    # ==========================================================
    # 1. Embedding Provider & Factory Tests
    # ==========================================================
    def test_factory_get_provider_ollama(self):
        with patch("app.modules.rag.embeddings.factory.OllamaClient") as mock_client_cls:
            mock_client_cls.return_value = self.mock_ollama
            provider = EmbeddingProviderFactory.get_provider(self.config)
            self.assertIsInstance(provider, OllamaEmbeddingProvider)
            self.assertEqual(provider.model_name, "nomic-embed-text")

    def test_factory_get_provider_unsupported(self):
        self.config.embedding_provider = "invalid_provider"
        with self.assertRaises(EmbeddingInitializationError):
            EmbeddingProviderFactory.get_provider(self.config)

    async def test_ollama_provider_embed_success(self):
        self.mock_ollama.embed.return_value = {"embedding": [0.1] * 768}
        provider = OllamaEmbeddingProvider(self.mock_ollama, "nomic-embed-text")
        vector = await provider.embed("test chunk content")
        self.assertEqual(vector, [0.1] * 768)

    async def test_ollama_provider_embed_batch_success(self):
        self.mock_ollama.embed.return_value = {"embeddings": [[0.1] * 768, [0.2] * 768]}
        provider = OllamaEmbeddingProvider(self.mock_ollama, "nomic-embed-text")
        vectors = await provider.embed_batch(["text1", "text2"])
        self.assertEqual(vectors, [[0.1] * 768, [0.2] * 768])

    async def test_embedding_service_retries_transient_failures(self):
        provider = MagicMock(spec=EmbeddingProvider)
        provider.embed.side_effect = [OllamaUnavailableError("connection error"), [0.1] * 768]
        provider.model_name = "nomic-embed-text"

        service = EmbeddingService(provider=provider, retry_count=2)
        vector = await service.generate_embedding("retry test text")
        self.assertEqual(vector, [0.1] * 768)
        self.assertEqual(provider.embed.call_count, 2)

    # ==========================================================
    # 2. Vector Store & Chroma Storage Tests
    # ==========================================================
    def test_factory_get_vector_store(self):
        store = VectorStoreFactory.get_vector_store(self.config, self.mock_chroma_manager)
        self.assertIsInstance(store, ChromaVectorStore)

    def test_chroma_vector_store_operations(self):
        mock_col = MagicMock()
        self.mock_chroma_manager.get_or_create_collection.return_value = mock_col
        store = ChromaVectorStore(self.mock_chroma_manager)

        # Test insert
        store.insert("resume_kb", ["id1"], [[0.1]], [{"meta": "data"}], ["doc content"])
        mock_col.add.assert_called_once_with(
            ids=["id1"], embeddings=[[0.1]], metadatas=[{"meta": "data"}], documents=["doc content"]
        )

        # Test update
        store.update("resume_kb", ["id1"], [[0.1]], [{"meta": "data"}], ["doc content"])
        mock_col.update.assert_called_once_with(
            ids=["id1"], embeddings=[[0.1]], metadatas=[{"meta": "data"}], documents=["doc content"]
        )

        # Test delete
        store.delete("resume_kb", ["id1"])
        mock_col.delete.assert_called_once_with(ids=["id1"])

        # Test delete by document
        store.delete_by_document("resume_kb", "doc1")
        mock_col.delete.assert_called_with(where={"document_id": "doc1"})

    # ==========================================================
    # 3. Batch Indexing & Performance Tests
    # ==========================================================
    async def test_embedding_pipeline_batching(self):
        service = MagicMock(spec=EmbeddingService)
        service.generate_embeddings_batch = AsyncMock(side_effect=[
            [[0.1] * 768, [0.2] * 768],
            [[0.3] * 768]
        ])
        service.provider = MagicMock()
        service.provider.model_name = "nomic-embed-text"

        pipeline = EmbeddingPipeline(service, self.config)

        # Make 3 chunks
        chunks = []
        for i in range(3):
            meta = ChunkMetadata(
                chunk_id=f"c{i}", document_id="d1", chunk_index=i, total_chunks=3,
                source_file="f.txt", source_type="txt", character_start=0, character_end=10,
                word_count=2, token_estimate=1, created_at=datetime.now(timezone.utc)
            )
            chunks.append(Chunk(content=f"content {i}", metadata=meta))

        chunk_res = ChunkResponse(
            document_id="d1", strategy_used="recursive", total_chunks=3,
            chunks=chunks, processing_time_ms=1.0
        )

        result = await pipeline.embed_chunks(chunk_res)
        self.assertEqual(len(result.embeddings), 3)
        self.assertEqual(result.embeddings[0].vector, [0.1] * 768)
        self.assertEqual(result.embeddings[2].vector, [0.3] * 768)
        self.assertEqual(service.generate_embeddings_batch.call_count, 2)

    # ==========================================================
    # 4. Duplicate Detection & Indexing Service Tests
    # ==========================================================
    async def test_indexing_service_duplicate_skip(self):
        chunking_service = MagicMock()
        embedding_pipeline = MagicMock()
        vector_storage_service = MagicMock()

        vector_store = MagicMock(spec=VectorStore)
        vector_store.get_by_document.return_value = [{"id": "c1", "metadata": {"content_hash": "existing_hash"}}]
        vector_storage_service.vector_store = vector_store

        indexing_service = DocumentIndexingService(
            chunking_service, embedding_pipeline, vector_storage_service, self.config
        )

        doc = LoadedDocument(
            content="sample content",
            metadata=DocumentMetadata(
                file_name="f.txt", extension="txt", mime_type="text/plain", file_size=10,
                upload_timestamp=datetime.now(timezone.utc), last_modified=datetime.now(timezone.utc)
            ),
            pages=[]
        )

        # Run with 'skip' duplicate policy
        summary = await indexing_service.index_document(
            document=doc,
            collection_name="resume_kb",
            document_id="d1",
            duplicate_policy="skip"
        )

        self.assertEqual(summary.status, "skipped")
        self.assertEqual(summary.chunks_indexed, 0)
        self.assertEqual(summary.embeddings_generated, 0)
        chunking_service.chunk_document.assert_not_called()

    async def test_indexing_service_duplicate_fail(self):
        chunking_service = MagicMock()
        embedding_pipeline = MagicMock()
        vector_storage_service = MagicMock()
        vector_store = MagicMock(spec=VectorStore)
        vector_store.get_by_document.return_value = [{"id": "c1"}]
        vector_storage_service.vector_store = vector_store

        indexing_service = DocumentIndexingService(
            chunking_service, embedding_pipeline, vector_storage_service, self.config
        )

        doc = LoadedDocument(
            content="sample content",
            metadata=DocumentMetadata(
                file_name="f.txt", extension="txt", mime_type="text/plain", file_size=10,
                upload_timestamp=datetime.now(timezone.utc), last_modified=datetime.now(timezone.utc)
            ),
            pages=[]
        )

        with self.assertRaises(DuplicateDetectionError):
            await indexing_service.index_document(
                document=doc,
                collection_name="resume_kb",
                document_id="d1",
                duplicate_policy="fail"
            )

    # ==========================================================
    # 5. Router Endpoints API Tests
    # ==========================================================
    def test_api_index_document_endpoint(self):
        self.mock_indexing_service.index_document = AsyncMock(return_value={
            "document_id": "d1", "chunks_indexed": 2, "embeddings_generated": 2,
            "processing_time_ms": 10.0, "collection": "resume_kb", "status": "completed"
        })

        client = TestClient(app)
        doc_payload = {
            "document": {
                "content": "Doc body content",
                "metadata": {
                    "file_name": "f.txt",
                    "extension": "txt",
                    "mime_type": "text/plain",
                    "file_size": 16,
                    "upload_timestamp": "2026-07-04T12:00:00Z",
                    "last_modified": "2026-07-04T12:00:00Z"
                }
            },
            "collection_name": "resume_kb",
            "document_id": "d1",
            "duplicate_policy": "skip"
        }

        response = client.post("/api/v1/rag/index", json=doc_payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "completed")
        self.assertEqual(data["document_id"], "d1")

    def test_api_index_status_endpoint(self):
        self.mock_vector_storage_service.vector_store = MagicMock()
        self.mock_vector_storage_service.vector_store.get_by_document.return_value = [{"id": "c1"}, {"id": "c2"}]

        client = TestClient(app)
        response = client.get("/api/v1/rag/index/status/d1?collection_name=resume_kb")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "indexed")
        self.assertEqual(data["chunk_count"], 2)

    def test_api_collection_stats_endpoint(self):
        self.mock_vector_storage_service.get_collection_statistics.return_value = {
            "name": "resume_kb", "count": 10, "metadata": {"test": 1}
        }

        client = TestClient(app)
        response = client.get("/api/v1/rag/collections/resume_kb/stats")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["name"], "resume_kb")
        self.assertEqual(data["count"], 10)
