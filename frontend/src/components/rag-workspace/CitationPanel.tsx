import React from 'react'
import { BookMarked } from 'lucide-react'
import type { CitationItem } from '@/data/ragQueryMockData'
import { CitationCard } from './CitationCard'
import { cn } from '@/lib/utils'

export interface CitationPanelProps {
  citations: CitationItem[]
  onOpenSource?: (citation: CitationItem) => void
  className?: string
}

export function CitationPanel({ citations, onOpenSource, className }: CitationPanelProps) {
  if (!citations || citations.length === 0) return null

  return (
    <div className={cn('p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-3', className)}>
      <div className="flex items-center gap-2 border-b border-white/10 pb-2.5">
        <BookMarked size={16} className="text-purple-400 shrink-0" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Source Citations ({citations.length})
        </h4>
      </div>

      <div className="space-y-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
        {citations.map((citation) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            onOpenSource={onOpenSource}
          />
        ))}
      </div>
    </div>
  )
}

export default CitationPanel
