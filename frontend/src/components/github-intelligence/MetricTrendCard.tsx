import React from 'react'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { GitHubSparkline } from './GitHubSparkline'
import { cn } from '@/lib/utils'

export interface MetricTrendCardProps {
  title: string
  value: string | number
  trend: string
  trendDirection?: 'up' | 'down' | 'neutral'
  comparisonLabel?: string
  sparklineData?: number[]
  statusColor?: string
  icon?: React.ElementType
  className?: string
}

export const MetricTrendCard: React.FC<MetricTrendCardProps> = ({
  title,
  value,
  trend,
  trendDirection = 'up',
  comparisonLabel = 'vs last 30 days',
  sparklineData = [10, 12, 14, 13, 16, 18, 20],
  statusColor = '#a855f7',
  icon: Icon,
  className,
}) => {
  const isUp = trendDirection === 'up' || trend.startsWith('+')
  const isDown = trendDirection === 'down' || trend.startsWith('-')

  return (
    <div
      tabIndex={0}
      className={cn(
        'group p-4 rounded-2xl border border-white/10 bg-[#121426]/90 backdrop-blur-md shadow-sm',
        'hover:border-purple-500/40 hover:bg-[#15172a] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 text-left font-sans select-none flex flex-col justify-between space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-300 truncate group-hover:text-white transition-colors">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 sm:p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <Icon size={15} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight leading-none">
            {value}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold font-mono rounded-md border shrink-0',
              isUp
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : isDown
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700/60'
            )}
          >
            {isUp ? <ArrowUpRight size={10} /> : isDown ? <ArrowDownRight size={10} /> : <Minus size={10} />}
            {trend}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium truncate font-sans">{comparisonLabel}</div>
      </div>

      {sparklineData && (
        <div className="pt-1">
          <GitHubSparkline data={sparklineData} color={statusColor} height={28} />
        </div>
      )}
    </div>
  )
}

export default MetricTrendCard
