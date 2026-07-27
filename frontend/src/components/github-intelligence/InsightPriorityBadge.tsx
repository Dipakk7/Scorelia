import React from 'react'
import type { InsightPriorityLevel } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface InsightPriorityBadgeProps {
  priority: InsightPriorityLevel
  className?: string
}

const PRIORITY_CONFIG: Record<
  InsightPriorityLevel,
  { bg: string; text: string; border: string; label: string }
> = {
  Critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: 'Critical' },
  High: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'High' },
  Medium: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', label: 'Medium' },
  Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'Low' },
  Informational: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Info' },
}

export const InsightPriorityBadge: React.FC<InsightPriorityBadgeProps> = ({
  priority,
  className,
}) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Informational

  return (
    <span
      aria-label={`Priority: ${config.label}`}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border select-none transition-colors',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span>{config.label}</span>
    </span>
  )
}
