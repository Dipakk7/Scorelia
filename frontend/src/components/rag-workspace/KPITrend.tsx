import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface KPITrendProps {
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral' | 'badge'
  badgeText?: string
  subtext?: string
  className?: string
}

export function KPITrend({
  trend,
  trendType = 'positive',
  badgeText,
  subtext,
  className
}: KPITrendProps) {
  if (badgeText) {
    return (
      <div
        className={cn(
          'px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold shrink-0',
          className
        )}
      >
        {badgeText}
      </div>
    )
  }

  if (subtext) {
    return (
      <div
        className={cn(
          'text-[11px] font-medium text-slate-400 shrink-0 font-mono',
          className
        )}
      >
        {subtext}
      </div>
    )
  }

  if (!trend) return null

  const isPositive = trendType === 'positive'
  const isNegative = trendType === 'negative'

  return (
    <div
      className={cn(
        'text-[11px] font-bold flex items-center gap-1 font-mono shrink-0',
        isPositive && 'text-emerald-400',
        isNegative && 'text-pink-400',
        trendType === 'neutral' && 'text-slate-400',
        className
      )}
    >
      {isPositive && <TrendingUp size={12} className="shrink-0" />}
      {isNegative && <TrendingDown size={12} className="shrink-0" />}
      <span>{trend}</span>
    </div>
  )
}

export default KPITrend
