# app/modules/agents/workflow/workflow_engine.py

from typing import Dict, Any, Optional
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.workflow.tools.tool_registry import ToolRegistry
from app.modules.agents.workflow.tools.tool_executor import ToolExecutor
from app.modules.agents.workflow.memory.memory_manager import MemoryManager
from app.modules.agents.workflow.workflow_models import Workflow
from app.modules.agents.workflow.workflow_validator import WorkflowValidator
from app.modules.agents.workflow.workflow_executor import WorkflowExecutor


class WorkflowEngine:
    """Core Multi-Agent Workflow Engine coordinating static validation and state execution."""

    def __init__(
        self,
        agent_registry: AgentRegistry,
        tool_registry: ToolRegistry,
        tool_executor: ToolExecutor,
        memory_manager: MemoryManager
    ):
        self.agent_registry = agent_registry
        self.tool_registry = tool_registry
        self.tool_executor = tool_executor
        self.memory_manager = memory_manager
        self.executor = WorkflowExecutor(
            agent_registry=self.agent_registry,
            tool_executor=self.tool_executor,
            memory_manager=self.memory_manager
        )

    async def execute_workflow(self, workflow: Workflow, context: Dict[str, Any]) -> Workflow:
        """Validates and triggers execution of a programmatic multi-agent workflow."""
        # 1. Validation
        WorkflowValidator.validate(workflow, self.agent_registry, self.tool_registry)

        # 2. Execution
        return await self.executor.execute(workflow, context)

    def cancel_workflow(self, workflow_id: str) -> None:
        """Sends a cancellation trigger request to the runner."""
        self.executor.cancel_workflow(workflow_id)
