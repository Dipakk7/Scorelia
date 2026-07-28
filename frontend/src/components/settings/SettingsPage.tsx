import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getPageVariants } from '@/lib/motion'
import { SettingsHeader } from './SettingsHeader'
import { SettingsTabs } from './SettingsTabs'
import { SettingsWorkspace } from './SettingsWorkspace'
import { SettingsSidebar } from './SettingsSidebar'
import { SettingsBottomStatus } from './SettingsBottomStatus'
import { SettingsSkeleton } from './SettingsSkeleton'
import { EmptySettingsState } from './EmptySettingsState'
import { settingsMockData } from './settingsMockData'
import { accountOverviewMockData } from './accountOverviewMockData'
import { useSettingsQuery } from '@/hooks/settings/useSettingsHooks'
import { cn } from '@/lib/utils'

export interface SettingsPageProps {
  initialTab?: string
  isLoading?: boolean
  isEmpty?: boolean
  className?: string
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  initialTab = 'general',
  isLoading: initialLoading = false,
  isEmpty: initialEmpty = false,
  className,
}) => {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const pageVariants = getPageVariants(shouldReduceMotion)

  const { isFetching } = useSettingsQuery()

  // Interactive tab selection state
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState('')

  // View state switcher for test validation (Normal, Skeleton, Empty)
  const [viewState, setViewState] = useState<'normal' | 'skeleton' | 'empty'>(
    initialLoading ? 'skeleton' : initialEmpty ? 'empty' : 'normal'
  )

  // Scroll to top on tab change for clean navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })
  }, [activeTab, shouldReduceMotion])

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'space-y-6 text-left max-w-[1680px] mx-auto font-sans p-3 sm:p-5 lg:p-6 pb-20 min-h-screen text-[var(--body)] select-none',
        className
      )}
    >
      {/* 1. Header (Title, Subtitle, Search Field, Top Action Buttons) */}
      <SettingsHeader
        title={settingsMockData.pageTitle}
        subtitle={settingsMockData.pageSubtitle}
        searchPlaceholder={settingsMockData.searchPlaceholder}
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        avatarUrl={accountOverviewMockData.userProfile.avatarUrl}
        userName={accountOverviewMockData.userProfile.name}
      />

      {/* View Mode Controller (For visual inspection & testing: Normal / Skeleton / Empty) */}
      <div className="flex items-center justify-end gap-2 text-xs font-mono text-[var(--muted)]">
        <span>State Preview:</span>
        <button
          type="button"
          onClick={() => setViewState('normal')}
          className={cn(
            'px-2 py-0.5 rounded text-[11px] border transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
            viewState === 'normal'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-bold'
              : 'bg-[var(--surface-elevated)] border-[var(--border)] hover:text-[var(--heading)]'
          )}
        >
          Loaded Page Shell
        </button>
        <button
          type="button"
          onClick={() => setViewState('skeleton')}
          className={cn(
            'px-2 py-0.5 rounded text-[11px] border transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
            viewState === 'skeleton'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-bold'
              : 'bg-[var(--surface-elevated)] border-[var(--border)] hover:text-[var(--heading)]'
          )}
        >
          Skeleton
        </button>
        <button
          type="button"
          onClick={() => setViewState('empty')}
          className={cn(
            'px-2 py-0.5 rounded text-[11px] border transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
            viewState === 'empty'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)] font-bold'
              : 'bg-[var(--surface-elevated)] border-[var(--border)] hover:text-[var(--heading)]'
          )}
        >
          Empty State
        </button>
      </div>

      {viewState === 'skeleton' ? (
        <SettingsSkeleton />
      ) : viewState === 'empty' ? (
        <EmptySettingsState onReload={() => setViewState('normal')} className="py-16" />
      ) : (
        <div className="space-y-6">
          {/* 2. Sticky Navigation Tabs */}
          <div className="sticky top-0 z-20 bg-[var(--background)]/90 backdrop-blur-md pt-2 pb-1">
            <SettingsTabs
              tabs={settingsMockData.tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* 3. Executive Responsive Two-Column Layout (Main Workspace + Right Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Workspace Column */}
            <div className="lg:col-span-8 xl:col-span-9 w-full">
              <SettingsWorkspace activeTab={activeTab} />
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 xl:col-span-3 w-full">
              <SettingsSidebar />
            </div>
          </div>

          {/* 4. Bottom Status Bar (Full Width Spans Workspace) */}
          <SettingsBottomStatus isSaving={isFetching} />
        </div>
      )}
    </motion.main>
  )
}

export default SettingsPage
