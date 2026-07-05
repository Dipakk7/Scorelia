# app/modules/agents/workflow/memory/memory_manager.py

from typing import Dict, Any, List, Optional
from app.modules.agents.workflow.memory.memory_store import MemoryStore
from app.modules.agents.workflow.memory.session_memory import SessionMemory
from app.modules.agents.workflow.memory.conversation_memory import ConversationMemory, ChatMessage
from app.modules.agents.workflow.memory.context_memory import ContextMemory


class MemoryManager:
    """Unified entry point and orchestrator for all agentic memory spaces."""

    def __init__(self, store: Optional[MemoryStore] = None):
        self.store = store or MemoryStore()
        self.sessions = SessionMemory(self.store)
        self.conversations = ConversationMemory(self.store)
        self.context = ContextMemory(self.store)

    # Session Memory Delegation
    def set_session_var(self, session_id: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        self.sessions.set_var(session_id, key, value, ttl=ttl)

    def get_session_var(self, session_id: str, key: str) -> Optional[Any]:
        return self.sessions.get_var(session_id, key)

    def get_session_memory(self, session_id: str) -> Dict[str, Any]:
        return self.sessions.get_all(session_id)

    # Conversation Memory Delegation
    def add_conversation_message(
        self,
        session_id: str,
        conversation_id: str,
        role: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        self.conversations.add_message(session_id, conversation_id, role, content, metadata=metadata)

    def get_conversation_history(self, session_id: str, conversation_id: str) -> List[ChatMessage]:
        return self.conversations.get_messages(session_id, conversation_id)

    def get_all_conversations(self, session_id: str) -> Dict[str, List[ChatMessage]]:
        return self.conversations.get_all_conversations(session_id)

    # Context Memory Delegation
    def set_context_var(self, session_id: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        self.context.set_context_var(session_id, key, value, ttl=ttl)

    def get_context_var(self, session_id: str, key: str) -> Optional[Any]:
        return self.context.get_context_var(session_id, key)

    def get_context(self, session_id: str) -> Dict[str, Any]:
        return self.context.get_context(session_id)

    def merge_context(self, session_id: str, variables: Dict[str, Any], ttl: Optional[int] = None) -> None:
        self.context.merge_context(session_id, variables, ttl=ttl)

    # Agent Specific Memory
    def set_agent_var(self, session_id: str, agent_id: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Sets a variable in the agent-specific memory namespace."""
        namespace = f"agent:{agent_id}"
        self.store.set(session_id, namespace, key, value, ttl=ttl)

    def get_agent_var(self, session_id: str, agent_id: str, key: str) -> Optional[Any]:
        """Retrieves a variable from the agent-specific memory namespace."""
        namespace = f"agent:{agent_id}"
        return self.store.get(session_id, namespace, key)

    def get_agent_memory(self, session_id: str, agent_id: str) -> Dict[str, Any]:
        """Gets all variables for a specific agent's memory space."""
        namespace = f"agent:{agent_id}"
        return self.store.get_all_for_session(session_id, namespace=namespace)

    # Workflow Specific Memory
    def set_workflow_var(self, session_id: str, workflow_id: str, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Sets a variable in the workflow-specific memory namespace."""
        namespace = f"workflow:{workflow_id}"
        self.store.set(session_id, namespace, key, value, ttl=ttl)

    def get_workflow_var(self, session_id: str, workflow_id: str, key: str) -> Optional[Any]:
        """Retrieves a variable from the workflow-specific memory namespace."""
        namespace = f"workflow:{workflow_id}"
        return self.store.get(session_id, namespace, key)

    def get_workflow_memory(self, session_id: str, workflow_id: str) -> Dict[str, Any]:
        """Gets all variables stored under a workflow's namespace."""
        namespace = f"workflow:{workflow_id}"
        return self.store.get_all_for_session(session_id, namespace=namespace)

    # Management
    def clear_session(self, session_id: str) -> None:
        """Completely purges all memory namespaces for a given session."""
        self.store.clear_session(session_id)

    def cleanup_expired(self) -> None:
        """Runs a cleanup scan across all namespaces in the storage."""
        self.store.cleanup_expired()

    def get_full_status(self, session_id: str) -> Dict[str, Any]:
        """Gathers a dump of all namespace contents within a session for inspection or serialization."""
        return self.store.get_all_for_session(session_id)
