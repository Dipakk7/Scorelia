import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MyAnswersHeader } from './MyAnswersHeader'
import { AnswerSummaryCard } from './AnswerSummaryCard'
import { AnswerFilters } from './AnswerFilters'
import { AnswerHistoryList } from './AnswerHistoryList'
import { AnswerDetailPanel } from './AnswerDetailPanel'
import { FeedbackPanel } from './FeedbackPanel'
import { ImprovementSuggestionsCard } from './ImprovementSuggestionsCard'
import { RecentAttemptsSection } from './RecentAttemptsSection'
import { useInterviewAnswers } from '@/hooks/useInterviewPrep'
import type { AnswerHistoryItem, AnswerFilterState } from '@/types/interviewPrep'

export function MyAnswersWorkspace() {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string>('ans-1')

  const {
    summary,
    answers: apiAnswers,
    suggestions,
    recentAttempts,
    selectedDetail,
    isLoading,
  } = useInterviewAnswers(selectedAnswerId)

  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({})
  const [favoriteMap, setFavoriteMap] = useState<Record<string, boolean>>({})

  const [filters, setFilters] = useState<AnswerFilterState>({
    searchQuery: '',
    source: 'All',
    questionType: 'All',
    difficulty: 'All',
    result: 'All',
  })

  const handleToggleBookmark = (id: string) => {
    setBookmarkedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleToggleFavorite = (id: string) => {
    setFavoriteMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      source: 'All',
      questionType: 'All',
      difficulty: 'All',
      result: 'All',
    })
  }

  const answersWithInteractions = useMemo(() => {
    return apiAnswers.map((ans) => ({
      ...ans,
      isBookmarked: bookmarkedMap[ans.id] !== undefined ? bookmarkedMap[ans.id] : ans.isBookmarked,
      isFavorite: favoriteMap[ans.id] !== undefined ? favoriteMap[ans.id] : ans.isFavorite,
    }))
  }, [apiAnswers, bookmarkedMap, favoriteMap])

  const filteredAnswers = useMemo(() => {
    return answersWithInteractions.filter((ans) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesTitle = ans.questionTitle.toLowerCase().includes(query)
        const matchesCompany = ans.companyName.toLowerCase().includes(query)
        const matchesCat = ans.categoryLabel.toLowerCase().includes(query)
        if (!matchesTitle && !matchesCompany && !matchesCat) return false
      }

      // Source filter
      if (filters.source !== 'All' && ans.source !== filters.source) return false

      // Difficulty filter
      if (filters.difficulty !== 'All' && ans.difficulty !== filters.difficulty) return false

      // Result filter
      if (filters.result !== 'All' && ans.resultTag !== filters.result) return false

      return true
    })
  }, [answersWithInteractions, filters])

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-5 text-left"
    >
      {/* 1. Header */}
      <MyAnswersHeader
        totalAnswers={summary?.totalAnswers || 38}
        lastPracticeDate="May 20, 2026"
      />

      {/* 2. Answer Analytics Summary Card */}
      {summary && <AnswerSummaryCard summary={summary} />}

      {/* 3. Search & Filter Bar */}
      <AnswerFilters
        filters={filters}
        onChangeFilter={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Split Layout (History List on Left, Detail & Feedback on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Left Column: Answer History List (5 Columns) */}
        <div className="lg:col-span-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Answer Attempts ({filteredAnswers.length})
            </h3>
            {isLoading ? (
              <div className="p-6 text-center text-slate-400 text-xs">Loading answers...</div>
            ) : (
              <AnswerHistoryList
                answers={filteredAnswers}
                selectedId={selectedAnswerId}
                onSelectAnswer={(ans) => setSelectedAnswerId(ans.id)}
                onToggleBookmark={handleToggleBookmark}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </div>
        </div>

        {/* Right Column: Answer Detail & AI Feedback Panels (7 Columns) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5 flex flex-col">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Attempt Review & Model Comparison
          </h3>
          <AnswerDetailPanel detail={selectedDetail || null} />
          <FeedbackPanel feedback={selectedDetail?.feedback || null} />
        </div>
      </div>

      {/* 5. Improvement Suggestions */}
      {suggestions && <ImprovementSuggestionsCard suggestions={suggestions} />}

      {/* 6. Recent Attempt Gains */}
      <RecentAttemptsSection
        attempts={recentAttempts}
        onSelectAttempt={(item) => {
          const match = answersWithInteractions.find((a) => a.questionTitle === item.questionTitle)
          if (match) setSelectedAnswerId(match.id)
        }}
      />
    </motion.main>
  )
}
export default MyAnswersWorkspace
