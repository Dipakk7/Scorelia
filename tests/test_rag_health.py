import os
import sys
import unittest
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from fastapi.testclient import TestClient


class TestRAGHealthIntegration(unittest.TestCase):
    """Integration tests verifying RAG health stats reporting in the global health endpoint."""

    def setUp(self):
        self.client = TestClient(app)

    @patch("app.modules.rag.dependencies.get_chroma_manager")
    @patch("app.modules.rag.dependencies.get_embedding_service")
    def test_integrated_health_healthy(self, mock_get_embedding, mock_get_chroma):
        # Setup Chroma manager mock
        mock_chroma = MagicMock()
        mock_chroma.validate_connection.return_value = True
        mock_chroma.heartbeat.return_value = 12345
        mock_chroma.storage_dir = "test_dir"
        mock_get_chroma.return_value = mock_chroma

        # Setup Embedding service mock
        mock_embed = MagicMock()
        mock_embed.health_check = AsyncMock(return_value={"status": "healthy", "model": "nomic-embed-text"})
        mock_get_embedding.return_value = mock_embed

        # Patch core dependencies for the `/health` endpoint to make the output deterministic
        with patch("app.api.v1.endpoints.health.get_db") as mock_db, \
             patch("app.api.v1.endpoints.health.get_ai_provider") as mock_ai:
            
            # Setup mock DB session
            mock_session = MagicMock()
            mock_session.execute.return_value = True
            mock_db.return_value = [mock_session]
            
            # Setup mock AI provider
            mock_provider = MagicMock()
            mock_provider.health_check = AsyncMock(return_value={"status": "healthy"})
            mock_ai.return_value = mock_provider

            response = self.client.get("/health")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            
            self.assertIn("rag", data)
            self.assertEqual(data["rag"]["status"], "healthy")
            self.assertEqual(data["rag"]["chromadb"]["status"], "healthy")
            self.assertEqual(data["rag"]["chromadb"]["heartbeat"], 12345)
            self.assertEqual(data["rag"]["ollama"]["status"], "healthy")
