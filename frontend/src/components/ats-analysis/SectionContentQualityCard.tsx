import React from 'react'
import { Award, Sparkles } from 'lucide-react'
import type { SectionQualityItem } from '@/lib/ats-section-mock-data'
import { cn } from '@/lib/utils'

interface SectionContentQualityCardProps {
  contentQuality?: SectionQualityItem[]
}

export const SectionContentQualityCard: React.FC<SectionContentQualityCardProps> = ({
  contentQuality = [],
}) => {
  const safeQuality = Array.isArray(contentQuality) ? contentQuality : []

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800/90 p-3.5 sm:p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            Section Content Quality Review
          </h3>
          <p className="text-xs text-slate-400">
            Evaluation across Clarity, Impact, Action Verbs, Quantified Results, and Relevance.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          Quality Evaluated
        </span>
      </div>

      {/* Quality Criteria Progress Bars */}
      <div className="space-y-3">
        {safeQuality.map((item, idx) => {
          const isHigh = (item?.score ?? 0) >= 90

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{item?.name ?? 'Criterion'}</span>
                <span className="font-mono font-bold text-purple-300">{item?.score ?? 0} / 100</span>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isHigh ? 'bg-gradient-to-r from-purple-500 to-emerald-400' : 'bg-amber-500'
                  )}
                  style={{ width: `${item?.score ?? 0}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                <span>{item?.description ?? ''}</span>
                <span className="text-purple-300 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" /> {item?.recommendation ?? ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
