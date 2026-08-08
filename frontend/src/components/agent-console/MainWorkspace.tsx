import React from 'react'
import { AgentManagementWorkspace } from './AgentManagementWorkspace'
import { PerformanceAnalyticsWorkspace } from './PerformanceAnalyticsWorkspace'
import { cn } from '@/lib/utils'

export interface MainWorkspaceProps {
  activeTab?: string
  className?: string
  onCreateAgentClick?: () => void
}

export function MainWorkspace({ activeTab = 'overview', className, onCreateAgentClick }: MainWorkspaceProps) {
  const showManagement = activeTab === 'overview' || activeTab === 'agents' || activeTab === 'settings'
  const showAnalytics = activeTab === 'overview' || activeTab === 'analytics' || activeTab === 'insights'

  return (
    <div className={cn('space-y-6 sm:space-y-8 text-left', className)}>
      {/* 1. AGENT MANAGEMENT WORKSPACE */}
      {showManagement && (
        <AgentManagementWorkspace onCreateAgentClick={onCreateAgentClick} />
      )}

      {/* 2. PERFORMANCE ANALYTICS & MONITORING WORKSPACE */}
      {showAnalytics && (
        <PerformanceAnalyticsWorkspace />
      )}
    </div>
  )
}

export default MainWorkspace
