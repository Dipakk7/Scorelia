import React from 'react'
import { cn } from '@/lib/utils'

export interface KPIProgressProps {
  current: number
  total: number
  percentage?: number
  label?: string
  className?: string
  barColorClass?: string
}

export function KPIProgress({
  current,
  total,
  percentage = 78,
  label = 'Monthly limit',
  className,
  barColorClass = 'bg-purple-500',
}: KPIProgressProps) {
  const calculatedPercent = Math.min(100, Math.max(0, percentage))

  return (
    <div className={cn('w-full space-y-1.5 text-left', className)}>
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span>{label}</span>
        <span className="text-slate-300 font-mono">{calculatedPercent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={calculatedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress: ${calculatedPercent}% of ${total}`}
        className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-700 ease-out', barColorClass)}
          style={{ width: `${calculatedPercent}%` }}
        />
      </div>
    </div>
  )
}

export default KPIProgress
