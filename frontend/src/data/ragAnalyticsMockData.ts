export type TimeRange = '1h' | '24h' | '7d' | '30d'

export interface AnalyticsKPI {
  latencyMs: number
  latencyTrend: string
  queriesProcessed: number
  queriesTrend: string
  avgSimilarity: number
  similarityBadge: string
  accuracyPercent: number
  accuracyTrend: string
  indexedChunks: number
  chunksStatus: string
  storageUsedMB: number
  storageTrend: string
}

export interface LatencyDataPoint {
  time: string
  latencyMs: number
  p95LatencyMs: number
  targetMs: number
}

export interface ThroughputDataPoint {
  time: string
  queriesPerSec: number
  successfulQueries: number
  failedQueries: number
}

export interface SearchTrendDataPoint {
  date: string
  hybridQueries: number
  semanticQueries: number
  keywordQueries: number
}

export interface SimilarityDistributionBucket {
  bucket: string // e.g. "0.0 - 0.2", "0.2 - 0.4", etc.
  count: number
}

export interface SystemService {
  name: string
  category: string
  status: 'healthy' | 'warning' | 'offline'
  latencyMs: number
  uptime: string
}

export interface ResourceUsage {
  cpuPercent: number
  ramUsedGB: number
  ramTotalGB: number
  diskUsedMB: number
  diskTotalMB: number
}

export interface EmbeddingStats {
  modelName: string
  totalVectors: number
  dimensions: number
  avgVectorBytes: number
  lastUpdated: string
}

export interface IndexHealth {
  totalIndexes: number
  healthyCount: number
  pendingCount: number
  failedCount: number
  lastScan: string
}

export interface ActivityEvent {
  id: string
  title: string
  description: string
  timestamp: string
  user: string
  iconType: 'index' | 'query' | 'embed' | 'update' | 'sync'
}

export interface DiagnosticsReport {
  lastRun: string
  indexConsistencyPercent: number
  missingEmbeddingsCount: number
  duplicateChunksCount: number
  brokenReferencesCount: number
  overallScore: number
}

export interface OperationalAlert {
  id: string
  type: 'info' | 'success' | 'warning' | 'critical'
  title: string
  description: string
  timestamp: string
}

