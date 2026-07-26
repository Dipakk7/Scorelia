import React from 'react'
import type { PerformanceStatusType } from '@/data/analyticsPerformanceMockData'

interface PerformanceStatusBadgeProps {
  status: PerformanceStatusType
  label?: string
  className?: string
}

export function PerformanceStatusBadge({
  status,
  label,
  className = '',
}: PerformanceStatusBadgeProps) {
  const statusConfig = {
    healthy: {
      text: label || 'Healthy',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      dot: 'bg-emerald-400',
    },
    warning: {
      text: label || 'Warning',
      bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      dot: 'bg-amber-400',
    },
    critical: {
      text: label || 'Critical',
      bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      dot: 'bg-rose-400',
    },
    offline: {
      text: label || 'Offline',
      bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
      dot: 'bg-slate-400',
    },
  }

  const current = statusConfig[status] || statusConfig.healthy

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold font-mono ${current.bg} ${className}`}
      aria-label={`Status: ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${current.dot}`} aria-hidden="true" />
      <span>{current.text}</span>
    </span>
  )
}

export default PerformanceStatusBadge
