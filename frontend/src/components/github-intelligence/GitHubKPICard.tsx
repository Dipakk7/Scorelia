import React from 'react'
import { motion } from 'framer-motion'
import {
  FolderGit2,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Eye,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
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
  const shouldReduceMotion = useScoreliaReducedMotion()

  if (isLoading || !kpi) {
    return (
      <div className={cn('p-3.5 sm:p-4 rounded-2xl border border-white/10 bg-[#0f101c] flex flex-col justify-between h-36 space-y-3', className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-8 rounded-xl bg-slate-800" />
          <Skeleton className="h-4 w-12 rounded bg-slate-800/60" />
        </div>
        <Skeleton className="h-7 w-20 rounded-lg bg-slate-800" />
        <Skeleton className="h-8 w-full rounded-lg bg-slate-800/50" />
      </div>
    )
  }

  const IconComponent = ICON_MAP[kpi.icon] || FolderGit2
  const colorStyles = STATUS_COLOR_CLASSES[kpi.statusColor] || STATUS_COLOR_CLASSES.purple

  const cardMotionVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.015,
          y: -2,
          boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.4), 0 0 16px rgba(168, 85, 247, 0.15)',
        },
    tap: shouldReduceMotion ? {} : { scale: 0.98 },
  }

  return (
    <motion.div
      variants={cardMotionVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      tabIndex={0}
      role="button"
      onClick={onClick}
      aria-pressed={isSelected}
      aria-selected={isSelected}
      aria-label={`${kpi.title}: ${kpi.value}. ${kpi.trend} ${kpi.comparisonLabel}`}
      className={cn(
        'group relative flex flex-col justify-between h-full p-3.5 sm:p-4 rounded-2xl bg-[#0f101c] transition-all duration-200 cursor-pointer text-left select-none',
        'hover:bg-[#15172a] hover:border-purple-500/40 hover:shadow-md',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
        isSelected
          ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border border-white/10 shadow-sm',
        className
      )}
    >
      {/* 1. Header: Icon Container & Title */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className={cn('p-1.5 sm:p-2 rounded-xl border flex items-center justify-center shrink-0', colorStyles.bg)}>
          <IconComponent className={cn('h-4 w-4', colorStyles.text)} aria-hidden="true" />
        </div>
        <span
          className={cn(
            'text-xs font-bold transition-colors truncate',
            isSelected ? 'text-purple-200 font-extrabold' : 'text-slate-300 group-hover:text-white'
          )}
        >
          {kpi.title}
        </span>
      </div>

      {/* 2. Primary Dominant Metric Value */}
      <div className="my-1 sm:my-1.5">
        <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight leading-none block">
          {kpi.value}
        </span>
      </div>

      {/* 3. Footer: Trend Badge, Comparison Label & Sparkline */}
      <div className="pt-2 sm:pt-2.5 border-t border-white/5 flex items-end justify-between gap-2 mt-auto">
        <div className="flex flex-col min-w-0">
          <GitHubTrendBadge trend={kpi.trend} direction={kpi.trendDirection} />
          <span className="text-[10px] font-medium text-slate-500 truncate mt-1 block font-sans">
            {kpi.comparisonLabel}
          </span>
        </div>

        {/* Sparkline Visualizer */}
        <GitHubSparkline data={kpi.sparklineData} color={colorStyles.stroke} height={26} width={58} />
      </div>
    </motion.div>
  )
}

export default GitHubKPICard
