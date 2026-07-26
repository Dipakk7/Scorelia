import React from 'react'
import { motion } from 'framer-motion'
import { PerformanceHeader } from './PerformanceHeader'
import { AnalyticsSummaryCards } from './AnalyticsSummaryCards'
import { ReadinessScoreCard } from './ReadinessScoreCard'
import { PerformanceTrendChart } from './PerformanceTrendChart'
import { SkillBreakdownChart } from './SkillBreakdownChart'
import { InterviewHistoryChart } from './InterviewHistoryChart'
import { StrengthWeaknessPanel } from './StrengthWeaknessPanel'
import { ProgressTimeline } from './ProgressTimeline'
import { GoalTrackerCard } from './GoalTrackerCard'
import { RecommendationInsightsCard } from './RecommendationInsightsCard'
import { PerformanceSidebar } from './PerformanceSidebar'
import { useInterviewAnalytics } from '@/hooks/useInterviewPrep'

export function PerformanceWorkspace() {
  const { analyticsData: data, isLoading } = useInterviewAnalytics()

  if (isLoading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Loading performance analytics...
      </div>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 text-left"
    >
      {/* 1. Header */}
      <PerformanceHeader overallScore={data.readinessGaugeScore} />

      {/* 2. Main 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Analytics Main Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Analytics Metric Summary Cards (6 Cards) */}
          <AnalyticsSummaryCards cards={data.summaryCards} />

          {/* Readiness Score & Goal Tracker Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReadinessScoreCard
              score={data.readinessGaugeScore}
              readinessTag={data.readinessTag}
            />
            <GoalTrackerCard goal={data.goalTracker} />
          </div>

          {/* Score Trajectory Trend Line Chart */}
          <PerformanceTrendChart trendPoints={data.trendPoints} />

          {/* Skill Breakdown & Proficiency Matrix */}
          <SkillBreakdownChart skills={data.skillBreakdown} />

          {/* Monthly Interview History & Strengths/Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InterviewHistoryChart historyTrends={data.historyTrends} />
            <StrengthWeaknessPanel data={data.strengthsWeaknesses} />
          </div>

          {/* Progress Milestone Timeline */}
          <ProgressTimeline events={data.timelineEvents} />

          {/* Actionable AI Coaching Insights */}
          <RecommendationInsightsCard insights={data.recommendationInsights} />
        </div>

        {/* Performance Insights Sidebar (4 Columns) */}
        <div className="lg:col-span-4">
          <PerformanceSidebar sidebarData={data.performanceSidebar} />
        </div>
      </div>
    </motion.main>
  )
}
export default PerformanceWorkspace
