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

  return (
    <div
      id={`kpi-card-${id}`}
      tabIndex={0}
      className={cn(
        'group relative p-4 sm:p-5 rounded-2xl bg-[#111322] border transition-all duration-300 shadow-xl flex flex-col justify-between overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
        isHighlighted
          ? 'border-purple-500/50 shadow-purple-950/40 bg-gradient-to-b from-[#15172b] to-[#111322]'
          : 'border-white/10 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-2xl',
        className
      )}
    >
      {/* Background Accent Glow */}
      <div
        className={cn(
          'absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity group-hover:opacity-40',
          iconBgClass
        )}
      />

      <div className="space-y-3 relative z-10">
        {/* Card Header Row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
            {title}
          </span>
          <div
            className={cn(
              'p-2.5 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0',
              iconBgClass,
              iconColorClass
            )}
          >
            <Icon size={18} />
          </div>
        </div>

        {/* Numeric Counter */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            {formattedCountText}
          </span>
        </div>

        {/* Subtitle or Progress Bar */}
        {subtitle && !progressProps && (
          <p className="text-[11px] text-slate-400 font-medium truncate">{subtitle}</p>
        )}

        {progressProps && (
          <div className="pt-1">
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
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs relative z-10">
          <KPITrend value={trendValue} direction={trendDirection} />
          <span className="text-[10px] text-slate-500 font-mono font-medium">vs prev 30d</span>
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
