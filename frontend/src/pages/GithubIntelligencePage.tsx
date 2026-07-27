import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getPageVariants } from '@/lib/motion'
import {
  GitHubHeroDashboard,
  GitHubTabs,
  GitHubWorkspace,
  GitHubSidebar,
  GitHubBottomStatusBar,
  GitHubOfflineBanner,
  type GitHubTabId,
  GITHUB_TABS,
} from '@/components/github-intelligence'
import { githubHeroMockData, type GitHubKPIMetric } from '@/data/githubHeroMockData'
import { useGitHubConnection } from '@/hooks/github/useGitHubConnection'
import { useGitHubSync } from '@/hooks/github/useGitHubSync'

export function GitHubIntelligencePage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const pageVariants = getPageVariants(shouldReduceMotion)

  const [activeTab, setActiveTab] = useState<GitHubTabId>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState('30d')
  const [selectedKPI, setSelectedKPI] = useState<GitHubKPIMetric | null>(null)

  const { data: connection, isLoading: isConnecting } = useGitHubConnection()
  const { mutate: triggerSync, isPending: isSyncing } = useGitHubSync()

  const activeTabLabel = GITHUB_TABS.find((t) => t.id === activeTab)?.label || 'Overview'

  const handleSync = () => {
    triggerSync()
  }

  const handleKPICardClick = (kpi: GitHubKPIMetric) => {
    setSelectedKPI(kpi)
  }

  const isLoading = isConnecting || isSyncing
  const isOffline = connection ? !connection.isConnected : false

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-6 text-left max-w-[1680px] mx-auto font-sans p-3 sm:p-5 lg:p-6 pb-20 min-h-screen text-[var(--body)] select-none"
    >
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
            <GitHubWorkspace isLoading={isLoading} />
          </div>
          <div className="lg:col-span-4 xl:col-span-3 w-full">
            <GitHubSidebar isLoading={isLoading} />
          </div>
        </div>

        {/* 4. Bottom Status Bar (Full Width Spans Workspace) */}
        <GitHubBottomStatusBar onGenerateReport={() => alert('AI Report generation requested.')} />
      </div>
    </motion.main>
  )
}

export default GitHubIntelligencePage
