# app/modules/agents/workflow/workflow_builder.py

from typing import Dict, Any, List, Optional
from app.modules.agents.workflow.workflow_models import Workflow, WorkflowStep


class WorkflowBuilder:
    """Helper utility for programmatically constructing and chaining Workflow topologies."""

    def __init__(self, name: str):
        self.workflow = Workflow(name=name)

    def description(self, desc: str) -> "WorkflowBuilder":
        """Sets the workflow description."""
        self.workflow.description = desc
        return self

    def mode(self, mode: str) -> "WorkflowBuilder":
        """Sets execution mode: sequential, parallel, graph."""
        self.workflow.execution_mode = mode
        return self

    def variables(self, vars_dict: Dict[str, Any]) -> "WorkflowBuilder":
        """Sets initial context variables."""
        self.workflow.variables.update(vars_dict)
        return self

    def add_agent_step(
        self,
        name: str,
        agent_id: str,
        arguments: Optional[Dict[str, Any]] = None,
        depends_on: Optional[List[str]] = None,
        input_mapping: Optional[Dict[str, str]] = None,
        output_mapping: Optional[Dict[str, str]] = None,
        condition: Optional[str] = None,
        max_retries: int = 3,
        timeout: Optional[float] = None,
        rollback_target: Optional[str] = None,
        rollback_arguments: Optional[Dict[str, Any]] = None,
        step_id: Optional[str] = None
    ) -> "WorkflowBuilder":
        """Adds an agent execution step to the workflow."""
        sid = step_id or f"step_{len(self.workflow.steps) + 1}"
        step = WorkflowStep(
            step_id=sid,
            name=name,
            type="agent",
            target=agent_id,
            arguments=arguments or {},
            depends_on=depends_on or [],
            input_mapping=input_mapping or {},
            output_mapping=output_mapping or {},
            condition=condition,
            max_retries=max_retries,
            timeout=timeout,
            rollback_target=rollback_target,
            rollback_arguments=rollback_arguments or {}
        )
        self.workflow.steps.append(step)
        return self

    def add_tool_step(
        self,
        name: str,
        tool_name: str,
        arguments: Optional[Dict[str, Any]] = None,
        depends_on: Optional[List[str]] = None,
        input_mapping: Optional[Dict[str, str]] = None,
        output_mapping: Optional[Dict[str, str]] = None,
        condition: Optional[str] = None,
        max_retries: int = 3,
        timeout: Optional[float] = None,
        rollback_target: Optional[str] = None,
        rollback_arguments: Optional[Dict[str, Any]] = None,
        step_id: Optional[str] = None
    ) -> "WorkflowBuilder":
        """Adds a tool execution step to the workflow."""
        sid = step_id or f"step_{len(self.workflow.steps) + 1}"
        step = WorkflowStep(
            step_id=sid,
            name=name,
            type="tool",
            target=tool_name,
            arguments=arguments or {},
            depends_on=depends_on or [],
            input_mapping=input_mapping or {},
            output_mapping=output_mapping or {},
            condition=condition,
            max_retries=max_retries,
            timeout=timeout,
            rollback_target=rollback_target,
            rollback_arguments=rollback_arguments or {}
        )
        self.workflow.steps.append(step)
        return self

    def build(self) -> Workflow:
        """Returns the constructed Workflow object."""
        return self.workflow
