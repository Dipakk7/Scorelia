import React, { useRef } from 'react'
import { FileText, Terminal, BarChart2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AdminTabId = 'audit' | 'execution' | 'reports' | 'admin'

export interface AdminTabItem {
  id: AdminTabId
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export interface AdministrationTabsProps {
  activeTab: AdminTabId
  onTabChange: (tabId: AdminTabId) => void
  className?: string
}

export function AdministrationTabs({
  activeTab,
  onTabChange,
  className,
}: AdministrationTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null)

  const tabs: AdminTabItem[] = [
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'execution', label: 'Execution Logs', icon: Terminal },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart2 },
    { id: 'admin', label: 'Administration', icon: Shield },
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
      onTabChange(nextTab.id)
      const nextButton = tabListRef.current?.children[nextIndex] as HTMLButtonElement
      nextButton?.focus()
    }
  }

  return (
    <div className={cn('w-full border-b border-white/10 pb-1 text-left', className)}>
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Logs, Reports & Administration Tabs"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {tabs.map((tab, idx) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              role="tab"
              id={`admin-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`admin-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                  : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <Icon size={15} className={cn('transition-colors', isActive ? 'text-white' : 'text-slate-400')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AdministrationTabs
