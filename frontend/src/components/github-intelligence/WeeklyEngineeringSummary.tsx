import React from 'react'
import { Calendar, CheckCircle2, Star, GitCommit, GitPullRequest, Eye, FolderGit2 } from 'lucide-react'
import { githubAIInsightsMockData, type WeeklySummaryData } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface WeeklyEngineeringSummaryProps {
  summary?: WeeklySummaryData
  className?: string
}

export const WeeklyEngineeringSummary: React.FC<WeeklyEngineeringSummaryProps> = ({
  summary = githubAIInsightsMockData.weeklySummary[0],
  className,
}) => {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm space-y-4 font-sans text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-emerald-400" />
            <h3 className="font-bold text-sm text-[var(--heading)] m-0">Weekly Executive Summary</h3>
          </div>
          <p className="text-[11px] text-[var(--muted)] m-0 mt-0.5">Engineering output for this week</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          This Week
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-sans">
        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[9px] text-[var(--muted)] font-medium">Commits</div>
          <div className="text-base font-extrabold text-[var(--heading)] mt-0.5">{summary.commits}</div>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[9px] text-[var(--muted)] font-medium">PRs Merged</div>
          <div className="text-base font-extrabold text-emerald-400 mt-0.5">{summary.pullRequests}</div>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[9px] text-[var(--muted)] font-medium">Reviews</div>
          <div className="text-base font-extrabold text-purple-400 mt-0.5">{summary.reviews}</div>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[9px] text-[var(--muted)] font-medium">Issues Closed</div>
          <div className="text-base font-extrabold text-sky-400 mt-0.5">{summary.issuesClosed}</div>
        </div>

        <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-hover)]/40">
          <div className="text-[9px] text-[var(--muted)] font-medium">Active Repos</div>
          <div className="text-base font-extrabold text-amber-400 mt-0.5">{summary.repositoriesWorked}</div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="text-[11px] font-bold text-[var(--heading)]">Key Engineering Highlights</div>
        <ul className="space-y-1.5 p-3 rounded-xl border border-[var(--border)]/60 bg-[var(--surface-hover)]/20 list-none m-0">
          {summary.highlights.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[11px] text-[var(--muted)] leading-normal">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
