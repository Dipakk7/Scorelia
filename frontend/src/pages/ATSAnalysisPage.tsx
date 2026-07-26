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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <EmptyResumeState onUploadClick={handleUploadRedirect} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* ATS Header */}
        <motion.div variants={sectionVariants}>
          <ATSHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onRefresh={handleReanalyze}
            onExportClick={handleOpenExportModal}
            isRefreshing={isReanalyzing || isAtsLoading}
          />
        </motion.div>

        {/* Resume Selector */}
        <motion.div variants={sectionVariants}>
          <ResumeSelector
            selectedId={selectedResumeId}
            onSelectResume={handleSelectResume}
          />
        </motion.div>

        {/* AI Readiness Overview Banner */}
        <motion.div variants={sectionVariants}>
          <AIOverviewBanner data={aiOverviewBanner} onOptimizeClick={handleReanalyze} />
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
              <ATSHeroCard data={atsOverviewData} onAnalyzeClick={handleReanalyze} />

              {/* Quick Performance Metrics Grid */}
              <MetricsGrid />

              {/* Section Navigation Panel */}
              <SectionNavigationPanel
                selectedSectionId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
              />

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
                        <SectionAnalysisWorkspace section={currentSectionDetail} />

                        <SectionKeywordCoverageCard keywords={currentSectionDetail.keywords} />

                        <SectionFormattingReviewCard formattingChecks={currentSectionDetail.formattingChecks} />

                        <SectionContentQualityCard contentQuality={currentSectionDetail.contentQuality} />

                        <SectionATSRewriteCard
                          currentContent={currentSectionDetail.currentContent}
                          suggestedRewrite={currentSectionDetail.suggestedRewrite}
                        />

                        <SectionImprovementTimelineCard timeline={currentSectionDetail.timeline} />
                      </motion.div>
                    )}

                    {/* Tab Views Filtering */}
                    {(activeTab === 'overview' || activeTab === 'detailed-report') && (
                      <>
                        <PriorityRecommendationCard />
                        <KeywordIntelligenceCard />
                        <ATSCompatibilityCard />
                        <RecruiterFeedbackCard data={recruiterFeedback} />
                        <OptimizationTimeline />
                        <RiskAnalysisCard />
                        <IndustryBenchmarkCard />
                        <ATSChecklistCard />
                        <FormattingAnalysisCard />
                        <SectionScoresCard />
                        <ParserPreviewCard />
                      </>
                    )}

                    {activeTab === 'keyword-match' && (
                      <>
                        <KeywordIntelligenceCard />
                        <KeywordAnalysisCard />
                      </>
                    )}

                    {activeTab === 'format-check' && (
                      <>
                        <FormattingAnalysisCard />
                        <RiskAnalysisCard />
                        <ATSChecklistCard />
                      </>
                    )}

                    {activeTab === 'content-optimization' && (
                      <>
                        <PriorityRecommendationCard />
                        <SectionScoresCard />
                        <OptimizationTimeline />
                      </>
                    )}

                    {activeTab === 'ats-simulation' && (
                      <>
                        <ParserPreviewCard />
                        <RecruiterFeedbackCard data={recruiterFeedback} />
                        <ATSCompatibilityCard />
                      </>
                    )}
                  </div>
                }
                rightSidebar={
                  <div className="space-y-6">
                    {currentSectionDetail && <SectionSidebar section={currentSectionDetail} />}
                    <AIInsightsSidebar />
                    <Sidebar onStartAnalysis={handleReanalyze} />
                  </div>
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