export const MOCK_TIME_RANGE_DATA: Record<TimeRange, {
  kpi: AnalyticsKPI
  latency: LatencyDataPoint[]
  throughput: ThroughputDataPoint[]
  searchTrends: SearchTrendDataPoint[]
}> = {
  '1h': {
    kpi: {
      latencyMs: 112,
      latencyTrend: '↓ 15%',
      queriesProcessed: 1420,
      queriesTrend: '↑ 22%',
      avgSimilarity: 0.93,
      similarityBadge: 'Excellent',
      accuracyPercent: 98.1,
      accuracyTrend: '↑ 2.1%',
      indexedChunks: 8732,
      chunksStatus: 'Healthy',
      storageUsedMB: 153.4,
      storageTrend: '+2.1 MB'
    },
    latency: [
      { time: '10:00', latencyMs: 128, p95LatencyMs: 180, targetMs: 150 },
      { time: '10:10', latencyMs: 118, p95LatencyMs: 165, targetMs: 150 },
      { time: '10:20', latencyMs: 110, p95LatencyMs: 155, targetMs: 150 },
      { time: '10:30', latencyMs: 105, p95LatencyMs: 148, targetMs: 150 },
      { time: '10:40', latencyMs: 114, p95LatencyMs: 160, targetMs: 150 },
      { time: '10:50', latencyMs: 112, p95LatencyMs: 152, targetMs: 150 }
    ],
    throughput: [
      { time: '10:00', queriesPerSec: 24, successfulQueries: 23, failedQueries: 1 },
      { time: '10:10', queriesPerSec: 32, successfulQueries: 31, failedQueries: 1 },
      { time: '10:20', queriesPerSec: 45, successfulQueries: 44, failedQueries: 1 },
      { time: '10:30', queriesPerSec: 38, successfulQueries: 38, failedQueries: 0 },
      { time: '10:40', queriesPerSec: 41, successfulQueries: 40, failedQueries: 1 },
      { time: '10:50', queriesPerSec: 29, successfulQueries: 29, failedQueries: 0 }
    ],
    searchTrends: [
      { date: '10:00', hybridQueries: 18, semanticQueries: 4, keywordQueries: 2 },
      { date: '10:15', hybridQueries: 25, semanticQueries: 5, keywordQueries: 2 },
      { date: '10:30', hybridQueries: 30, semanticQueries: 6, keywordQueries: 2 },
      { date: '10:45', hybridQueries: 22, semanticQueries: 5, keywordQueries: 2 }
    ]
  },
  '24h': {
    kpi: {
      latencyMs: 128,
      latencyTrend: '↓ 12%',
      queriesProcessed: 18432,
      queriesTrend: '↑ 18%',
      avgSimilarity: 0.91,
      similarityBadge: 'Excellent',
      accuracyPercent: 97.3,
      accuracyTrend: '↑ 1.8%',
      indexedChunks: 8732,
      chunksStatus: 'Healthy',
      storageUsedMB: 153.4,
      storageTrend: '+12 MB'
    },
    latency: [
      { time: '00:00', latencyMs: 145, p95LatencyMs: 195, targetMs: 150 },
      { time: '04:00', latencyMs: 130, p95LatencyMs: 175, targetMs: 150 },
      { time: '08:00', latencyMs: 122, p95LatencyMs: 160, targetMs: 150 },
      { time: '12:00', latencyMs: 135, p95LatencyMs: 182, targetMs: 150 },
      { time: '16:00', latencyMs: 125, p95LatencyMs: 168, targetMs: 150 },
      { time: '20:00', latencyMs: 118, p95LatencyMs: 158, targetMs: 150 }
    ],
    throughput: [
      { time: '00:00', queriesPerSec: 15, successfulQueries: 14, failedQueries: 1 },
      { time: '04:00', queriesPerSec: 10, successfulQueries: 10, failedQueries: 0 },
      { time: '08:00', queriesPerSec: 52, successfulQueries: 50, failedQueries: 2 },
      { time: '12:00', queriesPerSec: 68, successfulQueries: 66, failedQueries: 2 },
      { time: '16:00', queriesPerSec: 44, successfulQueries: 43, failedQueries: 1 },
      { time: '20:00', queriesPerSec: 28, successfulQueries: 27, failedQueries: 1 }
    ],
    searchTrends: [
      { date: '00:00', hybridQueries: 120, semanticQueries: 40, keywordQueries: 15 },
      { date: '06:00', hybridQueries: 80, semanticQueries: 25, keywordQueries: 10 },
      { date: '12:00', hybridQueries: 450, semanticQueries: 120, keywordQueries: 45 },
      { date: '18:00', hybridQueries: 310, semanticQueries: 85, keywordQueries: 25 }
    ]
  },
  '7d': {
    kpi: {
      latencyMs: 134,
      latencyTrend: '↓ 8%',
      queriesProcessed: 112500,
      queriesTrend: '↑ 14%',
      avgSimilarity: 0.90,
      similarityBadge: 'Excellent',
      accuracyPercent: 96.8,
      accuracyTrend: '↑ 1.2%',
      indexedChunks: 8732,
      chunksStatus: 'Healthy',
      storageUsedMB: 153.4,
      storageTrend: '+45 MB'
    },
    latency: [
      { time: 'Mon', latencyMs: 142, p95LatencyMs: 190, targetMs: 150 },
      { time: 'Tue', latencyMs: 138, p95LatencyMs: 185, targetMs: 150 },
      { time: 'Wed', latencyMs: 132, p95LatencyMs: 178, targetMs: 150 },
      { time: 'Thu', latencyMs: 128, p95LatencyMs: 170, targetMs: 150 },
      { time: 'Fri', latencyMs: 135, p95LatencyMs: 180, targetMs: 150 },
      { time: 'Sat', latencyMs: 120, p95LatencyMs: 160, targetMs: 150 },
      { time: 'Sun', latencyMs: 118, p95LatencyMs: 155, targetMs: 150 }
    ],
    throughput: [
      { time: 'Mon', queriesPerSec: 42, successfulQueries: 41, failedQueries: 1 },
      { time: 'Tue', queriesPerSec: 48, successfulQueries: 46, failedQueries: 2 },
      { time: 'Wed', queriesPerSec: 55, successfulQueries: 53, failedQueries: 2 },
      { time: 'Thu', queriesPerSec: 62, successfulQueries: 60, failedQueries: 2 },
      { time: 'Fri', queriesPerSec: 58, successfulQueries: 56, failedQueries: 2 },
      { time: 'Sat', queriesPerSec: 30, successfulQueries: 29, failedQueries: 1 },
      { time: 'Sun', queriesPerSec: 25, successfulQueries: 25, failedQueries: 0 }
    ],
    searchTrends: [
      { date: 'Mon', hybridQueries: 1400, semanticQueries: 400, keywordQueries: 150 },
      { date: 'Wed', hybridQueries: 1850, semanticQueries: 520, keywordQueries: 180 },
      { date: 'Fri', hybridQueries: 1650, semanticQueries: 480, keywordQueries: 160 },
      { date: 'Sun', hybridQueries: 900, semanticQueries: 260, keywordQueries: 90 }
    ]
  },
  '30d': {
    kpi: {
      latencyMs: 140,
      latencyTrend: '↓ 5%',
      queriesProcessed: 480000,
      queriesTrend: '↑ 28%',
      avgSimilarity: 0.89,
      similarityBadge: 'Good',
      accuracyPercent: 96.2,
      accuracyTrend: '↑ 0.9%',
      indexedChunks: 8732,
      chunksStatus: 'Healthy',
      storageUsedMB: 153.4,
      storageTrend: '+120 MB'
    },
    latency: [
      { time: 'Week 1', latencyMs: 148, p95LatencyMs: 198, targetMs: 150 },
      { time: 'Week 2', latencyMs: 142, p95LatencyMs: 188, targetMs: 150 },
      { time: 'Week 3', latencyMs: 136, p95LatencyMs: 180, targetMs: 150 },
      { time: 'Week 4', latencyMs: 130, p95LatencyMs: 172, targetMs: 150 }
    ],
    throughput: [
      { time: 'Week 1', queriesPerSec: 38, successfulQueries: 36, failedQueries: 2 },
      { time: 'Week 2', queriesPerSec: 45, successfulQueries: 43, failedQueries: 2 },
      { time: 'Week 3', queriesPerSec: 52, successfulQueries: 50, failedQueries: 2 },
      { time: 'Week 4', queriesPerSec: 60, successfulQueries: 58, failedQueries: 2 }
    ],
    searchTrends: [
      { date: 'Week 1', hybridQueries: 5200, semanticQueries: 1500, keywordQueries: 600 },
      { date: 'Week 2', hybridQueries: 6400, semanticQueries: 1800, keywordQueries: 750 },
      { date: 'Week 3', hybridQueries: 7800, semanticQueries: 2200, keywordQueries: 890 },
      { date: 'Week 4', hybridQueries: 9100, semanticQueries: 2600, keywordQueries: 1050 }
    ]
  }
}

