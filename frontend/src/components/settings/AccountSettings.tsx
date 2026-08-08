import React, { useState } from 'react'
import { User, Mail, Globe, Save, Camera, CheckCircle2, ShieldCheck, Sparkles, Loader2, RotateCcw } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { settingsCategoriesMockData } from './settingsCategoriesMockData'
import { accountOverviewMockData } from './accountOverviewMockData'

export const AccountSettings: React.FC = () => {
  const [formData, setFormData] = useState(settingsCategoriesMockData.account)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const profile = accountOverviewMockData.userProfile

  const handleSave = () => {
    setIsSaving(true)
    setSavedSuccess(false)
    setTimeout(() => {
      setIsSaving(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    }, 600)
  }

  const handleReset = () => {
    setFormData(settingsCategoriesMockData.account)
  }

  return (
    <SettingsCategoryLayout
      icon={<User className="w-5 h-5 text-purple-400" />}
      title="Account Settings"
      subtitle="Manage your personal profile, identity details, contact channels, and account visibility."
      badge="Verified Profile"
      badgeVariant="success"
      actions={
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="gap-1.5 h-8.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/40"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Changes Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Account Changes
            </>
          )}
        </Button>
      }
    >
      {/* Executive Profile Identity Header Card */}
      <Card
        variant="elevated"
        className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] border border-white/10 shadow-xl relative overflow-hidden font-sans text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar with Camera Overlay */}
            <div className="relative shrink-0 group cursor-pointer">
              <img
                src={profile.avatarUrl}
                alt={formData.personalInfo.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-500/30 shadow-md group-hover:border-purple-400 transition-all"
              />
              <button
                type="button"
                aria-label="Upload profile picture"
                className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-md border border-white/20 transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate font-sans">
                  {formData.personalInfo.name || profile.name}
                </h3>
                <Badge variant="success" className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold px-2 py-0.5">
                  <ShieldCheck className="w-3 h-3 mr-1 inline" />
                  Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-300 font-medium truncate font-sans">
                {formData.contactDetails.email || profile.email}
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400 font-mono flex-wrap">
                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-purple-300">
                  ID: {profile.accountId}
                </span>
                <span>•</span>
                <span>{profile.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="sm:text-right shrink-0 space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10 min-w-[200px]">
            <div className="flex items-center justify-between gap-2 text-xs font-semibold">
              <span className="text-slate-300 font-sans flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Profile Status
              </span>
              <span className="text-purple-400 font-mono">{profile.profileCompletion}% Complete</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profile.profileCompletion}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 1. Personal Information */}
      <SettingsCategorySection
        title="Personal Information"
        description="Update your display name, professional headline, bio, and account visibility."
        icon={<User className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <Input
            label="Full Name"
            defaultValue={formData.personalInfo.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, name: e.target.value },
              }))
            }
            placeholder="Enter full name"
          />
          <Input
            label="Job Title / Professional Headline"
            defaultValue={formData.personalInfo.jobTitle}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, jobTitle: e.target.value },
              }))
            }
            placeholder="e.g. Senior Software Engineer"
          />
          <div className="md:col-span-2 space-y-1.5 text-left">
            <label className="text-xs font-medium text-slate-300 font-sans">Bio & Professional Summary</label>
            <textarea
              defaultValue={formData.personalInfo.bio}
              rows={3}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, bio: e.target.value },
                }))
              }
              className="w-full p-3.5 border border-white/10 rounded-xl bg-[#0d0f1e]/80 text-slate-100 placeholder-slate-400/70 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 transition-all shadow-inner leading-relaxed"
            />
          </div>
          <Input
            label="Location"
            defaultValue={formData.personalInfo.location}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, location: e.target.value },
              }))
            }
            placeholder="City, Country"
          />
          <Select
            label="Profile Visibility"
            defaultValue={formData.personalInfo.visibility}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, visibility: e.target.value },
              }))
            }
          >
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <Input
            label="Primary Email Address"
            defaultValue={formData.contactDetails.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactDetails: { ...prev.contactDetails, email: e.target.value },
              }))
            }
            type="email"
          />
          <Input
            label="Secondary Email (Recovery)"
            defaultValue={formData.contactDetails.secondaryEmail}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactDetails: { ...prev.contactDetails, secondaryEmail: e.target.value },
              }))
            }
            type="email"
          />
          <Input
            label="Phone Number"
            defaultValue={formData.contactDetails.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                contactDetails: { ...prev.contactDetails, phone: e.target.value },
              }))
            }
            type="tel"
          />
        </div>
      </SettingsCategorySection>

      {/* 3. Profile Regional Preferences */}
      <SettingsCategorySection
        title="Profile Regional Preferences"
        description="Default language and time display options."
        icon={<Globe className="w-4 h-4" />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <Select
            label="Default Language"
            defaultValue={formData.preferences.language}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, language: e.target.value },
              }))
            }
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </Select>
          <Select
            label="Primary Timezone"
            defaultValue={formData.preferences.timezone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                preferences: { ...prev.preferences, timezone: e.target.value },
              }))
            }
          >
            <option value="Asia/Kolkata">(GMT+5:30) Asia/Kolkata</option>
            <option value="UTC">(GMT+0:00) UTC</option>
            <option value="EST">(GMT-5:00) EST</option>
            <option value="PST">(GMT-8:00) PST</option>
          </Select>
        </div>
      </SettingsCategorySection>

      {/* Save / Reset Action Footer Bar */}
      <Card
        variant="elevated"
        className="p-4 sm:p-5 rounded-2xl bg-[#121426] border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-left"
      >
        <p className="text-xs text-slate-400 font-medium">
          Ensure all contact details and visibility preferences are accurate before saving.
        </p>
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            disabled={isSaving}
            className="text-xs h-8.5 gap-1.5 text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-1.5 h-8.5 text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Changes...
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Account Changes
              </>
            )}
          </Button>
        </div>
      </Card>
    </SettingsCategoryLayout>
  )
}

export default AccountSettings
