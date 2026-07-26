import api from '@/api/api'
import type { AgentConsoleItem } from '@/data/agentConsoleMockData'
import { mockAgentsData } from '@/data/agentConsoleMockData'

export class AgentService {
  async getAgents(): Promise<AgentConsoleItem[]> {
    try {
      const response = await api.get('/agents')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back to centralized mock data if endpoint is not live yet
    }
    return mockAgentsData
  }

  async getAgentById(id: string): Promise<AgentConsoleItem | null> {
    try {
      const response = await api.get(`/agents/${id}`)
      if (response.data) return response.data
    } catch {
      // Fall back
    }
    return mockAgentsData.find((a) => a.id === id) || null
  }

  async createAgent(agentData: Partial<AgentConsoleItem>): Promise<AgentConsoleItem> {
    try {
      const response = await api.post('/agents', agentData)
      if (response.data) return response.data
    } catch {
      // Fall back
    }
    const newAgent: AgentConsoleItem = {
      id: `agent-${Date.now()}`,
      name: agentData.name || 'New AI Agent',
      description: agentData.description || 'Custom AI assistant',
      category: agentData.category || 'General',
      status: agentData.status || 'active',
      successRate: 98.0,
      tasksCompleted: 0,
      avgResponseTime: '0.95s',
      lastActive: 'Just now',
      capabilities: agentData.capabilities || ['Task Execution', 'Context Processing'],
      creditsUsed: 10,
      iconBg: 'bg-purple-600',
      tags: agentData.tags || ['Custom'],
      recentActivity: [{ id: '1', timestamp: 'Just now', action: 'Agent created', type: 'success' }],
    }
    return newAgent
  }

  async updateAgentStatus(id: string, status: AgentConsoleItem['status']): Promise<void> {
    try {
      await api.patch(`/agents/${id}/status`, { status })
    } catch {
      // Fall back
    }
  }

  async deleteAgent(id: string): Promise<void> {
    try {
      await api.delete(`/agents/${id}`)
    } catch {
      // Fall back
    }
  }
}

export const agentService = new AgentService()
export default agentService
