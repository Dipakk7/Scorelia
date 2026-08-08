import React, { useRef } from 'react'
import {
  LayoutDashboard,
  Bot,
  CheckSquare,
  Workflow,
  BookOpen,
  Terminal,
  BarChart2,
  Shield,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AgentTabId =
  | 'overview'
  | 'agents'
  | 'tasks'
  | 'automations'
  | 'knowledge'
  | 'logs'
  | 'reports'
  | 'admin'
  | 'settings'

export interface TabItem {
  id: AgentTabId
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export interface AgentWorkspaceTabsProps {
  activeTab?: AgentTabId
  onTabChange?: (tabId: AgentTabId) => void
  className?: string
}

export function AgentWorkspaceTabs({
  activeTab = 'overview',
  onTabChange,
  className,
}: AgentWorkspaceTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null)

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'agents', label: 'Agent Workspace', icon: Bot },
    { id: 'tasks', label: 'Tasks Queue', icon: CheckSquare },
    { id: 'automations', label: 'Automations', icon: Workflow },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'logs', label: 'Logs Stream', icon: Terminal },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
    { id: 'admin', label: 'Administration', icon: Shield },
    { id: 'settings', label: 'Console Settings', icon: Settings },
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = tabs.length - 1
    }

    if (nextIndex !== currentIndex) {
      const nextTab = tabs[nextIndex]
      onTabChange?.(nextTab.id)
      const nextButton = tabListRef.current?.children[nextIndex] as HTMLButtonElement
      nextButton?.focus()
    }
  }

  return (
    <nav
      aria-label="Agent Console Workspace Sections"
      className={cn('w-full border-b border-white/10 pb-2 text-left', className)}
    >
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Agent Console Tabs"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {tabs.map((tab, idx) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              role="tab"
              id={`agent-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`agent-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange?.(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 cursor-pointer whitespace-nowrap border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                  : 'bg-[#0b0c14] text-slate-300 border-white/10 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={16} className={cn('transition-colors', isActive ? 'text-white' : 'text-slate-400')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default AgentWorkspaceTabs
