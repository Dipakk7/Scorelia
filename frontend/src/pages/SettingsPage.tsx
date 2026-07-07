import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Monitor, Bell, Shield, Eye, Download, Trash2, Key, Info, Laptop } from 'lucide-react'
import toast from 'react-hot-toast'

import api from '@/api/api'
import { useAuth } from '@/providers/AuthProvider'
import { useTheme } from '@/providers/ThemeProvider'
import type { Theme } from '@/providers/ThemeProvider'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SettingsCard } from '@/components/ui/SettingsCard'
import { Loader } from '@/components/ui/Loader'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'

type TabType = 'general' | 'notifications' | 'security' | 'privacy'

interface ActiveSession {
  id: string
  device: string
  ip_address: string
  last_active: string
  is_current: boolean
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { refreshUser, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<TabType>('general')

  // Query User settings from /auth/me
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const res = await api.get('/auth/me')
      return res.data
    },
  })

  // Query active sessions
  const { data: sessions, isLoading: isSessionsLoading, refetch: refetchSessions } = useQuery<ActiveSession[]>({
    queryKey: ['activeSessions'],
    queryFn: async () => {
      const res = await api.get('/auth/sessions')
      return res.data
    },
    enabled: activeTab === 'security',
  })

  // General & Notification states
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Security password states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Sync state with profile data
  useEffect(() => {
    if (profile) {
      setLanguage(profile.language || 'en')
      setTimezone(profile.timezone || 'UTC')
      setEmailNotifications(profile.email_notifications ?? true)
      setPushNotifications(profile.push_notifications ?? true)
      setMarketingEmails(profile.marketing_emails ?? false)
    }
  }, [profile])

  // Profile preferences update mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.put('/auth/me', payload)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data)
      refreshUser()
      toast.success('Settings updated successfully')
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to update settings.')
    },
  })

  // Theme Sync on setting update
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    updateSettingsMutation.mutate({ theme: newTheme })
  }

  const handleGeneralSave = () => {
    updateSettingsMutation.mutate({
      language,
      timezone,
    })
  }

  const handleNotificationsSave = () => {
    updateSettingsMutation.mutate({
      email_notifications: emailNotifications,
      push_notifications: pushNotifications,
      marketing_emails: marketingEmails,
    })
  }

  // Password mutation
  const passwordMutation = useMutation({
    mutationFn: async (payload: any) => {
      await api.post('/auth/change-password', payload)
    },
    onSuccess: () => {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Password updated successfully')
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Incorrect current password or invalid new password.')
    },
  })

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    passwordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  // Logout other devices mutation
  const logoutOthersMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/sessions/logout-others')
    },
    onSuccess: () => {
      refetchSessions()
      toast.success('Logged out of other devices successfully')
    },
  })

  // Export Data query
  const handleExportData = async () => {
    try {
      toast.loading('Preparing data export package...', { id: 'export-loader' })
      const res = await api.post('/auth/export-data')
      const jsonStr = JSON.stringify(res.data, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `scorelia-data-export-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      toast.dismiss('export-loader')
      toast.success('Your data backup has been generated and downloaded.')
    } catch {
      toast.dismiss('export-loader')
      toast.error('Failed to export data. Please try again.')
    }
  }

  // Delete Account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/delete-account')
    },
    onSuccess: () => {
      toast.success('Your account has been deleted permanently.')
      logout()
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to delete account.')
    },
  })

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate()
  }

  if (isProfileLoading) {
    return <Loader label="Retrieving settings dashboard..." />
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
  ]

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-50 m-0">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Adjust preferences, notification configs, security settings, and backups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Tab Buttons Side Nav */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 border-slate-200 dark:border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2.5 px-4 py-3 text-sm font-semibold rounded-xl transition-all shrink-0 cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-255'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active Tab Panel Content */}
        <div className="md:col-span-3 space-y-6">
          {/* GENERAL TABS */}
          {activeTab === 'general' && (
            <SettingsCard
              title="General Settings"
              description="Adjust language locale, timezone configs, and application display themes."
            >
              <div className="space-y-6">
                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wide">
                    Application Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'system'].map((t) => {
                      const isActive = theme === t
                      return (
                        <button
                          key={t}
                          onClick={() => handleThemeChange(t as Theme)}
                          className={`p-4 rounded-xl border text-sm font-bold font-display capitalize cursor-pointer focus:outline-none transition-all hover:scale-102 flex flex-col items-center gap-1 ${
                            isActive
                              ? 'border-brand-500 bg-brand-500/5 text-brand-600 dark:text-brand-400 font-bold'
                              : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                          }`}
                        >
                          <span className="text-xs sm:text-sm">{t} Mode</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none transition-colors"
                    >
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-lg border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:outline-none transition-colors"
                    >
                      <option value="UTC">UTC / Coordinated Universal Time</option>
                      <option value="EST">EST / Eastern Standard Time</option>
                      <option value="PST">PST / Pacific Standard Time</option>
                      <option value="IST">IST / Indian Standard Time</option>
                      <option value="GMT">GMT / Greenwich Mean Time</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-200/40 dark:border-slate-800/40 mt-4">
                  <Button
                    variant="primary"
                    onClick={handleGeneralSave}
                    isLoading={updateSettingsMutation.isPending}
                    className="text-xs font-semibold px-4 cursor-pointer"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* NOTIFICATIONS TABS */}
          {activeTab === 'notifications' && (
            <SettingsCard
              title="Notifications Configurations"
              description="Customize channels and types of updates you receive from the AI analysis engine."
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="space-y-0.5 text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email Notifications</p>
                    <p className="text-xs text-slate-400">Receive reports, ATS analysis findings, and milestone notifications via email.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="space-y-0.5 text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Push Notifications</p>
                    <p className="text-xs text-slate-400">Enable instant browser push alerts for processed matching scores and mock reviews.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
                  <div className="space-y-0.5 text-left">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Marketing & Newsletter Emails</p>
                    <p className="text-xs text-slate-400">Subscribe to recruitment trends, tips, and promotional product enhancements.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-200/40 dark:border-slate-800/40 mt-4">
                  <Button
                    variant="primary"
                    onClick={handleNotificationsSave}
                    isLoading={updateSettingsMutation.isPending}
                    className="text-xs font-semibold px-4 cursor-pointer"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* SECURITY TABS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <SettingsCard
                title="Change Password"
                description="Update current login password to maintain account integrity."
              >
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    type="password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      type="password"
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      label="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end border-t border-slate-200/40 dark:border-slate-800/40 pt-4 mt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={passwordMutation.isPending}
                      className="text-xs font-semibold flex items-center gap-1 bg-brand-600 hover:bg-brand-700 cursor-pointer"
                    >
                      <Key size={14} />
                      <span>Update Password</span>
                    </Button>
                  </div>
                </form>
              </SettingsCard>

              {/* Active Sessions */}
              <SettingsCard
                title="Active Sessions"
                description="Manage active browser logins and security session tokens currently validated."
              >
                {isSessionsLoading ? (
                  <div className="py-8 text-center text-xs text-slate-500">Loading session metadata...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="border border-slate-250 dark:border-slate-800/80 rounded-xl overflow-hidden">
                      <table className="w-full border-collapse text-left text-xs font-sans">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold font-display uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Device / Platform</th>
                            <th className="p-3">IP Address</th>
                            <th className="p-3">Last Active</th>
                            <th className="p-3">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50 text-slate-700 dark:text-slate-300">
                          {sessions?.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20">
                              <td className="p-3 font-semibold flex items-center gap-2">
                                <Laptop size={14} className="text-slate-400" />
                                <span>{s.device}</span>
                              </td>
                              <td className="p-3 font-mono">{s.ip_address}</td>
                              <td className="p-3">{new Date(s.last_active).toLocaleString()}</td>
                              <td className="p-3">
                                {s.is_current ? (
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10 shadow-2xs">Active</span>
                                ) : (
                                  <span className="text-slate-400 italic">Logout Device</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        variant="outline"
                        onClick={() => logoutOthersMutation.mutate()}
                        isLoading={logoutOthersMutation.isPending}
                        className="text-xs font-semibold cursor-pointer border-slate-250"
                      >
                        Logout Other Devices
                      </Button>
                    </div>
                  </div>
                )}
              </SettingsCard>
            </div>
          )}

          {/* PRIVACY & DATA EXPORT */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Backups Export */}
              <SettingsCard
                title="Data Export"
                description="Download a complete copy of all your records, resumes, roadmaps, and details in standard JSON backups."
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5 text-left max-w-md">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Info size={14} className="text-slate-400" />
                      <span>Back Up Your Data</span>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      Exporting details includes full resume parsed details, job match records, mock interview scores, and preferences.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer border-slate-250"
                  >
                    <Download size={14} />
                    <span>Download JSON Backup</span>
                  </Button>
                </div>
              </SettingsCard>

              {/* Delete Account */}
              <SettingsCard
                title="Danger Zone: Delete Account"
                description="Permanently erase all your details, resume database records, roadmaps, and matching data. This action is irreversible."
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-200/50 dark:border-red-950/20 bg-red-500/5">
                  <div className="space-y-0.5 text-left max-w-md">
                    <p className="text-sm font-bold text-red-655 dark:text-red-400">
                      Delete Account Permanently
                    </p>
                    <p className="text-xs text-red-500/85 dark:text-red-400/80 leading-normal">
                      Once confirmed, all resumes, cover letters, mock transcripts, roadmap milestones, and active subscriptions will be cleared immediately from the databases.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(true)}
                    className="text-xs font-semibold flex items-center gap-1.5 shrink-0 bg-red-600 border-red-600 hover:bg-red-700 text-white cursor-pointer hover:shadow-lg shadow-red-500/10"
                  >
                    <Trash2 size={14} />
                    <span>Delete Account</span>
                  </Button>
                </div>
              </SettingsCard>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Warning Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <DialogHeader className="text-left flex flex-row gap-3 items-center">
            <div className="h-10 w-10 shrink-0 bg-red-550/10 text-red-600 rounded-xl flex items-center justify-center border border-red-550/20">
              <Trash2 size={20} />
            </div>
            <div>
              <DialogTitle className="text-slate-900 dark:text-slate-50 font-display font-bold">
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-xs text-red-500 font-sans mt-0.5">
                This action is irreversible.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="py-3 text-sm text-slate-650 dark:text-slate-350 font-sans leading-relaxed text-left">
            Are you absolutely sure you want to delete your Scorelia account? All resumes, mock preparation turn logs, roadmap milestones, and profile records will be permanently erased.
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="text-xs font-semibold border-slate-250 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAccount}
              isLoading={deleteAccountMutation.isPending}
              className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              Confirm Account Erasure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
