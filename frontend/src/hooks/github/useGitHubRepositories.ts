import { useQuery } from '@tanstack/react-query'
import { fetchGitHubRepositoriesData } from '@/api/github'

export const useGitHubRepositories = () => {
  return useQuery({
    queryKey: ['github', 'repositories'],
    queryFn: fetchGitHubRepositoriesData,
    staleTime: 5 * 60 * 1000,
  })
}
