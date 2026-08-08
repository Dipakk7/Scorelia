import React, { useState } from 'react'
import { githubHeroMockData, type GitHubHeroData, type GitHubKPIMetric } from '@/data/githubHeroMockData'
import { GitHubHeader } from './GitHubHeader'
import { GitHubToolbar } from './GitHubToolbar'
import { GitHubKPIGrid } from './GitHubKPIGrid'
import { GitHubHeroSkeleton } from './GitHubHeroSkeleton'
import { EmptyGitHubHeroState } from './EmptyGitHubHeroState'
import { cn } from '@/lib/utils'

export interface GitHubHeroDashboardProps {
  data?: GitHubHeroData
  selectedKpiId?: string
  isLoading?: boolean
  isEmpty?: boolean
  currentTabLabel?: string
  searchQuery?: string
  onSearchChange?: (val: string) => void
  dateRange?: string
  onDateRangeChange?: (val: string) => void
  onSync?: () => void
  onExportReport?: () => void
  onConnect?: () => void
  onFilterClick?: () => void
  onKPICardClick?: (kpi: GitHubKPIMetric) => void
  connection?: any
  isSyncing?: boolean
  className?: string
}

export const GitHubHeroDashboard: React.FC<GitHubHeroDashboardProps> = ({
  data = githubHeroMockData,
  selectedKpiId,
  isLoading = false,
  isEmpty = false,
  currentTabLabel = 'Overview',
  searchQuery = '',
  onSearchChange,
  dateRange = '30d',
  onDateRangeChange,
  onSync,
  onExportReport,
  onConnect,
  onFilterClick,
  onKPICardClick,
  connection,
  isSyncing = false,
  className,
}) => {
  if (isLoading) {
    return <GitHubHeroSkeleton />
  }

  if (isEmpty) {
    return <EmptyGitHubHeroState />
  }

  return (
    <div className={cn('space-y-4 sm:space-y-5 w-full text-left font-sans', className)}>
      {/* 1. Master Executive Hero Card Banner */}
      <GitHubHeader
        title="GitHub Intelligence"
        subtitle="AI-powered repository intelligence, commit velocity, and developer performance analytics."
        username={connection?.username || data.username}
        lastSynced={connection?.lastSyncedAt || data.lastSynced}
        isConnected={connection?.isConnected ?? true}
        isSyncing={isSyncing}
        rateLimit={connection?.rateLimit}
        currentTabLabel={currentTabLabel}
        onSync={onSync}
        onExportReport={onExportReport}
        onConnect={onConnect}
      />

      {/* 2. Coherent Workspace Controls Toolbar */}
      <GitHubToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        onSync={onSync}
        onFilterClick={onFilterClick}
      />

      {/* 3. 7 KPI Card Responsive Grid */}
      <GitHubKPIGrid
        metrics={data.kpis}
        selectedKpiId={selectedKpiId}
        isLoading={isLoading}
        onCardClick={onKPICardClick}
      />
    </div>
  )
}
