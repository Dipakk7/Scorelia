# app/modules/rag/knowledge/registry.py

from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
import structlog

from app.modules.rag.config import RAGConfig
from app.modules.rag.knowledge.models import KnowledgeBaseInfo

logger = structlog.get_logger()


class KnowledgeBaseRegistry:
    """Registry that manages configured and dynamically added Knowledge Bases."""

    def __init__(self, config: RAGConfig):
        self.config = config
        self._kbs: Dict[str, KnowledgeBaseInfo] = {}
        self._initialize_defaults()

    def _initialize_defaults(self):
        """Pre-populate the registry with standard core knowledge bases from RAGConfig."""
        defaults = [
            {
                "key": "resume_kb",
                "display_name": "Resume KB",
                "description": "Store containing candidate resumes, CV documents, and parser structures.",
                "collection_name": self.config.collections.get("resume_kb", "resume_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "candidate"}
            },
            {
                "key": "job_kb",
                "display_name": "Jobs KB",
                "description": "Store containing job descriptions, postings, and employment criteria.",
                "collection_name": self.config.collections.get("job_kb", "job_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "employment"}
            },
            {
                "key": "company_kb",
                "display_name": "Companies KB",
                "description": "Store containing corporate profiles, insights, and company records.",
                "collection_name": self.config.collections.get("company_kb", "company_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "market"}
            },
            {
                "key": "course_kb",
                "display_name": "Courses KB",
                "description": "Store containing educational curricula, courses, and syllabus details.",
                "collection_name": self.config.collections.get("course_kb", "course_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "education"}
            },
            {
                "key": "skills_kb",
                "display_name": "Skills KB",
                "description": "Store containing standardized skill ontologies, taxonomy mappings, and profiles.",
                "collection_name": self.config.collections.get("skills_kb", "skills_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "taxonomy"}
            },
            {
                "key": "interview_kb",
                "display_name": "Interview KB",
                "description": "Store containing mock questions, behavioral queries, and scoring models.",
                "collection_name": self.config.collections.get("interview_kb", "interview_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "assessment"}
            },
            {
                "key": "ats_kb",
                "display_name": "ATS KB",
                "description": "Store containing ATS parsing logs, heuristics, and standard guidelines.",
                "collection_name": self.config.collections.get("ats_kb", "ats_kb"),
                "is_default": True,
                "version": "1.0.0",
                "metadata": {"category": "compliance"}
            }
        ]

        for item in defaults:
            kb = KnowledgeBaseInfo(
                key=item["key"],
                display_name=item["display_name"],
                description=item["description"],
                collection_name=item["collection_name"],
                enabled=True,
                is_default=item["is_default"],
                version=item["version"],
                metadata=item["metadata"]
            )
            self._kbs[kb.key] = kb
        logger.info("Initialized default knowledge bases in registry", count=len(self._kbs))

    def register_kb(
        self,
        key: str,
        display_name: str,
        description: str,
        collection_name: str,
        enabled: bool = True,
        is_default: bool = False,
        version: str = "1.0.0",
        metadata: Optional[Dict[str, Any]] = None
    ) -> KnowledgeBaseInfo:
        """Register a new Knowledge Base or update an existing one."""
        meta = metadata or {}
        now = datetime.now(timezone.utc)
        
        if key in self._kbs:
            # Update existing
            kb = self._kbs[key]
            kb.display_name = display_name
            kb.description = description
            kb.collection_name = collection_name
            kb.enabled = enabled
            kb.is_default = is_default
            kb.version = version
            kb.metadata = meta
            kb.updated_at = now
            logger.info("Updated registered knowledge base", key=key)
        else:
            # Create new
            kb = KnowledgeBaseInfo(
                key=key,
                display_name=display_name,
                description=description,
                collection_name=collection_name,
                enabled=enabled,
                is_default=is_default,
                version=version,
                metadata=meta,
                created_at=now,
                updated_at=now
            )
            self._kbs[key] = kb
            logger.info("Registered new knowledge base", key=key)
        return kb

    def remove_kb(self, key: str) -> None:
        """Remove a knowledge base from the registry."""
        if key in self._kbs:
            del self._kbs[key]
            logger.info("Removed knowledge base from registry", key=key)
        else:
            logger.warning("Attempted to remove non-existent knowledge base", key=key)

    def enable_kb(self, key: str) -> None:
        """Enable a registered knowledge base."""
        if key in self._kbs:
            self._kbs[key].enabled = True
            self._kbs[key].updated_at = datetime.now(timezone.utc)
            logger.info("Enabled knowledge base", key=key)
        else:
            raise KeyError(f"Knowledge base '{key}' not found in registry.")

    def disable_kb(self, key: str) -> None:
        """Disable a registered knowledge base."""
        if key in self._kbs:
            self._kbs[key].enabled = False
            self._kbs[key].updated_at = datetime.now(timezone.utc)
            logger.info("Disabled knowledge base", key=key)
        else:
            raise KeyError(f"Knowledge base '{key}' not found in registry.")

    def get_kb(self, key: str) -> KnowledgeBaseInfo:
        """Retrieve a specific knowledge base by key."""
        if key in self._kbs:
            return self._kbs[key]
        raise KeyError(f"Knowledge base '{key}' not found in registry.")

    def list_kbs(self, enabled_only: bool = False) -> List[KnowledgeBaseInfo]:
        """List all knowledge bases in the registry."""
        if enabled_only:
            return [kb for kb in self._kbs.values() if kb.enabled]
        return list(self._kbs.values())
