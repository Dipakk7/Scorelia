import React from 'react'

export interface ResumeMetricRing {
  label: string
  score: number
  status: string
  color: string
}

const DEFAULT_RINGS: ResumeMetricRing[] = [
  { label: 'Formatting', score: 95, status: 'Excellent', color: '#10b981' },
  { label: 'Keywords', score: 88, status: 'Good', color: '#38bdf8' },
  { label: 'Achievements', score: 91, status: 'Excellent', color: '#a855f7' },
  { label: 'Readability', score: 97, status: 'Excellent', color: '#ec4899' },
]

interface ResumeIntelligenceWidgetProps {
  rings?: ResumeMetricRing[]
  tipText?: string
  onViewDetails?: () => void
}

export const ResumeIntelligenceWidget: React.FC<ResumeIntelligenceWidgetProps> = React.memo(({
  rings = DEFAULT_RINGS,
  tipText = 'Great job! Your resume is well optimized. Keep updating your achievements.',
  onViewDetails,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0f101d]/90 border border-white/10 backdrop-blur-md space-y-4 shadow-xl select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-tight">Resume Intelligence</h3>
        <button
          onClick={onViewDetails}
          className="text-[10px] font-mono text-purple-400 hover:underline cursor-pointer bg-transparent border-none p-0"
        >
          View details
        </button>
      </div>

      {/* 4 Circular Gauge Rings Grid */}
      <div className="grid grid-cols-4 gap-2">
        {rings.map((ring, idx) => {
          const r = 22
          const circ = 2 * Math.PI * r
          const offset = circ - (ring.score / 100) * circ
          return (
            <div key={idx} className="flex flex-col items-center text-center p-2 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 50 50">
                  <circle
                    cx="25"
                    cy="25"
                    r={r}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r={r}
                    stroke={ring.color}
                    strokeWidth="4"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute text-xs font-black font-mono text-white">{ring.score}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-200 block truncate leading-none">{ring.label}</span>
              <span className="text-[8px] font-mono text-emerald-400 block uppercase tracking-wider">{ring.status}</span>
            </div>
          )
        })}
      </div>

      {/* Bottom Tip Status Pill */}
      <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-[11px] text-purple-200 flex items-center gap-2">
        <span className="text-purple-400 text-sm">✦</span>
        <span className="truncate">{tipText}</span>
      </div>
    </div>
  )
})
export default ResumeIntelligenceWidget
