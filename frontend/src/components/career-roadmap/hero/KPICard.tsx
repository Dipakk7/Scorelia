import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from './ProgressRing'
import { getCardVariants, useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'
import type { KPICardData, KPICardAccent } from '@/types/careerRoadmap'

export interface KPICardProps {
  data: KPICardData
  onActionClick?: (cardId: string) => void
  className?: string
}

const ACCENT_STYLES: Record<KPICardAccent, { iconContainer: string; textAccent: string }> = {
  purple: {
    iconContainer: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    textAccent: 'text-purple-400 hover:text-purple-300',
  },
  blue: {
    iconContainer: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    textAccent: 'text-blue-400',
  },
  cyan: {
    iconContainer: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
    textAccent: 'text-cyan-400',
  },
  emerald: {
    iconContainer: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    textAccent: 'text-emerald-400',
  },
  amber: {
    iconContainer: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    textAccent: 'text-amber-400',
  },
}

export const KPICard = memo(function KPICard({ data, onActionClick, className }: KPICardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const cardVariants = getCardVariants(shouldReduceMotion)
  const styles = ACCENT_STYLES[data.accentColor] || ACCENT_STYLES.purple

  const renderVisual = () => {
    switch (data.iconType) {
      case 'briefcase':
        return (
          <div className={cn('p-2.5 rounded-xl border shrink-0', styles.iconContainer)}>
            <Briefcase className="h-5 w-5" aria-hidden="true" />
          </div>
        )
      case 'graduationCap':
        return (
          <div className={cn('p-2.5 rounded-xl border shrink-0', styles.iconContainer)}>
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
        )
      case 'clock':
        return (
          <div className={cn('p-2.5 rounded-xl border shrink-0', styles.iconContainer)}>
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
        )
      case 'progressRing':
        return (
          <ProgressRing
            value={data.progressValue ?? 32}
            size={40}
            strokeWidth={3.5}
            strokeColorClass="text-emerald-400"
            trackColorClass="text-white/10"
          />
        )
      case 'trendingUp':
        return (
          <div className={cn('p-2.5 rounded-xl border shrink-0', styles.iconContainer)}>
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div variants={cardVariants} whileHover="hover" whileTap="tap" className="h-full">
      <Card
        className={cn(
          'p-4 bg-[#121320] border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-200 shadow-sm flex flex-col justify-between h-full text-left',
          className
        )}
      >
        {/* Top Header Label & Visual */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
              {data.label}
            </span>
            <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight truncate">
              {data.value}
            </div>
          </div>
          {renderVisual()}
        </div>

        {/* Bottom Subtext / Action Footer */}
        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-left">
          {data.actionable ? (
            <button
              onClick={() => onActionClick?.(data.id)}
              className={cn('text-[11px] font-bold transition-colors bg-transparent border-none p-0 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 rounded', styles.textAccent)}
            >
              {data.subtext}
            </button>
          ) : data.id === 'current-progress' ? (
            <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 inline-block">
              {data.subtext}
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-400">
              {data.subtext}
            </span>
          )}
        </div>
      </Card>
    </motion.div>
  )
})
export default KPICard
