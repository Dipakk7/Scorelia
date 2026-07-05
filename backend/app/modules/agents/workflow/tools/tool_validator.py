# app/modules/agents/workflow/tools/tool_validator.py

from typing import Dict, Any
from app.modules.agents.workflow.tools.tool_models import ToolMetadata


class ToolValidator:
    """Validator class ensuring inputs provided to tools match their schemas."""

    @staticmethod
    def validate(tool: ToolMetadata, arguments: Dict[str, Any]) -> None:
        """Validates input arguments against the tool metadata parameters."""
        for param in tool.parameters:
            name = param.name
            val = arguments.get(name)

            if val is None:
                if param.required:
                    raise ValueError(f"Missing required parameter: '{name}' for tool '{tool.name}'")
                continue

            # Basic type validation
            ptype = param.type.lower()
            if ptype == "string" and not isinstance(val, str):
                raise TypeError(f"Parameter '{name}' must be a string, got {type(val).__name__}")
            elif ptype == "integer" and not isinstance(val, int):
                raise TypeError(f"Parameter '{name}' must be an integer, got {type(val).__name__}")
            elif ptype == "number" and not isinstance(val, (int, float)):
                raise TypeError(f"Parameter '{name}' must be a number, got {type(val).__name__}")
            elif ptype == "boolean" and not isinstance(val, bool):
                raise TypeError(f"Parameter '{name}' must be a boolean, got {type(val).__name__}")
            elif ptype == "array" and not isinstance(val, list):
                raise TypeError(f"Parameter '{name}' must be an array (list), got {type(val).__name__}")
            elif ptype == "object" and not isinstance(val, dict):
                raise TypeError(f"Parameter '{name}' must be an object (dict), got {type(val).__name__}")
