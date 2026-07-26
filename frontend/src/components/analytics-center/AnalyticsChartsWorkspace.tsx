import React, { useState } from 'react'
import { ChartToolbar } from './ChartToolbar'
import type { TimeRangeType } from './ChartToolbar'
import { TopChartsSection } from './TopChartsSection'
import { PerformanceSection } from './PerformanceSection'
import { InsightCardsSection } from './InsightCardsSection'
import { BottomMetricsSection } from './BottomMetricsSection'
import { AnalyticsChartSkeleton } from './AnalyticsChartSkeleton'
import { EmptyChartState } from './EmptyChartState'
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
    <div className={`space-y-6 lg:space-y-8 ${className}`}>
      {/* Chart Filter Toolbar */}
      <ChartToolbar
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
        onRefresh={handleRefresh}
      />

      {isLoading ? (
        <AnalyticsChartSkeleton />
      ) : (
        <>
          {/* Interactive Recharts Section */}
          <TopChartsSection
            data={chartsData}
            onViewFullBreakdown={() => onNavigateTab?.('feature_usage')}
          />

          {/* Performance Section */}
          <PerformanceSection />

          {/* Insight Cards Section */}
          <InsightCardsSection onNavigateTab={onNavigateTab} />

          {/* Bottom Metrics Section */}
          <BottomMetricsSection />
        </>
      )}
    </div>
  )
}

export default AnalyticsChartsWorkspace
