import React from 'react'
import { Award, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '../hero/ProgressRing'
import { skillsOverviewMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { SkillsOverviewData } from '@/types/careerRoadmap'

export interface SkillsGapOverviewProps {
  overview?: SkillsOverviewData
  className?: string
}

export function SkillsGapOverview({
  overview = skillsOverviewMockData,
  className,
}: SkillsGapOverviewProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left', className)}>
      {/* 1. Overall Skill Readiness */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Overall Readiness
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {overview.overallReadiness}%
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 block">
            +5% from last month
          </span>
        </div>
        <ProgressRing
          value={overview.overallReadiness}
          size={44}
          strokeWidth={4}
          strokeColorClass="text-emerald-400"
          trackColorClass="text-white/10"
        />
      </Card>

      {/* 2. Gap Score */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Gap Score
          </span>
          <div className="text-2xl font-extrabold text-rose-400 tracking-tight">
            {overview.gapScore}%
          </div>
          <span className="text-[10px] font-medium text-slate-400 block">
            Remaining skill deficit
          </span>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* 3. Skills Completed */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Skills Completed
          </span>
          <div className="text-2xl font-extrabold text-purple-300 tracking-tight">
            {overview.completedSkillsCount} / {overview.totalSkillsCount}
          </div>
          <span className="text-[10px] font-medium text-slate-400 block">
            75% mastery rate
          </span>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* 4. Market Alignment */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Market Alignment
          </span>
          <div className="text-2xl font-extrabold text-cyan-300 tracking-tight">
            {overview.marketAlignment}
          </div>
          <span className="text-[10px] font-semibold text-cyan-400 block">
            High Demand Fit
          </span>
        </div>
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>
    </div>
  )
}
export default SkillsGapOverview
