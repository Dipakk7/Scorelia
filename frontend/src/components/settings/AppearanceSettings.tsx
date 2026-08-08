import React, { useState } from 'react'
import { Palette, Laptop, Check, Eye, Moon, Sun, Sparkles } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
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

  const [selectedTheme, setSelectedTheme] = useState<'dark' | 'light' | 'system'>('dark')

  const currentAccent = settings?.accent_color || appearance.accentColor
  const currentDensity = settings?.density || appearance.density
  const currentFontSize = settings?.font_size || appearance.fontSize
  const currentDashboardLayout = settings?.dashboard_layout || appearance.dashboardLayout

  const reducedMotion = pData?.reduced_motion ?? false
  const highContrast = pData?.high_contrast ?? false
  const keyboardNav = pData?.keyboard_navigation ?? true

  const handleAccentChange = (accent_color: string) => {
    updateAppearanceMutation.mutate({ accent_color })
  }

  const handleSelectChange = (field: string, value: string) => {
    updateAppearanceMutation.mutate({ [field]: value })
  }

  return (
    <SettingsCategoryLayout
      icon={<Palette className="w-5 h-5 text-purple-400" />}
      title="Appearance & Interface"
      subtitle="Customize application theme modes, accent colors, visual density, and accessibility preferences."
      badge="Executive Dark V3"
      badgeVariant="info"
    >
      {/* 1. Theme Mode Selection Card */}
      <SettingsCategorySection
        title="Color Theme Mode"
        description="Select your preferred application color theme for day or night workflow."
        icon={<Moon className="w-4 h-4 text-purple-400" />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
          {/* Dark Mode Card */}
          <button
            type="button"
            onClick={() => setSelectedTheme('dark')}
            className={cn(
              'p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 cursor-pointer',
              selectedTheme === 'dark'
                ? 'bg-[#14162a] border-purple-500 ring-2 ring-purple-400/40 shadow-xl'
                : 'bg-[#0d0f1e]/80 border-white/10 hover:border-purple-500/30 hover:bg-white/5'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Moon className="w-5 h-5" />
              </div>
              {selectedTheme === 'dark' && (
                <span className="p-1 rounded-full bg-purple-500 text-white shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Executive Dark Mode</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                V3 high-contrast dark theme optimized for low-light environments.
              </p>
            </div>
          </button>

          {/* Light Mode Card */}
          <button
            type="button"
            onClick={() => setSelectedTheme('light')}
            className={cn(
              'p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 cursor-pointer opacity-80 hover:opacity-100',
              selectedTheme === 'light'
                ? 'bg-[#14162a] border-purple-500 ring-2 ring-purple-400/40 shadow-xl'
                : 'bg-[#0d0f1e]/80 border-white/10 hover:border-purple-500/30 hover:bg-white/5'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sun className="w-5 h-5" />
              </div>
              {selectedTheme === 'light' && (
                <span className="p-1 rounded-full bg-purple-500 text-white shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Clean Light Mode</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                High legibility light background surface for daytime working hours.
              </p>
            </div>
          </button>

          {/* System Default Card */}
          <button
            type="button"
            onClick={() => setSelectedTheme('system')}
            className={cn(
              'p-4 sm:p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-3 cursor-pointer opacity-80 hover:opacity-100',
              selectedTheme === 'system'
                ? 'bg-[#14162a] border-purple-500 ring-2 ring-purple-400/40 shadow-xl'
                : 'bg-[#0d0f1e]/80 border-white/10 hover:border-purple-500/30 hover:bg-white/5'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Laptop className="w-5 h-5" />
              </div>
              {selectedTheme === 'system' && (
                <span className="p-1 rounded-full bg-purple-500 text-white shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </span>
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">System Sync</h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Automatically matches your operating system theme preferences.
              </p>
            </div>
          </button>
        </div>
      </SettingsCategorySection>

      {/* 2. Accent Color Palette */}
      <SettingsCategorySection
        title="Accent Color Palette"
        description="Choose a custom accent highlight color across buttons, badges, and active rings."
        icon={<Palette className="w-4 h-4" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5 font-sans">
          {appearance.accentColorsList.map((color) => {
            const isSelected = currentAccent === color.value
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => handleAccentChange(color.value)}
                disabled={updateAppearanceMutation.isPending}
                className={cn(
                  'p-3.5 rounded-xl border flex flex-col items-center gap-2.5 transition-all text-center cursor-pointer',
                  isSelected
                    ? 'border-purple-500 bg-purple-950/20 ring-2 ring-purple-400/40 shadow-md'
                    : 'border-white/10 bg-[#0d0f1e]/80 hover:border-purple-500/40 hover:bg-white/5'
                )}
              >
                <span
                  className="w-7 h-7 rounded-full border border-white/20 shadow-md flex items-center justify-center text-white transition-transform hover:scale-105"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </span>
                <span className="text-xs font-bold text-white truncate w-full font-sans">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
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

      {/* 4. Accessibility Preferences */}
      <SettingsCategorySection
        title="Accessibility & Motion"
        description="Configure reduced motion, high contrast modes, and keyboard navigation rings."
        icon={<Eye className="w-4 h-4 text-cyan-400" />}
      >
        <div className="space-y-1.5 w-full">
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
