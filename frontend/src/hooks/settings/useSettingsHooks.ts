import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '@/services/settings/settingsApi'
import type { UserSettingsResponse } from '@/services/settings/settingsApi'

export const SETTINGS_QUERY_KEY = ['userSettings']

export function useSettingsQuery() {
  return useQuery<UserSettingsResponse>({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => settingsApi.getSettings(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export function useUpdateGeneralMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<UserSettingsResponse>) => settingsApi.updateGeneral(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY })
      const previousSettings = queryClient.getQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY)

      if (previousSettings) {
        queryClient.setQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        })
      }
      return { previousSettings }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}

export function useUpdateSystemMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<UserSettingsResponse>) => settingsApi.updateSystem(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY })
      const previousSettings = queryClient.getQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY)

      if (previousSettings) {
        queryClient.setQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        })
      }
      return { previousSettings }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}

export function useUpdateAppearanceMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<UserSettingsResponse>) => settingsApi.updateAppearance(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY })
      const previousSettings = queryClient.getQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY)

      if (previousSettings) {
        queryClient.setQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        })
      }
      return { previousSettings }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}

export function useUpdateNotificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<UserSettingsResponse>) => settingsApi.updateNotifications(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY })
      const previousSettings = queryClient.getQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY)

      if (previousSettings) {
        queryClient.setQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        })
      }
      return { previousSettings }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}

export function useUpdatePrivacyMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<UserSettingsResponse>) => settingsApi.updatePrivacy(payload),
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY })
      const previousSettings = queryClient.getQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY)

      if (previousSettings) {
        queryClient.setQueryData<UserSettingsResponse>(SETTINGS_QUERY_KEY, {
          ...previousSettings,
          ...newSettings,
        })
      }
      return { previousSettings }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previousSettings)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}

export function useResetSettingsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => settingsApi.resetDefaults(),
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, data)
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
    },
  })
}

export function useSettings() {
  const query = useSettingsQuery()
  const updateGeneral = useUpdateGeneralMutation()
  const updateSystem = useUpdateSystemMutation()
  const updateAppearance = useUpdateAppearanceMutation()
  const updateNotifications = useUpdateNotificationMutation()
  const updatePrivacy = useUpdatePrivacyMutation()
  const resetDefaults = useResetSettingsMutation()

  return {
    settings: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    updateGeneral: updateGeneral.mutateAsync,
    updateSystem: updateSystem.mutateAsync,
    updateAppearance: updateAppearance.mutateAsync,
    updateNotifications: updateNotifications.mutateAsync,
    updatePrivacy: updatePrivacy.mutateAsync,
    resetDefaults: resetDefaults.mutateAsync,
    isUpdating:
      updateGeneral.isPending ||
      updateSystem.isPending ||
      updateAppearance.isPending ||
      updateNotifications.isPending ||
      updatePrivacy.isPending ||
      resetDefaults.isPending,
  }
}

export default useSettings
