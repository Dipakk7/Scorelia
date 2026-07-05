# app/modules/agents/registry.py

import threading
from typing import Dict, List, Optional
from app.modules.agents.base import BaseAgent
from app.modules.agents.models import AgentHealthStatus, AgentMetadata
from app.modules.agents.exceptions import AgentNotFoundError


class AgentRegistry:
    """Dynamic thread-safe registry tracking all active and available AI Agents in the system."""

    def __init__(self):
        self._agents: Dict[str, BaseAgent] = {}
        self._lock = threading.Lock()

    def register(self, agent: BaseAgent) -> None:
        """Registers a new agent instance into the platform registry."""
        try:
            from app.modules.agents.analytics.service import AgentAnalyticsService
            analytics = AgentAnalyticsService()
            if not hasattr(agent, "original_execute"):
                analytics._wrap_single_agent(agent)
        except Exception:
            pass
        with self._lock:
            self._agents[agent.agent_id] = agent

    def remove(self, agent_id: str) -> None:
        """Removes an agent from the registry."""
        with self._lock:
            if agent_id in self._agents:
                del self._agents[agent_id]
            else:
                raise AgentNotFoundError(f"Agent '{agent_id}' is not registered.")

    def get(self, agent_id: str) -> BaseAgent:
        """Retrieves a registered agent instance by its ID."""
        with self._lock:
            agent = self._agents.get(agent_id)
            if agent is None:
                raise AgentNotFoundError(f"Agent '{agent_id}' is not registered.")
            return agent

    def list_agents(self) -> List[BaseAgent]:
        """Discovers all currently registered agent instances."""
        with self._lock:
            return list(self._agents.values())

    def list_metadata(self) -> List[AgentMetadata]:
        """Retrieves metadata of all registered agents."""
        with self._lock:
            return [
                AgentMetadata(
                    agent_id=a.agent_id,
                    name=a.name,
                    description=a.description,
                    supported_tasks=a.supported_tasks,
                    required_tools=a.required_tools,
                    enabled=a.enabled
                )
                for a in self._agents.values()
            ]

    def enable(self, agent_id: str) -> None:
        """Enables a registered agent, permitting execution of tasks."""
        agent = self.get(agent_id)
        with self._lock:
            agent.enabled = True

    def disable(self, agent_id: str) -> None:
        """Disables a registered agent, preventing execution of tasks."""
        agent = self.get(agent_id)
        with self._lock:
            agent.enabled = False

    async def get_health(self, agent_id: str) -> AgentHealthStatus:
        """Retrieves the health status report for a specific agent."""
        agent = self.get(agent_id)
        return await agent.health()

    async def get_all_health(self) -> List[AgentHealthStatus]:
        """Gathers health status reports for all registered agents."""
        agents = self.list_agents()
        results = []
        for agent in agents:
            try:
                results.append(await agent.health())
            except Exception as e:
                results.append(
                    AgentHealthStatus(
                        agent_id=agent.agent_id,
                        name=agent.name,
                        status="unhealthy",
                        message=f"Health diagnostic check failed: {str(e)}",
                        details={"error": str(e)}
                    )
                )
        return results
