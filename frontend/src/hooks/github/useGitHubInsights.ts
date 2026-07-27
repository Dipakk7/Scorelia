import { useQuery } from '@tanstack/react-query'
import { fetchGitHubInsightsData } from '@/api/github'

export const useGitHubInsights = () => {
  return useQuery({
    queryKey: ['github', 'insights'],
    queryFn: fetchGitHubInsightsData,
    staleTime: 5 * 60 * 1000,
  })
}
