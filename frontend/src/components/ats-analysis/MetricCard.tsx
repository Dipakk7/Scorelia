import React from 'react'
import { ArrowUpRight, TrendingUp, Layers, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MetricCardProps {
  title: string
  icon: LucideIcon
  score: number
  maxScore?: number
  status: string
  statusType?: 'excellent' | 'good' | 'warning' | 'error'
  trend?: string
  description?: string
  onClick?: () => void
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  icon: Icon,
  score,
  maxScore = 100,
  status,
  statusType = 'good',
  trend,
  description,
  onClick,
}) => {
  const IconComponent = Icon || Layers
  const isExcellent = statusType === 'excellent'
  const isWarning = statusType === 'warning'

  return (
    <div
      tabIndex={0}
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800/90 p-4.5 sm:p-5 transition-all duration-200 hover:bg-slate-900 hover:border-purple-500/40 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e] shadow-md hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 flex flex-col justify-between space-y-4 cursor-pointer group select-none h-full'
      )}
    >
      {/* Header: Icon & Status Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 group-hover:bg-purple-500/25 group-hover:border-purple-400/40 transition-colors shadow-inner shrink-0">
            <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-white transition-colors tracking-tight truncate">
            {title}
          </h4>
        </div>

        <span
          className={cn(
            'text-[10px] sm:text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-sm shrink-0',
            isExcellent
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : isWarning
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
          )}
        >
          {status}
        </span>
      </div>

      {/* Score & Visual Progress Bar */}
      <div className="space-y-2 flex-1 flex flex-col justify-center">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              {score}
            </span>
            <span className="text-xs text-slate-400 font-mono font-medium">/ {maxScore}</span>
          </div>

          {trend && (
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-sm">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              {trend}
            </span>
          )}
        </div>

        {/* Progress Track & Bar with Improved Contrast */}
        <div className="h-2 w-full bg-slate-950/80 border border-slate-800/60 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 shadow-sm',
              isExcellent
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : isWarning
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-purple-500 to-indigo-400'
            )}
            style={{ width: `${(score / maxScore) * 100}%` }}
          />
        </div>
      </div>

      {/* Footer Description & Action CTA */}
      <div className="flex items-center justify-between text-xs border-t border-slate-800/80 pt-2.5 gap-2">
        <span className="text-xs text-slate-300/90 group-hover:text-slate-200 transition-colors leading-relaxed flex-1 pr-2">
          {description}
        </span>
        <button
          type="button"
          aria-label={`View details for ${title}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors shrink-0 py-1 px-2.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 border border-purple-500/20 shadow-xs"
        >
          <span>View</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
