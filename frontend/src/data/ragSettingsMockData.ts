export interface RetrievalSettingsConfig {
  defaultSearchType: 'Hybrid' | 'Semantic' | 'Keyword'
  defaultTopK: number
  defaultTemperature: number
  rerankEnabled: boolean
  citationMode: 'Verbose' | 'Compact' | 'Minimal'
}

export interface EmbeddingSettingsConfig {
  provider: 'Nomic AI' | 'OpenAI' | 'Cohere' | 'Ollama Local'
  model: string
  dimension: number
  batchSize: number
}

export interface ChunkingSettingsConfig {
  chunkSize: number
  overlap: number
  splitStrategy: 'Recursive Character' | 'Token Based' | 'Markdown Heading' | 'Semantic Paragraph'
  includeMetadata: boolean
}

export interface IndexSettingsConfig {
  autoIndex: boolean
  backgroundProcessing: boolean
  incrementalIndexing: boolean
  reindexThresholdDays: number
}

export interface SecuritySettingsConfig {
  visibility: 'Private' | 'Team Shared' | 'Organization Wide'
  rolePermissions: 'Admin Only' | 'Editor & Admin' | 'All Members'
  apiAccessEnabled: boolean
  auditLogsEnabled: boolean
}

export interface NotificationSettingsConfig {
  onProcessingComplete: boolean
  onIndexFailure: boolean
  onDiagnosticsWarning: boolean
  weeklyDigest: boolean
}

export interface WorkspacePreferencesConfig {
  theme: 'Dark Standard' | 'Midnight Glass' | 'Cyber Purple'
  density: 'Comfortable' | 'Compact' | 'Spacious'
  defaultView: 'Collections' | 'Query Playground' | 'Analytics'
  animationsEnabled: boolean
}

export interface RAGSettingsData {
  retrieval: RetrievalSettingsConfig
  embedding: EmbeddingSettingsConfig
  chunking: ChunkingSettingsConfig
  index: IndexSettingsConfig
  security: SecuritySettingsConfig
  notifications: NotificationSettingsConfig
  preferences: WorkspacePreferencesConfig
}

export const DEFAULT_RAG_SETTINGS: RAGSettingsData = {
  retrieval: {
    defaultSearchType: 'Hybrid',
    defaultTopK: 5,
    defaultTemperature: 0.2,
    rerankEnabled: true,
    citationMode: 'Verbose'
  },
  embedding: {
    provider: 'Ollama Local',
    model: 'nomic-embed-text:latest',
    dimension: 768,
    batchSize: 32
  },
  chunking: {
    chunkSize: 1024,
    overlap: 100,
    splitStrategy: 'Recursive Character',
    includeMetadata: true
  },
  index: {
    autoIndex: true,
    backgroundProcessing: true,
    incrementalIndexing: true,
    reindexThresholdDays: 30
  },
  security: {
    visibility: 'Team Shared',
    rolePermissions: 'Editor & Admin',
    apiAccessEnabled: true,
    auditLogsEnabled: true
  },
  notifications: {
    onProcessingComplete: true,
    onIndexFailure: true,
    onDiagnosticsWarning: true,
    weeklyDigest: false
  },
  preferences: {
    theme: 'Midnight Glass',
    density: 'Comfortable',
    defaultView: 'Collections',
    animationsEnabled: true
  }
}
