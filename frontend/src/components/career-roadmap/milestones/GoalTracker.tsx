import React from 'react'
import { Target, CheckCircle2, Calendar, Award } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '../hero/ProgressRing'
import { SkillProgressBar } from '../skills-gap/SkillProgressBar'
import { goalTrackerMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { GoalTrackerData } from '@/types/careerRoadmap'

export interface GoalTrackerProps {
  goalData?: GoalTrackerData
  className?: string
}

export function GoalTracker({
  goalData = goalTrackerMockData,
  className,
}: GoalTrackerProps) {
  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-5 shadow-sm text-left', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Target className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Career Objective
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight m-0 flex items-center gap-2">
              <span>{goalData.currentGoal}</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {goalData.goalHealth}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold self-start sm:self-auto">
          <Calendar className="h-4 w-4 text-purple-400" aria-hidden="true" />
          <span>Target Completion: <strong className="text-white">{goalData.targetCompletionQuarter}</strong></span>
        </div>
      </div>

      {/* Progress Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly Goal Progress */}
        <div className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span>Weekly Task Sprint</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {goalData.weeklyTasksDone} / {goalData.weeklyTasksTotal} Tasks ({goalData.weeklyProgressPercentage}%)
            </span>
          </div>
          <SkillProgressBar value={goalData.weeklyProgressPercentage} status="completed" height="h-2.5" />
          <span className="text-[10px] text-slate-400 font-medium block">
            1 task remaining to hit this week&apos;s commitment target
          </span>
        </div>

        {/* Monthly Roadmap Progress */}
        <div className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Award className="h-4 w-4 text-blue-400" aria-hidden="true" />
              <span>Monthly Learning Velocity</span>
            </div>
            <span className="text-xs font-bold text-blue-400 font-mono">
              {goalData.monthlyTopicsDone} / {goalData.monthlyTopicsTotal} Topics ({goalData.monthlyProgressPercentage}%)
            </span>
          </div>
          <SkillProgressBar value={goalData.monthlyProgressPercentage} status="in-progress" height="h-2.5" />
          <span className="text-[10px] text-slate-400 font-medium block">
            7 topics remaining to complete Phase 2 modules
          </span>
        </div>
      </div>
    </Card>
  )
}
export default GoalTracker
