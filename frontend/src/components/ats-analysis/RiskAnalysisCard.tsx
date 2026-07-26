import React from 'react'
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, ArrowRight } from 'lucide-react'
import { mockRiskAnalysis, type RiskAnalysisItem } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

export const RiskAnalysisCard: React.FC = () => {
  const criticalCount = mockRiskAnalysis.filter((r) => r.severity === 'Critical').length
  const warningCount = mockRiskAnalysis.filter((r) => r.severity === 'Warning').length
  const minorCount = mockRiskAnalysis.filter((r) => r.severity === 'Minor').length
  const safeCount = mockRiskAnalysis.filter((r) => r.severity === 'Safe').length

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            Resume Risk & Vulnerability Analysis
          </h3>
          <p className="text-xs text-slate-400">
            Categorized risk audit identifying potential ATS rejection bottlenecks.
          </p>
        </div>

        {/* Risk Summary Badges */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
            {criticalCount} Critical
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
            {warningCount} Warnings
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
            {minorCount} Minor
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            {safeCount} Safe
          </span>
        </div>
      </div>

      {/* Risk Items Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {mockRiskAnalysis.map((item) => {
          const isCritical = item.severity === 'Critical'
          const isWarning = item.severity === 'Warning'
          const isSafe = item.severity === 'Safe'

          return (
            <div
              key={item.id}
              className={cn(
                'p-4 rounded-xl bg-slate-950/60 border transition-all duration-200 space-y-2.5 flex flex-col justify-between',
                isCritical
                  ? 'border-rose-500/40 bg-rose-950/10'
                  : isWarning
                  ? 'border-amber-500/40 bg-amber-950/10'
                  : isSafe
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800/80 hover:border-purple-500/30'
              )}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border',
                      isCritical
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : isSafe
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    )}
                  >
                    {item.severity}
                  </span>

                  <span className="text-xs font-bold font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    {item.estimatedImpact}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono space-y-0.5">
                <span className="text-[10px] text-purple-400 font-sans font-semibold">Suggested Fix:</span>
                <div>{item.suggestedFix}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
