import React from 'react'
import { PreferenceCategoryCard } from './PreferenceCategoryCard'
import { systemPreferencesMockData } from './systemPreferencesMockData'
import { useSettingsQuery, useUpdateSystemMutation } from '@/hooks/settings/useSettingsHooks'
import type { UserSettingsResponse } from '@/services/settings/settingsApi'
import { cn } from '@/lib/utils'

export interface SystemPreferencesSectionProps {
  onToggleChange?: (categoryId: string, itemId: string, checked: boolean) => void
  disabled?: boolean
  className?: string
}

export const SystemPreferencesSection: React.FC<SystemPreferencesSectionProps> = ({
  onToggleChange,
  disabled = false,
  className,
}) => {
  const { data: settings } = useSettingsQuery()
  const updateSystemMutation = useUpdateSystemMutation()

  const handleToggle = (categoryId: string, itemId: string, checked: boolean) => {
    onToggleChange?.(categoryId, itemId, checked)

    const mapKey: Record<string, string> = {
      'auto-save': 'auto_save',
      'cloud-sync': 'cloud_sync',
      'analytics-tracking': 'analytics_tracking',
      'performance-mode': 'performance_mode',
      'compact-layout': 'compact_layout',
      'beta-features': 'beta_features',
      'email-notifications': 'email_notifications',
      'smart-suggestions': 'smart_suggestions',
      'sound-effects': 'sound_effects',
    }

    const field = mapKey[itemId] || itemId.replace(/-/g, '_')
    updateSystemMutation.mutate({ [field]: checked })
  }

  // Merge real DB settings values into category toggle definitions
  const updatedCategories = systemPreferencesMockData.categories.map((cat) => ({
    ...cat,
    items: cat.items.map((item) => {
      const mapKey: Record<string, keyof UserSettingsResponse> = {
        'auto-save': 'auto_save',
        'cloud-sync': 'cloud_sync',
        'analytics-tracking': 'analytics_tracking',
        'performance-mode': 'performance_mode',
        'compact-layout': 'compact_layout',
        'beta-features': 'beta_features',
        'email-notifications': 'email_notifications',
        'smart-suggestions': 'smart_suggestions',
        'sound-effects': 'sound_effects',
      }
      const field = mapKey[item.id]
      const dbValue = settings && field ? Boolean(settings[field]) : item.defaultChecked
      return { ...item, defaultChecked: dbValue }
    }),
  }))

  return (
    <section
      aria-label="System Preferences"
      className={cn('space-y-4 text-left font-sans', className)}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[var(--border)]/30">
        <div>
          <h2 className="text-lg font-bold text-[var(--heading)]">
            {systemPreferencesMockData.sectionTitle}
          </h2>
          <p className="text-xs text-[var(--muted)]">
            {systemPreferencesMockData.sectionSubtitle}
          </p>
        </div>
        <a
          href="#manage-all"
          onClick={(e) => e.preventDefault()}
          className="text-xs font-medium text-[var(--primary)] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
        >
          {systemPreferencesMockData.manageAllText}
        </a>
      </div>

      {/* 3 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {updatedCategories.map((cat) => (
          <PreferenceCategoryCard
            key={cat.id}
            category={cat}
            onToggleChange={(itemId, checked) => handleToggle(cat.id, itemId, checked)}
            disabled={disabled || updateSystemMutation.isPending}
          />
        ))}
      </div>
    </section>
  )
}

export default SystemPreferencesSection
