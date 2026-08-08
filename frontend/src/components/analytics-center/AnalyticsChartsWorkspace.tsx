import React, { useState } from 'react'
import { ChartToolbar } from './ChartToolbar'
import type { TimeRangeType } from './ChartToolbar'
import { TopChartsSection } from './TopChartsSection'
import { AnalyticsChartSkeleton } from './AnalyticsChartSkeleton'
import { useAnalyticsChartsWorkspace } from '@/services/analytics/analyticsQueries'
import type { AnalyticsTabId } from './AnalyticsTabs'

interface AnalyticsChartsWorkspaceProps {
  onNavigateTab?: (tab: AnalyticsTabId) => void
  className?: string
}

export function AnalyticsChartsWorkspace({
  onNavigateTab,
  className = '',
}: AnalyticsChartsWorkspaceProps) {
  const [timeRange, setTimeRange] = useState<TimeRangeType>('7d')
  const { data: chartsData, isLoading, refetch } = useAnalyticsChartsWorkspace()

  const handleRefresh = () => {
    refetch()
  }

  const handleTimeRangeChange = (range: TimeRangeType) => {
    setTimeRange(range)
    refetch()
  }

  return (
    <div className={`space-y-4 sm:space-y-5 ${className}`}>
      {/* Chart Filter Toolbar */}
      <ChartToolbar
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
      />

      {isLoading ? (
        <AnalyticsChartSkeleton />
      ) : (
        <TopChartsSection
          data={chartsData}
          onViewFullBreakdown={() => onNavigateTab?.('feature_usage')}
        />
      )}
    </div>
  )
}

export default AnalyticsChartsWorkspace
