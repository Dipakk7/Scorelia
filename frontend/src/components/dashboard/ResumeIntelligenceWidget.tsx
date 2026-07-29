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
    <div
      role="region"
      aria-label="Resume Intelligence Metrics"
      className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] backdrop-blur-md space-y-3 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all select-none overflow-hidden"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--heading)] tracking-tight">Resume Intelligence</h3>
        <button
          onClick={onViewDetails}
          aria-label="View detailed resume intelligence breakdown"
          className="text-[10px] font-mono text-purple-400 hover:text-purple-300 hover:underline cursor-pointer bg-transparent border-none p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded transition-colors"
        >
          View details
        </button>
      </div>

      {/* Balanced 2x2 Metric Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 items-center w-full py-0.5">
        {rings.map((ring, idx) => {
          const r = 17
          const circ = 2 * Math.PI * r
          const offset = circ - (ring.score / 100) * circ
          return (
            <div
              key={idx}
              role="group"
              aria-label={`${ring.label}: ${ring.score}% (${ring.status})`}
              className="flex flex-col items-center justify-center text-center min-w-0 w-full"
            >
              {/* Circular Progress Ring Container (36px diameter) */}
              <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
                <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r={r}
                    stroke="var(--border)"
                    strokeWidth="3.2"
                    fill="transparent"
                    opacity={0.5}
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={r}
                    stroke={ring.color}
                    strokeWidth="3.2"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono text-[var(--heading)]">
                  {ring.score}
                </span>
              </div>

              {/* Metric Title */}
              <span className="text-xs font-semibold text-[var(--heading)] text-center tracking-tight leading-none mt-1.5 min-w-0 max-w-full font-sans">
                {ring.label}
              </span>

              {/* Status Label */}
              <span className="text-[10px] font-mono font-medium text-emerald-400/80 uppercase tracking-wider leading-none mt-1 min-w-0 max-w-full">
                {ring.status}
              </span>
            </div>
          )
        })}
      </div>

      {/* Bottom Recommendation Banner */}
      <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs leading-snug font-sans text-[var(--heading)] flex items-start gap-2 transition-all duration-200 hover:border-purple-500/30">
        <span className="text-purple-700 dark:text-purple-400 text-xs shrink-0 mt-0.5">✦</span>
        <span className="leading-snug text-[var(--heading)]">{tipText}</span>
      </div>
    </div>
  )
})

export default ResumeIntelligenceWidget
