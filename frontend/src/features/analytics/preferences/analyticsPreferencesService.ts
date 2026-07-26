import api from '@/api/api'
import type {
  ApiAnalyticsPreferencesResponse,
  UserAnalyticsPreferences,
} from './analyticsPreferencesTypes'

export class AnalyticsPreferencesService {
  async getPreferences(): Promise<ApiAnalyticsPreferencesResponse> {
    const response = await api.get<ApiAnalyticsPreferencesResponse>('/analytics/preferences')
    return response.data
  }

  async updatePreferences(
    prefs: UserAnalyticsPreferences
  ): Promise<ApiAnalyticsPreferencesResponse> {
    const response = await api.put<ApiAnalyticsPreferencesResponse>('/analytics/preferences', prefs)
    return response.data
  }

  async resetPreferences(): Promise<ApiAnalyticsPreferencesResponse> {
    const response = await api.post<ApiAnalyticsPreferencesResponse>('/analytics/preferences/reset')
    return response.data
  }
}

export const analyticsPreferencesService = new AnalyticsPreferencesService()
export default analyticsPreferencesService
