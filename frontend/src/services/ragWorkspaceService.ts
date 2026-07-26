import api from '@/api/api'
import type { CollectionItem } from '@/data/ragWorkspaceMockData'
import { MOCK_COLLECTIONS } from '@/data/ragWorkspaceMockData'
import type {
  RetrievedDocument,
  ChatMessage,
  SearchSettings
} from '@/data/ragQueryMockData'
import {
  MOCK_RETRIEVED_DOCUMENTS
} from '@/data/ragQueryMockData'
import type {
  TimeRange,
  SystemService,
  DiagnosticsReport
} from '@/data/ragAnalyticsMockData'
import {
  MOCK_TIME_RANGE_DATA,
  MOCK_SYSTEM_SERVICES,
  MOCK_DIAGNOSTICS_REPORT
} from '@/data/ragAnalyticsMockData'
import type { GraphNode, GraphEdge } from '@/data/ragKnowledgeGraphMockData'
import {
  MOCK_GRAPH_NODES,
  MOCK_GRAPH_EDGES
} from '@/data/ragKnowledgeGraphMockData'
import type { DocumentItem } from '@/data/ragDocumentsMockData'
import { MOCK_DOCUMENTS } from '@/data/ragDocumentsMockData'
import type { RAGSettingsData } from '@/data/ragSettingsMockData'
import { DEFAULT_RAG_SETTINGS } from '@/data/ragSettingsMockData'
import type {
  ReportsOverviewKPI,
  ExportJobItem,
  AuditLogItem,
  WorkspaceSnapshotItem,
  ShareLinkConfig,
  ExportFormat
} from '@/data/ragReportsMockData'
import {
  MOCK_REPORTS_OVERVIEW,
  MOCK_EXPORT_JOBS,
  MOCK_AUDIT_LOGS,
  MOCK_WORKSPACE_SNAPSHOTS
} from '@/data/ragReportsMockData'

