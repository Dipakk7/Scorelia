import React from 'react'
import { cn } from '@/lib/utils'

export interface SystemStatusCardProps {
  className?: string
  statusText?: string
  subtext?: string
}

export function SystemStatusCard({
  className,
  statusText = 'System Status',
  subtext = 'All Systems Operational'
}: SystemStatusCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#121320]/90 border border-white/10 text-slate-300 text-xs shadow-inner select-none',
        className
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{statusText}</span>
        <span className="text-xs font-semibold text-slate-200">{subtext}</span>
      </div>
    </div>
  )
}

export default SystemStatusCard
