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
  onKPICardClick?: (kpi: GitHubKPIMetric) => void
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
  onKPICardClick,
  className,
}) => {
  if (isLoading) {
    return <GitHubHeroSkeleton />
  }

  if (isEmpty) {
    return <EmptyGitHubHeroState />
  }

  return (
    <div className={cn('space-y-6 w-full text-left font-sans', className)}>
      {/* 1. Page Header */}
      <GitHubHeader currentTabLabel={currentTabLabel} />

      {/* 2. Page Toolbar */}
      <GitHubToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        onSync={onSync}
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
