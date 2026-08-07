import React, { useState } from 'react'
import { FileText, ChevronDown, ChevronUp, Layers } from 'lucide-react'
import type { RetrievedDocument } from '@/data/ragQueryMockData'
import { ConfidenceBadge } from './ConfidenceBadge'
import { cn } from '@/lib/utils'

export interface RetrievedDocumentCardProps {
  document: RetrievedDocument
  className?: string
}

export function RetrievedDocumentCard({ document, className }: RetrievedDocumentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        'p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-purple-500/40 transition-all text-left space-y-2.5 group shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-inner shrink-0">
            <FileText size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
              {document.title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
              <span>{document.collection}</span>
              <span>•</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-950 border border-slate-800 uppercase text-slate-300">
                {document.sourceType}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ConfidenceBadge score={document.confidenceScore} />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={isExpanded ? 'Collapse snippet' : 'Expand snippet'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Snippet */}
      <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-sans">
        <p className={cn(!isExpanded && 'line-clamp-2')}>
          "{document.snippet}"
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <Layers size={11} className="text-amber-400" />
          {document.chunkCount} Chunks Analyzed
        </span>
        <span>{document.chunkId}</span>
      </div>
    </div>
  )
}

export default RetrievedDocumentCard
