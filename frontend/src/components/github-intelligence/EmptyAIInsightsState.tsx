import React from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyAIInsightsStateProps {
  onSync?: () => void
  onGenerate?: () => void
  className?: string
}

export const EmptyAIInsightsState: React.FC<EmptyAIInsightsStateProps> = ({
  onSync,
  onGenerate,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[280px] p-6 text-center rounded-3xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md shadow-sm space-y-4 font-sans select-none',
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <Sparkles size={32} />
      </div>

      <div className="max-w-xs space-y-1">
        <h4 className="text-base font-bold text-[var(--heading)] m-0">No AI Insights Available</h4>
        <p className="text-xs text-[var(--muted)] m-0 leading-relaxed">
          Sync your GitHub activity to generate real-time AI code reviews, smart recommendations, and goals.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSync}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--heading)] hover:bg-[var(--border)]/50 transition-all cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Sync Data</span>
        </button>

        <button
          type="button"
          onClick={onGenerate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md transition-all cursor-pointer"
        >
          <Sparkles size={13} />
          <span>Generate Insights</span>
        </button>
      </div>
    </div>
  )
}
