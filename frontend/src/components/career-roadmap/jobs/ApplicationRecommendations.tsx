import React, { memo } from 'react'
import { FileText, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { applicationRecommendationsMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { ApplicationRecommendationItem } from '@/types/careerRoadmap'

export interface ApplicationRecommendationsProps {
  recommendations?: ApplicationRecommendationItem[]
  onAction?: (id: string) => void
  className?: string
}

export const ApplicationRecommendations = memo(function ApplicationRecommendations({
  recommendations = applicationRecommendationsMockData,
  onAction,
  className,
}: ApplicationRecommendationsProps) {
  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Zap className="h-4 w-4 text-purple-400 shrink-0" aria-hidden="true" />
            <span>AI Application Recommendations</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Actionable optimization steps to maximize candidate ATS callback rate
          </p>
        </div>
        <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
          Callback Boost
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-3 flex flex-col justify-between text-left"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold text-purple-400 uppercase tracking-wider">
                  Target Company: {rec.company}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {rec.readinessScore}% Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight m-0">
                {rec.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed m-0">
                {rec.tip}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction?.(rec.id)}
              className="w-full justify-center text-xs font-semibold py-2.5 min-h-[44px] rounded-xl border-white/15 bg-[#121426] hover:bg-white/10 text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-purple-500/50"
              aria-label={rec.actionText}
            >
              <span>{rec.actionText}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 text-slate-400" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
})
export default ApplicationRecommendations
