import React from 'react'
import { BookOpen, Plus, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyKnowledgeStateProps {
  onResetFilters?: () => void
  onCreateCollection?: () => void
  className?: string
}

export function EmptyKnowledgeState({
  onResetFilters,
  onCreateCollection,
  className,
}: EmptyKnowledgeStateProps) {
  return (
    <div
      className={cn(
        'p-12 rounded-2xl bg-[#111322] border border-white/10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl select-none',
        className
      )}
    >
      <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
        <BookOpen size={36} className="animate-pulse" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-white tracking-tight">No collections found</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          No knowledge collections found matching your current filter. Create a new vector collection or add a document source.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0b0c14] border border-white/10 hover:border-white/20 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
          >
            <RefreshCw size={14} />
            <span>Reset Filters</span>
          </button>
        )}

        {onCreateCollection && (
          <button
            type="button"
            onClick={onCreateCollection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>Add Collection</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyKnowledgeState
