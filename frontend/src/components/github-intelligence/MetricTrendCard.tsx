import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { GitHubSparkline } from './GitHubSparkline'
import { cn } from '@/lib/utils'

export interface MetricTrendCardProps {
  title: string
  value: string | number
  trend: string
  trendDirection?: 'up' | 'down' | 'neutral'
  comparisonLabel?: string
  sparklineData?: number[]
  statusColor?: string
  icon?: React.ElementType
  className?: string
}

export const MetricTrendCard: React.FC<MetricTrendCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'up',
  comparisonLabel = 'vs last 30 days',
  sparklineData = [10, 12, 14, 13, 16, 18, 20],
  statusColor = '#a855f7',
  icon: Icon,
  className,
}) => {
  const isUp = trendDirection === 'up' || trend.startsWith('+')
  const isDown = trendDirection === 'down' || trend.startsWith('-')

  return (
    <div
      tabIndex={0}
      className={cn(
        'group p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md shadow-sm',
        'hover:border-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-left font-sans select-none flex flex-col justify-between space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-[var(--muted)] truncate group-hover:text-[var(--heading)] transition-colors">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Icon size={14} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-extrabold font-display text-[var(--heading)] tracking-tight">
            {value}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md border',
              isUp
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : isDown
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]'
            )}
          >
            {isUp ? <ArrowUpRight size={11} /> : isDown ? <ArrowDownRight size={11} /> : <Minus size={11} />}
            {trend}
          </span>
        </div>
        <div className="text-[10px] text-[var(--muted)] font-medium truncate">{comparisonLabel}</div>
      </div>

      {sparklineData && (
        <div className="pt-1">
          <GitHubSparkline data={sparklineData} color={statusColor} height={30} />
        </div>
      )}
    </div>
  )
}
