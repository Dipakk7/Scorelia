import React from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'

interface EmptyInsightsStateProps {
  onRefresh?: () => void
  message?: string
  className?: string
}

export function EmptyInsightsState({
  onRefresh,
  message = 'No AI insights or activity events recorded for the current timeframe.',
  className = '',
}: EmptyInsightsStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-[#0f101c] border border-white/10 text-center space-y-3 my-2 ${className}`}
      role="status"
    >
      <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-950/30">
        <Sparkles size={24} className="stroke-[1.75]" />
      </div>

      <div className="max-w-xs space-y-1">
        <h4 className="text-xs font-bold text-slate-100 m-0">
          No Intelligence Data
        </h4>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed m-0">
          {message}
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-900/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <RefreshCw size={13} className="shrink-0" />
          <span>Refresh Insights</span>
        </button>
      )}
    </div>
  )
}

export default EmptyInsightsState
