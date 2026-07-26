import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'
import type { CollectionItem } from '@/data/ragWorkspaceMockData'

export function useCollections() {
  const queryClient = useQueryClient()

  const { data: collections = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['ragCollections'],
    queryFn: () => ragWorkspaceService.getCollections(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2
  })

  const createMutation = useMutation({
    mutationFn: ({ name, description }: { name: string; description: string }) =>
      ragWorkspaceService.createCollection(name, description),
    onSuccess: (newCollection) => {
      queryClient.setQueryData<CollectionItem[]>(['ragCollections'], (old = []) => [newCollection, ...old])
      queryClient.invalidateQueries({ queryKey: ['ragCollections'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (name: string) => ragWorkspaceService.deleteCollection(name),
    onSuccess: (_, deletedName) => {
      queryClient.setQueryData<CollectionItem[]>(['ragCollections'], (old = []) =>
        old.filter((c) => c.name !== deletedName && c.id !== deletedName)
      )
      queryClient.invalidateQueries({ queryKey: ['ragCollections'] })
    }
  })

  return {
    collections,
    isLoading,
    isError,
    error,
    refetch,
    createCollection: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteCollection: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  }
}

export default useCollections
