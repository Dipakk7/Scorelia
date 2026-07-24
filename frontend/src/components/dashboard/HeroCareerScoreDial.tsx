import React from 'react'
import { ArrowUpRight } from 'lucide-react'

interface HeroCareerScoreDialProps {
  score?: number
  scoreChange?: string
  percentile?: number
  targetRole?: string
  onViewBenchmark?: () => void
}

export const HeroCareerScoreDial: React.FC<HeroCareerScoreDialProps> = React.memo(({
  score = 87,
  scoreChange = '↑ 12% vs last week',
  percentile = 22,
  targetRole = 'AI/ML Engineer',
  onViewBenchmark,
}) => {
  // Clamp score safely between 0 and 100
  const clampedScore = Math.min(100, Math.max(0, score))

  // Compute SVG circle parameters for gauge
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121325] via-[#0f101d] to-[#18122c] border border-purple-500/20 backdrop-blur-md shadow-xl flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-4">
        {/* SVG Gradient Circular Dial Gauge */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <defs>
              <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              stroke="url(#scoreGaugeGrad)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white font-mono leading-none">{score}</span>
            <span className="text-[7.5px] text-purple-300 font-mono uppercase tracking-widest block mt-0.5">Score</span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white tracking-tight">Career Intelligence Score</h3>
          <p className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1">
            <span>{scoreChange}</span>
          </p>
        </div>
      </div>

      <div className="hidden sm:flex flex-col items-end text-right border-l border-white/10 pl-4 space-y-1">
        <span className="text-xs text-slate-300">
          You are in top <span className="text-purple-400 font-bold font-mono">{percentile}%</span>
        </span>
        <span className="text-[10px] text-slate-500">in {targetRole} roles</span>
        <button
          onClick={onViewBenchmark}
          className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-1 transition-colors cursor-pointer"
        >
          <span>View benchmark</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  )
})
export default HeroCareerScoreDial
