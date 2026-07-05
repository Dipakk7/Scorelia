# app/modules/agents/tests/test_agents.py

import pytest
import asyncio
import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User

from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.memory import SharedMemory, MemoryEntry
from app.modules.agents.events import AgentEvent, AgentEventBus
from app.modules.agents.factory import AgentFactory
from app.modules.agents.orchestrator import AgentOrchestrator
from app.modules.agents.models import (
    AgentConfig,
    AgentResponse,
    AgentHealthStatus,
    ExecutionRequest,
)
from app.modules.agents.exceptions import AgentNotFoundError, AgentExecutionError
from app.modules.agents.dependencies import (
    get_agent_config,
    get_agent_registry,
    get_agent_orchestrator,
    get_shared_memory,
    get_agent_event_bus,
    get_agent_factory,
)

# ---------------------------------------------------------
# Mocks & Test Instances
# ---------------------------------------------------------

mock_user = User(
    id=1,
    email="test-agent@example.com",
    is_active=True,
)


class MockTestAgent(BaseAgent):
    """A concrete implementation of BaseAgent for testing purposes."""

    async def validate(self, context: AgentContext) -> bool:
        if "invalid" in context.current_task:
            return False
        return True

    async def execute(self, context: AgentContext) -> AgentResponse:
        start = time.perf_counter()
        
        # Test case: simulate error
        if context.current_task == "fail_task":
            raise AgentExecutionError("Simulated execution failure")
            
        # Test case: simulate slow operation for timeout tests
        if context.current_task == "timeout_task":
            await asyncio.sleep(0.5)

        output = {
            "agent_executed": self.agent_id,
            "received_input": context.shared_variables.copy()
        }
        
        # Test case: modify output
        if context.current_task == "math_task":
            val = context.shared_variables.get("value", 0)
            output["result"] = val + 10

        duration = (time.perf_counter() - start) * 1000
        return AgentResponse(
            agent_id=self.agent_id,
            status="success",
            output=output,
            execution_time_ms=duration
        )

    async def health(self) -> AgentHealthStatus:
        return AgentHealthStatus(
            agent_id=self.agent_id,
            name=self.name,
            status="healthy",
            details={"load": 0.1}
        )


# ---------------------------------------------------------
# 1. BaseAgent Tests
# ---------------------------------------------------------

def test_agent_instantiation():
    agent = MockTestAgent(
        agent_id="test_agent",
        name="Test Agent",
        description="Helper Agent for testing",
        supported_tasks=["task_a"],
        required_tools=["tool_a"]
    )
    assert agent.agent_id == "test_agent"
    assert agent.name == "Test Agent"
    assert agent.description == "Helper Agent for testing"
    assert "task_a" in agent.supported_tasks
    assert "tool_a" in agent.required_tools
    assert agent.enabled is True


# ---------------------------------------------------------
# 2. Registry Tests
# ---------------------------------------------------------

def test_registry_register_and_remove():
    registry = AgentRegistry()
    agent = MockTestAgent(
        agent_id="test_agent_1",
        name="Test Agent 1",
        description="Desc 1",
        supported_tasks=["task_1"],
        required_tools=[]
    )
    
    # Register
    registry.register(agent)
    assert registry.get("test_agent_1") == agent
    
    metadata = registry.list_metadata()
    assert len(metadata) == 1
    assert metadata[0].agent_id == "test_agent_1"
    
    # Enable/Disable
    registry.disable("test_agent_1")
    assert registry.get("test_agent_1").enabled is False
    
    registry.enable("test_agent_1")
    assert registry.get("test_agent_1").enabled is True
    
    # Remove
    registry.remove("test_agent_1")
    with pytest.raises(AgentNotFoundError):
        registry.get("test_agent_1")


# ---------------------------------------------------------
# 3. Memory Tests
# ---------------------------------------------------------

