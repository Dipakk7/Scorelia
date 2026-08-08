import React, { memo } from 'react'
import { CountUpText } from '@/components/ui/CountUpText'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { KPITrend } from './KPITrend'
import type { TrendDirection } from './KPITrend'
import { KPIProgress } from './KPIProgress'
import { cn } from '@/lib/utils'

export interface AgentKPICardProps {
  id: string
  title: string
  numericValue: number
  prefix?: string
  suffix?: string
  decimals?: number
  subtitle?: string
  trendValue?: string
  trendDirection?: TrendDirection
  icon: React.ComponentType<{ size?: number; className?: string }>
  iconBgClass: string
  iconColorClass: string
  isHighlighted?: boolean
  isSelected?: boolean
  onClick?: () => void
  progressProps?: {
    current: number
    total: number
    percentage: number
  }
  className?: string
}

function AgentKPICardComponent({
  id,
  title,
  numericValue,
  prefix = '',
  suffix = '',
  decimals = 0,
  subtitle,
  trendValue,
  trendDirection = 'up',
  icon: Icon,
  iconBgClass,
  iconColorClass,
  isHighlighted = false,
  isSelected = false,
  onClick,
  progressProps,
  className,
}: AgentKPICardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const formattedCountText = (
    <CountUpText
      value={numericValue}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      duration={shouldReduceMotion ? 0 : 800}
    />
  )

  const activeSelected = isSelected || isHighlighted

  return (
    <div
      id={`kpi-card-${id}`}
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      aria-pressed={onClick ? activeSelected : undefined}
      aria-selected={onClick ? activeSelected : undefined}
      onClick={onClick}
      className={cn(
        'group relative p-3.5 sm:p-4 rounded-xl bg-[#111322] transition-all duration-200 flex flex-col justify-between overflow-hidden text-left select-none space-y-2.5',
        'hover:bg-[#151728] hover:border-purple-500/40 hover:-translate-y-0.5',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
        onClick && 'cursor-pointer',
        activeSelected
          ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border border-white/10 shadow-lg',
        className
      )}
    >
      {/* Background Accent Glow */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40',
          iconBgClass
        )}
      />

      <div className="space-y-2 relative z-10">
        {/* Card Header Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-tight pr-1 truncate">
            {title}
          </span>
          <div
            className={cn(
              'p-2 rounded-lg border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0',
              iconBgClass,
              iconColorClass
            )}
          >
            <Icon size={16} />
          </div>
        </div>

        {/* Numeric Counter */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            {formattedCountText}
          </span>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[11px] text-slate-300 font-medium truncate">{subtitle}</p>
        )}

        {/* Progress Bar */}
        {progressProps && (
          <div className="pt-0.5">
            <KPIProgress
              current={progressProps.current}
              total={progressProps.total}
              percentage={progressProps.percentage}
            />
          </div>
        )}
      </div>

      {/* Card Footer Trend Badge */}
      {trendValue && (
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
          <KPITrend value={trendValue} direction={trendDirection} />
          <span className="text-[10px] text-slate-500 font-mono font-medium">vs prev 7d</span>
        </div>
      )}
    </div>
  )
}

export function AgentKPICardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-[#111322] border border-white/10 space-y-3 animate-pulse text-left',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-3 w-20 bg-slate-800 rounded-md" />
        <div className="h-8 w-8 bg-slate-800 rounded-xl" />
      </div>
      <div className="h-8 w-24 bg-slate-800 rounded-lg" />
      <div className="h-3 w-32 bg-slate-800/60 rounded-md" />
    </div>
  )
}

export const AgentKPICard = memo(AgentKPICardComponent)
export default AgentKPICard
