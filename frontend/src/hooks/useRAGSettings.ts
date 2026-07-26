import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'
import type { RAGSettingsData } from '@/data/ragSettingsMockData'

export function useRAGSettings() {
  const queryClient = useQueryClient()

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: ['ragSettings'],
    queryFn: () => ragWorkspaceService.getSettings(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false
  })

  const updateMutation = useMutation({
    mutationFn: (newSettings: RAGSettingsData) =>
      ragWorkspaceService.updateSettings(newSettings),
    onSuccess: (updated) => {
      queryClient.setQueryData(['ragSettings'], updated)
    }
  })

  return {
    settings,
    isLoading,
    isError,
    updateSettings: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending
  }
}

export default useRAGSettings
