import React from 'react'
import { motion } from 'framer-motion'
import { Users, UserCheck, CheckCircle2, Target, Clock, Star } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { KPIMetricItem } from '@/data/analyticsHeroMockData'
import { AnalyticsTrendBadge } from './AnalyticsTrendBadge'
import { AnalyticsSparkline } from './AnalyticsSparkline'

interface AnalyticsKPICardProps {
  kpi: KPIMetricItem
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

const iconMap = {
  Users,
  UserCheck,
  CheckCircle2,
  Target,
  Clock,
  Star,
}

export function AnalyticsKPICard({ kpi, isSelected = false, onClick, className = '' }: AnalyticsKPICardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const IconComponent = iconMap[kpi.iconName] || Users

  const cardMotionVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.015,
          y: -2,
          boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.4), 0 0 16px rgba(168, 85, 247, 0.15)',
        },
    tap: shouldReduceMotion ? {} : { scale: 0.98 },
  }

  const isSatisfactionScore = kpi.id === 'satisfaction_score'

  return (
    <motion.div
      variants={cardMotionVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      tabIndex={0}
      onClick={onClick}
      role="button"
      aria-pressed={isSelected}
      aria-selected={isSelected}
      aria-label={`${kpi.title}: ${kpi.value}. ${kpi.trend} change: ${kpi.percentageChange}%`}
      className={cn(
        'group relative flex flex-col justify-between p-4 rounded-2xl bg-[#0f101c] transition-all duration-200 cursor-pointer select-none min-h-[148px]',
        'hover:bg-[#15172a] hover:border-purple-500/40 hover:shadow-md',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
        isSelected
          ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border border-white/10 shadow-sm',
        className
      )}
    >
      {/* Header: Icon Pill & Title */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`p-2 rounded-xl border flex items-center justify-center shrink-0 ${kpi.iconBg}`}
        >
          <IconComponent size={18} className="stroke-[2]" aria-hidden="true" />
        </div>
        <span className={cn('text-xs font-semibold transition-colors truncate', isSelected ? 'text-purple-200 font-bold' : 'text-slate-400 group-hover:text-slate-200')}>
          {kpi.title}
        </span>
      </div>

      {/* Primary Metric */}
      <div className="my-1 text-left">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tabular-nums tracking-tight leading-none block">
          {kpi.value}
        </span>
      </div>

      {/* Footer: Trend Badge, Comparison & Sparkline */}
      <div className="flex items-end justify-between pt-2 border-t border-white/5 gap-2">
        <div className="flex flex-col text-left min-w-0">
          <AnalyticsTrendBadge
            trend={kpi.trend}
            percentageChange={kpi.percentageChange}
            isAbsoluteNumber={isSatisfactionScore}
          />
          <span className="text-[10px] font-medium text-slate-500 truncate mt-1">
            {kpi.comparisonLabel}
          </span>
        </div>

        {/* Sparkline */}
        <AnalyticsSparkline
          data={kpi.sparklineData}
          strokeColor={kpi.strokeColor}
          width={72}
          height={28}
        />
      </div>
    </motion.div>
  )
}

export default AnalyticsKPICard
