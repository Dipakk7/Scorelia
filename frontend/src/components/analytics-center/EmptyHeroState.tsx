import React from 'react'
import { BarChart2, RefreshCw } from 'lucide-react'

interface EmptyHeroStateProps {
  onRetry?: () => void
  message?: string
  className?: string
}

export function EmptyHeroState({
  onRetry,
  message = 'No executive telemetry data available for the selected date range.',
  className = '',
}: EmptyHeroStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-[#0f101c] border border-white/10 text-center space-y-4 my-4 ${className}`}
      role="status"
    >
      <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-950/30">
        <BarChart2 size={32} className="stroke-[1.75]" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-slate-100 m-0">
          Executive Data Unavailable
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed m-0">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-900/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <RefreshCw size={14} className="shrink-0" />
          <span>Refresh Hero Metrics</span>
        </button>
      )}
    </div>
  )
}

export default EmptyHeroState
