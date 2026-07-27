import React from 'react'
import type { RepositoryHealthLevel } from '@/data/githubRepositoriesMockData'
import { cn } from '@/lib/utils'

export interface RepositoryHealthBadgeProps {
  health: RepositoryHealthLevel
  className?: string
}

const HEALTH_CONFIG: Record<
  RepositoryHealthLevel,
  { bg: string; text: string; border: string; label: string }
> = {
  Excellent: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    label: 'Excellent',
  },
  Good: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/20',
    label: 'Good',
  },
  Average: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
    label: 'Average',
  },
  'Needs Work': {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    label: 'Needs Work',
  },
  Poor: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    label: 'Poor',
  },
  Archived: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    label: 'Archived',
  },
}

export const RepositoryHealthBadge: React.FC<RepositoryHealthBadgeProps> = ({
  health,
  className,
}) => {
  const config = HEALTH_CONFIG[health] || HEALTH_CONFIG.Good

  return (
    <span
      aria-label={`Repository health rating: ${config.label}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full border select-none transition-colors',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full fill-current', config.text)} />
      <span>{config.label}</span>
    </span>
  )
}
