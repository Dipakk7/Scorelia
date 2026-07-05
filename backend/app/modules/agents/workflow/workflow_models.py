# app/modules/agents/workflow/workflow_models.py

import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class WorkflowStep(BaseModel):
    """Represents a single executable node in a workflow (an Agent execution or Tool execution)."""
    step_id: str = Field(default_factory=lambda: str(time.time_ns()))
    name: str
    type: str  # "agent" or "tool"
    target: str  # agent_id or tool_name
    arguments: Dict[str, Any] = Field(default_factory=dict)
    depends_on: List[str] = Field(default_factory=list)  # Step IDs that must execute first
    input_mapping: Dict[str, str] = Field(default_factory=dict)  # context_var -> step_arg
    output_mapping: Dict[str, str] = Field(default_factory=dict)  # step_out_key -> context_var
    condition: Optional[str] = None  # context key; runs only if context[condition] is True
    retry_count: int = 0
    max_retries: int = 3
    timeout: Optional[float] = None  # step-level timeout in seconds
    rollback_target: Optional[str] = None  # compensation agent/tool
    rollback_arguments: Dict[str, Any] = Field(default_factory=dict)
    status: str = "pending"  # pending, running, completed, failed, skipped, rolled_back, cancelled
    error: Optional[str] = None


class Workflow(BaseModel):
    """Definition and active state container of a workflow execution graph."""
    workflow_id: str = Field(default_factory=lambda: str(time.time_ns()))
    name: str
    description: str = ""
    steps: List[WorkflowStep] = Field(default_factory=list)
    execution_mode: str = "sequential"  # sequential, parallel, graph
    status: str = "pending"  # pending, running, completed, failed, cancelled
    variables: Dict[str, Any] = Field(default_factory=dict)
    created_at: float = Field(default_factory=time.time)
    completed_at: Optional[float] = None
    execution_time_ms: float = 0.0
