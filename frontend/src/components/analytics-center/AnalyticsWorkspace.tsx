import React from 'react'
import { AnalyticsChartsWorkspace } from './AnalyticsChartsWorkspace'
import { AnalyticsSidebar } from './AnalyticsSidebar'
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
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full ${className}`}
    >
      {/* Primary Analytics Workspace (Left Column ~75%) */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-6 lg:space-y-8 min-w-0">
        <AnalyticsChartsWorkspace onNavigateTab={onNavigateTab} />
      </div>

      {/* Right Executive Sidebar Column (~25% Desktop / ~30% Tablet) */}
      <div className="lg:col-span-4 xl:col-span-3 min-w-0">
        <AnalyticsSidebar />
      </div>
    </div>
  )
}

export default AnalyticsWorkspace
