# app/modules/agents/workflow/tools/tool_models.py

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class ToolParameter(BaseModel):
    """Schema for a tool parameter."""
    name: str
    type: str  # "string", "number", "boolean", "array", "object"
    description: str
    required: bool = True
    default: Optional[Any] = None


class ToolMetadata(BaseModel):
    """Metadata describing a registered tool and its capabilities."""
    name: str
    description: str
    parameters: List[ToolParameter] = Field(default_factory=list)


class ToolExecutionRequest(BaseModel):
    """Payload for invoking a tool directly."""
    tool_name: str
    arguments: Dict[str, Any] = Field(default_factory=dict)
    session_id: Optional[str] = None
    user_id: Optional[str] = None


class ToolExecutionResponse(BaseModel):
    """Result of running a tool."""
    tool_name: str
    success: bool
    output: Optional[Any] = None
    error: Optional[str] = None
    execution_time_ms: float = 0.0
