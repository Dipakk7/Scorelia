import React from 'react'
import { AnalyticsChartsWorkspace } from './AnalyticsChartsWorkspace'
import { AnalyticsSidebar } from './AnalyticsSidebar'
import { PerformanceSection } from './PerformanceSection'
import { InsightCardsSection } from './InsightCardsSection'
import { BottomMetricsSection } from './BottomMetricsSection'
import type { AnalyticsTabId } from './AnalyticsTabs'

interface AnalyticsWorkspaceProps {
  onNavigateTab?: (tab: AnalyticsTabId) => void
  className?: string
}

export function AnalyticsWorkspace({
  onNavigateTab,
  className = '',
}: AnalyticsWorkspaceProps) {
  return (
    <div className={`space-y-6 lg:space-y-8 text-left ${className}`}>
      {/* 1. Upper Workspace: 8:4 Split for Core Charts & Supporting AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start w-full">
        {/* Primary Main Analytics Region (8 columns on Desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 min-w-0">
          <AnalyticsChartsWorkspace onNavigateTab={onNavigateTab} />
        </div>

        {/* Supporting Intelligence Sidebar Region (4 columns on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 min-w-0">
          <AnalyticsSidebar />
        </div>
      </div>

      {/* 2. Executive System Performance & Trends Section */}
      <PerformanceSection />

      {/* 3. Deep Analytics Navigation Workspaces */}
      <InsightCardsSection onNavigateTab={onNavigateTab} />

      {/* 4. Data Sources & Operational Metrics (Intentional Page Ending) */}
      <BottomMetricsSection />
    </div>
  )
}

export default AnalyticsWorkspace
