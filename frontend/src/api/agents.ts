// frontend/src/api/agents.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type {
  AgentMetadata,
  AgentHealthStatus,
  Workflow,
  ToolMetadata,
  ExecutionRequest,
  ExecutionResponse,
  ToolExecutionRequest,
  ToolExecutionResponse,
  SystemAnalyticsSummary,
  AgentExecutionStats,
  WorkflowExecutionStats,
  ToolStats,
  PerformanceStats,
  HealthStatus,
} from '@/types/agent'

/**
 * Fetch all registered agents.
 */
export function useAgents() {
  return useQuery<AgentMetadata[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await api.get('/agents')
      return res.data
    },
  })
}

/**
 * Fetch health status metrics check for all agents.
 */
export function useAgentsStatus() {
  return useQuery<AgentHealthStatus[]>({
    queryKey: ['agentsStatus'],
    queryFn: async () => {
      const res = await api.get('/agents/status')
      return res.data
    },
    refetchInterval: 10000, // Check agent status every 10 seconds
  })
}

/**
 * Fetch pre-configured workflow templates.
 */
export function useWorkflows() {
  return useQuery<Workflow[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const res = await api.get('/agents/workflows')
      return res.data
    },
  })
}

/**
 * Fetch available tools.
 */
export function useTools() {
  return useQuery<ToolMetadata[]>({
    queryKey: ['tools'],
    queryFn: async () => {
      const res = await api.get('/agents/tools')
      return res.data
    },
  })
}

/**
 * Fetch shared memory variables of a session.
 */
export function useSessionMemory(sessionId: string | null) {
  return useQuery<Record<string, Record<string, any>>>({
    queryKey: ['sessionMemory', sessionId],
    queryFn: async () => {
      if (!sessionId) return {}
      const res = await api.get(`/agents/memory`, {
        params: { session_id: sessionId },
      })
      return res.data
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Refresh memory snapshot every 5 seconds
  })
}

/**
 * Mutation to purge a session's shared memory.
 */
export function useClearMemory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await api.delete(`/agents/memory/${sessionId}`)
      return res.data
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['sessionMemory', sessionId] })
    },
  })
}

/**
 * Mutation to execute an agent task via the Orchestrator.
 */
export function useExecuteTask() {
  return useMutation<ExecutionResponse, Error, ExecutionRequest>({
    mutationFn: async (payload) => {
      const res = await api.post('/agents/execute', payload)
      return res.data
    },
  })
}

/**
 * Mutation to execute a workflow graph.
 */
export function useExecuteWorkflow() {
  return useMutation<any, Error, Workflow>({
    mutationFn: async (payload) => {
      const res = await api.post('/agents/workflows/execute', payload)
      return res.data
    },
  })
}

/**
 * Mutation to invoke a tool directly.
 */
export function useExecuteTool() {
  return useMutation<ToolExecutionResponse, Error, ToolExecutionRequest>({
    mutationFn: async (payload) => {
      const res = await api.post('/agents/tools/execute', payload)
      return res.data
    },
  })
}

/**
 * Fetch unified high-level system analytics.
 */
export function useSystemAnalytics() {
  return useQuery<SystemAnalyticsSummary>({
    queryKey: ['systemAnalytics'],
    queryFn: async () => {
      const res = await api.get('/agents/analytics')
      return res.data
    },
  })
}

/**
 * Fetch execution stats per agent.
 */
export function useAgentsAnalytics() {
  return useQuery<Record<string, AgentExecutionStats>>({
    queryKey: ['agentsAnalytics'],
    queryFn: async () => {
      const res = await api.get('/agents/analytics/agents')
      return res.data
    },
  })
}

/**
 * Fetch execution stats per workflow.
 */
export function useWorkflowsAnalytics() {
  return useQuery<WorkflowExecutionStats[]>({
    queryKey: ['workflowsAnalytics'],
    queryFn: async () => {
      const res = await api.get('/agents/analytics/workflows')
      return res.data
    },
  })
}

/**
 * Fetch execution stats per tool.
 */
export function useToolsAnalytics() {
  return useQuery<Record<string, ToolStats>>({
    queryKey: ['toolsAnalytics'],
    queryFn: async () => {
      const res = await api.get('/agents/analytics/tools')
      return res.data
    },
  })
}

/**
 * Fetch performance stats (cache optimization, etc.).
 */
export function usePerformanceAnalytics() {
  return useQuery<PerformanceStats>({
    queryKey: ['performanceAnalytics'],
    queryFn: async () => {
      const res = await api.get('/agents/analytics/performance')
      return res.data
    },
  })
}

/**
 * Fetch diagnostic health checks stats.
 */
export function useHealthAnalytics() {
  return useQuery<HealthStatus>({
    queryKey: ['healthAnalytics'],
    queryFn: async () => {
      const res = await api.get('/agents/analytics/health')
      return res.data
    },
    refetchInterval: 15000,
  })
}

/**
 * Mutation to trigger analytics cleanup.
 */
export function useAnalyticsCleanup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/agents/analytics/cleanup')
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['healthAnalytics'] })
      queryClient.invalidateQueries({ queryKey: ['performanceAnalytics'] })
    },
  })
}
