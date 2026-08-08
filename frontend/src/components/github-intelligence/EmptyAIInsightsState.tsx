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
        'flex flex-col items-center justify-center min-h-[300px] p-6 text-center rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 space-y-4 font-sans select-none',
        className
      )}
    >
      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
        <Sparkles size={32} />
      </div>

      <div className="max-w-xs space-y-1">
        <h4 className="text-base font-bold text-white m-0">No AI Insights Available</h4>
        <p className="text-xs text-slate-400 m-0 leading-relaxed font-sans">
          Sync your GitHub activity to generate real-time AI code reviews, smart recommendations, and goals.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-1">
        {onSync && (
          <button
            type="button"
            onClick={onSync}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Sync Data</span>
          </button>
        )}

        {onGenerate && (
          <button
            type="button"
            onClick={onGenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/20 transition-all cursor-pointer"
          >
            <Sparkles size={13} />
            <span>Generate Insights</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyAIInsightsState
