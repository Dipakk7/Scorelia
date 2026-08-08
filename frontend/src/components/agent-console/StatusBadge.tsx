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
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 select-none shadow-sm',
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
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-200 text-[11px] font-bold border border-purple-500/30 select-none shadow-sm',
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
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-300 text-[11px] font-bold border border-slate-500/30 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
          Paused
        </span>
      )
    case 'offline':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/90 text-slate-400 text-[11px] font-bold border border-slate-700/50 select-none',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Offline
        </span>
      )
    case 'error':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 text-[11px] font-bold border border-rose-500/30 select-none shadow-sm',
            className
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          Error
        </span>
      )
    case 'queued':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px] font-bold border border-amber-500/30 select-none shadow-sm',
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
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-300 text-[11px] font-bold border border-slate-500/30 select-none',
            className
          )}
        >
          {status}
        </span>
      )
  }
}

export default StatusBadge
