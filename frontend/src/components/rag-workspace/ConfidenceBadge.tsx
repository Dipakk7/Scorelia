import React from 'react'
import { cn } from '@/lib/utils'

export interface ConfidenceBadgeProps {
  score: number // 0.0 to 1.0
  className?: string
}

export function ConfidenceBadge({ score, className }: ConfidenceBadgeProps) {
  let label = 'High'
  let colorStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'

  if (score < 0.5) {
    label = 'Low'
    colorStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  } else if (score < 0.8) {
    label = 'Medium'
    colorStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  }

  const formattedScore = score.toFixed(2)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border select-none shadow-xs',
        colorStyle,
        className
      )}
    >
      <span>{label}</span>
      <span>({formattedScore})</span>
    </span>
  )
}

export default ConfidenceBadge
