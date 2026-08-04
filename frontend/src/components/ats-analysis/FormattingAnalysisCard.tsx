import React, { useState } from 'react'
import { SlidersHorizontal, CheckCircle2, AlertTriangle, HelpCircle, ChevronDown } from 'lucide-react'
import { mockFormattingAudit, type FormattingItem } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

export const FormattingAnalysisCard: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const passCount = mockFormattingAudit.filter((f) => f.status === 'pass').length
  const warningCount = mockFormattingAudit.filter((f) => f.status === 'warning').length

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-4 sm:p-5 shadow-lg space-y-3.5 h-full flex flex-col justify-between">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            Format & Structure Audit Checklist
          </h3>
          <p className="text-xs text-slate-400">
            Audit formatting, fonts, margins, headings, and bullet points.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> {passCount} Passed
          </span>
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-3 h-3" /> {warningCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* Audit Checklist Grid (8 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
        {mockFormattingAudit.map((item) => {
          const isExpanded = expandedId === item.id
          const isPass = item.status === 'pass'

          return (
            <div
              key={item.id}
              onClick={() => toggleExpand(item.id)}
              className={cn(
                'p-3.5 rounded-xl bg-slate-950/60 border transition-all duration-200 cursor-pointer space-y-2',
                isExpanded
                  ? 'border-purple-500/50 bg-purple-950/20 shadow-md'
                  : 'border-slate-800/80 hover:border-purple-500/30'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {isPass ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">{item.title}</span>
                </div>

                <span
                  className={cn(
                    'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border',
                    isPass
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  )}
                >
                  {isPass ? 'PASS' : 'WARNING'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono text-slate-300 font-semibold">{item.value}</span>
                <ChevronDown
                  className={cn('w-4 h-4 text-slate-500 transition-transform duration-200', isExpanded && 'rotate-180')}
                />
              </div>

              {/* Detailed Tip Accordion */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1 animate-in fade-in duration-150">
                  <p className="text-slate-400">{item.message}</p>
                  <p className="text-purple-300 font-medium flex items-start gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>Tip: {item.tip}</span>
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
