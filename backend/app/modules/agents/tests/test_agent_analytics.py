# app/modules/agents/tests/test_agent_analytics.py

import pytest
import uuid
import asyncio
import time
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus, AgentConfig
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.workflow.workflow_models import Workflow, WorkflowStep
from app.modules.agents.workflow.tools.tool_models import ToolMetadata, ToolParameter, ToolExecutionRequest
from app.modules.agents.dependencies import (
    get_agent_registry,
    get_analytics_service,
    get_tool_registry,
    get_tool_executor,
    get_workflow_engine,
    get_memory_manager
)
from app.modules.agents.analytics.service import AgentAnalyticsService
from app.modules.agents.analytics.metrics import AgentExecutionRecord, ToolExecutionRecord

# Mock user for authentication override
MOCK_USER_ID = uuid.uuid4()
mock_user = User(
    id=MOCK_USER_ID,
    email="analytics_test@careerpilot.com",
    full_name="Analytics Test User",
    hashed_password="somehashpassword"
)


@pytest.fixture
def client():
    app.dependency_overrides[get_current_user] = lambda: mock_user
    yield TestClient(app)
    app.dependency_overrides.clear()


class DummyTestAgent(BaseAgent):
    """Simple agent subclass for analytics testing."""
    async def execute(self, context: AgentContext) -> AgentResponse:
        if context.shared_variables.get("should_fail", False):
            return AgentResponse(
                agent_id=self.agent_id,
                status="failed",
                output={"error": "Intended failure"},
                errors=["Intended failure"],
                execution_time_ms=0.0
            )
        
        # Simulate delegation if target specified
        delegate_to = context.shared_variables.get("delegate_to")
        if delegate_to:
            sub_ctx = context.clone_with(current_task="delegated_task", shared_variables={"bypass_cache": True})
            sub_ctx.shared_variables.pop("delegate_to", None)
            res = await self.delegate(delegate_to, sub_ctx)
            return res

        # Simulate tool usage
        use_tool = context.shared_variables.get("use_tool")
        if use_tool:
            await self.call_tool(use_tool, {"arg": "value"}, context.session_id, context.user_id)

        # Simulate latency
        delay = context.shared_variables.get("delay", 0.0)
        if delay > 0:
            await asyncio.sleep(delay)

        return AgentResponse(
            agent_id=self.agent_id,
            status="success",
            output={"result": "success_value"},
            execution_time_ms=0.0
        )

    async def validate(self, context: AgentContext) -> bool:
        return True

    async def health(self) -> AgentHealthStatus:
        return AgentHealthStatus(
            agent_id=self.agent_id,
            name=self.name,
            status="healthy"
        )


@pytest.mark.anyio
async def test_agent_analytics_engine():
    # 1. Instantiate registries & service
    reg = AgentRegistry()
    mem = get_memory_manager()
    analytics = AgentAnalyticsService(agent_registry=reg, memory_manager=mem)
    analytics.registry.agent_records.clear()
    
    # 2. Register dummy agents
    agent_a = DummyTestAgent(agent_id="test_agent_a", name="Agent A", description="Test", supported_tasks=["task_a"], required_tools=[])
    agent_b = DummyTestAgent(agent_id="test_agent_b", name="Agent B", description="Test", supported_tasks=["task_b"], required_tools=[])
    
    reg.register(agent_a)
    reg.register(agent_b)
    
    # Verify they were wrapped
    assert hasattr(agent_a, "original_execute")
    assert hasattr(agent_b, "original_execute")

    # 3. Execute Agent A successfully
    ctx_success = AgentContext(
        user_id="user_123",
        session_id="sess_123",
        request_id="req_123",
        current_task="task_a",
        shared_variables={"bypass_cache": True}
    )
    res = await agent_a.execute(ctx_success)
    assert res.status == "success"
    
    # Check that a record was added
    assert len(analytics.registry.agent_records) == 1
    rec = analytics.registry.agent_records[0]
    assert rec.agent_id == "test_agent_a"
    assert rec.status == "success"
    
    # 4. Execute Agent B causing failure
    ctx_fail = AgentContext(
        user_id="user_123",
        session_id="sess_123",
        request_id="req_124",
        current_task="task_b",
        shared_variables={"should_fail": True, "bypass_cache": True}
    )
    res_fail = await agent_b.execute(ctx_fail)
    assert res_fail.status == "failed"
    
    # Check stats aggregations
    agent_stats = analytics.get_agents_metrics()
    assert "test_agent_a" in agent_stats
    assert "test_agent_b" in agent_stats
    
    assert agent_stats["test_agent_a"].execution_count == 1
    assert agent_stats["test_agent_a"].success_count == 1
    assert agent_stats["test_agent_a"].success_rate == 1.0
    
    assert agent_stats["test_agent_b"].execution_count == 1
    assert agent_stats["test_agent_b"].failure_count == 1
    assert agent_stats["test_agent_b"].failure_rate == 1.0


@pytest.mark.anyio
async def test_agent_delegation_and_collaboration():
    reg = AgentRegistry()
    mem = get_memory_manager()
    analytics = AgentAnalyticsService(agent_registry=reg, memory_manager=mem)
    analytics.registry.agent_records.clear()
    analytics.registry.delegation_stats.clear()
    
    agent_a = DummyTestAgent(agent_id="test_agent_a", name="Agent A", description="Test", supported_tasks=["task_a"], required_tools=[], agent_registry=reg)
    agent_b = DummyTestAgent(agent_id="test_agent_b", name="Agent B", description="Test", supported_tasks=["delegated_task"], required_tools=[], agent_registry=reg)
    
    reg.register(agent_a)
    reg.register(agent_b)
    
    # Run delegation from A to B
    ctx = AgentContext(
        user_id="user_123",
        session_id="sess_123",
        request_id="req_delegation",
        current_task="task_a",
        shared_variables={"delegate_to": "test_agent_b", "bypass_cache": True}
    )
    res = await agent_a.execute(ctx)
    assert res.status == "success"
    
    # Verify delegation was recorded
    assert analytics.registry.delegation_stats["test_agent_a"]["test_agent_b"] == 1
    
    collab = analytics.get_collaboration_metrics()
    assert len(collab.edges) == 1
    assert collab.edges[0].source == "test_agent_a"
    assert collab.edges[0].target == "test_agent_b"
    assert collab.edges[0].type == "delegation"


