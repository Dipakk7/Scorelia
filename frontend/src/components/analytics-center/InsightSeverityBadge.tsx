import React from 'react'
import type { InsightSeverityType } from '@/data/analyticsInsightsMockData'

interface InsightSeverityBadgeProps {
  severity: InsightSeverityType
  label?: string
  className?: string
}

export function InsightSeverityBadge({
  severity,
  label,
  className = '',
}: InsightSeverityBadgeProps) {
  const badgeConfig = {
    critical: {
      text: label || 'Watch',
      bg: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
      dot: 'bg-amber-400',
    },
    high: {
      text: label || 'High',
      bg: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
      dot: 'bg-emerald-400',
    },
    medium: {
      text: label || 'Medium',
      bg: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
      dot: 'bg-purple-400',
    },
    low: {
      text: label || 'Good',
      bg: 'bg-teal-500/20 border-teal-500/30 text-teal-400',
      dot: 'bg-teal-400',
    },
    info: {
      text: label || 'Info',
      bg: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      dot: 'bg-blue-400',
    },
  }

  const current = badgeConfig[severity] || badgeConfig.info

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold font-mono ${current.bg} ${className}`}
      aria-label={`Severity: ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${current.dot}`} aria-hidden="true" />
      <span>{current.text}</span>
    </span>
  )
}

export default InsightSeverityBadge
