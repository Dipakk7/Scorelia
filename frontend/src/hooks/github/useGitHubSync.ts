import { useMutation, useQueryClient } from '@tanstack/react-query'
import { triggerGitHubSync } from '@/api/github'

export const useGitHubSync = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: triggerGitHubSync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['github'] })
    },
  })
}
