import React from 'react'
import { OverviewSummaryCard } from './OverviewSummaryCard'
import { AgentManagementWorkspace } from './AgentManagementWorkspace'
import { ReportsAnalyticsWorkspace } from './ReportsAnalyticsWorkspace'
import { ConsoleSettingsWorkspace } from './ConsoleSettingsWorkspace'
import { cn } from '@/lib/utils'

export interface MainWorkspaceProps {
  activeTab?: string
  className?: string
  onCreateAgentClick?: () => void
}

export function MainWorkspace({ activeTab = 'overview', className, onCreateAgentClick }: MainWorkspaceProps) {
  return (
    <div className={cn('space-y-6 sm:space-y-8 text-left', className)}>
      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <OverviewSummaryCard />
      )}

      {/* AGENTS TAB */}
      {activeTab === 'agents' && (
        <AgentManagementWorkspace onCreateAgentClick={onCreateAgentClick} />
      )}

      {/* REPORTS / ANALYTICS TAB */}
      {(activeTab === 'reports' || activeTab === 'analytics') && (
        <ReportsAnalyticsWorkspace />
      )}

      {/* CONSOLE SETTINGS TAB */}
      {activeTab === 'settings' && (
        <ConsoleSettingsWorkspace />
      )}
    </div>
  )
}

export default MainWorkspace

