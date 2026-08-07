import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { MOCK_RETRIEVED_DOCUMENTS, MOCK_CHAT_MESSAGES } from '@/data/ragQueryMockData'
import type { SearchSettings, RetrievedDocument, ChatMessage } from '@/data/ragQueryMockData'
import { useRAGQueryPlayground } from '@/hooks/useRAGQueryPlayground'
import { PlaygroundHeader } from './PlaygroundHeader'
import { QueryComposer } from './QueryComposer'
import { SearchConfiguration } from './SearchConfiguration'
import { SuggestedPrompts } from './SuggestedPrompts'
import { QueryHistory } from './QueryHistory'
import { SearchResults } from './SearchResults'
import { Conversation } from './Conversation'
import { ContextPanel } from './ContextPanel'
import { cn } from '@/lib/utils'

export interface QueryPlaygroundProps {
  className?: string
}

export function QueryPlayground({ className }: QueryPlaygroundProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const { runSearch, sendChatMessage, isSearching, isChatting } = useRAGQueryPlayground()

  const [settings, setSettings] = useState<SearchSettings>({
    searchType: 'Hybrid',
    topK: 5,
    rerank: true,
    temperature: 0.2,
    sourceFilter: 'all'
  })

  const [searchResults, setSearchResults] = useState<RetrievedDocument[]>(
    MOCK_RETRIEVED_DOCUMENTS
  )
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES)
  const [activeQueryText, setActiveQueryText] = useState(
    'What is Retrieval-Augmented Generation?'
  )

  const handleRunQuery = async (queryText: string) => {
    setActiveQueryText(queryText)

    // Add user message to conversation
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: 'Just now'
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      const results = await runSearch({ query: queryText, settings })
      setSearchResults(results)

      // Get assistant response
      const responseMsg = await sendChatMessage(queryText)
      const assistantMsg: ChatMessage = {
        ...responseMsg,
        citations: results.slice(0, 2).map((doc, idx) => ({
          id: `cit-${idx}`,
          documentTitle: doc.title,
          snippet: doc.snippet,
          similarityScore: doc.confidenceScore,
          pageNumber: doc.pageNumber || (idx + 1),
          chunkId: doc.chunkId || `chunk-${idx}`
        }))
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      setSearchResults(MOCK_RETRIEVED_DOCUMENTS)
    }
  }

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Flagship Query Playground Studio"
      className={cn('space-y-6 text-left', className)}
    >
      {/* 1. Playground Studio Header */}
      <PlaygroundHeader statusText={isSearching || isChatting ? 'Executing Search & Neural Generation...' : 'Ready'} />

      {/* 2. Suggested Prompt Quick Chips */}
      <SuggestedPrompts onSelectPrompt={handleRunQuery} />

      {/* 3. Flagship 2-Column AI Assistant Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main AI Studio Area: Composer, Conversation Stream & Results (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Query Composer */}
          <QueryComposer
            onRunQuery={handleRunQuery}
            initialQuery={activeQueryText}
          />

          {/* AI Conversation & Streamed Answer View */}
          <Conversation
            messages={messages}
            onRegenerate={() => handleRunQuery(activeQueryText)}
          />

          {/* Retrieved Sources & Search Results */}
          <SearchResults documents={searchResults} />
        </div>

        {/* Side Parameter & Diagnostic Inspector Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Search Configuration Parameters */}
          <SearchConfiguration
            settings={settings}
            onSettingsChange={setSettings}
          />

          {/* Active Context Information */}
          <ContextPanel
            retrievedDocsCount={searchResults.length}
            chunkCount={searchResults.reduce((acc, d) => acc + d.chunkCount, 0)}
            avgSimilarity={searchResults.length > 0 ? searchResults.reduce((acc, d) => acc + d.confidenceScore, 0) / searchResults.length : 0.9}
            embeddingModel="text-embedding-3-small"
          />

          {/* Query History */}
          <QueryHistory onRunQuery={handleRunQuery} />
        </div>
      </div>
    </motion.div>
  )
}

export default QueryPlayground

