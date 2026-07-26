import React from 'react'
import { motion } from 'framer-motion'
import { Target, Calendar, Flame, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import type { GoalTrackerData } from '@/types/interviewPrep'

export interface GoalTrackerCardProps {
  goal: GoalTrackerData
}

export function GoalTrackerCard({ goal }: GoalTrackerCardProps) {
  return (
    <Card className="bg-[#10121e]/90 border border-white/10 rounded-2xl p-5 hover:border-purple-500/30 transition-all space-y-4 text-left">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white tracking-tight">
              Target Goal & Milestone Tracker
            </CardTitle>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Monitor trajectory toward your target job readiness score
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
          <Flame className="h-4 w-4 fill-amber-400" />
          <span>{goal.dailyStreakDays} Day Streak</span>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3.5 text-xs">
        {/* Goal Title */}
        <div className="p-3.5 rounded-xl bg-[#141627] border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white leading-tight">{goal.currentGoalTitle}</h4>
            <span className="font-mono text-purple-300 font-bold">{goal.progressPercent}% / {goal.targetScorePercent}%</span>
          </div>

          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(goal.progressPercent / goal.targetScorePercent) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Estimated Completion & Next Objective */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#141627]/60 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3 text-purple-400" /> Target Date
            </span>
            <span className="text-xs font-bold text-white block">{goal.estimatedCompletionDate}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#141627]/60 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Immediate Objective
            </span>
            <span className="text-xs font-bold text-emerald-400 block truncate">{goal.nextObjectiveTitle}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
export default GoalTrackerCard
