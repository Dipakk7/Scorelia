import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { RetrievedDocument } from '@/data/ragQueryMockData'
import { RetrievedDocumentCard } from './RetrievedDocumentCard'
import { cn } from '@/lib/utils'

export interface SearchResultsProps {
  documents: RetrievedDocument[]
  onViewAll?: () => void
  className?: string
}

export function SearchResults({ documents, onViewAll, className }: SearchResultsProps) {
  if (!documents || documents.length === 0) return null

  return (
    <div className={cn('p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400 shrink-0" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Retrieved Documents ({documents.length})
          </h3>
        </div>
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {documents.map((doc) => (
          <RetrievedDocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  )
}

export default SearchResults
