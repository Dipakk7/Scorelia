import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentService } from '@/services/agentService'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'

export function useAgents() {
  const queryClient = useQueryClient()

  const { data: agents = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['agentsList'],
    queryFn: () => agentService.getAgents(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AgentConsoleItem['status'] }) =>
      agentService.updateAgentStatus(id, status),
    onSuccess: (_, { id, status }) => {
      queryClient.setQueryData<AgentConsoleItem[]>(['agentsList'], (old = []) =>
        old.map((a) => (a.id === id ? { ...a, status } : a))
      )
      queryClient.invalidateQueries({ queryKey: ['agentsList'] })
    },
  })

  const deleteAgentMutation = useMutation({
    mutationFn: (id: string) => agentService.deleteAgent(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<AgentConsoleItem[]>(['agentsList'], (old = []) =>
        old.filter((a) => a.id !== deletedId)
      )
      queryClient.invalidateQueries({ queryKey: ['agentsList'] })
    },
  })

  return {
    agents,
    isLoading,
    isError,
    error,
    refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteAgent: deleteAgentMutation.mutateAsync,
    isDeleting: deleteAgentMutation.isPending,
  }
}

export default useAgents
