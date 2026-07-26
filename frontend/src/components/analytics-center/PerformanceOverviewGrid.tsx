import React from 'react'
import { analyticsPerformanceMockData } from '@/data/analyticsPerformanceMockData'
import type { PerformanceMetricItem } from '@/data/analyticsPerformanceMockData'
import { PerformanceMetricCard } from './PerformanceMetricCard'

interface PerformanceOverviewGridProps {
  metrics?: PerformanceMetricItem[]
  onCardClick?: (metric: PerformanceMetricItem) => void
  className?: string
}

export function PerformanceOverviewGrid({
  metrics = analyticsPerformanceMockData.metrics,
  onCardClick,
  className = '',
}: PerformanceOverviewGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4 ${className}`}
      role="region"
      aria-label="Platform Health Metrics Grid"
    >
      {metrics.map((metric) => (
        <PerformanceMetricCard
          key={metric.id}
          metric={metric}
          onClick={() => onCardClick?.(metric)}
        />
      ))}
    </div>
  )
}

export default PerformanceOverviewGrid
