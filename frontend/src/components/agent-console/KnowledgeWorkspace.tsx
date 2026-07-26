import React, { useState, useMemo, useEffect } from 'react'
import { useKnowledgeCollections } from '@/hooks/useKnowledgeCollections'
import {
  type KnowledgeCollectionItem,
} from '@/data/taskAutomationKnowledgeMockData'
import { mockAgentsData } from '@/data/agentConsoleMockData'
import { SearchAgents } from './SearchAgents'
import { EmptyKnowledgeState } from './EmptyKnowledgeState'
import {
  BookOpen,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Link as LinkIcon,
  Bot,
  ArrowRight,
  Plus,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KnowledgeWorkspaceProps {
  className?: string
}

export function KnowledgeWorkspace({ className }: KnowledgeWorkspaceProps) {
  const { collections: queryCollections, sources, assignCollection } = useKnowledgeCollections()

  const [collections, setCollections] = useState<KnowledgeCollectionItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Quick Assignment State
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('')
  const [selectedAgentId, setSelectedAgentId] = useState<string>(mockAgentsData[0]?.id || '')
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null)

  useEffect(() => {
    if (queryCollections && queryCollections.length > 0) {
      setCollections(queryCollections)
      if (!selectedCollectionId && queryCollections[0]) {
        setSelectedCollectionId(queryCollections[0].id)
      }
    }
  }, [queryCollections])

  const handleAssign = async () => {
    const col = collections.find((c) => c.id === selectedCollectionId)
    const agent = mockAgentsData.find((a) => a.id === selectedAgentId)

    if (col && agent) {
      setCollections((prev) =>
        prev.map((c) => {
          if (c.id === col.id && !c.assignedAgents.includes(agent.name)) {
            return { ...c, assignedAgents: [...c.assignedAgents, agent.name] }
          }
          return c
        })
      )
      setAssignmentMessage(`Assigned "${col.name}" to agent ${agent.name}`)
      setTimeout(() => setAssignmentMessage(null), 3000)

      await assignCollection({ collectionId: col.id, agentName: agent.name })
    }
  }

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) return collections
    const q = searchQuery.toLowerCase()
    return collections.filter(
      (c) => c.name.toLowerCase().includes(q) || c.assignedAgents.some((a) => a.toLowerCase().includes(q))
    )
  }, [collections, searchQuery])

  const selectedColObj = collections.find((c) => c.id === selectedCollectionId)
  const selectedAgentObj = mockAgentsData.find((a) => a.id === selectedAgentId)

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* 1. Top Section: Quick Assignment Panel & Connected Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Quick Assignment Panel (7 Columns) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Zap size={16} className="text-purple-400" />
              <span>Quick Knowledge Assignment Panel</span>
            </h3>
            <p className="text-xs text-slate-400">
              Bind vector knowledge collections directly to specific AI agents to empower real-time retrieval context.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Collection Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Source Collection
              </label>
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0b0c14] border border-white/10 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                {collections.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#111322]">
                    {c.name} ({c.documentsCount} docs)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Agent Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Target Agent
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#0b0c14] border border-white/10 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                {mockAgentsData.map((a) => (
                  <option key={a.id} value={a.id} className="bg-[#111322]">
                    {a.name} ({a.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview Box & Submit */}
          <div className="p-3 rounded-xl bg-[#0b0c14] border border-white/5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <BookOpen size={14} className="text-indigo-400 shrink-0" />
              <span className="font-semibold text-slate-200 truncate">{selectedColObj?.name}</span>
              <ArrowRight size={13} className="text-purple-400 shrink-0" />
              <Bot size={14} className="text-emerald-400 shrink-0" />
              <span className="font-semibold text-white truncate">{selectedAgentObj?.name}</span>
            </div>

            <button
              type="button"
              onClick={handleAssign}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all shrink-0 active:scale-95"
            >
              Assign Collection
            </button>
          </div>

          {assignmentMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>{assignmentMessage}</span>
            </div>
          )}
        </div>

        {/* Connected Sources Summary (5 Columns) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl space-y-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <LinkIcon size={15} className="text-blue-400" />
              <span>Connected Sources ({sources.length})</span>
            </h3>
            <span className="text-[11px] font-semibold text-purple-400 hover:underline cursor-pointer">
              Manage Sources
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {sources.map((src) => (
              <div key={src.id} className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-200 truncate text-[11px]">{src.name}</span>
                  {src.connectionState === 'connected' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  {src.connectionState === 'syncing' && <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />}
                  {src.connectionState === 'error' && <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{src.documentCount} docs</span>
                  <span className="font-mono">{src.lastSync}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Knowledge Collections Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111322] border border-white/10 shadow-lg">
        <SearchAgents
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search collections or assigned agents..."
        />
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          <Plus size={15} className="stroke-[2.5]" />
          <span>Add Collection</span>
        </button>
      </div>

      {/* 3. Grid of Knowledge Collections */}
      {filteredCollections.length === 0 ? (
        <EmptyKnowledgeState onResetFilters={() => setSearchQuery('')} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCollections.map((col) => (
            <div
              key={col.id}
              className="p-5 rounded-2xl bg-[#111322] border border-white/10 hover:border-purple-500/40 shadow-xl space-y-4 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Collection Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                      <BookOpen size={20} />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <h3 className="font-bold text-white text-xs tracking-tight truncate">{col.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">{col.lastSync}</span>
                    </div>
                  </div>

                  {/* Health Indicator */}
                  <div>
                    {col.health === 'healthy' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle2 size={10} />
                        Healthy
                      </span>
                    )}
                    {col.health === 'syncing' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold uppercase tracking-wider">
                        <RefreshCw size={10} className="animate-spin" />
                        Syncing
                      </span>
                    )}
                    {col.health === 'needs_update' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                        <AlertTriangle size={10} />
                        Update
                      </span>
                    )}
                    {col.health === 'error' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold uppercase tracking-wider">
                        <XCircle size={10} />
                        Error
                      </span>
                    )}
                    {col.health === 'offline' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] font-bold uppercase tracking-wider">
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-medium">Documents</span>
                    <span className="font-extrabold text-white block">{col.documentsCount}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-medium">Embeddings</span>
                    <span className="font-extrabold text-indigo-300 font-mono block">
                      {col.embeddingsCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0b0c14] border border-white/5 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-medium">Storage</span>
                    <span className="font-extrabold text-emerald-400 font-mono block">{col.storageUsed}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Agents Tags */}
              <div className="pt-3 border-t border-white/5 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Assigned Agents</span>
                <div className="flex flex-wrap gap-1">
                  {col.assignedAgents.map((agentName) => (
                    <span
                      key={agentName}
                      className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-medium"
                    >
                      {agentName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default KnowledgeWorkspace
