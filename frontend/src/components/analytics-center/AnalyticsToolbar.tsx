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
      className={`hidden md:flex items-center justify-between p-3 rounded-xl bg-[#0f101c]/80 border border-white/5 backdrop-blur-md text-xs text-slate-400 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-slate-300">
          <Layers size={14} className="text-purple-400" />
          Dashboard View:
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[11px] font-semibold">
          Executive Real-time Operational Intelligence
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onCustomizeDashboard && (
          <button
            type="button"
            onClick={onCustomizeDashboard}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
            aria-label="Customize dashboard layout and widgets"
          >
            <SlidersHorizontal size={13} className="shrink-0" />
            <span>Customize Dashboard</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          aria-label="Refresh analytics data"
        >
          <RefreshCw size={13} className="shrink-0" />
          <span>Sync Data</span>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsToolbar
