import React from 'react'
import { Layers, Cpu, Database, TrendingUp, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ContextPanelProps {
  retrievedDocsCount?: number
  chunkCount?: number
  avgSimilarity?: number
  embeddingModel?: string
  currentCollection?: string
  className?: string
}

export function ContextPanel({
  retrievedDocsCount = 4,
  chunkCount = 41,
  avgSimilarity = 0.92,
  embeddingModel = 'nomic-embed-text:latest',
  currentCollection = 'AI Research Papers',
  className
}: ContextPanelProps) {
  return (
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-3', className)}>
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database size={15} className="text-purple-400" /> Active Context Window
        </h4>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
          Ready
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-[#121320] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Collection</span>
          <span className="font-bold text-slate-200 truncate block">{currentCollection}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#121320] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Docs / Chunks</span>
          <span className="font-bold text-slate-200 font-mono block">{retrievedDocsCount} / {chunkCount}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#121320] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Avg Similarity</span>
          <span className="font-bold text-emerald-400 font-mono block">{avgSimilarity.toFixed(2)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#121320] border border-white/5 space-y-0.5">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Embedding Model</span>
          <span className="font-mono text-slate-300 text-[11px] truncate block">{embeddingModel}</span>
        </div>
      </div>
    </div>
  )
}

export default ContextPanel
