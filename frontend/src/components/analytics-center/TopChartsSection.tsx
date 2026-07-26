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
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 ${className}`}>
      <PlatformActivityChart data={data.platformActivity} isLoading={isLoading} isEmpty={isEmpty} />
      <ActiveUsersGrowthChart data={data.activeUsersGrowth} isLoading={isLoading} isEmpty={isEmpty} />
      <TopFeaturesChart data={data.topFeatures} onViewFullBreakdown={onViewFullBreakdown} />
    </div>
  )
}

export default TopChartsSection
