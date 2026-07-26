import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getScoreRingCircleTransition, useScoreliaInView } from '@/lib/motion'
import { CountUpText } from '@/components/ui/CountUpText'
import { cn } from '@/lib/utils'

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  showPercentSymbol?: boolean
  strokeColorClass?: string
  trackColorClass?: string
}

export const ProgressRing = memo(function ProgressRing({
  value,
  max = 100,
  size = 40,
  strokeWidth = 3.5,
  showPercentSymbol = false,
  strokeColorClass = 'text-emerald-400',
  trackColorClass = 'text-white/10',
  className,
  ...props
}: ProgressRingProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [viewRef, isInView] = useScoreliaInView({ once: true, amount: 0.1 })

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      ref={viewRef}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn('relative inline-flex items-center justify-center shrink-0 select-none', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          className={cn('stroke-current', trackColorClass)}
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
          transition={getScoreRingCircleTransition(shouldReduceMotion)}
          strokeLinecap="round"
          className={cn('stroke-current', strokeColorClass)}
        />
      </svg>

      {/* Screen Reader Label */}
      <span className="sr-only">{value}% progress</span>

      {showPercentSymbol && (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white font-mono">
          <CountUpText value={value} trigger={isInView} suffix="%" />
        </div>
      )}
    </div>
  )
})
export default ProgressRing
