import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { securityApi } from '@/services/security/securityApi'
import type { PasswordChangePayload } from '@/services/security/securityApi'

export const SESSIONS_QUERY_KEY = ['userSessions']
export const DEVICES_QUERY_KEY = ['trustedDevices']
export const TWO_FACTOR_QUERY_KEY = ['user2FA']
export const LOGIN_HISTORY_QUERY_KEY = ['loginHistory']

export function useSessionsQuery() {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: () => securityApi.getSessions(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDevicesQuery() {
  return useQuery({
    queryKey: DEVICES_QUERY_KEY,
    queryFn: () => securityApi.getTrustedDevices(),
    staleTime: 1000 * 60 * 5,
  })
}

export function use2FAQuery() {
  return useQuery({
    queryKey: TWO_FACTOR_QUERY_KEY,
    queryFn: () => securityApi.get2FAStatus(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useLoginHistoryQuery() {
  return useQuery({
    queryKey: LOGIN_HISTORY_QUERY_KEY,
    queryFn: () => securityApi.getLoginHistory(),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePasswordMutation() {
  return useMutation({
    mutationFn: (payload: PasswordChangePayload) => securityApi.changePassword(payload),
  })
}

export function useEnable2FAMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => securityApi.enable2FA(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_QUERY_KEY })
    },
  })
}

export function useDisable2FAMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => securityApi.disable2FA(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TWO_FACTOR_QUERY_KEY })
    },
  })
}

export function useRevokeSessionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => securityApi.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
    },
  })
}

export function useRemoveDeviceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (deviceId: string) => securityApi.removeTrustedDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_QUERY_KEY })
    },
  })
}
