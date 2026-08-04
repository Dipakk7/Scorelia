import React from 'react'
import { Award, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'
import { ScoreRing } from '@/components/ui/ScoreRing'
import type { SectionQualityItem } from '@/lib/ats-section-mock-data'
import { cn } from '@/lib/utils'

interface SectionContentQualityCardProps {
  contentQuality?: SectionQualityItem[]
}

export const SectionContentQualityCard: React.FC<SectionContentQualityCardProps> = ({
  contentQuality = [],
}) => {
  const safeQuality = Array.isArray(contentQuality) ? contentQuality : []

  const avgScore = safeQuality.length > 0
    ? Math.round(safeQuality.reduce((sum, item) => sum + (item.score ?? 0), 0) / safeQuality.length)
    : 92

  const sorted = [...safeQuality].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const strongestArea = sorted[0]?.name ?? 'Clarity'
  const needsImprovementArea = sorted[sorted.length - 1]?.name ?? 'Quantified Metrics'

  const isExcellent = avgScore >= 90
  const isWarning = avgScore < 80

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-5 shadow-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header & Radial Chart Summary */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 shadow-sm shrink-0 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                Section Content Quality Review
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Evaluation across Clarity, Impact, Action Verbs, Quantified Results, and Relevance.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-sm shrink-0 self-start sm:self-auto">
            Quality Evaluated
          </span>
        </div>

        {/* Compact Radial Score Chart & Summary Banner */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-inner flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3.5">
            <ScoreRing
              value={avgScore}
              max={100}
              size={64}
              strokeWidth={5.5}
              color={isExcellent ? '--success' : isWarning ? '--warning' : '--primary'}
              trackColor="--border"
            />
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 font-sans font-medium">Overall Quality Index</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{avgScore}</span>
                <span className="text-xs text-slate-400 font-mono font-medium">/ 100</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono w-full sm:w-auto">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-sans block">Top Strength</span>
              <span className="text-emerald-400 font-bold font-sans text-xs truncate block" title={strongestArea}>
                {strongestArea}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-sans block">Needs Focus</span>
              <span className="text-amber-400 font-bold font-sans text-xs truncate block" title={needsImprovementArea}>
                {needsImprovementArea}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Criteria Progress Bars */}
      <div className="space-y-2.5 flex-1">
        {safeQuality.map((item, idx) => {
          const isHigh = (item?.score ?? 0) >= 90

          return (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-100">{item?.name ?? 'Criterion'}</span>
                <span className="font-mono font-bold text-purple-300">{item?.score ?? 0} / 100</span>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full bg-slate-950/80 border border-slate-800/60 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500 shadow-sm',
                    isHigh ? 'bg-gradient-to-r from-purple-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  )}
                  style={{ width: `${item?.score ?? 0}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                <span>{item?.description ?? ''}</span>
                <span className="text-purple-300 font-medium flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" /> {item?.recommendation ?? ''}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Compact KPI Chips Row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-2.5 border-t border-slate-800/80">
        {safeQuality.map((item, idx) => (
          <div key={idx} className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-center space-y-0.5">
            <span className="text-[9px] font-sans text-slate-400 truncate block">{item.name}</span>
            <span className="text-xs font-mono font-bold text-purple-300 block">{item.score}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
