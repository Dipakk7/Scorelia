import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { RepositoryAnalyticsWorkspace } from './RepositoryAnalyticsWorkspace'
import { RepositoryIntelligenceWorkspace } from './RepositoryIntelligenceWorkspace'
import { DeveloperPerformanceWorkspace } from './DeveloperPerformanceWorkspace'
import { cn } from '@/lib/utils'

export interface GitHubWorkspaceProps {
  isLoading?: boolean
  className?: string
}

export const GitHubWorkspace: React.FC<GitHubWorkspaceProps> = ({ isLoading = false, className }) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6 text-left font-sans', className)}>
      {/* ROW 1: Repository Analytics Workspace (Timeline, Types, Top Languages) */}
      <RepositoryAnalyticsWorkspace isLoading={isLoading} />

      {/* ROW 2: Repository Intelligence Workspace (Statistics, Search, Filters, Table/Cards) */}
      <RepositoryIntelligenceWorkspace isLoading={isLoading} />

      {/* ROW 3: Developer Performance & Code Quality Workspace */}
      <DeveloperPerformanceWorkspace isLoading={isLoading} />
    </div>
  )
}
