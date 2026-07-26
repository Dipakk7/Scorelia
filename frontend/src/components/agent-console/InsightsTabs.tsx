import React, { useRef } from 'react'
import { Sparkles, Activity, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

export type InsightsTabId = 'insights' | 'activity' | 'notifications'

export interface InsightsTabItem {
  id: InsightsTabId
  label: string
  count?: number
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export interface InsightsTabsProps {
  activeTab: InsightsTabId
  onTabChange: (tabId: InsightsTabId) => void
  insightsCount?: number
  activityCount?: number
  unreadNotificationsCount?: number
  className?: string
}

export function InsightsTabs({
  activeTab,
  onTabChange,
  insightsCount = 10,
  activityCount = 20,
  unreadNotificationsCount = 4,
  className,
}: InsightsTabsProps) {
  const tabListRef = useRef<HTMLDivElement>(null)

  const tabs: InsightsTabItem[] = [
    { id: 'insights', label: 'AI Insights', count: insightsCount, icon: Sparkles },
    { id: 'activity', label: 'Activity Timeline', count: activityCount, icon: Activity },
    { id: 'notifications', label: 'Notification Center', count: unreadNotificationsCount, icon: Bell },
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
        aria-label="Insights, Activity & Notifications Tabs"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
      >
        {tabs.map((tab, idx) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              role="tab"
              id={`insights-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`insights-tabpanel-${tab.id}`}
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
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold',
                    isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
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

export default InsightsTabs
