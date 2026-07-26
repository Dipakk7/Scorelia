import React from 'react'
import { FolderPlus, Plus, Download, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyCollectionsStateProps {
  onCreateCollection?: () => void
  onImportExisting?: () => void
  className?: string
}

export function EmptyCollectionsState({
  onCreateCollection,
  onImportExisting,
  className
}: EmptyCollectionsStateProps) {
  return (
    <div
      className={cn(
        'p-10 sm:p-14 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-center space-y-5 my-4 max-w-xl mx-auto',
        className
      )}
    >
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto shadow-inner">
        <FolderPlus size={32} />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-extrabold text-white tracking-tight font-sans">
          No Collections Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
          Create your first knowledge collection to begin indexing documents and running AI retrieval queries.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCreateCollection}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/40 cursor-pointer active:scale-95 min-h-[44px]"
        >
          <Plus size={16} />
          <span>Create Collection</span>
        </button>

        <button
          type="button"
          onClick={onImportExisting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#121320] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
        >
          <Download size={15} />
          <span>Import Existing</span>
        </button>
      </div>
    </div>
  )
}

export default EmptyCollectionsState
