import React from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RetrievalPerformanceCard() {
  return (
    <div className="p-5 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 shadow-lg text-left space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Retrieval Performance</h3>
        <select
          aria-label="Filter retrieval performance time range"
          defaultValue="7d"
          className="bg-[#121320] border border-white/10 text-[11px] text-slate-300 px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
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
              className="text-slate-800"
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
            <span className="text-lg font-black text-white">92%</span>
            <span className="text-[9px] font-semibold text-slate-400 mt-0.5">Success Rate</span>
          </div>
        </div>

        {/* Legend Status Counts */}
        <div className="space-y-2 text-xs flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Successful</span>
            </div>
            <span className="font-mono text-slate-300 font-bold">3,142</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-300">Partial</span>
            </div>
            <span className="font-mono text-slate-300 font-bold">198</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span className="text-slate-300">Failed</span>
            </div>
            <span className="font-mono text-slate-300 font-bold">81</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 text-purple-300 text-xs font-semibold transition-all cursor-pointer"
      >
        <span>View Full Analytics</span>
        <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default RetrievalPerformanceCard
