# app/modules/agents/workflow/workflow_validator.py

from typing import List, Dict, Set
from app.modules.agents.workflow.workflow_models import Workflow
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.workflow.tools.tool_registry import ToolRegistry


class WorkflowValidator:
    """Performs static checks on workflows to detect cycles and unresolvable targets."""

    @staticmethod
    def validate(workflow: Workflow, agent_registry: AgentRegistry, tool_registry: ToolRegistry) -> None:
        """Validates that all steps have registered targets and contains no dependency cycles."""
        if not workflow.steps:
            raise ValueError("Workflow must contain at least one step.")

        # 1. Target verification
        step_ids = set()
        for step in workflow.steps:
            if not step.step_id:
                raise ValueError(f"Step '{step.name}' is missing a step_id.")
            if step.step_id in step_ids:
                raise ValueError(f"Duplicate step ID detected: '{step.step_id}'")
            step_ids.add(step.step_id)

            if step.type == "agent":
                try:
                    agent_registry.get(step.target)
                except Exception:
                    raise ValueError(f"Agent '{step.target}' not found in registry (Step: '{step.name}').")

            elif step.type == "tool":
                if not tool_registry.get_tool(step.target):
                    raise ValueError(f"Tool '{step.target}' not found in registry (Step: '{step.name}').")
            else:
                raise ValueError(f"Unsupported step execution type '{step.type}' (Step: '{step.name}').")

        # 2. Cycle & non-existent dependency check
        steps_by_id = {s.step_id: s for s in workflow.steps}
        adj: Dict[str, List[str]] = {s.step_id: [] for s in workflow.steps}

        for step in workflow.steps:
            for dep in step.depends_on:
                if dep not in steps_by_id:
                    raise ValueError(f"Step '{step.name}' depends on non-existent step ID '{dep}'.")
                # Directed edge: dependency -> step (dependency must complete before step starts)
                adj[dep].append(step.step_id)

        visited: Set[str] = set()
        rec_stack: Set[str] = set()

        def has_cycle(node: str) -> bool:
            visited.add(node)
            rec_stack.add(node)
            for neighbor in adj[node]:
                if neighbor not in visited:
                    if has_cycle(neighbor):
                        return True
                elif neighbor in rec_stack:
                    return True
            rec_stack.remove(node)
            return False

        for node in adj:
            if node not in visited:
                if has_cycle(node):
                    raise ValueError("Cyclic dependencies detected in workflow steps.")
