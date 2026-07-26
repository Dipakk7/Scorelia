import React from 'react'
import { MilestonesOverview } from './MilestonesOverview'
import { GoalTracker } from './GoalTracker'
import { MilestoneTimeline } from './MilestoneTimeline'
import { UpcomingMilestones } from './UpcomingMilestones'
import { AchievementGallery } from './AchievementGallery'
import { NextStepsPlanner } from './NextStepsPlanner'
import { ProgressHistory } from './ProgressHistory'
import { ProductivityInsights } from './ProductivityInsights'
import { SkeletonMilestones } from '../common/SkeletonMilestones'
import { useMilestones } from '@/hooks/useMilestones'
import { cn } from '@/lib/utils'

export interface MilestonesWorkspaceProps {
  className?: string
}

export function MilestonesWorkspace({ className }: MilestonesWorkspaceProps) {
  const {
    overview,
    goalTracker,
    milestones,
    upcomingMilestones,
    achievements,
    nextSteps,
    productivityInsights,
    progressHistory,
    isLoading,
  } = useMilestones()

  if (isLoading && !overview) {
    return <SkeletonMilestones />
  }

  return (
    <div className={cn('space-y-6 text-left', className)}>
      {/* 1. Milestones Overview KPIs */}
      <MilestonesOverview overview={overview} />

      {/* 2. Goal Health Tracker */}
      <GoalTracker goalData={goalTracker} />

      {/* 3. Chronological Milestone Cards Timeline */}
      <MilestoneTimeline milestones={milestones.length > 0 ? milestones : undefined} />

      {/* 4. Upcoming Deadlines */}
      <UpcomingMilestones upcoming={upcomingMilestones.length > 0 ? upcomingMilestones : undefined} />

      {/* 5. Achievement Gallery */}
      <AchievementGallery achievements={achievements.length > 0 ? achievements : undefined} />

      {/* 6. Next Steps Action Planner */}
      <NextStepsPlanner items={nextSteps.length > 0 ? nextSteps : undefined} />

      {/* 7. Productivity Insights */}
      <ProductivityInsights insights={productivityInsights} />

      {/* 8. Progress History Log */}
      <ProgressHistory history={progressHistory.length > 0 ? progressHistory : undefined} />
    </div>
  )
}
export default MilestonesWorkspace
