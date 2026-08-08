import React from 'react'
import { KPIGrid } from './KPIGrid'
import { MainWorkspace } from './MainWorkspace'
import { RightSidebar } from './RightSidebar'
import { IntelligenceAuditWorkspace } from './IntelligenceAuditWorkspace'
import { cn } from '@/lib/utils'

export interface WorkspaceLayoutProps {
  activeTab?: string
  className?: string
}

export function WorkspaceLayout({ activeTab = 'overview', className }: WorkspaceLayoutProps) {
  return (
    <div className={cn('space-y-5 sm:space-y-6 text-left font-sans w-full max-w-full min-w-0', className)}>
      {/* 1. Hero Telemetry KPI Strip */}
      <KPIGrid />

      {/* 2. Primary 12-Column Responsive Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start w-full max-w-full">
        {/* Left Column: Primary Operational Content (8 Columns on Desktop) */}
        <main className="lg:col-span-8 space-y-5 sm:space-y-6 min-w-0">
          <MainWorkspace activeTab={activeTab} />
          {activeTab === 'overview' && (
            <IntelligenceAuditWorkspace />
          )}
        </main>

        {/* Right Column: Supporting System Health, Quick Actions & Notifications (4 Columns on Desktop) */}
        <aside aria-label="Agent Console Companion Sidebar" className="lg:col-span-4 space-y-5 sm:space-y-6 min-w-0">
          <RightSidebar />
        </aside>
      </div>
    </div>
  )
}

export default WorkspaceLayout
