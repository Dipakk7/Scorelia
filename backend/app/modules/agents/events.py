# app/modules/agents/events.py

import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Callable, List, Union
import structlog
from pydantic import BaseModel, Field

logger = structlog.get_logger()


class AgentEvent(BaseModel):
    """Pydantic model representing an event generated during agent or orchestrator lifecycle."""
    event_id: str
    event_type: str  # "agent_started", "agent_finished", "agent_failed", "tool_called", "workflow_completed"
    agent_id: Optional[str] = None
    agent_name: Optional[str] = None
    request_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    payload: Dict[str, Any] = Field(default_factory=dict)


class AgentEventBus:
    """Pub/Sub event dispatcher for agent activities.

    Enables asynchronous event handlers to subscribe to agent lifecycle events.
    """

    def __init__(self):
        self._listeners: Dict[str, List[Callable[[AgentEvent], Any]]] = {}

    def subscribe(self, event_type: str, callback: Callable[[AgentEvent], Any]) -> None:
        """Subscribes a callback listener to a specific event type, or '*' for all event types."""
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(callback)

    def unsubscribe(self, event_type: str, callback: Callable[[AgentEvent], Any]) -> None:
        """Unsubscribes a callback listener from an event type."""
        if event_type in self._listeners and callback in self._listeners[event_type]:
            self._listeners[event_type].remove(callback)

    async def publish(self, event: AgentEvent) -> None:
        """Publishes an event to all subscribed listeners asynchronously.

        Maintains strict privacy compliance: never logs prompt content or outputs.
        """
        # Logging only metadata (privacy compliance)
        logger.info(
            "publishing_agent_event",
            event_id=event.event_id,
            event_type=event.event_type,
            agent_id=event.agent_id,
            agent_name=event.agent_name,
            request_id=event.request_id,
            timestamp=event.timestamp.isoformat()
        )

        listeners = self._listeners.get(event.event_type, []).copy()
        global_listeners = self._listeners.get("*", []).copy()

        all_listeners = listeners + global_listeners
        for listener in all_listeners:
            try:
                if asyncio.iscoroutinefunction(listener):
                    await listener(event)
                else:
                    listener(event)
            except Exception as e:
                logger.error(
                    "agent_event_listener_failed",
                    error=str(e),
                    event_type=event.event_type,
                    event_id=event.event_id
                )
