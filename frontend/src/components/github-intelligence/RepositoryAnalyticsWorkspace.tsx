import React from 'react'
import { githubAnalyticsMockData, type GitHubAnalyticsData } from '@/data/githubAnalyticsMockData'
import { ContributionTimeline } from './ContributionTimeline'
import { ContributionTypesChart } from './ContributionTypesChart'
import { TopLanguagesPanel } from './TopLanguagesPanel'
import { RepositoryAnalyticsSkeleton } from './RepositoryAnalyticsSkeleton'
import { EmptyRepositoryAnalyticsState } from './EmptyRepositoryAnalyticsState'
import { cn } from '@/lib/utils'

export interface RepositoryAnalyticsWorkspaceProps {
  data?: GitHubAnalyticsData
  isLoading?: boolean
  isEmpty?: boolean
  onSync?: () => void
  className?: string
}

export const RepositoryAnalyticsWorkspace: React.FC<RepositoryAnalyticsWorkspaceProps> = ({
  data = githubAnalyticsMockData,
  isLoading = false,
  isEmpty = false,
  onSync,
  className,
}) => {
  if (isLoading) {
    return <RepositoryAnalyticsSkeleton />
  }

  if (isEmpty) {
    return <EmptyRepositoryAnalyticsState onSync={onSync} />
  }

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 w-full text-left font-sans items-stretch', className)}>
      {/* Panel 1: Contribution Timeline Heatmap (5 cols) */}
      <div className="lg:col-span-5 w-full flex flex-col">
        <ContributionTimeline timeline={data.timeline} className="h-full" />
      </div>

      {/* Panel 2: Contribution Types Donut Chart (4 cols) */}
      <div className="lg:col-span-4 w-full flex flex-col">
        <ContributionTypesChart
          types={data.contributionTypes}
          totalContributions={data.totalContributions}
          className="h-full"
        />
      </div>

      {/* Panel 3: Top Languages Progress Bars (3 cols) */}
      <div className="lg:col-span-3 w-full flex flex-col">
        <TopLanguagesPanel languages={data.languages} className="h-full" />
      </div>
    </div>
  )
}

export default RepositoryAnalyticsWorkspace