def test_shared_memory_crud():
    memory = SharedMemory()
    session_id = "session_x"
    
    # Set & Get
    memory.set(session_id, "key1", "value1", metadata={"tag": "info"})
    assert memory.get(session_id, "key1") == "value1"
    
    entry = memory.get_entry(session_id, "key1")
    assert entry is not None
    assert entry.value == "value1"
    assert entry.metadata["tag"] == "info"
    
    # Expiry / TTL test (simulated by setting expires_at to the past)
    memory.set(session_id, "key_expired", "val_expired", ttl=10)
    expired_entry = memory._storage[session_id]["key_expired"]
    expired_entry.expires_at = time.time() - 1  # backdate expiration
    
    assert memory.get(session_id, "key_expired") is None  # should clean on read
    
    # Cleanup expired
    memory.set(session_id, "key_expired_2", "val_expired_2", ttl=10)
    memory._storage[session_id]["key_expired_2"].expires_at = time.time() - 1
    memory.cleanup_expired()
    assert "key_expired_2" not in memory._storage.get(session_id, {})
    
    # Delete
    memory.set(session_id, "key2", "value2")
    memory.delete(session_id, "key2")
    assert memory.get(session_id, "key2") is None
    
    # Clear Session
    memory.set(session_id, "key3", "value3")
    memory.clear_session(session_id)
    assert memory.get(session_id, "key3") is None


# ---------------------------------------------------------
# 4. Event Bus Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_event_bus_pub_sub():
    bus = AgentEventBus()
    events_received = []

    async def handler(evt: AgentEvent):
        events_received.append(evt)

    # Subscribe to specific event type
    bus.subscribe("agent_started", handler)
    
    event = AgentEvent(
        event_id="evt_1",
        event_type="agent_started",
        agent_id="test_agent",
        request_id="req_1",
        payload={"msg": "hello"}
    )
    
    await bus.publish(event)
    assert len(events_received) == 1
    assert events_received[0].event_id == "evt_1"
    
    # Wildcard subscription
    bus.subscribe("*", handler)
    event_finished = AgentEvent(
        event_id="evt_2",
        event_type="agent_finished",
        agent_id="test_agent",
        request_id="req_1"
    )
    await bus.publish(event_finished)
    
    # 2 calls: one because it fits '*' (any event type), wait, the previous handler was registered to 'agent_started' which doesn't match 'agent_finished',
    # but handler is registered twice now (once to 'agent_started', once to '*').
    # Event 'agent_finished' matches only '*' subscription. So events_received should have 1 additional event (total 2).
    assert len(events_received) == 2
    assert events_received[1].event_id == "evt_2"


# ---------------------------------------------------------
# 5. Factory Tests
# ---------------------------------------------------------

def test_agent_factory():
    config = AgentConfig()
    # Mock services are None for testing
    factory = AgentFactory(ai_service=None, rag_orchestrator=None, config=config)
    
    agent = factory.create_agent(
        agent_class=MockTestAgent,
        agent_id="factory_agent",
        name="Factory Agent",
        description="Created via factory",
        supported_tasks=["task_f"],
        required_tools=[]
    )
    
    assert agent.agent_id == "factory_agent"
    assert agent.ai_service is None
    assert agent.rag_orchestrator is None


# ---------------------------------------------------------
# 6. Orchestrator Tests
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_orchestrator_execution_success():
    registry = AgentRegistry()
    memory = SharedMemory()
    event_bus = AgentEventBus()
    config = AgentConfig()
    
    agent = MockTestAgent(
        agent_id="agent_math",
        name="Math Agent",
        description="Adds 10 to values",
        supported_tasks=["math_task"],
        required_tools=["plus_tool"]
    )
    registry.register(agent)
    
    orchestrator = AgentOrchestrator(
        registry=registry,
        memory=memory,
        event_bus=event_bus,
        config=config
    )
    
    req = ExecutionRequest(
        task="math_task",
        user_id="user_123",
        input_data={"shared_variables": {"value": 5}}
    )
    
    response = await orchestrator.execute_task(req)
    assert response.status == "success"
    assert response.output["result"] == 15
    assert len(response.steps) == 1
    assert response.steps[0].agent_id == "agent_math"
    
    # Check that events were generated (started, tool_called, finished/workflow_completed)
    event_types = [evt.event_type for evt in response.events]
    assert "agent_started" in event_types
    assert "tool_called" in event_types
    assert "workflow_completed" in event_types


@pytest.mark.anyio
async def test_orchestrator_execution_validation_failure():
    registry = AgentRegistry()
    memory = SharedMemory()
    event_bus = AgentEventBus()
    config = AgentConfig()
    
    agent = MockTestAgent(
        agent_id="agent_validate",
        name="Validator Agent",
        description="Fails validation on invalid task",
        supported_tasks=["invalid_task"],
        required_tools=[]
    )
    registry.register(agent)
    
    orchestrator = AgentOrchestrator(
        registry=registry,
        memory=memory,
        event_bus=event_bus,
        config=config
    )
    
    req = ExecutionRequest(
        task="invalid_task",
        user_id="user_123"
    )
    
    response = await orchestrator.execute_task(req)
    assert response.status == "failed"
    assert "Validation failed" in response.steps[0].output["error"]


