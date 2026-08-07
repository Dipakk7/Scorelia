import React from 'react'
import type { RAGTabId } from './WorkspaceTabs'
import { CollectionsWorkspace } from './CollectionsWorkspace'
import { DocumentsWorkspace } from './DocumentsWorkspace'
import { QueryPlayground } from './QueryPlayground'
import { KnowledgeGraphWorkspace } from './KnowledgeGraphWorkspace'
import { RetrievalAnalyticsWorkspace } from './RetrievalAnalyticsWorkspace'
import { ReportsWorkspace } from './ReportsWorkspace'
import { WorkspaceSettings } from './WorkspaceSettings'
import { cn } from '@/lib/utils'

export interface WorkspaceLayoutProps {
  activeTab: RAGTabId
  className?: string
}

export function WorkspaceLayout({ activeTab, className }: WorkspaceLayoutProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'collections':
        return <CollectionsWorkspace />
      case 'documents':
        return <DocumentsWorkspace />
      case 'query':
        return <QueryPlayground />
      case 'knowledge-graph':
        return <KnowledgeGraphWorkspace />
      case 'analytics':
        return <RetrievalAnalyticsWorkspace />
      case 'reports':
        return <ReportsWorkspace />
      case 'settings':
        return <WorkspaceSettings />
      default:
        return <CollectionsWorkspace />
    }
  }

  return (
    <div className={cn('w-full text-left', className)}>
      {renderTabContent()}
    </div>
  )
}

export default WorkspaceLayout
