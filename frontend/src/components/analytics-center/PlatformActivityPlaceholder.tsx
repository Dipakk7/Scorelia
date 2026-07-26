import React from 'react'
import { ChevronDown } from 'lucide-react'

export function PlatformActivityPlaceholder() {
  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
            Platform Activity
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">
            Total sessions over time
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#151628] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>Daily</span>
          <ChevronDown size={13} className="text-slate-400" />
        </button>
      </div>

      {/* SVG Area Chart Container */}
      <div className="relative w-full h-52 my-2 flex items-end">
        <svg
          viewBox="0 0 500 180"
          className="w-full h-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines & Y Axis Labels */}
          <line x1="40" y1="20" x2="490" y2="20" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="30" y="24" fill="#64748b" fontSize="10" textAnchor="end">1.6K</text>

          <line x1="40" y1="60" x2="490" y2="60" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="30" y="64" fill="#64748b" fontSize="10" textAnchor="end">1.2K</text>

          <line x1="40" y1="100" x2="490" y2="100" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="30" y="104" fill="#64748b" fontSize="10" textAnchor="end">800</text>

          <line x1="40" y1="140" x2="490" y2="140" stroke="#ffffff0d" strokeDasharray="3 3" />
          <text x="30" y="144" fill="#64748b" fontSize="10" textAnchor="end">400</text>

          <line x1="40" y1="170" x2="490" y2="170" stroke="#ffffff1a" />
          <text x="30" y="174" fill="#64748b" fontSize="10" textAnchor="end">0</text>

          {/* Area gradient path */}
          <path
            d="M 40 130 Q 115 90, 190 60 T 340 50 T 490 80 L 490 170 L 40 170 Z"
            fill="url(#purpleArea)"
          />

          {/* Main Smooth Line */}
          <path
            d="M 40 130 C 90 110, 140 85, 190 60 C 240 35, 290 80, 340 50 C 390 20, 440 90, 490 80"
            fill="none"
            stroke="#c084fc"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Nodes */}
          <circle cx="40" cy="130" r="4" fill="#a855f7" />
          <circle cx="115" cy="98" r="4" fill="#a855f7" />
          <circle cx="190" cy="60" r="4" fill="#a855f7" />
          <circle cx="265" cy="55" r="4" fill="#a855f7" />
          <circle cx="340" cy="50" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="415" cy="72" r="4" fill="#a855f7" />
          <circle cx="490" cy="80" r="4" fill="#a855f7" />

          {/* Highlight Node Tooltip Box (May 14, 2025) */}
          <g transform="translate(290, 10)">
            <rect
              x="0"
              y="0"
              width="100"
              height="36"
              rx="8"
              fill="#18192e"
              stroke="#a855f7"
              strokeWidth="1"
            />
            <text x="50" y="14" fill="#94a3b8" fontSize="9" fontWeight="600" textAnchor="middle">
              May 14, 2025
            </text>
            <text x="50" y="27" fill="#f8fafc" fontSize="10" fontWeight="800" textAnchor="middle">
              Sessions: <tspan fill="#c084fc">1,248</tspan>
            </text>
          </g>

          {/* X Axis Labels */}
          <text x="40" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 11</text>
          <text x="115" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 12</text>
          <text x="190" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 13</text>
          <text x="265" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 14</text>
          <text x="340" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 15</text>
          <text x="415" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 16</text>
          <text x="490" y="185" fill="#64748b" fontSize="9" textAnchor="middle">May 17</text>
        </svg>
      </div>
    </div>
  )
}

export default PlatformActivityPlaceholder
