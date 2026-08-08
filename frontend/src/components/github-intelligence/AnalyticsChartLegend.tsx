import React from 'react'
import { cn } from '@/lib/utils'

export interface LegendItem {
  label: string
  color: string
  value?: string | number
}

export interface AnalyticsChartLegendProps {
  items?: LegendItem[]
  variant?: 'types' | 'heatmap' | 'languages'
  className?: string
}

export const AnalyticsChartLegend: React.FC<AnalyticsChartLegendProps> = ({
  items,
  variant = 'types',
  className,
}) => {
  if (variant === 'heatmap') {
    return (
      <div className={cn('flex items-center gap-2 text-[10px] text-slate-400 select-none font-mono', className)}>
        <span>Less</span>
        <div className="flex gap-1.5 items-center">
          <span className="h-3 w-3 rounded-[3px] bg-emerald-950/40 border border-emerald-900/40" title="0 contributions" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-800/60 border border-emerald-700/50" title="1-3 contributions" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-600 border border-emerald-500" title="4-8 contributions" />
          <span className="h-3 w-3 rounded-[3px] bg-emerald-400 border border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.4)]" title="9+ contributions" />
        </div>
        <span>More</span>
      </div>
    )
  }

  if (!items || items.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 text-xs select-none font-sans', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
          <span className="text-slate-300 font-medium text-[11px]">{item.label}</span>
          {item.value !== undefined && (
            <span className="text-white font-bold text-[11px] font-mono">{item.value}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default AnalyticsChartLegend
