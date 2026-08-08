import React from 'react'
import { Award, Zap, Activity, Users } from 'lucide-react'
import { githubDeveloperMetricsMockData, type ProductivityInsightsData } from '@/data/githubDeveloperMetricsMockData'
import { MetricTrendCard } from './MetricTrendCard'
import { cn } from '@/lib/utils'

export interface DeveloperPerformanceCardsProps {
  productivity?: ProductivityInsightsData
  className?: string
}

export const DeveloperPerformanceCards: React.FC<DeveloperPerformanceCardsProps> = ({
  productivity = githubDeveloperMetricsMockData.productivity,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-sans select-none', className)}>
      <MetricTrendCard
        title="Developer Score"
        value={`${productivity.developerScore}/100`}
        trend="+5 pts"
        trendDirection="up"
        comparisonLabel="Top 12% globally"
        sparklineData={[82, 85, 87, 88, 90, 91, 92]}
        statusColor="#a855f7"
        icon={Award}
      />

      <MetricTrendCard
        title="Velocity Score"
        value={`${productivity.velocityScore}/100`}
        trend="+12%"
        trendDirection="up"
        comparisonLabel="High shipping rate"
        sparklineData={[75, 78, 82, 85, 87, 89, 90]}
        statusColor="#38bdf8"
        icon={Zap}
      />

      <MetricTrendCard
        title="Consistency Score"
        value={`${productivity.consistencyScore}/100`}
        trend="+4%"
        trendDirection="up"
        comparisonLabel="30-day streak"
        sparklineData={[80, 82, 84, 85, 86, 87, 88]}
        statusColor="#34d399"
        icon={Activity}
      />

      <MetricTrendCard
        title="Collaboration Score"
        value={`${productivity.collaborationScore}/100`}
        trend="+9%"
        trendDirection="up"
        comparisonLabel="14 PR reviews completed"
        sparklineData={[85, 87, 89, 90, 92, 93, 94]}
        statusColor="#fb7185"
        icon={Users}
      />
    </div>
  )
}

export default DeveloperPerformanceCards
