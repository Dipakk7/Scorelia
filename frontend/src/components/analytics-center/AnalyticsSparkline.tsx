import React from 'react'
import { useScoreliaReducedMotion } from '@/lib/motion'

interface AnalyticsSparklineProps {
  data: number[]
  strokeColor?: string
  fillColor?: string
  width?: number
  height?: number
  className?: string
}

export function AnalyticsSparkline({
  data,
  strokeColor = '#3b82f6',
  fillColor,
  width = 120,
  height = 36,
  className = '',
}: AnalyticsSparklineProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()

  if (!data || data.length < 2) {
    return (
      <div className={`w-16 h-7 flex items-center justify-center text-[10px] text-slate-600 ${className}`}>
        No data
      </div>
    )
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min === 0 ? 1 : max - min

  const padding = 4
  const usableWidth = width - padding * 2
  const usableHeight = height - padding * 2

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth
    const y = height - padding - ((val - min) / range) * usableHeight
    return { x, y }
  })

  // Build SVG path with smooth control points
  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const cp1x = curr.x + (next.x - curr.x) / 2
    const cp1y = curr.y
    const cp2x = curr.x + (next.x - curr.x) / 2
    const cp2y = next.y
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
  const gradientId = `sparkline-grad-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div
      className={`relative overflow-visible select-none shrink-0 ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`w-full h-full overflow-visible transition-opacity duration-300 ${
          shouldReduceMotion ? 'opacity-100' : 'opacity-90 hover:opacity-100'
        }`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End Node Highlight */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="3"
          fill={strokeColor}
          stroke="#ffffff"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  )
}

export default AnalyticsSparkline
