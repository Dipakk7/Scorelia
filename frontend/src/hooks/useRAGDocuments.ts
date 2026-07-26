import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'
import type { DocumentItem } from '@/data/ragDocumentsMockData'

export function useRAGDocuments() {
  const queryClient = useQueryClient()

  const { data: documents = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['ragDocuments'],
    queryFn: () => ragWorkspaceService.getDocuments(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      // simulate delete
      return docId
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<DocumentItem[]>(['ragDocuments'], (old = []) =>
        old.filter((d) => d.id !== deletedId)
      )
    }
  })

  return {
    documents,
    isLoading,
    isError,
    refetch,
    deleteDocument: deleteMutation.mutateAsync
  }
}

export default useRAGDocuments
