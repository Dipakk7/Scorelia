import React, { useState } from 'react'
import { Shield, Lock, Laptop, KeyRound, Smartphone, Check, Loader2, AlertCircle } from 'lucide-react'
import { SettingsCategoryLayout } from './SettingsCategoryLayout'
import { SettingsCategorySection } from './SettingsCategorySection'
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

  return (
    <SettingsCategoryLayout
      icon={<Shield className="w-5 h-5 text-[var(--primary)]" />}
      title="Security & Authentication"
      subtitle="Protect your account with password rules, 2FA, and active session monitoring."
      badge={twoFA?.is_enabled ? '2FA Enabled' : '2FA Disabled'}
      badgeVariant={twoFA?.is_enabled ? 'success' : 'warning'}
    >
      {/* 1. Change Password */}
      <SettingsCategorySection
        title="Change Password"
        description="Choose a strong password with at least 8 characters, uppercase, lowercase, numbers & symbols."
        icon={<KeyRound className="w-4 h-4" />}
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className={`p-3 rounded-md text-xs flex items-center gap-2 ${
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
              variant="secondary"
              disabled={passwordMutation.isPending}
              className="text-xs h-8 gap-1.5"
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
            className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          >
            {twoFA?.is_enabled ? `Active: ${twoFA.method}` : '2FA Inactive'}
          </Badge>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[var(--heading)]">
                Authenticator App (TOTP)
              </h4>
              <p className="text-[11px] text-[var(--muted)]">
                Use Google Authenticator, 1Password, or Authy for secure one-time codes.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={twoFA?.is_enabled ? 'outline' : 'primary'}
            onClick={handleToggle2FA}
            disabled={disable2FAMutation.isPending}
            className="text-xs h-8 shrink-0"
          >
            {twoFA?.is_enabled ? 'Disable 2FA' : 'Enable 2FA'}
          </Button>
        </div>

        {/* 2FA Setup Modal */}
        {show2FAModal && twoFA && (
          <div className="p-4 rounded-lg border border-[var(--primary)]/40 bg-[var(--primary)]/5 space-y-3">
            <h4 className="text-xs font-bold text-[var(--heading)]">
              Configure Authenticator App
            </h4>
            <p className="text-[11px] text-[var(--muted)]">
              Scan secret key in your authenticator app or enter secret manually:
            </p>
            <code className="text-xs font-mono p-2 rounded bg-[var(--surface)] text-[var(--primary)] block text-center border">
              {twoFA.secret_key}
            </code>
            <div className="flex items-center gap-2 pt-2">
              <Input
                placeholder="Enter 6-digit TOTP code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                maxLength={6}
                className="text-xs h-8 font-mono text-center"
              />
              <Button
                size="sm"
                onClick={handleVerify2FA}
                disabled={enable2FAMutation.isPending || totpCode.length !== 6}
                className="text-xs h-8 shrink-0"
              >
                Verify & Enable
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShow2FAModal(false)}
                className="text-xs h-8 shrink-0"
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
        <div className="overflow-x-auto border rounded-lg border-[var(--border)] bg-[var(--surface)]">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border)]/40 text-xs">
                <TableHead>Device & Browser</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((sess) => (
                <TableRow key={sess.id} className="border-[var(--border)]/30 text-xs font-sans">
                  <TableCell className="font-semibold text-[var(--heading)]">
                    <div className="flex items-center gap-2">
                      <span>{sess.device_name || `${sess.browser} on ${sess.platform}`}</span>
                      {sess.is_current && (
                        <Badge variant="success" className="text-[9px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400">
                          Current Session
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-[var(--muted)]">{sess.ip_address}</TableCell>
                  <TableCell className="text-[var(--muted)]">{sess.location}</TableCell>
                  <TableCell className="text-[var(--muted)]">
                    {sess.is_current ? 'Active now' : sess.last_active_at}
                  </TableCell>
                  <TableCell className="text-right">
                    {!sess.is_current && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => revokeSessionMutation.mutate(sess.id)}
                        disabled={revokeSessionMutation.isPending}
                        className="text-[11px] h-7 text-[var(--danger)] hover:bg-[var(--danger)]/10"
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
          <div className="space-y-2">
            {devices.map((dev) => (
              <div
                key={dev.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border text-xs"
              >
                <div>
                  <h5 className="font-semibold text-[var(--heading)]">{dev.device_name}</h5>
                  <p className="text-[11px] text-[var(--muted)]">
                    {dev.browser} on {dev.platform}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeDeviceMutation.mutate(dev.id)}
                  disabled={removeDeviceMutation.isPending}
                  className="text-[11px] h-7 text-[var(--danger)] hover:bg-[var(--danger)]/10"
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
