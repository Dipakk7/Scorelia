import { useMutation } from '@tanstack/react-query'
import { ragWorkspaceService } from '@/services/ragWorkspaceService'
import type { SearchSettings, RetrievedDocument, ChatMessage } from '@/data/ragQueryMockData'

export function useRAGQueryPlayground() {
  const searchMutation = useMutation({
    mutationFn: ({ query, settings }: { query: string; settings: SearchSettings }) =>
      ragWorkspaceService.runSearchQuery(query, settings)
  })

  const chatMutation = useMutation({
    mutationFn: (query: string) => ragWorkspaceService.sendChatMessage(query)
  })

  return {
    runSearch: searchMutation.mutateAsync,
    isSearching: searchMutation.isPending,
    searchResults: searchMutation.data,
    sendChatMessage: chatMutation.mutateAsync,
    isChatting: chatMutation.isPending,
    chatResult: chatMutation.data
  }
}

export default useRAGQueryPlayground
