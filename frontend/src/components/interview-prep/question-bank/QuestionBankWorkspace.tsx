import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { QuestionBankHeader } from './QuestionBankHeader'
import { QuestionBankSearch } from './QuestionBankSearch'
import { QuestionBankFilters } from './QuestionBankFilters'
import { QuestionCategorySidebar } from './QuestionCategorySidebar'
import { QuestionCard } from './QuestionCard'
import { QuestionPreviewPanel } from './QuestionPreviewPanel'
import { PracticeSummaryCard } from './PracticeSummaryCard'
import { RecentlyPracticedSection } from './RecentlyPracticedSection'
import { useQuestionBank } from '@/hooks/useInterviewPrep'
import type { QuestionBankItem, QuestionBankFilterState } from '@/types/interviewPrep'

export function QuestionBankWorkspace() {
  const { categories, questions: apiQuestions, summary, recentPracticed, isLoading } = useQuestionBank()

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all')
  const [selectedQuestionForPreview, setSelectedQuestionForPreview] = useState<QuestionBankItem | null>(null)

  const [filters, setFilters] = useState<QuestionBankFilterState>({
    searchQuery: '',
    categoryId: 'all',
    difficulty: 'All',
    questionType: 'All',
    experience: 'All',
    company: 'All',
    tag: 'All',
  })

  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({})

  const handleToggleBookmark = (id: string) => {
    setBookmarkedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      categoryId: 'all',
      difficulty: 'All',
      questionType: 'All',
      experience: 'All',
      company: 'All',
      tag: 'All',
    })
    setSelectedCategoryId('all')
  }

  const questionsWithBookmarks = useMemo(() => {
    return apiQuestions.map((q) => ({
      ...q,
      isBookmarked: bookmarkedMap[q.id] !== undefined ? bookmarkedMap[q.id] : q.isBookmarked,
    }))
  }, [apiQuestions, bookmarkedMap])

  const filteredQuestions = useMemo(() => {
    return questionsWithBookmarks.filter((q) => {
      // Category filter
      if (selectedCategoryId !== 'all' && q.categoryId !== selectedCategoryId) {
        return false
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesTitle = q.title.toLowerCase().includes(query)
        const matchesDesc = q.shortDescription.toLowerCase().includes(query)
        const matchesCompany = q.companyTags.some((c) => c.toLowerCase().includes(query))
        const matchesRole = q.roleTags.some((r) => r.toLowerCase().includes(query))
        if (!matchesTitle && !matchesDesc && !matchesCompany && !matchesRole) {
          return false
        }
      }

      // Difficulty filter
      if (filters.difficulty !== 'All' && q.difficulty !== filters.difficulty) {
        return false
      }

      // Question Type filter
      if (filters.questionType !== 'All' && q.questionType !== filters.questionType) {
        return false
      }

      // Experience filter
      if (filters.experience !== 'All' && q.experienceLevel !== filters.experience) {
        return false
      }

      // Company filter
      if (filters.company !== 'All' && !q.companyTags.includes(filters.company)) {
        return false
      }

      return true
    })
  }, [questionsWithBookmarks, selectedCategoryId, filters])

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-5 text-left"
    >
      {/* 1. Question Bank Header */}
      <QuestionBankHeader
        totalQuestions={summary?.totalAvailable || 1250}
        onStartPractice={() => {
          if (filteredQuestions.length > 0) setSelectedQuestionForPreview(filteredQuestions[0])
        }}
      />

      {/* 2. Practice Summary Card */}
      {summary && <PracticeSummaryCard summary={summary} />}

      {/* 3. Main Question Bank Section (Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Category Sidebar (3 Columns) */}
        <div className="lg:col-span-3">
          <QuestionCategorySidebar
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>

        {/* Main Content Area (9 Columns) */}
        <div className="lg:col-span-9 space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
            {/* Search Bar */}
            <QuestionBankSearch
              value={filters.searchQuery}
              onChange={(val) => setFilters((prev) => ({ ...prev, searchQuery: val }))}
            />

            {/* Filter Options */}
            <QuestionBankFilters
              filters={filters}
              onChangeFilter={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
              onResetFilters={handleResetFilters}
            />

            {/* Question Cards Grid */}
            {isLoading ? (
              <div className="p-8 text-center bg-[#10121e]/90 border border-white/10 rounded-2xl text-slate-400 text-xs font-medium">
                Loading questions...
              </div>
            ) : filteredQuestions.length === 0 ? (
              <div className="p-8 text-center bg-[#10121e]/90 border border-white/10 rounded-2xl text-slate-400 text-xs font-medium space-y-2">
                <p>No questions found matching your filter criteria.</p>
                <button
                  onClick={handleResetFilters}
                  className="text-purple-400 font-bold underline cursor-pointer hover:text-purple-300"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {filteredQuestions.map((q) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onPreview={setSelectedQuestionForPreview}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Recently Practiced Section */}
      <RecentlyPracticedSection
        recentItems={recentPracticed}
        onSelect={(item) => {
          const match = questionsWithBookmarks.find((q) => q.title === item.questionTitle)
          if (match) setSelectedQuestionForPreview(match)
        }}
      />

      {/* 5. Question Preview Drawer / Modal */}
      <QuestionPreviewPanel
        question={selectedQuestionForPreview}
        onClose={() => setSelectedQuestionForPreview(null)}
        onToggleBookmark={handleToggleBookmark}
      />
    </motion.main>
  )
}
export default QuestionBankWorkspace
