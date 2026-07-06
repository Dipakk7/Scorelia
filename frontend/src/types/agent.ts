// frontend/src/types/agent.ts

export interface AgentMetadata {
  agent_id: string
  name: string
  description: string
  supported_tasks: string[]
  required_tools: string[]
  enabled: boolean
}

export interface AgentHealthStatus {
  agent_id: string
  name: string
  status: 'healthy' | 'unhealthy'
  message?: string | null
  details: Record<string, any>
}

export interface AgentResponse {
  agent_id: string
  status: 'success' | 'failed'
  output: Record<string, any>
  errors?: string[] | null
  execution_time_ms: number
}

export interface AgentEvent {
  event_id: string
  event_type: 'agent_started' | 'agent_finished' | 'agent_failed' | 'tool_called' | 'workflow_completed'
  agent_id?: string | null
  agent_name?: string | null
  request_id: string
  timestamp: string
  payload: Record<string, any>
}

export interface ExecutionRequest {
  task: string
  user_id?: string
  session_id?: string | null
  conversation_id?: string | null
  correlation_id?: string | null
  input_data?: Record<string, any>
  execution_mode?: 'sequential' | 'parallel' | null
}

export interface ExecutionResponse {
  request_id: string
  status: 'success' | 'failed'
  output: Record<string, any>
  steps: AgentResponse[]
  events: AgentEvent[]
  execution_time_ms: number
  correlation_id?: string | null
}

export interface WorkflowStep {
  name: string
  type: 'tool' | 'agent'
  target: string
  arguments?: Record<string, any>
  max_retries?: number
}

export interface Workflow {
  workflow_id: string
  name: string
  description: string
  execution_mode: 'sequential' | 'parallel'
  variables?: Record<string, any>
  steps: WorkflowStep[]
}

export interface ToolParameter {
  name: string
  type: string
  description: string
  required?: boolean
}

export interface ToolMetadata {
  name: string
  description: string
  parameters: ToolParameter[]
}

export interface ToolExecutionRequest {
  tool_name: string
  arguments: Record<string, any>
  session_id?: string | null
  user_id?: string | null
}

export interface ToolExecutionResponse {
  success: boolean
  output?: any
  error?: string | null
  duration_ms: number
}

export interface AgentExecutionStats {
  agent_id: string
  name: string
  execution_count: number
  success_count: number
  failure_count: number
  success_rate: number
  failure_rate: number
  avg_latency_ms: number
  total_prompt_tokens: number
  total_completion_tokens: number
  total_tokens: number
  tool_usage: Record<string, number>
  delegation_count: number
  retry_count: number
  timeout_count: number
}

export interface WorkflowStepStats {
  step_id: string
  name: string
  step_type: 'agent' | 'tool'
  target: string
  status: string
  execution_time_ms: number
  retry_count: number
  error?: string | null
}

export interface WorkflowExecutionStats {
  workflow_id: string
  name: string
  status: string
  execution_mode: 'sequential' | 'parallel' | 'graph'
  steps: WorkflowStepStats[]
  execution_time_ms: number
  started_at: number
  completed_at?: number | null
  rollbacks: string[]
  compensation_events: string[]
}

export interface ToolStats {
  tool_name: string
  execution_count: number
  success_count: number
  failure_count: number
  avg_latency_ms: number
}

export interface CollaborationGraphNode {
  id: string
  label: string
  type: 'agent' | 'tool'
}

export interface CollaborationGraphEdge {
  source: string
  target: string
  count: number
  type: 'delegation' | 'tool_call'
}

export interface CollaborationMetrics {
  nodes: CollaborationGraphNode[]
  edges: CollaborationGraphEdge[]
  delegation_statistics: Record<string, Record<string, number>>
  shared_memory_namespaces_count: number
  shared_memory_variables_count: number
  workflow_complexity_scores: Record<string, number>
  most_used_agents: string[]
  least_used_agents: string[]
  most_used_tools: string[]
  least_used_tools: string[]
}

export interface PerformanceStats {
  agent_cache_hits: number
  agent_cache_misses: number
  agent_cache_size: number
  tool_cache_hits: number
  tool_cache_misses: number
  tool_cache_size: number
  duplicate_executions_prevented: number
  active_coalescing_executions: number
  batched_executions_count: number
  memory_cleanups_triggered: number
  memory_freed_sessions_count: number
}

export interface HealthStatus {
  status: 'healthy' | 'degraded'
  uptime_seconds: number
  registry_agents_count: number
  registry_tools_count: number
  memory_store_sessions_count: number
  last_cleanup_timestamp?: string | null
  startup_validated: boolean
  configuration_validated: boolean
  production_safety_checks_passed: boolean
  dependency_validation_status: Record<string, boolean>
  queue_length: number
  active_timeouts_count: number
  memory_usage_bytes: number
  diagnostics: Record<string, any>
}

export interface SystemAnalyticsSummary {
  total_agent_executions: number
  total_workflow_executions: number
  total_tool_executions: number
  overall_agent_success_rate: number
  overall_workflow_success_rate: number
  overall_tool_success_rate: number
  average_agent_latency_ms: number
  average_workflow_latency_ms: number
  total_tokens_consumed: number
}
