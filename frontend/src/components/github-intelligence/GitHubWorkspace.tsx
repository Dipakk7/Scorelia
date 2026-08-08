import React, { Suspense, lazy } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import type { GitHubTabId } from './GitHubTabs'
import { GitHubErrorState } from './GitHubErrorState'
import { GitHubErrorBoundary } from './GitHubErrorBoundary'
import { EmptyGitHubState } from './EmptyGitHubState'
import { cn } from '@/lib/utils'

// Lazy loaded workspace views for optimal code splitting & FCP
const RepositoryAnalyticsWorkspace = lazy(() => import('./RepositoryAnalyticsWorkspace'))
const RepositoryIntelligenceWorkspace = lazy(() => import('./RepositoryIntelligenceWorkspace'))
const DeveloperPerformanceWorkspace = lazy(() => import('./DeveloperPerformanceWorkspace'))
const AIInsightsWorkspace = lazy(() => import('./AIInsightsWorkspace'))
const GitHubSettingsWorkspace = lazy(() => import('./GitHubSettingsWorkspace'))

export interface GitHubWorkspaceProps {
  activeTab?: GitHubTabId
  isLoading?: boolean
  isError?: boolean
  error?: any
  onRetry?: () => void
  onSync?: () => void
  onReconnect?: () => void
  connection?: any
  analyticsData?: any
  repositoriesData?: any
  developerMetricsData?: any
  insightsData?: any
  className?: string
}

export const GitHubWorkspaceSkeleton: React.FC = () => (
  <div className="space-y-4 sm:space-y-5 lg:space-y-6 animate-pulse w-full">
    <Skeleton className="h-64 w-full rounded-2xl bg-slate-900 border border-white/10" />
    <Skeleton className="h-96 w-full rounded-2xl bg-slate-900 border border-white/10" />
    <Skeleton className="h-96 w-full rounded-2xl bg-slate-900 border border-white/10" />
  </div>
)

export const GitHubWorkspace: React.FC<GitHubWorkspaceProps> = ({
  activeTab = 'overview',
  isLoading = false,
  isError = false,
  error,
  onRetry,
  onSync,
  onReconnect,
  connection,
  analyticsData,
  repositoriesData,
  developerMetricsData,
  insightsData,
  className,
}) => {
  // 1. Loading State
  if (isLoading) {
    return <GitHubWorkspaceSkeleton />
  }

  // 2. Error State
  if (isError) {
    return (
      <GitHubErrorState
        errorType="500"
        message={error?.message || 'Unable to load GitHub workspace intelligence data.'}
        onRetry={onRetry}
        onReconnect={onReconnect}
        className={className}
      />
    )
  }

  return (
    <GitHubErrorBoundary sectionName={`GitHub Workspace Tab (${activeTab})`} onReset={onRetry}>
      <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 text-left font-sans w-full', className)}>
        <Suspense fallback={<GitHubWorkspaceSkeleton />}>
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 w-full">
              <RepositoryAnalyticsWorkspace data={analyticsData} isLoading={isLoading} onSync={onSync} />
              <RepositoryIntelligenceWorkspace
                summary={repositoriesData?.summary}
                repositories={repositoriesData?.repositories}
                isLoading={isLoading}
                onSync={onSync}
              />
              <DeveloperPerformanceWorkspace data={developerMetricsData} isLoading={isLoading} onSync={onSync} />
            </div>
          )}

          {activeTab === 'repositories' && (
            <RepositoryIntelligenceWorkspace
              summary={repositoriesData?.summary}
              repositories={repositoriesData?.repositories}
              isLoading={isLoading}
              onSync={onSync}
            />
          )}

          {(activeTab === 'activity' || activeTab === 'contributions') && (
            <RepositoryAnalyticsWorkspace data={analyticsData} isLoading={isLoading} onSync={onSync} />
          )}

          {(activeTab === 'code_quality' || activeTab === 'pull_requests') && (
            <DeveloperPerformanceWorkspace data={developerMetricsData} isLoading={isLoading} onSync={onSync} />
          )}

          {activeTab === 'deep_insights' && (
            <AIInsightsWorkspace data={insightsData} isLoading={isLoading} onSync={onSync} />
          )}

          {activeTab === 'settings' && (
            <GitHubSettingsWorkspace
              isLoading={isLoading}
              isConnected={connection?.isConnected}
              username={connection?.username}
              lastSyncedAt={connection?.lastSyncedAt}
              rateLimit={connection?.rateLimit}
              onSync={onSync}
              onReconnect={onReconnect}
            />
          )}

          {/* Guarantee that an unmapped or invalid activeTab NEVER renders blank */}
          {![
            'overview',
            'repositories',
            'activity',
            'code_quality',
            'pull_requests',
            'contributions',
            'deep_insights',
            'settings',
          ].includes(activeTab) && <EmptyGitHubState onSync={onSync} />}
        </Suspense>
      </div>
    </GitHubErrorBoundary>
  )
}

export default GitHubWorkspace