export const MOCK_SIMILARITY_DISTRIBUTION: SimilarityDistributionBucket[] = [
  { bucket: '0.0 - 0.4', count: 42 },
  { bucket: '0.4 - 0.6', count: 185 },
  { bucket: '0.6 - 0.8', count: 640 },
  { bucket: '0.8 - 0.9', count: 1420 },
  { bucket: '0.9 - 1.0', count: 2890 }
]

export const MOCK_CONFIDENCE_BREAKDOWN = [
  { label: 'High Confidence (>0.85)', percentage: 78, count: 2450, color: '#10b981' },
  { label: 'Medium Confidence (0.65-0.85)', percentage: 17, count: 530, color: '#f59e0b' },
  { label: 'Low Confidence (<0.65)', percentage: 5, count: 162, color: '#f43f5e' }
]

export const MOCK_SYSTEM_SERVICES: SystemService[] = [
  { name: 'Retriever Engine', category: 'Core RAG', status: 'healthy', latencyMs: 18, uptime: '99.98%' },
  { name: 'Embedding Service', category: 'Vector API', status: 'healthy', latencyMs: 42, uptime: '99.95%' },
  { name: 'Vector Store (ChromaDB)', category: 'Database', status: 'healthy', latencyMs: 14, uptime: '99.99%' },
  { name: 'RAG Gateway API', category: 'Network', status: 'healthy', latencyMs: 12, uptime: '99.99%' },
  { name: 'LLM Inference (Ollama)', category: 'Inference', status: 'healthy', latencyMs: 380, uptime: '99.90%' }
]

