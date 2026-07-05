# app/modules/agents/tests/test_workflow_engine.py

import asyncio
from unittest.mock import MagicMock
import pytest

from app.modules.agents.workflow.workflow_models import Workflow, WorkflowStep
from app.modules.agents.workflow.workflow_builder import WorkflowBuilder
from app.modules.agents.workflow.workflow_validator import WorkflowValidator
from app.modules.agents.workflow.workflow_executor import WorkflowExecutor
from app.modules.agents.workflow.workflow_engine import WorkflowEngine
from app.modules.agents.workflow.tools.tool_registry import ToolRegistry
from app.modules.agents.workflow.tools.tool_executor import ToolExecutor
from app.modules.agents.workflow.memory.memory_manager import MemoryManager
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.base import BaseAgent
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.context import AgentContext


class MockTestAgent(BaseAgent):
    async def execute(self, context: AgentContext) -> AgentResponse:
        task = context.current_task or ""
        if "fail" in task.lower():
            return AgentResponse(agent_id=self.agent_id, status="failed", output={}, errors=["Intentional failure"], execution_time_ms=0.0)
        if "delay" in task.lower():
            await asyncio.sleep(0.5)
        
        # Echo shared variables in output
        out = {"completed_task": task}
        out.update(context.shared_variables)
        return AgentResponse(agent_id=self.agent_id, status="success", output=out, execution_time_ms=0.0)


    async def validate(self, context: AgentContext) -> bool:
        return True

    async def health(self) -> AgentHealthStatus:
        return AgentHealthStatus(agent_id=self.agent_id, status="healthy")


@pytest.fixture
def agent_registry():
    registry = AgentRegistry()
    registry.register(MockTestAgent(agent_id="test_agent_1", name="Test Agent 1", description="", supported_tasks=[], required_tools=[]))
    registry.register(MockTestAgent(agent_id="test_agent_2", name="Test Agent 2", description="", supported_tasks=[], required_tools=[]))
    return registry


@pytest.fixture
def tool_registry():
    return ToolRegistry()


@pytest.fixture
def tool_executor(tool_registry):
    return ToolExecutor(tool_registry)


@pytest.fixture
def memory_manager():
    return MemoryManager()


@pytest.fixture
def workflow_engine(agent_registry, tool_registry, tool_executor, memory_manager):
    return WorkflowEngine(agent_registry, tool_registry, tool_executor, memory_manager)


def test_workflow_builder():
    wf = (
        WorkflowBuilder("Builder Test")
        .description("Test Description")
        .mode("parallel")
        .variables({"var1": "val1"})
        .add_agent_step("Step 1", "test_agent_1", arguments={"arg1": "val1"})
        .build()
    )
    
    assert wf.name == "Builder Test"
    assert wf.description == "Test Description"
    assert wf.execution_mode == "parallel"
    assert wf.variables == {"var1": "val1"}
    assert len(wf.steps) == 1
    assert wf.steps[0].target == "test_agent_1"


def test_workflow_validator_cycle_detection(agent_registry, tool_registry):
    # Valid workflow
    wf_valid = (
        WorkflowBuilder("Valid DAG")
        .add_agent_step("Step 1", "test_agent_1", step_id="s1")
        .add_agent_step("Step 2", "test_agent_2", step_id="s2", depends_on=["s1"])
        .build()
    )
    WorkflowValidator.validate(wf_valid, agent_registry, tool_registry)
    
    # Cyclic workflow
    wf_cyclic = (
        WorkflowBuilder("Cyclic DAG")
        .add_agent_step("Step 1", "test_agent_1", step_id="s1", depends_on=["s2"])
        .add_agent_step("Step 2", "test_agent_2", step_id="s2", depends_on=["s1"])
        .build()
    )
    with pytest.raises(ValueError, match="Cyclic dependencies detected"):
        WorkflowValidator.validate(wf_cyclic, agent_registry, tool_registry)


@pytest.mark.anyio
async def test_sequential_workflow_execution(workflow_engine):
    wf = (
        WorkflowBuilder("Seq WF")
        .mode("sequential")
        .variables({"input_val": "hello"})
        .add_agent_step("Step 1", "test_agent_1", output_mapping={"completed_task": "task_1_out"})
        .add_agent_step("Step 2", "test_agent_2", input_mapping={"task_1_out": "prev_out"})
        .build()
    )
    
    result = await workflow_engine.execute_workflow(wf, {})
    assert result.status == "completed"
    assert len(result.steps) == 2
    assert result.steps[0].status == "completed"
    assert result.steps[1].status == "completed"
    
    # Check outputs mapped
    ctx = workflow_engine.memory_manager.get_context(f"wf_{wf.workflow_id}")
    assert ctx.get("task_1_out") == "Step 1"
    assert ctx.get("prev_out") == "Step 1"



@pytest.mark.anyio
async def test_conditional_workflow_step(workflow_engine):
    wf = (
        WorkflowBuilder("Conditional WF")
        .mode("sequential")
        .variables({"run_step_2": False})
        .add_agent_step("Step 1", "test_agent_1")
        .add_agent_step("Step 2", "test_agent_2", condition="run_step_2")
        .build()
    )
    
    result = await workflow_engine.execute_workflow(wf, {})
    assert result.status == "completed"
    assert result.steps[0].status == "completed"
    assert result.steps[1].status == "skipped"


@pytest.mark.anyio
async def test_workflow_retry_and_timeout(workflow_engine):
    # Step failure with retry
    wf_fail = (
        WorkflowBuilder("Fail WF")
        .mode("sequential")
        .add_agent_step("Fail Step", "test_agent_1", max_retries=1)
        .build()
    )
    
    # Force failure
    wf_fail.steps[0].name = "fail_step"
    result_fail = await workflow_engine.execute_workflow(wf_fail, {})
    assert result_fail.status == "failed"
    assert result_fail.steps[0].status == "failed"
    assert result_fail.steps[0].retry_count == 1
    
    # Timeout test
    wf_timeout = (
        WorkflowBuilder("Timeout WF")
        .mode("sequential")
        .add_agent_step("Delay Step", "test_agent_1", timeout=0.1, max_retries=0)
        .build()
    )
    wf_timeout.steps[0].name = "delay_step"
    result_timeout = await workflow_engine.execute_workflow(wf_timeout, {})
    assert result_timeout.status == "failed"
    assert result_timeout.steps[0].status == "failed"
    assert "timed out" in result_timeout.steps[0].error.lower()


@pytest.mark.anyio
async def test_saga_compensation_rollback(workflow_engine):
    wf = (
        WorkflowBuilder("Saga WF")
        .mode("sequential")
        .add_agent_step(
            "Step 1", 
            "test_agent_1", 
            rollback_target="test_agent_1", 
            rollback_arguments={"action": "revert_step_1"}
        )
        .add_agent_step("Fail Step", "test_agent_2", max_retries=0)
        .build()
    )
    wf.steps[1].name = "fail_step"
    
    result = await workflow_engine.execute_workflow(wf, {})
    assert result.status == "failed"
    assert result.steps[0].status == "rolled_back"
    assert result.steps[1].status == "failed"
