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
    <div className={cn('space-y-6 w-full text-left font-sans', className)}>
      {/* AI Engineering Insights */}
      <AIInsightsPanel insights={data.insights} />

      {/* Smart Recommendations */}
      <SmartRecommendations recommendations={data.recommendations} />

      {/* Live Activity Feed Timeline */}
      <ActivityFeedTimeline items={data.activityFeed} />

      {/* Weekly Executive Summary */}
      <WeeklyEngineeringSummary summary={data.weeklySummary[0]} />

      {/* GitHub Goals Progress */}
      <GitHubGoalsProgress goals={data.goals} />

      {/* Achievements Timeline */}
      <AchievementTimeline achievements={data.achievements} />
    </div>
  )
}
