import React from 'react'
import { GeneralPreferencesSection } from './GeneralPreferencesSection'
import { SystemPreferencesSection } from './SystemPreferencesSection'
import { QuickSettingsPanel } from './QuickSettingsPanel'
import { AccountSettings } from './AccountSettings'
import { SecuritySettings } from './SecuritySettings'
import { NotificationSettings } from './NotificationSettings'
import { AppearanceSettings } from './AppearanceSettings'
import { IntegrationsSettings } from './IntegrationsSettings'
import { DataPrivacySettings } from './DataPrivacySettings'
import { BillingSettings } from './BillingSettings'
import { AdvancedSettings } from './AdvancedSettings'
import { EmptySettingsCategoryState } from './EmptySettingsCategoryState'
import { cn } from '@/lib/utils'

export interface SettingsWorkspaceProps {
  activeTab?: string
  onToggleChange?: (categoryId: string, itemId: string, checked: boolean) => void
  onQuickActionClick?: (actionId: string) => void
  className?: string
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({
  activeTab = 'general',
  onToggleChange,
  onQuickActionClick,
  className,
}) => {
  return (
    <div className={cn('space-y-8 text-left font-sans', className)}>
      {activeTab === 'general' && (
        <>
          {/* 1. General Preferences Section (Phase 2) */}
          <GeneralPreferencesSection />

          {/* 2. System Preferences Section (Phase 3) */}
          <SystemPreferencesSection onToggleChange={onToggleChange} />

          {/* 3. Quick Settings Panel (Phase 3) */}
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
    </div>
  )
}

export default SettingsWorkspace
