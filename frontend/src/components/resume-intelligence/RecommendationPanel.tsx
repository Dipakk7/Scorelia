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
          bg: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-200/50 dark:border-rose-900/40',
          badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-550/20',
          icon: <AlertTriangle size={14} className="text-rose-500 stroke-[2.25]" />,
        }
      case 'MEDIUM':
        return {
          bg: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-200/50 dark:border-amber-900/40',
          badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-550/20',
          icon: <Zap size={14} className="text-amber-500 animate-pulse stroke-[2.25]" />,
        }
      case 'LOW':
        return {
          bg: 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200/60 dark:border-slate-800',
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300/30',
          icon: <Info size={14} className="text-slate-400 stroke-[2.25]" />,
        }
    }
  }

  return (
    <div className="space-y-4 text-left font-sans">
      <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-850/80">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 m-0">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Actionable Fixes</span>
        </h3>
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-550 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-lg border border-slate-200/30 dark:border-slate-750/30">
          {sortedRecs.length} suggestions
        </span>
      </div>

      <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-none">
        {sortedRecs.length > 0 ? (
          sortedRecs.map((rec, idx) => {
            const isOpen = !!openStates[idx]
            const styles = getPriorityStyles(rec.priority)

            return (
              <div
                key={idx}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${styles.bg} ${
                  isOpen ? 'ring-1 ring-brand-500/10 shadow-2xs border-brand-500/20' : 'hover:border-slate-350 dark:hover:border-slate-700'
                }`}
              >
                {/* Recommendation Header */}
                <button
                  onClick={() => toggleOpen(idx)}
                  className="w-full flex items-center justify-between p-4 cursor-pointer focus:outline-none bg-transparent border-none"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4 text-left">
                    <span className="shrink-0">{styles.icon}</span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${styles.badge}`}
                    >
                      {rec.priority}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate leading-tight m-0">
                      {rec.suggested_fix}
                    </h4>
                  </div>
                  <span className="text-slate-400 hover:text-slate-655 dark:hover:text-slate-300 shrink-0">
                    {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </span>
                </button>

                {/* Recommendation Details */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-border/40 mt-0 bg-background/20 space-y-3.5">
                    {/* Reason */}
                    <div className="space-y-1 mt-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                        Issue Found
                      </span>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium m-0">
                        {rec.reason}
                      </p>
                    </div>

                    {/* Impact / Estimations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-dashed border-border/40">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
                          Impact Analysis
                        </span>
                        <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed font-normal m-0">
                          {rec.impact}
                        </p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 block flex items-center gap-1">
                          <TrendingUp size={10} className="text-brand-500" />
                          <span>Estimated Benefit</span>
                        </span>
                        <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed font-bold m-0">
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