@pytest.mark.anyio
async def test_performance_caching_and_coalescing():
    reg = AgentRegistry()
    mem = get_memory_manager()
    analytics = AgentAnalyticsService(agent_registry=reg, memory_manager=mem)
    analytics.registry.clear_caches()
    analytics.registry.agent_records.clear()
    analytics.registry.duplicate_executions_prevented = 0
    
    agent_a = DummyTestAgent(agent_id="test_agent_a", name="Agent A", description="Test", supported_tasks=["task_a"], required_tools=[])
    reg.register(agent_a)
    
    ctx = AgentContext(
        user_id="user_123",
        session_id="sess_123",
        request_id="req_cache",
        current_task="task_a",
        shared_variables={"delay": 0.05}  # brief delay to test coalescing
    )
    
    # 1. Execute twice concurrently to trigger Singleflight/Coalescing
    start = time.perf_counter()
    res1, res2 = await asyncio.gather(
        agent_a.execute(ctx),
        agent_a.execute(ctx)
    )
    elapsed = time.perf_counter() - start
    
    assert res1.status == "success"
    assert res2.status == "success"
    
    # Assert execution was coalesced
    assert analytics.registry.duplicate_executions_prevented >= 1
    
    # 2. Execute again (should hit cache instantly)
    start_cache = time.perf_counter()
    res3 = await agent_a.execute(ctx)
    elapsed_cache = time.perf_counter() - start_cache
    
    assert res3.status == "success"
    assert elapsed_cache < elapsed
    assert analytics.registry.agent_cache_hits >= 1


@pytest.mark.anyio
async def test_tool_cache_and_caching():
    tool_reg = get_tool_registry()
    tool_exec = get_tool_executor()
    analytics = get_analytics_service()
    analytics.registry.clear_caches()
    
    # Register test tool
    test_meta = ToolMetadata(
        name="test_analytics_tool",
        description="Helper for testing tools caching",
        parameters=[]
    )
    
    exec_count = 0
    async def mock_tool_call(args, ctx):
        nonlocal exec_count
        exec_count += 1
        return {"exec_count": exec_count}

    tool_reg.register(test_meta, mock_tool_call)
    
    req = ToolExecutionRequest(
        tool_name="test_analytics_tool",
        arguments={},
        session_id="sess_tool_cache"
    )
    
    # Call 1: Fresh execution
    res1 = await tool_exec.execute_tool(req, {"session_id": "sess_tool_cache"})
    assert res1.success is True
    assert res1.output["exec_count"] == 1
    
    # Call 2: Cached execution (exec_count shouldn't increment)
    res2 = await tool_exec.execute_tool(req, {"session_id": "sess_tool_cache"})
    assert res2.success is True
    assert res2.output["exec_count"] == 1
    
    assert analytics.registry.tool_cache_hits >= 1


@pytest.mark.anyio
async def test_workflow_telemetry_tracking():
    wf_engine = get_workflow_engine()
    analytics = get_analytics_service()
    analytics.registry.workflow_records.clear()
    
    # Construct a simple dummy workflow
    step = WorkflowStep(
        step_id="step_1",
        name="Step One",
        type="tool",
        target="test_analytics_tool",
        arguments={}
    )
    
    wf = Workflow(
        workflow_id="wf_test_telemetry_123",
        name="Test Workflow",
        execution_mode="sequential",
        steps=[step],
        variables={}
    )
    
    res_wf = await wf_engine.execute_workflow(wf, {"session_id": "sess_wf"})
    assert res_wf.status == "completed"
    
    # Check workflow telemetry record
    assert len(analytics.registry.workflow_records) == 1
    wf_rec = analytics.registry.workflow_records[0]
    assert wf_rec.workflow_id == "wf_test_telemetry_123"
    assert wf_rec.status == "completed"
    assert len(wf_rec.steps) == 1
    assert wf_rec.steps[0].status == "completed"


def test_analytics_endpoints_api(client):
    # Retrieve system analytics summary
    resp = client.get("/api/v1/agents/analytics")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert "total_agent_executions" in data
    assert "total_workflow_executions" in data

    # Retrieve agents execution analytics
    resp = client.get("/api/v1/agents/analytics/agents")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert isinstance(data, dict)

    # Retrieve workflows metrics
    resp = client.get("/api/v1/agents/analytics/workflows")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert isinstance(data, list)

    # Retrieve tools execution stats
    resp = client.get("/api/v1/agents/analytics/tools")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert isinstance(data, dict)

    # Retrieve performance cache details
    resp = client.get("/api/v1/agents/analytics/performance")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert "agent_cache_hits" in data
    assert "tool_cache_hits" in data

    # Retrieve diagnostics and health check
    resp = client.get("/api/v1/agents/analytics/health")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert data["status"] == "healthy"
    assert "uptime_seconds" in data

    # Trigger proactive memory cleanup scan
    resp = client.post("/api/v1/agents/analytics/cleanup")
    assert resp.status_code == status.HTTP_200_OK
    data = resp.json()
    assert data["status"] == "success"
