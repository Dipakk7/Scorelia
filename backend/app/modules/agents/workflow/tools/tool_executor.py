# app/modules/agents/workflow/tools/tool_executor.py

import time
from typing import Dict, Any
import structlog
from app.modules.agents.workflow.tools.tool_models import ToolExecutionRequest, ToolExecutionResponse
from app.modules.agents.workflow.tools.tool_registry import ToolRegistry
from app.modules.agents.workflow.tools.tool_validator import ToolValidator

logger = structlog.get_logger()


class ToolExecutor:
    """Orchestrates validation, timing, logging, and execution of registered tools."""

    def __init__(self, registry: ToolRegistry):
        self.registry = registry

    async def execute_tool(self, request: ToolExecutionRequest, context: Dict[str, Any]) -> ToolExecutionResponse:
        """Executes a single tool safely and records telemetry metrics."""
        start_time = time.perf_counter()
        tool_name = request.tool_name
        tool_meta = self.registry.get_tool(tool_name)
        executor_func = self.registry.get_executor(tool_name)

        if not tool_meta or not executor_func:
            duration_ms = (time.perf_counter() - start_time) * 1000
            return ToolExecutionResponse(
                tool_name=tool_name,
                success=False,
                error=f"Tool '{tool_name}' not found in registry.",
                execution_time_ms=duration_ms
            )

        try:
            # 1. Validation
            ToolValidator.validate(tool_meta, request.arguments)

            # 2. Add request contexts
            exec_context = context.copy()
            exec_context["user_id"] = request.user_id or exec_context.get("user_id")
            exec_context["session_id"] = request.session_id or exec_context.get("session_id")

            # 3. Execution
            output = await executor_func(request.arguments, exec_context)
            duration_ms = (time.perf_counter() - start_time) * 1000

            # Telemetry compliant logging
            logger.info(
                "tool_execution_completed",
                workflow_id=context.get("workflow_id"),
                tool=tool_name,
                agent=context.get("agent_id"),
                latency=duration_ms,
                execution_time_ms=duration_ms,
                status="success"
            )

            return ToolExecutionResponse(
                tool_name=tool_name,
                success=True,
                output=output,
                execution_time_ms=duration_ms
            )

        except Exception as e:
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.error(
                "tool_execution_failed",
                workflow_id=context.get("workflow_id"),
                tool=tool_name,
                agent=context.get("agent_id"),
                latency=duration_ms,
                execution_time_ms=duration_ms,
                status="failed",
                error=str(e)
            )
            return ToolExecutionResponse(
                tool_name=tool_name,
                success=False,
                error=str(e),
                execution_time_ms=duration_ms
            )
