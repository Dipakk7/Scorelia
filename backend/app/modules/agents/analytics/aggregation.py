# app/modules/agents/analytics/aggregation.py

from typing import Dict, Any, List
from app.modules.agents.analytics.metrics import AnalyticsRegistry
from app.modules.agents.analytics.models import (
    AgentExecutionStats,
    WorkflowExecutionStats,
    WorkflowStepStats,
    ToolStats,
    CollaborationMetrics,
    CollaborationGraphNode,
    CollaborationGraphEdge,
    PerformanceStats,
    SystemAnalyticsSummary
)


class MetricsAggregator:
    """Orchestrates aggregation of raw telemetry logs into structured statistics."""

    @staticmethod
    def aggregate_agents(registry: AnalyticsRegistry) -> Dict[str, AgentExecutionStats]:
        stats_map: Dict[str, AgentExecutionStats] = {}
        
        # Group records by agent_id
        with registry._lock:
            records = list(registry.agent_records)

        for r in records:
            if r.agent_id not in stats_map:
                stats_map[r.agent_id] = AgentExecutionStats(
                    agent_id=r.agent_id,
                    name=r.name,
                    tool_usage={}
                )

            stats = stats_map[r.agent_id]
            stats.execution_count += 1
            if r.status == "success":
                stats.success_count += 1
            else:
                stats.failure_count += 1

            # Latency average computation
            total_lat = (stats.avg_latency_ms * (stats.execution_count - 1)) + r.latency_ms
            stats.avg_latency_ms = total_lat / stats.execution_count

            # Tokens
            stats.total_prompt_tokens += r.prompt_tokens
            stats.total_completion_tokens += r.completion_tokens
            stats.total_tokens += (r.prompt_tokens + r.completion_tokens)

            # Tools
            for tool in r.tools_called:
                stats.tool_usage[tool] = stats.tool_usage.get(tool, 0) + 1

            # Delegation count
            # Gather delegation count from registry delegation_stats
            # We will populate it below or update based on registry info
            stats.retry_count += r.retries
            if r.timeout:
                stats.timeout_count += 1

        # Post process rates and delegation counts
        with registry._lock:
            delegation_data = dict(registry.delegation_stats)

        for agent_id, stats in stats_map.items():
            if stats.execution_count > 0:
                stats.success_rate = stats.success_count / stats.execution_count
                stats.failure_rate = stats.failure_count / stats.execution_count

            # Add delegation count
            if agent_id in delegation_data:
                stats.delegation_count = sum(delegation_data[agent_id].values())

        return stats_map

    @staticmethod
    def aggregate_workflows(registry: AnalyticsRegistry) -> List[WorkflowExecutionStats]:
        with registry._lock:
            records = list(registry.workflow_records)

        stats_list: List[WorkflowExecutionStats] = []
        for r in records:
            steps_stats = []
            for s in r.steps:
                steps_stats.append(
                    WorkflowStepStats(
                        step_id=s.step_id,
                        name=s.name,
                        step_type=s.step_type,
                        target=s.target,
                        status=s.status,
                        execution_time_ms=s.execution_time_ms,
                        retry_count=s.retry_count,
                        error=s.error
                    )
                )

            stats_list.append(
                WorkflowExecutionStats(
                    workflow_id=r.workflow_id,
                    name=r.name,
                    status=r.status,
                    execution_mode=r.execution_mode,
                    steps=steps_stats,
                    execution_time_ms=r.execution_time_ms,
                    started_at=r.started_at,
                    completed_at=r.completed_at,
                    rollbacks=r.rollbacks,
                    compensation_events=r.compensation_events
                )
            )
        return stats_list

    @staticmethod
    def aggregate_tools(registry: AnalyticsRegistry) -> Dict[str, ToolStats]:
        stats_map: Dict[str, ToolStats] = {}
        
        with registry._lock:
            records = list(registry.tool_records)

        for r in records:
            if r.tool_name not in stats_map:
                stats_map[r.tool_name] = ToolStats(
                    tool_name=r.tool_name
                )
            
            stats = stats_map[r.tool_name]
            stats.execution_count += 1
            if r.status == "success":
                stats.success_count += 1
            else:
                stats.failure_count += 1

            total_lat = (stats.avg_latency_ms * (stats.execution_count - 1)) + r.latency_ms
            stats.avg_latency_ms = total_lat / stats.execution_count

        return stats_map

    @staticmethod
    def generate_collaboration(
        registry: AnalyticsRegistry,
        agent_registry: Any,
        memory_manager: Any
    ) -> CollaborationMetrics:
        nodes: Dict[str, CollaborationGraphNode] = {}
        edges: List[CollaborationGraphEdge] = []

        # 1. Collect all agent and tool definitions as nodes
        if agent_registry:
            for a in agent_registry.list_metadata():
                nodes[a.agent_id] = CollaborationGraphNode(
                    id=a.agent_id,
                    label=a.name,
                    type="agent"
                )

        # 2. Add edges from delegation statistics
        with registry._lock:
            delegation_data = {k: dict(v) for k, v in registry.delegation_stats.items()}
            agent_exec_records = list(registry.agent_records)
            workflow_records = list(registry.workflow_records)

        for src, targets in delegation_data.items():
            if src not in nodes:
                nodes[src] = CollaborationGraphNode(id=src, label=src, type="agent")
            for tgt, count in targets.items():
                if tgt not in nodes:
                    nodes[tgt] = CollaborationGraphNode(id=tgt, label=tgt, type="agent")
                edges.append(
                    CollaborationGraphEdge(
                        source=src,
                        target=tgt,
                        count=count,
                        type="delegation"
                    )
                )

        # 3. Add edges from tool execution patterns
        for r in agent_exec_records:
            if r.agent_id not in nodes:
                nodes[r.agent_id] = CollaborationGraphNode(id=r.agent_id, label=r.name, type="agent")
            for tool in r.tools_called:
                tool_node_id = f"tool:{tool}"
                if tool_node_id not in nodes:
                    nodes[tool_node_id] = CollaborationGraphNode(
                        id=tool_node_id,
                        label=tool,
                        type="tool"
                    )
                
                # Check if edge already exists, update count
                found = False
                for edge in edges:
                    if edge.source == r.agent_id and edge.target == tool_node_id:
                        edge.count += 1
                        found = True
                        break
                if not found:
                    edges.append(
                        CollaborationGraphEdge(
                            source=r.agent_id,
                            target=tool_node_id,
                            count=1,
                            type="tool_call"
                        )
                    )

        # Most/least used agents/tools
        agent_counts: Dict[str, int] = {}
        tool_counts: Dict[str, int] = {}
        for r in agent_exec_records:
            agent_counts[r.agent_id] = agent_counts.get(r.agent_id, 0) + 1
            for t in r.tools_called:
                tool_counts[t] = tool_counts.get(t, 0) + 1

        # Sort agents/tools
        sorted_agents = sorted(agent_counts.keys(), key=lambda x: agent_counts[x], reverse=True)
        sorted_tools = sorted(tool_counts.keys(), key=lambda x: tool_counts[x], reverse=True)

        most_used_a = sorted_agents[:3]
        least_used_a = list(reversed(sorted_agents))[:3]
        most_used_t = sorted_tools[:3]
        least_used_t = list(reversed(sorted_tools))[:3]

        # Complexity Scores: step count + count of parallel vs sequential branches
        complexity_scores: Dict[str, float] = {}
        for wf in workflow_records:
            base_score = len(wf.steps) * 1.0
            if wf.execution_mode == "parallel":
                base_score *= 0.8  # parallel executions are optimized
            elif wf.execution_mode == "graph":
                base_score *= 1.5  # graph executions are more complex
            complexity_scores[wf.workflow_id] = base_score

        # Memory utilization numbers
        ns_count = 0
        vars_count = 0
        if memory_manager and hasattr(memory_manager, "store") and hasattr(memory_manager.store, "_storage"):
            with memory_manager.store._lock:
                ns_count = sum(len(namespaces) for namespaces in memory_manager.store._storage.values())
                for namespaces in memory_manager.store._storage.values():
                    for keys_dict in namespaces.values():
                        vars_count += len(keys_dict)

        return CollaborationMetrics(
            nodes=list(nodes.values()),
            edges=edges,
            delegation_statistics=delegation_data,
            shared_memory_namespaces_count=ns_count,
            shared_memory_variables_count=vars_count,
            workflow_complexity_scores=complexity_scores,
            most_used_agents=most_used_a,
            least_used_agents=least_used_a,
            most_used_tools=most_used_t,
            least_used_tools=least_used_t
        )

    @staticmethod
    def generate_performance(registry: AnalyticsRegistry) -> PerformanceStats:
        agent_size, tool_size = registry.get_caches_size()
        return PerformanceStats(
            agent_cache_hits=registry.agent_cache_hits,
            agent_cache_misses=registry.agent_cache_misses,
            agent_cache_size=agent_size,
            tool_cache_hits=registry.tool_cache_hits,
            tool_cache_misses=registry.tool_cache_misses,
            tool_cache_size=tool_size,
            duplicate_executions_prevented=registry.duplicate_executions_prevented,
            active_coalescing_executions=len(registry.coalescing_executions),
            batched_executions_count=registry.batched_executions_count,
            memory_cleanups_triggered=registry.memory_cleanups_triggered,
            memory_freed_sessions_count=registry.memory_freed_sessions_count
        )

    @staticmethod
    def generate_summary(registry: AnalyticsRegistry) -> SystemAnalyticsSummary:
        with registry._lock:
            agents = list(registry.agent_records)
            workflows = list(registry.workflow_records)
            tools = list(registry.tool_records)

        total_a = len(agents)
        total_w = len(workflows)
        total_t = len(tools)

        succ_a = sum(1 for r in agents if r.status == "success")
        succ_w = sum(1 for r in workflows if r.status == "completed")
        succ_t = sum(1 for r in tools if r.status == "success")

        rate_a = (succ_a / total_a) if total_a > 0 else 0.0
        rate_w = (succ_w / total_w) if total_w > 0 else 0.0
        rate_t = (succ_t / total_t) if total_t > 0 else 0.0

        avg_lat_a = sum(r.latency_ms for r in agents) / total_a if total_a > 0 else 0.0
        avg_lat_w = sum(r.execution_time_ms for r in workflows) / total_w if total_w > 0 else 0.0

        tokens = sum(r.prompt_tokens + r.completion_tokens for r in agents)

        return SystemAnalyticsSummary(
            total_agent_executions=total_a,
            total_workflow_executions=total_w,
            total_tool_executions=total_t,
            overall_agent_success_rate=rate_a,
            overall_workflow_success_rate=rate_w,
            overall_tool_success_rate=rate_t,
            average_agent_latency_ms=avg_lat_a,
            average_workflow_latency_ms=avg_lat_w,
            total_tokens_consumed=tokens
        )
