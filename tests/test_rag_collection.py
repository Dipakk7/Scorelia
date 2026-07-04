import os
import sys
import unittest
from unittest.mock import MagicMock

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.modules.rag.services.collection_manager import CollectionManager
from app.modules.rag.exceptions import InvalidCollectionNameError, CollectionNotFoundError


class TestRAGCollection(unittest.TestCase):
    """Unit tests for CollectionManager collection rules and validation."""

    def setUp(self):
        self.mock_chroma = MagicMock()
        self.manager = CollectionManager(chroma_manager=self.mock_chroma)

    def test_validate_collection_name(self):
        self.assertTrue(self.manager.validate_collection_name("resume_kb"))
        self.assertTrue(self.manager.validate_collection_name("company_kb"))
        self.assertTrue(self.manager.validate_collection_name("job_kb"))
        self.assertFalse(self.manager.validate_collection_name("invalid_kb"))

    def test_create_collection_success(self):
        mock_col = MagicMock()
        mock_col.name = "resume_kb"
        mock_col.metadata = {"desc": "candidate profiles"}
        mock_col.count.return_value = 5
        self.mock_chroma.get_or_create_collection.return_value = mock_col

        res = self.manager.create_collection("resume_kb", metadata={"desc": "candidate profiles"})
        self.assertEqual(res["name"], "resume_kb")
        self.assertEqual(res["count"], 5)
        self.mock_chroma.get_or_create_collection.assert_called_once_with(
            name="resume_kb", metadata={"desc": "candidate profiles"}
        )

    def test_create_collection_invalid_name(self):
        with self.assertRaises(InvalidCollectionNameError):
            self.manager.create_collection("invalid_kb")

    def test_delete_collection_success(self):
        mock_col = MagicMock()
        mock_col.name = "resume_kb"
        self.mock_chroma.list_collections.return_value = [mock_col]

        self.manager.delete_collection("resume_kb")
        self.mock_chroma.delete_collection.assert_called_once_with(name="resume_kb")

    def test_delete_collection_invalid_name(self):
        with self.assertRaises(InvalidCollectionNameError):
            self.manager.delete_collection("invalid_kb")

    def test_delete_collection_not_found(self):
        self.mock_chroma.list_collections.return_value = []
        with self.assertRaises(CollectionNotFoundError):
            self.manager.delete_collection("resume_kb")

    def test_list_collections(self):
        mock_col = MagicMock()
        mock_col.name = "resume_kb"
        mock_col.metadata = None
        mock_col.count.return_value = 10
        self.mock_chroma.list_collections.return_value = [mock_col]

        collections = self.manager.list_collections()
        self.assertEqual(len(collections), 1)
        self.assertEqual(collections[0]["name"], "resume_kb")
        self.assertEqual(collections[0]["count"], 10)

    def test_get_collection_details_success(self):
        self.mock_chroma.get_collection_stats.return_value = {
            "name": "resume_kb", "count": 2, "metadata": {"test": 1}
        }
        res = self.manager.get_collection_details("resume_kb")
        self.assertEqual(res["name"], "resume_kb")
        self.assertEqual(res["count"], 2)

    def test_get_collection_details_invalid_name(self):
        with self.assertRaises(InvalidCollectionNameError):
            self.manager.get_collection_details("invalid_kb")
