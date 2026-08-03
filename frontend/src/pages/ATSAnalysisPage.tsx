import React, { useState, useCallback, useMemo } from 'react'
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
    <div className="w-full max-w-[1920px] mx-auto space-y-6 text-slate-100 selection:bg-purple-500/30">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* ATS Header */}
        <motion.div variants={sectionVariants}>
          <ATSWidgetErrorBoundary sectionName="ATS Header">
            <ATSHeader
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onRefresh={handleReanalyze}
              onExportClick={handleOpenExportModal}
              isRefreshing={isReanalyzing || isAtsLoading}
            />
          </ATSWidgetErrorBoundary>
        </motion.div>

        {/* Resume Selector */}
        <motion.div variants={sectionVariants}>
          <ATSWidgetErrorBoundary sectionName="Target Resume Selector">
            <ResumeSelector
              selectedId={selectedResumeId}
              onSelectResume={handleSelectResume}
            />
          </ATSWidgetErrorBoundary>
        </motion.div>

        {/* AI Readiness Overview Banner */}
        <motion.div variants={sectionVariants}>
          <ATSWidgetErrorBoundary sectionName="AI Readiness Overview">
            <AIOverviewBanner data={aiOverviewBanner} onOptimizeClick={handleReanalyze} />
          </ATSWidgetErrorBoundary>
        </motion.div>

        {/* Dynamic Workspace Layout with Refresh / Loading Simulation */}
        {isAtsLoading || isReanalyzing ? (
          <div className="space-y-6">
            <ATSHeroSkeleton />
            <ATSMetricsSkeleton />
            <ATSWorkspaceSkeleton />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ATS Score Overview Hero Card */}
              <ATSWidgetErrorBoundary sectionName="ATS Score Overview">
                <ATSHeroCard data={atsOverviewData} onAnalyzeClick={handleReanalyze} />
              </ATSWidgetErrorBoundary>

              {/* Quick Performance Metrics Grid */}
              <ATSWidgetErrorBoundary sectionName="Performance Metrics Grid">
                <MetricsGrid />
              </ATSWidgetErrorBoundary>

              {/* Section Navigation Panel */}
              <ATSWidgetErrorBoundary sectionName="Section Navigation">
                <SectionNavigationPanel
                  selectedSectionId={selectedSectionId}
                  onSelectSection={setSelectedSectionId}
                />
              </ATSWidgetErrorBoundary>

              {/* Main Workspace Grid (70% Left / 30% Right Sidebar) */}
              <WorkspaceLayout
                leftContent={
                  <div className="space-y-6">
                    {/* Section-by-Section Workspace */}
                    {currentSectionDetail && (
                      <motion.div
                        key={selectedSectionId}
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        <ATSWidgetErrorBoundary sectionName="Section Analysis Workspace">
                          <SectionAnalysisWorkspace section={currentSectionDetail} />
                        </ATSWidgetErrorBoundary>

                        <ATSWidgetErrorBoundary sectionName="Section Keyword Coverage">
                          <SectionKeywordCoverageCard keywords={currentSectionDetail.keywords} />
                        </ATSWidgetErrorBoundary>

                        <ATSWidgetErrorBoundary sectionName="Section Formatting Review">
                          <SectionFormattingReviewCard formattingChecks={currentSectionDetail.formattingChecks} />
                        </ATSWidgetErrorBoundary>

                        <ATSWidgetErrorBoundary sectionName="Section Content Quality">
                          <SectionContentQualityCard contentQuality={currentSectionDetail.contentQuality} />
                        </ATSWidgetErrorBoundary>

                        <ATSWidgetErrorBoundary sectionName="Section ATS Rewrite">
                          <SectionATSRewriteCard
                            currentContent={currentSectionDetail.currentContent}
                            suggestedRewrite={currentSectionDetail.suggestedRewrite}
                          />
                        </ATSWidgetErrorBoundary>

                        <ATSWidgetErrorBoundary sectionName="Section Improvement Sequence">
                          <SectionImprovementTimelineCard timeline={currentSectionDetail.timeline} />
                        </ATSWidgetErrorBoundary>
                      </motion.div>
                    )}

                    {/* Tab Views Filtering */}
                    {(activeTab === 'overview' || activeTab === 'detailed-report') && (
                      <>
                        <ATSWidgetErrorBoundary sectionName="Priority Recommendations">
                          <PriorityRecommendationCard />
                        </ATSWidgetErrorBoundary>
                        <ATSWidgetErrorBoundary sectionName="Keyword Intelligence">
                          <KeywordIntelligenceCard />
                        </ATSWidgetErrorBoundary>
                      </>
                    )}

                    {activeTab === 'keyword-match' && (
                      <>
                        <ATSWidgetErrorBoundary sectionName="Keyword Intelligence">
                          <KeywordIntelligenceCard />
                        </ATSWidgetErrorBoundary>
                      </>
                    )}

                    {activeTab === 'content-optimization' && (
                      <>
                        <ATSWidgetErrorBoundary sectionName="Priority Recommendations">
                          <PriorityRecommendationCard />
                        </ATSWidgetErrorBoundary>
                      </>
                    )}
                  </div>
                }
                rightSidebar={
                  <div className="space-y-6">
                    {currentSectionDetail && (
                      <ATSWidgetErrorBoundary sectionName="Section Summary Sidebar">
                        <SectionSidebar section={currentSectionDetail} />
                      </ATSWidgetErrorBoundary>
                    )}
                    <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                      <AIInsightsSidebar />
                    </ATSWidgetErrorBoundary>
                    <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                      <Sidebar onStartAnalysis={handleReanalyze} />
                    </ATSWidgetErrorBoundary>
                  </div>
                }
                bottomContent={
                  <>
                    {(activeTab === 'overview' || activeTab === 'detailed-report') && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                        {/* Row 1: System Compatibility (7 cols) + Recruiter Feedback (5 cols) */}
                        <div className="lg:col-span-7 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="ATS System Compatibility">
                            <ATSCompatibilityCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-5 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Recruiter Feedback">
                            <RecruiterFeedbackCard data={recruiterFeedback} />
                          </ATSWidgetErrorBoundary>
                        </div>

                        {/* Row 2: Optimization Timeline (7 cols) + Risk Analysis (5 cols) */}
                        <div className="lg:col-span-7 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Optimization Sequence">
                            <OptimizationTimeline />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-5 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Risk Analysis">
                            <RiskAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        </div>

                        {/* Row 3: Industry Peer Benchmark (6 cols) + Readiness Master Checklist (6 cols) */}
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Industry Peer Benchmark">
                            <IndustryBenchmarkCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Readiness Master Checklist">
                            <ATSChecklistCard />
                          </ATSWidgetErrorBoundary>
                        </div>

                        {/* Row 4: Formatting Audit (6 cols) + Section Scores Breakdown (6 cols) */}
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Formatting Audit">
                            <FormattingAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Section Scores Breakdown">
                            <SectionScoresCard />
                          </ATSWidgetErrorBoundary>
                        </div>

                        {/* Row 5: ATS Parser Preview (12 cols) */}
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="ATS Parser Preview">
                            <ParserPreviewCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    )}

                    {activeTab === 'keyword-match' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="Keyword Match & Density">
                            <KeywordAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    )}

                    {activeTab === 'format-check' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Formatting Audit">
                            <FormattingAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Risk Analysis">
                            <RiskAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="Readiness Master Checklist">
                            <ATSChecklistCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    )}

                    {activeTab === 'content-optimization' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Section Scores Breakdown">
                            <SectionScoresCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Optimization Sequence">
                            <OptimizationTimeline />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    )}

                    {activeTab === 'ats-simulation' && (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="Recruiter Feedback">
                            <RecruiterFeedbackCard data={recruiterFeedback} />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-6 flex flex-col h-full">
                          <ATSWidgetErrorBoundary sectionName="ATS System Compatibility">
                            <ATSCompatibilityCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                        <div className="lg:col-span-12">
                          <ATSWidgetErrorBoundary sectionName="ATS Parser Preview">
                            <ParserPreviewCard />
                          </ATSWidgetErrorBoundary>
                        </div>
                      </div>
                    )}
                  </>
                }
              />
            </motion.div>
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
