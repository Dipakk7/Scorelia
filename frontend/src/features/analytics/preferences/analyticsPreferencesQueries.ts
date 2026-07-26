import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { analyticsPreferencesService } from './analyticsPreferencesService'
import { analyticsPreferencesKeys } from './analyticsPreferencesKeys'
import type { UserAnalyticsPreferences } from './analyticsPreferencesTypes'

export const DEFAULT_USER_PREFERENCES: UserAnalyticsPreferences = {
  selectedPresetId: 'exec_overview',
  widgets: [
    { id: 'hero_kpis', name: 'Executive Hero KPIs', category: 'Overview', visible: true, size: 'full', order: 1, pinned: true },
    { id: 'platform_activity', name: 'Platform Activity Chart', category: 'Charts', visible: true, size: 'medium', order: 2, pinned: false },
    { id: 'active_users', name: 'Active Users Growth', category: 'Charts', visible: true, size: 'medium', order: 3, pinned: false },
    { id: 'top_features', name: 'Top Features Usage', category: 'Charts', visible: true, size: 'medium', order: 4, pinned: false },
    { id: 'performance_overview', name: 'System Performance SLA', category: 'Performance', visible: true, size: 'full', order: 5, pinned: false },
    { id: 'ai_insights', name: 'AI Executive Insights', category: 'Intelligence', visible: true, size: 'small', order: 6, pinned: true },
    { id: 'activity_timeline', name: 'Activity Feed Log', category: 'Intelligence', visible: true, size: 'small', order: 7, pinned: false },
    { id: 'quick_actions', name: 'Productivity Quick Actions', category: 'Utilities', visible: true, size: 'small', order: 8, pinned: false },
  ],
  favoriteReportIds: ['rep_1', 'rep_2'],
  pinnedInsightIds: ['engagement_spike'],
  collapsedSectionIds: [],
  displayPreferences: {
    theme: 'dark',
    compactMode: false,
    autoRefreshInterval: 300,
    showSparklines: true,
  },
}

export function useAnalyticsPreferences() {
  return useQuery({
    queryKey: analyticsPreferencesKeys.user(),
    queryFn: () => analyticsPreferencesService.getPreferences(),
    select: (data) => data.data,
    placeholderData: {
      success: true,
      message: 'Default preferences',
      data: DEFAULT_USER_PREFERENCES,
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export function useUpdateAnalyticsPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPrefs: UserAnalyticsPreferences) =>
      analyticsPreferencesService.updatePreferences(newPrefs),
    onSuccess: (data) => {
      queryClient.setQueryData(analyticsPreferencesKeys.user(), data)
    },
  })
}

export function useResetAnalyticsPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => analyticsPreferencesService.resetPreferences(),
    onSuccess: (data) => {
      queryClient.setQueryData(analyticsPreferencesKeys.user(), data)
    },
  })
}
