import React from 'react'
import { Calendar, Clock, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SkillProgressBar } from '../skills-gap/SkillProgressBar'
import { upcomingMilestonesMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { UpcomingMilestoneItem } from '@/types/careerRoadmap'

export interface UpcomingMilestonesProps {
  upcoming?: UpcomingMilestoneItem[]
  className?: string
}

export function UpcomingMilestones({
  upcoming = upcomingMilestonesMockData,
  className,
}: UpcomingMilestonesProps) {
  const getPriorityBadgeStyle = (priority: UpcomingMilestoneItem['priority']) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      case 'High':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'Medium':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
  }

  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Clock className="h-4 w-4 text-cyan-400 shrink-0" aria-hidden="true" />
            <span>Upcoming Target Deadlines</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Next target milestone delivery dates and remaining preparation days
          </p>
        </div>
        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          4 Deadlines
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {upcoming.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2.5 flex flex-col justify-between text-left hover:border-cyan-500/30 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getPriorityBadgeStyle(item.priority))}>
                  {item.priority}
                </span>
                <span className="text-[11px] font-bold text-cyan-400 font-mono flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  <span>{item.daysRemaining} days left</span>
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug m-0 pt-0.5">
                {item.title}
              </h4>
            </div>

            <div className="space-y-1 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-500" aria-hidden="true" />
                  <span>Due: {item.dueDate}</span>
                </span>
                <span className="font-mono text-white font-bold">{item.progress}%</span>
              </div>
              <SkillProgressBar value={item.progress} status="in-progress" height="h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default UpcomingMilestones
