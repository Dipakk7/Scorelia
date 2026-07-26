import React from 'react'
import { MetricsGrid } from './overview/MetricsGrid'
import { UpcomingInterviewCard } from './overview/UpcomingInterviewCard'
import { RecommendedForYouCard } from './overview/RecommendedForYouCard'
import { PracticeTopicsCard } from './overview/PracticeTopicsCard'
import { QuestionBankCard } from './overview/QuestionBankCard'
import { SmartBoostBanner } from './overview/SmartBoostBanner'
import { useInterviewOverview } from '@/hooks/useInterviewPrep'
import type { InterviewPrepOverviewData } from '@/types/interviewPrep'

export interface InterviewPrepWorkspaceProps {
  overviewData?: InterviewPrepOverviewData
  isLoading?: boolean
  isEmpty?: boolean
  isError?: boolean
}

export function InterviewPrepWorkspace({
  overviewData: propData,
  isLoading: propIsLoading,
  isEmpty: propIsEmpty,
  isError: propIsError,
}: InterviewPrepWorkspaceProps) {
  const { overviewData: hookData, isLoading: hookIsLoading, isError: hookIsError } = useInterviewOverview()

  const overviewData = propData || hookData
  const isLoading = propIsLoading ?? hookIsLoading
  const isError = propIsError ?? hookIsError
  const isEmpty = propIsEmpty ?? (!overviewData && !isLoading)

  return (
    <div className="space-y-4 text-left">
      {/* 1. Dashboard Metrics Grid */}
      <MetricsGrid
        metrics={overviewData?.metrics}
        isLoading={isLoading}
        isEmpty={isEmpty}
        isError={isError}
      />

      {/* 2. Main Content Grid (Upcoming + Recommendations) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <UpcomingInterviewCard
          upcomingInterview={overviewData?.upcomingInterview}
          isLoading={isLoading}
          isEmpty={isEmpty}
          isError={isError}
        />
        <RecommendedForYouCard
          recommendations={overviewData?.recommendations}
          isLoading={isLoading}
          isEmpty={isEmpty}
          isError={isError}
        />
      </div>

      {/* 3. Practice Topics & Question Bank Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <PracticeTopicsCard
          topics={overviewData?.practiceTopics}
          isLoading={isLoading}
          isEmpty={isEmpty}
          isError={isError}
        />
        <QuestionBankCard
          stats={overviewData?.questionBankStats}
          isLoading={isLoading}
          isEmpty={isEmpty}
          isError={isError}
        />
      </div>

      {/* 4. Smart Copilot Boost Banner */}
      <SmartBoostBanner />
    </div>
  )
}

export default InterviewPrepWorkspace
