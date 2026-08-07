import React, { useState } from 'react'
import { ReportsHeader } from './ReportsHeader'
import { ExecutiveSummary } from './ExecutiveSummary'
import { ReportFilters } from './ReportFilters'
import { SkillsReport } from './SkillsReport'
import { TimelineReport } from './TimelineReport'
import { MilestoneReport } from './MilestoneReport'
import { AIInsightsReport } from './AIInsightsReport'
import { ExportPanel } from './ExportPanel'
import { CareerTipsCard } from '../jobs/CareerTipsCard'
import { CareerAssistant } from '../assistant/CareerAssistant'
import { ShareReportDialog } from './ShareReportDialog'
import { ReportFooter } from './ReportFooter'
import { useCareerRoadmap } from '@/hooks/useCareerRoadmap'
import { useRoadmapTimeline } from '@/hooks/useRoadmapTimeline'
import { useSkillsGap } from '@/hooks/useSkillsGap'
import { useMilestones } from '@/hooks/useMilestones'
import { cn } from '@/lib/utils'

export interface ReportsWorkspaceProps {
  className?: string
}

export function ReportsWorkspace({ className }: ReportsWorkspaceProps) {
  const [isShareOpen, setIsShareOpen] = useState(false)
  const { heroData, refetch: refetchHero } = useCareerRoadmap()
  const { phases } = useRoadmapTimeline()
  const { skillCategories } = useSkillsGap()
  const { overview: milestoneOverview, goalTracker } = useMilestones()

  const handleRefresh = () => {
    refetchHero()
  }

  return (
    <div className={cn('w-full space-y-4 sm:space-y-5 text-left', className)}>
      {/* Top Banner: Reports Header */}
      <ReportsHeader
        overallCompletion={heroData?.kpis.find((k) => k.id === 'estimated-readiness')?.progressValue || 78}
        onRefresh={handleRefresh}
        onShare={() => setIsShareOpen(true)}
      />

      {/* Balanced 2-Stack Container (~1300px Finish Line on Both Stacks) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start w-full">
        {/* Left Column Stack (~1300px Total Height Finish) */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5 w-full">
          {/* Executive Summary & KPIs */}
          <ExecutiveSummary
            careerReadiness={heroData?.kpis.find((k) => k.id === 'estimated-readiness')?.progressValue || 78}
            overallCompletion={heroData?.kpis.find((k) => k.id === 'current-progress')?.progressValue || 32}
          />

          {/* Interactive Report Filters */}
          <ReportFilters />

          {/* Skills Audit & Proficiency Report */}
          <SkillsReport categories={skillCategories.length > 0 ? skillCategories : undefined} />

          {/* 12-Month Timeline Progress Report */}
          <TimelineReport phases={phases.length > 0 ? phases : undefined} />
        </div>

        {/* Right Column Stack (~1270px Total Height Finish) */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-5 w-full">
          {/* Milestones & Goal Delivery Report */}
          <MilestoneReport overview={milestoneOverview} goalTracker={goalTracker} />

          {/* AI Career Copilot & Assistant Workspace */}
          <CareerAssistant />
        </div>
      </div>

      {/* Sequential Concluding Sections: Strategic Tips -> Export & Download -> AI Audit -> Report Footer */}
      <div className="w-full space-y-4 sm:space-y-5">
        {/* 1. Strategic Career & Application Tips */}
        <CareerTipsCard />

        {/* 2. Export & Download Report Options */}
        <ExportPanel />

        {/* 3. AI Career Copilot Intelligence Audit */}
        <AIInsightsReport />

        {/* 4. Executive Report Summary & Share CTA Footer */}
        <ReportFooter />
      </div>

      {/* Share Report Dialog Modal */}
      <ShareReportDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  )
}

export function ReportsPrimaryWorkspace(props: ReportsWorkspaceProps) {
  return <ReportsWorkspace {...props} />
}

export function ReportsFullWidthFooter(props: ReportsWorkspaceProps) {
  return null
}

export default ReportsWorkspace
