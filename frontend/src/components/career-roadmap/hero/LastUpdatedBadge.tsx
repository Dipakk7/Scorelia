import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LastUpdatedBadgeProps {
  timestamp?: string
  className?: string
}

export function LastUpdatedBadge({
  timestamp = '2 days ago',
  className,
}: LastUpdatedBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 select-none',
        className
      )}
      aria-label={`Last updated: ${timestamp}`}
    >
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
      <span>Last updated: {timestamp}</span>
    </div>
  )
}
export default LastUpdatedBadge
