import React from 'react'
import { PieChart, RefreshCw } from 'lucide-react'

interface EmptyChartStateProps {
  onResetFilters?: () => void
  message?: string
  className?: string
}

export function EmptyChartState({
  onResetFilters,
  message = 'No analytics chart records match the selected date range or category filters.',
  className = '',
}: EmptyChartStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-[#0f101c] border border-white/10 text-center space-y-4 my-4 ${className}`}
      role="status"
    >
      <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-950/30">
        <PieChart size={32} className="stroke-[1.75]" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-slate-100 m-0">
          Chart Telemetry Empty
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed m-0">
          {message}
        </p>
      </div>

      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-900/40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <RefreshCw size={14} className="shrink-0" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  )
}

export default EmptyChartState
