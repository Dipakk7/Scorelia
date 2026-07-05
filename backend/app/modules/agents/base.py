# app/modules/agents/base.py

from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.modules.agents.context import AgentContext
from app.modules.agents.models import AgentResponse, AgentHealthStatus
from app.ai.services.ai_service import AIService
from app.modules.rag.generation.orchestrator import RAGOrchestrator


class BaseAgent(ABC):
    """Abstract Base Agent class defining the standard interface and capabilities of AI agents in the platform."""

    def __init__(
        self,
        agent_id: str,
        name: str,
        description: str,
        supported_tasks: List[str],
        required_tools: List[str],
        ai_service: Optional[AIService] = None,
        rag_orchestrator: Optional[RAGOrchestrator] = None,
        memory_manager: Optional[Any] = None,
        agent_registry: Optional[Any] = None,
        tool_executor: Optional[Any] = None,
        **kwargs: Any
    ):
        self.agent_id = agent_id
        self.name = name
        self.description = description
        self.supported_tasks = supported_tasks
        self.required_tools = required_tools
        self.ai_service = ai_service
        self.rag_orchestrator = rag_orchestrator
        self.memory_manager = memory_manager
        self.agent_registry = agent_registry
        self.tool_executor = tool_executor
        self.enabled = True
        self.kwargs = kwargs

    async def delegate(self, target_agent_id: str, context: AgentContext) -> AgentResponse:
        """Delegates a sub-task to another agent registered in the platform."""
        if not self.agent_registry:
            return AgentResponse(
                agent_id=self.agent_id,
                status="failed",
                output={"error": "Agent registry not configured for delegation."},
                errors=["Agent registry missing."]
            )

        try:
            agent = self.agent_registry.get(target_agent_id)
        except Exception:
            return AgentResponse(
                agent_id=self.agent_id,
                status="failed",
                output={"error": f"Target agent '{target_agent_id}' not found."},
                errors=[f"Agent '{target_agent_id}' not found."],
                execution_time_ms=0.0
            )


        # Context validation
        valid = await agent.validate(context)
        if not valid:
            return AgentResponse(
                agent_id=target_agent_id,
                status="failed",
                output={"error": "Delegated context validation failed."},
                errors=["Context validation failed."]
            )

        # Execute target agent
        return await agent.execute(context)

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any], session_id: str, user_id: str) -> Any:
        """Invokes an internal tool directly using the tool execution system."""
        if not self.tool_executor:
            raise RuntimeError("Tool executor not configured on this agent.")

        from app.modules.agents.workflow.tools.tool_models import ToolExecutionRequest
        req = ToolExecutionRequest(
            tool_name=tool_name,
            arguments=arguments,
            session_id=session_id,
            user_id=user_id
        )
        res = await self.tool_executor.execute_tool(req, {
            "session_id": session_id,
            "user_id": user_id,
            "agent_id": self.agent_id,
            "ai_service": self.ai_service,
            "rag_orchestrator": self.rag_orchestrator
        })
        if not res.success:
            raise RuntimeError(res.error or f"Tool '{tool_name}' execution failed.")
        return res.output

    @abstractmethod
    async def execute(self, context: AgentContext) -> AgentResponse:
        """Executes the core logical operation of the agent using the provided context.

        Returns:
            An AgentResponse containing execution status, outputs, errors, and timing.
        """
        pass

    @abstractmethod
    async def validate(self, context: AgentContext) -> bool:
        """Validates that the input context meets the agent's execution prerequisites.

        Returns:
            True if context is valid, False otherwise.
        """
        pass

    @abstractmethod
    async def health(self) -> AgentHealthStatus:
        """Runs diagnostics checks (e.g. API connections, database status) specific to the agent.

        Returns:
            An AgentHealthStatus object detailing current health state.
        """
        pass

