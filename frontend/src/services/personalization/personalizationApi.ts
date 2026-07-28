import api from '@/api/api'

export interface PersonalizationResponse {
  user_id: string

  // Workspace
  default_dashboard: string
  favorite_modules?: string[]
  pinned_modules?: string[]
  recent_modules_limit: number
  dashboard_widgets?: string[]
  sidebar_collapsed: boolean

  // AI
  default_ai_provider: string
  preferred_llm: string
  ai_response_length: string
  ai_temperature: number
  ai_suggestions_enabled: boolean
  smart_recommendations: boolean

  // Accessibility
  reduced_motion: boolean
  high_contrast: boolean
  keyboard_navigation: boolean
  screen_reader_mode: boolean

  // Productivity
  keyboard_shortcuts: boolean
  auto_save_interval: number
  session_timeout: number
  startup_behavior: string
  notification_digest: string

  personalization_version: string
  updated_at: string
}

export const personalizationApi = {
  async getPersonalization(): Promise<PersonalizationResponse> {
    const response = await api.get<PersonalizationResponse>('/personalization')
    return response.data
  },

  async updateWorkspace(payload: Partial<PersonalizationResponse>): Promise<PersonalizationResponse> {
    const response = await api.patch<PersonalizationResponse>('/personalization/workspace', payload)
    return response.data
  },

  async updateAI(payload: Partial<PersonalizationResponse>): Promise<PersonalizationResponse> {
    const response = await api.patch<PersonalizationResponse>('/personalization/ai', payload)
    return response.data
  },

  async updateAccessibility(payload: Partial<PersonalizationResponse>): Promise<PersonalizationResponse> {
    const response = await api.patch<PersonalizationResponse>('/personalization/accessibility', payload)
    return response.data
  },

  async updateProductivity(payload: Partial<PersonalizationResponse>): Promise<PersonalizationResponse> {
    const response = await api.patch<PersonalizationResponse>('/personalization/productivity', payload)
    return response.data
  },

  async resetPersonalization(): Promise<PersonalizationResponse> {
    const response = await api.post<PersonalizationResponse>('/personalization/reset')
    return response.data
  },
}

export default personalizationApi
