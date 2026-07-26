import api from '@/api/api'
import type { AutomationItem } from '@/data/taskAutomationKnowledgeMockData'
import { mockAutomationsData } from '@/data/taskAutomationKnowledgeMockData'

export class AutomationService {
  async getAutomations(): Promise<AutomationItem[]> {
    try {
      const response = await api.get('/automations')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockAutomationsData
  }

  async toggleAutomationEnable(id: string): Promise<void> {
    try {
      await api.patch(`/automations/${id}/toggle-enable`)
    } catch {
      // Fall back
    }
  }

  async deleteAutomation(id: string): Promise<void> {
    try {
      await api.delete(`/automations/${id}`)
    } catch {
      // Fall back
    }
  }
}

export const automationService = new AutomationService()
export default automationService
