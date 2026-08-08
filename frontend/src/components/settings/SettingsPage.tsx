import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { SettingsHeader } from './SettingsHeader'
import { SettingsTabs } from './SettingsTabs'
import { SettingsWorkspace } from './SettingsWorkspace'
import { SettingsSidebar } from './SettingsSidebar'
import { SettingsBottomStatus } from './SettingsBottomStatus'
import { EmptySettingsState } from './EmptySettingsState'
import { SettingsErrorBoundary } from './SettingsErrorBoundary'
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
  const containerVariants = getContainerVariants(shouldReduceMotion)
  const itemVariants = getSectionVariants(shouldReduceMotion)

  const { isLoading: queryLoading, isError: queryError, isFetching, refetch } = useSettingsQuery()

  // Interactive tab selection state
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState('')

  // View state switcher for test validation (Normal, Skeleton, Empty)
  const [viewState, setViewState] = useState<'normal' | 'skeleton' | 'empty'>(
    initialLoading ? 'skeleton' : initialEmpty ? 'empty' : 'normal'
  )

  // Scroll to top on tab change for clean navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeTab])

  const workspaceLoading = viewState === 'skeleton' || queryLoading
  const workspaceEmpty = viewState === 'empty'

  return (
    <SettingsErrorBoundary categoryName="Settings Page" onReset={refetch}>
      <div
        className={cn(
          '-m-4 md:-m-6 lg:-m-8 p-3 sm:p-4 lg:p-5 w-[calc(100%+2rem)] md:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] space-y-4 sm:space-y-5 lg:space-y-6 text-slate-100 selection:bg-purple-500/30 font-sans max-w-[1920px] mx-auto text-left min-h-screen select-none pb-20',
          className
        )}
      >
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="space-y-4 sm:space-y-5 lg:space-y-6 w-full max-w-full"
        >
          {/* 1. V3 Executive Hero Header — Renders immediately without global loading lock */}
          <motion.div variants={itemVariants}>
            <SettingsHeader
              title={settingsMockData.pageTitle}
              subtitle={settingsMockData.pageSubtitle}
              searchPlaceholder={settingsMockData.searchPlaceholder}
              searchValue={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              avatarUrl={accountOverviewMockData.userProfile.avatarUrl}
              userName={accountOverviewMockData.userProfile.name}
            />
          </motion.div>

          {/* View Mode Controller (For visual inspection & testing: Normal / Skeleton / Empty) */}
          <motion.div variants={itemVariants} className="flex items-center justify-end gap-2 text-xs font-mono text-slate-400">
            <span>State Preview:</span>
            <button
              type="button"
              onClick={() => setViewState('normal')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer',
                viewState === 'normal'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-900/60 border-white/10 hover:text-white hover:bg-slate-800'
              )}
            >
              Loaded Page Shell
            </button>
            <button
              type="button"
              onClick={() => setViewState('skeleton')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer',
                viewState === 'skeleton'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-900/60 border-white/10 hover:text-white hover:bg-slate-800'
              )}
            >
              Skeleton
            </button>
            <button
              type="button"
              onClick={() => setViewState('empty')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer',
                viewState === 'empty'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                  : 'bg-slate-900/60 border-white/10 hover:text-white hover:bg-slate-800'
              )}
            >
              Empty State
            </button>
          </motion.div>

          {/* 2. Sticky Navigation Tabs — Rendered immediately */}
          <motion.div variants={itemVariants} className="w-full max-w-full">
            <SettingsTabs
              tabs={settingsMockData.tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </motion.div>

          {/* 3. Master V3 Executive 12-Column Layout */}
          <motion.div
            variants={itemVariants}
            id={`settings-tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`settings-tab-${activeTab}`}
            className="w-full max-w-full"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-start">
              {/* Primary Settings Workspace Column (8-9 columns) */}
              <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 w-full">
                {workspaceEmpty ? (
                  <EmptySettingsState onReload={() => setViewState('normal')} className="py-16" />
                ) : (
                  <SettingsWorkspace
                    activeTab={activeTab}
                    isLoading={workspaceLoading}
                    isError={queryError}
                    onRetry={refetch}
                  />
                )}
              </div>

              {/* Supporting Sidebar Column (3-4 columns) */}
              <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 w-full">
                <SettingsSidebar />
              </div>
            </div>
          </motion.div>

          {/* 4. Bottom Status Bar — Rendered immediately */}
          <motion.div variants={itemVariants}>
            <SettingsBottomStatus isSaving={isFetching} />
          </motion.div>
        </motion.div>
      </div>
    </SettingsErrorBoundary>
  )
}

export default SettingsPage

