# app/modules/agents/context.py

from typing import Dict, Any, Optional
from pydantic import BaseModel, Field


class AgentContext(BaseModel):
    """Execution context passed between agents in the multi-agent system.

    Contains user info, request/session tracking, current task, and references/snapshots of
    RAG outputs and shared memory variables.
    """
    user_id: str
    session_id: str
    request_id: str
    conversation_id: Optional[str] = None
    correlation_id: Optional[str] = None
    current_task: str
    rag_context: Dict[str, Any] = Field(default_factory=dict)
    shared_variables: Dict[str, Any] = Field(default_factory=dict)

    def clone_with(self, current_task: str, **kwargs: Any) -> "AgentContext":
        """Clones the current context with a new task and optional overrides.

        Enables passing context sequentially or conditionally between agents.
        """
        # Shallow copy dictionary fields to prevent side-effects, but preserve references
        cloned_rag = self.rag_context.copy()
        cloned_shared = self.shared_variables.copy()

        # Update copied fields if provided in kwargs
        if "rag_context" in kwargs:
            cloned_rag.update(kwargs.pop("rag_context"))
        if "shared_variables" in kwargs:
            cloned_shared.update(kwargs.pop("shared_variables"))

        # Merge with other overrides
        params = {
            "user_id": self.user_id,
            "session_id": self.session_id,
            "request_id": self.request_id,
            "conversation_id": self.conversation_id,
            "correlation_id": self.correlation_id,
            "current_task": current_task,
            "rag_context": cloned_rag,
            "shared_variables": cloned_shared,
        }
        params.update(kwargs)
        return AgentContext(**params)

