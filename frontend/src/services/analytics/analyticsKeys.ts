export const analyticsKeys = {
  all: ['analytics-center'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  platformActivity: (range?: string) => [...analyticsKeys.all, 'platform-activity', range || '7d'] as const,
  activeUsers: (range?: string) => [...analyticsKeys.all, 'active-users', range || '7d'] as const,
  topFeatures: () => [...analyticsKeys.all, 'top-features'] as const,
  performance: () => [...analyticsKeys.all, 'performance'] as const,
  systemHealth: () => [...analyticsKeys.all, 'system-health'] as const,
  reports: () => [...analyticsKeys.all, 'reports'] as const,
  reportHistory: () => [...analyticsKeys.all, 'report-history'] as const,
  dataSources: () => [...analyticsKeys.all, 'data-sources'] as const,
  insights: () => [...analyticsKeys.all, 'insights'] as const,
  activity: () => [...analyticsKeys.all, 'activity'] as const,
}

export default analyticsKeys
