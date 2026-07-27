import React from 'react'
import { BarChart2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyRepositoryAnalyticsStateProps {
  onSync?: () => void
  className?: string
}

export const EmptyRepositoryAnalyticsState: React.FC<EmptyRepositoryAnalyticsStateProps> = ({
  onSync,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[280px] p-8 text-center rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-4 font-sans',
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <BarChart2 size={32} />
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-bold text-[var(--heading)] m-0">No Analytics Data Available</h4>
        <p className="text-xs text-[var(--muted)] m-0 leading-relaxed">
          Sync your repository activity to populate contribution timelines, contribution breakdowns, and language statistics.
        </p>
      </div>

      <button
        type="button"
        onClick={onSync}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <RefreshCw size={14} />
        <span>Sync GitHub Data</span>
      </button>
    </div>
  )
}
