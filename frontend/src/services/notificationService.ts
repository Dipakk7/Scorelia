import api from '@/api/api'
import type { NotificationItem } from '@/data/insightsSystemHealthMockData'
import { mockNotificationsList } from '@/data/insightsSystemHealthMockData'

export class NotificationService {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const response = await api.get('/notifications')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockNotificationsList
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/read`)
    } catch {
      // Fall back
    }
  }

  async dismissNotification(id: string): Promise<void> {
    try {
      await api.delete(`/notifications/${id}`)
    } catch {
      // Fall back
    }
  }
}

export const notificationService = new NotificationService()
export default notificationService
