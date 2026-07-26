import React from 'react'
import { analyticsHeroMockData } from '@/data/analyticsHeroMockData'
import type { AnalyticsHeroOverviewData, KPIMetricItem } from '@/data/analyticsHeroMockData'
import { AnalyticsHero } from './AnalyticsHero'
import { AnalyticsToolbar } from './AnalyticsToolbar'
import { AnalyticsKPIGrid } from './AnalyticsKPIGrid'
import { AnalyticsHeroSkeleton } from './AnalyticsHeroSkeleton'

interface AnalyticsHeroDashboardProps {
  data?: AnalyticsHeroOverviewData
  isLoading?: boolean
  isEmpty?: boolean
  onExportReport?: () => void
  onAddWidget?: () => void
  onRefreshData?: () => void
  onCustomizeDashboard?: () => void
  onCardClick?: (kpi: KPIMetricItem) => void
  className?: string
}

export function AnalyticsHeroDashboard({
  data = analyticsHeroMockData,
  isLoading = false,
  isEmpty = false,
  onExportReport,
  onAddWidget,
  onRefreshData,
  onCustomizeDashboard,
  onCardClick,
  className = '',
}: AnalyticsHeroDashboardProps) {
  if (isLoading) {
    return <AnalyticsHeroSkeleton />
  }

  return (
    <div className={`space-y-6 w-full ${className}`}>
      {/* Executive Hero Header */}
      <AnalyticsHero
        lastUpdated={data.lastUpdated}
        statusMessage={data.dataFreshness}
        onExportReport={onExportReport}
        onAddWidget={onAddWidget || onCustomizeDashboard}
      />

      {/* Operational Toolbar */}
      <AnalyticsToolbar
        onRefresh={onRefreshData}
        onCustomizeDashboard={onCustomizeDashboard}
      />

      {/* KPI Overview Grid */}
      <AnalyticsKPIGrid
        kpis={data.kpis}
        isEmpty={isEmpty}
        onCardClick={onCardClick}
        onRetrySync={onRefreshData}
      />
    </div>
  )
}

export default AnalyticsHeroDashboard
