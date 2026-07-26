import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { insightsService } from '@/services/insightsService'

export function useInsights() {
  const queryClient = useQueryClient()

  const { data: insights = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['agentInsightsList'],
    queryFn: () => insightsService.getInsights(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: timeline = [] } = useQuery({
    queryKey: ['agentActivityTimeline'],
    queryFn: () => insightsService.getActivityTimeline(),
    staleTime: 1000 * 60 * 5,
  })

  const applyFixMutation = useMutation({
    mutationFn: (insightId: string) => insightsService.applyFix(insightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentInsightsList'] })
    },
  })

  return {
    insights,
    timeline,
    isLoading,
    isError,
    refetch,
    applyFix: applyFixMutation.mutateAsync,
    isApplyingFix: applyFixMutation.isPending,
  }
}

export default useInsights
