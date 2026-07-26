import React, { useState } from 'react'
import { Sparkles, ArrowRight, Check, AlertCircle, TrendingUp } from 'lucide-react'
import { mockAiRecommendations, type AIRecommendationItem } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

export const AIRecommendationCard: React.FC = () => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set())

  const handleApply = (id: string) => {
    setAppliedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const totalScoreGain = Array.from(appliedIds).reduce((acc, id) => {
    const item = mockAiRecommendations.find((r) => r.id === id)
    return acc + (item ? item.impactValue : 0)
  }, 0)

  return (
    <div className="rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              AI Optimization Recommendations
            </h3>
            <p className="text-xs text-purple-200/80">
              Prioritized recommendations to maximize your ATS compatibility score.
            </p>
          </div>
        </div>

        {totalScoreGain > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-in fade-in">
            <TrendingUp className="w-3.5 h-3.5" />
            Total Potential Gain: +{totalScoreGain} ATS Score
          </span>
        )}
      </div>

      {/* Recommendations Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {mockAiRecommendations.map((rec) => {
          const isApplied = appliedIds.has(rec.id)
          const isHigh = rec.priority === 'High'
          const isMedium = rec.priority === 'Medium'

          return (
            <div
              key={rec.id}
              className={cn(
                'p-4 rounded-xl bg-slate-950/70 border transition-all duration-200 flex flex-col justify-between space-y-3',
                isApplied
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-800/80 hover:border-purple-500/40'
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border',
                      isHigh
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : isMedium
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    )}
                  >
                    {rec.priority} Priority
                  </span>

                  <span className="text-xs font-bold font-mono text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                    {rec.estimatedImpact}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{rec.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5">
                <span className="text-[11px] text-slate-400 font-mono">{rec.category}</span>
                <button
                  type="button"
                  onClick={() => handleApply(rec.id)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                    isApplied
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30'
                  )}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied
                    </>
                  ) : (
                    <>
                      <span>Apply Recommendation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
