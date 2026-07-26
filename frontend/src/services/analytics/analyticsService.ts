import api from '@/api/api'
import type {
  ApiAnalyticsOverviewResponse,
  ApiPlatformActivityResponse,
  ApiActiveUsersResponse,
  ApiTopFeaturesResponse,
  ApiPerformanceResponse,
  ApiSystemHealthResponse,
  ApiReportsDashboardResponse,
  ApiReportHistoryResponse,
  ApiDataSourcesResponse,
  ApiAIInsightsResponse,
  ApiAnalyticsActivityResponse,
} from './analyticsTypes'

export class AnalyticsCenterService {
  async getOverview(): Promise<ApiAnalyticsOverviewResponse> {
    const response = await api.get<ApiAnalyticsOverviewResponse>('/analytics/overview')
    return response.data
  }

  async getPlatformActivity(): Promise<ApiPlatformActivityResponse> {
    const response = await api.get<ApiPlatformActivityResponse>('/analytics/platform-activity')
    return response.data
  }

  async getActiveUsers(): Promise<ApiActiveUsersResponse> {
    const response = await api.get<ApiActiveUsersResponse>('/analytics/active-users')
    return response.data
  }

  async getTopFeatures(): Promise<ApiTopFeaturesResponse> {
    const response = await api.get<ApiTopFeaturesResponse>('/analytics/top-features')
    return response.data
  }

  async getPerformance(): Promise<ApiPerformanceResponse> {
    const response = await api.get<ApiPerformanceResponse>('/analytics/performance')
    return response.data
  }

  async getSystemHealth(): Promise<ApiSystemHealthResponse> {
    const response = await api.get<ApiSystemHealthResponse>('/analytics/system-health')
    return response.data
  }

  async getReports(): Promise<ApiReportsDashboardResponse> {
    const response = await api.get<ApiReportsDashboardResponse>('/analytics/reports')
    return response.data
  }

  async getReportHistory(): Promise<ApiReportHistoryResponse> {
    const response = await api.get<ApiReportHistoryResponse>('/analytics/report-history')
    return response.data
  }

  async getDataSources(): Promise<ApiDataSourcesResponse> {
    const response = await api.get<ApiDataSourcesResponse>('/analytics/data-sources')
    return response.data
  }

  async getAIInsights(): Promise<ApiAIInsightsResponse> {
    const response = await api.get<ApiAIInsightsResponse>('/analytics/insights')
    return response.data
  }

  async getActivity(): Promise<ApiAnalyticsActivityResponse> {
    const response = await api.get<ApiAnalyticsActivityResponse>('/analytics/activity')
    return response.data
  }
}

export const analyticsCenterService = new AnalyticsCenterService()
export default analyticsCenterService
