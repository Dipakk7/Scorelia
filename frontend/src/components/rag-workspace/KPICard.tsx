import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { MoreVertical } from 'lucide-react'
import { CountUpText } from '@/components/ui/CountUpText'
import { KPITrend } from './KPITrend'
import { cn } from '@/lib/utils'

export interface KPICardProps {
  title: string
  numericValue?: number
  stringValue?: string
  decimals?: number
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral' | 'badge'
  badgeText?: string
  subtext?: string
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  className?: string
}

export function KPICard({
  title,
  numericValue,
  stringValue,
  decimals = 0,
  trend,
  trendType = 'positive',
  badgeText,
  subtext,
  icon: Icon,
  iconBgColor = 'bg-purple-500/10 border-purple-500/20',
  iconColor = 'text-purple-400',
  className
}: KPICardProps) {
  return (
    <div
      className={cn(
        'group relative p-4 rounded-2xl bg-[#0e0f1a]/90 border border-white/10 hover:border-white/20 transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between overflow-hidden text-left min-h-[120px]',
        className
      )}
    >
      {/* Subtle Glow Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors pointer-events-none" />

      {/* Top Row: Icon + Overflow Menu Placeholder */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className={cn('p-2 rounded-xl border flex items-center justify-center shrink-0', iconBgColor)}>
          <Icon size={17} className={iconColor} aria-hidden="true" />
        </div>
        <button
          type="button"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-500/50"
          aria-label={`Options for ${title}`}
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Middle Row: Metric Label & Large Animated Numeric Value */}
      <div className="space-y-0.5 my-1">
        <span className="text-xs font-medium text-slate-400 block truncate tracking-tight">
          {title}
        </span>
        <div className="text-2xl font-black tracking-tight text-white font-sans">
          {numericValue !== undefined ? (
            <CountUpText
              value={numericValue}
              decimals={decimals}
              duration={650}
              formatter={(val) =>
                decimals > 0
                  ? val.toFixed(decimals)
                  : Math.round(val).toLocaleString()
              }
            />
          ) : (
            stringValue || '0'
          )}
        </div>
      </div>

      {/* Bottom Row: Reusable Trend Indicator */}
      <div className="mt-1 pt-1 flex items-center justify-between">
        <KPITrend
          trend={trend}
          trendType={trendType}
          badgeText={badgeText}
          subtext={subtext}
        />
      </div>
    </div>
  )
}

export default KPICard
