import React, { useState } from 'react'
import { User, Mail, Globe, Save } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'

export const AccountSettings: React.FC = () => {
  const [formData, setFormData] = useState(settingsCategoriesMockData.account)

  return (
    <SettingsCategoryLayout
      icon={<User className="w-5 h-5 text-[var(--primary)]" />}
      title="Account Settings"
      subtitle="Manage your personal information, contact details, and account visibility."
      badge="Verified Profile"
      badgeVariant="success"
      actions={
        <Button size="sm" className="gap-1.5 h-8 text-xs font-semibold">
          <Save className="w-3.5 h-3.5" />
          Save Account Changes
        </Button>
      }
    >
      {/* 1. Personal Information */}
      <SettingsCategorySection
        title="Personal Information"
        description="Update your display name, professional headline, and location."
        icon={<User className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            defaultValue={formData.personalInfo.name}
            placeholder="Enter full name"
          />
          <Input
            label="Job Title / Professional Headline"
            defaultValue={formData.personalInfo.jobTitle}
            placeholder="e.g. Senior Software Engineer"
          />
          <div className="md:col-span-2 space-y-1 text-left">
            <label className="text-xs font-medium text-[var(--muted)]">Bio</label>
            <textarea
              defaultValue={formData.personalInfo.bio}
              rows={3}
              className="w-full p-3 border rounded-[var(--radius-input)] bg-[var(--surface)] text-[var(--heading)] placeholder-[var(--muted)]/60 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] border-[var(--border)] transition-all"
            />
          </div>
          <Input
            label="Location"
            defaultValue={formData.personalInfo.location}
            placeholder="City, Country"
          />
          <Select label="Profile Visibility" defaultValue={formData.personalInfo.visibility}>
            <option value="public">Public (Visible to recruiters)</option>
            <option value="private">Private (Only me)</option>
            <option value="connections">Connections Only</option>
          </Select>
        </div>
      </SettingsCategorySection>

      {/* 2. Contact Details */}
      <SettingsCategorySection
        title="Contact Details"
        description="Primary contact channels for system notifications and security alerts."
        icon={<Mail className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Primary Email Address"
            defaultValue={formData.contactDetails.email}
            type="email"
          />
          <Input
            label="Secondary Email (Recovery)"
            defaultValue={formData.contactDetails.secondaryEmail}
            type="email"
          />
          <Input
            label="Phone Number"
            defaultValue={formData.contactDetails.phone}
            type="tel"
          />
        </div>
      </SettingsCategorySection>

      {/* 3. Profile Preferences */}
      <SettingsCategorySection
        title="Profile Regional Preferences"
        description="Default language and time display options."
        icon={<Globe className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select label="Default Language" defaultValue={formData.preferences.language}>
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </Select>
          <Select label="Primary Timezone" defaultValue={formData.preferences.timezone}>
            <option value="Asia/Kolkata">(GMT+5:30) Asia/Kolkata</option>
            <option value="UTC">(GMT+0:00) UTC</option>
            <option value="EST">(GMT-5:00) EST</option>
            <option value="PST">(GMT-8:00) PST</option>
          </Select>
        </div>
      </SettingsCategorySection>
    </SettingsCategoryLayout>
  )
}

export default AccountSettings
