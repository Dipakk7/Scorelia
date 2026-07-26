import React, { useState } from 'react'
import { AdministrationHeader } from './AdministrationHeader'
import { AdministrationTabs, type AdminTabId } from './AdministrationTabs'
import { AuditLogsWorkspace } from './AuditLogsWorkspace'
import { ExecutionLogsWorkspace } from './ExecutionLogsWorkspace'
import { ReportsWorkspace } from './ReportsWorkspace'
import { AdministrationPanel } from './AdministrationPanel'
import { AdministrationSkeleton } from './AdministrationSkeleton'
import { cn } from '@/lib/utils'

export interface AdministrationWorkspaceProps {
  initialTab?: AdminTabId
  isLoading?: boolean
  className?: string
}

export function AdministrationWorkspace({
  initialTab = 'audit',
  isLoading = false,
  className,
}: AdministrationWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<AdminTabId>(initialTab)

  if (isLoading) {
    return <AdministrationSkeleton className={className} />
  }

  return (
    <section
      aria-label="Logs, Reports & Administration Workspace"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Header */}
      <AdministrationHeader />

      {/* 2. Navigation Tabs */}
      <AdministrationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 3. Panel Views */}
      <div
        id={`admin-tabpanel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`admin-tab-${activeTab}`}
      >
        {activeTab === 'audit' && <AuditLogsWorkspace />}
        {activeTab === 'execution' && <ExecutionLogsWorkspace />}
        {activeTab === 'reports' && <ReportsWorkspace />}
        {activeTab === 'admin' && <AdministrationPanel />}
      </div>
    </section>
  )
}

export default AdministrationWorkspace
