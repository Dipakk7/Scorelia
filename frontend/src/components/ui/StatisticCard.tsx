import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatisticCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ size?: number; className?: string }>
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatisticCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
}: StatisticCardProps) {
  return (
    <Card className={cn('overflow-hidden relative border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md transition-all hover:shadow-lg hover:border-slate-350 dark:hover:border-slate-700 group', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <h3 className="text-3xl font-extrabold font-display text-slate-950 dark:text-slate-50">
              {value}
            </h3>
          </div>
          <div className="p-3 bg-brand-500/8 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/12 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-brand-500/15">
            <Icon size={24} className="transition-transform duration-300" />
          </div>
        </div>

        {(description || trend) && (
          <div className="mt-4 flex items-center gap-2 text-xs font-medium">
            {trend && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-bold flex items-center',
                  trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                )}
              >
                {trend.isPositive ? '+' : '-'}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-slate-500 dark:text-slate-400">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
