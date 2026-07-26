import React, { useState, useEffect } from 'react'
import { useInsights } from '@/hooks/useInsights'
import {
  mockInsightsList,
  type InsightItem,
} from '@/data/insightsSystemHealthMockData'
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AIInsightsPanelProps {
  className?: string
}

export function AIInsightsPanel({ className }: AIInsightsPanelProps) {
  const { insights: queryInsights, applyFix } = useInsights()
  const [insightsList, setInsightsList] = useState<InsightItem[]>(mockInsightsList)
  const [resolvedIds, setResolvedIds] = useState<string[]>([])

  useEffect(() => {
    if (queryInsights && queryInsights.length > 0) {
      setInsightsList(queryInsights)
    }
  }, [queryInsights])

  const handleResolve = async (id: string) => {
    setResolvedIds((prev) => [...prev, id])
    await applyFix(id)
  }

  return (
    <div className={cn('space-y-4 text-left', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(insightsList || []).map((item) => {
          const isResolved = resolvedIds.includes(item.id)

          return (
            <div
              key={item.id}
              className={cn(
                'p-5 rounded-2xl bg-[#111322] border transition-all flex flex-col justify-between space-y-4 shadow-xl hover:-translate-y-0.5',
                isResolved
                  ? 'opacity-50 border-white/5 bg-[#0b0c14]'
                  : item.priority === 'critical'
                  ? 'border-rose-500/50 hover:border-rose-500 shadow-rose-950/20'
                  : item.priority === 'high'
                  ? 'border-amber-500/40 hover:border-amber-500'
                  : 'border-white/10 hover:border-purple-500/40'
              )}
            >
              <div className="space-y-3">
                {/* Header & Priority Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <h3 className="font-bold text-white text-xs tracking-tight line-clamp-1">{item.title}</h3>
                  </div>

                  {/* Priority Badge */}
                  <div>
                    {item.priority === 'critical' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Critical
                      </span>
                    )}
                    {item.priority === 'high' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                        High
                      </span>
                    )}
                    {item.priority === 'medium' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Medium
                      </span>
                    )}
                    {item.priority === 'low' && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] font-bold uppercase tracking-wider">
                        Low
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {item.description}
                </p>

                {/* Target Agent & Impact Summary */}
                <div className="p-2.5 rounded-xl bg-[#0b0c14] border border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Target: <strong className="text-white">{item.affectedAgents?.join(', ') || 'Global'}</strong></span>
                  <span className="text-purple-300 font-mono text-[11px] font-semibold">{item.estimatedImpact}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Confidence: <strong className="text-emerald-400">{item.confidenceScore}%</strong></span>
                <button
                  type="button"
                  disabled={isResolved}
                  onClick={() => handleResolve(item.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                    isResolved
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md active:scale-95'
                  )}
                >
                  {isResolved ? <CheckCircle2 size={13} /> : <ArrowRight size={13} />}
                  <span>{isResolved ? 'Fix Applied' : item.suggestedAction}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AIInsightsPanel
