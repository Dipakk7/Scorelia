import React from 'react'
import { Sparkles, Calendar, ChevronDown, Download, Plus, Clock } from 'lucide-react'

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
      className={`p-4 md:p-6 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] shadow-lg shadow-purple-950/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all duration-200 ${className}`}
    >
      {/* Left: Title, Subtitle, Status & Timestamp */}
      <div className="space-y-2 text-left">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display m-0 flex items-center gap-2 drop-shadow-xs">
            Analytics Center
            <Sparkles size={22} className="text-purple-400 fill-purple-400/20 shrink-0" />
          </h1>

          {/* Operational Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {statusMessage}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 font-medium">
          <p className="m-0">Executive analytics and operational intelligence for Scorelia.</p>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-400 text-[11px] font-mono">
            <Clock size={12} className="text-slate-500 shrink-0" />
            <span>Updated {lastUpdated}</span>
          </span>
        </div>
      </div>

      {/* Right Side Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Date Range Picker Placeholder */}
        <button
          type="button"
          aria-label="Select date range"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-xl bg-purple-600/10 border border-purple-500/20 text-xs font-semibold text-purple-200 hover:bg-purple-600/20 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
        >
          <Calendar size={15} className="text-purple-400 shrink-0" />
          <span>May 11 – May 17, 2025</span>
          <ChevronDown size={14} className="text-purple-300 shrink-0 ml-0.5" />
        </button>

        {/* Export Report Button */}
        <button
          type="button"
          onClick={onExportReport}
          aria-label="Export report"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-xs font-semibold text-purple-300 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-xl transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
        >
          <Download size={15} className="text-purple-400 shrink-0" />
          <span>Export Report</span>
        </button>

        {/* Add Widget Button (Primary CTA) */}
        <button
          type="button"
          onClick={onAddWidget}
          aria-label="Add widget"
          className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 min-h-[44px] text-xs font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/25 border border-purple-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
        >
          <Plus size={16} className="shrink-0 stroke-[2.5]" />
          <span>Add Widget</span>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsHero
