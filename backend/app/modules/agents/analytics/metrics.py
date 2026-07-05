# app/modules/agents/analytics/metrics.py

import time
import threading
import asyncio
from typing import Dict, Any, List, Optional, Tuple


class AgentExecutionRecord:
    def __init__(
        self,
        agent_id: str,
        name: str,
        task: str,
        latency_ms: float,
        status: str,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
        tools_called: List[str] = None,
        retries: int = 0,
        timeout: bool = False,
        error: Optional[str] = None,
    ):
        self.agent_id = agent_id
        self.name = name
        self.task = task
        self.latency_ms = latency_ms
        self.status = status  # "success" or "failed"
        self.prompt_tokens = prompt_tokens
        self.completion_tokens = completion_tokens
        self.tools_called = tools_called or []
        self.retries = retries
        self.timeout = timeout
        self.error = error
        self.timestamp = time.time()


class WorkflowStepRecord:
    def __init__(
        self,
        step_id: str,
        name: str,
        step_type: str,
        target: str,
        status: str,
        execution_time_ms: float,
        retry_count: int,
        error: Optional[str] = None
    ):
        self.step_id = step_id
        self.name = name
        self.step_type = step_type
        self.target = target
        self.status = status
        self.execution_time_ms = execution_time_ms
        self.retry_count = retry_count
        self.error = error


class WorkflowExecutionRecord:
    def __init__(
        self,
        workflow_id: str,
        name: str,
        status: str,
        execution_mode: str,
        started_at: float,
        steps: List[WorkflowStepRecord] = None,
        completed_at: Optional[float] = None,
        execution_time_ms: float = 0.0,
        rollbacks: List[str] = None,
        compensation_events: List[str] = None
    ):
        self.workflow_id = workflow_id
        self.name = name
        self.status = status
        self.execution_mode = execution_mode
        self.started_at = started_at
        self.steps = steps or []
        self.completed_at = completed_at
        self.execution_time_ms = execution_time_ms
        self.rollbacks = rollbacks or []
        self.compensation_events = compensation_events or []


class ToolExecutionRecord:
    def __init__(self, tool_name: str, latency_ms: float, status: str, error: Optional[str] = None):
        self.tool_name = tool_name
        self.latency_ms = latency_ms
        self.status = status  # "success" or "failed"
        self.error = error
        self.timestamp = time.time()


class AnalyticsRegistry:
    """Thread-safe registry for keeping track of in-memory telemetry records and caches."""

    def __init__(self):
        self._lock = threading.Lock()
        
        # Raw execution logs
        self.agent_records: List[AgentExecutionRecord] = []
        self.workflow_records: List[WorkflowExecutionRecord] = []
        self.tool_records: List[ToolExecutionRecord] = []
        
        # Performance & Optimization stats
        self.agent_cache_hits = 0
        self.agent_cache_misses = 0
        self.tool_cache_hits = 0
        self.tool_cache_misses = 0
        self.duplicate_executions_prevented = 0
        self.batched_executions_count = 0
        self.memory_cleanups_triggered = 0
        self.memory_freed_sessions_count = 0
        
        # Delegation tracking (source -> target -> count)
        self.delegation_stats: Dict[str, Dict[str, int]] = {}

        # Caching structures (key -> (value, expires_at))
        self.agent_cache: Dict[str, Tuple[Any, float]] = {}
        self.tool_cache: Dict[str, Tuple[Any, float]] = {}

        # Coalescing futures for duplicate execution detection
        # key -> (future, task_instance)
        self.coalescing_executions: Dict[str, asyncio.Future] = {}
        self.coalescing_lock = asyncio.Lock()

        self.startup_time = time.time()
        self.last_cleanup_timestamp: Optional[float] = None

    def record_agent_execution(self, record: AgentExecutionRecord):
        with self._lock:
            self.agent_records.append(record)

    def record_workflow_execution(self, record: WorkflowExecutionRecord):
        with self._lock:
            # Check if this workflow ID already exists, update it, or add new
            exists = False
            for idx, r in enumerate(self.workflow_records):
                if r.workflow_id == record.workflow_id:
                    self.workflow_records[idx] = record
                    exists = True
                    break
            if not exists:
                self.workflow_records.append(record)

    def record_tool_execution(self, record: ToolExecutionRecord):
        with self._lock:
            self.tool_records.append(record)

    def record_delegation(self, source_id: str, target_id: str):
        with self._lock:
            if source_id not in self.delegation_stats:
                self.delegation_stats[source_id] = {}
            self.delegation_stats[source_id][target_id] = self.delegation_stats[source_id].get(target_id, 0) + 1

    # Caching Support
    def get_agent_cache(self, cache_key: str) -> Optional[Any]:
        with self._lock:
            if cache_key in self.agent_cache:
                val, expires_at = self.agent_cache[cache_key]
                if time.time() < expires_at:
                    self.agent_cache_hits += 1
                    return val
                else:
                    del self.agent_cache[cache_key]
            self.agent_cache_misses += 1
            return None

    def set_agent_cache(self, cache_key: str, val: Any, ttl: float = 300.0):
        with self._lock:
            if ttl > 0:
                self.agent_cache[cache_key] = (val, time.time() + ttl)

    def get_tool_cache(self, cache_key: str) -> Optional[Any]:
        with self._lock:
            if cache_key in self.tool_cache:
                val, expires_at = self.tool_cache[cache_key]
                if time.time() < expires_at:
                    self.tool_cache_hits += 1
                    return val
                else:
                    del self.tool_cache[cache_key]
            self.tool_cache_misses += 1
            return None

    def set_tool_cache(self, cache_key: str, val: Any, ttl: float = 300.0):
        with self._lock:
            if ttl > 0:
                self.tool_cache[cache_key] = (val, time.time() + ttl)

    def clear_caches(self):
        with self._lock:
            self.agent_cache.clear()
            self.tool_cache.clear()

    def get_caches_size(self) -> Tuple[int, int]:
        with self._lock:
            # Clean expired items first
            now = time.time()
            self.agent_cache = {k: v for k, v in self.agent_cache.items() if v[1] > now}
            self.tool_cache = {k: v for k, v in self.tool_cache.items() if v[1] > now}
            return len(self.agent_cache), len(self.tool_cache)
