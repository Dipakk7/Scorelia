import React from 'react'
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

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length
      onTabChange(tabs[nextIndex].id)
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      onTabChange(tabs[prevIndex].id)
    }
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3 ${className}`}
      role="tablist"
      aria-label="Analytics Module Navigation Tabs"
    >
      {/* Scrollable Tabs Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-1">
        {tabs.map((tab, idx) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              id={`analytics-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`analytics-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {/* Active Tab Highlight Pill */}
              {isActive && (
                <motion.div
                  layoutId="activeAnalyticsTab"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 30 }
                  }
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-md shadow-purple-900/30 -z-10"
                />
              )}

              <Icon
                size={15}
                className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`}
                aria-hidden="true"
              />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Right Side Filter Button */}
      <div className="shrink-0 flex items-center">
        <button
          type="button"
          onClick={onFilterClick}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#121320] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer min-h-[40px]"
          aria-label="Toggle analytics workspace filters"
        >
          <Filter size={14} className="text-slate-400 shrink-0" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  )
}

export default AnalyticsTabs
