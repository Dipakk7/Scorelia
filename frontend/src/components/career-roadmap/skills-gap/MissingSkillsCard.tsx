import React from 'react'
import { AlertCircle, Clock, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { missingSkillsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { MissingSkillItem } from '@/types/careerRoadmap'

export interface MissingSkillsCardProps {
  skills?: MissingSkillItem[]
  className?: string
}

export function MissingSkillsCard({
  skills = missingSkillsMockData,
  className,
}: MissingSkillsCardProps) {
  const getPriorityBadgeStyle = (priority: MissingSkillItem['priority']) => {
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
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>Top Missing Skills</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Critical skill gaps identified to reach your target AI/ML Engineer role
          </p>
        </div>
        <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
          6 Core Gaps
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-3.5 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2 flex flex-col justify-between text-left hover:border-rose-500/30 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className={cn('text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border', getPriorityBadgeStyle(skill.priority))}>
                  {skill.priority} Priority
                </span>
                <span className="text-[10px] font-mono text-slate-400">{skill.category}</span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight leading-snug m-0 pt-1">
                {skill.name}
              </h4>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                <span>{skill.estimatedHours}</span>
              </span>
              <span className="flex items-center gap-1 text-purple-300 font-semibold">
                <Calendar className="h-3 w-3 text-purple-400" aria-hidden="true" />
                <span>{skill.recommendedTimeline}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default MissingSkillsCard
