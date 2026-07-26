import React from 'react'
import type { AgentStatus } from '@/data/agentConsoleMockData'
import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  status: AgentStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case 'active':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      )
    case 'running':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-semibold border border-purple-500/20 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-ping" />
          Running
        </span>
      )
    case 'paused':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[11px] font-semibold border border-slate-500/20 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Paused
        </span>
      )
    case 'offline':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-500 text-[11px] font-semibold border border-slate-700/40 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          Offline
        </span>
      )
    case 'error':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[11px] font-semibold border border-rose-500/20 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          Error
        </span>
      )
    case 'queued':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-semibold border border-amber-500/20 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Queued
        </span>
      )
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 text-[11px] font-semibold border border-slate-500/20 select-none',
            className
          )}
        >
          {status}
        </span>
      )
  }
}

export default StatusBadge
