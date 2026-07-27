import React from 'react'
import { GitPullRequest, Clock, CheckCircle2, RefreshCw } from 'lucide-react'
import { githubDeveloperMetricsMockData, type PullRequestMetricsData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface PullRequestMetricsProps {
  metrics?: PullRequestMetricsData
  className?: string
}

export const PullRequestMetrics: React.FC<PullRequestMetricsProps> = ({
  metrics = githubDeveloperMetricsMockData.pullRequests,
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
            <GitPullRequest size={16} className="text-emerald-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Pull Request Velocity</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">PR lifecycle & merge efficiency</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {metrics.mergeRate}% Merge Rate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 space-y-1">
          <div className="text-[10px] text-[var(--muted)]">Opened vs Merged</div>
          <div className="text-base font-extrabold text-[var(--heading)]">
            {metrics.merged} <span className="text-xs text-[var(--muted)] font-normal">/ {metrics.opened} PRs</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${metrics.mergeRate}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 space-y-1">
          <div className="text-[10px] text-[var(--muted)]">Avg Merge Time</div>
          <div className="text-base font-extrabold text-sky-400">{metrics.averageMergeTime}</div>
          <div className="text-[9px] text-emerald-400 font-semibold">Fast turn-around</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 space-y-1">
          <div className="text-[10px] text-[var(--muted)]">Avg Review Time</div>
          <div className="text-base font-extrabold text-purple-400">{metrics.averageReviewTime}</div>
          <div className="text-[9px] text-purple-400 font-semibold">Prompt review cycles</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40 space-y-1">
          <div className="text-[10px] text-[var(--muted)] font-medium">Review Cycles</div>
          <div className="text-base font-extrabold text-[var(--heading)]">{metrics.reviewCycles}</div>
          <div className="text-[9px] text-emerald-400 font-semibold">Low friction</div>
        </div>
      </div>
    </div>
  )
}
