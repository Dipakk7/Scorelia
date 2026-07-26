import React, { useState } from 'react'
import { useInsights } from '@/hooks/useInsights'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import { useNotifications } from '@/hooks/useNotifications'
import { InsightsHeader } from './InsightsHeader'
import { InsightsTabs, type InsightsTabId } from './InsightsTabs'
import { AIInsightsPanel } from './AIInsightsPanel'
import { ActivityTimeline } from './ActivityTimeline'
import { SystemHealthPanel } from './SystemHealthPanel'
import { QuickActionsPanel } from './QuickActionsPanel'
import { NotificationCenter } from './NotificationCenter'
import { InsightsSkeleton } from './InsightsSkeleton'
import { cn } from '@/lib/utils'

export interface InsightsActivityWorkspaceProps {
  isLoading?: boolean
  className?: string
}

export function InsightsActivityWorkspace({
  isLoading: propIsLoading = false,
  className,
}: InsightsActivityWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<InsightsTabId>('insights')

  const { isLoading: queryIsLoadingInsights } = useInsights()
  const { isLoading: queryIsLoadingHealth } = useSystemHealth()
  const { isLoading: queryIsLoadingNotifications } = useNotifications()

  if (propIsLoading || queryIsLoadingInsights || queryIsLoadingHealth || queryIsLoadingNotifications) {
    return <InsightsSkeleton className={className} />
  }

  return (
    <section
      aria-label="Insights, Activity & System Health Workspace"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Insights Header */}
      <InsightsHeader />

      {/* 2. System Health & Resource Usage Overview */}
      <SystemHealthPanel />

      {/* 3. Quick System Operational Actions */}
      <QuickActionsPanel />

      {/* 4. Section Tabs (Insights, Activity, Notifications) */}
      <InsightsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 5. Tab View Panels */}
      <div
        id={`insights-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`insights-tab-${activeTab}`}
      >
        {activeTab === 'insights' && <AIInsightsPanel />}
        {activeTab === 'activity' && <ActivityTimeline />}
        {activeTab === 'notifications' && <NotificationCenter />}
      </div>
    </section>
  )
}

export default InsightsActivityWorkspace
