import React, { memo } from 'react'
import { Target, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { skillMatchInsightMockData } from '@/data/careerRoadmapMockData'
import { cn } from '@/lib/utils'
import type { SkillMatchInsightData } from '@/types/careerRoadmap'

export interface SkillMatchInsightsProps {
  insights?: SkillMatchInsightData[]
  className?: string
}

export const SkillMatchInsights = memo(function SkillMatchInsights({
  insights = skillMatchInsightMockData,
  className,
}: SkillMatchInsightsProps) {
  return (
    <Card className={cn('p-4.5 sm:p-5 bg-[#121426] border border-white/10 rounded-2xl space-y-4 shadow-sm text-left hover:border-purple-500/30 transition-all', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2 m-0">
            <Target className="h-4 w-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>AI Job Skill Match Insights</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium m-0">
            Side-by-side analysis of matching competencies vs employer demand
          </p>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          Match Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#0b0c14] border border-white/10 space-y-3 flex flex-col justify-between text-left"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-white/5 pb-2">
                {item.category}
              </span>

              {/* Matching Skills */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                  Matching Skills ({item.matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.matchingSkills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-medium text-emerald-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" aria-hidden="true" />
                  Missing Skills ({item.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.missingSkills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono font-medium text-rose-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Focus */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-purple-400" aria-hidden="true" />
                  Recommended Action Focus
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.recommendedSkills.map((s, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] font-mono font-medium text-purple-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
})
export default SkillMatchInsights
