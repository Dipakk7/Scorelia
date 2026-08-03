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
      className="relative overflow-hidden rounded-xl bg-slate-900/90 border border-slate-800/90 p-4 transition-all duration-200 hover:bg-[#16182c] hover:border-purple-500/40 active:bg-[#121424] active:border-purple-500/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e] hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-0.5 flex flex-col justify-between space-y-3 cursor-pointer group select-none"
    >
      {/* Header: Icon & Status Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
            <IconComponent className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </h4>
        </div>

        <span
          className={cn(
            'text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border',
            isExcellent
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : isWarning
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
          )}
        >
          {status}
        </span>
      </div>

      {/* Score & Visual Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              {score}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ {maxScore}</span>
          </div>

          {trend && (
            <span className="flex items-center gap-0.5 text-[11px] font-mono text-emerald-400 font-medium">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>

        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
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

      {/* Footer Description */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
        <span className="truncate max-w-[200px]">{description}</span>
        <button
          type="button"
          aria-label={`View details for ${title}`}
          className="inline-flex items-center gap-0.5 text-purple-400 group-hover:text-purple-300 font-medium"
        >
          <span>View</span>
          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}
