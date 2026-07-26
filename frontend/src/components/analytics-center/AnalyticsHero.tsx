import React from 'react'
import { Sparkles, Calendar, ChevronDown, Download, Plus, CheckCircle2, Clock } from 'lucide-react'

interface AnalyticsHeroProps {
  lastUpdated?: string
  statusMessage?: string
  onExportReport?: () => void
  onAddWidget?: () => void
  className?: string
}

export function AnalyticsHero({
  lastUpdated = 'May 17, 2025 • 10:45 AM',
  statusMessage = 'All systems operational',
  onExportReport,
  onAddWidget,
  className = '',
}: AnalyticsHeroProps) {
  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 ${className}`}
    >
      {/* Left: Title, Subtitle, Status & Timestamp */}
      <div className="space-y-1.5 text-left">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight font-display m-0">
            Analytics Center
          </h1>
          <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles size={18} className="animate-pulse shrink-0" />
          </div>

          {/* Operational Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {statusMessage}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
          <p className="m-0">Executive overview of your platform performance</p>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px] font-mono">
            <Clock size={12} className="text-slate-500 shrink-0" />
            <span>Updated {lastUpdated}</span>
          </span>
        </div>
      </div>

      {/* Right Side Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Date Range Picker Placeholder */}
        <button
          type="button"
          aria-label="Select date range"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121320] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer min-h-[44px]"
        >
          <Calendar size={15} className="text-slate-400 shrink-0" />
          <span>May 11 – May 17, 2025</span>
          <ChevronDown size={14} className="text-slate-400 shrink-0 ml-0.5" />
        </button>

        {/* Export Report Button */}
        <button
          type="button"
          onClick={onExportReport}
          aria-label="Export report"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121320] border border-white/10 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/5 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer min-h-[44px]"
        >
          <Download size={15} className="text-slate-400 shrink-0" />
          <span>Export Report</span>
        </button>

        {/* Add Widget Button */}
        <button
          type="button"
          onClick={onAddWidget}
          aria-label="Add widget"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-900/30 hover:shadow-purple-900/50 hover:brightness-110 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer min-h-[44px]"
        >
          <Plus size={16} className="shrink-0 stroke-[2.5]" />
          <span>Add Widget</span>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsHero
