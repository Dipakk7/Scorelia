import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/api/api'
import toast from 'react-hot-toast'
import {
  Database,
  Upload,
  Layers,
  Sparkles,
  TrendingUp,
  History,
  FileText,
  FolderOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Custom Components
import { RAGSearchBar } from '@/components/rag/RAGSearchBar'
import { SearchFilters } from '@/components/rag/SearchFilters'
import { KnowledgeCard } from '@/components/rag/KnowledgeCard'
import { AnswerPanel } from '@/components/rag/AnswerPanel'
import { CitationViewer } from '@/components/rag/CitationViewer'
import { SearchHistory } from '@/components/rag/SearchHistory'
import { SearchAnalytics } from '@/components/rag/SearchAnalytics'
import { ExportDialog } from '@/components/rag/ExportDialog'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatisticCard } from '@/components/ui/StatisticCard'
import { RagWorkspaceSkeleton } from '@/components/ui/Skeletons'
import { EmptyRagResultsState } from '@/components/ui/EmptyState'

import type {
  CollectionResponse,
  RAGHealthResponse,
  RAGRequest,
  RAGResponse,
  RetrievedChunk
} from '@/types/rag'

export default function RAGWorkspacePage() {

  // State management
  const [selectedCollection, setSelectedCollection] = useState('')
  const [threshold, setThreshold] = useState(0.4)
  const [topK, setTopK] = useState(5)
  const [documentFilter, setDocumentFilter] = useState('')
  const [activeSearchTab, setActiveSearchTab] = useState<'answer' | 'explorer' | 'history' | 'analytics'>('answer')
  const [activeQuery, setActiveQuery] = useState('')

  // Document upload panel states
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadCollection, setUploadCollection] = useState('')
  const [newCollectionName, setNewCollectionName] = useState('')
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false)

  // Local Storage query metrics & history
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [queryMetrics, setQueryMetrics] = useState<any[]>([])

  // Modal open status
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    try {
      const recent = localStorage.getItem('scorelia_rag_recent_searches')
      if (recent) setRecentSearches(JSON.parse(recent))

      const saved = localStorage.getItem('scorelia_rag_saved_searches')
      if (saved) setSavedSearches(JSON.parse(saved))

      const metrics = localStorage.getItem('scorelia_rag_query_metrics')
      if (metrics) setQueryMetrics(JSON.parse(metrics))
    } catch (e) {
      console.error('Failed to load local storage lists', e)
    }
  }, [])

  // 1. Fetch available collections list
  const {
    data: collections = [],
    isLoading: isCollectionsLoading,
    refetch: refetchCollections
  } = useQuery<CollectionResponse[]>({
    queryKey: ['ragCollections'],
    queryFn: async () => {
      const res = await api.get('/rag/collections')
      return res.data
    }
  })

  // Set default upload collection
  useEffect(() => {
    if (collections.length > 0 && !uploadCollection) {
      setUploadCollection(collections[0].name)
    }
  }, [collections, uploadCollection])

  // 2. Health check connection
  const { data: health } = useQuery<RAGHealthResponse>({
    queryKey: ['ragHealth'],
    queryFn: async () => {
      const res = await api.get('/rag/health')
      return res.data
    },
    refetchInterval: 30000 // Poll every 30 seconds
  })

  // 3. Mutation: Execute RAG Q&A query
  const queryRagMutation = useMutation<RAGResponse, any, RAGRequest>({
    mutationFn: async (payload) => {
      const res = await api.post('/rag/query', payload)
      return res.data
    },
    onSuccess: (data, variables) => {
      toast.success('Search query answered.')
      
      // Update recent searches
      const queryText = variables.question
      const nextRecent = [queryText, ...recentSearches.filter(q => q !== queryText)].slice(0, 10)
      setRecentSearches(nextRecent)
      localStorage.setItem('scorelia_rag_recent_searches', JSON.stringify(nextRecent))

      // Update analytics query metrics
      const newMetric = {
        query: queryText,
        latencyMs: data.latency_ms,
        chunks: data.retrieved_chunk_count,
        tokens: data.token_usage?.total_tokens ?? 0,
        cacheStatus: data.cache_status || 'MISS'
      }
      const nextMetrics = [newMetric, ...queryMetrics].slice(0, 15)
      setQueryMetrics(nextMetrics)
      localStorage.setItem('scorelia_rag_query_metrics', JSON.stringify(nextMetrics))
      
      // Force change to answer panel tab
      setActiveSearchTab('answer')
    },
    onError: (err: any) => {
      console.error(err)
      toast.error(err.response?.data?.detail || 'RAG Query synthesis failed. Ensure Ollama service is running.')
    }
  })

  // 4. Mutation: Create Collection
  const createCollectionMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post('/rag/collections', { name })
      return res.data
    },
    onSuccess: () => {
      toast.success('Knowledge collection created successfully!')
      refetchCollections()
      setNewCollectionName('')
      setShowNewCollectionForm(false)
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to create collection.')
    }
  })

  // Document ingestion + vector indexing pipeline trigger
  const handleUploadAndIndex = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) {
      toast.error('Please select a file to ingest.')
      return
    }
    if (!uploadCollection) {
      toast.error('Please select target collection.')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      // Step 1: Upload document file to FastAPI backend
      const uploadRes = await api.post('/rag/documents/load', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const doc = uploadRes.data
      toast.success('Document uploaded and parsed successfully.')

      // Step 2: Index parsed document chunks into ChromaDB vector database
      await api.post('/rag/index', {
        document: doc,
        collection_name: uploadCollection,
        chunk_size: 500,
        chunk_overlap: 50,
        duplicate_policy: 'overwrite'
      })

      toast.success('Document indexed successfully!')
      setUploadFile(null)
      refetchCollections()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to process document.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSearch = (queryText: string) => {
    setActiveQuery(queryText)
    const payload: RAGRequest = {
      question: queryText,
      collection: selectedCollection || undefined,
      similarity_threshold: threshold,
      top_k: topK
    }
    queryRagMutation.mutate(payload)
  }

  // Bookmarking / history handlers
  const handleToggleSave = (query: string) => {
    let nextSaved = []
    if (savedSearches.includes(query)) {
      nextSaved = savedSearches.filter(q => q !== query)
      toast.success('Query removed from bookmarks.')
    } else {
      nextSaved = [...savedSearches, query]
      toast.success('Query bookmarked!')
    }
    setSavedSearches(nextSaved)
    localStorage.setItem('scorelia_rag_saved_searches', JSON.stringify(nextSaved))
  }

  const handleDeleteRecent = (query: string) => {
    const nextRecent = recentSearches.filter(q => q !== query)
    setRecentSearches(nextRecent)
    localStorage.setItem('scorelia_rag_recent_searches', JSON.stringify(nextRecent))
  }

  const handleClearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('scorelia_rag_recent_searches')
    toast.success('Recent queries cleared.')
  }

  // Deduplicate and aggregate retrieved chunks for Knowledge explorer tab
  const retrievedChunks = useMemo(() => {
    const list: RetrievedChunk[] = []
    queryRagMutation.data?.context_documents.forEach(doc => {
      doc.chunks.forEach(c => {
        list.push({
          ...c,
          source: doc.source,
          collection: selectedCollection || 'Primary KB'
        })
      })
    })
    return list.sort((a, b) => b.similarity_score - a.similarity_score)
  }, [queryRagMutation.data, selectedCollection])

  if (isCollectionsLoading) {
    return <RagWorkspaceSkeleton />
  }

  const totalChunksCount = collections.reduce((acc, c) => acc + (c.count || 0), 0)

  return (
    <div className="space-y-6 text-left animate-fade-in font-sans focus:outline-none">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-205 dark:border-slate-855 shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
        <div className="space-y-1.5 text-left">
          <h1 className="text-xl md:text-2xl font-black font-display text-slate-900 dark:text-white m-0 tracking-tight leading-none">
            RAG Semantic Workspace
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed m-0 font-medium">
            Perform natural language queries against uploaded documents to synthesize career insights.
          </p>
        </div>

        {/* Database operational status indicator */}
        <div className="flex items-center gap-2.5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xs border border-slate-205 dark:border-slate-800/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold select-none leading-none">
          <Database size={14} className="text-slate-450" />
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 dark:text-slate-500 font-sans">KB Vector DB:</span>
            {health?.status === 'healthy' ? (
              <span className="text-emerald-500 flex items-center gap-1 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Online
              </span>
            ) : (
              <span className="text-amber-500 flex items-center gap-1 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                Offline
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Base Overview Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatisticCard
          title="Knowledge Collections"
          value={collections.length}
          description="Active semantic workspaces"
          icon={FolderOpen}
          className="border-slate-205 dark:border-slate-855"
        />
        <StatisticCard
          title="Indexed Chunks"
          value={totalChunksCount}
          description="Parsed vector embeddings"
          icon={Layers}
          className="border-slate-205 dark:border-slate-855"
        />
        <StatisticCard
          title="Retrieval Engine"
          value={health?.status === 'healthy' ? 'Online' : 'Syncing'}
          description="ChromaDB service status"
          icon={Database}
          className="border-slate-205 dark:border-slate-855"
        />
        <StatisticCard
          title="Response Agent"
          value={health?.ollama?.model ? health.ollama.model.split(':')[0] : 'Llama 3'}
          description="Ollama generation model"
          icon={Sparkles}
          className="border-slate-205 dark:border-slate-855"
        />
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Side: Document management, Query builder, filters, history */}
        <div className="lg:col-span-1 space-y-6">
          {/* Document Uploader */}
          <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left font-sans text-xs">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/60 text-left">
              <CardTitle className="text-sm font-black font-display text-slate-900 dark:text-white flex items-center gap-2 m-0 leading-none">
                <Upload className="text-brand-500 h-4 w-4" />
                <span>Knowledge Ingestion</span>
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500 dark:text-slate-405 leading-relaxed font-sans max-w-sm m-0 mt-1.5 font-medium">
                Load PDF or TXT files directly to your semantic indexes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5 pb-5">
              <form onSubmit={handleUploadAndIndex} className="space-y-3.5 text-xs m-0 text-left">
                {/* File input drag area */}
                <div className="border-2 border-dashed border-slate-205 dark:border-slate-850 hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50/20 dark:bg-slate-950/10 hover:bg-slate-100/10">
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 select-none">
                    <FileText className="text-slate-400 h-8 w-8" />
                    <span className="font-semibold text-slate-700 dark:text-slate-355 text-xs mt-1">
                      {uploadFile ? uploadFile.name : 'Select PDF or Plain Text'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">Maximum size 5 MB</span>
                  </div>
                </div>

                {/* Target collection dropdown */}
                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-widest block font-display leading-none">Target Collection</label>
                    <button
                      type="button"
                      onClick={() => setShowNewCollectionForm(!showNewCollectionForm)}
                      className="text-[9px] font-black text-brand-655 hover:text-brand-700 uppercase tracking-wider cursor-pointer border-none bg-transparent p-0 leading-none"
                    >
                      {showNewCollectionForm ? 'Select Existing' : 'Create New'}
                    </button>
                  </div>

                  {showNewCollectionForm ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="New collection name..."
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        className="flex-1 text-xs py-2 px-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-405 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans font-medium transition-colors shadow-2xs"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        disabled={createCollectionMutation.isPending || !newCollectionName.trim()}
                        onClick={() => createCollectionMutation.mutate(newCollectionName.trim())}
                        className="text-[10px] font-bold uppercase tracking-wider h-9 rounded-xl px-3 cursor-pointer"
                      >
                        Create
                      </Button>
                    </div>
                  ) : (
                    <select
                      value={uploadCollection}
                      onChange={(e) => setUploadCollection(e.target.value)}
                      className="w-full text-xs py-2.5 px-3 border border-slate-250 dark:border-slate-800 rounded-xl bg-white/70 dark:bg-slate-900/50 text-slate-950 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-brand-500 font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      {collections.map((col) => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <Button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-700 hover:to-indigo-700 text-white shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200 text-xs w-full h-10"
                  disabled={isUploading || !uploadFile}
                >
                  {isUploading ? (
                    <>
                      <LoaderCw className="animate-spin h-3.5 w-3.5" />
                      <span>Ingesting source file...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Ingest & Index Document</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Q&A workspace panel (2/3 width) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Main search bar */}
          <RAGSearchBar
            onSearch={handleSearch}
            isLoading={queryRagMutation.isPending}
            recentSearches={recentSearches}
            onSelectRecent={setSelectedCollection}
          />

          {/* Search Filters */}
          <SearchFilters
            collections={collections}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            threshold={threshold}
            setThreshold={setThreshold}
            topK={topK}
            setTopK={setTopK}
            documentFilter={documentFilter}
            setDocumentFilter={setDocumentFilter}
          />

          {/* Workspace Tabs */}
          <div className="border-b border-slate-200/60 dark:border-slate-855 flex gap-1">
            {[
              { id: 'answer', label: 'AI Answer', icon: Sparkles },
              { id: 'explorer', label: 'Explorer', icon: FolderOpen },
              { id: 'history', label: 'History', icon: History },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeSearchTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSearchTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 pb-3 px-3.5 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer border-b-2 border-transparent bg-transparent focus:outline-none -mb-[1px]',
                    isActive
                      ? 'text-brand-500 border-brand-500 font-extrabold'
                      : 'text-slate-405 hover:text-slate-805 dark:hover:text-slate-355'
                  )}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab contents */}
          <div className="space-y-6 flex-1 text-left">
            {activeSearchTab === 'answer' && (
              <div className="space-y-6">
                <AnswerPanel
                  response={queryRagMutation.data || null}
                  onRegenerate={() => handleSearch(activeQuery)}
                  onExport={() => setIsExportOpen(true)}
                  isLoading={queryRagMutation.isPending}
                />
                
                {queryRagMutation.data && (
                  <CitationViewer
                    citations={queryRagMutation.data.citations}
                    contextDocuments={queryRagMutation.data.context_documents}
                  />
                )}
              </div>
            )}

            {activeSearchTab === 'explorer' && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none flex items-center gap-2 pl-1 text-left">
                  <Layers size={14} className="text-brand-500" />
                  <span>Retrieved Knowledge Chunks ({retrievedChunks.length})</span>
                </h3>
                {retrievedChunks.length === 0 ? (
                  <EmptyRagResultsState />
                ) : (
                  <div className="space-y-3.5">
                    {retrievedChunks.map((chunk, idx) => (
                      <KnowledgeCard key={chunk.chunk_id || idx} chunk={chunk} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSearchTab === 'history' && (
              <SearchHistory
                recentSearches={recentSearches}
                savedSearches={savedSearches}
                onSelectSearch={handleSearch}
                onToggleSave={handleToggleSave}
                onDeleteRecent={handleDeleteRecent}
                onClearRecent={handleClearRecent}
              />
            )}

            {activeSearchTab === 'analytics' && (
              <SearchAnalytics metrics={queryMetrics} />
            )}
          </div>
        </div>
      </div>

      {/* Export Answer Modal */}
      {queryRagMutation.data && (
        <ExportDialog
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          content={queryRagMutation.data.answer}
          query={activeQuery}
        />
      )}
    </div>
  )
}

// Small Loader helper icon wrapper
function LoaderCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.72 2.78L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  )
}
