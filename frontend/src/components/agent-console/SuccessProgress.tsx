import React from 'react'
import { cn } from '@/lib/utils'

export interface SuccessProgressProps {
  rate: number | null
  className?: string
}

export function SuccessProgress({ rate, className }: SuccessProgressProps) {
  if (rate === null || rate === undefined || rate === 0) {
    return <span className="text-slate-500 text-xs font-mono">—</span>
  }

  const isHigh = rate >= 90
  const isMedium = rate >= 80

  const barColor = isHigh ? 'bg-emerald-400' : isMedium ? 'bg-amber-400' : 'bg-rose-400'

  return (
    <div className={cn('space-y-1 w-full max-w-[130px]', className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-200">{rate}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={rate}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Success Rate: ${rate}%`}
        className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden"
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  )
}

export default SuccessProgress
