import React from 'react'
import type { QualityScoreLevel } from '@/data/githubDeveloperMetricsMockData'
import { cn } from '@/lib/utils'

export interface QualityScoreBadgeProps {
  score?: number | string
  level?: QualityScoreLevel
  className?: string
}

const LEVEL_CONFIG: Record<
  QualityScoreLevel,
  { bg: string; text: string; border: string; label: string }
> = {
  Excellent: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Excellent' },
  Good: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', label: 'Good' },
  Average: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', label: 'Average' },
  'Needs Improvement': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'Needs Improvement' },
  Critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: 'Critical' },
}

export const QualityScoreBadge: React.FC<QualityScoreBadgeProps> = ({
  score,
  level = 'Excellent',
  className,
}) => {
  const config = LEVEL_CONFIG[level] || LEVEL_CONFIG.Good

  return (
    <span
      aria-label={`Quality score: ${score ? score + ' - ' : ''}${config.label}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full border select-none transition-colors',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full fill-current', config.text)} />
      <span>{score ? `${score} • ${config.label}` : config.label}</span>
    </span>
  )
}
