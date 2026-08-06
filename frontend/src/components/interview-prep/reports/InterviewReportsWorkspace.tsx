import React from 'react'
import { motion } from 'framer-motion'
import { ReportsHeader } from './ReportsHeader'
import { ReportSummaryCard } from './ReportSummaryCard'
import { InterviewReportCard } from './InterviewReportCard'
import { PerformanceReportCard } from './PerformanceReportCard'
import { SkillReportCard } from './SkillReportCard'
import { RecommendationReportCard } from './RecommendationReportCard'
import { ExportPanel } from './ExportPanel'
import { ReportTimeline } from './ReportTimeline'
import { useInterviewReports } from '@/hooks/useInterviewPrep'
import toast from 'react-hot-toast'

export function InterviewReportsWorkspace() {
  const { reportsData: data, isLoading } = useInterviewReports()

  const handleQuickExport = () => {
    toast.success('Quick Export PDF initialized! Downloading document...')
  }

  if (isLoading || !data) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs font-medium">
        Loading Reports & Export workspace...
      </div>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-5 text-left"
    >
      {/* 1. Header */}
      <ReportsHeader
        overallReadinessScore={data.summary.overallReadinessScore}
        onQuickExport={handleQuickExport}
      />

      {/* 2. Main 12-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* Main Reports Content Area (8 Columns) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <ReportSummaryCard summary={data.summary} />
          <InterviewReportCard reports={data.availableReports} />
          <PerformanceReportCard />
          <SkillReportCard />
          <RecommendationReportCard />
        </div>

        {/* Export & Timeline Sidebar (4 Columns) */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-5">
            <ExportPanel exportFormats={data.exportFormats} />
            <ReportTimeline timeline={data.timeline} />
          </div>
        </div>
      </div>
    </motion.main>
  )
}
export default InterviewReportsWorkspace
