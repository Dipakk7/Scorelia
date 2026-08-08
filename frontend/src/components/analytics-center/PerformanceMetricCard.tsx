import React from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  ShieldCheck,
  AlertOctagon,
  CheckCircle,
  Cpu,
  HardDrive,
  Layers,
  Database,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { PerformanceMetricItem } from '@/data/analyticsPerformanceMockData'
import { AnalyticsSparkline } from './AnalyticsSparkline'
import { PerformanceStatusBadge } from './PerformanceStatusBadge'

interface PerformanceMetricCardProps {
  metric: PerformanceMetricItem
  onClick?: () => void
  className?: string
}

const iconMap = {
  Clock,
  ShieldCheck,
  AlertOctagon,
  CheckCircle,
  Cpu,
  HardDrive,
  Layers,
  Database,
}

export function PerformanceMetricCard({
  metric,
  onClick,
  className = '',
}: PerformanceMetricCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const IconComponent = iconMap[metric.iconName] || Clock

  const cardMotionVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.015,
          y: -2,
          boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.4), 0 0 16px rgba(168, 85, 247, 0.15)',
          borderColor: 'rgba(168, 85, 247, 0.4)',
        },
    tap: shouldReduceMotion ? {} : { scale: 0.98 },
  }

  return (
    <motion.div
      variants={cardMotionVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      tabIndex={0}
      onClick={onClick}
      role="article"
      aria-label={`${metric.title}: ${metric.value}. ${metric.trend}`}
      className={`group relative flex flex-col justify-between h-full p-3.5 sm:p-4 rounded-2xl bg-[#0f101c] border border-white/10 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 text-left ${className}`}
    >
      {/* Header: Icon Pill & Status Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`p-1.5 sm:p-2 rounded-xl border flex items-center justify-center shrink-0 ${metric.iconBg}`}
          >
            <IconComponent size={16} className="stroke-[2]" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">
            {metric.title}
          </span>
        </div>
        <PerformanceStatusBadge status={metric.status} />
      </div>

      {/* Primary Metric Value */}
      <div className="my-1">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tabular-nums tracking-tight leading-none block">
          {metric.value}
        </span>
      </div>

      {/* Footer: Trend, Comparison & Sparkline */}
      <div className="flex items-end justify-between pt-2 border-t border-white/5 gap-2 mt-auto">
        <div className="flex flex-col text-left min-w-0">
          <span className="text-xs font-bold text-emerald-400 font-mono">{metric.trend}</span>
          <span className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
            {metric.comparisonLabel}
          </span>
        </div>

        <AnalyticsSparkline
          data={metric.sparklineData}
          strokeColor={metric.strokeColor}
          width={64}
          height={26}
        />
      </div>
    </motion.div>
  )
}

export default PerformanceMetricCard
