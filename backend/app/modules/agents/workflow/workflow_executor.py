# app/modules/agents/workflow/workflow_executor.py

import asyncio
import time
from typing import Dict, Any, List
import structlog

from app.modules.agents.workflow.workflow_models import Workflow, WorkflowStep
from app.modules.agents.workflow.tools.tool_models import ToolExecutionRequest
from app.modules.agents.workflow.tools.tool_executor import ToolExecutor
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.context import AgentContext
from app.modules.agents.workflow.memory.memory_manager import MemoryManager

logger = structlog.get_logger()


class WorkflowExecutor:
    """Executes workflows using sequential, parallel, or dependency-graph execution loops."""

    def __init__(
        self,
        agent_registry: AgentRegistry,
        tool_executor: ToolExecutor,
        memory_manager: MemoryManager
    ):
        self.agent_registry = agent_registry
        self.tool_executor = tool_executor
        self.memory_manager = memory_manager
        self._cancelled_workflows: Dict[str, bool] = {}

    def cancel_workflow(self, workflow_id: str) -> None:
        """Flags a workflow ID for cancellation."""
        self._cancelled_workflows[workflow_id] = True

    def is_cancelled(self, workflow_id: str) -> bool:
        """Checks if a workflow ID has been flagged for cancellation."""
        return self._cancelled_workflows.get(workflow_id, False)

    async def execute(self, workflow: Workflow, context: Dict[str, Any]) -> Workflow:
        """Executes the workflow graph. Triggers Saga-style rollback on failure."""
        start_time = time.perf_counter()
        workflow.status = "running"
        workflow_id = workflow.workflow_id
        session_id = context.get("session_id") or f"wf_{workflow_id}"
        user_id = context.get("user_id") or "anonymous_user"


        logger.info(
            "workflow_execution_started",
            workflow_id=workflow_id,
            session_id=session_id,
            mode=workflow.execution_mode
        )

        # Sync workflow variables to Workflow Memory Space
        for k, v in workflow.variables.items():
            self.memory_manager.set_workflow_var(session_id, workflow_id, k, v)

        # Add initial context to memory manager
        self.memory_manager.merge_context(session_id, workflow.variables)

        completed_steps: List[WorkflowStep] = []
        execution_error = None

        try:
            if workflow.execution_mode == "sequential":
                for step in workflow.steps:
                    if self.is_cancelled(workflow_id):
                        step.status = "cancelled"
                        continue

                    # Execute sequential step
                    await self._execute_step(step, workflow, session_id, user_id)
                    if step.status == "completed":
                        completed_steps.append(step)
                    elif step.status == "failed":
                        execution_error = step.error
                        raise RuntimeError(f"Step '{step.name}' failed: {step.error}")

            elif workflow.execution_mode == "parallel":
                # Execute all steps in parallel concurrently
                tasks = [
                    self._execute_step(step, workflow, session_id, user_id)
                    for step in workflow.steps
                ]
                await asyncio.gather(*tasks)

                for step in workflow.steps:
                    if step.status == "completed":
                        completed_steps.append(step)
                    elif step.status == "failed":
                        execution_error = step.error

                if execution_error:
                    raise RuntimeError(f"One or more parallel steps failed: {execution_error}")

            else:  # Graph Mode (DAG dependent execution)
                steps_by_id = {s.step_id: s for s in workflow.steps}
                pending_ids = set(steps_by_id.keys())
                running_tasks: Dict[str, asyncio.Task] = {}

                while pending_ids or running_tasks:
                    if self.is_cancelled(workflow_id):
                        for step_id in pending_ids:
                            steps_by_id[step_id].status = "cancelled"
                        break

                    # Start tasks whose dependencies are fully completed
                    to_start = []
                    for sid in list(pending_ids):
                        step = steps_by_id[sid]
                        deps = step.depends_on
                        if all(
                            dep in steps_by_id and steps_by_id[dep].status == "completed"
                            for dep in deps
                        ):
                            to_start.append(sid)

                    for sid in to_start:
                        pending_ids.remove(sid)
                        step = steps_by_id[sid]
                        task = asyncio.create_task(
                            self._execute_step(step, workflow, session_id, user_id)
                        )
                        running_tasks[sid] = task

                    if not running_tasks:
                        # Deadlock or finished
                        break

                    # Wait for at least one task to complete
                    done, _ = await asyncio.wait(
                        running_tasks.values(),
                        return_when=asyncio.FIRST_COMPLETED
                    )

                    for task in done:
                        # Find the matching step ID
                        finished_sid = None
                        for sid, t in running_tasks.items():
                            if t == task:
                                finished_sid = sid
                                break
                        
                        if finished_sid:
                            del running_tasks[finished_sid]
                            step = steps_by_id[finished_sid]
                            if step.status == "completed":
                                completed_steps.append(step)
                            elif step.status == "failed":
                                execution_error = step.error
                                # Cancel other running tasks
                                for t in running_tasks.values():
                                    t.cancel()
                                raise RuntimeError(f"Step '{step.name}' failed: {step.error}")

            if self.is_cancelled(workflow_id):
                workflow.status = "cancelled"
            else:
                workflow.status = "completed"

        except Exception as e:
            workflow.status = "failed"
            logger.error("workflow_execution_failed", workflow_id=workflow_id, error=str(e))
            # Saga Compensation Rollback
            await self._rollback_workflow(completed_steps, session_id, user_id)

        # Wrap up execution telemetry
        workflow.completed_at = time.time()
        duration_ms = (time.perf_counter() - start_time) * 1000
        workflow.execution_time_ms = duration_ms

        # Compliance logging (no results, variables, or prompts)
        logger.info(
            "workflow_execution_finished",
            workflow_id=workflow_id,
            status=workflow.status,
            execution_time_ms=duration_ms
        )

        return workflow

    async def _execute_step(
        self,
        step: WorkflowStep,
        workflow: Workflow,
        session_id: str,
        user_id: str
    ) -> None:
        step.status = "running"
        workflow_id = workflow.workflow_id

        # 1. Condition evaluation
        if step.condition:
            cond_val = self.memory_manager.get_context_var(session_id, step.condition)
            if not cond_val:
                step.status = "skipped"
                logger.info(
                    "workflow_step_skipped",
                    workflow_id=workflow_id,
                    step_id=step.step_id,
                    condition=step.condition
                )
                return

        # 2. Input mappings propagation
        step_args = step.arguments.copy()
        for src_var, target_arg in step.input_mapping.items():
            val = self.memory_manager.get_context_var(session_id, src_var)
            if val is not None:
                step_args[target_arg] = val

        # 3. Execution wrapper with retries and timeout
        attempt = 0
        success = False
        output = None
        error_msg = ""

        while attempt <= step.max_retries and not success:
            attempt += 1
            step.retry_count = attempt - 1
            try:
                if step.type == "agent":
                    try:
                        agent = self.agent_registry.get(step.target)
                    except Exception:
                        raise ValueError(f"Agent '{step.target}' not found in registry.")


                    # Propagate shared memory context
                    shared_vars = self.memory_manager.get_context(session_id)
                    shared_vars.update(step_args)

                    agent_context = AgentContext(
                        user_id=user_id,
                        session_id=session_id,
                        request_id=f"wf_step_{workflow_id}_{step.step_id}",
                        conversation_id=session_id,
                        current_task=step.name,
                        shared_variables=shared_vars
                    )

                    # Execute with potential timeout
                    if step.timeout:
                        res = await asyncio.wait_for(agent.execute(agent_context), timeout=step.timeout)
                    else:
                        res = await agent.execute(agent_context)

                    if res.status == "success":
                        success = True
                        output = res.output
                    else:
                        error_msg = "; ".join(res.errors) or "Agent execution failed"
                
                elif step.type == "tool":
                    req = ToolExecutionRequest(
                        tool_name=step.target,
                        arguments=step_args,
                        session_id=session_id,
                        user_id=user_id
                    )
                    context_dict = {
                        "workflow_id": workflow_id,
                        "session_id": session_id,
                        "user_id": user_id,
                        "agent_id": f"wf_step_{step.step_id}",
                        "ai_service": context_dict_ai() if hasattr(self, '_ai_service') else None,
                        "rag_orchestrator": context_dict_rag() if hasattr(self, '_rag_orchestrator') else None
                    }
                    if step.timeout:
                        res = await asyncio.wait_for(
                            self.tool_executor.execute_tool(req, context_dict),
                            timeout=step.timeout
                        )
                    else:
                        res = await self.tool_executor.execute_tool(req, context_dict)

                    if res.success:
                        success = True
                        output = res.output
                    else:
                        error_msg = res.error or "Tool execution failed"

            except asyncio.TimeoutError:
                error_msg = f"Step timed out after {step.timeout}s"
            except Exception as e:
                error_msg = str(e)

            if not success and attempt <= step.max_retries:
                # Exponential backoff before retry
                await asyncio.sleep(0.5 * attempt)

        # 4. State resolution & output mapping
        if success:
            step.status = "completed"
            # Propagate output mappings
            if output and isinstance(output, dict):
                for out_key, dest_var in step.output_mapping.items():
                    if out_key in output:
                        self.memory_manager.set_context_var(session_id, dest_var, output[out_key])
                
                # Merge full output into context
                self.memory_manager.merge_context(session_id, output)
        else:
            step.status = "failed"
            step.error = error_msg

    async def _rollback_workflow(self, completed_steps: List[WorkflowStep], session_id: str, user_id: str) -> None:
        """Saga Compensation Pattern: roll back completed steps in reverse order."""
        logger.info("saga_rollback_started", count=len(completed_steps))
        for step in reversed(completed_steps):
            if step.rollback_target:
                logger.info("executing_compensation_step", step=step.name, target=step.rollback_target)
                try:
                    if step.type == "agent":
                        try:
                            agent = self.agent_registry.get(step.rollback_target)
                        except Exception:
                            agent = None
                        if agent:

                            ctx = AgentContext(
                                user_id=user_id,
                                session_id=session_id,
                                request_id=f"rollback_{step.step_id}",
                                conversation_id=session_id,
                                current_task=f"Rollback {step.name}",
                                shared_variables=step.rollback_arguments
                            )
                            await agent.execute(ctx)
                    elif step.type == "tool":
                        req = ToolExecutionRequest(
                            tool_name=step.rollback_target,
                            arguments=step.rollback_arguments,
                            session_id=session_id,
                            user_id=user_id
                        )
                        await self.tool_executor.execute_tool(req, {"session_id": session_id, "user_id": user_id})
                    step.status = "rolled_back"
                except Exception as ex:
                    logger.error("compensation_step_failed", step=step.name, error=str(ex))


# Mock/context utilities to prevent dynamic dependency reference failures
def context_dict_ai():
    from app.modules.agents.dependencies import get_ai_service
    try:
        return get_ai_service()
    except Exception:
        return None

def context_dict_rag():
    from app.modules.rag.dependencies import get_rag_orchestrator
    try:
        return get_rag_orchestrator()
    except Exception:
        return None
