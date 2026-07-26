import api from '@/api/api'
import type { OperationalServiceItem } from '@/data/insightsSystemHealthMockData'
import { mockOperationalServices, mockResourceMetrics } from '@/data/insightsSystemHealthMockData'

export class SystemHealthService {
  async getOperationalServices(): Promise<OperationalServiceItem[]> {
    try {
      const response = await api.get('/system-health/services')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockOperationalServices
  }

  async getResourceMetrics(): Promise<typeof mockResourceMetrics> {
    try {
      const response = await api.get('/system-health/resources')
      if (response.data) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockResourceMetrics
  }
}

export const systemHealthService = new SystemHealthService()
export default systemHealthService
