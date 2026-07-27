import React from 'react'
import { Lightbulb, Clock, CheckCircle2, ChevronRight } from 'lucide-react'
import type { SmartRecommendation } from '@/data/githubAIInsightsMockData'
import { InsightPriorityBadge } from './InsightPriorityBadge'
import { cn } from '@/lib/utils'

export interface RecommendationCardProps {
  recommendation: SmartRecommendation
  onAction?: (recommendation: SmartRecommendation) => void
  className?: string
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onAction,
  className,
}) => {
  const difficultyColor = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    Hard: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }[recommendation.difficulty]

  return (
    <div
      tabIndex={0}
      className={cn(
        'group p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-3 font-sans text-left text-xs',
        'hover:border-purple-500/40 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Lightbulb size={15} />
          </div>
          <div className="font-bold text-sm text-[var(--heading)] group-hover:text-purple-400 transition-colors truncate">
            {recommendation.title}
          </div>
        </div>
        <InsightPriorityBadge priority={recommendation.priority} />
      </div>

      <p className="text-[11px] text-[var(--muted)] leading-relaxed m-0 line-clamp-2">
        {recommendation.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)]/50 text-[10px]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            {recommendation.expectedBenefit}
          </span>
          <span className={cn('px-2 py-0.5 font-semibold rounded-md border', difficultyColor)}>
            {recommendation.difficulty}
          </span>
          <span className="text-[var(--muted)] flex items-center gap-1 font-medium">
            <Clock size={10} /> {recommendation.estimatedTime}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAction?.(recommendation)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-sm transition-all cursor-pointer"
        >
          <span>Apply</span>
          <ChevronRight size={11} />
        </button>
      </div>
    </div>
  )
}
