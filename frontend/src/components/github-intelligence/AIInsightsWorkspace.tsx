import React from 'react'
import { githubAIInsightsMockData, type GitHubAIInsightsData } from '@/data/githubAIInsightsMockData'
import { AIInsightsPanel } from './AIInsightsPanel'
import { SmartRecommendations } from './SmartRecommendations'
import { ActivityFeedTimeline } from './ActivityFeedTimeline'
import { WeeklyEngineeringSummary } from './WeeklyEngineeringSummary'
import { GitHubGoalsProgress } from './GitHubGoalsProgress'
import { AchievementTimeline } from './AchievementTimeline'
import { AIInsightsSkeleton } from './AIInsightsSkeleton'
import { EmptyAIInsightsState } from './EmptyAIInsightsState'
import { cn } from '@/lib/utils'

export interface AIInsightsWorkspaceProps {
  data?: GitHubAIInsightsData
  isLoading?: boolean
  isEmpty?: boolean
  onSync?: () => void
  onGenerate?: () => void
  className?: string
}

export const AIInsightsWorkspace: React.FC<AIInsightsWorkspaceProps> = ({
  data = githubAIInsightsMockData,
  isLoading = false,
  isEmpty = false,
  onSync,
  onGenerate,
  className,
}) => {
  if (isLoading) {
    return <AIInsightsSkeleton />
  }

  if (isEmpty) {
    return <EmptyAIInsightsState onSync={onSync} onGenerate={onGenerate} />
  }

  return (
    <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 w-full text-left font-sans', className)}>
      {/* ROW 1: AI Engineering Insights (7 cols) & Smart Recommendations (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-7 w-full flex flex-col">
          <AIInsightsPanel insights={data.insights} className="h-full" />
        </div>
        <div className="lg:col-span-5 w-full flex flex-col">
          <SmartRecommendations recommendations={data.recommendations} className="h-full" />
        </div>
      </div>

      {/* ROW 2: Weekly Engineering Summary (6 cols) & GitHub Goals Progress (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-6 w-full flex flex-col">
          <WeeklyEngineeringSummary summary={data.weeklySummary[0]} className="h-full" />
        </div>
        <div className="lg:col-span-6 w-full flex flex-col">
          <GitHubGoalsProgress goals={data.goals} className="h-full" />
        </div>
      </div>

      {/* ROW 3: Live Realtime Activity Timeline (7 cols) & Achievements & Badges (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
        <div className="lg:col-span-7 w-full flex flex-col">
          <ActivityFeedTimeline items={data.activityFeed} className="h-full" />
        </div>
        <div className="lg:col-span-5 w-full flex flex-col">
          <AchievementTimeline achievements={data.achievements} className="h-full" />
        </div>
      </div>
    </div>
  )
}

export default AIInsightsWorkspace

