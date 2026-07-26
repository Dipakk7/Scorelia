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
    <div className={cn('grid grid-cols-1 lg:grid-cols-12 gap-6 items-start', className)}>
      {/* Left Workspace Column (Desktop ~65%, Tablet 7-cols, Mobile 1-col) */}
      <div className="lg:col-span-7 xl:col-span-7 space-y-6">
        {renderTabContent()}
      </div>

      {/* Center Column - Health, Performance & Top Docs (Desktop ~15-20%, Tablet 5-cols, Mobile 1-col) */}
      <div className="lg:col-span-5 xl:col-span-2.5 space-y-6">
        <SystemHealthCard />
        <RetrievalPerformanceCard />
        <TopRetrievedDocsCard />
      </div>

      {/* Right Sidebar Column - AI Assistant, Insights & Quick Actions (Desktop ~20%, Tablet 12-cols stacked, Mobile 1-col) */}
      <div className="lg:col-span-12 xl:col-span-2.5 space-y-6">
        <SidebarContainer />
      </div>
    </div>
  )
}

export default WorkspaceLayout
