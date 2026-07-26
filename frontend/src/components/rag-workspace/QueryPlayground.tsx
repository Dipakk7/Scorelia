import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useScoreliaReducedMotion } from '@/lib/motion'
import { MOCK_RETRIEVED_DOCUMENTS } from '@/data/ragQueryMockData'
import type { SearchSettings, RetrievedDocument } from '@/data/ragQueryMockData'
import { useRAGQueryPlayground } from '@/hooks/useRAGQueryPlayground'
import { PlaygroundHeader } from './PlaygroundHeader'
import { QueryComposer } from './QueryComposer'
import { SearchConfiguration } from './SearchConfiguration'
import { SuggestedPrompts } from './SuggestedPrompts'
import { QueryHistory } from './QueryHistory'
import { SearchResults } from './SearchResults'
import { cn } from '@/lib/utils'

export interface QueryPlaygroundProps {
  className?: string
}

export function QueryPlayground({ className }: QueryPlaygroundProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const { runSearch, isSearching } = useRAGQueryPlayground()

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
  const [activeQueryText, setActiveQueryText] = useState(
    'What is Retrieval-Augmented Generation?'
  )

  const handleRunQuery = async (queryText: string) => {
    setActiveQueryText(queryText)
    try {
      const results = await runSearch({ query: queryText, settings })
      setSearchResults(results)
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
      className={cn('space-y-6 text-left', className)}
    >
      {/* Header */}
      <PlaygroundHeader statusText={isSearching ? 'Executing Search...' : 'Ready'} />

      {/* Query Composer Textarea */}
      <QueryComposer
        onRunQuery={handleRunQuery}
        initialQuery={activeQueryText}
      />

      {/* Search Configuration Parameters */}
      <SearchConfiguration
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* Suggested Prompts Chips */}
      <SuggestedPrompts onSelectPrompt={handleRunQuery} />

      {/* Search Results Display */}
      <SearchResults documents={searchResults} />

      {/* Query History */}
      <QueryHistory onRunQuery={handleRunQuery} />
    </motion.div>
  )
}

export default QueryPlayground
