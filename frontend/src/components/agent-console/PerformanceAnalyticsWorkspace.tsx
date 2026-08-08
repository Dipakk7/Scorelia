import React, { useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { AnalyticsHeader } from './AnalyticsHeader'
import { AnalyticsToolbar, type TimeRangeValue } from './AnalyticsToolbar'
import { AnalyticsSummary } from './AnalyticsSummary'
import { AgentPerformanceChart } from './AgentPerformanceChart'
import { TaskDistributionChart } from './TaskDistributionChart'
import { TopAgentsChart } from './TopAgentsChart'
import { AnalyticsSkeleton } from './AnalyticsSkeleton'
import { cn } from '@/lib/utils'

export interface PerformanceAnalyticsWorkspaceProps {
  isLoading?: boolean
  className?: string
}

export function PerformanceAnalyticsWorkspace({
  isLoading: propIsLoading = false,
  className,
}: PerformanceAnalyticsWorkspaceProps) {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>('7d')
  const [selectedAgentId, setSelectedAgentId] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { isLoading: queryIsLoading } = useAnalytics(timeRange)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 600)
  }

  const handleExport = () => {
    const dummyContent = 'data:text/csv;charset=utf-8,Timestamp,Agent,Tasks,SuccessRate,ResponseTime\n2026-07-26,Resume Assistant,312,98.1,0.84s\n'
    const encodedUri = encodeURI(dummyContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `agent_analytics_${timeRange}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (propIsLoading || queryIsLoading || isRefreshing) {
    return <AnalyticsSkeleton className={className} />
  }

  return (
    <section
      aria-label="Performance Analytics & Monitoring Workspace"
      className={cn('space-y-4 sm:space-y-5 text-left font-sans w-full max-w-full min-w-0', className)}
    >
      {/* 1. Header & Live Telemetry Badges */}
      <AnalyticsHeader />

      {/* 2. Interactive Toolbar */}
      <AnalyticsToolbar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        selectedAgentId={selectedAgentId}
        onAgentIdChange={setSelectedAgentId}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={handleRefresh}
        onExport={handleExport}
      />

      {/* 3. Executive Summary KPI Cards */}
      <AnalyticsSummary timeRange={timeRange} />

      {/* 4. Main Performance Multi-Line Chart & Task Distribution Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
        {/* Left: Dual-Axis Line / Area Performance Chart (8 Columns) */}
        <div className="lg:col-span-8">
          <AgentPerformanceChart timeRange={timeRange} />
        </div>

        {/* Right: Task Category Donut Chart (4 Columns) */}
        <div className="lg:col-span-4">
          <TaskDistributionChart />
        </div>
      </div>

      {/* 5. Top Agents Ranked Horizontal Bar Chart */}
      <div>
        <TopAgentsChart />
      </div>
    </section>
  )
}

export default PerformanceAnalyticsWorkspace
