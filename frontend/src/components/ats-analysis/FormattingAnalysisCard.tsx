import React, { useState } from 'react'
import { SlidersHorizontal, CheckCircle2, AlertTriangle, HelpCircle, ChevronDown, ShieldCheck, Zap, Sparkles, Award } from 'lucide-react'
import { mockFormattingAudit, type FormattingItem } from '@/lib/ats-mock-data'
import { cn } from '@/lib/utils'

export const FormattingAnalysisCard: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>('fmt-font')

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  const passCount = mockFormattingAudit.filter((f) => f.status === 'pass').length
  const warningCount = mockFormattingAudit.filter((f) => f.status === 'warning').length
  const criticalCount = 0

  // Priority-sort items: warnings & critical items first
  const sortedAuditItems = [...mockFormattingAudit].sort((a, b) => {
    if (a.status === 'warning' && b.status === 'pass') return -1
    if (a.status === 'pass' && b.status === 'warning') return 1
    return 0
  })

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 p-4 sm:p-5 shadow-xl space-y-4 h-full flex flex-col justify-between">
      {/* 1. Diagnostic Resume Health KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Formatting Health</div>
            <div className="text-xs font-bold text-white font-mono">96 / 100 (Clean Layout)</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">ATS Compatibility</div>
            <div className="text-xs font-bold text-purple-300 font-mono">100% Parsing Ready</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase">Audit Severity</div>
            <div className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5">
              <span className="text-rose-400">{criticalCount} Critical</span>
              <span>•</span>
              <span className="text-amber-400">{warningCount} Warning</span>
              <span>•</span>
              <span className="text-emerald-400">{passCount} Passed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            Resume Structure & Formatting Diagnostics
          </h3>
          <p className="text-xs text-slate-400">
            Automated verification of typography, margins, bullet hierarchy, and parsing safety.
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

      {/* 3. Priority-Sorted Audit Checklist Feed (8 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
        {sortedAuditItems.map((item) => {
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
                  : isPass
                  ? 'border-slate-800/80 hover:border-purple-500/30'
                  : 'border-amber-500/40 bg-amber-950/10'
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

              {/* Detailed AI Recommendation Accordion */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5 animate-in fade-in duration-150">
                  <p className="text-slate-300 leading-relaxed">{item.message}</p>
                  <div className="p-2 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-purple-300 font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Suggested AI Fix:</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-normal">{item.tip}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 4. AI Formatting Coach Callout Strip */}
      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-white font-bold">AI Formatting Recommendation:</strong> Adjust experience section font sizes to consistent 10.5pt and normalize margin spacing to achieve a 100% flawless format score.
        </span>
      </div>
    </div>
  )
}
