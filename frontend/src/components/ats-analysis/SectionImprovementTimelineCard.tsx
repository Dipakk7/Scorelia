import React from 'react'
import { Clock, Play, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { SectionTimelineItem } from '@/lib/ats-section-mock-data'
import { cn } from '@/lib/utils'

interface SectionImprovementTimelineCardProps {
  timeline: SectionTimelineItem[]
}

export const SectionImprovementTimelineCard: React.FC<SectionImprovementTimelineCardProps> = ({
  timeline,
}) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        No critical improvement sequence steps required for this section.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Section Improvement Steps
          </h3>
          <p className="text-xs text-slate-400">
            Ordered sequence of optimization tasks for this section.
          </p>
        </div>

        <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
          {timeline.length} Steps Sequence
        </span>
      </div>

      {/* Step Cards */}
      <div className="space-y-2.5">
        {timeline.map((item) => {
          const isHigh = item.priority === 'High'

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border',
                      isHigh
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    )}
                  >
                    {item.priority} Priority
                  </span>

                  <span className="text-[10px] font-mono text-slate-400">
                    {item.estimatedTime} • {item.difficulty}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-300">{item.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {item.estimatedImpact}
                </span>

                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Execute Step</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
