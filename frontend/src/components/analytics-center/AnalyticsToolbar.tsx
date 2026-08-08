import React from 'react'
import { RefreshCw, Layers, SlidersHorizontal } from 'lucide-react'

interface AnalyticsToolbarProps {
  onRefresh?: () => void
  onCustomizeDashboard?: () => void
  className?: string
}

export function AnalyticsToolbar({
  onRefresh,
  onCustomizeDashboard,
  className = '',
}: AnalyticsToolbarProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#121426]/90 border border-white/10 backdrop-blur-md text-xs text-slate-400 shadow-md transition-all ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 font-bold text-slate-200">
          <Layers size={15} className="text-purple-400 shrink-0" />
          Dashboard View:
        </span>
        <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-bold tracking-tight truncate">
          Executive Real-time Operational Intelligence
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {onCustomizeDashboard && (
          <button
            type="button"
            onClick={onCustomizeDashboard}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 font-semibold text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            aria-label="Customize dashboard layout and widgets"
          >
            <SlidersHorizontal size={13} className="shrink-0 text-purple-300" />
            <span>Customize Dashboard</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          aria-label="Refresh analytics data"
        >
          <RefreshCw size={13} className="shrink-0 text-slate-400" />
          <span>Sync Data</span>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsToolbar
