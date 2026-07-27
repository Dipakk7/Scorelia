import { useQuery } from '@tanstack/react-query'
import { fetchGitHubAnalyticsData } from '@/api/github'

export const useGitHubAnalytics = () => {
  return useQuery({
    queryKey: ['github', 'analytics'],
    queryFn: fetchGitHubAnalyticsData,
    staleTime: 5 * 60 * 1000,
  })
}
