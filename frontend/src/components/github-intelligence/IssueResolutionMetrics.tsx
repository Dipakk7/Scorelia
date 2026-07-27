import React from 'react'
import { AlertCircle, CheckCircle2, Clock, RotateCcw } from 'lucide-react'
import { githubDeveloperMetricsMockData, type IssueResolutionData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface IssueResolutionMetricsProps {
  metrics?: IssueResolutionData
  className?: string
}

export const IssueResolutionMetrics: React.FC<IssueResolutionMetricsProps> = ({
  metrics = githubDeveloperMetricsMockData.issueResolution,
  className,
}) => {
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
            <AlertCircle size={16} className="text-amber-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Issue Resolution Metrics</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Bug triage & resolution efficiency</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {metrics.resolutionRate}% Closed Rate
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Opened Issues</div>
          <div className="text-lg font-extrabold text-[var(--heading)] mt-1">{metrics.opened}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Closed Issues</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1">{metrics.closed}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Avg Resolution Time</div>
          <div className="text-lg font-extrabold text-sky-400 mt-1">{metrics.averageResolutionTime}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Reopened</div>
          <div className="text-lg font-extrabold text-amber-400 mt-1">{metrics.reopened}</div>
        </div>
      </div>

      <div className="space-y-1.5 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--heading)]">Triage Efficiency</span>
          <span className="text-emerald-400 font-bold">{metrics.resolutionRate}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden">
          <div className="h-full rounded-full bg-emerald-400" style={{ width: `${metrics.resolutionRate}%` }} />
        </div>
      </div>
    </div>
  )
}
