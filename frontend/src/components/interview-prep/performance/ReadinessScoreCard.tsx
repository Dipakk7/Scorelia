import React from 'react'
import { motion } from 'framer-motion'
import { Award, Target, Sparkles, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export interface ReadinessScoreCardProps {
  score?: number
  readinessTag?: string
  targetScore?: number
  nextMilestone?: string
}

export function ReadinessScoreCard({
  score = 87,
  readinessTag = 'Interview Ready',
  targetScore = 90,
  nextMilestone = 'FAANG Benchmark Level',
}: ReadinessScoreCardProps) {
  const radius = 65
  const strokeWidth = 12
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Overall Readiness Index
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Scorelia AI Readiness Assessment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400">{readinessTag}</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Semi-circle SVG Arc Gauge */}
        <div className="relative flex flex-col items-center justify-center pt-2">
          <svg width="170" height="95" viewBox="0 0 170 95">
            {/* Background Arc */}
            <path
              d="M 20 85 A 65 65 0 0 1 150 85"
              fill="none"
              stroke="#1e2238"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress Arc */}
            <motion.path
              d="M 20 85 A 65 65 0 0 1 150 85"
              fill="none"
              stroke="url(#readinessGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centered Score Label */}
          <div className="absolute top-10 flex flex-col items-center text-center">
            <span className="text-3xl font-black text-white font-mono leading-none">
              {score}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              / 100 Points
            </span>
          </div>
        </div>

        {/* Milestone & Target Details */}
        <div className="flex-1 space-y-3.5 w-full">
          {/* Target Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                Target Progress ({score}% / {targetScore}%)
              </span>
              <span className="font-bold text-purple-300 font-mono">
                {Math.round((score / targetScore) * 100)}% Complete
              </span>
            </div>
            <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score / targetScore) * 100}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 rounded-full shadow-sm"
              />
            </div>
          </div>

          {/* Next Milestone Note */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/25 text-xs space-y-0.5 hover:border-purple-500/40 transition-all">
            <span className="text-slate-400 font-medium block text-[11px]">Next Milestone Goal:</span>
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              {nextMilestone} (+3 points remaining)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default ReadinessScoreCard
