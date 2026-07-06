export interface MetadataFilter {
  collection?: string
  document_id?: string | string[]
  file_type?: string | string[]
  page_number?: number | number[]
  section?: string | string[]
  source?: string | string[]
  version?: string | string[]
  start_date?: string
  end_date?: string
}

export interface SearchRequest {
  query: string
  collection: string
  top_k?: number
  similarity_threshold?: number
  filters?: MetadataFilter
}

export interface RetrievedChunk {
  chunk_id: string
  document_id: string
  similarity_score: number
  content: string
  page?: number
  section?: string
  heading?: string
  source?: string
  chunk_index: number
  embedding_model: string
  collection?: string
}

export interface SearchMetadata {
  total_retrieved: number
  latency_ms: number
  embedding_model: string
  similarity_threshold: number
  top_k: number
}

export interface SearchResponse {
  query: string
  collection: string
  chunks: RetrievedChunk[]
  metadata: SearchMetadata
}

export interface Citation {
  document_id: string
  chunk_id: string
  source_file?: string
  page_number?: number
  section?: string
  heading?: string
  collection?: string
  similarity_score: number
}

export interface ContextDocument {
  document_id: string
  source?: string
  combined_text: string
  chunks: RetrievedChunk[]
}

export interface PromptMetadata {
  template_name: string
  system_instructions?: string
  prompt_size: number
  variables: Record<string, any>
}

export interface GenerationMetadata {
  model: string
  provider: string
  latency_ms: number
  temperature: number
  top_p: number
}

export interface TokenUsage {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
}

export interface RAGRequest {
  question: string
  collection?: string
  collections?: string[]
  strategy?: string
  top_k?: number
  similarity_threshold?: number
  temperature?: number
  top_p?: number
  max_output_tokens?: number
  prompt_template?: string
  history?: Record<string, string>[]
}

export interface RAGResponse {
  answer: string
  context_documents: ContextDocument[]
  prompt_metadata: PromptMetadata
  generation_metadata: GenerationMetadata
  token_usage: TokenUsage
  retrieved_document_count: number
  retrieved_chunk_count: number
  context_size: number
  prompt_size: number
  latency_ms: number
  model: string
  citations: Citation[]
  request_id?: string
  cache_status?: string
}

export interface CollectionResponse {
  name: string
  metadata?: Record<string, any>
  count?: number
}

export interface RAGHealthResponse {
  status: string
  chromadb: {
    status: string
    heartbeat: number
    storage_dir?: string
  }
  ollama: {
    status: string
    model?: string
    [key: string]: any
  }
  timestamp: string
}

export interface KnowledgeBaseInfo {
  key: string
  display_name: string
  description?: string
  collection_name: string
  enabled: boolean
  is_default: boolean
  version?: string
  metadata?: Record<string, any>
}

export interface KnowledgeSearchRequest {
  query: string
  strategy?: string
  top_k?: number
  similarity_threshold?: number
  filters?: MetadataFilter
}

export interface KnowledgeSearchResponse {
  query: string
  strategy: string
  chunks: RetrievedChunk[]
  metrics: {
    total_retrieved: number
    latency_ms: number
    embedding_model: string
  }
}
