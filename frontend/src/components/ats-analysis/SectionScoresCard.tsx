import React, { useState } from 'react'
import { FileText, ChevronDown, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { mockSectionScores, type SectionScoreItem } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

export const SectionScoresCard: React.FC = () => {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('sec-summary')

  const toggleExpand = (id: string) => {
    setExpandedSectionId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5 h-auto">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Resume Section Performance Scores
          </h3>
          <p className="text-xs text-slate-400">
            Individual section quality scores, criteria breakdown, and improvement tips.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
          7 Sections Analyzed
        </span>
      </div>

      {/* 7 Section Score Accordion Cards */}
      <div className="space-y-3">
        {mockSectionScores.map((sec) => {
          const isExpanded = expandedSectionId === sec.id
          const isExcellent = sec.statusType === 'excellent'

          return (
            <div
              key={sec.id}
              className={cn(
                'rounded-xl bg-slate-950/60 border transition-all duration-200 overflow-hidden',
                isExpanded ? 'border-purple-500/50 shadow-md' : 'border-slate-800/80 hover:border-purple-500/30'
              )}
            >
              {/* Header Bar */}
              <div
                onClick={() => toggleExpand(sec.id)}
                className="flex items-center justify-between p-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                    {sec.score}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{sec.title}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {sec.itemCount} items detected
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mini Progress Bar */}
                  <div className="w-24 sm:w-36 hidden sm:block">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Score</span>
                      <span className="text-slate-200 font-bold">{sec.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          isExcellent ? 'bg-emerald-400' : 'bg-purple-500'
                        )}
                        style={{ width: `${sec.score}%` }}
                      />
                    </div>
                  </div>

                  <span
                    className={cn(
                      'text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-full border',
                      isExcellent
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                    )}
                  >
                    {sec.status}
                  </span>

                  <ChevronDown
                    className={cn('w-4 h-4 text-slate-400 transition-transform duration-200', isExpanded && 'rotate-180')}
                  />
                </div>
              </div>

              {/* Expandable Criteria Breakdown */}
              {isExpanded && (
                <div className="p-4 bg-slate-900/50 border-t border-slate-800/80 space-y-3 text-xs animate-in fade-in duration-150">
                  <div className="text-xs font-semibold text-slate-300">Criteria Score Breakdown</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {sec.criteriaBreakdown.map((crit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 font-mono text-[11px]"
                      >
                        <span className="text-slate-400 font-sans">{crit.name}</span>
                        <span className="text-slate-200 font-bold">
                          {crit.score} / {crit.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>

                  {sec.tips.length > 0 && (
                    <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/30 text-purple-200 text-xs space-y-1">
                      <div className="font-semibold flex items-center gap-1.5 text-purple-300">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Improvement Recommendation:
                      </div>
                      <ul className="list-disc list-inside text-slate-300 space-y-0.5 pl-1">
                        {sec.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
