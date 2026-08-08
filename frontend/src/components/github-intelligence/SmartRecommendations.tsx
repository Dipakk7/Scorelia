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
        'p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-xl shadow-purple-950/10 space-y-4 font-sans text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-400" />
            <h3 className="font-bold text-sm text-white m-0">Smart Engineering Recommendations</h3>
          </div>
          <p className="text-[11px] text-slate-400 m-0 mt-0.5">Automated workflow & code optimizations</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold font-mono rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
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

export default SmartRecommendations
