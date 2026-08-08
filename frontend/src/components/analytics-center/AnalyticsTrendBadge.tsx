import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { KPITrendType } from '@/data/analyticsHeroMockData'

interface AnalyticsTrendBadgeProps {
  trend: KPITrendType
  percentageChange: number
  isAbsoluteNumber?: boolean
  className?: string
}

export function AnalyticsTrendBadge({
  trend,
  percentageChange,
  isAbsoluteNumber = false,
  className = '',
}: AnalyticsTrendBadgeProps) {
  const isPositive = trend === 'positive'
  const isNegative = trend === 'negative'

  const formattedText = isAbsoluteNumber
    ? `${isPositive ? '+' : isNegative ? '-' : ''}${Math.abs(percentageChange)} pts`
    : `${isPositive ? '+' : isNegative ? '-' : ''}${Math.abs(percentageChange)}%`

  const accessibleText = `${isPositive ? 'Increased by' : isNegative ? 'Decreased by' : 'Changed by'} ${Math.abs(percentageChange)}${isAbsoluteNumber ? ' points' : ' percent'}`

  const colorStyles = isPositive
    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : isNegative
    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    : 'text-slate-400 bg-slate-500/10 border-slate-500/20'

  const IconComponent = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold font-mono border leading-none transition-colors ${colorStyles} ${className}`}
      aria-label={accessibleText}
      title={accessibleText}
    >
      <IconComponent size={11} className="shrink-0 stroke-[2.5]" aria-hidden="true" />
      <span>{formattedText}</span>
    </span>
  )
}

export default AnalyticsTrendBadge
