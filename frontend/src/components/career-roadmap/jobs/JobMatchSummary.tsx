import React, { memo } from 'react'
import { Briefcase, Target, DollarSign, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { jobMatchSummaryMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { JobMatchSummaryData } from '@/types/careerRoadmap'

export interface JobMatchSummaryProps {
  summary?: JobMatchSummaryData
  className?: string
}

export const JobMatchSummary = memo(function JobMatchSummary({
  summary = jobMatchSummaryMockData,
  className,
}: JobMatchSummaryProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left', className)}>
      {/* KPI 1: Total Job Matches */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Job Matches
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {summary.totalMatches} Roles
          </div>
          <span className="text-[10px] font-semibold text-purple-400 block">
            Active in your region
          </span>
        </div>
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
          <Briefcase className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* KPI 2: High Match Fit (80%+) */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            High Match Fit (80%+)
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
            {summary.highMatchCount} Opportunities
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 block">
            Ready for instant application
          </span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <Target className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* KPI 3: Avg Target Salary */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Avg Target Salary Range
          </span>
          <div className="text-xl sm:text-2xl font-extrabold text-cyan-300 tracking-tight">
            {summary.avgSalaryRange}
          </div>
          <span className="text-[10px] font-medium text-slate-400 block">
            Based on Entry–Mid AI role
          </span>
        </div>
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <DollarSign className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* KPI 4: Top Skill Demand */}
      <Card className="p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm hover:border-purple-500/30 transition-all">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Top Skill Demand
          </span>
          <div className="text-sm font-extrabold text-amber-300 tracking-tight leading-snug">
            {summary.topSkillDemand}
          </div>
          <span className="text-[10px] font-semibold text-amber-400 block">
            Highest hiring frequency
          </span>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>
    </div>
  )
})
export default JobMatchSummary
