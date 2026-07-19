import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getScoreRingCircleTransition, useScoreliaInView } from '@/lib/motion'
import { CountUpText } from './CountUpText'

export interface ScoreRingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  subLabel?: string
  color?: string // accepts semantic name or CSS variable, e.g. "secondary", "--success"
  trackColor?: string // accepts semantic name or CSS variable for the background track, e.g. "--border"
  tooltip?: string
}

/**
 * Resolves a semantic color name or CSS variable into a CSS value.
 * Handles base HSL coordinate tokens (like --primary, --secondary) vs resolved variables (like --success).
 */
const resolveCssColor = (colorName: string) => {
  if (!colorName) return 'currentColor'
  const varName = colorName.startsWith('--') ? colorName : `--${colorName}`
  
  const isRawHsl = [
    '--primary',
    '--secondary',
    '--muted',
    '--accent',
    '--background',
    '--foreground',
    '--card',
    '--popover'
  ].includes(varName)
  
  return isRawHsl ? `hsl(var(${varName}))` : `var(${varName})`
}

export const ScoreRing = React.forwardRef<HTMLDivElement, ScoreRingProps>(
  (
    {
      className,
      value,
      max = 100,
      size = 128,
      strokeWidth = 8,
      label,
      subLabel,
      color = '--secondary',
      trackColor = '--border',
      tooltip,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useScoreliaReducedMotion()
    const [viewRef, isInView] = useScoreliaInView({ once: true, amount: 0.1 })

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        viewRef.current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref, viewRef]
    )

    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    const strokeColorValue = resolveCssColor(color)
    const trackColorValue = resolveCssColor(trackColor)

    return (
      <div
        ref={setRefs}
        className={cn('flex flex-col items-center justify-center p-4 relative select-none font-sans', className)}
        title={tooltip}
        {...props}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
            {/* Background track circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={trackColorValue}
              strokeWidth={strokeWidth}
              className="opacity-20 dark:opacity-30"
            />
            {/* Foreground progress circle */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={strokeColorValue}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={isInView ? { strokeDashoffset: strokeDashoffset } : { strokeDashoffset: circumference }}
              transition={getScoreRingCircleTransition(shouldReduceMotion)}
              strokeLinecap="round"
            />
          </svg>
          {/* Centered text display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
            <span className="text-3xl font-black font-mono text-foreground leading-none tracking-tight">
              <CountUpText value={value} trigger={isInView} />
            </span>
            {subLabel ? (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">
                {subLabel}
              </span>
            ) : (
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">
                / {max}
              </span>
            )}
          </div>
        </div>
        {label && (
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold mt-3 text-center">
            {label}
          </span>
        )}
      </div>
    )
  }
)

ScoreRing.displayName = 'ScoreRing'
