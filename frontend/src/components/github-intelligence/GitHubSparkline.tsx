import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface GitHubSparklineProps {
  data: number[]
  color?: string // stroke color hex or tailwind class
  gradientColor?: string
  height?: number
  width?: number | string
  className?: string
}

export const GitHubSparkline: React.FC<GitHubSparklineProps> = ({
  data,
  color = '#a855f7',
  gradientColor = 'rgba(168, 85, 247, 0.2)',
  height = 36,
  width = '100%',
  className,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  if (!data || data.length < 2) {
    return <div className="h-9 w-full bg-[var(--surface-hover)]/30 rounded" />
  }

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min === 0 ? 1 : max - min

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100
    const y = 32 - ((val - min) / range) * 26 // padding inside 36px height
    return { x, y, val }
  })

  // Generate smooth cubic Bezier path
  const pathD = points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point.x},${point.y}`
    const prev = a[i - 1]
    const cp1x = prev.x + (point.x - prev.x) / 2
    const cp1y = prev.y
    const cp2x = prev.x + (point.x - prev.x) / 2
    const cp2y = point.y
    return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`
  }, '')

  const fillD = `${pathD} L 100,36 L 0,36 Z`

  const gradientId = `sparkline-gradient-${Math.random().toString(36).substring(2, 9)}`

  return (
    <div className={cn('relative w-full overflow-hidden select-none', className)}>
      <svg
        viewBox="0 0 100 36"
        preserveAspectRatio="none"
        className="w-full h-9 overflow-visible"
        style={{ height: `${height}px` }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        <path d={fillD} fill={`url(#${gradientId})`} />

        {/* Line Path */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover Points & Tooltip */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4"
              className={cn(
                'cursor-pointer transition-all duration-150',
                hoveredIdx === i ? 'opacity-100 fill-white stroke-purple-400 stroke-2' : 'opacity-0 hover:opacity-100 fill-current'
              )}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          </g>
        ))}
      </svg>

      {/* Hover Tooltip Overlay (UI placeholder) */}
      {hoveredIdx !== null && (
        <div
          className="absolute -top-6 transform -translate-x-1/2 px-1.5 py-0.5 rounded bg-[var(--heading)] text-[var(--surface)] text-[9px] font-bold font-mono shadow-md z-20 pointer-events-none"
          style={{ left: `${points[hoveredIdx].x}%` }}
        >
          {points[hoveredIdx].val}
        </div>
      )}
    </div>
  )
}
