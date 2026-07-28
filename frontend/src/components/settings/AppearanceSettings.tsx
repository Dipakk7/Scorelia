import React from 'react'
import { Palette, Sun, Moon, Laptop, Check, Eye } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { Select } from '@/components/ui/Select'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { useSettingsQuery, useUpdateAppearanceMutation } from '@/hooks/settings/useSettingsHooks'
import { usePersonalizationQuery, useUpdateAccessibilityMutation } from '@/hooks/personalization/usePersonalizationHooks'
import { cn } from '@/lib/utils'

export const AppearanceSettings: React.FC = () => {
  const appearance = settingsCategoriesMockData.appearance
  const { data: settings } = useSettingsQuery()
  const { data: pData } = usePersonalizationQuery()

  const updateAppearanceMutation = useUpdateAppearanceMutation()
  const updateAccessMutation = useUpdateAccessibilityMutation()

  const currentTheme = settings?.theme || appearance.currentTheme
  const currentAccent = settings?.accent_color || appearance.accentColor
  const currentDensity = settings?.density || appearance.density
  const currentFontSize = settings?.font_size || appearance.fontSize
  const currentDashboardLayout = settings?.dashboard_layout || appearance.dashboardLayout

  const reducedMotion = pData?.reduced_motion ?? false
  const highContrast = pData?.high_contrast ?? false
  const keyboardNav = pData?.keyboard_navigation ?? true

  const handleThemeChange = (theme: string) => {
    updateAppearanceMutation.mutate({ theme })
  }

  const handleAccentChange = (accent_color: string) => {
    updateAppearanceMutation.mutate({ accent_color })
  }

  const handleSelectChange = (field: string, value: string) => {
    updateAppearanceMutation.mutate({ [field]: value })
  }

  return (
    <SettingsCategoryLayout
      icon={<Palette className="w-5 h-5 text-[var(--primary)]" />}
      title="Appearance & Interface"
      subtitle="Customize application theme, accent colors, visual density, and accessibility preferences."
    >
      {/* 1. Theme Selection */}
      <SettingsCategorySection
        title="Theme Mode"
        description="Select your preferred color interface mode."
        icon={<Sun className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Sleek obsidian theme' },
            { id: 'light', label: 'Light Mode', icon: Sun, desc: 'High clarity day theme' },
            { id: 'system', label: 'System Default', icon: Laptop, desc: 'Sync with device OS' },
          ].map((mode) => {
            const Icon = mode.icon
            const isSelected = currentTheme === mode.id
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleThemeChange(mode.id)}
                disabled={updateAppearanceMutation.isPending}
                className={cn(
                  'p-4 rounded-lg border text-left flex flex-col justify-between space-y-3 transition-all',
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary)]/10 ring-2 ring-[var(--primary)]/30'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-md bg-[var(--surface-elevated)] text-[var(--heading)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[var(--primary)]" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--heading)]">{mode.label}</h4>
                  <p className="text-[10px] text-[var(--muted)]">{mode.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </SettingsCategorySection>

      {/* 2. Accent Color Palette */}
      <SettingsCategorySection
        title="Accent Color Palette"
        description="Choose a custom accent highlight color across buttons, badges, and active rings."
        icon={<Palette className="w-4 h-4" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {appearance.accentColorsList.map((color) => {
            const isSelected = currentAccent === color.value
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => handleAccentChange(color.value)}
                disabled={updateAppearanceMutation.isPending}
                className={cn(
                  'p-3 rounded-lg border flex flex-col items-center gap-2 transition-all text-center',
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--surface-elevated)] ring-2 ring-[var(--primary)]/30'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/40'
                )}
              >
                <span
                  className="w-6 h-6 rounded-full border border-white/20 shadow-xs flex items-center justify-center text-white"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </span>
                <span className="text-[11px] font-semibold text-[var(--heading)] truncate w-full">
                  {color.name.split(' ')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </SettingsCategorySection>

      {/* 3. Interface Density & Layout */}
      <SettingsCategorySection
        title="Density & Typography"
        description="Adjust spacing density, font scaling, and executive dashboard layout style."
        icon={<Laptop className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Workspace Density"
            value={currentDensity}
            onChange={(e) => handleSelectChange('density', e.target.value)}
            disabled={updateAppearanceMutation.isPending}
          >
            <option value="comfortable">Comfortable (Default)</option>
            <option value="compact">Compact (High density)</option>
            <option value="spacious">Spacious (Relaxed padding)</option>
          </Select>

          <Select
            label="Typography Scale"
            value={currentFontSize}
            onChange={(e) => handleSelectChange('font_size', e.target.value)}
            disabled={updateAppearanceMutation.isPending}
          >
            <option value="sm">Small (13px body)</option>
            <option value="md">Medium / Standard (14px body)</option>
            <option value="lg">Large (15px body)</option>
          </Select>

          <Select
            label="Dashboard Layout Preset"
            value={currentDashboardLayout}
            onChange={(e) => handleSelectChange('dashboard_layout', e.target.value)}
            disabled={updateAppearanceMutation.isPending}
          >
            <option value="executive">Executive 2-Column Split</option>
            <option value="compact">Compact Overview Grid</option>
            <option value="analytical">Data & Chart Analytical</option>
          </Select>
        </div>
      </SettingsCategorySection>

      {/* 4. Accessibility Preferences (Phase 8) */}
      <SettingsCategorySection
        title="Accessibility & Motion"
        description="Configure reduced motion, high contrast modes, and keyboard navigation rings."
        icon={<Eye className="w-4 h-4 text-cyan-400" />}
      >
        <div className="space-y-1">
          <PreferenceToggle
            id="acc-reduced-motion"
            title="Reduced Motion Animations"
            description="Minimize smooth transitions and Framer Motion spring physics."
            checked={reducedMotion}
            onChange={(chk) => updateAccessMutation.mutate({ reduced_motion: chk })}
            disabled={updateAccessMutation.isPending}
          />
          <PreferenceToggle
            id="acc-high-contrast"
            title="High Contrast Mode"
            description="Increase border contrast and text legibility ratios."
            checked={highContrast}
            onChange={(chk) => updateAccessMutation.mutate({ high_contrast: chk })}
            disabled={updateAccessMutation.isPending}
          />
          <PreferenceToggle
            id="acc-keyboard-nav"
            title="Enhanced Keyboard Focus Ring"
            description="Display prominent focus outline rings during keyboard navigation."
            checked={keyboardNav}
            onChange={(chk) => updateAccessMutation.mutate({ keyboard_navigation: chk })}
            disabled={updateAccessMutation.isPending}
          />
        </div>
      </SettingsCategorySection>
    </SettingsCategoryLayout>
  )
}

export default AppearanceSettings
