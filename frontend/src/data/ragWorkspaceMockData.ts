export type CollectionStatus = 'ready' | 'processing' | 'indexing' | 'failed'
export type CollectionHealth = 'healthy' | 'warning' | 'attention'

export interface CollectionActivity {
  id: string
  action: string
  timestamp: string
  user: string
}

export interface CollectionItem {
  id: string
  name: string
  description: string
  documentCount: number
  chunkCount: number
  embeddingModel: string
  status: CollectionStatus
  health: CollectionHealth
  storageUsed: string
  storageBytes: number
  createdDate: string
  updatedDate: string
  lastQueried: string
  owner: string
  iconName: 'book' | 'layers' | 'archive' | 'code' | 'fileText' | 'shield' | 'activity' | 'database'
  activities: CollectionActivity[]
}

export const MOCK_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    name: 'AI Research Papers',
    description: 'ArXiv papers, Transformer architectures, RAG benchmarks, and LLM evaluation guides.',
    documentCount: 124,
    chunkCount: 872,
    embeddingModel: 'nomic-embed-text:latest',
    status: 'ready',
    health: 'healthy',
    storageUsed: '142.5 MB',
    storageBytes: 149422080,
    createdDate: 'May 02, 2026',
    updatedDate: 'May 18, 2026 10:24 AM',
    lastQueried: '2 min ago',
    owner: 'Dipak Khandagale',
    iconName: 'book',
    activities: [
      { id: 'act-101', action: 'Query executed via RAG API', timestamp: '2 min ago', user: 'System' },
      { id: 'act-102', action: 'Added 14 PDF research papers', timestamp: 'May 18, 2026 10:24 AM', user: 'Dipak Khandagale' },
      { id: 'act-103', action: 'Re-indexed vector embeddings', timestamp: 'May 15, 2026 04:12 PM', user: 'Dipak Khandagale' }
    ]
  },
  {
    id: 'col-2',
    name: 'Company Knowledge Base',
    description: 'Internal Wiki, onboarding documentation, engineering RFCs, and API guidelines.',
    documentCount: 412,
    chunkCount: 2890,
    embeddingModel: 'text-embedding-3-small',
    status: 'ready',
    health: 'healthy',
    storageUsed: '380.2 MB',
    storageBytes: 398668800,
    createdDate: 'Apr 12, 2026',
    updatedDate: 'May 18, 2026 09:15 AM',
    lastQueried: '15 min ago',
    owner: 'Engineering Team',
    iconName: 'database',
    activities: [
      { id: 'act-201', action: 'Synced Notion workspace', timestamp: '15 min ago', user: 'Notion Integration' },
      { id: 'act-202', action: 'Updated Engineering Handbook', timestamp: 'May 18, 2026 09:15 AM', user: 'Sarah Chen' }
    ]
  },
  {
    id: 'col-3',
    name: 'Interview Dataset',
    description: 'System design questions, coding challenges, behavioral rubrics, and model answers.',
    documentCount: 245,
    chunkCount: 1842,
    embeddingModel: 'nomic-embed-text:latest',
    status: 'ready',
    health: 'healthy',
    storageUsed: '210.8 MB',
    storageBytes: 221052928,
    createdDate: 'May 10, 2026',
    updatedDate: 'May 18, 2026 08:30 AM',
    lastQueried: '1 hr ago',
    owner: 'Scorelia AI Team',
    iconName: 'activity',
    activities: [
      { id: 'act-301', action: 'Imported 35 System Design transcripts', timestamp: '1 hr ago', user: 'Dipak Khandagale' }
    ]
  },
  {
    id: 'col-4',
    name: 'Resume Database',
    description: 'Anonymized candidate resumes, skills taxonomies, and ATS keyword embeddings.',
    documentCount: 321,
    chunkCount: 2156,
    embeddingModel: 'text-embedding-3-large',
    status: 'ready',
    health: 'healthy',
    storageUsed: '295.4 MB',
    storageBytes: 309747712,
    createdDate: 'Jan 20, 2026',
    updatedDate: 'May 17, 2026 07:30 PM',
    lastQueried: '3 hr ago',
    owner: 'Recruitment Ops',
    iconName: 'fileText',
    activities: [
      { id: 'act-401', action: 'Batch embedded 50 candidate profiles', timestamp: 'May 17, 2026 07:30 PM', user: 'Automated Job' }
    ]
  },
  {
    id: 'col-5',
    name: 'Product Documentation',
    description: 'Product specifications, release notes, user manuals, and integration guides.',
    documentCount: 186,
    chunkCount: 1237,
    embeddingModel: 'nomic-embed-text:latest',
    status: 'indexing',
    health: 'warning',
    storageUsed: '168.0 MB',
    storageBytes: 176160768,
    createdDate: 'Mar 05, 2026',
    updatedDate: 'May 18, 2026 08:45 AM',
    lastQueried: '1 hr ago',
    owner: 'Product Ops',
    iconName: 'archive',
    activities: [
      { id: 'act-501', action: 'Indexing job started (75% completed)', timestamp: 'May 18, 2026 08:45 AM', user: 'System Worker' }
    ]
  },
  {
    id: 'col-6',
    name: 'Legal Contracts',
    description: 'Vendor agreements, terms of service, privacy policies, and compliance docs.',
    documentCount: 94,
    chunkCount: 650,
    embeddingModel: 'bge-m3',
    status: 'processing',
    health: 'healthy',
    storageUsed: '98.6 MB',
    storageBytes: 103389184,
    createdDate: 'Feb 14, 2026',
    updatedDate: 'May 17, 2026 06:10 PM',
    lastQueried: '5 hr ago',
    owner: 'Legal Team',
    iconName: 'shield',
    activities: [
      { id: 'act-601', action: 'Processing OCR text extraction', timestamp: 'May 17, 2026 06:10 PM', user: 'System Worker' }
    ]
  },
  {
    id: 'col-7',
    name: 'Medical Notes',
    description: 'Clinical reference guidelines, pharmacology notes, and diagnostic checklists.',
    documentCount: 156,
    chunkCount: 1120,
    embeddingModel: 'nomic-embed-text:latest',
    status: 'ready',
    health: 'healthy',
    storageUsed: '185.2 MB',
    storageBytes: 194195456,
    createdDate: 'Apr 01, 2026',
    updatedDate: 'May 16, 2026 02:15 PM',
    lastQueried: '1 day ago',
    owner: 'Medical Research Group',
    iconName: 'code',
    activities: [
      { id: 'act-701', action: 'Collection created', timestamp: 'Apr 01, 2026', user: 'Dr. Alex Vance' }
    ]
  },
  {
    id: 'col-8',
    name: 'Support Knowledge',
    description: 'Customer ticket solutions, troubleshooting steps, and FAQ repository.',
    documentCount: 48,
    chunkCount: 310,
    embeddingModel: 'text-embedding-3-small',
    status: 'failed',
    health: 'attention',
    storageUsed: '42.1 MB',
    storageBytes: 44145049,
    createdDate: 'May 12, 2026',
    updatedDate: 'May 17, 2026 04:00 PM',
    lastQueried: '2 days ago',
    owner: 'Customer Success',
    iconName: 'layers',
    activities: [
      { id: 'act-801', action: 'Embedding timeout error', timestamp: 'May 17, 2026 04:00 PM', user: 'System Error' }
    ]
  }
]
