import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { personalizationApi } from '@/services/personalization/personalizationApi'
import type { PersonalizationResponse } from '@/services/personalization/personalizationApi'

export const PERSONALIZATION_QUERY_KEY = ['userPersonalization']

export function usePersonalizationQuery() {
  return useQuery<PersonalizationResponse>({
    queryKey: PERSONALIZATION_QUERY_KEY,
    queryFn: () => personalizationApi.getPersonalization(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}

export function useUpdateWorkspaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PersonalizationResponse>) => personalizationApi.updateWorkspace(payload),
    onMutate: async (newVal) => {
      await queryClient.cancelQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
      const prev = queryClient.getQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY)
      if (prev) {
        queryClient.setQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY, { ...prev, ...newVal })
      }
      return { prev }
    },
    onError: (_err, _var, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(PERSONALIZATION_QUERY_KEY, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
    },
  })
}

export function useUpdateAIMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PersonalizationResponse>) => personalizationApi.updateAI(payload),
    onMutate: async (newVal) => {
      await queryClient.cancelQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
      const prev = queryClient.getQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY)
      if (prev) {
        queryClient.setQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY, { ...prev, ...newVal })
      }
      return { prev }
    },
    onError: (_err, _var, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(PERSONALIZATION_QUERY_KEY, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
    },
  })
}

export function useUpdateAccessibilityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PersonalizationResponse>) => personalizationApi.updateAccessibility(payload),
    onMutate: async (newVal) => {
      await queryClient.cancelQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
      const prev = queryClient.getQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY)
      if (prev) {
        queryClient.setQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY, { ...prev, ...newVal })
      }
      return { prev }
    },
    onError: (_err, _var, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(PERSONALIZATION_QUERY_KEY, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
    },
  })
}

export function useUpdateProductivityMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<PersonalizationResponse>) => personalizationApi.updateProductivity(payload),
    onMutate: async (newVal) => {
      await queryClient.cancelQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
      const prev = queryClient.getQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY)
      if (prev) {
        queryClient.setQueryData<PersonalizationResponse>(PERSONALIZATION_QUERY_KEY, { ...prev, ...newVal })
      }
      return { prev }
    },
    onError: (_err, _var, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(PERSONALIZATION_QUERY_KEY, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
    },
  })
}

export function useResetPersonalizationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => personalizationApi.resetPersonalization(),
    onSuccess: (data) => {
      queryClient.setQueryData(PERSONALIZATION_QUERY_KEY, data)
      queryClient.invalidateQueries({ queryKey: PERSONALIZATION_QUERY_KEY })
    },
  })
}
