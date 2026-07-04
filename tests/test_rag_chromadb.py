import os
import sys
import unittest
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.modules.rag.vectorstores.chroma import ChromaDBManager
from app.modules.rag.exceptions import ChromaDBConnectionError, CollectionNotFoundError


class TestRAGChromaDB(unittest.TestCase):
    """Unit tests for ChromaDBManager utilizing client mocking."""

    @patch("chromadb.PersistentClient")
    def test_initialize_client_success(self, mock_client):
        manager = ChromaDBManager(storage_dir="test_storage")
        mock_client.assert_called_once_with(path="test_storage")
        self.assertIsNotNone(manager.client)

    @patch("chromadb.PersistentClient", side_effect=Exception("Connection failed"))
    def test_initialize_client_failure(self, mock_client):
        with self.assertRaises(ChromaDBConnectionError):
            ChromaDBManager(storage_dir="test_storage")

    @patch("chromadb.PersistentClient")
    def test_validate_connection_success(self, mock_client):
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        mock_instance.heartbeat.return_value = 12345
        
        manager = ChromaDBManager(storage_dir="test_storage")
        self.assertTrue(manager.validate_connection())
        self.assertEqual(manager.heartbeat(), 12345)

    @patch("chromadb.PersistentClient")
    def test_validate_connection_failure(self, mock_client):
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        mock_instance.heartbeat.side_effect = Exception("Heartbeat failed")
        
        manager = ChromaDBManager(storage_dir="test_storage")
        self.assertFalse(manager.validate_connection())
        self.assertIsNone(manager.heartbeat())

    @patch("chromadb.PersistentClient")
    def test_collection_operations(self, mock_client):
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        mock_col = MagicMock()
        mock_instance.get_or_create_collection.return_value = mock_col
        mock_instance.list_collections.return_value = [mock_col]
        
        manager = ChromaDBManager(storage_dir="test_storage")
        col = manager.get_or_create_collection(name="resume_kb", metadata={"x": 1})
        mock_instance.get_or_create_collection.assert_called_once_with(name="resume_kb", metadata={"x": 1})
        self.assertEqual(col, mock_col)

        manager.delete_collection("resume_kb")
        mock_instance.delete_collection.assert_called_once_with(name="resume_kb")
        
        cols = manager.list_collections()
        self.assertEqual(cols, [mock_col])

    @patch("chromadb.PersistentClient")
    def test_get_collection_stats_success(self, mock_client):
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        mock_col = MagicMock()
        mock_col.count.return_value = 10
        mock_col.metadata = {"desc": "test"}
        mock_instance.get_collection.return_value = mock_col
        
        manager = ChromaDBManager(storage_dir="test_storage")
        stats = manager.get_collection_stats("resume_kb")
        self.assertEqual(stats["name"], "resume_kb")
        self.assertEqual(stats["count"], 10)
        self.assertEqual(stats["metadata"], {"desc": "test"})

    @patch("chromadb.PersistentClient")
    def test_get_collection_stats_not_found(self, mock_client):
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        mock_instance.get_collection.side_effect = Exception("Not found")
        
        manager = ChromaDBManager(storage_dir="test_storage")
        with self.assertRaises(CollectionNotFoundError):
            manager.get_collection_stats("resume_kb")
