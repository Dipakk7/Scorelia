import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { knowledgeService } from '@/services/knowledgeService'
import type { KnowledgeCollectionItem } from '@/data/taskAutomationKnowledgeMockData'

export function useKnowledgeCollections() {
  const queryClient = useQueryClient()

  const { data: collections = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['agentKnowledgeCollections'],
    queryFn: () => knowledgeService.getCollections(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 2,
  })

  const { data: sources = [] } = useQuery({
    queryKey: ['agentKnowledgeSources'],
    queryFn: () => knowledgeService.getSources(),
    staleTime: 1000 * 60 * 5,
  })

  const assignMutation = useMutation({
    mutationFn: ({ collectionId, agentName }: { collectionId: string; agentName: string }) =>
      knowledgeService.assignCollectionToAgent(collectionId, agentName),
    onSuccess: (_, { collectionId, agentName }) => {
      queryClient.setQueryData<KnowledgeCollectionItem[]>(['agentKnowledgeCollections'], (old = []) =>
        old.map((c) => {
          if (c.id === collectionId && !c.assignedAgents.includes(agentName)) {
            return { ...c, assignedAgents: [...c.assignedAgents, agentName] }
          }
          return c
        })
      )
      queryClient.invalidateQueries({ queryKey: ['agentKnowledgeCollections'] })
    },
  })

  return {
    collections,
    sources,
    isLoading,
    isError,
    error,
    refetch,
    assignCollection: assignMutation.mutateAsync,
    isAssigning: assignMutation.isPending,
  }
}

export default useKnowledgeCollections
