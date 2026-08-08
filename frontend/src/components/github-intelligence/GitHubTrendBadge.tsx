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
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    : 'bg-slate-800 text-slate-400 border-slate-700/60'

  const label = isUp ? `Increased by ${trend}` : isDown ? `Decreased by ${trend}` : `Neutral trend ${trend}`

  return (
    <span
      aria-label={label}
      className={cn(
        'inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold font-mono rounded-md border select-none transition-colors shrink-0',
        badgeBg,
        className
      )}
    >
      {isUp ? (
        <ArrowUpRight size={10} className="shrink-0" />
      ) : isDown ? (
        <ArrowDownRight size={10} className="shrink-0" />
      ) : (
        <Minus size={10} className="shrink-0" />
      )}
      <span className="truncate">{trend}</span>
    </span>
  )
}

export default GitHubTrendBadge
