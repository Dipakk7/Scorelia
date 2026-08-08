import React from 'react'
import { PlatformActivityChart } from './PlatformActivityChart'
import { ActiveUsersGrowthChart } from './ActiveUsersGrowthChart'
import { TopFeaturesChart } from './TopFeaturesChart'
import { analyticsChartsMockData } from '@/data/analyticsChartsMockData'
import type { AnalyticsChartsData } from '@/data/analyticsChartsMockData'

interface TopChartsSectionProps {
  data?: AnalyticsChartsData
  isLoading?: boolean
  isEmpty?: boolean
  onViewFullBreakdown?: () => void
  className?: string
}

export function TopChartsSection({
  data = analyticsChartsMockData,
  isLoading = false,
  isEmpty = false,
  onViewFullBreakdown,
  className = '',
}: TopChartsSectionProps) {
  return (
    <div className={`space-y-4 sm:space-y-5 ${className}`}>
      {/* Primary Chart: Full Width Platform Activity */}
      <div className="w-full">
        <PlatformActivityChart data={data.platformActivity} isLoading={isLoading} isEmpty={isEmpty} />
      </div>

      {/* Secondary Charts: Dual Column Row for Active Users & Top Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <ActiveUsersGrowthChart data={data.activeUsersGrowth} isLoading={isLoading} isEmpty={isEmpty} />
        <TopFeaturesChart data={data.topFeatures} onViewFullBreakdown={onViewFullBreakdown} />
      </div>
    </div>
  )
}

export default TopChartsSection
