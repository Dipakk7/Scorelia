import React from 'react'
import { Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SkillProgressBar } from '../skills-gap/SkillProgressBar'
import { roadmapPhasesMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { RoadmapPhase } from '@/types/careerRoadmap'

export interface TimelineReportProps {
  phases?: RoadmapPhase[]
  className?: string
}

export function TimelineReport({
  phases = roadmapPhasesMockData,
  className,
}: TimelineReportProps) {
  return (
    <Card className={cn('p-5 sm:p-6 bg-[#121320] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Calendar className="h-4 w-4 text-cyan-400 shrink-0" aria-hidden="true" />
            <span>12-Month Timeline Progress Report</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Phase-by-phase completion status and target schedule verification
          </p>
        </div>
        <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          4 Phases
        </span>
      </div>

      <div className="space-y-3">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-2 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                  Phase {phase.phaseNumber}
                </span>
                <h4 className="text-sm font-bold text-white tracking-tight m-0">
                  {phase.title}
                </h4>
                {phase.status === 'completed' && (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono">{phase.months}</span>
                <span className="font-bold text-white font-mono">{phase.progress}%</span>
              </div>
            </div>

            <SkillProgressBar value={phase.progress} status={phase.status === 'completed' ? 'completed' : 'in-progress'} height="h-2" />

            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 pt-1">
              <span>Difficulty: <strong className="text-slate-300">{phase.difficulty}</strong></span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                <span>Est: {phase.estimatedHours}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default TimelineReport
