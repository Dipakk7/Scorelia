import React from 'react'
import { Bell, Mail, Smartphone, MessageSquare, Monitor } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { PreferenceToggle } from './PreferenceToggle'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { useSettingsQuery, useUpdateNotificationMutation } from '@/hooks/settings/useSettingsHooks'

export const NotificationSettings: React.FC = () => {
  const notifs = settingsCategoriesMockData.notifications
  const { data: settings } = useSettingsQuery()
  const updateNotifMutation = useUpdateNotificationMutation()

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

  return (
    <SettingsCategoryLayout
      icon={<Bell className="w-5 h-5 text-[var(--primary)]" />}
      title="Notification Preferences"
      subtitle="Choose how and when you receive updates across email, push, SMS, and in-app alerts."
    >
      {/* 1. Email Notifications */}
      <SettingsCategorySection
        title="Email Notifications"
        description="Receive updates, security warnings, and career digests in your primary inbox."
        icon={<Mail className="w-4 h-4" />}
      >
        <div className="space-y-1">
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
        icon={<Smartphone className="w-4 h-4" />}
      >
        <div className="space-y-1">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SettingsCategorySection
          title="SMS Notifications"
          description="Cellular SMS alerts for urgent security codes."
          icon={<MessageSquare className="w-4 h-4" />}
        >
          <div className="space-y-1">
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
          icon={<Monitor className="w-4 h-4" />}
        >
          <div className="space-y-1">
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
    </SettingsCategoryLayout>
  )
}

export default NotificationSettings