export const MOCK_RESOURCE_USAGE: ResourceUsage = {
  cpuPercent: 32,
  ramUsedGB: 4.2,
  ramTotalGB: 16.0,
  diskUsedMB: 153.4,
  diskTotalMB: 10240
}

export const MOCK_EMBEDDING_STATS: EmbeddingStats = {
  modelName: 'nomic-embed-text:latest',
  totalVectors: 8732,
  dimensions: 768,
  avgVectorBytes: 3072,
  lastUpdated: '2 min ago'
}

export const MOCK_INDEX_HEALTH: IndexHealth = {
  totalIndexes: 12,
  healthyCount: 10,
  pendingCount: 1,
  failedCount: 1,
  lastScan: '10 min ago'
}

export const MOCK_ACTIVITY_FEED: ActivityEvent[] = [
  {
    id: 'evt-1',
    title: 'Collection Re-indexed',
    description: 'AI Research Papers collection re-indexed (124 docs, 872 chunks).',
    timestamp: '2 min ago',
    user: 'Dipak Khandagale',
    iconType: 'index'
  },
  {
    id: 'evt-2',
    title: 'Hybrid Query Executed',
    description: 'Query "What is Retrieval-Augmented Generation?" returned 5 chunks.',
    timestamp: '15 min ago',
    user: 'System Worker',
    iconType: 'query'
  },
  {
    id: 'evt-3',
    title: 'Embedding Model Updated',
    description: 'Updated default embedding provider to nomic-embed-text:latest.',
    timestamp: '1 hr ago',
    user: 'Admin',
    iconType: 'embed'
  },
  {
    id: 'evt-4',
    title: 'Auto-backup Completed',
    description: 'Snapshot created for 12 collections (153.4 MB).',
    timestamp: '2 hrs ago',
    user: 'Backup Task',
    iconType: 'sync'
  },
  {
    id: 'evt-5',
    title: 'Notion Integration Synced',
    description: 'Imported 14 new documents into Company Knowledge Base.',
    timestamp: '3 hrs ago',
    user: 'Notion Sync',
    iconType: 'update'
  }
]

export const MOCK_DIAGNOSTICS_REPORT: DiagnosticsReport = {
  lastRun: 'Today, 10:15 AM',
  indexConsistencyPercent: 100,
  missingEmbeddingsCount: 0,
  duplicateChunksCount: 2,
  brokenReferencesCount: 0,
  overallScore: 98
}

export const MOCK_OPERATIONAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt-1',
    type: 'warning',
    title: 'High Vector Storage Growth',
    description: 'Storage increased by +12 MB in the last 24 hours. Consider archiving old collections.',
    timestamp: '10 min ago'
  },
  {
    id: 'alt-2',
    type: 'info',
    title: 'Auto-Backup Verified',
    description: 'Weekly automated snapshot completed successfully with zero integrity errors.',
    timestamp: '2 hrs ago'
  },
  {
    id: 'alt-3',
    type: 'critical',
    title: 'Support Knowledge Sync Error',
    description: 'Embedding generation timed out for collection "Support Knowledge". 1 collection needs attention.',
    timestamp: '5 hrs ago'
  }
]
