# app/modules/agents/tests/test_tool_calling.py

import pytest
from app.modules.agents.workflow.tools.tool_models import ToolMetadata, ToolParameter, ToolExecutionRequest
from app.modules.agents.workflow.tools.tool_registry import ToolRegistry
from app.modules.agents.workflow.tools.tool_validator import ToolValidator
from app.modules.agents.workflow.tools.tool_executor import ToolExecutor


def test_tool_registry_registration():
    registry = ToolRegistry()
    
    # Assert standard default tools are auto-registered
    assert registry.get_tool("resume_tool") is not None
    assert registry.get_tool("ats_tool") is not None
    assert registry.get_tool("job_match_tool") is not None
    assert registry.get_tool("career_tool") is not None
    assert registry.get_tool("learning_tool") is not None
    
    # Custom registration
    custom_meta = ToolMetadata(
        name="custom_test_tool",
        description="Helper for tests",
        parameters=[
            ToolParameter(name="param1", type="string", description="Test param"),
            ToolParameter(name="param2", type="integer", description="Optional integer", required=False, default=10)
        ]
    )
    
    async def sample_exec(args, context):
        return {"output": f"processed: {args.get('param1')} - {args.get('param2')}"}
        
    registry.register(custom_meta, sample_exec)
    
    assert registry.get_tool("custom_test_tool") == custom_meta
    assert registry.get_executor("custom_test_tool") == sample_exec


def test_tool_validator():
    tool = ToolMetadata(
        name="validator_tool",
        description="Validator testing tool",
        parameters=[
            ToolParameter(name="name", type="string", description="User name"),
            ToolParameter(name="age", type="integer", description="User age", required=False)
        ]
    )
    
    # Valid arguments
    ToolValidator.validate(tool, {"name": "Bob", "age": 30})
    
    # Missing required
    with pytest.raises(ValueError, match="Missing required parameter"):
        ToolValidator.validate(tool, {"age": 30})
        
    # Bad type
    with pytest.raises(TypeError, match="must be a string"):
        ToolValidator.validate(tool, {"name": 123})
        
    with pytest.raises(TypeError, match="must be an integer"):
        ToolValidator.validate(tool, {"name": "Bob", "age": "thirty"})


@pytest.mark.anyio
async def test_tool_executor_execution():

    registry = ToolRegistry()
    executor = ToolExecutor(registry)
    
    custom_meta = ToolMetadata(
        name="test_executor_tool",
        description="Tool executor testing",
        parameters=[
            ToolParameter(name="val", type="string", description="Some string value")
        ]
    )
    
    async def executor_func(args, context):
        return f"result: {args.get('val')}"
        
    registry.register(custom_meta, executor_func)
    
    # Execute successfully
    req = ToolExecutionRequest(
        tool_name="test_executor_tool",
        arguments={"val": "Antigravity"}
    )
    
    resp = await executor.execute_tool(req, {"agent_id": "test_agent"})
    assert resp.success is True
    assert resp.output == "result: Antigravity"
    assert resp.error is None
    assert resp.execution_time_ms > 0
    
    # Execute with invalid arguments
    req_invalid = ToolExecutionRequest(
        tool_name="test_executor_tool",
        arguments={"val": 999}  # Int instead of string
    )
    resp_invalid = await executor.execute_tool(req_invalid, {})
    assert resp_invalid.success is False
    assert "must be a string" in resp_invalid.error

