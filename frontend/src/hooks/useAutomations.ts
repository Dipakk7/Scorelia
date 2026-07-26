import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { automationService } from '@/services/automationService'
import type { AutomationItem } from '@/data/taskAutomationKnowledgeMockData'

export function useAutomations() {
  const queryClient = useQueryClient()

  const { data: automations = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['automationsList'],
    queryFn: () => automationService.getAutomations(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const toggleEnableMutation = useMutation({
    mutationFn: (id: string) => automationService.toggleAutomationEnable(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<AutomationItem[]>(['automationsList'], (old = []) =>
        old.map((a) => (a.id === id ? { ...a, status: a.status === 'enabled' ? 'disabled' : 'enabled' } : a))
      )
      queryClient.invalidateQueries({ queryKey: ['automationsList'] })
    },
  })

  const deleteAutomationMutation = useMutation({
    mutationFn: (id: string) => automationService.deleteAutomation(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<AutomationItem[]>(['automationsList'], (old = []) =>
        old.filter((a) => a.id !== deletedId)
      )
      queryClient.invalidateQueries({ queryKey: ['automationsList'] })
    },
  })

  return {
    automations,
    isLoading,
    isError,
    error,
    refetch,
    toggleEnable: toggleEnableMutation.mutateAsync,
    isToggling: toggleEnableMutation.isPending,
    deleteAutomation: deleteAutomationMutation.mutateAsync,
    isDeleting: deleteAutomationMutation.isPending,
  }
}

export default useAutomations
