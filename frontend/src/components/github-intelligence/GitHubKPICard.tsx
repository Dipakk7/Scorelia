import React from 'react'
import {
  FolderGit2,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Eye,
  TrendingUp,
  Users,
} from 'lucide-react'
import type { GitHubKPIMetric, KPICardStatusColor } from '@/data/githubHeroMockData'
import { GitHubTrendBadge } from './GitHubTrendBadge'
import { GitHubSparkline } from './GitHubSparkline'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

export interface GitHubKPICardProps {
  kpi?: GitHubKPIMetric
  isLoading?: boolean
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

const ICON_MAP: Record<string, React.ElementType> = {
  FolderGit2,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Eye,
  TrendingUp,
  Users,
}

const STATUS_COLOR_CLASSES: Record<
  KPICardStatusColor,
  { bg: string; text: string; stroke: string }
> = {
  purple: { bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-400', stroke: '#a855f7' },
  sky: { bg: 'bg-sky-500/10 border-sky-500/20', text: 'text-sky-400', stroke: '#38bdf8' },
  emerald: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', stroke: '#34d399' },
  amber: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', stroke: '#fbbf24' },
  indigo: { bg: 'bg-indigo-500/10 border-indigo-500/20', text: 'text-indigo-400', stroke: '#818cf8' },
  rose: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400', stroke: '#fb7185' },
  teal: { bg: 'bg-teal-500/10 border-teal-500/20', text: 'text-teal-400', stroke: '#2dd4bf' },
}

export const GitHubKPICard: React.FC<GitHubKPICardProps> = ({
  kpi,
  isLoading = false,
  isSelected = false,
  onClick,
  className,
}) => {
  if (isLoading || !kpi) {
    return (
      <div className={cn('p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 flex flex-col justify-between h-36 space-y-3', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        <Skeleton className="h-7 w-20 rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
    )
  }

  const IconComponent = ICON_MAP[kpi.icon] || FolderGit2
  const colorStyles = STATUS_COLOR_CLASSES[kpi.statusColor] || STATUS_COLOR_CLASSES.purple

  return (
    <div
      tabIndex={0}
      role="button"
      onClick={onClick}
      aria-pressed={isSelected}
      aria-selected={isSelected}
      aria-label={`${kpi.title}: ${kpi.value}, ${kpi.trend} ${kpi.comparisonLabel}`}
      className={cn(
        'group relative p-3.5 sm:p-4 rounded-2xl bg-[#0f101c] transition-all duration-200 cursor-pointer text-left select-none flex flex-col justify-between space-y-3',
        'hover:bg-[#15172a] hover:border-purple-500/40 hover:shadow-md hover:-translate-y-0.5',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
        isSelected
          ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border border-white/10 shadow-sm',
        className
      )}
    >
      {/* Card Header: Icon & Title */}
      <div className="flex items-center justify-between gap-2">
        <div className={cn('p-2 rounded-xl border flex items-center justify-center shrink-0', colorStyles.bg)}>
          <IconComponent className={cn('h-4 w-4', colorStyles.text)} />
        </div>
        <span className={cn('text-[11px] font-semibold transition-colors truncate', isSelected ? 'text-purple-200 font-bold' : 'text-[var(--muted)] group-hover:text-[var(--heading)]')}>
          {kpi.title}
        </span>
      </div>

      {/* Primary Value & Trend */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xl sm:text-2xl font-extrabold font-display text-[var(--heading)] tracking-tight">
            {kpi.value}
          </span>
          <GitHubTrendBadge trend={kpi.trend} direction={kpi.trendDirection} />
        </div>
        <div className="text-[10px] text-[var(--muted)] font-medium truncate">
          {kpi.comparisonLabel}
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="pt-1">
        <GitHubSparkline data={kpi.sparklineData} color={colorStyles.stroke} height={32} />
      </div>
    </div>
  )
}
