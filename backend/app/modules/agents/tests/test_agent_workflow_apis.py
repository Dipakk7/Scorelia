# app/modules/agents/tests/test_agent_workflow_apis.py

import pytest
import uuid
from fastapi import status
from fastapi.testclient import TestClient

from app.main import app
from app.core.dependencies import get_current_user
from app.models.user import User
from app.modules.agents.dependencies import get_tool_registry
from app.modules.agents.workflow.tools.tool_models import ToolMetadata, ToolParameter

# Mock user for FastAPI authentication override
MOCK_USER_ID = uuid.uuid4()
mock_user = User(
    id=MOCK_USER_ID,
    email="workflow_api_test@careerpilot.com",
    full_name="Workflow API Test User",
    hashed_password="somehashpassword"
)


@pytest.fixture
def client():
    app.dependency_overrides[get_current_user] = lambda: mock_user
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_list_workflows_api(client):
    response = client.get("/api/v1/agents/workflows")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == "Resume Optimization Pipeline"


def test_list_tools_api(client):
    response = client.get("/api/v1/agents/tools")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # Check that ats_tool or other default tool is listed
    tool_names = [tool["name"] for tool in data]
    assert "ats_tool" in tool_names
    assert "resume_tool" in tool_names


def test_execute_tool_api(client):
    # Dynamically register a test tool to execute safely
    registry = get_tool_registry()
    test_tool_meta = ToolMetadata(
        name="api_test_tool",
        description="Helper for testing tools API",
        parameters=[ToolParameter(name="echo", type="string", description="val")]
    )
    
    async def mock_tool_call(args, ctx):
        return f"echo: {args.get('echo')}"

    registry.register(test_tool_meta, mock_tool_call)


    # Call execute tool API
    payload = {
        "tool_name": "api_test_tool",
        "arguments": {"echo": "Antigravity rocks"},
        "session_id": "test_session_123"
    }
    
    response = client.post("/api/v1/agents/tools/execute", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert data["output"] == "echo: Antigravity rocks"


def test_session_memory_apis(client):
    session_id = "test_sess_api_999"
    
    # 1. Clear session memory first to establish clean state
    clear_resp = client.delete(f"/api/v1/agents/memory/{session_id}")
    assert clear_resp.status_code == status.HTTP_200_OK
    
    # 2. Query empty session memory
    get_resp = client.get(f"/api/v1/agents/memory?session_id={session_id}")
    assert get_resp.status_code == status.HTTP_200_OK
    data = get_resp.json()
    assert data == {}


def test_execute_workflow_api(client):
    # Dynamically register simple tool for the workflow step to reference
    registry = get_tool_registry()
    test_meta = ToolMetadata(
        name="wf_tool_step",
        description="wf test step tool",
        parameters=[]
    )

    async def mock_wf_tool_step(args, ctx):
        return {"status": "success", "data": "api_wf_ran"}

    registry.register(test_meta, mock_wf_tool_step)


    payload = {
        "workflow_id": "wf_api_run_1",
        "name": "API Workflow Test",
        "description": "Sequential DAG test via API",
        "execution_mode": "sequential",
        "variables": {"init_var": "val1"},
        "steps": [
            {
                "name": "Step 1",
                "type": "tool",
                "target": "wf_tool_step",
                "arguments": {},
                "max_retries": 0
            }
        ]
    }
    
    response = client.post("/api/v1/agents/workflows/execute", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "completed"
    assert len(data["steps"]) == 1
    assert data["steps"][0]["status"] == "completed"
