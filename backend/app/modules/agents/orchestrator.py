# app/modules/agents/orchestrator.py

import time
import uuid
import asyncio
from typing import List, Dict, Any, Optional
import structlog

from app.modules.agents.registry import AgentRegistry
from app.modules.agents.context import AgentContext
from app.modules.agents.memory import SharedMemory
from app.modules.agents.events import AgentEvent, AgentEventBus
from app.modules.agents.models import AgentConfig, ExecutionRequest, ExecutionResponse, AgentResponse
from app.modules.agents.exceptions import OrchestrationError, AgentNotFoundError, AgentExecutionError
from app.modules.agents.workflow.workflow_executor import context_dict_ai, context_dict_rag


logger = structlog.get_logger()


class AgentOrchestrator:
    """Core workflow engine routing and orchestrating AI tasks across multiple specialized agents."""

    def __init__(
        self,
        registry: AgentRegistry,
        memory: SharedMemory,
        event_bus: AgentEventBus,
        config: AgentConfig,
        memory_manager: Optional[Any] = None,
        tool_registry: Optional[Any] = None,
        tool_executor: Optional[Any] = None,
        workflow_engine: Optional[Any] = None
    ):
        self.registry = registry
        self.memory = memory
        self.event_bus = event_bus
        self.config = config
        self.memory_manager = memory_manager
        self.tool_registry = tool_registry
        self.tool_executor = tool_executor
        self.workflow_engine = workflow_engine

    async def execute_workflow(self, workflow: Any, context: Dict[str, Any]) -> Any:
        """Executes a multi-agent workflow graph using the workflow engine."""
        if not self.workflow_engine:
            raise RuntimeError("Workflow Engine not configured in the orchestrator.")
        return await self.workflow_engine.execute_workflow(workflow, context)

    async def execute_tool(self, tool_name: str, arguments: Dict[str, Any], session_id: str, user_id: str) -> Any:
        """Invokes a registered tool dynamically using the tool execution system."""
        if not self.tool_executor:
            raise RuntimeError("Tool Executor not configured in the orchestrator.")
        from app.modules.agents.workflow.tools.tool_models import ToolExecutionRequest
        req = ToolExecutionRequest(
            tool_name=tool_name,
            arguments=arguments,
            session_id=session_id,
            user_id=user_id
        )
        return await self.tool_executor.execute_tool(req, {
            "session_id": session_id,
            "user_id": user_id,
            "ai_service": context_dict_ai() if hasattr(self, '_ai_service') else None,
            "rag_orchestrator": context_dict_rag() if hasattr(self, '_rag_orchestrator') else None
        })

    def select_agents(self, task: str) -> List[Any]:
        """Resolves active registered agents capable of executing the specified task."""

        agents = []
        for agent in self.registry.list_agents():
            if agent.enabled and task in agent.supported_tasks:
                agents.append(agent)
        return agents

    async def execute_task(self, request: ExecutionRequest) -> ExecutionResponse:
        """Coordinates execution of task routing, timeouts, retries, and events across selected agents.

        Supports sequential and parallel foundation execution modes.
        """
        start_time = time.perf_counter()
        request_id = str(uuid.uuid4())
        session_id = request.session_id or str(uuid.uuid4())
        conversation_id = request.conversation_id or str(uuid.uuid4())
        correlation_id = request.correlation_id or request_id

        # Privacy compliance logging (never log query text/arguments)
        logger.info(
            "agent_orchestrator_execution_started",
            request_id=request_id,
            session_id=session_id,
            correlation_id=correlation_id,
            task=request.task,
            execution_mode=request.execution_mode
        )

        # Create workflow-level start event
        start_event = AgentEvent(
            event_id=str(uuid.uuid4()),
            event_type="agent_started",
            request_id=request_id,
            payload={"task": request.task, "execution_mode": request.execution_mode}
        )
        await self.event_bus.publish(start_event)

        # Collect events dispatched during this request session
        collected_events: List[AgentEvent] = []

        async def capture_event(event: AgentEvent):
            if event.request_id == request_id:
                collected_events.append(event)

        self.event_bus.subscribe("*", capture_event)

        # Add initial start event manually to collection
        collected_events.append(start_event)

        # Discover matching agents
        agents = self.select_agents(request.task)
        if not agents:
            error_msg = f"No active agent registered for task: '{request.task}'"
            logger.error("orchestrator_selection_failed", request_id=request_id, correlation_id=correlation_id, task=request.task)

            fail_event = AgentEvent(
                event_id=str(uuid.uuid4()),
                event_type="agent_failed",
                request_id=request_id,
                payload={"error": error_msg}
            )
            await self.event_bus.publish(fail_event)
            self.event_bus.unsubscribe("*", capture_event)

            duration_ms = (time.perf_counter() - start_time) * 1000
            return ExecutionResponse(
                request_id=request_id,
                status="failed",
                output={"error": error_msg},
                steps=[],
                events=collected_events,
                execution_time_ms=duration_ms,
                correlation_id=correlation_id
            )

        steps: List[AgentResponse] = []
        status_str = "success"
        final_output: Dict[str, Any] = {}

        mode = request.execution_mode or "sequential"

        try:
            if mode == "parallel" and self.config.parallel_execution:
                # Parallel foundation mode (execute all selected agents concurrently)
                execution_tasks = []
                for agent in agents:
                    agent_context = AgentContext(
                        user_id=request.user_id,
                        session_id=session_id,
                        request_id=request_id,
                        conversation_id=conversation_id,
                        correlation_id=correlation_id,
                        current_task=request.task,
                        rag_context=request.input_data.get("rag_context", {}),
                        shared_variables=request.input_data.get("shared_variables", {})
                    )
                    execution_tasks.append(
                        self._execute_agent_with_retry_and_timeout(agent, agent_context)
                    )

                results = await asyncio.gather(*execution_tasks, return_exceptions=True)
                for res in results:
                    if isinstance(res, Exception):
                        status_str = "failed"
                        final_output = {"error": str(res)}
                    else:
                        steps.append(res)
                        if res.status == "failed":
                            status_str = "failed"
                        final_output.update(res.output)
            else:
                # Sequential mode (default): pass output of each agent as shared variables to the next
                current_shared = request.input_data.get("shared_variables", {}).copy()
                for agent in agents:
                    agent_context = AgentContext(
                        user_id=request.user_id,
                        session_id=session_id,
                        request_id=request_id,
                        conversation_id=conversation_id,
                        correlation_id=correlation_id,
                        current_task=request.task,
                        rag_context=request.input_data.get("rag_context", {}),
                        shared_variables=current_shared
                    )

                    res = await self._execute_agent_with_retry_and_timeout(agent, agent_context)
                    steps.append(res)

                    if res.status == "failed":
                        status_str = "failed"
                        final_output = res.output
                        break
                    
                    # Update local scratch variables
                    current_shared.update(res.output)
                    final_output.update(res.output)
        except Exception as e:
            status_str = "failed"
            final_output = {"error": f"Orchestrator routing failure: {str(e)}"}
            logger.exception("orchestrator_execution_error", request_id=request_id, correlation_id=correlation_id, error=str(e))

        # Workflow complete event
        completion_event = AgentEvent(
            event_id=str(uuid.uuid4()),
            event_type="workflow_completed",
            request_id=request_id,
            payload={"status": status_str}
        )
        await self.event_bus.publish(completion_event)

        # Remove event listener capture hook
        self.event_bus.unsubscribe("*", capture_event)

        duration_ms = (time.perf_counter() - start_time) * 1000

        # Privacy compliance logging (never log result variables, user files, or LLM contents)
        logger.info(
            "agent_orchestrator_execution_finished",
            request_id=request_id,
            correlation_id=correlation_id,
            status=status_str,
            execution_time_ms=duration_ms,
            step_count=len(steps)
        )

        return ExecutionResponse(
            request_id=request_id,
            status=status_str,
            output=final_output,
            steps=steps,
            events=collected_events,
            execution_time_ms=duration_ms,
            correlation_id=correlation_id
        )

    async def _execute_agent_with_retry_and_timeout(self, agent: Any, context: AgentContext) -> AgentResponse:
        agent_start = time.perf_counter()
        retry_limit = self.config.retry_count
        timeout = self.config.execution_timeout

        logger.info(
            "executing_agent_step",
            request_id=context.request_id,
            correlation_id=context.correlation_id,
            agent_id=agent.agent_id,
            agent_name=agent.name
        )

        # Emit tool call events for all tools this agent utilizes
        for tool in agent.required_tools:
            await self.event_bus.publish(
                AgentEvent(
                    event_id=str(uuid.uuid4()),
                    event_type="tool_called",
                    agent_id=agent.agent_id,
                    agent_name=agent.name,
                    request_id=context.request_id,
                    payload={"tool": tool}
                )
            )

        # Context validation
        try:
            valid = await agent.validate(context)
            if not valid:
                raise AgentExecutionError("Context validation failed.")
        except Exception as e:
            duration_ms = (time.perf_counter() - agent_start) * 1000
            return AgentResponse(
                agent_id=agent.agent_id,
                status="failed",
                output={"error": f"Validation failed: {str(e)}"},
                errors=[f"Validation failed: {str(e)}"],
                execution_time_ms=duration_ms
            )

        # Execution loop with retry and timeout wrapper
        context._retry_count = 0
        for attempt in range(retry_limit + 1):
            try:
                context._retry_count = attempt
                response = await asyncio.wait_for(agent.execute(context), timeout=timeout)
                return response
            except asyncio.TimeoutError:
                logger.warning(
                    "agent_execution_timeout",
                    request_id=context.request_id,
                    correlation_id=context.correlation_id,
                    agent_id=agent.agent_id,
                    attempt=attempt + 1
                )
                if attempt == retry_limit:
                    duration_ms = (time.perf_counter() - agent_start) * 1000
                    return AgentResponse(
                        agent_id=agent.agent_id,
                        status="failed",
                        output={"error": f"Agent execution timed out after {timeout}s."},
                        errors=["Execution timeout limit reached."],
                        execution_time_ms=duration_ms
                    )
            except Exception as e:
                logger.exception(
                    "agent_execution_attempt_failed",
                    request_id=context.request_id,
                    correlation_id=context.correlation_id,
                    agent_id=agent.agent_id,
                    attempt=attempt + 1,
                    error=str(e)
                )
                if attempt == retry_limit:
                    duration_ms = (time.perf_counter() - agent_start) * 1000
                    return AgentResponse(
                        agent_id=agent.agent_id,
                        status="failed",
                        output={"error": f"Execution failed: {str(e)}"},
                        errors=[str(e)],
                        execution_time_ms=duration_ms
                    )
                # Exponential backoff before retry
                await asyncio.sleep(0.5 * (attempt + 1))

        # Fallback (should not be reached)
        duration_ms = (time.perf_counter() - agent_start) * 1000
        return AgentResponse(
            agent_id=agent.agent_id,
            status="failed",
            output={"error": "Unknown execution failure."},
            errors=["Unknown execution failure."],
            execution_time_ms=duration_ms
        )

