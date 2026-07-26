import React from 'react'
import { motion } from 'framer-motion'
import {
  PlusCircle,
  Calendar,
  Download,
  SlidersHorizontal,
  Bell,
  Database,
  ChevronRight,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { QuickActionItemData } from '@/data/analyticsInsightsMockData'

interface QuickActionCardProps {
  action: QuickActionItemData
  onClick?: (action: QuickActionItemData) => void
  className?: string
}

const iconMap: Record<string, React.ElementType> = {
  PlusCircle,
  Calendar,
  Download,
  SlidersHorizontal,
  Bell,
  Database,
}

export function QuickActionCard({ action, onClick, className = '' }: QuickActionCardProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const IconComponent = iconMap[action.iconName] || PlusCircle

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: shouldReduceMotion
      ? {}
      : {
          scale: 1.01,
          y: -1,
          boxShadow: '0 6px 16px -4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(168, 85, 247, 0.15)',
          borderColor: 'rgba(168, 85, 247, 0.3)',
        },
  }

  return (
    <motion.button
      type="button"
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      disabled={!action.enabled}
      onClick={() => onClick?.(action)}
      className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-[#0f101c] border border-white/10 hover:bg-white/5 text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 text-left">
        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
          <IconComponent size={14} className="stroke-[2]" />
        </div>
        <div className="min-w-0">
          <span className="font-bold text-slate-200 group-hover:text-white block truncate leading-snug">
            {action.title}
          </span>
          <span className="text-[10px] text-slate-400 font-medium block truncate">
            {action.description}
          </span>
        </div>
      </div>

      <ChevronRight
        size={14}
        className="text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2"
      />
    </motion.button>
  )
}

export default QuickActionCard
