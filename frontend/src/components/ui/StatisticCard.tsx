import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

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
  cta?: {
    text: string
    to?: string
    onClick?: () => void
  }
  zeroStateText?: string
  metricType?: 'number' | 'percentage'
  accentColor?: 'teal' | 'blue' | 'purple' | 'emerald'
}

export function StatisticCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  cta,
  zeroStateText,
  metricType = 'number',
  accentColor = 'teal',
}: StatisticCardProps) {
  // Determine if it should render as a zero state
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const isZero = zeroStateText && (isNaN(numericValue) || numericValue === 0)

  // Theme color maps for active cards
  const themeMap = {
    teal: {
      shadow: 'shadow-[0_4px_20px_rgba(15,157,154,0.04)] hover:shadow-[0_10px_25px_rgba(15,157,154,0.1)]',
      border: 'hover:border-brand-500/30 dark:hover:border-brand-500/20',
      iconBg: 'bg-brand-500/8 text-brand-600 dark:text-brand-400 border-brand-500/12',
      barBg: 'bg-brand-500',
    },
    blue: {
      shadow: 'shadow-[0_4px_20px_rgba(0,210,255,0.04)] hover:shadow-[0_10px_25px_rgba(0,210,255,0.1)]',
      border: 'hover:border-accent-blue/30 dark:hover:border-accent-blue/20',
      iconBg: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
      barBg: 'bg-accent-blue',
    },
    purple: {
      shadow: 'shadow-[0_4px_20px_rgba(170,59,255,0.04)] hover:shadow-[0_10px_25px_rgba(170,59,255,0.1)]',
      border: 'hover:border-accent-purple/30 dark:hover:border-accent-purple/20',
      iconBg: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
      barBg: 'bg-accent-purple',
    },
    emerald: {
      shadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.04)] hover:shadow-[0_10px_25px_rgba(16,185,129,0.1)]',
      border: 'hover:border-emerald-500/30 dark:hover:border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      barBg: 'bg-emerald-500',
    },
  }

  const activeTheme = themeMap[accentColor] || themeMap.teal

  // Helper to compute ATS classification
  const getAtsStatus = (val: number) => {
    if (val <= 0) return ''
    if (val < 30) return 'Beginner'
    if (val < 50) return 'Above Beginner'
    if (val < 70) return 'Intermediate'
    if (val < 85) return 'Advanced'
    return 'Expert'
  }

  if (isZero) {
    return (
      <Card
        className={cn(
          'overflow-hidden relative border-dashed border-2 border-slate-200/80 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 transition-all hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-xs group rounded-2xl',
          className
        )}
      >
        <CardContent className="p-5 flex flex-col justify-between h-full min-h-[148px]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 text-left">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {title}
              </p>
              <h4 className="text-sm font-bold text-slate-600 dark:text-slate-350 mt-1.5 font-sans leading-snug">
                {zeroStateText}
              </h4>
            </div>
            <div className="p-2.5 bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500 rounded-xl border border-slate-200/30 dark:border-slate-750/30 shrink-0">
              <Icon size={20} className="stroke-[1.5]" />
            </div>
          </div>

          {cta && (
            <div className="mt-4 text-left">
              {cta.onClick ? (
                <button
                  type="button"
                  onClick={cta.onClick}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors group/cta cursor-pointer bg-transparent border-none p-0"
                >
                  <span>{cta.text}</span>
                  <ArrowRight size={12} className="group-hover/cta:translate-x-1 transition-transform" />
                </button>
              ) : (
                <Link
                  to={cta.to || '#'}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-500 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400 transition-colors group/cta"
                >
                  <span>{cta.text}</span>
                  <ArrowRight size={12} className="group-hover/cta:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const displayValue = metricType === 'percentage' ? `${Math.round(numericValue)}%` : value

  const showAtsStatus = title === 'Avg ATS Score' && numericValue > 0
  const statusLabel = showAtsStatus ? getAtsStatus(numericValue) : ''

  return (
    <Card
      className={cn(
        'overflow-hidden relative border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:border-slate-350 dark:hover:border-slate-700 group rounded-2xl',
        activeTheme.shadow,
        activeTheme.border,
        className
      )}
    >
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 text-left">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {title}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-3xl md:text-3.5xl font-black font-display text-slate-950 dark:text-slate-50 tracking-tight leading-none">
                {displayValue}
              </h3>
              {showAtsStatus && statusLabel && (
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/10">
                  {statusLabel}
                </span>
              )}
            </div>
          </div>
          <div className={cn('p-2.5 rounded-xl border shadow-xs transition-all duration-300 group-hover:scale-105 shrink-0', activeTheme.iconBg)}>
            <Icon size={20} className="stroke-[1.75]" />
          </div>
        </div>

        {metricType === 'percentage' && (
          <div className="mt-4 space-y-1.5 text-left">
            <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Completion Progress</span>
              <span>{Math.round(numericValue)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500 ease-out', activeTheme.barBg)}
                style={{ width: `${Math.min(100, Math.max(0, numericValue))}%` }}
              />
            </div>
          </div>
        )}

        {metricType !== 'percentage' && (description || trend) && (
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-left">
            {trend && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5',
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
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