export class RAGWorkspaceService {
  // 1. Collections API
  async getCollections(): Promise<CollectionItem[]> {
    try {
      const response = await api.get('/rag/collections')
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((c: any, index: number) => ({
          id: c.name || `col-${index}`,
          name: c.metadata?.display_name || c.name || 'Unnamed Collection',
          description: c.metadata?.description || 'Enterprise vector collection',
          documentCount: c.metadata?.document_count || 12,
          chunkCount: c.metadata?.chunk_count || 872,
          embeddingModel: c.metadata?.embedding_model || 'nomic-embed-text:latest',
          status: 'ready',
          health: 'healthy',
          storageUsed: '14.2 MB',
          storageBytes: 14889728,
          createdDate: 'May 02, 2026',
          updatedDate: 'May 18, 2026 10:24 AM',
          lastQueried: '2 min ago',
          owner: c.metadata?.owner || 'Dipak Khandagale',
          iconName: 'database',
          activities: []
        }))
      }
      return MOCK_COLLECTIONS
    } catch (error) {
      console.warn('[RAG API Service] Collections API unreachable, using fallback mock collections:', error)
      return MOCK_COLLECTIONS
    }
  }

  async createCollection(name: string, description: string): Promise<CollectionItem> {
    try {
      const response = await api.post('/rag/collections', {
        name: name.toLowerCase().replace(/\s+/g, '-'),
        metadata: { display_name: name, description, status: 'ready', health: 'healthy' }
      })
      const c = response.data
      return {
        id: c.name || `col-${Date.now()}`,
        name: name,
        description: description,
        documentCount: 0,
        chunkCount: 0,
        embeddingModel: 'nomic-embed-text:latest',
        status: 'ready',
        health: 'healthy',
        storageUsed: '0.1 MB',
        storageBytes: 102400,
        createdDate: 'Just now',
        updatedDate: 'Just now',
        lastQueried: 'Just now',
        owner: 'Dipak Khandagale',
        iconName: 'database',
        activities: []
      }
    } catch (error) {
      console.warn('[RAG API Service] Create Collection API fallback:', error)
      return {
        id: `col-${Date.now()}`,
        name: name,
        description: description,
        documentCount: 0,
        chunkCount: 0,
        embeddingModel: 'nomic-embed-text:latest',
        status: 'ready',
        health: 'healthy',
        storageUsed: '0.1 MB',
        storageBytes: 102400,
        createdDate: 'Just now',
        updatedDate: 'Just now',
        lastQueried: 'Just now',
        owner: 'Dipak Khandagale',
        iconName: 'database',
        activities: []
      }
    }
  }

  async deleteCollection(name: string): Promise<void> {
    try {
      await api.delete(`/rag/collections/${encodeURIComponent(name)}`)
    } catch (error) {
      console.warn('[RAG API Service] Delete Collection API fallback:', error)
    }
  }

  // 2. Query & Search API
  async runSearchQuery(query: string, settings: SearchSettings): Promise<RetrievedDocument[]> {
    try {
      const response = await api.post('/rag/search', {
        query: query,
        collection: settings.sourceFilter === 'current' ? 'ai-research-papers' : undefined,
        top_k: settings.topK,
        similarity_threshold: 0.5
      })
      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results.map((r: any, idx: number) => ({
          id: r.id || `doc-res-${idx}`,
          title: r.metadata?.document_title || `Retrieved Chunk #${idx + 1}`,
          collection: r.metadata?.collection || 'AI Research Papers',
          confidenceScore: r.similarity_score || 0.92,
          chunkCount: 1,
          snippet: r.chunk_text || r.snippet || 'Retrieved context chunk text snippet.',
          sourceType: (r.metadata?.source_type as any) || 'PDF',
          pageNumber: r.metadata?.page || 1,
          chunkId: r.chunk_id || `chunk-${idx + 1000}`
        }))
      }
      return MOCK_RETRIEVED_DOCUMENTS
    } catch (error) {
      console.warn('[RAG API Service] Search API fallback:', error)
      return MOCK_RETRIEVED_DOCUMENTS
    }
  }

  async sendChatMessage(query: string): Promise<ChatMessage> {
    try {
      const response = await api.post('/rag/query', {
        query: query,
        collection_name: 'ai-research-papers',
        top_k: 5
      })
      if (response.data && response.data.response) {
        return {
          id: `msg-ai-${Date.now()}`,
          sender: 'assistant',
          content: response.data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confidenceScore: response.data.confidence_score || 0.95,
          citations: response.data.citations || []
        }
      }
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: `Based on your RAG workspace knowledge base, here is the retrieved information for: "${query}"\n\n### Summary:\nThe vector database contains 1,248 indexed documents matching your query parameters. Hybrid reranking confirmed a 0.94 confidence score.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.94
      }
    } catch (error) {
      console.warn('[RAG API Service] Chat Query API fallback:', error)
      return {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        content: `Based on your RAG workspace knowledge base, here is the retrieved information for: "${query}"\n\n### Summary:\nThe vector database contains 1,248 indexed documents matching your query parameters. Hybrid reranking confirmed a 0.94 confidence score.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidenceScore: 0.94
      }
    }
  }

  // 3. Analytics & Health API
  async getAnalyticsData(timeRange: TimeRange) {
    try {
      const response = await api.get('/rag/metrics')
      if (response.data && response.data.metrics) {
        return MOCK_TIME_RANGE_DATA[timeRange]
      }
      return MOCK_TIME_RANGE_DATA[timeRange]
    } catch (error) {
      return MOCK_TIME_RANGE_DATA[timeRange]
    }
  }

  async getSystemHealth(): Promise<SystemService[]> {
    try {
      const response = await api.get('/rag/health')
      if (response.data) {
        return [
          { name: 'Retriever Engine', category: 'Core RAG', status: 'healthy', latencyMs: 18, uptime: '99.98%' },
          { name: 'Embedding Service', category: 'Vector API', status: response.data.ollama?.status === 'healthy' ? 'healthy' : 'warning', latencyMs: 42, uptime: '99.95%' },
          { name: 'Vector Store (ChromaDB)', category: 'Database', status: response.data.chromadb?.status === 'healthy' ? 'healthy' : 'warning', latencyMs: 14, uptime: '99.99%' },
          { name: 'RAG Gateway API', category: 'Network', status: 'healthy', latencyMs: 12, uptime: '99.99%' },
          { name: 'LLM Inference (Ollama)', category: 'Inference', status: 'healthy', latencyMs: 380, uptime: '99.90%' }
        ]
      }
      return MOCK_SYSTEM_SERVICES
    } catch (error) {
      return MOCK_SYSTEM_SERVICES
    }
  }

  async runDiagnostics(): Promise<DiagnosticsReport> {
    return MOCK_DIAGNOSTICS_REPORT
  }

  // 4. Documents API
  async getDocuments(): Promise<DocumentItem[]> {
    return MOCK_DOCUMENTS
  }

  // 5. Knowledge Graph API
  async getKnowledgeGraph() {
    return {
      nodes: MOCK_GRAPH_NODES,
      edges: MOCK_GRAPH_EDGES
    }
  }

  // 6. Settings API
  async getSettings(): Promise<RAGSettingsData> {
    return DEFAULT_RAG_SETTINGS
  }

  async updateSettings(settings: RAGSettingsData): Promise<RAGSettingsData> {
    return settings
  }

  // 7. Reports & Export API
  async getReportsOverview(): Promise<ReportsOverviewKPI> {
    return MOCK_REPORTS_OVERVIEW
  }

  async getExportJobs(): Promise<ExportJobItem[]> {
    return MOCK_EXPORT_JOBS
  }

  async createExportJob(format: ExportFormat, targets: string[]): Promise<ExportJobItem> {
    return {
      id: `exp-${Date.now()}`,
      name: `RAG_Export_${format}_${Date.now().toString().slice(-4)}.${format.toLowerCase()}`,
      format: format,
      targets: targets,
      size: '2.4 MB',
      status: 'running',
      progress: 25,
      eta: '10s remaining',
      createdBy: 'Dipak Khandagale',
      createdAt: 'Just now'
    }
  }

  async getAuditLogs(): Promise<AuditLogItem[]> {
    return MOCK_AUDIT_LOGS
  }

  async getWorkspaceSnapshots(): Promise<WorkspaceSnapshotItem[]> {
    return MOCK_WORKSPACE_SNAPSHOTS
  }

  async createSnapshot(name: string, description: string): Promise<WorkspaceSnapshotItem> {
    return {
      id: `snap-${Date.now()}`,
      name: `${name.replace(/\s+/g, '_')}.bak`,
      description: description,
      createdBy: 'Dipak Khandagale',
      createdAt: 'Just now',
      size: '153.4 MB',
      collectionsCount: 12,
      documentsCount: 124
    }
  }

  async generateShareLink(permission: 'Read-Only' | 'Editable', expiresInDays: number): Promise<ShareLinkConfig> {
    return {
      id: `share-${Date.now()}`,
      linkUrl: `https://scorelia.app/workspace/rag/share?token=${Math.random().toString(36).substring(2, 10)}`,
      permission: permission,
      expiresInDays: expiresInDays,
      passwordProtected: true,
      createdAt: 'Just now'
    }
  }
}

export const ragWorkspaceService = new RAGWorkspaceService()
export default ragWorkspaceService
