import React from 'react'
import type { GoalItemData } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface GoalProgressCardProps {
  goal: GoalItemData
  className?: string
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, className }) => {
  const statusColor = {
    Ahead: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'On Track': 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    'Needs Focus': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }[goal.status]

  return (
    <div
      className={cn(
        'p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-2 font-sans text-xs text-left select-none',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-[var(--heading)] truncate">{goal.goal}</span>
        <span className={cn('px-2 py-0.5 text-[9px] font-bold rounded-md border', statusColor)}>
          {goal.status}
        </span>
      </div>

      <div className="flex items-baseline justify-between text-[11px]">
        <span className="text-[var(--muted)]">
          <strong className="text-[var(--heading)]">{goal.current}</strong> / {goal.target} {goal.unit}
        </span>
        <span className="font-bold text-purple-400 font-mono">{goal.progress}%</span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(goal.progress, 100)}%` }}
        />
      </div>
    </div>
  )
}
