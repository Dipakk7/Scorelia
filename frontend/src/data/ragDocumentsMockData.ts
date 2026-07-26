export type DocumentStatus = 'Indexed' | 'Processing' | 'Failed' | 'Queued'

export interface DocumentItem {
  id: string
  name: string
  collection: string
  fileSize: string
  fileType: 'PDF' | 'Markdown' | 'Code' | 'Wiki'
  pageCount: number
  chunkCount: number
  status: DocumentStatus
  embeddingModel: string
  lastIndexed: string
  owner: string
  extractedTextSnippet: string
  entities: string[]
  topics: string[]
  language: string
  checksum: string
}

export interface UploadQueueItem {
  id: string
  filename: string
  fileSize: string
  progress: number // 0 to 100
  status: 'uploading' | 'paused' | 'processing' | 'completed' | 'error'
  eta: string
}

export interface DocumentVersion {
  version: string
  timestamp: string
  author: string
  changes: string
  chunkCount: number
}

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Attention_Is_All_You_Need.pdf',
    collection: 'AI Research Papers',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    pageCount: 15,
    chunkCount: 142,
    status: 'Indexed',
    embeddingModel: 'nomic-embed-text:latest',
    lastIndexed: 'Today, 10:24 AM',
    owner: 'Vaswani et al.',
    extractedTextSnippet: 'We propose the Transformer, a model architecture eschewing recurrence and relying entirely on an attention mechanism to draw global dependencies between input and output.',
    entities: ['Transformer', 'Self-Attention', 'Encoder-Decoder', 'Multi-Head Attention'],
    topics: ['Deep Learning', 'NLP', 'Sequence Models'],
    language: 'English',
    checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'doc-2',
    name: 'BERT_Pretraining_Deep_Bidirectional.pdf',
    collection: 'AI Research Papers',
    fileSize: '1.8 MB',
    fileType: 'PDF',
    pageCount: 12,
    chunkCount: 98,
    status: 'Indexed',
    embeddingModel: 'nomic-embed-text:latest',
    lastIndexed: 'May 16, 2026',
    owner: 'Devlin et al.',
    extractedTextSnippet: 'BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    entities: ['BERT', 'Masked LM', 'Next Sentence Prediction'],
    topics: ['Representation Learning', 'NLP'],
    language: 'English',
    checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'doc-3',
    name: 'System_Design_Architecture_v3.md',
    collection: 'Backend Architecture Guide',
    fileSize: '450 KB',
    fileType: 'Markdown',
    pageCount: 8,
    chunkCount: 34,
    status: 'Processing',
    embeddingModel: 'nomic-embed-text:latest',
    lastIndexed: 'Today, 11:05 AM',
    owner: 'Dipak K.',
    extractedTextSnippet: 'High-availability microservices architecture utilizing Redis caching, Kafka event bus, and PostgreSQL read-replicas for sub-10ms response times.',
    entities: ['Kafka', 'Redis', 'PostgreSQL', 'API Gateway'],
    topics: ['Microservices', 'System Design'],
    language: 'English',
    checksum: 'sha256:4a8a08f09d37b73795649038408b5f33e36e3e5b3231362e921d23456789abcd'
  },
  {
    id: 'doc-4',
    name: 'Gradient_Descent_Optimization.pdf',
    collection: 'Machine Learning Concepts',
    fileSize: '1.2 MB',
    fileType: 'PDF',
    pageCount: 10,
    chunkCount: 65,
    status: 'Indexed',
    embeddingModel: 'nomic-embed-text:latest',
    lastIndexed: 'May 12, 2026',
    owner: 'Dipak K.',
    extractedTextSnippet: 'Stochastic Gradient Descent (SGD) updates parameters iteratively using mini-batch gradient estimations to optimize loss functions efficiently.',
    entities: ['SGD', 'Adam', 'RMSProp', 'Learning Rate'],
    topics: ['Optimization', 'Loss Functions'],
    language: 'English',
    checksum: 'sha256:68e656c251e67e8358bef8483ab0d5b22957f8184064f03606042bad45270b22'
  },
  {
    id: 'doc-5',
    name: 'Legacy_API_Documentation_v1.docx',
    collection: 'Company Knowledge Base',
    fileSize: '3.1 MB',
    fileType: 'Wiki',
    pageCount: 22,
    chunkCount: 0,
    status: 'Failed',
    embeddingModel: 'nomic-embed-text:latest',
    lastIndexed: 'May 10, 2026',
    owner: 'Admin',
    extractedTextSnippet: 'Error: Parser timeout occurred while extracting binary docx streams. Unsupported legacy formatting elements detected.',
    entities: ['REST API', 'SOAP', 'XML'],
    topics: ['Legacy APIs'],
    language: 'English',
    checksum: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  }
]

export const MOCK_UPLOAD_QUEUE: UploadQueueItem[] = [
  {
    id: 'up-1',
    filename: 'Llama_3_Technical_Report.pdf',
    fileSize: '4.8 MB',
    progress: 68,
    status: 'uploading',
    eta: '12s remaining'
  },
  {
    id: 'up-2',
    filename: 'Vector_Database_Benchmarking.md',
    fileSize: '620 KB',
    progress: 100,
    status: 'processing',
    eta: 'Indexing chunks...'
  }
]

export const MOCK_DOCUMENT_VERSIONS: DocumentVersion[] = [
  {
    version: 'v3.0',
    timestamp: 'Today, 10:24 AM',
    author: 'Dipak Khandagale',
    changes: 'Updated chunking strategy from 512 to 1024 tokens with 100 token overlap.',
    chunkCount: 142
  },
  {
    version: 'v2.0',
    timestamp: 'May 10, 2026',
    author: 'Sarah Jenkins',
    changes: 'Re-indexed with nomic-embed-text:latest provider.',
    chunkCount: 110
  },
  {
    version: 'v1.0',
    timestamp: 'Apr 20, 2026',
    author: 'Initial Upload',
    changes: 'First upload into AI Research Papers collection.',
    chunkCount: 95
  }
]
