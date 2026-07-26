import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { careerRoadmapService } from '@/services/careerRoadmapService'

export function useCareerAssistant() {
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['careerAssistantSession'],
    queryFn: () => careerRoadmapService.getAssistant(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({ message, context, roadmapId }: { message: string; context?: string; roadmapId?: string }) =>
      careerRoadmapService.sendAssistantMessage(message, context, roadmapId),
    onSuccess: (newData) => {
      queryClient.setQueryData(['careerAssistantSession'], newData)
    },
  })

  return {
    messages: data?.messages || [],
    suggestedPrompts: data?.suggestedPrompts || [],
    insights: data?.insights,
    recommendedActions: data?.recommendedActions || [],
    sessionSummary: data?.sessionSummary,
    isLoading,
    isError,
    error,
    refetch,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  }
}
export default useCareerAssistant
