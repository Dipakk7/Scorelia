import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { analyticsInsightsMockData } from '@/data/analyticsInsightsMockData'
import type { AIInsightItem, ExecutiveRecommendationItem } from '@/data/analyticsInsightsMockData'
import { InsightCard } from './InsightCard'
import { ExecutiveRecommendationCard } from './ExecutiveRecommendationCard'

interface AIInsightsPanelProps {
  insights?: AIInsightItem[]
  recommendations?: ExecutiveRecommendationItem[]
  onInsightAction?: (insight: AIInsightItem) => void
  onApplyRecommendation?: (rec: ExecutiveRecommendationItem) => void
  onViewAllClick?: () => void
  className?: string
}

export function AIInsightsPanel({
  insights = analyticsInsightsMockData.insights,
  recommendations = analyticsInsightsMockData.recommendations,
  onInsightAction,
  onApplyRecommendation,
  onViewAllClick,
  className = '',
}: AIInsightsPanelProps) {
  return (
    <div className={`space-y-5 text-left ${className}`}>
      {/* AI Insights Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5 font-display m-0">
            <Sparkles size={14} className="text-purple-400 animate-pulse" />
            AI Insights
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold font-mono border border-purple-500/30">
            {insights.length} Active
          </span>
        </div>

        <button
          type="button"
          onClick={onViewAllClick}
          className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
        >
          <span>View all</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Insight Cards Feed */}
      <div className="space-y-2.5">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} onActionClick={onInsightAction} />
        ))}
      </div>

      {/* Executive Recommendations Sub-section */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-white/5">
          {recommendations.slice(0, 2).map((rec) => (
            <ExecutiveRecommendationCard
              key={rec.id}
              recommendation={rec}
              onApplyClick={onApplyRecommendation}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AIInsightsPanel
