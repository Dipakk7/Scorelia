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
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 w-full text-left font-sans', className)}>
      {/* Panel 1: Contribution Timeline Heatmap (5 cols) */}
      <div className="lg:col-span-5 w-full">
        <ContributionTimeline timeline={data.timeline} />
      </div>

      {/* Panel 2: Contribution Types Donut Chart (4 cols) */}
      <div className="lg:col-span-4 w-full">
        <ContributionTypesChart
          types={data.contributionTypes}
          totalContributions={data.totalContributions}
        />
      </div>

      {/* Panel 3: Top Languages Progress Bars (3 cols) */}
      <div className="lg:col-span-3 w-full">
        <TopLanguagesPanel languages={data.languages} />
      </div>
    </div>
  )
}

export default RepositoryAnalyticsWorkspace

