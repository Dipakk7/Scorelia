import React from 'react'
import { ArrowRight } from 'lucide-react'

const featureLegend = [
  { label: 'Resume Intelligence', pct: '32%', color: '#a855f7' },
  { label: 'ATS Analysis', pct: '20%', color: '#3b82f6' },
  { label: 'Interview Prep', pct: '18%', color: '#06b6d4' },
  { label: 'Cover Letter', pct: '12%', color: '#f97316' },
  { label: 'Career Roadmap', pct: '10%', color: '#ec4899' },
  { label: 'Others', pct: '8%', color: '#64748b' },
]

export function TopFeaturesPlaceholder({ onViewFull }: { onViewFull?: () => void }) {
  return (
    <div className="flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0f101c] border border-white/10 text-left">
      {/* Header */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-slate-100 m-0 tracking-tight">
          Top Features by Usage
        </h3>
      </div>

      {/* Donut & Legend Container */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-3">
        {/* Donut SVG */}
        <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Donut Segments */}
            {/* Resume Intelligence 32% (stroke-dasharray: 32 68) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#a855f7"
              strokeWidth="14"
              strokeDasharray="76 162"
              strokeDashoffset="0"
            />
            {/* ATS Analysis 20% (dash: 48 190) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="14"
              strokeDasharray="47 191"
              strokeDashoffset="-77"
            />
            {/* Interview Prep 18% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="14"
              strokeDasharray="43 195"
              strokeDashoffset="-125"
            />
            {/* Cover Letter 12% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#f97316"
              strokeWidth="14"
              strokeDasharray="28 210"
              strokeDashoffset="-169"
            />
            {/* Career Roadmap 10% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#ec4899"
              strokeWidth="14"
              strokeDasharray="24 214"
              strokeDashoffset="-198"
            />
            {/* Others 8% */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#64748b"
              strokeWidth="14"
              strokeDasharray="19 219"
              strokeDashoffset="-223"
            />
          </svg>

          {/* Center Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-extrabold text-slate-100 font-mono leading-none">
              3,421
            </span>
            <span className="text-[10px] font-semibold text-slate-400 mt-1 leading-none">
              Total Usage
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-1.5 w-full text-xs">
          {featureLegend.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-300 font-medium truncate">{item.label}</span>
              </div>
              <span className="text-slate-100 font-mono font-bold shrink-0">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Link */}
      <div className="pt-2 border-t border-white/5 flex justify-end">
        <button
          type="button"
          onClick={onViewFull}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View full breakdown</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default TopFeaturesPlaceholder
