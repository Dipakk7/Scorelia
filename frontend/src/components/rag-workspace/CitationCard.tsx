import React from 'react'
import { FileText, ExternalLink } from 'lucide-react'
import type { CitationItem } from '@/data/ragQueryMockData'
import { ConfidenceBadge } from './ConfidenceBadge'
import { cn } from '@/lib/utils'

export interface CitationCardProps {
  citation: CitationItem
  onOpenSource?: (citation: CitationItem) => void
  className?: string
}

export function CitationCard({ citation, onOpenSource, className }: CitationCardProps) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] hover:border-purple-500/30 transition-colors text-left space-y-2 group select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <FileText size={14} />
          </div>
          <div className="min-w-0">
            <h5 className="text-xs font-semibold text-[var(--heading)] truncate group-hover:text-purple-300 transition-colors">
              {citation.documentTitle}
            </h5>
            <p className="text-[10px] text-[var(--muted)] font-mono">
              Page {citation.pageNumber} • {citation.chunkId}
            </p>
          </div>
        </div>
        <ConfidenceBadge score={citation.similarityScore} />
      </div>

      <p className="text-[11px] text-[var(--heading)] line-clamp-2 leading-relaxed bg-[var(--surface)] p-2 rounded-lg border border-[var(--border)] font-sans">
        "{citation.snippet}"
      </p>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={() => onOpenSource?.(citation)}
          className="flex items-center gap-1 text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer border-none bg-transparent"
        >
          <span>Open Source</span>
          <ExternalLink size={11} />
        </button>
      </div>
    </div>
  )
}

export default CitationCard

