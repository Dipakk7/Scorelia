import React, { useState } from 'react'
import { Bell, Mail, Smartphone, MessageSquare, Monitor, Save, RotateCcw, Loader2, CheckCircle2 } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { useSettingsQuery, useUpdateNotificationMutation } from '@/hooks/settings/useSettingsHooks'

export const NotificationSettings: React.FC = () => {
  const notifs = settingsCategoriesMockData.notifications
  const { data: settings } = useSettingsQuery()
  const updateNotifMutation = useUpdateNotificationMutation()
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleToggle = (id: string, checked: boolean) => {
    if (id === 'n-em-1' || id === 'n-ph-1') {
      updateNotifMutation.mutate({ email_notifications: checked })
    } else if (id === 'n-em-2' || id === 'n-ph-2') {
      updateNotifMutation.mutate({ smart_suggestions: checked })
    } else if (id === 'n-app-2') {
      updateNotifMutation.mutate({ sound_effects: checked })
    }
  }

  const getToggleState = (id: string, fallback: boolean) => {
    if (!settings) return fallback
    if (id === 'n-em-1' || id === 'n-ph-1') return settings.email_notifications
    if (id === 'n-em-2' || id === 'n-ph-2') return settings.smart_suggestions
    if (id === 'n-app-2') return settings.sound_effects
    return fallback
  }

  const handleSaveAll = () => {
    setIsSaving(true)
    setSavedSuccess(false)
    setTimeout(() => {
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 500)
  }

  return (
    <SettingsCategoryLayout
      icon={<Bell className="w-5 h-5 text-purple-400" />}
      title="Notification Preferences"
      subtitle="Choose how and when you receive updates across email, push, SMS, and in-app alerts."
      badge="Alerts Active"
      badgeVariant="success"
      actions={
        <Button
          size="sm"
          onClick={handleSaveAll}
          disabled={isSaving || updateNotifMutation.isPending}
          className="gap-1.5 h-8.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Preferences
            </>
          )}
        </Button>
      }
    >
      {/* 1. Email Notifications */}
      <SettingsCategorySection
        title="Email Notifications"
        description="Receive updates, security warnings, and career digests in your primary inbox."
        icon={<Mail className="w-4 h-4 text-purple-400" />}
      >
        <div className="space-y-1.5 w-full">
          {notifs.email.map((item) => (
            <PreferenceToggle
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              checked={getToggleState(item.id, item.checked)}
              onChange={(chk) => handleToggle(item.id, chk)}
              disabled={updateNotifMutation.isPending}
            />
          ))}
        </div>
      </SettingsCategorySection>

      {/* 2. Push Notifications */}
      <SettingsCategorySection
        title="Push Notifications"
        description="Instant real-time alerts on your desktop browser and mobile device."
        icon={<Smartphone className="w-4 h-4 text-purple-400" />}
      >
        <div className="space-y-1.5 w-full">
          {notifs.push.map((item) => (
            <PreferenceToggle
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              checked={getToggleState(item.id, item.checked)}
              onChange={(chk) => handleToggle(item.id, chk)}
              disabled={updateNotifMutation.isPending}
            />
          ))}
        </div>
      </SettingsCategorySection>

      {/* 3. SMS & In-App Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
        <SettingsCategorySection
          title="SMS Notifications"
          description="Cellular SMS alerts for urgent security codes."
          icon={<MessageSquare className="w-4 h-4 text-purple-400" />}
        >
          <div className="space-y-1.5 w-full">
            {notifs.sms.map((item) => (
              <PreferenceToggle
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                checked={getToggleState(item.id, item.checked)}
                onChange={(chk) => handleToggle(item.id, chk)}
                disabled={updateNotifMutation.isPending}
              />
            ))}
          </div>
        </SettingsCategorySection>

        <SettingsCategorySection
          title="In-App & Audio Notifications"
          description="Workspace badge counters and audio sounds."
          icon={<Monitor className="w-4 h-4 text-purple-400" />}
        >
          <div className="space-y-1.5 w-full">
            {notifs.inApp.map((item) => (
              <PreferenceToggle
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                checked={getToggleState(item.id, item.checked)}
                onChange={(chk) => handleToggle(item.id, chk)}
                disabled={updateNotifMutation.isPending}
              />
            ))}
          </div>
        </SettingsCategorySection>
      </div>

      {/* Action Footer Bar */}
      <Card
        variant="elevated"
        className="p-4 sm:p-5 rounded-2xl bg-[#121426] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-left"
      >
        <p className="text-xs text-slate-400 font-medium">
          Preferences apply instantly across all connected mobile and web sessions.
        </p>
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleSaveAll()}
            disabled={isSaving}
            className="text-xs h-8.5 gap-1.5 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAll}
            disabled={isSaving || updateNotifMutation.isPending}
            className="gap-1.5 h-8.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Notification Preferences
              </>
            )}
          </Button>
        </div>
      </Card>
    </SettingsCategoryLayout>
  )
}

export default NotificationSettings
