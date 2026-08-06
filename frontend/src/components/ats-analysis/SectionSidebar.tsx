import React from 'react'
import { Award, Lightbulb, Zap } from 'lucide-react'
import type { SectionDetailData } from '@/lib/ats-section-mock-data'

interface SectionSidebarProps {
  section?: SectionDetailData
}

export const SectionSidebar: React.FC<SectionSidebarProps> = ({ section }) => {
  if (!section) return null

  const keywordsCount = (section?.keywords ?? []).length
  const quickTips = section?.quickTips ?? []
  const timeline = section?.timeline ?? []

  return (
    <aside aria-label="Section Analysis Sidebar" className="space-y-4">
      {/* 1. Section Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Section Overview</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-sm shrink-0">
            {section?.score ?? 0}% Score
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex justify-between items-center gap-2 shadow-inner">
            <span className="text-slate-400 font-sans text-xs shrink-0">Section Name</span>
            <span className="text-slate-100 font-bold font-sans truncate text-right text-xs">{section?.name ?? 'Section'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex justify-between items-center shadow-inner">
            <span className="text-slate-400 font-sans text-xs">Status</span>
            <span className="text-emerald-400 font-bold font-sans text-xs">{section?.status ?? 'Good'}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex justify-between items-center shadow-inner">
            <span className="text-slate-400 font-sans text-xs">Keywords Analyzed</span>
            <span className="text-purple-300 font-bold font-mono text-xs">{keywordsCount} Tokens</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Section Tips */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-slate-100 tracking-tight">Section Best Practices</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-300/90">
          {quickTips.map((tip, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 leading-relaxed shadow-sm flex items-start gap-2.5">
              <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Related Recommendations */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Zap className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Related Recommendations</h3>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          {timeline.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2.5 shadow-sm">
              <span className="font-bold text-slate-200 truncate flex-1 text-xs">{item?.title ?? 'Step'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 shrink-0">{item?.estimatedImpact ?? ''}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
