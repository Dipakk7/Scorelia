import React, { useState } from 'react'
import { Sparkles, Check, ChevronDown, Clock, Zap, AlertTriangle, Filter } from 'lucide-react'
import { mockPriorityRecommendations, type PriorityRecommendationItem } from '@/lib/ats-ai-mock-data'
import { cn } from '@/lib/utils'

export const PriorityRecommendationCard: React.FC = () => {
  const [items, setItems] = useState<PriorityRecommendationItem[]>(mockPriorityRecommendations)
  const [expandedId, setExpandedId] = useState<string | null>('rec-p1')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all')

  const toggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const filteredItems = items.filter(
    (item) => priorityFilter === 'all' || item.priority === priorityFilter
  )

  const completedCount = items.filter((i) => i.completed).length

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-2.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            AI Priority Recommendations
          </h3>
          <p className="text-xs text-slate-400">
            Actionable optimization steps ordered by maximum ATS score impact.
          </p>
        </div>

        {/* Priority Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'all', label: `All (${items.length})` },
            { id: 'High', label: 'High' },
            { id: 'Medium', label: 'Medium' },
            { id: 'Low', label: 'Low' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPriorityFilter(tab.id as any)}
              className={cn(
                'px-2 py-0.5 text-xs font-mono rounded-lg transition-colors cursor-pointer',
                priorityFilter === tab.id
                  ? 'bg-purple-600/30 text-purple-200 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation Items Feed */}
      <div className="space-y-2.5">
        {filteredItems.map((rec) => {
          const isExpanded = expandedId === rec.id
          const isHigh = rec.priority === 'High'
          const isMedium = rec.priority === 'Medium'

          return (
            <div
              key={rec.id}
              className={cn(
                'rounded-xl transition-all duration-200 overflow-hidden shadow-sm',
                rec.completed
                  ? 'border border-emerald-500/40 bg-emerald-950/20 opacity-80'
                  : isExpanded
                  ? 'border border-purple-500/50 bg-[#161828] shadow-md'
                  : 'border border-slate-800/80 bg-[#121422] hover:border-slate-700/80'
              )}
            >
              {/* Header Bar */}
              <div className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
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

                    <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30">
                      {rec.category}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {rec.estimatedTime} • {rec.difficulty}
                    </span>
                  </div>

                  <h4 className={cn('text-sm font-bold text-white', rec.completed && 'line-through text-slate-400')}>
                    {rec.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    {rec.estimatedImpact}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleComplete(rec.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                      rec.completed
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-[#181a2e] hover:bg-[#20233d] text-slate-200 border border-slate-700/80'
                    )}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{rec.completed ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={() => toggleExpand(rec.id)}
                    aria-label="Toggle recommendation details"
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="px-3.5 py-2.5 bg-[#0e101a] border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300 animate-in fade-in duration-150">
                  <p className="text-slate-300 leading-relaxed">{rec.description}</p>
                  <div className="font-semibold text-purple-300 pt-0.5">Implementation Steps:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                    {rec.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
