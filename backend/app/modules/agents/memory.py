# app/modules/agents/memory.py

import time
import threading
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class MemoryEntry(BaseModel):
    """A wrapper around stored values in SharedMemory containing value, TTL, and metadata."""
    value: Any
    expires_at: Optional[float] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def is_expired(self) -> bool:
        """Checks if the stored item has exceeded its Time-To-Live."""
        if self.expires_at is None:
            return False
        return time.time() > self.expires_at


class SharedMemory:
    """Thread-safe in-memory key-value store acting as scratchpad, session, and shared variables space for agents."""

    def __init__(self):
        # session_id -> key -> MemoryEntry
        self._storage: Dict[str, Dict[str, MemoryEntry]] = {}
        self._lock = threading.Lock()

    def set(
        self,
        session_id: str,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Stores a value in session space with an optional TTL (in seconds) and metadata."""
        with self._lock:
            if session_id not in self._storage:
                self._storage[session_id] = {}
            expires_at = time.time() + ttl if ttl is not None else None
            self._storage[session_id][key] = MemoryEntry(
                value=value,
                expires_at=expires_at,
                metadata=metadata or {}
            )

    def get(self, session_id: str, key: str) -> Optional[Any]:
        """Retrieves a value by key for a specific session. Returns None if key is expired or missing."""
        with self._lock:
            if session_id not in self._storage:
                return None
            entry = self._storage[session_id].get(key)
            if entry is None:
                return None
            if entry.is_expired():
                del self._storage[session_id][key]
                return None
            return entry.value

    def get_entry(self, session_id: str, key: str) -> Optional[MemoryEntry]:
        """Retrieves the full MemoryEntry (including metadata and expiry) by key."""
        with self._lock:
            if session_id not in self._storage:
                return None
            entry = self._storage[session_id].get(key)
            if entry is None:
                return None
            if entry.is_expired():
                del self._storage[session_id][key]
                return None
            return entry

    def delete(self, session_id: str, key: str) -> None:
        """Deletes a key from a session's storage room."""
        with self._lock:
            if session_id in self._storage and key in self._storage[session_id]:
                del self._storage[session_id][key]

    def clear_session(self, session_id: str) -> None:
        """Purges all memory entries for a specific session."""
        with self._lock:
            if session_id in self._storage:
                del self._storage[session_id]

    def cleanup_expired(self) -> None:
        """Performs a scan and removes all expired entries across all sessions."""
        with self._lock:
            now = time.time()
            for session_id in list(self._storage.keys()):
                session_dict = self._storage[session_id]
                for key in list(session_dict.keys()):
                    entry = session_dict[key]
                    if entry.expires_at is not None and now > entry.expires_at:
                        del session_dict[key]
                if not session_dict:
                    del self._storage[session_id]
