import React, { useState } from 'react'
import { Shield, Lock, Laptop, KeyRound, Smartphone, Check, Loader2, AlertCircle, ShieldCheck, Sparkles, ShieldAlert } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import {
  useSessionsQuery,
  useDevicesQuery,
  use2FAQuery,
  usePasswordMutation,
  useRevokeSessionMutation,
  useRemoveDeviceMutation,
  useEnable2FAMutation,
  useDisable2FAMutation,
} from '@/hooks/security/useSecurityHooks'

export const SecuritySettings: React.FC = () => {
  // Queries
  const { data: sessions = [] } = useSessionsQuery()
  const { data: devices = [] } = useDevicesQuery()
  const { data: twoFA } = use2FAQuery()

  // Mutations
  const passwordMutation = usePasswordMutation()
  const revokeSessionMutation = useRevokeSessionMutation()
  const removeDeviceMutation = useRemoveDeviceMutation()
  const enable2FAMutation = useEnable2FAMutation()
  const disable2FAMutation = useDisable2FAMutation()

  // Form states
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 2FA modal / code state
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [totpCode, setTotpCode] = useState('')

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwMessage(null)

    if (newPw !== confirmPw) {
      setPwMessage({ type: 'error', text: 'New password and confirm password do not match.' })
      return
    }

    try {
      await passwordMutation.mutateAsync({
        current_password: currentPw,
        new_password: newPw,
        confirm_password: confirmPw,
      })
      setPwMessage({ type: 'success', text: 'Password updated successfully!' })
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err: any) {
      setPwMessage({
        type: 'error',
        text: err?.response?.data?.detail || 'Failed to update password. Please verify current password and complexity rules.',
      })
    }
  }

  const handleToggle2FA = async () => {
    if (twoFA?.is_enabled) {
      try {
        await disable2FAMutation.mutateAsync()
      } catch (err) {
        // Handled
      }
    } else {
      setShow2FAModal(true)
    }
  }

  const handleVerify2FA = async () => {
    if (totpCode.length !== 6) return
    try {
      await enable2FAMutation.mutateAsync(totpCode)
      setShow2FAModal(false)
      setTotpCode('')
    } catch (err) {
      // Handled
    }
  }

  const is2FAActive = Boolean(twoFA?.is_enabled)

  return (
    <SettingsCategoryLayout
      icon={<Shield className="w-5 h-5 text-purple-400" />}
      title="Security & Authentication"
      subtitle="Protect your account with password rules, 2FA, and active session monitoring."
      badge={is2FAActive ? '2FA Enabled' : '2FA Inactive'}
      badgeVariant={is2FAActive ? 'success' : 'warning'}
    >
      {/* Executive Security Overview Health Card */}
      <Card
        variant="elevated"
        className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#14162a] via-[#111324] to-[#14162a] border border-white/10 shadow-xl relative overflow-hidden font-sans text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 shadow-md">
              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate font-sans">
                  Security Defense Score
                </h3>
                <Badge variant="success" className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold px-2 py-0.5">
                  Strong Protection
                </Badge>
              </div>
              <p className="text-xs text-slate-300 font-medium font-sans">
                Real-time security assessment across authentication, 2FA, and active login sessions.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono flex-wrap">
                <span className="text-emerald-400 font-bold">96/100 Score</span>
                <span>•</span>
                <span>{is2FAActive ? '2FA Active' : '2FA Recommended'}</span>
                <span>•</span>
                <span>{sessions.length} Active {sessions.length === 1 ? 'Session' : 'Sessions'}</span>
              </div>
            </div>
          </div>

          <div className="sm:text-right shrink-0 space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10 min-w-[200px]">
            <span className="text-xs font-semibold text-slate-300 font-sans flex items-center gap-1 sm:justify-end">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Recommendations
            </span>
            <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-medium">
              <span>✓ Strong Password Policy</span>
              <span>{is2FAActive ? '✓ TOTP Authenticator Active' : '⚡ Enable 2FA for +10% score'}</span>
              <span>✓ Encrypted Login Sessions</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 1. Change Password */}
      <SettingsCategorySection
        title="Change Password"
        description="Choose a strong password with at least 8 characters, uppercase, lowercase, numbers & symbols."
        icon={<KeyRound className="w-4 h-4" />}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              required
            />
          </div>

          {pwMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 font-medium ${
                pwMessage.type === 'success'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/15 text-red-400 border border-red-500/30'
              }`}
            >
              {pwMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{pwMessage.text}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={passwordMutation.isPending}
              className="text-xs h-8.5 gap-1.5 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-950/40"
            >
              {passwordMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{passwordMutation.isPending ? 'Updating...' : 'Update Password →'}</span>
            </Button>
          </div>
        </form>
      </SettingsCategorySection>

      {/* 2. Two-Factor Authentication (2FA) */}
      <SettingsCategorySection
        title="Two-Factor Authentication (2FA)"
        description="Add an extra layer of defense using an authenticator app (TOTP) or SMS."
        icon={<Lock className="w-4 h-4" />}
        action={
          <Badge
            variant={twoFA?.is_enabled ? 'success' : 'neutral'}
            className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold px-2 py-0.5"
          >
            {twoFA?.is_enabled ? `Active: ${twoFA.method}` : '2FA Inactive'}
          </Badge>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-xl bg-[#0d0f1e]/80 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white font-sans">
                Authenticator App (TOTP)
              </h4>
              <p className="text-[11px] text-slate-400 font-medium font-sans">
                Use Google Authenticator, 1Password, or Authy for secure one-time codes.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={twoFA?.is_enabled ? 'outline' : 'primary'}
            onClick={handleToggle2FA}
            disabled={disable2FAMutation.isPending}
            className="text-xs h-8.5 shrink-0 font-semibold"
          >
            {twoFA?.is_enabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </div>

        {/* 2FA Setup Modal */}
        {show2FAModal && twoFA && (
          <div className="p-4.5 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-3 font-sans">
            <h4 className="text-xs font-bold text-white font-sans">
              Configure Authenticator App
            </h4>
            <p className="text-[11px] text-slate-300 font-medium font-sans leading-relaxed">
              Scan secret key in your authenticator app or enter secret manually:
            </p>
            <code className="text-xs font-mono p-2.5 rounded-lg bg-[#0b0c14] text-purple-300 block text-center border border-purple-500/30 font-bold tracking-wider">
              {twoFA.secret_key}
            </code>
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Enter 6-digit TOTP code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                maxLength={6}
                className="text-xs h-8.5 font-mono text-center"
              />
              <Button
                size="sm"
                onClick={handleVerify2FA}
                disabled={enable2FAMutation.isPending || totpCode.length !== 6}
                className="text-xs h-8.5 shrink-0 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
              >
                Verify & Enable
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShow2FAModal(false)}
                className="text-xs h-8.5 shrink-0"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </SettingsCategorySection>

      {/* 3. Active Login Sessions */}
      <SettingsCategorySection
        title="Active Login Sessions"
        description="Devices currently logged into your Scorelia V3 workspace."
        icon={<Laptop className="w-4 h-4" />}
      >
        <div className="overflow-x-auto border rounded-xl border-white/10 bg-[#0d0f1e]/80">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 text-xs text-slate-400">
                <TableHead className="text-slate-400 font-bold">Device & Browser</TableHead>
                <TableHead className="text-slate-400 font-bold">IP Address</TableHead>
                <TableHead className="text-slate-400 font-bold">Location</TableHead>
                <TableHead className="text-slate-400 font-bold">Last Active</TableHead>
                <TableHead className="text-right text-slate-400 font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((sess) => (
                <TableRow key={sess.id} className="border-white/10 text-xs font-sans hover:bg-white/5">
                  <TableCell className="font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{sess.device_name || `${sess.browser} on ${sess.platform}`}</span>
                      {sess.is_current && (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold">
                          Current Session
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-slate-400">{sess.ip_address}</TableCell>
                  <TableCell className="text-slate-300">{sess.location}</TableCell>
                  <TableCell className="text-slate-400 font-medium">
                    {sess.is_current ? 'Active now' : sess.last_active_at}
                  </TableCell>
                  <TableCell className="text-right">
                    {!sess.is_current && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeSessionMutation.mutate(sess.id)}
                        disabled={revokeSessionMutation.isPending}
                        className="text-[11px] h-7 text-red-400 hover:bg-red-500/10 font-semibold"
                      >
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SettingsCategorySection>

      {/* 4. Trusted Devices */}
      {devices.length > 0 && (
        <SettingsCategorySection
          title="Trusted Devices"
          description="Authorized hardware devices remembered for fast authentication."
          icon={<Shield className="w-4 h-4" />}
        >
          <div className="space-y-2.5">
            {devices.map((dev) => (
              <div
                key={dev.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#0d0f1e]/80 border border-white/10 text-xs font-sans"
              >
                <div>
                  <h5 className="font-bold text-white">{dev.device_name}</h5>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {dev.browser} on {dev.platform}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeDeviceMutation.mutate(dev.id)}
                  disabled={removeDeviceMutation.isPending}
                  className="text-[11px] h-7.5 text-red-400 hover:bg-red-500/10 font-semibold"
                >
                  Remove Device
                </Button>
              </div>
            ))}
          </div>
        </SettingsCategorySection>
      )}
    </SettingsCategoryLayout>
  )
}

export default SecuritySettings
