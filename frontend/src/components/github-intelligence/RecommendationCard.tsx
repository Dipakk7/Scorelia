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
        'group p-4 sm:p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md shadow-sm space-y-3 font-sans text-left text-xs',
        'hover:border-amber-500/40 hover:bg-amber-950/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-950/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <Lightbulb size={16} />
          </div>
          <div className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug">
            {recommendation.title}
          </div>
        </div>
        <div className="shrink-0">
          <InsightPriorityBadge priority={recommendation.priority} />
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed m-0 font-sans">
        {recommendation.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-amber-500/10 text-[10px]">
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <span className="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            {recommendation.expectedBenefit}
          </span>
          <span className={cn('px-2 py-0.5 font-semibold rounded-md border', difficultyColor)}>
            {recommendation.difficulty}
          </span>
          <span className="text-slate-400 flex items-center gap-1 font-medium font-sans">
            <Clock size={10} /> {recommendation.estimatedTime}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAction?.(recommendation)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/20 transition-all cursor-pointer shrink-0 ml-auto"
        >
          <span>Apply Action</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default RecommendationCard
