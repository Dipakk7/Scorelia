import React, { useState, useEffect, useMemo } from 'react'
import { Info, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Tooltip } from '@/components/ui/Tooltip'

interface ScoreOverviewCardProps {
  score?: number
  maxScore?: number
  statusText?: string
  percentileText?: string
  headlineText?: string
  descriptionText?: string
  onViewInsights?: () => void
}

export const ScoreOverviewCard: React.FC<ScoreOverviewCardProps> = React.memo(({
  score = 92,
  maxScore = 100,
  statusText = 'Excellent',
  percentileText = 'Top 18% of candidates',
  headlineText = "Your resume is performing great! 🎉",
  descriptionText = "You're in the top 18% of candidates. Address the suggested improvements to reach the top 10%.",
  onViewInsights,
}) => {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Animated Count Up Effect
  useEffect(() => {
    let start = 0
    const duration = 1000 // 1 second
    const increment = score / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  // Semi-circle SVG Arc Calculation (Memoized for performance)
  const radius = 70
  const strokeWidth = 14
  const circumference = useMemo(() => Math.PI * radius, [radius])
  const strokeDashoffset = useMemo(
    () => circumference - (animatedScore / maxScore) * circumference,
    [animatedScore, maxScore, circumference]
  )

  return (
    <Card className="bg-[#0b0c14]/90 border-slate-800/80 p-5 md:p-6 rounded-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-full shadow-lg">
      <h3 className="text-sm font-semibold text-slate-200 mb-4 tracking-tight">
        Resume Intelligence Score
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center flex-1">
        {/* Left Side: Semi-Circular Gauge Meter */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-24 flex justify-center items-end">
            <svg
              className="w-44 h-44 -rotate-180 transform"
              viewBox="0 0 160 160"
              aria-label={`Overall Resume Score ${score} out of ${maxScore}`}
              role="img"
            >
              {/* Background Track Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Foreground Gradient Arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out motion-reduce:transition-none"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>

            {/* Centered Score Label inside semi-circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none font-mono">
                {animatedScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/{maxScore}</span>
            </div>
          </div>

          {/* Status Badge & Percentile Tooltip */}
          <div className="flex flex-col items-center gap-1.5 mt-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
              {statusText}
            </span>

            <Tooltip content="Your score places you higher than 82% of all analyzed candidate resumes in your target job tier.">
              <button
                className="flex items-center gap-1 min-h-[44px] text-[11px] text-slate-400 hover:text-slate-200 font-medium transition-colors cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                aria-label={`Percentile Information: ${percentileText}`}
              >
                <span>{percentileText}</span>
                <Info className="w-3 h-3 text-slate-500" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Right Side: Copy & Insights Action */}
        <div className="sm:col-span-7 flex flex-col justify-center gap-3 text-center sm:text-left">
          <h4 className="text-base md:text-lg font-bold text-white leading-snug">
            {headlineText}
          </h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            {descriptionText}
          </p>

          <div className="pt-2">
            <button
              onClick={onViewInsights}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/40 text-purple-300 hover:text-purple-200 text-xs md:text-sm font-semibold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 group"
              aria-label="View Key Resume Insights"
            >
              <span>View Key Insights</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform motion-reduce:transition-none" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
})

ScoreOverviewCard.displayName = 'ScoreOverviewCard'
export default ScoreOverviewCard
