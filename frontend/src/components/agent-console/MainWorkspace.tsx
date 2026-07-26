import React from 'react'
import { AgentManagementWorkspace } from './AgentManagementWorkspace'
import { PerformanceAnalyticsWorkspace } from './PerformanceAnalyticsWorkspace'
import { cn } from '@/lib/utils'

export interface MainWorkspaceProps {
  className?: string
  onCreateAgentClick?: () => void
}

export function MainWorkspace({ className, onCreateAgentClick }: MainWorkspaceProps) {
  return (
    <div className={cn('space-y-8 text-left', className)}>
      {/* 1. AGENT MANAGEMENT WORKSPACE (Header, Search, Filters, Table/Grid, Drawer, Pagination) */}
      <AgentManagementWorkspace onCreateAgentClick={onCreateAgentClick} />

      {/* 2. PERFORMANCE ANALYTICS & MONITORING WORKSPACE (Interactive Recharts Charts, Analytics Summary, Toolbars, Legends) */}
      <PerformanceAnalyticsWorkspace />
    </div>
  )
}

export default MainWorkspace
