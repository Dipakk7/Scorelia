import React from 'react'
import { ChevronDown } from 'lucide-react'

export function ActiveUsersPlaceholder() {
  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
            Active Users Growth
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
            Unique active users over time
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151628] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Last 30 Days</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* Line SVG Chart Container */}
      <div className="relative w-full h-52 my-2 flex items-end">
        <svg
          viewBox="0 0 500 180"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y Axis Gridlines */}
          <line x1="45" y1="20" x2="490" y2="20" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="35" y="24" fill="#64748b" fontSize="10" textAnchor="end">1.25K</text>

          <line x1="45" y1="50" x2="490" y2="50" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="35" y="54" fill="#64748b" fontSize="10" textAnchor="end">1K</text>

          <line x1="45" y1="80" x2="490" y2="80" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="35" y="84" fill="#64748b" fontSize="10" textAnchor="end">750</text>

          <line x1="45" y1="110" x2="490" y2="110" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="35" y="114" fill="#64748b" fontSize="10" textAnchor="end">500</text>

          <line x1="45" y1="140" x2="490" y2="140" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="35" y="144" fill="#64748b" fontSize="10" textAnchor="end">250</text>

          <line x1="45" y1="170" x2="490" y2="170" stroke="#ffffff1a" />
          <text x="35" y="174" fill="#64748b" fontSize="10" textAnchor="end">0</text>

          {/* Area gradient path */}
          <path
            d="M 45 140 L 130 115 L 215 100 L 300 85 L 385 65 L 490 45 L 490 170 L 45 170 Z"
            fill="url(#cyanArea)"
          />

          {/* Trend Line Path */}
          <path
            d="M 45 140 L 80 130 L 110 120 L 140 110 L 180 125 L 220 95 L 260 100 L 300 85 L 340 70 L 380 75 L 420 55 L 455 60 L 490 45"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Active Node Tooltip (May 16, 2025) */}
          <circle cx="420" cy="55" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
          <g transform="translate(365, 8)">
            <rect
              x="0"
              y="0"
              width="110"
              height="36"
              rx="8"
              fill="#18192e"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text x="55" y="14" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">
              May 16, 2025
            </text>
            <text x="55" y="27" fill="#f8fafc" fontSize="10" fontWeight="800" textAnchor="middle">
              Active Users: <tspan fill="#38bdf8">892</tspan>
            </text>
          </g>

          {/* X Axis Ticks */}
          <text x="45" y="185" fill="#64748b" fontSize="9" textAnchor="middle">Apr 18</text>
          <text x="156" y="185" fill="#64748b" fontSize="9" textAnchor="middle">Apr 25</text>
          <text x="267" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 2</text>
          <text x="378" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 9</text>
          <text x="490" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 16</text>
        </svg>
      </div>
    </div>
  )
}

export default ActiveUsersPlaceholder
