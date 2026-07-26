import React from 'react'
import { Target, CheckCircle2, Clock, Zap, Flame } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { milestonesOverviewMockData, goalTrackerMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { MilestonesOverviewData, GoalTrackerData } from '@/types/careerRoadmap'

export interface MilestoneReportProps {
  overview?: MilestonesOverviewData
  goalTracker?: GoalTrackerData
  className?: string
}

export function MilestoneReport({
  overview = milestonesOverviewMockData,
  goalTracker = goalTrackerMockData,
  className,
}: MilestoneReportProps) {
  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Target className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Milestones &amp; Goal Delivery Report</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Summary of milestone execution rate, goal health status, and habits
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          Goals Audit
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Milestones Mastered
          </span>
          <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
            <span>{overview.completedMilestones} Goals</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            75% completion velocity
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Upcoming Deadlines
          </span>
          <div className="text-xl font-extrabold text-cyan-300 flex items-center gap-1.5">
            <span>{overview.upcomingMilestones} Goals</span>
            <Clock className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Next target in 5 days
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Goal Health
          </span>
          <div className="text-sm font-extrabold text-purple-300 truncate">
            {goalTracker.goalHealth}
          </div>
          <span className="text-[10px] text-slate-500 font-medium block">
            Target: {goalTracker.targetCompletionQuarter}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Habit Consistency
          </span>
          <div className="text-xl font-extrabold text-amber-300 flex items-center gap-1.5">
            <span>{overview.currentStreakDays} Days</span>
            <Flame className="h-4 w-4 text-amber-400" aria-hidden="true" />
          </div>
          <span className="text-[10px] text-amber-400 font-semibold block">
            94% Learning Consistency
          </span>
        </div>
      </div>
    </Card>
  )
}
export default MilestoneReport
