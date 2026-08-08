import React from 'react'
import { analyticsHeroMockData } from '@/data/analyticsHeroMockData'
import type { KPIMetricItem } from '@/data/analyticsHeroMockData'
import { AnalyticsKPICard } from './AnalyticsKPICard'
import { EmptyHeroState } from './EmptyHeroState'

interface AnalyticsKPIGridProps {
  kpis?: KPIMetricItem[]
  selectedKpiId?: string
  onCardClick?: (kpi: KPIMetricItem) => void
  onRetrySync?: () => void
  isEmpty?: boolean
  className?: string
}

export function AnalyticsKPIGrid({
  kpis = analyticsHeroMockData.kpis,
  selectedKpiId,
  onCardClick,
  onRetrySync,
  isEmpty = false,
  className = '',
}: AnalyticsKPIGridProps) {
  if (isEmpty || !kpis || kpis.length === 0) {
    return <EmptyHeroState onRetry={onRetrySync} />
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5 lg:gap-4 ${className}`}
      role="region"
      aria-label="Executive Key Performance Indicators Grid"
    >
      {kpis.map((kpi) => (
        <AnalyticsKPICard
          key={kpi.id}
          kpi={kpi}
          isSelected={selectedKpiId === kpi.id}
          onClick={() => onCardClick?.(kpi)}
        />
      ))}
    </div>
  )
}

export default AnalyticsKPIGrid
