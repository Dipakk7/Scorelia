import React from 'react'
import { Eye, CheckCircle2, MessageSquare, Clock, ShieldCheck } from 'lucide-react'
import { githubDeveloperMetricsMockData, type CodeReviewMetricsData } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface CodeReviewMetricsProps {
  metrics?: CodeReviewMetricsData
  className?: string
}

export const CodeReviewMetrics: React.FC<CodeReviewMetricsProps> = ({
  metrics = githubDeveloperMetricsMockData.codeReviews,
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
            <Eye size={16} className="text-indigo-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Code Review Metrics</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Peer review activity & responsiveness</p>
        </div>
        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Score: {metrics.reviewQualityScore}%
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Reviews Completed</div>
          <div className="text-lg font-extrabold text-[var(--heading)] mt-1">{metrics.reviewsCompleted}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Approvals</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-1">{metrics.approvals}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Change Requests</div>
          <div className="text-lg font-extrabold text-amber-400 mt-1">{metrics.changeRequests}</div>
        </div>

        <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[10px] text-[var(--muted)]">Response Time</div>
          <div className="text-lg font-extrabold text-sky-400 mt-1">{metrics.responseTime}</div>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/20 flex items-center justify-between text-xs">
        <span className="text-[var(--muted)] flex items-center gap-1.5">
          <MessageSquare size={13} className="text-indigo-400" /> Review Comments Given
        </span>
        <span className="font-bold text-[var(--heading)]">{metrics.comments} comments</span>
      </div>
    </div>
  )
}
