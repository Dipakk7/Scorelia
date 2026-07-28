import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { integrationsApi } from '@/services/integrations/integrationsApi'
import type { UserIntegrationItem } from '@/services/integrations/integrationsApi'

export const INTEGRATIONS_QUERY_KEY = ['userIntegrations']

export function useIntegrationsQuery() {
  return useQuery<UserIntegrationItem[]>({
    queryKey: INTEGRATIONS_QUERY_KEY,
    queryFn: () => integrationsApi.getIntegrations(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}

export function useConnectIntegrationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ provider, payload }: { provider: string; payload?: { auth_code?: string; api_key?: string } }) =>
      integrationsApi.connectIntegration(provider, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY })
    },
  })
}

export function useDisconnectIntegrationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (provider: string) => integrationsApi.disconnectIntegration(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY })
    },
  })
}

export function useSaveOpenAIKeyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (apiKey: string) => integrationsApi.saveOpenAIKey(apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY })
    },
  })
}

export function useSyncIntegrationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (provider: string) => integrationsApi.syncIntegration(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTEGRATIONS_QUERY_KEY })
    },
  })
}
