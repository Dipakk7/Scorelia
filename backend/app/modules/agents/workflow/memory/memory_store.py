# app/modules/agents/workflow/memory/memory_store.py

import time
import threading
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class MemoryEntry(BaseModel):
    """Container for stored values, managing TTL expiration and metadata."""
    value: Any
    expires_at: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def is_expired(self) -> bool:
        """Checks whether the entry's TTL has expired."""
        if self.expires_at is None:
            return False
        return time.time() > self.expires_at


class MemoryStore:
    """Thread-safe namespace-aware in-memory store for Agent memories."""

    def __init__(self):
        # session_id -> namespace -> key -> MemoryEntry
        self._storage: Dict[str, Dict[str, Dict[str, MemoryEntry]]] = {}
        self._lock = threading.Lock()

    def set(
        self,
        session_id: str,
        namespace: str,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Stores a value within a given session and namespace."""
        with self._lock:
            if session_id not in self._storage:
                self._storage[session_id] = {}
            if namespace not in self._storage[session_id]:
                self._storage[session_id][namespace] = {}

            expires_at = time.time() + ttl if ttl is not None else None
            self._storage[session_id][namespace][key] = MemoryEntry(
                value=value,
                expires_at=expires_at,
                metadata=metadata or {}
            )

    def get(self, session_id: str, namespace: str, key: str) -> Optional[Any]:
        """Retrieves a value for a specific session, namespace, and key."""
        with self._lock:
            if session_id not in self._storage:
                return None
            if namespace not in self._storage[session_id]:
                return None

            entry = self._storage[session_id][namespace].get(key)
            if entry is None:
                return None
            if entry.is_expired():
                del self._storage[session_id][namespace][key]
                return None
            return entry.value

    def delete(self, session_id: str, namespace: str, key: str) -> None:
        """Removes a key from a specific namespace in a session."""
        with self._lock:
            if (
                session_id in self._storage
                and namespace in self._storage[session_id]
                and key in self._storage[session_id][namespace]
            ):
                del self._storage[session_id][namespace][key]

    def clear_session(self, session_id: str) -> None:
        """Purges all namespaces and values for a given session."""
        with self._lock:
            if session_id in self._storage:
                del self._storage[session_id]

    def get_all_for_session(self, session_id: str, namespace: Optional[str] = None) -> Dict[str, Any]:
        """Gathers all values for a session, optionally filtered by namespace."""
        with self._lock:
            if session_id not in self._storage:
                return {}

            result = {}
            namespaces = [namespace] if namespace else list(self._storage[session_id].keys())

            for ns in namespaces:
                if ns not in self._storage[session_id]:
                    continue
                ns_dict = self._storage[session_id][ns]
                for key in list(ns_dict.keys()):
                    entry = ns_dict[key]
                    if entry.is_expired():
                        del ns_dict[key]
                    else:
                        if namespace:
                            result[key] = entry.value
                        else:
                            if ns not in result:
                                result[ns] = {}
                            result[ns][key] = entry.value
            return result

    def cleanup_expired(self) -> None:
        """Scans all storage and removes expired entries."""
        with self._lock:
            now = time.time()
            for session_id in list(self._storage.keys()):
                for namespace in list(self._storage[session_id].keys()):
                    ns_dict = self._storage[session_id][namespace]
                    for key in list(ns_dict.keys()):
                        entry = ns_dict[key]
                        if entry.expires_at is not None and now > entry.expires_at:
                            del ns_dict[key]
                    if not ns_dict:
                        del self._storage[session_id][namespace]
                if not self._storage[session_id]:
                    del self._storage[session_id]
