import React from 'react'
import { BarChart3, Clock, RefreshCw, Database } from 'lucide-react'
import type { TimeRange } from '@/data/ragAnalyticsMockData'
import { cn } from '@/lib/utils'

export interface AnalyticsHeaderProps {
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  currentCollection?: string
  lastUpdated?: string
  className?: string
}

export function AnalyticsHeader({
  timeRange,
  onTimeRangeChange,
  currentCollection = 'AI Research Papers',
  lastUpdated = 'Just now',
  className
}: AnalyticsHeaderProps) {
  const ranges: { id: TimeRange; label: string }[] = [
    { id: '1h', label: 'Last Hour' },
    { id: '24h', label: 'Today' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' }
  ]

  return (
    <div className={cn('flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-left', className)}>
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 font-sans">
          <BarChart3 className="w-6 h-6 text-purple-400 shrink-0" />
          Retrieval Analytics
        </h2>
        <p className="text-xs text-slate-400">
          Monitor retrieval quality, search performance, and infrastructure health.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Collection & Sync Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Database size={13} className="shrink-0" />
            <span>{currentCollection}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <RefreshCw size={12} className="animate-spin shrink-0" style={{ animationDuration: '6s' }} />
            <span>{lastUpdated}</span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center p-1 rounded-xl bg-[#121320] border border-white/10 select-none">
          {ranges.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onTimeRangeChange(r.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                timeRange === r.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsHeader
