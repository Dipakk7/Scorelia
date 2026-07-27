import { useQuery } from '@tanstack/react-query'
import { fetchGitHubConnectionStatus } from '@/api/github'

export const useGitHubConnection = () => {
  return useQuery({
    queryKey: ['github', 'connection'],
    queryFn: fetchGitHubConnectionStatus,
    staleTime: 60 * 1000,
  })
}
