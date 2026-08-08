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

  // Metric Value Formatter for Dominant Display
  const renderMetricValue = () => {
    if (isSatisfactionScore && kpi.value.includes('/')) {
      const parts = kpi.value.split('/')
      return (
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tabular-nums tracking-tight leading-none block">
          {parts[0].trim()}
          <span className="text-sm font-semibold text-slate-400 font-sans ml-1">/{parts[1].trim()}</span>
        </span>
      )
    }

    return (
      <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tabular-nums tracking-tight leading-none block">
        {kpi.value}
      </span>
    )
  }

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
        'group relative flex flex-col justify-between h-full p-3.5 sm:p-4 rounded-2xl bg-[#0f101c] transition-all duration-200 cursor-pointer select-none text-left',
        'hover:bg-[#15172a] hover:border-purple-500/40 hover:shadow-md',
        'active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07080e]',
        isSelected
          ? 'border border-purple-500 shadow-[0_0_16px_rgba(168,85,247,0.3)] scale-[1.01]'
          : 'border border-white/10 shadow-sm',
        className
      )}
    >
      {/* 1. Header: Icon Container & Title */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className={`p-1.5 sm:p-2 rounded-xl border flex items-center justify-center shrink-0 ${kpi.iconBg}`}
        >
          <IconComponent size={16} className="stroke-[2]" aria-hidden="true" />
        </div>
        <span
          className={cn(
            'text-xs font-bold transition-colors truncate',
            isSelected ? 'text-purple-200' : 'text-slate-300 group-hover:text-white'
          )}
        >
          {kpi.title}
        </span>
      </div>

      {/* 2. Primary Visually Dominant Metric Value */}
      <div className="my-1 sm:my-1.5">
        {renderMetricValue()}
      </div>

      {/* 3. Footer: Trend Badge, Comparison Label & Sparkline */}
      <div className="pt-2 sm:pt-2.5 border-t border-white/5 flex items-end justify-between gap-2 mt-auto">
        <div className="flex flex-col min-w-0">
          <AnalyticsTrendBadge
            trend={kpi.trend}
            percentageChange={kpi.percentageChange}
            isAbsoluteNumber={isSatisfactionScore}
          />
          <span className="text-[10px] font-medium text-slate-500 truncate mt-1 block">
            {kpi.comparisonLabel}
          </span>
        </div>

        {/* Sparkline Visualiser */}
        <AnalyticsSparkline
          data={kpi.sparklineData}
          strokeColor={kpi.strokeColor}
          width={64}
          height={26}
        />
      </div>
    </motion.div>
  )
}

export default AnalyticsKPICard
