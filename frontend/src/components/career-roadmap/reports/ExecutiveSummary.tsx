import React from 'react'
import { Award, CheckCircle2, Target, Zap, TrendingUp, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '../hero/ProgressRing'
import { cn } from '@/lib/utils'

export interface ExecutiveSummaryProps {
  careerReadiness?: number
  overallCompletion?: number
  skillsCompleted?: string
  activeMilestones?: number
  recommendedFocus?: string
  aiReadinessScore?: number
  className?: string
}

export function ExecutiveSummary({
  careerReadiness = 78,
  overallCompletion = 78,
  skillsCompleted = '18 / 24',
  activeMilestones = 5,
  recommendedFocus = 'Model Evaluation & Scikit-learn Pipelines',
  aiReadinessScore = 87,
  className,
}: ExecutiveSummaryProps) {
  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Sparkles className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Executive Summary &amp; Core KPIs</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            High-level overview of active roadmap progress and candidate market readiness
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          Report Summary
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* KPI 1: Career Readiness */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Career Readiness
            </span>
            <div className="text-xl font-extrabold text-emerald-400">
              {careerReadiness}%
            </div>
            <span className="text-[9px] text-slate-500 font-medium block">
              Target: AI/ML Engineer
            </span>
          </div>
          <ProgressRing value={careerReadiness} size={38} strokeWidth={3.5} strokeColorClass="text-emerald-400" />
        </div>

        {/* KPI 2: Overall Completion */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Overall Completion
            </span>
            <div className="text-xl font-extrabold text-purple-300">
              {overallCompletion}%
            </div>
            <span className="text-[9px] text-slate-500 font-medium block">
              Phase 1 &amp; Phase 2 active
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Award className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 3: Skills Completed */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Skills Mastered
            </span>
            <div className="text-xl font-extrabold text-cyan-300">
              {skillsCompleted}
            </div>
            <span className="text-[9px] text-slate-500 font-medium block">
              75% mastery rate
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 4: Active Milestones */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Goals
            </span>
            <div className="text-xl font-extrabold text-blue-300">
              {activeMilestones} Milestones
            </div>
            <span className="text-[9px] text-slate-500 font-medium block">
              2 completed, 3 in progress
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
            <Target className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 5: Recommended Focus */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 flex items-center justify-between col-span-1 sm:col-span-2 lg:col-span-1">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Recommended Focus
            </span>
            <div className="text-xs font-bold text-amber-300 truncate">
              {recommendedFocus}
            </div>
            <span className="text-[9px] text-slate-500 font-medium block">
              High ROI priority
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 ml-2">
            <Zap className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 6: AI Readiness Score */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              AI Assessment Score
            </span>
            <div className="text-xl font-extrabold text-purple-300 font-mono">
              {aiReadinessScore} / 100
            </div>
            <span className="text-[9px] text-emerald-400 font-medium block">
              Top 15% Percentile
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </Card>
  )
}
export default ExecutiveSummary
