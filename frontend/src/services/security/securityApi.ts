import api from '@/api/api'

export interface PasswordChangePayload {
  current_password: string
  new_password: string
  confirm_password: string
  logout_other_sessions?: boolean
}

export interface TwoFactorStatusResponse {
  is_enabled: boolean
  method: string
  qr_code_url?: string
  secret_key?: string
  recovery_codes: string[]
}

export interface UserSessionItem {
  id: string
  device_name: string
  browser: string
  platform: string
  ip_address: string
  location: string
  is_current: boolean
  is_trusted: boolean
  last_active_at: string
}

export interface TrustedDeviceItem {
  id: string
  device_name: string
  browser: string
  platform: string
  is_trusted: boolean
  last_used_at: string
}

export interface LoginHistoryItem {
  id: string
  browser: string
  platform: string
  ip_address: string
  location: string
  status: string
  risk_level: string
  created_at: string
}

export const securityApi = {
  async changePassword(payload: PasswordChangePayload): Promise<{ status: string; message: string }> {
    const response = await api.patch<{ status: string; message: string }>('/security/password', payload)
    return response.data
  },

  async get2FAStatus(): Promise<TwoFactorStatusResponse> {
    const response = await api.get<TwoFactorStatusResponse>('/security/2fa')
    return response.data
  },

  async enable2FA(code: string): Promise<{ status: string; message: string }> {
    const response = await api.post<{ status: string; message: string }>('/security/2fa/enable', { code })
    return response.data
  },

  async disable2FA(): Promise<{ status: string; message: string }> {
    const response = await api.post<{ status: string; message: string }>('/security/2fa/disable')
    return response.data
  },

  async getSessions(): Promise<UserSessionItem[]> {
    const response = await api.get<UserSessionItem[]>('/security/sessions')
    return response.data
  },

  async revokeSession(sessionId: string): Promise<{ status: string; message: string }> {
    const response = await api.delete<{ status: string; message: string }>(`/security/sessions/${sessionId}`)
    return response.data
  },

  async getTrustedDevices(): Promise<TrustedDeviceItem[]> {
    const response = await api.get<TrustedDeviceItem[]>('/security/devices')
    return response.data
  },

  async removeTrustedDevice(deviceId: string): Promise<{ status: string; message: string }> {
    const response = await api.delete<{ status: string; message: string }>(`/security/devices/${deviceId}`)
    return response.data
  },

  async getLoginHistory(): Promise<LoginHistoryItem[]> {
    const response = await api.get<LoginHistoryItem[]>('/security/login-history')
    return response.data
  },
}

export default securityApi
