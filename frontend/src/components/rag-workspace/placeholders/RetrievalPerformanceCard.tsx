import React from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RetrievalPerformanceCard() {
  return (
    <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-sm)] text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--heading)] tracking-tight">Retrieval Performance</h3>
        <select
          aria-label="Filter retrieval performance time range"
          defaultValue="7d"
          className="bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] text-[var(--heading)] px-2.5 py-1 rounded-xl focus:outline-none cursor-pointer"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      {/* Donut Gauge & Legend Row */}
      <div className="flex items-center justify-between gap-4 py-2">
        {/* CSS Donut Chart Ring */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[var(--border)]"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Green Segment (Successful 92%) */}
            <path
              className="text-emerald-400"
              strokeDasharray="92, 100"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
            <span className="text-lg font-black text-[var(--heading)]">92%</span>
            <span className="text-[9px] font-semibold text-[var(--muted)] mt-0.5">Success Rate</span>
          </div>
        </div>

        {/* Legend Status Counts */}
        <div className="space-y-2 text-xs flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[var(--muted)]">Successful</span>
            </div>
            <span className="font-mono text-[var(--heading)] font-bold">3,142</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[var(--muted)]">Partial</span>
            </div>
            <span className="font-mono text-[var(--heading)] font-bold">198</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span className="text-[var(--muted)]">Failed</span>
            </div>
            <span className="font-mono text-[var(--heading)] font-bold">81</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--surface)] border border-[var(--border)] hover:border-purple-500/30 text-purple-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
      >
        <span>View Full Analytics</span>
        <ArrowRight size={14} />
      </button>
    </div>
  )
}


export default RetrievalPerformanceCard
