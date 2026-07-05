# app/modules/agents/models.py

from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from app.modules.agents.events import AgentEvent


class AgentResponse(BaseModel):
    """Execution output of an individual agent execution step."""
    agent_id: str
    status: str  # "success" or "failed"
    output: Dict[str, Any] = Field(default_factory=dict)
    errors: Optional[List[str]] = None
    execution_time_ms: float


class AgentHealthStatus(BaseModel):
    """Health check outcome for an individual agent."""
    agent_id: str
    name: str
    status: str  # "healthy" or "unhealthy"
    message: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)


class AgentMetadata(BaseModel):
    """Metadata describing properties and capabilities of a registered agent."""
    agent_id: str
    name: str
    description: str
    supported_tasks: List[str]
    required_tools: List[str]
    enabled: bool = True


class ExecutionRequest(BaseModel):
    """Request payload to execute a task through the multi-agent orchestrator."""
    task: str
    user_id: str
    session_id: Optional[str] = None
    conversation_id: Optional[str] = None
    correlation_id: Optional[str] = None
    input_data: Dict[str, Any] = Field(default_factory=dict)
    execution_mode: Optional[str] = "sequential"  # "sequential" or "parallel"


class ExecutionResponse(BaseModel):
    """Response payload returned by the multi-agent orchestrator after executing a workflow."""
    request_id: str
    status: str  # "success" or "failed"
    output: Dict[str, Any] = Field(default_factory=dict)
    steps: List[AgentResponse] = Field(default_factory=list)
    events: List[AgentEvent] = Field(default_factory=list)
    execution_time_ms: float
    correlation_id: Optional[str] = None



class AgentConfig:
    """Agent Module local configurations loading dynamically from global Settings."""

    def __init__(self):
        from app.core.config import settings
        self.max_agents: int = settings.AGENT_MAX_AGENTS
        self.execution_timeout: float = settings.AGENT_EXECUTION_TIMEOUT
        self.parallel_execution: bool = settings.AGENT_PARALLEL_EXECUTION
        self.retry_count: int = settings.AGENT_RETRY_COUNT
        self.memory_ttl: int = settings.AGENT_MEMORY_TTL
        self.logging_enabled: bool = settings.AGENT_LOGGING_ENABLED
