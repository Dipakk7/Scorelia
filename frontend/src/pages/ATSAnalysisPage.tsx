import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { useATSAnalysis } from '@/hooks/useATSAnalysis'
import type { ATSReportPayload } from '@/lib/ats-export'
import { mockSectionDetailsMap } from '@/lib/ats-section-mock-data'

// UI & Layout Components
import EmptyResumeState from '@/components/ui/EmptyResumeState'

// Header & Navigation Components
import { ATSHeader, type ATSTab } from '@/components/ats-analysis/ATSHeader'
import { ResumeSelector, type ResumeOption } from '@/components/ats-analysis/ResumeSelector'
import { ATSHeroCard } from '@/components/ats-analysis/ATSHeroCard'
import { MetricsGrid } from '@/components/ats-analysis/MetricsGrid'
import { WorkspaceLayout } from '@/components/ats-analysis/WorkspaceLayout'
import { Sidebar } from '@/components/ats-analysis/Sidebar'

// Phase 2 Components
import { ATSCompatibilityCard } from '@/components/ats-analysis/ATSCompatibilityCard'
import { KeywordAnalysisCard } from '@/components/ats-analysis/KeywordAnalysisCard'
import { FormattingAnalysisCard } from '@/components/ats-analysis/FormattingAnalysisCard'
import { SectionScoresCard } from '@/components/ats-analysis/SectionScoresCard'
import { ParserPreviewCard } from '@/components/ats-analysis/ParserPreviewCard'

// Phase 3 AI Insights Components
import { AIOverviewBanner } from '@/components/ats-analysis/AIOverviewBanner'
import { PriorityRecommendationCard } from '@/components/ats-analysis/PriorityRecommendationCard'
import { KeywordIntelligenceCard } from '@/components/ats-analysis/KeywordIntelligenceCard'
import { RecruiterFeedbackCard } from '@/components/ats-analysis/RecruiterFeedbackCard'
import { OptimizationTimeline } from '@/components/ats-analysis/OptimizationTimeline'
import { RiskAnalysisCard } from '@/components/ats-analysis/RiskAnalysisCard'
import { IndustryBenchmarkCard } from '@/components/ats-analysis/IndustryBenchmarkCard'
import { ATSChecklistCard } from '@/components/ats-analysis/ATSChecklistCard'
import { AIInsightsSidebar } from '@/components/ats-analysis/AIInsightsSidebar'

// Phase 4 Section-by-Section Components
import { SectionNavigationPanel } from '@/components/ats-analysis/SectionNavigationPanel'
import { SectionAnalysisWorkspace } from '@/components/ats-analysis/SectionAnalysisWorkspace'
import { SectionKeywordCoverageCard } from '@/components/ats-analysis/SectionKeywordCoverageCard'
import { SectionFormattingReviewCard } from '@/components/ats-analysis/SectionFormattingReviewCard'
import { SectionContentQualityCard } from '@/components/ats-analysis/SectionContentQualityCard'
import { SectionATSRewriteCard } from '@/components/ats-analysis/SectionATSRewriteCard'
import { SectionImprovementTimelineCard } from '@/components/ats-analysis/SectionImprovementTimelineCard'
import { SectionSidebar } from '@/components/ats-analysis/SectionSidebar'

// Phase 9 Export Dialog Modal
import { ATSExportDialogModal } from '@/components/ats-analysis/ATSExportDialogModal'

// Error Boundary Component
import ATSWidgetErrorBoundary from '@/components/ats-analysis/ATSWidgetErrorBoundary'

// Skeleton Loaders
import {
  ATSHeroSkeleton,
  ATSMetricsSkeleton,
  ATSWorkspaceSkeleton,
} from '@/components/ats-analysis/SkeletonLoader'

