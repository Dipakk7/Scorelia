import api from '@/api/api'

export interface UserIntegrationItem {
  id: string
  provider: string
  name: string
  description: string
  icon_name: string
  is_connected: boolean
  status_badge: string
  account_identifier?: string
  avatar_url?: string
  masked_key?: string
  connected_repos_count: number
  connected_channels_count: number
  last_synced_at?: string
}

export const integrationsApi = {
  async getIntegrations(): Promise<UserIntegrationItem[]> {
    const response = await api.get<UserIntegrationItem[]>('/integrations')
    return response.data
  },

  async connectIntegration(provider: string, payload?: { auth_code?: string; api_key?: string }): Promise<UserIntegrationItem> {
    const response = await api.post<UserIntegrationItem>(`/integrations/${provider}/connect`, payload)
    return response.data
  },

  async disconnectIntegration(provider: string): Promise<UserIntegrationItem> {
    const response = await api.delete<UserIntegrationItem>(`/integrations/${provider}/disconnect`)
    return response.data
  },

  async saveOpenAIKey(apiKey: string): Promise<UserIntegrationItem> {
    const response = await api.post<UserIntegrationItem>('/integrations/openai/key', { api_key: apiKey })
    return response.data
  },

  async syncIntegration(provider: string): Promise<UserIntegrationItem> {
    const response = await api.post<UserIntegrationItem>(`/integrations/${provider}/sync`)
    return response.data
  },
}

export default integrationsApi
