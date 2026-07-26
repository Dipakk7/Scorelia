import api from '@/api/api'
import type { DailyPerformancePoint, TaskDistributionPoint, TopAgentRankingPoint } from '@/data/performanceAnalyticsMockData'
import {
  mock90DayPerformanceData,
  mock24HourPerformanceData,
  mockTaskDistribution,
  mockTopAgentsRanked,
  mockAnalyticsSummary,
} from '@/data/performanceAnalyticsMockData'

export class AnalyticsService {
  async getPerformanceTimeline(timeRange: string): Promise<DailyPerformancePoint[]> {
    try {
      const response = await api.get(`/agent-analytics/timeline?range=${timeRange}`)
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return timeRange === '24h' ? mock24HourPerformanceData : mock90DayPerformanceData
  }

  async getTaskDistribution(): Promise<TaskDistributionPoint[]> {
    try {
      const response = await api.get('/agent-analytics/task-distribution')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockTaskDistribution
  }

  async getTopAgents(): Promise<TopAgentRankingPoint[]> {
    try {
      const response = await api.get('/agent-analytics/top-agents')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockTopAgentsRanked
  }

  async getAnalyticsSummary(): Promise<typeof mockAnalyticsSummary> {
    try {
      const response = await api.get('/agent-analytics/summary')
      if (response.data) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockAnalyticsSummary
  }
}

export const analyticsService = new AnalyticsService()
export default analyticsService
