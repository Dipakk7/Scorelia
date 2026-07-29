import api from '@/api/api'

export interface UserSettingsResponse {
  id: string
  user_id: string

  // General
  language: string
  timezone: string
  date_format: string
  time_format: string
  default_module: string
  items_per_page: number

  // System
  auto_save: boolean
  cloud_sync: boolean
  analytics_tracking: boolean
  performance_mode: boolean
  compact_layout: boolean
  beta_features: boolean
  email_notifications: boolean
  smart_suggestions: boolean
  sound_effects: boolean

  // Appearance
  theme: string
  accent_color: string
  density: string
  font_size: string
  dashboard_layout: string

  // Privacy
  telemetry_enabled: boolean
  retention_policy: string
  export_requested: boolean

  created_at: string
  updated_at: string
}

const DEFAULT_SETTINGS_FALLBACK: UserSettingsResponse = {
  id: 'default-settings',
  user_id: 'user-1',
  language: 'English (US)',
  timezone: 'UTC-05:00 (Eastern Time)',
  date_format: 'MM/DD/YYYY',
  time_format: '12-hour (AM/PM)',
  default_module: 'dashboard',
  items_per_page: 10,
  auto_save: true,
  cloud_sync: true,
  analytics_tracking: true,
  performance_mode: false,
  compact_layout: false,
  beta_features: true,
  email_notifications: true,
  smart_suggestions: true,
  sound_effects: true,
  theme: 'system',
  accent_color: 'purple',
  density: 'comfortable',
  font_size: 'medium',
  dashboard_layout: 'two-column',
  telemetry_enabled: true,
  retention_policy: '90-days',
  export_requested: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const settingsApi = {
  async getSettings(): Promise<UserSettingsResponse> {
    try {
      const response = await api.get<UserSettingsResponse>('/settings')
      return response.data
    } catch (error) {
      return DEFAULT_SETTINGS_FALLBACK
    }
  },

  async updateGeneral(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    try {
      const response = await api.patch<UserSettingsResponse>('/settings/general', payload)
      return response.data
    } catch (error) {
      return { ...DEFAULT_SETTINGS_FALLBACK, ...payload }
    }
  },

  async updateSystem(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    try {
      const response = await api.patch<UserSettingsResponse>('/settings/system', payload)
      return response.data
    } catch (error) {
      return { ...DEFAULT_SETTINGS_FALLBACK, ...payload }
    }
  },

  async updateAppearance(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    try {
      const response = await api.patch<UserSettingsResponse>('/settings/appearance', payload)
      return response.data
    } catch (error) {
      return { ...DEFAULT_SETTINGS_FALLBACK, ...payload }
    }
  },

  async updateNotifications(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    try {
      const response = await api.patch<UserSettingsResponse>('/settings/notifications', payload)
      return response.data
    } catch (error) {
      return { ...DEFAULT_SETTINGS_FALLBACK, ...payload }
    }
  },

  async updatePrivacy(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    try {
      const response = await api.patch<UserSettingsResponse>('/settings/privacy', payload)
      return response.data
    } catch (error) {
      return { ...DEFAULT_SETTINGS_FALLBACK, ...payload }
    }
  },

  async resetDefaults(): Promise<UserSettingsResponse> {
    try {
      const response = await api.post<UserSettingsResponse>('/settings/reset')
      return response.data
    } catch (error) {
      return DEFAULT_SETTINGS_FALLBACK
    }
  },
}

export default settingsApi
