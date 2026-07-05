# app/modules/agents/workflow/memory/conversation_memory.py

import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.modules.agents.workflow.memory.memory_store import MemoryStore


class ChatMessage(BaseModel):
    """Represents a single chat dialog exchange."""
    role: str  # user, assistant, system
    content: str
    timestamp: float = Field(default_factory=time.time)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ConversationMemory:
    """Manages chat histories, dialogue traces, and short-term conversation logs."""

    def __init__(self, store: MemoryStore):
        self.store = store
        self.namespace = "conversation"

    def add_message(
        self,
        session_id: str,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Appends a new ChatMessage to the history for a given conversation_id."""
        key = f"history:{conversation_id}"
        messages = self.store.get(session_id, self.namespace, key) or []
        
        # Pydantic v2 validation and serialization
        message = ChatMessage(role=role, content=content, metadata=metadata or {})
        messages.append(message)
        
        self.store.set(session_id, self.namespace, key, messages)

    def get_messages(self, session_id: str, conversation_id: str) -> List[ChatMessage]:
        """Retrieves all chat messages for a conversation_id."""
        key = f"history:{conversation_id}"
        return self.store.get(session_id, self.namespace, key) or []

    def clear_conversation(self, session_id: str, conversation_id: str) -> None:
        """Clears the history trace for a specific conversation_id."""
        key = f"history:{conversation_id}"
        self.store.delete(session_id, self.namespace, key)

    def get_all_conversations(self, session_id: str) -> Dict[str, List[ChatMessage]]:
        """Returns all active conversations and their histories for a session."""
        all_data = self.store.get_all_for_session(session_id, namespace=self.namespace)
        result = {}
        for k, v in all_data.items():
            if k.startswith("history:"):
                conv_id = k.replace("history:", "")
                result[conv_id] = v
        return result
