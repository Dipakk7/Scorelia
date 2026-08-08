import React from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { AIInsightsPanel } from './AIInsightsPanel'
import { SmartRecommendations } from './SmartRecommendations'
import { AchievementTimeline } from './AchievementTimeline'
import { githubAIInsightsMockData } from '@/data/githubAIInsightsMockData'
import { cn } from '@/lib/utils'

export interface GitHubSidebarProps {
  isLoading?: boolean
  className?: string
}

export const GitHubSidebar: React.FC<GitHubSidebarProps> = ({ isLoading = false, className }) => {
  if (isLoading) {
    return (
      <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 w-full', className)}>
        <Skeleton className="h-64 rounded-2xl w-full bg-slate-900 border border-white/10" />
        <Skeleton className="h-64 rounded-2xl w-full bg-slate-900 border border-white/10" />
        <Skeleton className="h-48 rounded-2xl w-full bg-slate-900 border border-white/10" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-4 sm:space-y-5 lg:space-y-6 text-left font-sans w-full', className)}>
      <AIInsightsPanel insights={githubAIInsightsMockData.insights} />
      <SmartRecommendations recommendations={githubAIInsightsMockData.recommendations} />
      <AchievementTimeline achievements={githubAIInsightsMockData.achievements} />
    </div>
  )
}

export default GitHubSidebar
