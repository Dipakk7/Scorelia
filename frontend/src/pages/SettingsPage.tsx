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
import { Select } from '@/components/ui/Select'
import { SettingsCard } from '@/components/ui/SettingsCard'
import { Loader } from '@/components/ui/Loader'
import { SettingsSkeleton } from '@/components/ui/Skeletons'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/Dialog'
import { Switch } from '@/components/ui/Switch'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { cn } from '@/lib/utils'

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
    return <SettingsSkeleton />
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Eye },
  ]

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto font-sans text-xs pb-12 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)]/70 backdrop-blur-md p-5 rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300 flex-shrink-0">
        <div className="space-y-1.5 text-left">
          <h1 className="text-xl md:text-2xl font-black font-display text-[var(--heading)] m-0 tracking-tight leading-none text-left">
            Account Settings
          </h1>
          <p className="text-xs text-[var(--body)] font-sans leading-relaxed m-0 font-medium mt-1.5">
            Adjust preferences, notification configs, security settings, and backups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start text-left">
        {/* Tab Buttons Side Nav */}
        <div className="md:col-span-1 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 border-[var(--border)] text-left select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shrink-0 cursor-pointer focus:outline-none border-none leading-none select-none text-left w-full h-10',
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-[var(--shadow-sm)] font-extrabold'
                    : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--heading)] bg-transparent'
                )}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active Tab Panel Content */}
        <div className="md:col-span-3 space-y-6 text-left">
          {/* GENERAL TABS */}
          {activeTab === 'general' && (
            <SettingsCard
              title="General Settings"
              description="Adjust language locale, timezone configs, and application display themes."
            >
              <div className="space-y-6 text-left">
                {/* Theme Selector */}
                <div className="space-y-3 text-left">
                  <label className="text-[var(--muted)] text-[8px] font-black uppercase font-mono tracking-widest block leading-none select-none text-left">
                    Application Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3 text-left">
                    {['light', 'dark', 'system'].map((t) => {
                      const isActive = theme === t
                      return (
                        <button
                          key={t}
                          onClick={() => handleThemeChange(t as Theme)}
                          className={cn(
                            'p-4 rounded-xl border text-xs font-bold font-display capitalize cursor-pointer focus:outline-none transition-all flex flex-col items-center gap-2 leading-none text-center select-none hover:scale-102 hover:border-[var(--primary)]/35 h-20 justify-center',
                            isActive
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)] font-extrabold'
                              : 'border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] bg-transparent'
                          )}
                        >
                          <span className="text-xs font-black uppercase tracking-wider">{t} Mode</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <Select
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </Select>

                  <Select
                    label="Timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">UTC / Coordinated Universal Time</option>
                    <option value="EST">EST / Eastern Standard Time</option>
                    <option value="PST">PST / Pacific Standard Time</option>
                    <option value="IST">IST / Indian Standard Time</option>
                    <option value="GMT">GMT / Greenwich Mean Time</option>
                  </Select>
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border)] mt-4 select-none">
                  <Button
                    variant="primary"
                    onClick={handleGeneralSave}
                    isLoading={updateSettingsMutation.isPending}
                    className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-none rounded-xl shadow-xs cursor-pointer leading-none select-none h-9 flex items-center justify-center"
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
              <div className="space-y-5 text-left">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)]/50 bg-[var(--surface-hover)] text-left">
                  <div className="space-y-1 text-left">
                    <p className="text-xs font-bold text-[var(--heading)] leading-none">Email Notifications</p>
                    <p className="text-[11px] text-[var(--muted)] leading-normal">Receive reports, ATS analysis findings, and milestone notifications via email.</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)]/50 bg-[var(--surface-hover)] text-left">
                  <div className="space-y-1 text-left">
                    <p className="text-xs font-bold text-[var(--heading)] leading-none">Push Notifications</p>
                    <p className="text-[11px] text-[var(--muted)] leading-normal">Enable instant browser push alerts for processed matching scores and mock reviews.</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)]/50 bg-[var(--surface-hover)] text-left">
                  <div className="space-y-1 text-left">
                    <p className="text-xs font-bold text-[var(--heading)] leading-none">Marketing & Newsletter Emails</p>
                    <p className="text-[11px] text-[var(--muted)] leading-normal">Subscribe to recruitment trends, tips, and promotional product enhancements.</p>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border)] mt-4 select-none">
                  <Button
                    variant="primary"
                    onClick={handleNotificationsSave}
                    isLoading={updateSettingsMutation.isPending}
                    className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-none rounded-xl shadow-xs cursor-pointer leading-none select-none h-9 flex items-center justify-center"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* SECURITY TABS */}
          {activeTab === 'security' && (
            <div className="space-y-6 text-left">
              {/* Change Password */}
              <SettingsCard
                title="Change Password"
                description="Update current login password to maintain account integrity."
              >
                <form onSubmit={handlePasswordChange} className="space-y-4 text-left">
                  <Input
                    type="password"
                    label="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
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
                  <div className="flex justify-end border-t border-[var(--border)] pt-4 mt-2 select-none">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={passwordMutation.isPending}
                      className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] rounded-xl shadow-sm border-none cursor-pointer h-9 flex items-center justify-center gap-1.5"
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
                  <div className="py-8 text-center text-xs text-[var(--muted)] font-bold leading-none select-none">Loading session metadata...</div>
                ) : (
                  <div className="space-y-4 text-left">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device / Platform</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions?.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-semibold flex items-center gap-2">
                              <Laptop size={14} className="text-[var(--muted)] shrink-0" />
                              <span>{s.device}</span>
                            </TableCell>
                            <TableCell className="font-mono text-[10px]">{s.ip_address}</TableCell>
                            <TableCell>{new Date(s.last_active).toLocaleString()}</TableCell>
                            <TableCell>
                              {s.is_current ? (
                                <span className="inline-flex items-center rounded-lg text-[9px] font-black uppercase tracking-wider border bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20 px-2 py-0.5 leading-none shrink-0">Active</span>
                              ) : (
                                <span className="text-[var(--muted)] italic select-none">Logout Device</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="flex justify-end pt-2 select-none">
                      <Button
                        variant="outline"
                        onClick={() => logoutOthersMutation.mutate()}
                        isLoading={logoutOthersMutation.isPending}
                        className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] cursor-pointer leading-none select-none h-9 flex items-center justify-center bg-transparent rounded-xl disabled:opacity-40"
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
            <div className="space-y-6 text-left">
              {/* Backups Export */}
              <SettingsCard
                title="Data Export"
                description="Download a complete copy of all your records, resumes, roadmaps, and details in standard JSON backups."
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                  <div className="space-y-1 text-left">
                    <p className="text-xs font-bold text-[var(--heading)] leading-none flex items-center gap-1.5 select-none">
                      <Info size={14} className="text-[var(--muted)] shrink-0" />
                      <span>Back Up Your Data</span>
                    </p>
                    <p className="text-[11px] text-[var(--muted)] leading-normal m-0 text-left">
                      Exporting details includes full resume parsed details, job match records, mock interview scores, and preferences.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] cursor-pointer leading-none select-none h-9 flex items-center justify-center bg-transparent rounded-xl shrink-0 gap-1.5"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[var(--danger)]/20 bg-[var(--danger)]/5 text-left">
                  <div className="space-y-1 text-left">
                    <p className="text-xs font-bold text-[var(--danger)] leading-none select-none">
                      Delete Account Permanently
                    </p>
                    <p className="text-[11px] text-[var(--danger)]/80 leading-normal m-0 text-left">
                      Once confirmed, all resumes, cover letters, mock transcripts, roadmap milestones, and active subscriptions will be cleared immediately from the databases.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteModal(true)}
                    className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)] rounded-xl shadow-xs border-none cursor-pointer leading-none select-none h-9 flex items-center justify-center shrink-0 gap-1.5"
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
        <DialogContent className="max-w-md border border-[var(--border)] bg-[var(--surface)] p-6 text-left rounded-2xl">
          <DialogHeader className="text-left flex flex-row gap-3 items-center select-none">
            <div className="h-10 w-10 shrink-0 bg-[var(--danger)]/10 text-[var(--danger)] rounded-xl flex items-center justify-center border border-[var(--danger)]/20 shadow-2xs">
              <Trash2 size={20} />
            </div>
            <div className="text-left">
              <DialogTitle className="text-xs font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
                Delete Account
              </DialogTitle>
              <DialogDescription className="text-[9px] text-[var(--danger)] font-sans block mt-1.5 leading-none font-bold">
                This action is irreversible.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="py-4 text-xs font-medium text-[var(--body)] leading-normal text-left select-none">
            Are you absolutely sure you want to delete your Scorelia account? All resumes, mock preparation turn logs, roadmap milestones, and profile records will be permanently erased from active databases.
          </div>
          <DialogFooter className="flex gap-2 justify-end select-none">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--muted)] cursor-pointer leading-none select-none h-9 flex items-center justify-center bg-transparent rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteAccount}
              isLoading={deleteAccountMutation.isPending}
              className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-[var(--danger)] text-white hover:bg-[var(--danger-hover)] rounded-xl shadow-xs border-none cursor-pointer leading-none select-none h-9 flex items-center justify-center"
            >
              Confirm Account Erasure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
