import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CountUpText } from '@/components/ui/CountUpText'

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
  animate?: boolean
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
  animate = false,
}: StatisticCardProps) {
  // Determine if it should render as a zero state
  const numericValue = typeof value === 'string' ? parseFloat(value) : value
  const isZero = zeroStateText && (isNaN(numericValue) || numericValue === 0)

  // Theme color maps for active cards with premium subtle gradients & shadows
  const themeMap = {
    teal: {
      shadow: 'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      border: 'hover:border-[var(--primary)]/40',
      iconBg: 'bg-[var(--primary)]/8 text-[var(--primary)] border-[var(--primary)]/12',
      barBg: 'bg-[var(--primary)]',
    },
    blue: {
      shadow: 'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      border: 'hover:border-[var(--primary)]/40',
      iconBg: 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20',
      barBg: 'bg-[var(--primary)]',
    },
    purple: {
      shadow: 'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      border: 'hover:border-[var(--analytics)]/40',
      iconBg: 'bg-[var(--analytics)]/10 text-[var(--analytics)] border-[var(--analytics)]/20',
      barBg: 'bg-[var(--analytics)]',
    },
    emerald: {
      shadow: 'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      border: 'hover:border-[var(--career)]/40',
      iconBg: 'bg-[var(--career)]/10 text-[var(--career)] border-[var(--career)]/20',
      barBg: 'bg-[var(--career)]',
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
          'overflow-hidden relative border-dashed border-2 border-[var(--border)]/80 bg-[var(--surface-hover)]/10 hover:bg-[var(--surface-hover)]/30 hover:border-[var(--primary)]/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] group rounded-[var(--radius-card)]',
          className
        )}
      >
        <CardContent className="p-5 flex flex-col justify-between h-full min-h-[148px]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 text-left">
              <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)] font-mono">
                {title}
              </p>
              <h4 className="text-xs font-bold text-[var(--muted)] mt-1 font-sans leading-snug">
                {zeroStateText}
              </h4>
            </div>
            <div className="p-2.5 bg-[var(--divider)] text-[var(--muted)] rounded-[var(--radius-md)] border border-[var(--border)]/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Icon size={18} className="stroke-[1.75]" />
            </div>
          </div>

          {cta && (
            <div className="mt-4 text-left">
              {cta.onClick ? (
                <button
                  type="button"
                  onClick={cta.onClick}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-[var(--muted)] hover:text-[var(--primary)] transition-colors uppercase tracking-wider group/cta cursor-pointer bg-transparent border-none p-0 font-mono"
                >
                  <span>{cta.text}</span>
                  <ArrowRight size={12} className="group-hover/cta:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <Link
                  to={cta.to || '#'}
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-[var(--muted)] hover:text-[var(--primary)] transition-colors uppercase tracking-wider group/cta font-mono"
                >
                  <span>{cta.text}</span>
                  <ArrowRight size={12} className="group-hover/cta:translate-x-1 transition-transform duration-200" />
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const displayValue = metricType === 'percentage' ? `${Math.round(numericValue)}%` : value

  const isAtsTitle = title === 'Avg ATS Score' || title === 'Avg. ATS Score' || title === 'Average ATS Score'
  const showAtsStatus = isAtsTitle && numericValue > 0
  const statusLabel = showAtsStatus ? getAtsStatus(numericValue) : ''

  return (
    <Card
      className={cn(
        'overflow-hidden relative border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 group rounded-[var(--radius-card)]',
        activeTheme.shadow,
        activeTheme.border,
        className
      )}
    >
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 text-left">
            <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)] font-mono">
              {title}
            </p>
            <div className="flex items-center gap-2 flex-wrap mt-1">
              <h3 className="text-3xl md:text-3.5xl font-black font-mono text-[var(--heading)] tracking-tight leading-none">
                {animate && !isNaN(numericValue) ? (
                  <CountUpText value={numericValue} suffix={metricType === 'percentage' ? '%' : ''} />
                ) : (
                  displayValue
                )}
              </h3>
              {showAtsStatus && statusLabel && (
                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/10">
                  {statusLabel}
                </span>
              )}
            </div>
          </div>
          <div className={cn('p-2.5 rounded-[var(--radius-md)] border shadow-[var(--shadow-sm)] transition-all duration-200 group-hover:scale-105 shrink-0', activeTheme.iconBg)}>
            <Icon size={18} className="stroke-[1.75]" />
          </div>
        </div>

        {metricType === 'percentage' && (
          <div className="mt-4 space-y-1.5 text-left">
            <div className="flex justify-between items-center text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)]">
              <span>Completion Progress</span>
              <span>{Math.round(numericValue)}%</span>
            </div>
            <div className="w-full bg-[var(--divider)] rounded-full h-1.5 overflow-hidden relative">
              <div
                className={cn('h-full rounded-full progress-fill progress-shimmer', activeTheme.barBg)}
                style={{ transform: `scaleX(${Math.min(100, Math.max(0, numericValue)) / 100})` }}
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
                    ? 'bg-[var(--success)]/10 text-[var(--success)]'
                    : 'bg-[var(--danger)]/10 text-[var(--danger)]'
                )}
              >
                {trend.isPositive ? '+' : '-'}
                {trend.value}%
              </span>
            )}
            {description && (
              <span className="text-[var(--muted)] text-[11px] font-medium">
                {description}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

