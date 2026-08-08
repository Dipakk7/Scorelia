import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Sparkles, Zap, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { AIInsightItem } from '@/data/analyticsInsightsMockData'
import { InsightSeverityBadge } from './InsightSeverityBadge'

interface InsightCardProps {
  insight: AIInsightItem
  onActionClick?: (insight: AIInsightItem) => void
  className?: string
}

const iconMap = {
  TrendingUp,
  Sparkles,
  Zap,
  AlertTriangle,
  ShieldAlert,
}

export function InsightCard({ insight, onActionClick, className = '' }: InsightCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const IconComponent = iconMap[insight.iconName] || Sparkles

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.015,
          y: -1.5,
          boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.4), 0 0 12px rgba(168, 85, 247, 0.15)',
          borderColor: 'rgba(168, 85, 247, 0.3)',
        },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      tabIndex={0}
      role="article"
      aria-label={`${insight.title}: ${insight.summary}`}
      className={`p-3.5 rounded-xl bg-[#0f101c] border border-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 text-left ${className}`}
    >
      {/* 1. Header: Icon, Category & Severity Badge */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <IconComponent size={14} className="text-purple-400 shrink-0" aria-hidden="true" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300/90 font-mono truncate">
            {insight.category || insight.title}
          </span>
        </div>
        <InsightSeverityBadge
          severity={insight.severity}
          label={insight.severityBadgeText}
        />
      </div>

      {/* 2. Headline & Summary */}
      <div className="my-1">
        <h4 className="text-xs font-bold text-slate-100 m-0 leading-snug">
          {insight.title}
        </h4>
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed m-0 mt-1">
          {insight.summary}
        </p>
      </div>

      {/* 3. Footer: Confidence, Timestamp & Action Button */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5 font-mono">
          <span>Confidence: <strong className="text-slate-300 font-bold">{insight.confidence}%</strong></span>
          <span>•</span>
          <span>{insight.timestamp}</span>
        </div>

        {insight.actionLabel && (
          <button
            type="button"
            onClick={() => onActionClick?.(insight)}
            className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer group"
          >
            <span>{insight.actionLabel}</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default InsightCard
