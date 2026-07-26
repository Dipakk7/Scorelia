export const analyticsPreferencesKeys = {
  all: ['analytics-preferences'] as const,
  user: () => [...analyticsPreferencesKeys.all, 'user'] as const,
}

export default analyticsPreferencesKeys
