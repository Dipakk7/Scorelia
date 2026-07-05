# app/modules/agents/tests/test_agent_collaboration.py

import pytest
from app.modules.agents.base import BaseAgent
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.modules.agents.registry import AgentRegistry
from app.modules.agents.workflow.tools.tool_registry import ToolRegistry
from app.modules.agents.workflow.tools.tool_executor import ToolExecutor
from app.modules.agents.workflow.tools.tool_models import ToolMetadata, ToolParameter
from app.modules.agents.workflow.memory.memory_manager import MemoryManager


class CollaboratingAgent(BaseAgent):
    async def execute(self, context: AgentContext) -> AgentResponse:
        task = context.current_task or ""
        
        # 1. Test memory usage
        if self.memory_manager:
            self.memory_manager.set_agent_var(context.session_id, self.agent_id, "last_task", task)

        # 2. Test tool execution
        if "call_tool" in task:
            tool_name = context.shared_variables.get("target_tool")
            tool_args = context.shared_variables.get("target_args", {})
            try:
                res = await self.call_tool(tool_name, tool_args, context.session_id, context.user_id)
                return AgentResponse(agent_id=self.agent_id, status="success", output={"tool_result": res}, execution_time_ms=0.0)
            except Exception as e:
                return AgentResponse(agent_id=self.agent_id, status="failed", output={}, errors=[str(e)], execution_time_ms=0.0)

        # 3. Test delegation execution
        if "delegate" in task:
            sub_agent_id = context.shared_variables.get("target_agent")
            sub_task = context.shared_variables.get("target_task", "subtask")
            sub_ctx = AgentContext(
                user_id=context.user_id,
                session_id=context.session_id,
                request_id=f"delegated_{context.request_id}",
                conversation_id=context.conversation_id,
                current_task=sub_task,
                shared_variables=context.shared_variables
            )
            res = await self.delegate(sub_agent_id, sub_ctx)
            return res

        return AgentResponse(agent_id=self.agent_id, status="success", output={"completed_task": task}, execution_time_ms=0.0)


    async def validate(self, context: AgentContext) -> bool:
        return True

    async def health(self) -> AgentHealthStatus:
        return AgentHealthStatus(agent_id=self.agent_id, status="healthy")


@pytest.fixture
def setup_collaboration():
    registry = AgentRegistry()
    tool_reg = ToolRegistry()
    executor = ToolExecutor(tool_reg)
    mem_mgr = MemoryManager()

    # Custom test tool
    tool_meta = ToolMetadata(
        name="hello_tool",
        description="test tool",
        parameters=[ToolParameter(name="name", type="string", description="name")]
    )
    
    async def hello_tool_func(args, ctx):
        return f"Hello, {args.get('name')}!"
        
    tool_reg.register(tool_meta, hello_tool_func)


    agent_a = CollaboratingAgent(
        agent_id="agent_a",
        name="Agent A",
        description="",
        supported_tasks=[],
        required_tools=[],
        memory_manager=mem_mgr,
        agent_registry=registry,
        tool_executor=executor
    )

    agent_b = CollaboratingAgent(
        agent_id="agent_b",
        name="Agent B",
        description="",
        supported_tasks=[],
        required_tools=[],
        memory_manager=mem_mgr,
        agent_registry=registry,
        tool_executor=executor
    )

    registry.register(agent_a)
    registry.register(agent_b)

    return registry, tool_reg, executor, mem_mgr, agent_a, agent_b


@pytest.mark.anyio
async def test_agent_to_agent_delegation(setup_collaboration):
    _, _, _, _, agent_a, _ = setup_collaboration
    
    ctx = AgentContext(
        user_id="user_1",
        session_id="session_1",
        request_id="req_1",
        conversation_id="c1",
        current_task="delegate_task",
        shared_variables={
            "target_agent": "agent_b",
            "target_task": "run_sub_task"
        }
    )
    
    res = await agent_a.execute(ctx)
    assert res.status == "success"
    assert res.agent_id == "agent_b"
    assert res.output.get("completed_task") == "run_sub_task"


@pytest.mark.anyio
async def test_agent_tool_calling(setup_collaboration):
    _, _, _, _, agent_a, _ = setup_collaboration
    
    ctx = AgentContext(
        user_id="user_1",
        session_id="session_1",
        request_id="req_2",
        conversation_id="c1",
        current_task="call_tool_task",
        shared_variables={
            "target_tool": "hello_tool",
            "target_args": {"name": "Gemini"}
        }
    )
    
    res = await agent_a.execute(ctx)
    assert res.status == "success"
    assert res.output.get("tool_result") == "Hello, Gemini!"


@pytest.mark.anyio
async def test_collaboration_memory_sharing(setup_collaboration):
    _, _, _, mem_mgr, agent_a, _ = setup_collaboration
    
    ctx = AgentContext(
        user_id="user_1",
        session_id="session_memory_1",
        request_id="req_3",
        conversation_id="c1",
        current_task="store_memory_task",
        shared_variables={}
    )
    
    await agent_a.execute(ctx)
    stored_val = mem_mgr.get_agent_var("session_memory_1", "agent_a", "last_task")
    assert stored_val == "store_memory_task"
