import React from 'react'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyDeveloperPerformanceStateProps {
  onSync?: () => void
  className?: string
}

export const EmptyDeveloperPerformanceState: React.FC<EmptyDeveloperPerformanceStateProps> = ({
  onSync,
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
        <ShieldCheck size={36} />
      </div>

      <div className="max-w-md space-y-1">
        <h4 className="text-lg font-bold text-[var(--heading)] m-0">No Developer Metrics Available</h4>
        <p className="text-xs text-[var(--muted)] m-0 leading-relaxed">
          Sync your GitHub repository data to generate developer productivity scores, commit activity trends, PR merge rates, and code quality audits.
        </p>
      </div>

      <button
        type="button"
        onClick={onSync}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      >
        <RefreshCw size={14} />
        <span>Sync Developer Metrics</span>
      </button>
    </div>
  )
}
