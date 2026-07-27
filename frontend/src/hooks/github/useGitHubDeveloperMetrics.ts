import { useQuery } from '@tanstack/react-query'
import { fetchGitHubDeveloperMetricsData } from '@/api/github'

export const useGitHubDeveloperMetrics = () => {
  return useQuery({
    queryKey: ['github', 'developer-metrics'],
    queryFn: fetchGitHubDeveloperMetricsData,
    staleTime: 5 * 60 * 1000,
  })
}
