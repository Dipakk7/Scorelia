import React from 'react'
import { GitMerge, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react'
import { githubDeveloperMetricsMockData, type MergeStatisticsData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface MergeStatisticsProps {
  metrics?: MergeStatisticsData
  className?: string
}

export const MergeStatistics: React.FC<MergeStatisticsProps> = ({
  metrics = githubDeveloperMetricsMockData.mergeStatistics,
  className,
}) => {
  const totalStrategies = metrics.fastForward + metrics.squashMerge + metrics.rebaseMerge || 1
  const squashPct = Math.round((metrics.squashMerge / totalStrategies) * 100)
  const ffPct = Math.round((metrics.fastForward / totalStrategies) * 100)
  const rebasePct = Math.round((metrics.rebaseMerge / totalStrategies) * 100)

  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm flex flex-col justify-between space-y-4 text-left font-sans',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge size={16} className="text-purple-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Merge Statistics</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Git branch merging strategy & conflict audit</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          93% Smooth Merges
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Successful</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1">{metrics.successfulMerges}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Conflicts</div>
          <div className="text-lg font-extrabold text-amber-400 mt-1">{metrics.conflicts}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Failed</div>
          <div className="text-lg font-extrabold text-[var(--heading)] mt-1">{metrics.failedMerges}</div>
        </div>
      </div>

      {/* Merge Strategy Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="text-[11px] font-bold text-[var(--heading)]">Merge Strategy Breakdown</div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-semibold text-[var(--muted)]">
            <span>Squash ({squashPct}%)</span>
            <span>Fast-Forward ({ffPct}%)</span>
            <span>Rebase ({rebasePct}%)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--surface-hover)] flex overflow-hidden">
            <div className="h-full bg-purple-500" style={{ width: `${squashPct}%` }} title="Squash Merges" />
            <div className="h-full bg-sky-400" style={{ width: `${ffPct}%` }} title="Fast-Forward Merges" />
            <div className="h-full bg-emerald-400" style={{ width: `${rebasePct}%` }} title="Rebase Merges" />
          </div>
        </div>
      </div>
    </div>
  )
}
