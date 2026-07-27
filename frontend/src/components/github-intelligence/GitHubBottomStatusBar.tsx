import React from 'react'
import { Sparkles, TrendingUp, Flame, GitPullRequest, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Github } from '@/components/ui/GithubIcon'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export interface GitHubBottomStatusBarProps {
  isLoading?: boolean
  onGenerateReport?: () => void
  className?: string
}

export const GitHubBottomStatusBar: React.FC<GitHubBottomStatusBarProps> = ({
  isLoading = false,
  onGenerateReport,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={cn('w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm', className)}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full p-3.5 sm:p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md shadow-md text-left font-sans',
        className
      )}
    >
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* GitHub Sync Status */}
        <div className="flex items-center gap-3 pr-4 border-b lg:border-b-0 lg:border-r border-[var(--border)] pb-3 lg:pb-0 shrink-0">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Github size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--heading)]">
              <span>Sync Status</span>
              <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
            <div className="text-[10px] text-[var(--muted)]">Last synced 2 min ago</div>
          </div>
        </div>

        {/* 4 Bottom Metric Placeholders */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 items-center px-0 lg:px-4 py-1">
          {/* Total Contributions */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)] font-medium">Total Contributions</div>
              <div className="text-sm font-extrabold text-[var(--heading)]">1,248</div>
              <div className="text-[9px] font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 24% vs last 30 days
              </div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Flame size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)] font-medium">Longest Streak</div>
              <div className="text-sm font-extrabold text-[var(--heading)]">23 days</div>
              <div className="text-[9px] text-[var(--muted)]">Current streak</div>
            </div>
          </div>

          {/* Open PRs */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
              <GitPullRequest size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)] font-medium">Open PRs</div>
              <div className="text-sm font-extrabold text-[var(--heading)]">3</div>
              <div className="text-[9px] font-semibold text-rose-400 flex items-center gap-0.5">
                <ArrowDownRight size={10} /> 1 vs last 30 days
              </div>
            </div>
          </div>

          {/* Review Score */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
              <Star size={16} />
            </div>
            <div>
              <div className="text-[10px] text-[var(--muted)] font-medium">Review Score</div>
              <div className="text-sm font-extrabold text-[var(--heading)]">4.8 / 5</div>
              <div className="text-[9px] font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight size={10} /> 0.3 vs last 30 days
              </div>
            </div>
          </div>
        </div>

        {/* Action CTA Button */}
        <div className="pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[var(--border)] lg:pl-4 shrink-0">
          <button
            type="button"
            onClick={onGenerateReport}
            className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <Sparkles size={15} />
            <span>Generate AI Report</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
