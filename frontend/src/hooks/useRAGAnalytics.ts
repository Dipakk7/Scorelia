import { useQuery } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'
import type { TimeRange } from '@/data/ragAnalyticsMockData'

export function useRAGAnalytics(timeRange: TimeRange = '24h') {
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['ragAnalytics', timeRange],
    queryFn: () => ragWorkspaceService.getAnalyticsData(timeRange),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false
  })

  const { data: systemServices = [], isLoading: isServicesLoading } = useQuery({
    queryKey: ['ragSystemHealth'],
    queryFn: () => ragWorkspaceService.getSystemHealth(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60 // poll every minute
  })

  return {
    analyticsData,
    systemServices,
    isLoading: isAnalyticsLoading || isServicesLoading
  }
}

export default useRAGAnalytics
