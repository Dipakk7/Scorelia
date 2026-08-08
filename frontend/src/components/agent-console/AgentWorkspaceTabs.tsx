import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  icon: React.ElementType
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
  const activeTabRef = useRef<HTMLButtonElement | null>(null)

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

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeTab])

  return (
    <div className={cn('sticky top-2 z-30 backdrop-blur-md bg-[#111322]/85 border border-white/10 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none text-left', className)}>
      <nav
        role="tablist"
        aria-label="Agent Console Workspace Sections"
        className="flex items-center gap-1.5 p-1 bg-[#0b0c14]/70 border border-white/5 rounded-xl w-max min-w-full sm:min-w-0 select-none"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              role="tab"
              id={`agent-tab-${tab.id}`}
              aria-controls={`agent-tabpanel-${tab.id}`}
              aria-selected={isActive}
              onClick={() => onTabChange && onTabChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none z-10',
                isActive
                  ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md shadow-purple-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium border border-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 relative z-10 transition-colors duration-200 pointer-events-none shrink-0',
                  isActive ? 'text-purple-200' : 'text-slate-400'
                )}
              />
              <span
                className={cn(
                  'relative z-10 transition-colors duration-200 pointer-events-none',
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="agentActiveTabIndicator"
                  className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default AgentWorkspaceTabs
