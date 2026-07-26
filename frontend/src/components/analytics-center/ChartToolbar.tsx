import React, { useState } from 'react'
import { Calendar, RefreshCw, Download, BarChart2, TrendingUp, PieChart } from 'lucide-react'

export type TimeRangeType = 'today' | '7d' | '30d' | '90d' | 'custom'

interface ChartToolbarProps {
  timeRange?: TimeRangeType
  onTimeRangeChange?: (range: TimeRangeType) => void
  onRefresh?: () => void
  onExport?: () => void
  className?: string
}

export function ChartToolbar({
  timeRange = '7d',
  onTimeRangeChange,
  onRefresh,
  onExport,
  className = '',
}: ChartToolbarProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRangeType>(timeRange)

  const ranges: { id: TimeRangeType; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: 'custom', label: 'Custom' },
  ]

  const handleRangeClick = (range: TimeRangeType) => {
    setSelectedRange(range)
    onTimeRangeChange?.(range)
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0f101c] border border-white/10 ${className}`}
      aria-label="Chart Filter Toolbar"
    >
      {/* Time Range Selector Buttons */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {ranges.map((r) => {
          const isActive = selectedRange === r.id
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => handleRangeClick(r.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {r.label}
            </button>
          )
        })}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141526] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          title="Refresh chart metrics"
        >
          <RefreshCw size={13} className="text-slate-400 shrink-0" />
          <span>Sync</span>
        </button>

        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141526] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
          title="Export chart dataset"
        >
          <Download size={13} className="text-slate-400 shrink-0" />
          <span>Export</span>
        </button>
      </div>
    </div>
  )
}

export default ChartToolbar
