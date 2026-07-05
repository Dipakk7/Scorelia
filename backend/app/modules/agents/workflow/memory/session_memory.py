# app/modules/agents/workflow/memory/session_memory.py

from typing import Dict, Any, Optional
from app.modules.agents.workflow.memory.memory_store import MemoryStore


class SessionMemory:
    """Manages session-scoped variables, cross-conversation context, and user preferences."""

    def __init__(self, store: MemoryStore):
        self.store = store
        self.namespace = "session"

    def set_var(self, session_id: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Sets a session variable with optional TTL."""
        self.store.set(session_id, self.namespace, key, value, ttl=ttl)

    def get_var(self, session_id: str, key: str) -> Optional[Any]:
        """Retrieves a session variable."""
        return self.store.get(session_id, self.namespace, key)

    def delete_var(self, session_id: str, key: str) -> None:
        """Removes a session variable."""
        self.store.delete(session_id, self.namespace, key)

    def get_all(self, session_id: str) -> Dict[str, Any]:
        """Returns all key-value pairs stored in the session namespace."""
        return self.store.get_all_for_session(session_id, namespace=self.namespace)

    def clear(self, session_id: str) -> None:
        """Purges all values under the session namespace for this session."""
        # Note: We delete individual keys in the namespace rather than the full session
        # unless intended, to avoid destroying other namespaces.
        session_data = self.store.get_all_for_session(session_id, namespace=self.namespace)
        for key in list(session_data.keys()):
            self.store.delete(session_id, self.namespace, key)
