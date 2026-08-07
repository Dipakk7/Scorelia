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
    <div className="sticky top-2 z-30 backdrop-blur-md bg-slate-950/85 border border-slate-800/80 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none custom-scrollbar">
      <nav
        role="tablist"
        aria-label="RAG Workspace Navigation Tabs"
        className={cn(
          'flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800/80 rounded-xl w-max min-w-full sm:min-w-0 select-none',
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
                'relative flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none border border-transparent z-10',
                isActive
                  ? 'text-white font-bold bg-purple-600/40 border-purple-500/50 shadow-md shadow-purple-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
              )}
            >
              <Icon size={15} className={cn('shrink-0 transition-colors', isActive ? 'text-purple-200' : 'text-slate-400')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default WorkspaceTabs

