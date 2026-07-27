import React from 'react'
import { Lightbulb } from 'lucide-react'
import { githubAIInsightsMockData, type SmartRecommendation } from '@/data/githubAIInsightsMockData'
import { RecommendationCard } from './RecommendationCard'
import { cn } from '@/lib/utils'

export interface SmartRecommendationsProps {
  recommendations?: SmartRecommendation[]
  onAction?: (recommendation: SmartRecommendation) => void
  className?: string
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations = githubAIInsightsMockData.recommendations,
  onAction,
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
            <Lightbulb size={16} className="text-amber-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Smart Engineering Recommendations</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Automated workflow & code optimizations</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {recommendations.length} Actionable
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id} recommendation={rec} onAction={onAction} />
        ))}
      </div>
    </div>
  )
}
