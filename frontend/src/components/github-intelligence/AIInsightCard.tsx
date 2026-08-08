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
        'group p-4 sm:p-5 rounded-2xl border border-purple-500/20 bg-purple-950/10 backdrop-blur-md shadow-sm space-y-3 font-sans text-left text-xs',
        'hover:border-purple-500/40 hover:bg-purple-950/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-950/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 select-none',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 mt-0.5">
            <Sparkles size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors leading-snug">
              {insight.title}
            </div>
            <div className="text-[10px] text-slate-400 font-medium flex flex-wrap items-center gap-2 mt-1">
              <span className="font-mono uppercase text-purple-400 bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-[9px]">
                {insight.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-slate-400">
                <Clock size={10} /> {insight.generatedAt}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <InsightPriorityBadge priority={insight.priority} />
          {onDismiss && (
            <button
              type="button"
              onClick={() => onDismiss(insight)}
              aria-label={`Dismiss insight ${insight.title}`}
              className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed m-0 font-sans">
        {insight.description}
      </p>

      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-purple-500/10 text-[10px]">
        <AIConfidenceBadge confidence={insight.confidence} level={insight.confidenceLevel} />

        <button
          type="button"
          onClick={() => onViewDetails?.(insight)}
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer shrink-0"
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  )
}

export default AIInsightCard
