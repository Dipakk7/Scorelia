import React from 'react'
import type { ConfidenceLevel } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface AIConfidenceBadgeProps {
  confidence?: number
  level?: ConfidenceLevel
  className?: string
}

export const AIConfidenceBadge: React.FC<AIConfidenceBadgeProps> = ({
  confidence = 94,
  level = 'High',
  className,
}) => {
  const getLevel = (score: number): ConfidenceLevel => {
    if (score >= 90) return 'High'
    if (score >= 70) return 'Medium'
    return 'Low'
  }

  const activeLevel = level || getLevel(confidence)

  const config = {
    High: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    Medium: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
    Low: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  }[activeLevel]

  return (
    <span
      title={`AI Confidence Level: ${confidence}% (${activeLevel})`}
      aria-label={`AI Confidence: ${confidence}% ${activeLevel}`}
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-mono font-bold rounded-md border select-none transition-colors',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span>{confidence}% AI Confidence</span>
    </span>
  )
}

export default AIConfidenceBadge
