import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
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
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<GitHubTabId>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('30d')
  const [selectedKPI, setSelectedKPI] = useState<GitHubKPIMetric | null>(null)

  // React Query Integration for All Intelligence Queries
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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: shouldReduceMotion ? 0 : 0.02,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    },
  }

  return (
    <GitHubErrorBoundary sectionName="GitHub Intelligence Page" onReset={handleRefetchAll}>
      <div className="-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 lg:space-y-6 text-slate-100 selection:bg-purple-500/30 font-sans max-w-[1920px] mx-auto text-left min-h-screen select-none">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 sm:space-y-5 lg:space-y-6 w-full max-w-full"
        >
          {/* Offline Banner Indicator */}
          {isOffline && (
            <motion.div variants={itemVariants}>
              <GitHubOfflineBanner isOffline={isOffline} onReconnect={handleSync} />
            </motion.div>
          )}

          {/* 1. Hero Dashboard (Header, Controls Toolbar & 7 Interactive KPI Cards) */}
          <motion.div variants={itemVariants}>
            <GitHubHeroDashboard
              data={githubHeroMockData}
              selectedKpiId={selectedKPI?.id}
              isLoading={isLoading}
              isEmpty={false}
              currentTabLabel={activeTabLabel}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              onSync={handleSync}
              onExportReport={() => alert('AI Report generation requested.')}
              onConnect={handleSync}
              onKPICardClick={handleKPICardClick}
              connection={connection}
              isSyncing={isSyncing}
            />
          </motion.div>

          {/* 2. Navigation Tabs */}
          <motion.div variants={itemVariants}>
            <GitHubTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>

          {/* 3. Executive Responsive Workspace Layout */}
          <motion.div
            variants={itemVariants}
            id={`github-tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`github-tab-${activeTab}`}
            className="w-full max-w-full"
          >
            {activeTab === 'overview' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start">
                <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 w-full">
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
                <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 w-full">
                  <GitHubSidebar isLoading={isLoading} />
                </div>
              </div>
            ) : (
              <div className="w-full">
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
            )}
          </motion.div>

          {/* 4. Bottom Status Bar (Full Width Spans Workspace) */}
          <motion.div variants={itemVariants}>
            <GitHubBottomStatusBar onGenerateReport={() => alert('AI Report generation requested.')} />
          </motion.div>
        </motion.div>
      </div>
    </GitHubErrorBoundary>
  )
}

export default GitHubIntelligencePage
