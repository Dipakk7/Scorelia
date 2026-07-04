import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.modules.rag.config import RAGConfig


class TestRAGConfig(unittest.TestCase):
    """Unit tests for RAG Module configuration mapping."""

    def test_rag_config_fields(self):
        config = RAGConfig()
        self.assertEqual(config.chroma_storage_dir, "storage/chromadb")
        self.assertEqual(config.embedding_provider, "ollama")
        self.assertEqual(config.embedding_model, "nomic-embed-text")
        self.assertEqual(config.top_k, 4)
        self.assertEqual(config.similarity_threshold, 0.7)
        self.assertEqual(config.retrieval_limit, 10)
        
        # Verify collection names mapping
        self.assertEqual(config.collections["resume_kb"], "resume_kb")
        self.assertEqual(config.collections["company_kb"], "company_kb")
        self.assertEqual(config.collections["course_kb"], "course_kb")
        self.assertEqual(config.collections["skills_kb"], "skills_kb")
        self.assertEqual(config.collections["interview_kb"], "interview_kb")
        self.assertEqual(config.collections["ats_kb"], "ats_kb")
        self.assertEqual(config.collections["job_kb"], "job_kb")
        
        # Verify retrieval default dictionary
        self.assertEqual(config.retrieval_config["top_k"], 4)
        self.assertEqual(config.retrieval_config["similarity_threshold"], 0.7)
        self.assertEqual(config.retrieval_config["limit"], 10)
