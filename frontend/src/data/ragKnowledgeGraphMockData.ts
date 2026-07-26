export type NodeType = 'collection' | 'document' | 'topic' | 'entity' | 'embedding'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  similarityScore?: number
  description?: string
  connectedCount: number
  owner?: string
  created?: string
  updated?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label?: string
  weight?: number
}

export const MOCK_GRAPH_NODES: GraphNode[] = [
  // Collections
  { id: 'c1', label: 'AI Research Papers', type: 'collection', x: 400, y: 300, connectedCount: 6, description: 'Core AI, LLM, and Transformer research documents', owner: 'Dipak K.', created: 'May 01, 2026', updated: 'Today, 10:24 AM' },
  { id: 'c2', label: 'Machine Learning Concepts', type: 'collection', x: 200, y: 150, connectedCount: 4, description: 'Supervised, Unsupervised, and Reinforcement Learning basics', owner: 'Dipak K.', created: 'May 05, 2026', updated: 'May 18, 2026' },
  { id: 'c3', label: 'Backend Architecture Guide', type: 'collection', x: 600, y: 150, connectedCount: 5, description: 'Distributed systems, microservices, and API designs', owner: 'Sarah L.', created: 'Apr 20, 2026', updated: 'May 16, 2026' },

  // Documents
  { id: 'd1', label: 'Attention Is All You Need', type: 'document', x: 320, y: 220, similarityScore: 0.96, connectedCount: 4, description: 'Original Transformer architecture paper by Vaswani et al.', owner: 'Vaswani et al.', created: '2017', updated: 'May 01, 2026' },
  { id: 'd2', label: 'BERT Pre-training Deep Bidirectional', type: 'document', x: 480, y: 220, similarityScore: 0.94, connectedCount: 3, description: 'Language representation model by Devlin et al.', owner: 'Devlin et al.', created: '2018', updated: 'May 02, 2026' },
  { id: 'd3', label: 'Gradient Descent Algorithm', type: 'document', x: 140, y: 240, similarityScore: 0.91, connectedCount: 3, description: 'Optimization algorithm overview and variants', owner: 'Dipak K.', created: 'May 05, 2026', updated: 'May 10, 2026' },
  { id: 'd4', label: 'System Design Interview Guide', type: 'document', x: 660, y: 240, similarityScore: 0.88, connectedCount: 4, description: 'High-level architectural patterns for web scale', owner: 'Alex H.', created: 'Apr 20, 2026', updated: 'May 12, 2026' },

  // Topics
  { id: 't1', label: 'Transformer Architecture', type: 'topic', x: 400, y: 140, connectedCount: 5, description: 'Self-attention mechanisms and encoder-decoder stacks', created: 'Auto-extracted' },
  { id: 't2', label: 'Neural Embeddings', type: 'topic', x: 520, y: 320, connectedCount: 4, description: 'High-dimensional vector space representation', created: 'Auto-extracted' },
  { id: 't3', label: 'Optimization Algorithms', type: 'topic', x: 220, y: 340, connectedCount: 4, description: 'Loss functions, SGD, Adam, and momentum', created: 'Auto-extracted' },
  { id: 't4', label: 'Microservices & Gateway', type: 'topic', x: 700, y: 340, connectedCount: 3, description: 'Service discovery, routing, and fault tolerance', created: 'Auto-extracted' },

  // Entities
  { id: 'e1', label: 'Self-Attention Mechanism', type: 'entity', x: 300, y: 100, similarityScore: 0.98, connectedCount: 2, description: 'Computes query-key-value dot product matrix', created: 'Auto-extracted' },
  { id: 'e2', label: 'Multi-Head Attention', type: 'entity', x: 450, y: 80, similarityScore: 0.95, connectedCount: 2, description: 'Parallel attention projections across subspaces', created: 'Auto-extracted' },
  { id: 'e3', label: 'Stochastic Gradient Descent', type: 'entity', x: 120, y: 380, similarityScore: 0.92, connectedCount: 2, description: 'Iterative optimization using mini-batches', created: 'Auto-extracted' },
  { id: 'e4', label: 'API Gateway Pattern', type: 'entity', x: 760, y: 260, similarityScore: 0.89, connectedCount: 2, description: 'Single entry point for client API routing', created: 'Auto-extracted' },

  // Embeddings
  { id: 'emb1', label: 'chunk-4091-vec', type: 'embedding', x: 350, y: 400, similarityScore: 0.96, connectedCount: 1, description: '768d vector chunk embedding', created: 'Today, 10:24 AM' },
  { id: 'emb2', label: 'chunk-3022-vec', type: 'embedding', x: 480, y: 420, similarityScore: 0.94, connectedCount: 1, description: '768d vector chunk embedding', created: 'Today, 10:24 AM' },
  { id: 'emb3', label: 'chunk-5819-vec', type: 'embedding', x: 220, y: 440, similarityScore: 0.91, connectedCount: 1, description: '768d vector chunk embedding', created: 'Today, 10:24 AM' }
]

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  // Collection -> Document
  { id: 'ed1', source: 'c1', target: 'd1', label: 'contains' },
  { id: 'ed2', source: 'c1', target: 'd2', label: 'contains' },
  { id: 'ed3', source: 'c2', target: 'd3', label: 'contains' },
  { id: 'ed4', source: 'c3', target: 'd4', label: 'contains' },

  // Document -> Topic
  { id: 'ed5', source: 'd1', target: 't1', label: 'defines' },
  { id: 'ed6', source: 'd2', target: 't1', label: 'extends' },
  { id: 'ed7', source: 'd2', target: 't2', label: 'uses' },
  { id: 'ed8', source: 'd3', target: 't3', label: 'explains' },
  { id: 'ed9', source: 'd4', target: 't4', label: 'describes' },

  // Topic -> Entity
  { id: 'ed10', source: 't1', target: 'e1', label: 'has entity' },
  { id: 'ed11', source: 't1', target: 'e2', label: 'has entity' },
  { id: 'ed12', source: 't3', target: 'e3', label: 'has entity' },
  { id: 'ed13', source: 't4', target: 'e4', label: 'has entity' },

  // Entity -> Embedding
  { id: 'ed14', source: 'e1', target: 'emb1', label: 'vectorized' },
  { id: 'ed15', source: 'e2', target: 'emb2', label: 'vectorized' },
  { id: 'ed16', source: 'e3', target: 'emb3', label: 'vectorized' }
]
