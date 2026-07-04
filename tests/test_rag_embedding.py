import os
import sys
import unittest
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.modules.rag.embeddings.service import EmbeddingService
from app.modules.rag.exceptions import EmbeddingInitializationError, OllamaUnavailableError


class TestRAGEmbedding(unittest.IsolatedAsyncioTestCase):
    """Isolated asyncio tests for EmbeddingService."""

    def setUp(self):
        self.mock_client = MagicMock()
        self.mock_client.embed = AsyncMock()
        self.mock_client.health_check = AsyncMock()
        self.mock_client.timeout = 10
        self.mock_client.host = "http://localhost:11434"
        self.service = EmbeddingService(ollama_client=self.mock_client, model_name="nomic-embed-text")

    async def test_generate_embedding_success(self):
        self.mock_client.embed.return_value = {"embedding": [0.1] * 768}
        vector = await self.service.generate_embedding("hello")
        self.assertEqual(vector, [0.1] * 768)
        self.mock_client.embed.assert_called_once_with(input_data="hello", model="nomic-embed-text")

    async def test_generate_embedding_validation_failure(self):
        self.mock_client.embed.return_value = {"embedding": ["invalid", "data"]}
        with self.assertRaises(EmbeddingInitializationError):
            await self.service.generate_embedding("hello")

    async def test_generate_embeddings_batch_success(self):
        self.mock_client.embed.return_value = {"embeddings": [[0.1] * 768, [0.2] * 768]}
        vectors = await self.service.generate_embeddings_batch(["hello", "world"])
        self.assertEqual(vectors, [[0.1] * 768, [0.2] * 768])
        self.mock_client.embed.assert_called_once_with(input_data=["hello", "world"], model="nomic-embed-text")

    async def test_generate_embeddings_batch_mismatch(self):
        self.mock_client.embed.return_value = {"embeddings": [[0.1] * 768]}
        with self.assertRaises(EmbeddingInitializationError):
            await self.service.generate_embeddings_batch(["hello", "world"])

    def test_validate_embedding_valid(self):
        self.assertTrue(self.service.validate_embedding([0.1] * 768))

    def test_validate_embedding_invalid_type(self):
        self.assertFalse(self.service.validate_embedding(["string", 1.2]))
        self.assertFalse(self.service.validate_embedding([]))

    def test_validate_embedding_nan_or_inf(self):
        self.assertFalse(self.service.validate_embedding([float("nan"), 1.2]))
        self.assertFalse(self.service.validate_embedding([float("inf"), 1.2]))

    async def test_health_check_healthy(self):
        self.mock_client.health_check.return_value = {"status": "healthy"}
        
        # Mock httpx response for /api/tags
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "models": [{"name": "nomic-embed-text:latest"}]
        }
        
        with patch("httpx.AsyncClient.get", new_callable=AsyncMock) as mock_get:
            mock_get.return_value = mock_response
            health = await self.service.health_check()
            self.assertEqual(health["status"], "healthy")

    async def test_health_check_unhealthy(self):
        self.mock_client.health_check.return_value = {"status": "unhealthy", "error": "connection failed"}
        health = await self.service.health_check()
        self.assertEqual(health["status"], "unhealthy")
