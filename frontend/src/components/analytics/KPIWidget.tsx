import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface KPIWidgetProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ size?: number; className?: string }>
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  colorScheme?: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan'
  className?: string
}

export function KPIWidget({
  title,
  value,
  icon: Icon,
  description,
  trend,
  colorScheme = 'brand',
  className,
}: KPIWidgetProps) {
  const schemeStyles = {
    brand: {
      bg: 'bg-brand-500/10 dark:bg-brand-500/20 border-brand-500/20',
      text: 'text-brand-600 dark:text-brand-400',
      glow: 'shadow-brand-500/5',
    },
    violet: {
      bg: 'bg-violet-500/10 dark:bg-violet-500/20 border-violet-500/20',
      text: 'text-violet-600 dark:text-violet-400',
      glow: 'shadow-violet-500/5',
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      glow: 'shadow-emerald-500/5',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      glow: 'shadow-amber-500/5',
    },
    rose: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20',
      text: 'text-rose-600 dark:text-rose-400',
      glow: 'shadow-rose-500/5',
    },
    cyan: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20 border-cyan-500/20',
      text: 'text-cyan-600 dark:text-cyan-400',
      glow: 'shadow-cyan-500/5',
    },
  }

  const activeStyles = schemeStyles[colorScheme]

  return (
    <Card
      className={cn(
        'overflow-hidden border-slate-200/80 dark:border-slate-800/80 bg-card/60 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group',
        activeStyles.glow,
        className
      )}
    >
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {title}
            </span>
            <span className="text-3xl font-extrabold tracking-tight font-display text-slate-800 dark:text-slate-50 block transition-transform group-hover:scale-102 duration-300 origin-left">
              {value}
            </span>
          </div>
          <div
            className={cn(
              'p-2.5 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xs',
              activeStyles.bg,
              activeStyles.text
            )}
          >
            <Icon size={20} className="stroke-[2]" />
          </div>
        </div>

        {(description || trend) && (
          <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold">
            {trend && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-bold shadow-xs',
                  trend.isPositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10'
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight size={10} className="stroke-[3]" />
                ) : (
                  <ArrowDownRight size={10} className="stroke-[3]" />
                )}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-slate-400 dark:text-slate-400 block truncate">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