@pytest.mark.anyio
async def test_orchestrator_execution_timeout():
    registry = AgentRegistry()
    memory = SharedMemory()
    event_bus = AgentEventBus()
    config = AgentConfig()
    
    # Force short timeout for tests
    config.execution_timeout = 0.1
    
    agent = MockTestAgent(
        agent_id="agent_slow",
        name="Slow Agent",
        description="Sleeps during execution",
        supported_tasks=["timeout_task"],
        required_tools=[]
    )
    registry.register(agent)
    
    orchestrator = AgentOrchestrator(
        registry=registry,
        memory=memory,
        event_bus=event_bus,
        config=config
    )
    
    req = ExecutionRequest(
        task="timeout_task",
        user_id="user_123"
    )
    
    response = await orchestrator.execute_task(req)
    assert response.status == "failed"
    assert "timed out" in response.steps[0].output["error"]


@pytest.mark.anyio
async def test_orchestrator_retry_logic():
    registry = AgentRegistry()
    memory = SharedMemory()
    event_bus = AgentEventBus()
    config = AgentConfig()
    
    config.retry_count = 1
    
    agent = MockTestAgent(
        agent_id="agent_failing",
        name="Failing Agent",
        description="Fails on fail_task",
        supported_tasks=["fail_task"],
        required_tools=[]
    )
    registry.register(agent)
    
    orchestrator = AgentOrchestrator(
        registry=registry,
        memory=memory,
        event_bus=event_bus,
        config=config
    )
    
    req = ExecutionRequest(
        task="fail_task",
        user_id="user_123"
    )
    
    response = await orchestrator.execute_task(req)
    assert response.status == "failed"
    assert "Simulated execution failure" in response.steps[0].output["error"]


# ---------------------------------------------------------
# 7. API Tests
# ---------------------------------------------------------

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_overrides():
    config = AgentConfig()
    registry = AgentRegistry()
    memory = SharedMemory()
    event_bus = AgentEventBus()
    orchestrator = AgentOrchestrator(
        registry=registry,
        memory=memory,
        event_bus=event_bus,
        config=config
    )
    
    # Register Mock Agent
    mock_agent = MockTestAgent(
        agent_id="api_test_agent",
        name="API Test Agent",
        description="Testing endpoints",
        supported_tasks=["api_task"],
        required_tools=["api_tool"]
    )
    registry.register(mock_agent)
    
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_agent_config] = lambda: config
    app.dependency_overrides[get_agent_registry] = lambda: registry
    app.dependency_overrides[get_shared_memory] = lambda: memory
    app.dependency_overrides[get_agent_event_bus] = lambda: event_bus
    app.dependency_overrides[get_agent_orchestrator] = lambda: orchestrator

    yield {
        "registry": registry,
        "orchestrator": orchestrator,
        "config": config,
        "agent": mock_agent
    }

    app.dependency_overrides.clear()


def test_api_list_agents():
    response = client.get("/api/v1/agents")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["agent_id"] == "api_test_agent"
    assert data[0]["name"] == "API Test Agent"


def test_api_get_agent_status():
    response = client.get("/api/v1/agents/status")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["agent_id"] == "api_test_agent"
    assert data[0]["status"] == "healthy"


def test_api_get_agent_details():
    response = client.get("/api/v1/agents/api_test_agent")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["agent_id"] == "api_test_agent"
    assert data["name"] == "API Test Agent"


def test_api_get_agent_details_not_found():
    response = client.get("/api/v1/agents/non_existent_agent")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_api_execute_task():
    payload = {
        "task": "api_task",
        "user_id": "1",
        "input_data": {"shared_variables": {"key": "val"}},
        "execution_mode": "sequential"
    }
    response = client.post("/api/v1/agents/execute", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "success"
    assert data["output"]["agent_executed"] == "api_test_agent"
    assert data["output"]["received_input"]["key"] == "val"
    assert len(data["steps"]) == 1
    assert len(data["events"]) >= 2
