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
  const [activeTab, setActiveTab] = useState<InsightsTabId>('notifications')

  const { isLoading: queryIsLoadingInsights } = useInsights()
  const { isLoading: queryIsLoadingHealth } = useSystemHealth()
  const { isLoading: queryIsLoadingNotifications } = useNotifications()

  if (propIsLoading || queryIsLoadingInsights || queryIsLoadingHealth || queryIsLoadingNotifications) {
    return <InsightsSkeleton className={className} />
  }

  return (
    <section
      aria-label="System Health & Quick Operational Actions Sidebar"
      className={cn('space-y-5 sm:space-y-6 text-left font-sans', className)}
    >
      {/* 1. Group 1: System Health & Resource Usage Overview */}
      <SystemHealthPanel />

      {/* 2. Group 2: Quick System Operational Actions */}
      <QuickActionsPanel />

      {/* 3. Group 3: Security & Audit Notifications */}
      <NotificationCenter />
    </section>
  )
}

export default InsightsActivityWorkspace
