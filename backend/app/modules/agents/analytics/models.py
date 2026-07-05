# app/modules/agents/analytics/models.py

from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class AgentExecutionStats(BaseModel):
    """Detailed analytics for a single agent."""
    agent_id: str
    name: str
    execution_count: int = Field(0, description="Total number of executions")
    success_count: int = Field(0, description="Successful executions")
    failure_count: int = Field(0, description="Failed executions")
    success_rate: float = Field(0.0, description="Ratio of successful to total executions")
    failure_rate: float = Field(0.0, description="Ratio of failed to total executions")
    avg_latency_ms: float = Field(0.0, description="Average execution latency in milliseconds")
    total_prompt_tokens: int = Field(0, description="Total input tokens consumed")
    total_completion_tokens: int = Field(0, description="Total output tokens generated")
    total_tokens: int = Field(0, description="Total tokens consumed")
    tool_usage: Dict[str, int] = Field(default_factory=dict, description="Count of tools executed by this agent")
    delegation_count: int = Field(0, description="Number of times this agent delegated tasks")
    retry_count: int = Field(0, description="Number of retries triggered during agent execution")
    timeout_count: int = Field(0, description="Number of times agent execution timed out")


class WorkflowStepStats(BaseModel):
    """Execution statistics for a workflow step."""
    step_id: str
    name: str
    step_type: str  # "agent" or "tool"
    target: str
    status: str
    execution_time_ms: float = 0.0
    retry_count: int = 0
    error: Optional[str] = None


class WorkflowExecutionStats(BaseModel):
    """Detailed analytics for workflows."""
    workflow_id: str
    name: str
    status: str
    execution_mode: str  # "sequential", "parallel", "graph"
    steps: List[WorkflowStepStats] = Field(default_factory=list)
    execution_time_ms: float = 0.0
    started_at: float
    completed_at: Optional[float] = None
    rollbacks: List[str] = Field(default_factory=list, description="List of step names rolled back")
    compensation_events: List[str] = Field(default_factory=list, description="List of compensation steps run")


class ToolStats(BaseModel):
    """Detailed analytics for a single tool."""
    tool_name: str
    execution_count: int = Field(0, description="Total number of tool executions")
    success_count: int = Field(0, description="Successful executions")
    failure_count: int = Field(0, description="Failed executions")
    avg_latency_ms: float = Field(0.0, description="Average execution latency in milliseconds")


class CollaborationGraphNode(BaseModel):
    id: str
    label: str
    type: str  # "agent" or "tool"


class CollaborationGraphEdge(BaseModel):
    source: str
    target: str
    count: int = 1
    type: str  # "delegation" or "tool_call"


class CollaborationMetrics(BaseModel):
    """Collaboration statistics and communication graph representation."""
    nodes: List[CollaborationGraphNode] = Field(default_factory=list)
    edges: List[CollaborationGraphEdge] = Field(default_factory=list)
    delegation_statistics: Dict[str, Dict[str, int]] = Field(default_factory=dict, description="Source -> Target -> Count")
    shared_memory_namespaces_count: int = Field(0, description="Active session namespaces in shared memory")
    shared_memory_variables_count: int = Field(0, description="Total number of variables across all namespaces")
    workflow_complexity_scores: Dict[str, float] = Field(default_factory=dict, description="Workflow ID/Name -> Complexity Score")
    most_used_agents: List[str] = Field(default_factory=list)
    least_used_agents: List[str] = Field(default_factory=list)
    most_used_tools: List[str] = Field(default_factory=list)
    least_used_tools: List[str] = Field(default_factory=list)


class PerformanceStats(BaseModel):
    """Telemetry detailing caching and execution optimizations."""
    agent_cache_hits: int = 0
    agent_cache_misses: int = 0
    agent_cache_size: int = 0
    tool_cache_hits: int = 0
    tool_cache_misses: int = 0
    tool_cache_size: int = 0
    duplicate_executions_prevented: int = 0
    active_coalescing_executions: int = 0
    batched_executions_count: int = 0
    memory_cleanups_triggered: int = 0
    memory_freed_sessions_count: int = 0


class HealthStatus(BaseModel):
    """Analytics system health and diagnostics state."""
    status: str  # "healthy" or "degraded"
    uptime_seconds: float
    registry_agents_count: int
    registry_tools_count: int
    memory_store_sessions_count: int
    last_cleanup_timestamp: Optional[datetime] = None
    startup_validated: bool = True
    configuration_validated: bool = True
    production_safety_checks_passed: bool = True
    dependency_validation_status: Dict[str, bool] = Field(default_factory=dict)
    queue_length: int = 0
    active_timeouts_count: int = 0
    memory_usage_bytes: int = 0
    diagnostics: Dict[str, Any] = Field(default_factory=dict)



class SystemAnalyticsSummary(BaseModel):
    """Unified system metrics summary."""
    total_agent_executions: int = 0
    total_workflow_executions: int = 0
    total_tool_executions: int = 0
    overall_agent_success_rate: float = 0.0
    overall_workflow_success_rate: float = 0.0
    overall_tool_success_rate: float = 0.0
    average_agent_latency_ms: float = 0.0
    average_workflow_latency_ms: float = 0.0
    total_tokens_consumed: int = 0
