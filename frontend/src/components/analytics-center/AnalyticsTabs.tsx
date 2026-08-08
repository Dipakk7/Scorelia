import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  PieChart,
  Activity,
  FileText,
  TrendingUp,
  SlidersHorizontal,
  Filter,
} from 'lucide-react'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type AnalyticsTabId =
  | 'overview'
  | 'user_analytics'
  | 'feature_usage'
  | 'performance'
  | 'reports'
  | 'trends'
  | 'custom_reports'

interface AnalyticsTabsProps {
  activeTab: AnalyticsTabId
  onTabChange: (tab: AnalyticsTabId) => void
  onFilterClick?: () => void
  className?: string
}

const tabs: { id: AnalyticsTabId; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'user_analytics', label: 'User Analytics', icon: Users },
  { id: 'feature_usage', label: 'Feature Usage', icon: PieChart },
  { id: 'performance', label: 'Performance', icon: Activity },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'custom_reports', label: 'Custom Reports', icon: SlidersHorizontal },
]

export function AnalyticsTabs({
  activeTab,
  onTabChange,
  onFilterClick,
  className = '',
}: AnalyticsTabsProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const activeTabRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeTab])

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
      className={cn(
        'sticky top-2 z-30 backdrop-blur-md bg-[#0b0c16]/90 border border-white/10 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none custom-scrollbar text-left',
        className
      )}
    >
      <nav
        role="tablist"
        aria-label="Analytics Workspace Navigation Tabs"
        className="flex items-center justify-between gap-1.5 p-1 bg-[#0f101c]/80 border border-white/10 rounded-xl w-max min-w-full sm:min-w-0 select-none"
      >
        <div className="flex items-center gap-1.5">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                role="tab"
                id={`analytics-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`analytics-tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                type="button"
                className={cn(
                  'relative flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-lg text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none z-10',
                  isActive
                    ? 'text-white font-bold bg-purple-600/40 border border-purple-500/50 shadow-md shadow-purple-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-medium'
                )}
              >
                <Icon
                  size={15}
                  className={cn(
                    'shrink-0 transition-colors relative z-10',
                    isActive ? 'text-purple-200' : 'text-slate-400'
                  )}
                  aria-hidden="true"
                />
                <span className={cn('relative z-10 transition-colors', isActive ? 'text-white font-bold' : 'text-slate-400')}>
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeAnalyticsTab"
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 400, damping: 30 }
                    }
                    className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Filter Action Button */}
        {onFilterClick && (
          <div className="shrink-0 flex items-center ml-2 border-l border-white/10 pl-2">
            <button
              type="button"
              onClick={onFilterClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer min-h-[36px]"
              aria-label="Toggle analytics workspace filters"
            >
              <Filter size={13} className="text-slate-400 shrink-0" />
              <span>Filters</span>
            </button>
          </div>
        )}
      </nav>
    </div>
  )
}

export default AnalyticsTabs
