import React from 'react'
import { githubDeveloperMetricsMockData, type GitHubDeveloperMetricsData } from '@/data/githubDeveloperMetricsMockData'
import { CodeQualityOverview } from './CodeQualityOverview'
import { DeveloperPerformanceCards } from './DeveloperPerformanceCards'
import { CommitActivityChart } from './CommitActivityChart'
import { PullRequestMetrics } from './PullRequestMetrics'
import { CodeReviewMetrics } from './CodeReviewMetrics'
import { IssueResolutionMetrics } from './IssueResolutionMetrics'
import { MergeStatistics } from './MergeStatistics'
import { ProductivityInsights } from './ProductivityInsights'
import { DeveloperPerformanceSkeleton } from './DeveloperPerformanceSkeleton'
import { EmptyDeveloperPerformanceState } from './EmptyDeveloperPerformanceState'
import { cn } from '@/lib/utils'

export interface DeveloperPerformanceWorkspaceProps {
  data?: GitHubDeveloperMetricsData
  isLoading?: boolean
  isEmpty?: boolean
  onSync?: () => void
  className?: string
}

export const DeveloperPerformanceWorkspace: React.FC<DeveloperPerformanceWorkspaceProps> = ({
  data = githubDeveloperMetricsMockData,
  isLoading = false,
  isEmpty = false,
  onSync,
  className,
}) => {
  if (isLoading) {
    return <DeveloperPerformanceSkeleton />
  }

  if (isEmpty) {
    return <EmptyDeveloperPerformanceState onSync={onSync} />
  }

  return (
    <div className={cn('space-y-6 w-full text-left font-sans', className)}>
      {/* ROW 1: Code Quality Overview (6 cols) & Performance Cards (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <CodeQualityOverview metrics={data.codeQuality} />
        </div>
        <div className="lg:col-span-6 w-full">
          <DeveloperPerformanceCards productivity={data.productivity} />
        </div>
      </div>

      {/* ROW 2: Commit Activity Chart (6 cols) & Pull Request Metrics (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <CommitActivityChart activity={data.commitActivity} />
        </div>
        <div className="lg:col-span-6 w-full">
          <PullRequestMetrics metrics={data.pullRequests} />
        </div>
      </div>

      {/* ROW 3: Code Review Metrics (6 cols) & Issue Resolution Metrics (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <CodeReviewMetrics metrics={data.codeReviews} />
        </div>
        <div className="lg:col-span-6 w-full">
          <IssueResolutionMetrics metrics={data.issueResolution} />
        </div>
      </div>

      {/* ROW 4: Merge Statistics (6 cols) & Productivity Insights (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 w-full">
          <MergeStatistics metrics={data.mergeStatistics} />
        </div>
        <div className="lg:col-span-6 w-full">
          <ProductivityInsights productivity={data.productivity} />
        </div>
      </div>
    </div>
  )
}
