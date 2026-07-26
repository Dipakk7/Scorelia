import { useQuery } from '@tanstack/react-query'
import { analyticsCenterService } from './analyticsService'
import { analyticsKeys } from './analyticsKeys'
import {
  transformOverviewData,
  transformChartsData,
  transformPerformanceData,
  transformInsightsData,
  transformReportsData,
} from './analyticsTransformers'
import { analyticsHeroMockData } from '@/data/analyticsHeroMockData'
import { analyticsChartsMockData } from '@/data/analyticsChartsMockData'
import { analyticsPerformanceMockData } from '@/data/analyticsPerformanceMockData'
import { analyticsInsightsMockData } from '@/data/analyticsInsightsMockData'
import { analyticsReportsMockData } from '@/data/analyticsReportsMockData'

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: () => analyticsCenterService.getOverview(),
    select: (data) => transformOverviewData(data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function usePlatformActivity() {
  return useQuery({
    queryKey: analyticsKeys.platformActivity(),
    queryFn: () => analyticsCenterService.getPlatformActivity(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useActiveUsers() {
  return useQuery({
    queryKey: analyticsKeys.activeUsers(),
    queryFn: () => analyticsCenterService.getActiveUsers(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useTopFeatures() {
  return useQuery({
    queryKey: analyticsKeys.topFeatures(),
    queryFn: () => analyticsCenterService.getTopFeatures(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useAnalyticsChartsWorkspace() {
  const platformQuery = usePlatformActivity()
  const activeUsersQuery = useActiveUsers()
  const topFeaturesQuery = useTopFeatures()

  const isLoading = platformQuery.isLoading || activeUsersQuery.isLoading || topFeaturesQuery.isLoading
  const isError = platformQuery.isError && activeUsersQuery.isError && topFeaturesQuery.isError

  const data = transformChartsData(
    platformQuery.data,
    activeUsersQuery.data,
    topFeaturesQuery.data
  )

  const hasData =
    data.platformActivity.length > 0 ||
    data.activeUsersGrowth.length > 0 ||
    data.topFeatures.length > 0

  return {
    data: hasData ? data : analyticsChartsMockData,
    isLoading,
    isError,
    refetch: () => {
      platformQuery.refetch()
      activeUsersQuery.refetch()
      topFeaturesQuery.refetch()
    },
  }
}

export function usePerformance() {
  return useQuery({
    queryKey: analyticsKeys.performance(),
    queryFn: () => analyticsCenterService.getPerformance(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: analyticsKeys.systemHealth(),
    queryFn: () => analyticsCenterService.getSystemHealth(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function usePerformanceDashboard() {
  const perfQuery = usePerformance()
  const healthQuery = useSystemHealth()

  const isLoading = perfQuery.isLoading || healthQuery.isLoading
  const isError = perfQuery.isError && healthQuery.isError

  const data = transformPerformanceData(perfQuery.data, healthQuery.data)
  const hasData = data.metrics.length > 0 || data.healthServices.length > 0

  return {
    data: hasData ? data : analyticsPerformanceMockData,
    isLoading,
    isError,
    refetch: () => {
      perfQuery.refetch()
      healthQuery.refetch()
    },
  }
}

export function useReports() {
  return useQuery({
    queryKey: analyticsKeys.reports(),
    queryFn: () => analyticsCenterService.getReports(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useReportHistory() {
  return useQuery({
    queryKey: analyticsKeys.reportHistory(),
    queryFn: () => analyticsCenterService.getReportHistory(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useDataSources() {
  return useQuery({
    queryKey: analyticsKeys.dataSources(),
    queryFn: () => analyticsCenterService.getDataSources(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useReportsWorkspace() {
  const reportsQuery = useReports()
  const historyQuery = useReportHistory()
  const sourcesQuery = useDataSources()

  const isLoading = reportsQuery.isLoading || historyQuery.isLoading || sourcesQuery.isLoading
  const isError = reportsQuery.isError && historyQuery.isError && sourcesQuery.isError

  const data = transformReportsData(reportsQuery.data, historyQuery.data, sourcesQuery.data)
  const hasData = data.overview.length > 0 || data.templates.length > 0

  return {
    data: hasData ? data : analyticsReportsMockData,
    isLoading,
    isError,
    refetch: () => {
      reportsQuery.refetch()
      historyQuery.refetch()
      sourcesQuery.refetch()
    },
  }
}

export function useAnalyticsInsights() {
  return useQuery({
    queryKey: analyticsKeys.insights(),
    queryFn: () => analyticsCenterService.getAIInsights(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useAnalyticsActivity() {
  return useQuery({
    queryKey: analyticsKeys.activity(),
    queryFn: () => analyticsCenterService.getActivity(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useInsightsWorkspace() {
  const insightsQuery = useAnalyticsInsights()
  const activityQuery = useAnalyticsActivity()

  const isLoading = insightsQuery.isLoading || activityQuery.isLoading
  const isError = insightsQuery.isError && activityQuery.isError

  const data = transformInsightsData(insightsQuery.data, activityQuery.data)
  const hasData = data.insights.length > 0 || data.timelineItems.length > 0

  return {
    data: hasData ? data : analyticsInsightsMockData,
    isLoading,
    isError,
    refetch: () => {
      insightsQuery.refetch()
      activityQuery.refetch()
    },
  }
}
