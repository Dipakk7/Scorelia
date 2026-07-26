import api from '@/api/api'
import type { TaskItem } from '@/data/taskAutomationKnowledgeMockData'
import { mockTasksData } from '@/data/taskAutomationKnowledgeMockData'

export class TaskService {
  async getTasks(): Promise<TaskItem[]> {
    try {
      const response = await api.get('/agent-tasks')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockTasksData
  }

  async toggleTaskStatus(id: string): Promise<void> {
    try {
      await api.patch(`/agent-tasks/${id}/toggle-status`)
    } catch {
      // Fall back
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/agent-tasks/${id}`)
    } catch {
      // Fall back
    }
  }
}

export const taskService = new TaskService()
export default taskService
