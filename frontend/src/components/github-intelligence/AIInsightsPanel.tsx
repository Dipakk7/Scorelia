import React from 'react'
import { Sparkles, ChevronRight } from 'lucide-react'
import { githubAIInsightsMockData, type AIInsight } from '@/data/githubAIInsightsMockData'
import { AIInsightCard } from './AIInsightCard'
import { cn } from '@/lib/utils'

export interface AIInsightsPanelProps {
  insights?: AIInsight[]
  onViewDetails?: (insight: AIInsight) => void
  onDismiss?: (insight: AIInsight) => void
  className?: string
}

export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights = githubAIInsightsMockData.insights,
  onViewDetails,
  onDismiss,
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
            <Sparkles size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">AI Engineering Insights</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Automated repository & developer intelligence</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {insights.length} Active
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            insight={insight}
            onViewDetails={onViewDetails}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  )
}
