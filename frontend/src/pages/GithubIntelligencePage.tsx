import React, { useState } from 'react'
import {

  GitHubHeroDashboard,
  GitHubTabs,
  GitHubWorkspace,
  GitHubSidebar,
  GitHubBottomStatusBar,
  GitHubOfflineBanner,
  GitHubErrorBoundary,
  type GitHubTabId,
  GITHUB_TABS,
} from '@/components/github-intelligence'
import { githubHeroMockData, type GitHubKPIMetric } from '@/data/githubHeroMockData'
import { useGitHubConnection } from '@/hooks/github/useGitHubConnection'
import { useGitHubAnalytics } from '@/hooks/github/useGitHubAnalytics'
import { useGitHubRepositories } from '@/hooks/github/useGitHubRepositories'
import { useGitHubDeveloperMetrics } from '@/hooks/github/useGitHubDeveloperMetrics'
import { useGitHubInsights } from '@/hooks/github/useGitHubInsights'
import { useGitHubSync } from '@/hooks/github/useGitHubSync'

export function GitHubIntelligencePage() {
  const [activeTab, setActiveTab] = useState<GitHubTabId>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('30d')
  const [selectedKPI, setSelectedKPI] = useState<GitHubKPIMetric | null>(null)

  // STEP 4 — React Query Integration for All Intelligence Queries
  const {
    data: connection,
    isLoading: isConnecting,
    isError: isConnectionError,
    error: connectionError,
    refetch: refetchConnection,
  } = useGitHubConnection()

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useGitHubAnalytics()

  const {
    data: repositoriesData,
    isLoading: isRepositoriesLoading,
    isError: isRepositoriesError,
    error: repositoriesError,
    refetch: refetchRepositories,
  } = useGitHubRepositories()

  const {
    data: developerMetricsData,
    isLoading: isDeveloperMetricsLoading,
    isError: isDeveloperMetricsError,
    error: developerMetricsError,
    refetch: refetchDeveloperMetrics,
  } = useGitHubDeveloperMetrics()

  const {
    data: insightsData,
    isLoading: isInsightsLoading,
    isError: isInsightsError,
    error: insightsError,
    refetch: refetchInsights,
  } = useGitHubInsights()

  const { mutate: triggerSync, isPending: isSyncing } = useGitHubSync()

  const activeTabLabel = GITHUB_TABS.find((t) => t.id === activeTab)?.label || 'Overview'

  const handleSync = () => {
    triggerSync()
  }

  const handleRefetchAll = () => {
    refetchConnection()
    refetchAnalytics()
    refetchRepositories()
    refetchDeveloperMetrics()
    refetchInsights()
  }

  const handleKPICardClick = (kpi: GitHubKPIMetric) => {
    setSelectedKPI(kpi)
  }

  const isLoading =
    isConnecting ||
    isSyncing ||
    isAnalyticsLoading ||
    isRepositoriesLoading ||
    isDeveloperMetricsLoading ||
    isInsightsLoading

  const isError =
    isConnectionError ||
    isAnalyticsError ||
    isRepositoriesError ||
    isDeveloperMetricsError ||
    isInsightsError

  const combinedError =
    connectionError || analyticsError || repositoriesError || developerMetricsError || insightsError

  const isOffline = connection ? !connection.isConnected : false

  return (
    <GitHubErrorBoundary sectionName="GitHub Intelligence Page" onReset={handleRefetchAll}>
      <main className="space-y-6 text-left max-w-[1680px] mx-auto font-sans p-3 sm:p-5 lg:p-6 pb-20 min-h-screen text-[var(--body)] select-none">

        {/* Offline Banner Indicator */}
        <GitHubOfflineBanner isOffline={isOffline} onReconnect={handleSync} />

        {/* 1. Hero Dashboard (Header, Toolbar & 7 Interactive KPI Cards) */}
        <GitHubHeroDashboard
          data={githubHeroMockData}
          isLoading={isLoading}
          isEmpty={false}
          currentTabLabel={activeTabLabel}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onSync={handleSync}
          onKPICardClick={handleKPICardClick}
        />

        <div className="space-y-6">
          {/* 2. Navigation Tabs */}
          <GitHubTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* 3. Executive Responsive Workspace Layout (75% Workspace / 25% Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 xl:col-span-9 w-full">
              <GitHubWorkspace
                activeTab={activeTab}
                isLoading={isLoading}
                isError={isError}
                error={combinedError}
                onRetry={handleRefetchAll}
                onSync={handleSync}
                onReconnect={handleSync}
                connection={connection}
                analyticsData={analyticsData}
                repositoriesData={repositoriesData}
                developerMetricsData={developerMetricsData}
                insightsData={insightsData}
              />
            </div>
            <div className="lg:col-span-4 xl:col-span-3 w-full">
              <GitHubSidebar isLoading={isLoading} />
            </div>
          </div>

          {/* 4. Bottom Status Bar (Full Width Spans Workspace) */}
          <GitHubBottomStatusBar onGenerateReport={() => alert('AI Report generation requested.')} />
        </div>
      </main>
    </GitHubErrorBoundary>
  )
}

export default GitHubIntelligencePage
