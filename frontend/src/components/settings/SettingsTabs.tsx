import React from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import type { SettingTab } from './settingsMockData'
import { cn } from '@/lib/utils'

export interface SettingsTabsProps {
  tabs: SettingTab[]
  activeTab: string
  onTabChange?: (tabId: string) => void
  className?: string
}

export const SettingsTabs: React.FC<SettingsTabsProps> = React.memo(({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const nextIndex = (index + 1) % tabs.length
      onTabChange?.(tabs[nextIndex].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      onTabChange?.(tabs[prevIndex].id)
    }
  }

  return (
    <nav
      aria-label="Settings Navigation Tabs"
      className={cn(
        'w-full border-b border-[var(--border)] overflow-x-auto scrollbar-none scroll-smooth flex-nowrap shrink-0 select-none py-1',
        className
      )}
    >
      <div role="tablist" className="flex items-center gap-1 sm:gap-2 min-w-max pb-0.5">
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange?.(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors font-sans rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] min-h-[44px] flex items-center',
                isActive
                  ? 'text-[var(--heading)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)]/50'
              )}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.label}
                {tab.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
                    {tab.badge}
                  </span>
                )}
              </span>

              {/* Active Tab Indicator Underline */}
              {isActive && (
                shouldReduceMotion ? (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full" />
                ) : (
                  <motion.div
                    layoutId="activeSettingsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
})

SettingsTabs.displayName = 'SettingsTabs'
export default SettingsTabs
