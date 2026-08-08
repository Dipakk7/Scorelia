import React, { useState } from 'react'
import { SettingsTabs } from '@/components/settings/SettingsTabs'
import { SettingsWorkspace } from '@/components/settings/SettingsWorkspace'
import { settingsMockData } from '@/components/settings/settingsMockData'
import { SettingsHeader } from '@/components/settings/SettingsHeader'
import { accountOverviewMockData } from '@/components/settings/accountOverviewMockData'
import { cn } from '@/lib/utils'

export interface ConsoleSettingsWorkspaceProps {
  className?: string
}

export function ConsoleSettingsWorkspace({ className }: ConsoleSettingsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<string>('general')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className={cn('space-y-4 sm:space-y-5 text-left font-sans w-full max-w-full min-w-0', className)}>
      {/* Settings Workspace Header */}
      <SettingsHeader
        title="Agent Console Settings & Governance"
        subtitle="Manage agent runtime limits, model parameters, integration keys, security policies, and workspace preferences."
        searchPlaceholder="Search settings, tokens, policies..."
        searchValue={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        avatarUrl={accountOverviewMockData.userProfile.avatarUrl}
        userName={accountOverviewMockData.userProfile.name}
      />

      {/* Navigation Sub-Tabs */}
      <div className="sticky top-0 z-10 bg-[#0b0c14]/90 backdrop-blur-md pt-1 pb-2 border-b border-white/10">
        <SettingsTabs
          tabs={settingsMockData.tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Main Settings Category Workspace */}
      <div className="p-5 rounded-2xl bg-[#111322] border border-white/10 shadow-xl">
        <SettingsWorkspace activeTab={activeTab} />
      </div>
    </div>
  )
}

export default ConsoleSettingsWorkspace
