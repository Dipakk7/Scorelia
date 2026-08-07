import React from 'react'
import { Award, TrendingUp, Zap, Target, Clock, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { careerInsightsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { CareerInsightData } from '@/types/careerRoadmap'

export interface CareerInsightsCardProps {
  insights?: CareerInsightData
  className?: string
}

export function CareerInsightsCard({
  insights = careerInsightsMockData,
  className,
}: CareerInsightsCardProps) {
  const metrics = [
    {
      label: 'Career Readiness',
      value: `${insights.readinessScore}%`,
      icon: <Award className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
      sub: 'On Track',
      color: 'text-emerald-400',
    },
    {
      label: 'Strongest Skill',
      value: insights.strongestSkill,
      icon: <TrendingUp className="h-4 w-4 text-purple-400" aria-hidden="true" />,
      sub: 'Mastered',
      color: 'text-purple-400',
    },
    {
      label: 'Weakest Skill',
      value: insights.weakestSkill,
      icon: <AlertTriangle className="h-4 w-4 text-rose-400" aria-hidden="true" />,
      sub: 'Needs Focus',
      color: 'text-rose-400',
    },
    {
      label: 'Estimated Timeline',
      value: insights.estimatedTimeline,
      icon: <Clock className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
      sub: 'Standard',
      color: 'text-cyan-400',
    },
    {
      label: 'Current Focus Area',
      value: insights.focusArea,
      icon: <Target className="h-4 w-4 text-blue-400" aria-hidden="true" />,
      sub: 'Phase 2',
      color: 'text-blue-400',
    },
    {
      label: 'Learning Velocity',
      value: insights.learningVelocity,
      icon: <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />,
      sub: 'Optimal',
      color: 'text-amber-400',
    },
  ]

  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight m-0">
          Career Insights
        </h3>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          AI Analyzed
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {item.label}
              </span>
              {item.icon}
            </div>
            <div className={`text-xs font-bold truncate ${item.color}`}>
              {item.value}
            </div>
            <span className="text-[9px] font-medium text-slate-500 block">
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default CareerInsightsCard
