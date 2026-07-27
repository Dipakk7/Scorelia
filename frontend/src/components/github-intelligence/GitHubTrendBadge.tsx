import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import type { TrendDirection } from '@/data/githubHeroMockData'
import { cn } from '@/lib/utils'

export interface GitHubTrendBadgeProps {
  trend: string
  direction?: TrendDirection
  className?: string
}

export const GitHubTrendBadge: React.FC<GitHubTrendBadgeProps> = ({
  trend,
  direction = 'up',
  className,
}) => {
  const isUp = direction === 'up' || trend.startsWith('+')
  const isDown = direction === 'down' || trend.startsWith('-')

  const badgeBg = isUp
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    : isDown
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    : 'bg-[var(--surface-hover)] text-[var(--muted)] border-[var(--border)]'

  const label = isUp ? `Increased by ${trend}` : isDown ? `Decreased by ${trend}` : `Neutral trend ${trend}`

  return (
    <span
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md border select-none transition-colors',
        badgeBg,
        className
      )}
    >
      {isUp ? (
        <ArrowUpRight size={11} className="shrink-0" />
      ) : isDown ? (
        <ArrowDownRight size={11} className="shrink-0" />
      ) : (
        <Minus size={11} className="shrink-0" />
      )}
      <span className="truncate">{trend}</span>
    </span>
  )
}
