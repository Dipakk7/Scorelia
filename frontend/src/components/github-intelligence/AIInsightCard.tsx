import React from 'react'
import { Sparkles, Clock, ArrowRight, X } from 'lucide-react'
import type { AIInsight } from '@/data/githubAIInsightsMockData'
import { AIConfidenceBadge } from './AIConfidenceBadge'
import { InsightPriorityBadge } from './InsightPriorityBadge'
import { cn } from '@/lib/utils'

export interface AIInsightCardProps {
  insight: AIInsight
  onViewDetails?: (insight: AIInsight) => void
  onDismiss?: (insight: AIInsight) => void
  className?: string
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  insight,
  onViewDetails,
  onDismiss,
  className,
}) => {
  return (
    <div
      tabIndex={0}
      className={cn(
        'group p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md shadow-sm space-y-3 font-sans text-left text-xs',
        'hover:border-purple-500/40 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <Sparkles size={15} />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm text-[var(--heading)] truncate group-hover:text-purple-400 transition-colors">
              {insight.title}
            </div>
            <div className="text-[10px] text-[var(--muted)] font-medium flex items-center gap-1.5 mt-0.5">
              <span>{insight.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={10} /> {insight.generatedAt}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <InsightPriorityBadge priority={insight.priority} />
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(insight)}
              aria-label={`Dismiss insight ${insight.title}`}
              className="p-1 text-[var(--muted)] hover:text-rose-400 rounded-md transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[var(--muted)] leading-relaxed m-0 line-clamp-2">
        {insight.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-purple-500/10 text-[10px]">
        <AIConfidenceBadge confidence={insight.confidence} level={insight.confidenceLevel} />

        <button
          type="button"
          onClick={() => onViewDetails?.(insight)}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <span>Action</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
