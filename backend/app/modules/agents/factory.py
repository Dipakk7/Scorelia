# app/modules/agents/factory.py

from typing import Any, Type, Optional
from app.modules.agents.base import BaseAgent
from app.modules.agents.models import AgentConfig
from app.ai.services.ai_service import AIService
from app.modules.rag.generation.orchestrator import RAGOrchestrator


class AgentFactory:
    """Factory service responsible for constructing AI agent instances with standard DI dependency wire-up."""

    def __init__(
        self,
        ai_service: AIService,
        rag_orchestrator: RAGOrchestrator,
        config: AgentConfig,
        memory_manager: Optional[Any] = None,
        agent_registry: Optional[Any] = None,
        tool_executor: Optional[Any] = None
    ):
        self.ai_service = ai_service
        self.rag_orchestrator = rag_orchestrator
        self.config = config
        self.memory_manager = memory_manager
        self.agent_registry = agent_registry
        self.tool_executor = tool_executor

    def create_agent(
        self,
        agent_class: Type[BaseAgent],
        agent_id: str,
        name: str,
        description: str,
        supported_tasks: list[str],
        required_tools: list[str],
        **kwargs: Any
    ) -> BaseAgent:
        """Instantiates an agent class, automatically injecting the AI Service and RAG Orchestrator dependencies."""
        return agent_class(
            agent_id=agent_id,
            name=name,
            description=description,
            supported_tasks=supported_tasks,
            required_tools=required_tools,
            ai_service=self.ai_service,
            rag_orchestrator=self.rag_orchestrator,
            memory_manager=self.memory_manager,
            agent_registry=self.agent_registry,
            tool_executor=self.tool_executor,
            **kwargs
        )

