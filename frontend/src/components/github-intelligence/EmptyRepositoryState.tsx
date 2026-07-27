import React from 'react'
import { FolderGit2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyRepositoryStateProps {
  onSync?: () => void
  onResetFilters?: () => void
  isFiltered?: boolean
  className?: string
}

export const EmptyRepositoryState: React.FC<EmptyRepositoryStateProps> = ({
  onSync,
  onResetFilters,
  isFiltered = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[320px] p-8 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-4 font-sans select-none',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <FolderGit2 size={36} />
      </div>

      <div className="max-w-md space-y-1">
        <h4 className="text-lg font-bold text-[var(--heading)] m-0">
          {isFiltered ? 'No Matching Repositories Found' : 'No Repositories Available'}
        </h4>
        <p className="text-xs text-[var(--muted)] m-0 leading-relaxed">
          {isFiltered
            ? 'Try adjusting your search query, language filters, or visibility options.'
            : 'Sync your GitHub account to import public and private repositories, stars, forks, and health analytics.'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {isFiltered && onResetFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--heading)] hover:bg-[var(--border)]/50 transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        ) : (
          <button
            type="button"
            onClick={onSync}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <RefreshCw size={14} />
            <span>Sync Repositories</span>
          </button>
        )}
      </div>
    </div>
  )
}
