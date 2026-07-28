import React, { Suspense, lazy } from 'react'
import { GeneralPreferencesSection } from './GeneralPreferencesSection'
import { SystemPreferencesSection } from './SystemPreferencesSection'
import { QuickSettingsPanel } from './QuickSettingsPanel'
import { SettingsCategorySkeleton } from './SettingsCategorySkeleton'
import { EmptySettingsCategoryState } from './EmptySettingsCategoryState'
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
  onToggleChange?: (categoryId: string, itemId: string, checked: boolean) => void
  onQuickActionClick?: (actionId: string) => void
  className?: string
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = React.memo(({
  activeTab = 'general',
  onToggleChange,
  onQuickActionClick,
  className,
}) => {
  return (
    <div className={cn('space-y-8 text-left font-sans', className)}>
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
  )
})

SettingsWorkspace.displayName = 'SettingsWorkspace'
export default SettingsWorkspace
