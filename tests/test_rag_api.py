import os
import sys
import unittest
from unittest.mock import MagicMock, AsyncMock
from fastapi import status
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.dependencies import get_current_user
from app.modules.rag.dependencies import get_collection_manager, get_embedding_service, get_chroma_manager
from app.modules.rag.exceptions import CollectionNotFoundError, InvalidCollectionNameError, ChromaDBConnectionError


class TestRAGAPI(unittest.TestCase):
    """Unit tests for RAG API endpoints, testing request/response schemas and status codes."""

    def setUp(self):
        self.client = TestClient(app)
        
        # Setup mocks
        self.mock_user = MagicMock()
        self.mock_user.id = 1
        self.mock_user.is_active = True
        
        self.mock_collection_manager = MagicMock()
        self.mock_embedding_service = MagicMock()
        self.mock_chroma_manager = MagicMock()
        
        # Override dependencies
        app.dependency_overrides[get_current_user] = lambda: self.mock_user
        app.dependency_overrides[get_collection_manager] = lambda: self.mock_collection_manager
        app.dependency_overrides[get_embedding_service] = lambda: self.mock_embedding_service
        app.dependency_overrides[get_chroma_manager] = lambda: self.mock_chroma_manager

    def tearDown(self):
        app.dependency_overrides.clear()

    def test_health_endpoint_healthy(self):
        self.mock_chroma_manager.validate_connection.return_value = True
        self.mock_chroma_manager.heartbeat.return_value = 999
        self.mock_chroma_manager.storage_dir = "test_dir"
        
        self.mock_embedding_service.health_check = AsyncMock(return_value={"status": "healthy", "model": "nomic-embed-text"})
        
        response = self.client.get("/api/v1/rag/health")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["chromadb"]["status"], "healthy")
        self.assertEqual(data["chromadb"]["heartbeat"], 999)
        self.assertEqual(data["ollama"]["status"], "healthy")

    def test_health_endpoint_unhealthy(self):
        self.mock_chroma_manager.validate_connection.return_value = False
        self.mock_chroma_manager.heartbeat.return_value = None
        self.mock_chroma_manager.storage_dir = "test_dir"
        
        self.mock_embedding_service.health_check = AsyncMock(return_value={"status": "unhealthy", "error": "model error"})
        
        response = self.client.get("/api/v1/rag/health")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "unhealthy")
        self.assertEqual(data["chromadb"]["status"], "unhealthy")

    def test_list_collections(self):
        self.mock_collection_manager.list_collections.return_value = [
            {"name": "resume_kb", "metadata": {"test": 1}, "count": 10}
        ]
        response = self.client.get("/api/v1/rag/collections")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]["name"], "resume_kb")
        self.assertEqual(data[0]["count"], 10)

    def test_create_collection_success(self):
        self.mock_collection_manager.create_collection.return_value = {
            "name": "resume_kb", "metadata": None, "count": 0
        }
        response = self.client.post("/api/v1/rag/collections", json={"name": "resume_kb"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertEqual(data["name"], "resume_kb")

    def test_create_collection_invalid_name(self):
        self.mock_collection_manager.create_collection.side_effect = InvalidCollectionNameError("Invalid name")
        response = self.client.post("/api/v1/rag/collections", json={"name": "invalid_kb"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid name", response.json()["message"])

    def test_delete_collection_success(self):
        response = self.client.delete("/api/v1/rag/collections/resume_kb")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.mock_collection_manager.delete_collection.assert_called_once_with(name="resume_kb")

    def test_delete_collection_not_found(self):
        self.mock_collection_manager.delete_collection.side_effect = CollectionNotFoundError("Not found")
        response = self.client.delete("/api/v1/rag/collections/resume_kb")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("Not found", response.json()["message"])
