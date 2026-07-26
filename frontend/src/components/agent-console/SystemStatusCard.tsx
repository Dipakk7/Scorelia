import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils'

export interface SystemStatusCardProps {
  className?: string
  statusText?: string
  tooltipContent?: string
}

export function SystemStatusCard({
  className,
  statusText = 'All Systems Operational',
  tooltipContent = 'All core agent services are healthy.',
}: SystemStatusCardProps) {
  return (
    <Tooltip content={tooltipContent} position="top">
      <div
        className={cn(
          'flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#111322] border border-emerald-500/30 text-slate-200 text-xs font-semibold shadow-inner transition-all hover:border-emerald-500/50 cursor-pointer select-none',
          className
        )}
        role="status"
        aria-live="polite"
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-100">{statusText}</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
            Healthy
          </span>
        </div>
      </div>
    </Tooltip>
  )
}

export default SystemStatusCard
