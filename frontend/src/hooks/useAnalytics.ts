import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '@/services/analyticsService'

export function useAnalytics(timeRange: string = '7d') {
  const { data: timeline = [], isLoading: isLoadingTimeline } = useQuery({
    queryKey: ['agentAnalyticsTimeline', timeRange],
    queryFn: () => analyticsService.getPerformanceTimeline(timeRange),
    staleTime: 1000 * 60 * 5,
  })

  const { data: taskDistribution = [], isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['agentAnalyticsTaskDistribution'],
    queryFn: () => analyticsService.getTaskDistribution(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: topAgents = [], isLoading: isLoadingTopAgents } = useQuery({
    queryKey: ['agentAnalyticsTopAgents'],
    queryFn: () => analyticsService.getTopAgents(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['agentAnalyticsSummary'],
    queryFn: () => analyticsService.getAnalyticsSummary(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    timeline,
    taskDistribution,
    topAgents,
    summary,
    isLoading: isLoadingTimeline || isLoadingDistribution || isLoadingTopAgents || isLoadingSummary,
  }
}

export default useAnalytics
