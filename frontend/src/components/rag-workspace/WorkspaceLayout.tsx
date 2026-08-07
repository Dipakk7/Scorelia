import React from 'react'
import type { RAGTabId } from './WorkspaceTabs'
import { CollectionsWorkspacePlaceholder } from './placeholders/CollectionsWorkspacePlaceholder'
import { QueryWorkspacePlaceholder } from './placeholders/QueryWorkspacePlaceholder'
import { AnalyticsWorkspacePlaceholder } from './placeholders/AnalyticsWorkspacePlaceholder'
import { DocumentsWorkspacePlaceholder } from './placeholders/DocumentsWorkspacePlaceholder'
import { SettingsWorkspacePlaceholder } from './placeholders/SettingsWorkspacePlaceholder'
import { ReportsWorkspace } from './ReportsWorkspace'
import { SystemHealthCard } from './placeholders/SystemHealthCard'
import { RetrievalPerformanceCard } from './placeholders/RetrievalPerformanceCard'
import { TopRetrievedDocsCard } from './placeholders/TopRetrievedDocsCard'
import { SidebarContainer } from './SidebarContainer'
import { cn } from '@/lib/utils'

export interface WorkspaceLayoutProps {
  activeTab: RAGTabId
  className?: string
}

export function WorkspaceLayout({ activeTab, className }: WorkspaceLayoutProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'collections':
        return <CollectionsWorkspacePlaceholder />
      case 'query':
        return <QueryWorkspacePlaceholder />
      case 'analytics':
        return <AnalyticsWorkspacePlaceholder />
      case 'documents':
        return <DocumentsWorkspacePlaceholder />
      case 'reports':
        return <ReportsWorkspace />
      case 'settings':
        return <SettingsWorkspacePlaceholder />
      default:
        return <CollectionsWorkspacePlaceholder />
    }
  }

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start', className)}>
      {/* Primary Workspace Column (8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-5 sm:space-y-6">
        {renderTabContent()}
      </div>

      {/* Right Sidebar & System Health Column (4 cols on desktop) */}
      <div className="lg:col-span-4 space-y-5 sm:space-y-6">
        <SidebarContainer />
        <SystemHealthCard />
        <RetrievalPerformanceCard />
        <TopRetrievedDocsCard />
      </div>
    </div>

  )
}

export default WorkspaceLayout
