import React from 'react'
import { analyticsHeroMockData } from '@/data/analyticsHeroMockData'
import type { AnalyticsHeroOverviewData, KPIMetricItem } from '@/data/analyticsHeroMockData'
import { AnalyticsHero } from './AnalyticsHero'
import { AnalyticsToolbar } from './AnalyticsToolbar'
import { AnalyticsTabs } from './AnalyticsTabs'
import type { AnalyticsTabId } from './AnalyticsTabs'
import { AnalyticsKPIGrid } from './AnalyticsKPIGrid'
import { AnalyticsHeroSkeleton } from './AnalyticsHeroSkeleton'

interface AnalyticsHeroDashboardProps {
  data?: AnalyticsHeroOverviewData
  selectedKpiId?: string
  isLoading?: boolean
  isEmpty?: boolean
  activeTab?: AnalyticsTabId
  onTabChange?: (tab: AnalyticsTabId) => void
  onExportReport?: () => void
  onAddWidget?: () => void
  onRefreshData?: () => void
  onCustomizeDashboard?: () => void
  onCardClick?: (kpi: KPIMetricItem) => void
  className?: string
}

export function AnalyticsHeroDashboard({
  data = analyticsHeroMockData,
  selectedKpiId,
  isLoading = false,
  isEmpty = false,
  activeTab = 'overview',
  onTabChange,
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
    <div className={`space-y-4 sm:space-y-5 w-full ${className}`}>
      {/* Executive Hero Header */}
      <AnalyticsHero
        lastUpdated={data.lastUpdated}
        statusMessage={data.dataFreshness}
        onExportReport={onExportReport}
        onAddWidget={onAddWidget || onCustomizeDashboard}
      />

      {/* Operational Toolbar Controls */}
      <AnalyticsToolbar
        onRefresh={onRefreshData}
        onCustomizeDashboard={onCustomizeDashboard}
      />

      {/* Analytics Navigation Tabs */}
      {onTabChange && (
        <AnalyticsTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          onFilterClick={onCustomizeDashboard}
        />
      )}

      {/* KPI Overview Grid (6 Cards) */}
      <AnalyticsKPIGrid
        kpis={data.kpis}
        selectedKpiId={selectedKpiId}
        isEmpty={isEmpty}
        onCardClick={onCardClick}
        onRetrySync={onRefreshData}
      />
    </div>
  )
}

export default AnalyticsHeroDashboard
