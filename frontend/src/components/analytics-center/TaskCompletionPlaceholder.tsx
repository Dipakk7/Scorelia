import React from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

export function TaskCompletionPlaceholder({ onViewReport }: { onViewReport?: () => void }) {
  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left">
      {/* Header & Controls */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
            Task Completion Trend
          </h3>
          {/* Legend */}
          <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span className="text-slate-300">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              <span className="text-slate-300">In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span className="text-slate-300">Failed</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151628] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Weekly</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* Stacked Bar Chart SVG Placeholder */}
      <div className="relative w-full h-44 my-2">
        <svg
          viewBox="0 0 500 160"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          {/* Grid lines */}
          <line x1="30" y1="20" x2="490" y2="20" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="20" y="24" fill="#64748b" fontSize="10" textAnchor="end">4K</text>

          <line x1="30" y1="55" x2="490" y2="55" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="20" y="59" fill="#64748b" fontSize="10" textAnchor="end">3K</text>

          <line x1="30" y1="90" x2="490" y2="90" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="20" y="94" fill="#64748b" fontSize="10" textAnchor="end">2K</text>

          <line x1="30" y1="125" x2="490" y2="125" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="20" y="129" fill="#64748b" fontSize="10" textAnchor="end">1K</text>

          <line x1="30" y1="145" x2="490" y2="145" stroke="#ffffff1a" />
          <text x="20" y="149" fill="#64748b" fontSize="10" textAnchor="end">0</text>

          {/* Bar 1: Apr 20 - Apr 26 */}
          <g transform="translate(65, 0)">
            <rect x="0" y="138" width="40" height="7" rx="2" fill="#f59e0b" />
            <rect x="0" y="110" width="40" height="26" rx="2" fill="#3b82f6" />
            <rect x="0" y="70" width="40" height="38" rx="2" fill="#10b981" />
          </g>

          {/* Bar 2: Apr 27 - May 3 */}
          <g transform="translate(180, 0)">
            <rect x="0" y="137" width="40" height="8" rx="2" fill="#f59e0b" />
            <rect x="0" y="105" width="40" height="30" rx="2" fill="#3b82f6" />
            <rect x="0" y="60" width="40" height="43" rx="2" fill="#10b981" />
          </g>

          {/* Bar 3: May 4 - May 10 */}
          <g transform="translate(295, 0)">
            <rect x="0" y="135" width="40" height="10" rx="2" fill="#f59e0b" />
            <rect x="0" y="95" width="40" height="38" rx="2" fill="#3b82f6" />
            <rect x="0" y="45" width="40" height="48" rx="2" fill="#10b981" />
          </g>

          {/* Bar 4: May 11 - May 17 */}
          <g transform="translate(410, 0)">
            <rect x="0" y="133" width="40" height="12" rx="2" fill="#f59e0b" />
            <rect x="0" y="85" width="40" height="46" rx="2" fill="#3b82f6" />
            <rect x="0" y="30" width="40" height="53" rx="2" fill="#10b981" />
          </g>

          {/* X Axis Labels */}
          <text x="85" y="158" fill="#64748b" fontSize="9" textAnchor="middle">Apr 20 – Apr 26</text>
          <text x="200" y="158" fill="#64748b" fontSize="9" textAnchor="middle">Apr 27 – May 3</text>
          <text x="315" y="158" fill="#64748b" fontSize="9" textAnchor="middle">May 4 – May 10</text>
          <text x="430" y="158" fill="#64748b" fontSize="9" textAnchor="middle">May 11 – May 17</text>
        </svg>
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-white/5 flex justify-end">
        <button
          type="button"
          onClick={onViewReport}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View detailed report</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default TaskCompletionPlaceholder
