import React from 'react'
import {
  FolderArchive,
  Terminal,
  BarChart3,
  FileText,
  Settings,
  FileSpreadsheet,
  Network
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type RAGTabId = 'collections' | 'documents' | 'query' | 'knowledge-graph' | 'analytics' | 'reports' | 'settings'

export interface WorkspaceTabsProps {
  activeTab: RAGTabId
  onTabChange: (tab: RAGTabId) => void
  className?: string
}

export function WorkspaceTabs({
  activeTab,
  onTabChange,
  className
}: WorkspaceTabsProps) {
  const tabs: { id: RAGTabId; label: string; icon: any }[] = [
    { id: 'collections', label: 'Collections', icon: FolderArchive },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'query', label: 'Query Playground', icon: Terminal },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIndex = (index + 1) % tabs.length
      onTabChange(tabs[nextIndex].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      onTabChange(tabs[prevIndex].id)
    }
  }

  return (
    <div
      role="tablist"
      aria-label="RAG Workspace Navigation Tabs"
      className={cn(
        'flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--surface)]/80 border border-[var(--border)] shadow-[var(--shadow-sm)] backdrop-blur-md overflow-x-auto custom-scrollbar text-left select-none',
        className
      )}
    >
      {tabs.map((tab, idx) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`workspace-tabpanel-${tab.id}`}
            id={`workspace-tab-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            type="button"
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 min-h-[40px] border-none',
              isActive
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30 font-bold'
                : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)]'
            )}
          >
            <Icon size={15} className={cn('shrink-0', isActive ? 'text-white' : 'text-[var(--muted)]')} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default WorkspaceTabs

