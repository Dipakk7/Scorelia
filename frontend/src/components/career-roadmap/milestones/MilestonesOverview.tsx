import React from 'react'
import { FolderCheck, Clock, Flame, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '../hero/ProgressRing'
import { milestonesOverviewMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { MilestonesOverviewData } from '@/types/careerRoadmap'

export interface MilestonesOverviewProps {
  overview?: MilestonesOverviewData
  className?: string
}

export function MilestonesOverview({
  overview = milestonesOverviewMockData,
  className,
}: MilestonesOverviewProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left select-none', className)}>
      {/* 1. Completed Milestones */}
      <Card className="p-4 bg-[#121320] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Completed Milestones
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {overview.completedMilestones}
          </div>
          <span className="text-[10px] font-semibold text-emerald-400 block">
            75% of total milestones
          </span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <FolderCheck className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* 2. Upcoming Milestones */}
      <Card className="p-4 bg-[#121320] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Upcoming Goals
          </span>
          <div className="text-2xl font-extrabold text-cyan-300 tracking-tight">
            {overview.upcomingMilestones}
          </div>
          <span className="text-[10px] font-medium text-slate-400 block">
            Next due in 5 days
          </span>
        </div>
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Clock className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* 3. Current Streak */}
      <Card className="p-4 bg-[#121320] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Current Streak
          </span>
          <div className="text-2xl font-extrabold text-amber-300 tracking-tight flex items-center gap-1">
            <span>{overview.currentStreakDays}</span>
            <span className="text-xs text-amber-400 font-bold">Days</span>
          </div>
          <span className="text-[10px] font-semibold text-amber-400 block">
            Personal Best: 24 Days
          </span>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <Flame className="h-5 w-5" aria-hidden="true" />
        </div>
      </Card>

      {/* 4. Overall Completion */}
      <Card className="p-4 bg-[#121320] border border-white/10 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Overall Completion
          </span>
          <div className="text-2xl font-extrabold text-purple-300 tracking-tight">
            {overview.overallCompletionPercentage}%
          </div>
          <span className="text-[10px] font-semibold text-purple-400 block">
            On Track for Q4 2026
          </span>
        </div>
        <ProgressRing
          value={overview.overallCompletionPercentage}
          size={44}
          strokeWidth={4}
          strokeColorClass="text-purple-400"
          trackColorClass="text-white/10"
        />
      </Card>
    </div>
  )
}
export default MilestonesOverview
