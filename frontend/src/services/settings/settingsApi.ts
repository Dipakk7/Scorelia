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

export const settingsApi = {
  async getSettings(): Promise<UserSettingsResponse> {
    const response = await api.get<UserSettingsResponse>('/settings')
    return response.data
  },

  async updateGeneral(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    const response = await api.patch<UserSettingsResponse>('/settings/general', payload)
    return response.data
  },

  async updateSystem(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    const response = await api.patch<UserSettingsResponse>('/settings/system', payload)
    return response.data
  },

  async updateAppearance(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    const response = await api.patch<UserSettingsResponse>('/settings/appearance', payload)
    return response.data
  },

  async updateNotifications(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    const response = await api.patch<UserSettingsResponse>('/settings/notifications', payload)
    return response.data
  },

  async updatePrivacy(payload: Partial<UserSettingsResponse>): Promise<UserSettingsResponse> {
    const response = await api.patch<UserSettingsResponse>('/settings/privacy', payload)
    return response.data
  },

  async resetDefaults(): Promise<UserSettingsResponse> {
    const response = await api.post<UserSettingsResponse>('/settings/reset')
    return response.data
  },
}

export default settingsApi
