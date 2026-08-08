import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import {
  Sliders,
  User,
  ShieldCheck,
  Bell,
  Palette,
  Share2,
  Lock,
  CreditCard,
  Wrench,
} from 'lucide-react'
import type { SettingTab } from './settingsMockData'
import { cn } from '@/lib/utils'

export interface SettingsTabsProps {
  tabs: SettingTab[]
  activeTab: string
  onTabChange?: (tabId: string) => void
  className?: string
}

const TAB_ICON_MAP: Record<string, React.ElementType> = {
  general: Sliders,
  account: User,
  security: ShieldCheck,
  notifications: Bell,
  appearance: Palette,
  integrations: Share2,
  privacy: Lock,
  billing: CreditCard,
  advanced: Wrench,
}

export const SettingsTabs: React.FC<SettingsTabsProps> = React.memo(({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
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
      onTabChange?.(tabs[nextIndex].id)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prevIndex = (index - 1 + tabs.length) % tabs.length
      onTabChange?.(tabs[prevIndex].id)
    }
  }

  return (
    <div
      className={cn(
        'sticky top-2 z-30 backdrop-blur-md bg-[#111322]/85 border border-white/10 p-1.5 rounded-2xl shadow-xl transition-all overflow-x-auto scrollbar-none text-left w-full max-w-full',
        className
      )}
    >
      <nav
        role="tablist"
        aria-label="Settings Navigation Workspace"
        className="flex items-center gap-1.5 p-1 bg-[#0b0c14]/70 border border-white/5 rounded-xl w-max min-w-full sm:min-w-0 select-none"
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab
          const Icon = TAB_ICON_MAP[tab.id] || Sliders

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              type="button"
              role="tab"
              id={`settings-tab-${tab.id}`}
              aria-controls={`settings-tabpanel-${tab.id}`}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onTabChange?.(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg text-xs sm:text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none whitespace-nowrap cursor-pointer select-none z-10 font-sans',
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
              <span className="relative z-10 transition-colors duration-200 pointer-events-none">
                {tab.label}
              </span>
              {tab.badge && (
                <span className="relative z-10 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  {tab.badge}
                </span>
              )}

              {/* Active Tab Motion Indicator */}
              {isActive && (
                shouldReduceMotion ? (
                  <div className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0" />
                ) : (
                  <motion.div
                    layoutId="settingsActiveTabIndicator"
                    className="absolute inset-0 bg-purple-500/20 rounded-lg border border-purple-400/50 pointer-events-none z-0"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
})

SettingsTabs.displayName = 'SettingsTabs'
export default SettingsTabs

