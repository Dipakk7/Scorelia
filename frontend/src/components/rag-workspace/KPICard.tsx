import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { MoreVertical } from 'lucide-react'
import { CountUpText } from '@/components/ui/CountUpText'
import { KPITrend } from './KPITrend'
import { cn } from '@/lib/utils'

export interface KPICardProps {
  id?: string
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
  isSelected?: boolean
  onClick?: () => void
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
  iconBgColor = 'bg-purple-500/15 border-purple-500/30 shadow-inner',
  iconColor = 'text-purple-300',
  isSelected = false,
  onClick,
  className
}: KPICardProps) {
  return (
    <div
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? isSelected : undefined}
      aria-selected={onClick ? isSelected : undefined}
      onClick={onClick}
      className={cn(
        'group relative p-4 sm:p-4.5 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border transition-all duration-200 flex flex-col justify-between overflow-hidden text-left h-full min-h-[120px] select-none shadow-md',
        'hover:bg-slate-900 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5',
        'active:scale-[0.98]',
        onClick && 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
        isSelected
          ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border-slate-800/90',
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
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 border-none bg-transparent cursor-pointer"
          aria-label={`Options for ${title}`}
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {/* Middle Row: Metric Label & Large Animated Numeric Value */}
      <div className="space-y-0.5 my-1">
        <span className="text-xs font-bold text-slate-300 block truncate tracking-tight">
          {title}
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
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

