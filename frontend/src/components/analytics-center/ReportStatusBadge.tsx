import React from 'react'
import type { ReportStatusType } from '@/data/analyticsReportsMockData'

interface ReportStatusBadgeProps {
  status: ReportStatusType
  label?: string
  className?: string
}

export function ReportStatusBadge({ status, label, className = '' }: ReportStatusBadgeProps) {
  const statusMap = {
    completed: { text: label || 'Completed', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', dot: 'bg-emerald-400' },
    running: { text: label || 'Generating', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400', dot: 'bg-blue-400' },
    queued: { text: label || 'Scheduled', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', dot: 'bg-amber-400' },
    failed: { text: label || 'Failed', bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400', dot: 'bg-rose-400' },
    cancelled: { text: label || 'Disabled', bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400', dot: 'bg-slate-400' },
  }

  const current = statusMap[status] || statusMap.completed

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold font-mono ${current.bg} ${className}`}
      aria-label={`Report Status: ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${current.dot}`} aria-hidden="true" />
      <span>{current.text}</span>
    </span>
  )
}

export default ReportStatusBadge
