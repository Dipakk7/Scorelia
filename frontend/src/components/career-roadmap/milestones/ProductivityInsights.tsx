import React from 'react'
import { Zap, Clock, CheckSquare, TrendingUp, Flame, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { productivityInsightsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { ProductivityInsightData } from '@/types/careerRoadmap'

export interface ProductivityInsightsProps {
  insights?: ProductivityInsightData
  className?: string
}

export function ProductivityInsights({
  insights = productivityInsightsMockData,
  className,
}: ProductivityInsightsProps) {
  const metrics = [
    {
      label: 'Learning Consistency',
      value: `${insights.learningConsistencyPercentage}%`,
      icon: <Zap className="h-4 w-4 text-purple-400" aria-hidden="true" />,
      sub: 'Top 5% Learner',
      color: 'text-purple-300',
    },
    {
      label: 'Avg Daily Study',
      value: `${insights.avgStudyHoursPerDay} hrs`,
      icon: <Clock className="h-4 w-4 text-cyan-400" aria-hidden="true" />,
      sub: 'Target: 2.5 hrs/day',
      color: 'text-cyan-300',
    },
    {
      label: 'Tasks Completed',
      value: `${insights.tasksCompletedTotal} Tasks`,
      icon: <CheckSquare className="h-4 w-4 text-emerald-400" aria-hidden="true" />,
      sub: '100% On-time',
      color: 'text-emerald-400',
    },
    {
      label: 'Weekly Velocity Trend',
      value: insights.weeklyTrendPercentage,
      icon: <TrendingUp className="h-4 w-4 text-amber-400" aria-hidden="true" />,
      sub: 'Vs. last week',
      color: 'text-amber-400',
    },
    {
      label: 'Longest Streak',
      value: `${insights.longestStreakDays} Days`,
      icon: <Flame className="h-4 w-4 text-rose-400" aria-hidden="true" />,
      sub: 'Achieved Q2 2026',
      color: 'text-rose-400',
    },
    {
      label: 'Peak Focus Day',
      value: insights.mostProductiveDay,
      icon: <Calendar className="h-4 w-4 text-blue-400" aria-hidden="true" />,
      sub: '4.2 hrs average',
      color: 'text-blue-400',
    },
  ]

  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm hover:border-purple-500/30 transition-all text-left', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Zap className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>Productivity &amp; Velocity Insights</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Personal study metrics and habit consistency analytics
          </p>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
          AI Tracked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#0b0c14] border border-white/10 space-y-1 text-left flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                {item.label}
              </span>
              {item.icon}
            </div>
            <div className={`text-sm font-bold truncate ${item.color}`}>
              {item.value}
            </div>
            <span className="text-[9px] font-medium text-slate-500 block truncate">
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
export default ProductivityInsights
