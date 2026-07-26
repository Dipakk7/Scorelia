import React from 'react'
import { cn } from '@/lib/utils'

export interface WorkspaceHeaderProps {
  totalCount: number
  activeCount: number
  pausedCount: number
  className?: string
}

export function WorkspaceHeader({
  totalCount,
  activeCount,
  pausedCount,
  className,
}: WorkspaceHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left', className)}>
      <div>
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5">
          <span>Your Agents</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-mono font-bold">
            {totalCount} Total
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Manage, monitor, and configure all AI agents from one workspace.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{activeCount} Active</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0c14] border border-white/10">
          <span className="h-2 w-2 rounded-full bg-slate-400" />
          <span>{pausedCount} Paused</span>
        </span>
      </div>
    </div>
  )
}

export default WorkspaceHeader
