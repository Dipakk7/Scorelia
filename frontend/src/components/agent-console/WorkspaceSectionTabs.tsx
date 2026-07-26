import React, { useRef } from 'react'
import { CheckSquare, Workflow, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SectionTabId = 'tasks' | 'automations' | 'knowledge'

export interface SectionTabItem {
  id: SectionTabId
  label: string
  count?: number
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export interface WorkspaceSectionTabsProps {
  activeSection: SectionTabId
  onSectionChange: (sectionId: SectionTabId) => void
  tasksCount?: number
  automationsCount?: number
  knowledgeCount?: number
  className?: string
}

export function WorkspaceSectionTabs({
  activeSection,
  onSectionChange,
  tasksCount = 20,
  automationsCount = 10,
  knowledgeCount = 10,
  className,
}: WorkspaceSectionTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null)

  const sectionTabs: SectionTabItem[] = [
    { id: 'tasks', label: 'Tasks Queue', count: tasksCount, icon: CheckSquare },
    { id: 'automations', label: 'Automations', count: automationsCount, icon: Workflow },
    { id: 'knowledge', label: 'Knowledge Collections', count: knowledgeCount, icon: BookOpen },
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex = currentIndex

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      nextIndex = (currentIndex + 1) % sectionTabs.length
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      nextIndex = (currentIndex - 1 + sectionTabs.length) % sectionTabs.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      nextIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      nextIndex = sectionTabs.length - 1
    }

    if (nextIndex !== currentIndex) {
      const nextTab = sectionTabs[nextIndex]
      onSectionChange(nextTab.id)
      const nextButton = tabListRef.current?.children[nextIndex] as HTMLButtonElement
      nextButton?.focus()
    }
  }

  return (
    <div className={cn('w-full border-b border-white/10 pb-1 text-left', className)}>
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="Tasks, Automations & Knowledge Workspace Tabs"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {sectionTabs.map((tab, idx) => {
          const Icon = tab.icon
          const isActive = activeSection === tab.id

          return (
            <button
              key={tab.id}
              role="tab"
              id={`section-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`section-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSectionChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50',
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md shadow-purple-950/50'
                  : 'bg-[#0b0c14] text-slate-400 border-white/10 hover:text-slate-200 hover:bg-white/5'
              )}
            >
              <Icon size={16} className={cn('transition-colors', isActive ? 'text-white' : 'text-slate-400')} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold',
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WorkspaceSectionTabs
