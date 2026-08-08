import React, { Suspense, lazy } from 'react'
import { GeneralPreferencesSection } from './GeneralPreferencesSection'
import { SystemPreferencesSection } from './SystemPreferencesSection'
import { QuickSettingsPanel } from './QuickSettingsPanel'
import { SettingsCategorySkeleton } from './SettingsCategorySkeleton'
import { EmptySettingsCategoryState } from './EmptySettingsCategoryState'
import { SettingsErrorBoundary } from './SettingsErrorBoundary'
import { cn } from '@/lib/utils'

// Lazy-load non-default category workspace components for code splitting & FCP < 500ms
const AccountSettings = lazy(() => import('./AccountSettings'))
const SecuritySettings = lazy(() => import('./SecuritySettings'))
const NotificationSettings = lazy(() => import('./NotificationSettings'))
const AppearanceSettings = lazy(() => import('./AppearanceSettings'))
const IntegrationsSettings = lazy(() => import('./IntegrationsSettings'))
const DataPrivacySettings = lazy(() => import('./DataPrivacySettings'))
const BillingSettings = lazy(() => import('./BillingSettings'))
const AdvancedSettings = lazy(() => import('./AdvancedSettings'))

export interface SettingsWorkspaceProps {
  activeTab?: string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onToggleChange?: (categoryId: string, itemId: string, checked: boolean) => void
  onQuickActionClick?: (actionId: string) => void
  className?: string
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = React.memo(({
  activeTab = 'general',
  isLoading = false,
  isError = false,
  onRetry,
  onToggleChange,
  onQuickActionClick,
  className,
}) => {
  if (isLoading) {
    return <SettingsCategorySkeleton />
  }

  return (
    <SettingsErrorBoundary categoryName={`Settings Category (${activeTab})`} onReset={onRetry}>
      <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 text-slate-100 text-left font-sans w-full', className)}>
        <Suspense fallback={<SettingsCategorySkeleton />}>
          {activeTab === 'general' && (
            <>
              {/* 1. General Preferences Section */}
              <GeneralPreferencesSection />

              {/* 2. System Preferences Section */}
              <SystemPreferencesSection onToggleChange={onToggleChange} />

              {/* 3. Quick Settings Panel */}
              <QuickSettingsPanel onActionClick={onQuickActionClick} />
            </>
          )}

          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'integrations' && <IntegrationsSettings />}
          {activeTab === 'privacy' && <DataPrivacySettings />}
          {activeTab === 'billing' && <BillingSettings />}
          {activeTab === 'advanced' && <AdvancedSettings />}

          {/* Fallback to guarantee unmapped or invalid activeTab NEVER renders blank */}
          {![
            'general',
            'account',
            'security',
            'notifications',
            'appearance',
            'integrations',
            'privacy',
            'billing',
            'advanced',
          ].includes(activeTab) && <EmptySettingsCategoryState />}
        </Suspense>
      </div>
    </SettingsErrorBoundary>
  )
})

SettingsWorkspace.displayName = 'SettingsWorkspace'
export default SettingsWorkspace
