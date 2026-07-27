import React from 'react'
import { Target } from 'lucide-react'
import { githubAIInsightsMockData, type GoalItemData } from '@/data/githubAIInsightsMockData'
import { GoalProgressCard } from './GoalProgressCard'
import { cn } from '@/lib/utils'

export interface GitHubGoalsProgressProps {
  goals?: GoalItemData[]
  className?: string
}

export const GitHubGoalsProgress: React.FC<GitHubGoalsProgressProps> = ({
  goals = githubAIInsightsMockData.goals,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-4 font-sans text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">GitHub Engineering Goals</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Target milestones & progress tracking</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          Monthly
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {goals.map((goal) => (
          <GoalProgressCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  )
}
