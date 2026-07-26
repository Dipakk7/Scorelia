import api from '@/api/api'
import type { InsightItem, ActivityTimelineItem } from '@/data/insightsSystemHealthMockData'
import { mockInsightsList, mockActivityTimeline } from '@/data/insightsSystemHealthMockData'

export class InsightsService {
  async getInsights(): Promise<InsightItem[]> {
    try {
      const response = await api.get('/agent-insights')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockInsightsList
  }

  async getActivityTimeline(): Promise<ActivityTimelineItem[]> {
    try {
      const response = await api.get('/agent-insights/activity')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockActivityTimeline
  }

  async applyFix(insightId: string): Promise<void> {
    try {
      await api.post(`/agent-insights/${insightId}/apply-fix`)
    } catch {
      // Fall back
    }
  }
}

export const insightsService = new InsightsService()
export default insightsService
