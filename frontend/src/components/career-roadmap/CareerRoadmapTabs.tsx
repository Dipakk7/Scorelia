import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Map,
  Target,
  Flag,
  FileText,
  BookOpen,
  Briefcase,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
  icon: LucideIcon
}

export interface CareerRoadmapTabsProps {
  activeTab: RoadmapTabId
  onTabChange: (tabId: RoadmapTabId) => void
  className?: string
}

export const ROADMAP_TABS: TabItem[] = [
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'skills-gap', label: 'Skills Gap', icon: Target },
  { id: 'milestones', label: 'Milestones', icon: Flag },
  { id: 'reports', label: 'Reports & Export', icon: FileText },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'recommended-jobs', label: 'Recommended Jobs', icon: Briefcase },
  { id: 'progress-tracker', label: 'Progress Tracker', icon: TrendingUp },
]

export function CareerRoadmapTabs({
  activeTab,
  onTabChange,
  className,
}: CareerRoadmapTabsProps) {
  const activeTabRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeTab])

  return (
    <div
      className={cn(
        'sticky top-2 z-30 backdrop-blur-md bg-slate-950/85 border border-slate-800/80 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none focus:outline-none',
        className
      )}
    >
      <nav
        role="tablist"
        aria-label="Career Roadmap Workspace Sections"
        className="flex items-center gap-1.5 p-1 bg-slate-900/70 border border-slate-800/80 rounded-xl w-max min-w-full sm:min-w-0"
      >
        {ROADMAP_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
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
                'group relative flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none border-none z-10',
                isActive
                  ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md shadow-purple-950/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium bg-transparent'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 relative z-10 transition-colors duration-200 pointer-events-none shrink-0',
                  isActive ? 'text-purple-300' : 'text-slate-400 group-hover:text-slate-200'
                )}
                aria-hidden="true"
              />
              <span className={cn('relative z-10 transition-colors duration-200 pointer-events-none', isActive ? 'text-white font-bold' : 'text-slate-400')}>
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeRoadmapTabIndicator"
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
export default CareerRoadmapTabs
