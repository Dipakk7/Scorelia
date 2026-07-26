import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface SkillProgressBarProps {
  value: number
  status?: 'completed' | 'in-progress' | 'missing'
  height?: string
  showPercentText?: boolean
  className?: string
}

export const SkillProgressBar = memo(function SkillProgressBar({
  value,
  status = 'in-progress',
  height = 'h-2',
  showPercentText = false,
  className,
}: SkillProgressBarProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const getProgressColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
      case 'missing':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
      case 'in-progress':
      default:
        return 'bg-gradient-to-r from-amber-500 via-blue-500 to-indigo-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
    }
  }

  return (
    <div className={cn('w-full space-y-1 text-left', className)}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Skill progress: ${value}%`}
        className={cn('w-full bg-[#0b0c14] border border-white/10 rounded-full overflow-hidden p-0.5', height)}
      >
        <motion.div
          initial={shouldReduceMotion ? { width: `${value}%` } : { width: '0%' }}
          animate={{ width: `${value}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full', getProgressColor())}
        />
      </div>
      {showPercentText && (
        <span className="text-[10px] font-mono font-bold text-slate-400 text-right block">
          {value}%
        </span>
      )}
    </div>
  )
})
export default SkillProgressBar
