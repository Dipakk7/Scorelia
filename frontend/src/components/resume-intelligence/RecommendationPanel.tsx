import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Zap,
  TrendingUp,
  Info,
  ShieldCheck,
} from 'lucide-react'
import type { Recommendation, PriorityLevel } from '@/types/resume-intelligence'

interface RecommendationPanelProps {
  recommendations: Recommendation[]
  priorityImprovements?: Recommendation[]
}

export function RecommendationPanel({
  recommendations = [],
  priorityImprovements = [],
}: RecommendationPanelProps) {
  // Combine all recommendations and filter out duplicates
  const allRecs = [...priorityImprovements, ...recommendations]
  const uniqueRecs = allRecs.filter(
    (rec, index, self) =>
      index === self.findIndex((r) => r.suggested_fix === rec.suggested_fix)
  )

  // Sort: High -> Medium -> Low
  const priorityWeight: Record<PriorityLevel, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  }

  const sortedRecs = [...uniqueRecs].sort((a, b) => {
    return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
  })

  // State to track open states for each item
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({
    0: true, // open the first recommendation by default
  })

  const toggleOpen = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const getPriorityStyles = (priority: PriorityLevel) => {
    switch (priority) {
      case 'HIGH':
        return {
          bg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-200 dark:border-rose-900/50',
          badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-550/20',
          icon: <AlertTriangle size={15} className="text-rose-500" />,
        }
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-200 dark:border-amber-900/50',
          badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-550/20',
          icon: <Zap size={15} className="text-amber-500 animate-pulse" />,
        }
      case 'LOW':
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800',
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300/30',
          icon: <Info size={15} className="text-slate-400" />,
        }
    }
  }

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
        <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Actionable Fix Recommendations</span>
        </h3>
        <span className="text-[10px] text-slate-550 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-full font-bold">
          {sortedRecs.length} total suggestions
        </span>
      </div>

      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
        {sortedRecs.length > 0 ? (
          sortedRecs.map((rec, idx) => {
            const isOpen = !!openStates[idx]
            const styles = getPriorityStyles(rec.priority)

            return (
              <div
                key={idx}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${styles.bg} ${
                  isOpen ? 'ring-1 ring-brand-500/10 shadow-xs' : ''
                }`}
              >
                {/* Recommendation Header */}
                <button
                  onClick={() => toggleOpen(idx)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    <span className="shrink-0">{styles.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${styles.badge}`}
                    >
                      {rec.priority}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-snug">
                      {rec.suggested_fix}
                    </h4>
                  </div>
                  <span className="text-slate-400 hover:text-slate-600 shrink-0">
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {/* Recommendation Details */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100 dark:border-slate-850/60 mt-0 bg-white/40 dark:bg-dark-bg/30 space-y-3.5">
                    {/* Reason */}
                    <div className="space-y-1 mt-3">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Issue Found
                      </span>
                      <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-normal">
                        {rec.reason}
                      </p>
                    </div>

                    {/* Impact / Estimations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 border-t border-dashed border-slate-150/40 dark:border-slate-850/40">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Impact Analysis
                        </span>
                        <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-normal mt-0.5">
                          {rec.impact}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
                          <TrendingUp size={10} className="text-brand-500" />
                          <span>Estimated Benefit</span>
                        </span>
                        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed font-semibold mt-0.5">
                          {rec.estimated_benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-6 text-slate-400 dark:text-slate-600 text-xs italic">
            No recommendations generated. Run the AI Pipeline to analyze.
          </div>
        )}
      </div>
    </div>
  )
}

export default RecommendationPanel
