import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TrendDirection = 'up' | 'down' | 'neutral'

export interface KPITrendProps {
  value: string
  direction?: TrendDirection
  className?: string
}

export function KPITrend({ value, direction = 'up', className }: KPITrendProps) {
  const isUp = direction === 'up'
  const isDown = direction === 'down'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-semibold transition-opacity duration-300',
        isUp ? 'text-emerald-400' : isDown ? 'text-amber-400' : 'text-slate-400',
        className
      )}
    >
      {isUp && <TrendingUp size={13} className="stroke-[2.5]" />}
      {isDown && <TrendingDown size={13} className="stroke-[2.5]" />}
      {!isUp && !isDown && <Minus size={13} className="stroke-[2.5]" />}
      <span>{value}</span>
    </span>
  )
}

export default KPITrend
