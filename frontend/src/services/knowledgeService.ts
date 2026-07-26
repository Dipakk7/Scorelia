import api from '@/api/api'
import type { KnowledgeCollectionItem, ConnectedSourceItem } from '@/data/taskAutomationKnowledgeMockData'
import { mockKnowledgeCollections, mockConnectedSources } from '@/data/taskAutomationKnowledgeMockData'

export class KnowledgeService {
  async getCollections(): Promise<KnowledgeCollectionItem[]> {
    try {
      const response = await api.get('/agent-knowledge/collections')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockKnowledgeCollections
  }

  async getSources(): Promise<ConnectedSourceItem[]> {
    try {
      const response = await api.get('/agent-knowledge/sources')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data
      }
    } catch {
      // Fall back
    }
    return mockConnectedSources
  }

  async assignCollectionToAgent(collectionId: string, agentName: string): Promise<void> {
    try {
      await api.post('/agent-knowledge/assign', { collectionId, agentName })
    } catch {
      // Fall back
    }
  }
}

export const knowledgeService = new KnowledgeService()
export default knowledgeService
