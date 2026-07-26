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
    <aside aria-label="Section Analysis Sidebar" className="space-y-5">
      {/* 1. Section Summary Card */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-slate-100">Section Overview</h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {section?.score ?? 0}% Score
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex justify-between">
            <span className="text-slate-400 font-sans">Section Name</span>
            <span className="text-slate-200 font-bold font-sans truncate max-w-[130px]">{section?.name ?? 'Section'}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex justify-between">
            <span className="text-slate-400 font-sans">Status</span>
            <span className="text-emerald-400 font-bold font-sans">{section?.status ?? 'Good'}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60 flex justify-between">
            <span className="text-slate-400 font-sans">Keywords Analyzed</span>
            <span className="text-purple-300 font-bold">{keywordsCount} Tokens</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Section Tips */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          Section Best Practices
        </h3>

        <div className="space-y-2 text-xs text-slate-300">
          {quickTips.map((tip, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 leading-relaxed">
              • {tip}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Related Recommendations */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            Related Recommendations
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {timeline.map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between">
              <span className="font-semibold text-slate-200 truncate max-w-[170px]">{item?.title ?? 'Step'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">{item?.estimatedImpact ?? ''}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
