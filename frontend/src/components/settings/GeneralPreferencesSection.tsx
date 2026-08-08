import React from 'react'
import { ResetDefaultsButton } from './ResetDefaultsButton'
import { SettingsSelectCard } from './SettingsSelectCard'
import { generalPreferencesMockData } from './generalPreferencesMockData'
import { useSettingsQuery, useUpdateGeneralMutation } from '@/hooks/settings/useSettingsHooks'
import { cn } from '@/lib/utils'

export interface GeneralPreferencesSectionProps {
  onResetDefaults?: () => void
  onPreferenceChange?: (id: string, value: string) => void
  disabled?: boolean
  className?: string
}

export const GeneralPreferencesSection: React.FC<GeneralPreferencesSectionProps> = ({
  onResetDefaults,
  onPreferenceChange,
  disabled = false,
  className,
}) => {
  const { data: settings } = useSettingsQuery()
  const updateGeneralMutation = useUpdateGeneralMutation()

  const currentValues: Record<string, string> = {
    language: settings?.language || 'en-US',
    timezone: settings?.timezone || 'Asia/Kolkata',
    date_format: settings?.date_format || 'YYYY-MM-DD',
    time_format: settings?.time_format || '12h',
    default_module: settings?.default_module || 'general',
    items_per_page: String(settings?.items_per_page || 25),
  }

  const handleChange = (id: string, val: string) => {
    onPreferenceChange?.(id, val)
    updateGeneralMutation.mutate({
      [id]: id === 'items_per_page' ? Number(val) : val,
    })
  }

  return (
    <section
      aria-label="General Preferences"
      className={cn('space-y-4 text-left font-sans w-full', className)}
    >
      {/* Header & Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight font-sans">
            {generalPreferencesMockData.sectionTitle}
          </h2>
          <p className="text-xs text-slate-400 font-medium font-sans">
            {generalPreferencesMockData.sectionSubtitle}
          </p>
        </div>
        <ResetDefaultsButton
          onClick={onResetDefaults}
          disabled={disabled || updateGeneralMutation.isPending}
          label={generalPreferencesMockData.resetButtonLabel}
          className="self-start sm:self-auto"
        />
      </div>

      {/* 6 Preference Select Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 w-full">
        {generalPreferencesMockData.items.map((item) => (
          <SettingsSelectCard
            key={item.id}
            item={item}
            value={currentValues[item.id] || item.defaultValue}
            onChange={(val) => handleChange(item.id, val)}
            disabled={disabled || updateGeneralMutation.isPending}
          />
        ))}
      </div>
    </section>
  )
}

export default GeneralPreferencesSection
