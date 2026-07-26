import React from 'react'
import { cn } from '@/lib/utils'

export type RoadmapTabId =
  | 'roadmap'
  | 'skills-gap'
  | 'milestones'
  | 'reports'
  | 'resources'
  | 'recommended-jobs'
  | 'progress-tracker'

export interface TabItem {
  id: RoadmapTabId
  label: string
}

export interface CareerRoadmapTabsProps {
  activeTab: RoadmapTabId
  onTabChange: (tabId: RoadmapTabId) => void
  className?: string
}

export const ROADMAP_TABS: TabItem[] = [
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'skills-gap', label: 'Skills Gap' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'reports', label: 'Reports & Export' },
  { id: 'resources', label: 'Resources' },
  { id: 'recommended-jobs', label: 'Recommended Jobs' },
  { id: 'progress-tracker', label: 'Progress Tracker' },
]

export function CareerRoadmapTabs({
  activeTab,
  onTabChange,
  className,
}: CareerRoadmapTabsProps) {
  return (
    <div
      className={cn(
        'w-full border-b border-white/10 overflow-x-auto scrollbar-none focus:outline-none',
        className
      )}
    >
      <nav
        role="tablist"
        aria-label="Career Roadmap Sections"
        className="flex items-center gap-6 sm:gap-8 min-w-max pb-px"
      >
        {ROADMAP_TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  const currentIndex = ROADMAP_TABS.findIndex((t) => t.id === activeTab)
                  const nextIndex =
                    e.key === 'ArrowRight'
                      ? (currentIndex + 1) % ROADMAP_TABS.length
                      : (currentIndex - 1 + ROADMAP_TABS.length) % ROADMAP_TABS.length
                  onTabChange(ROADMAP_TABS[nextIndex].id)
                }
              }}
              className={cn(
                'relative py-3.5 min-h-[44px] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border-none bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded-t-lg',
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <span>{tab.label}</span>

              {/* Active Tab Highlight Indicator Bar */}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
export default CareerRoadmapTabs
