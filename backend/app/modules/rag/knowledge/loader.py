# app/modules/rag/knowledge/loader.py

from typing import Dict, Any, List
import structlog
from app.modules.rag.knowledge.registry import KnowledgeBaseRegistry

logger = structlog.get_logger()

class KnowledgeBaseLoader:
    """Helper to seed and verify knowledge collections and metadata."""

    def __init__(self, registry: KnowledgeBaseRegistry):
        self.registry = registry

    def load_initial_metadata(self) -> None:
        """Verify and log initialization configuration."""
        kbs = self.registry.list_kbs()
        logger.info("Loaded initial knowledge bases registry", count=len(kbs), keys=[kb.key for kb in kbs])