export default function ATSAnalysisPage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<ATSTab>('overview')
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-summary')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const containerVariants = getContainerVariants(shouldReduceMotion)
  const sectionVariants = getSectionVariants(shouldReduceMotion)

  // Live Data Hook
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    selectedResumeTitle,
    atsOverviewData,
    aiOverviewBanner,
    quickMetrics,
    atsCompatibility,
    priorityRecommendations,
    recruiterFeedback,
    sectionDetailsMap,
    isResumesLoading,
    isAtsLoading,
    isReanalyzing,
    handleReanalyze,
  } = useATSAnalysis()

  const handleSelectResume = useCallback((resume: ResumeOption) => {
    if (resume?.id) {
      setSelectedResumeId(resume.id)
    }
  }, [setSelectedResumeId])

  const handleUploadRedirect = useCallback(() => {
    navigate('/resumes')
  }, [navigate])

  const handleOpenExportModal = useCallback(() => {
    setIsExportModalOpen(true)
  }, [])

  const handleCloseExportModal = useCallback(() => {
    setIsExportModalOpen(false)
  }, [])

  const handleTabChange = useCallback((tab: ATSTab) => {
    setActiveTab(tab)
  }, [])

  const exportPayload: ATSReportPayload = useMemo(() => ({
    resumeTitle: selectedResumeTitle || 'Software_Engineer_Resume.pdf',
    exportDate: new Date().toLocaleDateString(),
    overview: atsOverviewData,
    aiBanner: aiOverviewBanner,
    quickMetrics: quickMetrics || [],
    compatibility: atsCompatibility || [],
    recommendations: priorityRecommendations || [],
    recruiterFeedback: recruiterFeedback,
    sectionDetails: sectionDetailsMap || mockSectionDetailsMap,
  }), [selectedResumeTitle, atsOverviewData, aiOverviewBanner, quickMetrics, atsCompatibility, priorityRecommendations, recruiterFeedback, sectionDetailsMap])

  const currentSectionDetail =
    sectionDetailsMap?.[selectedSectionId] ||
    sectionDetailsMap?.['sec-summary'] ||
    mockSectionDetailsMap[selectedSectionId] ||
    mockSectionDetailsMap['sec-summary']

  // Handle Empty Resume State (User has no uploaded resumes)
  if (!isResumesLoading && (!resumes || resumes.length === 0)) {
    return (
      <div className="w-full max-w-[1920px] mx-auto py-12">
        <EmptyResumeState onUploadClick={handleUploadRedirect} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 sm:space-y-6 text-slate-100 selection:bg-purple-500/30">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-5 sm:space-y-6"
      >
        {/* ATS Header */}
        <motion.div variants={sectionVariants}>
          <ATSWidgetErrorBoundary sectionName="ATS Header">
            <ATSHeader
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onRefresh={handleReanalyze}
              onExportClick={handleOpenExportModal}
              isRefreshing={isReanalyzing || isAtsLoading}
              selectedResumeId={selectedResumeId}
              onSelectResume={handleSelectResume}
            />
          </ATSWidgetErrorBoundary>
        </motion.div>

        {/* Dynamic Workspace Layout */}
        {isAtsLoading || isReanalyzing ? (
          <div className="space-y-5 sm:space-y-6">
            <ATSHeroSkeleton />
            <ATSMetricsSkeleton />
            <ATSWorkspaceSkeleton />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* VIEW 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="view-overview"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 sm:space-y-6"
              >
                <ATSWidgetErrorBoundary sectionName="ATS Score Overview">
                  <ATSHeroCard data={atsOverviewData} onAnalyzeClick={handleReanalyze} />
                </ATSWidgetErrorBoundary>

                <ATSWidgetErrorBoundary sectionName="Performance Metrics Grid">
                  <MetricsGrid />
                </ATSWidgetErrorBoundary>

                <WorkspaceLayout
                  leftContent={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="Priority Recommendations">
                        <PriorityRecommendationCard />
                      </ATSWidgetErrorBoundary>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Optimization Sequence">
                            <OptimizationTimeline />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Industry Peer Benchmark">
                            <IndustryBenchmarkCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    </div>
                  }
                  rightSidebar={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                        <AIInsightsSidebar />
                      </ATSWidgetErrorBoundary>
                      <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                        <Sidebar onStartAnalysis={handleReanalyze} />
                      </ATSWidgetErrorBoundary>
                    </div>
                  }
                />
              </motion.div>
            )}

            {/* VIEW 2: ATS KEYWORDS */}
            {activeTab === 'keyword-match' && (
              <motion.div
                key="view-keyword-match"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 sm:space-y-6"
              >
                <WorkspaceLayout
                  leftContent={
                    <ATSWidgetErrorBoundary sectionName="Keyword Intelligence Workspace">
                      <KeywordAnalysisCard />
                    </ATSWidgetErrorBoundary>
                  }
                  rightSidebar={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                        <AIInsightsSidebar />
                      </ATSWidgetErrorBoundary>
                      <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                        <Sidebar onStartAnalysis={handleReanalyze} />
                      </ATSWidgetErrorBoundary>
                    </div>
                  }
                />
              </motion.div>
            )}

            {/* VIEW 3: FORMAT & RISK */}
            {activeTab === 'format-check' && (
              <motion.div
                key="view-format-check"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 sm:space-y-6"
              >
                <WorkspaceLayout
                  leftContent={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="Formatting Audit">
                        <FormattingAnalysisCard />
                      </ATSWidgetErrorBoundary>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Risk Analysis">
                            <RiskAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Readiness Master Checklist">
                            <ATSChecklistCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    </div>
                  }
                  rightSidebar={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                        <AIInsightsSidebar />
                      </ATSWidgetErrorBoundary>
                      <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                        <Sidebar onStartAnalysis={handleReanalyze} />
                      </ATSWidgetErrorBoundary>
                    </div>
                  }
                />
              </motion.div>
            )}

            {/* VIEW 4: RECRUITER VIEW (ATS SIMULATION) */}
            {activeTab === 'ats-simulation' && (
              <motion.div
                key="view-ats-simulation"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 sm:space-y-6"
              >
                <ATSWidgetErrorBoundary sectionName="ATS System Compatibility">
                  <ATSCompatibilityCard />
                </ATSWidgetErrorBoundary>

                <WorkspaceLayout
                  leftContent={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="Recruiter Feedback">
                        <RecruiterFeedbackCard data={recruiterFeedback} />
                      </ATSWidgetErrorBoundary>
                      <ATSWidgetErrorBoundary sectionName="ATS Parser Preview">
                        <ParserPreviewCard />
                      </ATSWidgetErrorBoundary>
                    </div>
                  }
                  rightSidebar={
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                        <AIInsightsSidebar />
                      </ATSWidgetErrorBoundary>
                      <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                        <Sidebar onStartAnalysis={handleReanalyze} />
                      </ATSWidgetErrorBoundary>
                    </div>
                  }
                />
              </motion.div>
            )}

            {/* VIEW 5: DETAILED REPORT */}
            {activeTab === 'detailed-report' && (
              <motion.div
                key="view-detailed-report"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5 sm:space-y-6"
              >
                <ATSWidgetErrorBoundary sectionName="Section Navigation">
                  <SectionNavigationPanel
                    selectedSectionId={selectedSectionId}
                    onSelectSection={setSelectedSectionId}
                  />
                </ATSWidgetErrorBoundary>

                <WorkspaceLayout
                  leftContent={
                    currentSectionDetail && (
                      <motion.div
                        key={selectedSectionId}
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch"
                      >
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="Section Analysis Workspace">
                            <SectionAnalysisWorkspace section={currentSectionDetail} />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Section Keyword Coverage">
                            <SectionKeywordCoverageCard keywords={currentSectionDetail.keywords} />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Section Formatting Review">
                            <SectionFormattingReviewCard formattingChecks={currentSectionDetail.formattingChecks} />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Section Content Quality">
                            <SectionContentQualityCard contentQuality={currentSectionDetail.contentQuality} />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col">
                          <ATSWidgetErrorBoundary sectionName="Section ATS Rewrite">
                            <SectionATSRewriteCard
                              currentContent={currentSectionDetail.currentContent}
                              suggestedRewrite={currentSectionDetail.suggestedRewrite}
                            />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="Section Improvement Sequence">
                            <SectionImprovementTimelineCard timeline={currentSectionDetail.timeline} />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="Section Scores Breakdown">
                            <SectionScoresCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </motion.div>
                    )
                  }
                  rightSidebar={
                    <div className="space-y-5 sm:space-y-6">
                      {currentSectionDetail && (
                        <ATSWidgetErrorBoundary sectionName="Section Summary Sidebar">
                          <SectionSidebar section={currentSectionDetail} />
                        </ATSWidgetErrorBoundary>
                      )}
                      <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                        <AIInsightsSidebar />
                      </ATSWidgetErrorBoundary>
                    </div>
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Phase 9 Report Export Dialog Modal */}
      <ATSExportDialogModal
        isOpen={isExportModalOpen}
        onClose={handleCloseExportModal}
        payload={exportPayload}
      />
    </div>
  )
}
