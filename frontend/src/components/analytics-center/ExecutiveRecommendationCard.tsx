import React from 'react'
import { Sparkles, ArrowRight, Clock, Target } from 'lucide-react'
import type { ExecutiveRecommendationItem } from '@/data/analyticsInsightsMockData'

interface ExecutiveRecommendationCardProps {
  recommendation: ExecutiveRecommendationItem
  onApplyClick?: (recommendation: ExecutiveRecommendationItem) => void
  className?: string
}

export function ExecutiveRecommendationCard({
  recommendation,
  onApplyClick,
  className = '',
}: ExecutiveRecommendationCardProps) {
  const priorityStyles =
    recommendation.priority === 'High'
      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
      : recommendation.priority === 'Medium'
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : 'bg-teal-500/20 text-teal-300 border-teal-500/30'

  return (
    <div
      tabIndex={0}
      className={`p-3.5 rounded-xl bg-[#0f101c] border border-white/10 hover:border-purple-500/30 transition-all text-left space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 font-mono flex items-center gap-1">
          <Sparkles size={11} className="animate-pulse" />
          Recommendation
        </span>
        <span
          className={`px-2 py-0.5 rounded-full border text-[9px] font-bold font-mono ${priorityStyles}`}
        >
          {recommendation.priority} Priority
        </span>
      </div>

      <h4 className="text-xs font-bold text-slate-100 m-0 leading-snug">
        {recommendation.title}
      </h4>

      <p className="text-[11px] text-slate-400 font-medium leading-relaxed m-0">
        {recommendation.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-emerald-400 font-mono">
            <Target size={11} className="shrink-0" />
            {recommendation.estimatedImpact}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock size={11} className="shrink-0" />
            {recommendation.timeToImplement}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onApplyClick?.(recommendation)}
          className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>Apply</span>
          <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

export default ExecutiveRecommendationCard
