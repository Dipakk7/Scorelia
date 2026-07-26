export interface RetrievedDocument {
  id: string
  title: string
  collection: string
  confidenceScore: number // e.g. 0.96
  chunkCount: number
  snippet: string
  sourceType: 'PDF' | 'Markdown' | 'Code' | 'Wiki'
  pageNumber?: number
  chunkId: string
}

export interface CitationItem {
  id: string
  documentTitle: string
  pageNumber: number
  chunkId: string
  similarityScore: number
  snippet: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  content: string
  timestamp: string
  codeSnippet?: string
  citations?: CitationItem[]
  confidenceScore?: number
}

export interface QueryHistoryItem {
  id: string
  query: string
  timestamp: string
  searchType: 'Hybrid' | 'Semantic' | 'Keyword'
  topK: number
}

export interface SearchSettings {
  searchType: 'Semantic' | 'Hybrid' | 'Keyword'
  topK: number
  rerank: boolean
  temperature: number
  sourceFilter: string
}

export const MOCK_SUGGESTED_PROMPTS = [
  'Summarize this collection',
  'Explain this document',
  'Compare two documents',
  'Generate interview questions',
  'Create study notes',
  'Find missing knowledge',
  'Generate quiz',
  'Optimize retrieval'
]

export const MOCK_QUERY_HISTORY: QueryHistoryItem[] = [
  {
    id: 'qh-1',
    query: 'What is Retrieval-Augmented Generation?',
    timestamp: 'Today, 10:24 AM',
    searchType: 'Hybrid',
    topK: 5
  },
  {
    id: 'qh-2',
    query: 'Summarize AI Research Papers collection',
    timestamp: 'Today, 09:45 AM',
    searchType: 'Semantic',
    topK: 10
  },
  {
    id: 'qh-3',
    query: 'Compare LangChain and LlamaIndex architectures',
    timestamp: 'Today, 08:30 AM',
    searchType: 'Hybrid',
    topK: 5
  },
  {
    id: 'qh-4',
    query: 'What are vector database indexing strategies?',
    timestamp: 'May 17, 2026',
    searchType: 'Keyword',
    topK: 5
  }
]

export const MOCK_RETRIEVED_DOCUMENTS: RetrievedDocument[] = [
  {
    id: 'doc-101',
    title: 'Gradient Descent Algorithm Explained',
    collection: 'AI/ML Interview Guide',
    confidenceScore: 0.96,
    chunkCount: 12,
    snippet: 'Stochastic Gradient Descent (SGD) updates parameters iteratively using mini-batch gradient estimations to optimize loss functions efficiently.',
    sourceType: 'PDF',
    pageNumber: 14,
    chunkId: 'chunk-4091'
  },
  {
    id: 'doc-102',
    title: 'ML Algorithms Comparison',
    collection: 'Machine Learning Concepts',
    confidenceScore: 0.94,
    chunkCount: 8,
    snippet: 'Decision trees partition data space recursively, whereas Support Vector Machines compute optimal hyperplanes maximizing margin distance.',
    sourceType: 'Markdown',
    pageNumber: 3,
    chunkId: 'chunk-3022'
  },
  {
    id: 'doc-103',
    title: 'Optimization Techniques Overview',
    collection: 'Machine Learning Concepts',
    confidenceScore: 0.91,
    chunkCount: 15,
    snippet: 'Adam optimizer combines momentum and RMSProp by computing adaptive learning rates for each parameter based on first and second moment estimations.',
    sourceType: 'PDF',
    pageNumber: 22,
    chunkId: 'chunk-5819'
  },
  {
    id: 'doc-104',
    title: 'Stochastic Gradient Descent Guide',
    collection: 'AI/ML Interview Guide',
    confidenceScore: 0.89,
    chunkCount: 6,
    snippet: 'Learning rate decay schedules help SGD converge to optimal local minima without overshooting optimal parameters during late training epochs.',
    sourceType: 'Wiki',
    pageNumber: 7,
    chunkId: 'chunk-1044'
  }
]

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    content: 'What is Retrieval-Augmented Generation (RAG) and why is it useful?',
    timestamp: '10:24 AM'
  },
  {
    id: 'msg-2',
    sender: 'assistant',
    content: 'Retrieval-Augmented Generation (RAG) is an AI architecture that enhances Large Language Models (LLMs) by retrieving relevant facts from an external knowledge base before generating a response.\n\n### Key Benefits:\n1. **Factual Accuracy**: Reduces model hallucinations by anchoring responses to verified documents.\n2. **Up-to-date Knowledge**: Seamlessly incorporates new documents without expensive model re-training.\n3. **Source Traceability**: Provides direct citations to exact chunks and page numbers.',
    timestamp: '10:24 AM',
    confidenceScore: 0.96,
    codeSnippet: `// Example RAG Query Flow
const chunks = await vectorDb.similaritySearch(query, { topK: 5 });
const prompt = buildContextPrompt(query, chunks);
const response = await llm.generate(prompt);`,
    citations: [
      {
        id: 'cit-1',
        documentTitle: 'Gradient Descent Algorithm Explained',
        pageNumber: 14,
        chunkId: 'chunk-4091',
        similarityScore: 0.96,
        snippet: 'Stochastic Gradient Descent (SGD) updates parameters iteratively using mini-batch gradient estimations.'
      },
      {
        id: 'cit-2',
        documentTitle: 'ML Algorithms Comparison',
        pageNumber: 3,
        chunkId: 'chunk-3022',
        similarityScore: 0.94,
        snippet: 'Decision trees partition data space recursively, whereas Support Vector Machines compute optimal hyperplanes.'
      }
    ]
  }
]
