# app/modules/agents/workflow/memory/context_memory.py

from typing import Dict, Any, Optional
from app.modules.agents.workflow.memory.memory_store import MemoryStore


class ContextMemory:
    """Manages active shared variables and general workspace context propagation."""

    def __init__(self, store: MemoryStore):
        self.store = store
        self.namespace = "context"

    def set_context_var(self, session_id: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Sets a specific contextual variable."""
        self.store.set(session_id, self.namespace, key, value, ttl=ttl)

    def get_context_var(self, session_id: str, key: str) -> Optional[Any]:
        """Retrieves a specific contextual variable."""
        return self.store.get(session_id, self.namespace, key)

    def get_context(self, session_id: str) -> Dict[str, Any]:
        """Gathers all contextual variables in this session."""
        return self.store.get_all_for_session(session_id, namespace=self.namespace)

    def merge_context(self, session_id: str, incoming_variables: Dict[str, Any], ttl: Optional[int] = None) -> None:
        """Merges a dictionary of incoming variables into the current shared context."""
        for key, val in incoming_variables.items():
            self.store.set(session_id, self.namespace, key, val, ttl=ttl)

    def clear_context(self, session_id: str) -> None:
        """Purges all contextual variables in this session namespace."""
        session_data = self.store.get_all_for_session(session_id, namespace=self.namespace)
        for key in list(session_data.keys()):
            self.store.delete(session_id, self.namespace, key)
