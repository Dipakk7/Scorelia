import { useQuery } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'

export function useRAGKnowledgeGraph() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['ragKnowledgeGraph'],
    queryFn: () => ragWorkspaceService.getKnowledgeGraph(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false
  })

  return {
    nodes: data?.nodes || [],
    edges: data?.edges || [],
    isLoading,
    isError,
    refetch
  }
}

export default useRAGKnowledgeGraph
