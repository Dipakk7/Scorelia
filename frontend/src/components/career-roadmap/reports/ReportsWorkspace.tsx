import React, { useState } from 'react'
import { ReportsHeader } from './ReportsHeader'
import { ExecutiveSummary } from './ExecutiveSummary'
import { ReportFilters } from './ReportFilters'
import { SkillsReport } from './SkillsReport'
import { TimelineReport } from './TimelineReport'
import { MilestoneReport } from './MilestoneReport'
import { AIInsightsReport } from './AIInsightsReport'
import { ExportPanel } from './ExportPanel'
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
    <div className={cn('space-y-6 text-left', className)}>
      {/* 1. Reports Header */}
      <ReportsHeader
        overallCompletion={heroData?.kpis.find((k) => k.id === 'estimated-readiness')?.progressValue || 78}
        onRefresh={handleRefresh}
        onShare={() => setIsShareOpen(true)}
      />

      {/* 2. Executive Summary & KPIs */}
      <ExecutiveSummary
        careerReadiness={heroData?.kpis.find((k) => k.id === 'estimated-readiness')?.progressValue || 78}
        overallCompletion={heroData?.kpis.find((k) => k.id === 'current-progress')?.progressValue || 32}
      />

      {/* 3. Interactive Report Filters */}
      <ReportFilters />

      {/* 4. Skills Audit & Proficiency Report */}
      <SkillsReport categories={skillCategories.length > 0 ? skillCategories : undefined} />

      {/* 5. 12-Month Timeline Progress Report */}
      <TimelineReport phases={phases.length > 0 ? phases : undefined} />

      {/* 6. Milestones & Goal Delivery Report */}
      <MilestoneReport overview={milestoneOverview} goalTracker={goalTracker} />

      {/* 7. AI Career Copilot Intelligence Audit */}
      <AIInsightsReport />

      {/* 8. Export & Download Options */}
      <ExportPanel />

      {/* 9. Report Footer */}
      <ReportFooter />

      {/* 10. Share Report Dialog Modal */}
      <ShareReportDialog isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  )
}
export default ReportsWorkspace
