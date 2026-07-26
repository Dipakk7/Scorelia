import React from 'react'
import type { ActivityStatusType } from '@/data/analyticsInsightsMockData'

interface ActivityStatusBadgeProps {
  status: ActivityStatusType
  className?: string
}

export function ActivityStatusBadge({ status, className = '' }: ActivityStatusBadgeProps) {
  const statusMap = {
    completed: { text: 'Done', bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
    running: { text: 'Running', bg: 'bg-blue-500/10 border-blue-500/20 text-blue-400 animate-pulse' },
    queued: { text: 'Queued', bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    failed: { text: 'Failed', bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
    cancelled: { text: 'Cancelled', bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400' },
  }

  const current = statusMap[status] || statusMap.completed

  return (
    <span
      className={`px-2 py-0.5 rounded-full border text-[9px] font-bold font-mono ${current.bg} ${className}`}
      aria-label={`Activity Status: ${current.text}`}
    >
      {current.text}
    </span>
  )
}

export default ActivityStatusBadge
