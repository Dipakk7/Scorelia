import React, { useState, useMemo, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeIntelligence } from '@/hooks/useResumeIntelligence'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useScoreliaReducedMotion } from '@/lib/motion'
import {
  transformToOverviewScore,
  transformToMiniMetrics,
  transformToBreakdownItems,
  transformToRadarData,
  transformToKeywordData,
  transformToContentStats,
  transformToBenchmarkMap,
  transformToRecruiterSimulation,
  transformToATSInfo,
  transformToRewrites,
  transformToRoadmap,
} from '@/lib/resume-intelligence-adapter'

// UI & Layout Components
import { ErrorState } from '@/components/ui/ErrorState'
import EmptyResumeState from '@/components/ui/EmptyResumeState'
import { AiResumeSkeleton } from '@/components/ui/Skeletons'
import WidgetErrorBoundary from '@/components/resume-intelligence/WidgetErrorBoundary'

// Resume Intelligence Workspace Core Components
import {
  ResumeIntelligenceHeader,
  type TabType,
} from '@/components/resume-intelligence/ResumeIntelligenceHeader'
import { ScoreOverviewCard } from '@/components/resume-intelligence/ScoreOverviewCard'
import { MiniMetricCards } from '@/components/resume-intelligence/MiniMetricCards'
import { ScoreBreakdownCard } from '@/components/resume-intelligence/ScoreBreakdownCard'
import { QualityRadarCard } from '@/components/resume-intelligence/QualityRadarCard'
import { KeywordMatchCard } from '@/components/resume-intelligence/KeywordMatchCard'
import { ContentInsightsCard } from '@/components/resume-intelligence/ContentInsightsCard'
import { CompetitorBenchmarkCard } from '@/components/resume-intelligence/CompetitorBenchmarkCard'
import { AIInsightBanner } from '@/components/resume-intelligence/AIInsightBanner'
import { AIIntelligenceSidebar } from '@/components/resume-intelligence/AIIntelligenceSidebar'
import { ExportDialog } from '@/components/resume-intelligence/ExportDialog'

// Code Splitting & Lazy Component Loading for Secondary Tabs
const AIRecruiterSimulationCard = lazy(
  () => import('@/components/resume-intelligence/ai/AIRecruiterSimulationCard')
)
const AIRiskAnalysisCard = lazy(
  () => import('@/components/resume-intelligence/ai/AIRiskAnalysisCard')
)
const AIRewriteSuggestionsCard = lazy(
  () => import('@/components/resume-intelligence/ai/AIRewriteSuggestionsCard')
)
const AIImprovementRoadmapCard = lazy(
  () => import('@/components/resume-intelligence/ai/AIImprovementRoadmapCard')
)
const AIConfidenceCard = lazy(
  () => import('@/components/resume-intelligence/ai/AIConfidenceCard')
)
const AIKeywordIntelligenceCard = lazy(
  () => import('@/components/resume-intelligence/ai/AIKeywordIntelligenceCard')
)
const SectionAnalysisWorkspace = lazy(
  () => import('@/components/resume-intelligence/sections/SectionAnalysisWorkspace')
)

// Phase 6 UX & Interaction Additions
import AILifecycleProgressModal from '@/components/resume-intelligence/AILifecycleProgressModal'
import ResumeIntelligenceSearchBar from '@/components/resume-intelligence/ResumeIntelligenceSearchBar'

export default function ResumeIntelligencePage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)

  // Custom TanStack Query Hook managing FastAPI backend endpoint queries & caching
  const {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    selectedResumeTitle,
    latestReview,
    latestOptimization,
    isResumesLoading,
    isResumesError,
    isReanalyzing,
    handleReanalyze,
    refetchAll,
  } = useResumeIntelligence()

  // Trigger Re-analysis with Progress Modal
  const triggerReanalyzeWorkflow = () => {
    setIsLifecycleModalOpen(true)
    handleReanalyze()
  }

  // Keyboard Shortcuts Listener (R, /, Esc)
  useKeyboardShortcuts({
    onReanalyze: triggerReanalyzeWorkflow,
    onEscape: () => {
      setIsLifecycleModalOpen(false)
      setIsExportDialogOpen(false)
      setSearchQuery('')
    },
  })

  // Transformed Adapter Data for Live UI Rendering (Memoized for performance)
  const overviewScoreData = useMemo(
    () => transformToOverviewScore(latestReview, latestOptimization),
    [latestReview, latestOptimization]
  )

  const miniMetricsData = useMemo(
    () => transformToMiniMetrics(latestReview, latestOptimization),
    [latestReview, latestOptimization]
  )

  const breakdownItemsData = useMemo(
    () => transformToBreakdownItems(latestOptimization?.quality_score),
    [latestOptimization]
  )

  const radarData = useMemo(
    () => transformToRadarData(latestOptimization?.quality_score),
    [latestOptimization]
  )

  const keywordData = useMemo(
    () => transformToKeywordData(latestOptimization?.keyword_optimization),
    [latestOptimization]
  )

  const contentStatsData = useMemo(
    () => transformToContentStats(null, latestOptimization),
    [latestOptimization]
  )

  const benchmarkMapData = useMemo(
    () => transformToBenchmarkMap(latestOptimization),
    [latestOptimization]
  )

  const recruiterSimulationData = useMemo(
    () => transformToRecruiterSimulation(latestReview, latestOptimization),
    [latestReview, latestOptimization]
  )

  const atsWarningsData = useMemo(
    () => transformToATSInfo(latestReview, latestOptimization),
    [latestReview, latestOptimization]
  )

  const rewritesData = useMemo(
    () => transformToRewrites(latestOptimization),
    [latestOptimization]
  )

  const roadmapStepsData = useMemo(
    () => transformToRoadmap(latestReview, latestOptimization),
    [latestReview, latestOptimization]
  )

  // Loading State Rendering
  if (isResumesLoading) {
    return (
      <div className="w-full h-full p-2 md:p-4">
        <AiResumeSkeleton />
      </div>
    )
  }

  // Error State Rendering
  if (isResumesError) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center p-4">
        <ErrorState
          title="Failed to Load Resume Intelligence"
          message="We encountered an error establishing connection to your resume workspace."
          onRetry={() => refetchAll()}
        />
      </div>
    )
  }

  // Empty State Rendering (When no resumes exist)
  if (resumes.length === 0 && !isResumesLoading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center p-4">
        <EmptyResumeState onUploadClick={() => navigate('/resumes')} />
      </div>
    )
  }

  const safeTitle = (selectedResumeTitle || 'Senior AI Engineer Resume.pdf').replace(/\.[^/.]+$/, '')

  return (
    <div className="w-full max-w-[1920px] mx-auto flex flex-col min-h-screen text-slate-100 selection:bg-purple-500/30">
      {/* Screen Reader ARIA Live Region */}
      <div className="sr-only" aria-live="polite">
        {isReanalyzing ? 'Resume re-analysis pipeline is currently executing' : 'Resume Intelligence dashboard updated'}
      </div>

      {/* Global AI Lifecycle Modal */}
      <AILifecycleProgressModal
        isOpen={isLifecycleModalOpen}
        onClose={() => setIsLifecycleModalOpen(false)}
      />

      {/* Report Export Dialog Modal */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        reviewData={latestReview}
        optimizationData={latestOptimization}
        resumeFilename={safeTitle}
      />

      {/* 1. Workspace Header Section */}
      <ResumeIntelligenceHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedResumeTitle={selectedResumeTitle}
        resumesList={resumes.map((r) => ({ id: r.id, title: r.title || r.original_filename || 'Untitled Resume' }))}
        onSelectResume={setSelectedResumeId}
        lastAnalyzedText={
          latestReview?.created_at
            ? `Last analyzed: ${new Date(latestReview.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : 'Last analyzed: 2 min ago'
        }
        isReanalyzing={isReanalyzing}
        onReanalyze={triggerReanalyzeWorkflow}
        onDownloadReport={() => setIsExportDialogOpen(true)}
      />

      {/* Client-Side Search Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <ResumeIntelligenceSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* 2. Main Workspace Layout */}
      {activeTab === 'overview' && (
        <main aria-label="Resume Intelligence Overview Workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT & CENTER COLUMNS (8 cols on Desktop / 12 on mobile) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Top Row: Score Overview & Mini Trend Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              <div className="md:col-span-6">
                <WidgetErrorBoundary widgetName="Score Overview">
                  <ScoreOverviewCard
                    score={overviewScoreData.score}
                    maxScore={overviewScoreData.maxScore}
                    statusText={overviewScoreData.statusText}
                    percentileText={overviewScoreData.percentileText}
                    headlineText={overviewScoreData.headlineText}
                    descriptionText={overviewScoreData.descriptionText}
                  />
                </WidgetErrorBoundary>
              </div>
              <div className="md:col-span-6">
                <WidgetErrorBoundary widgetName="Trend Metrics">
                  <MiniMetricCards metrics={miniMetricsData} />
                </WidgetErrorBoundary>
              </div>
            </div>

            {/* Middle Row: Score Breakdown & Quality Radar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              <div className="md:col-span-6">
                <WidgetErrorBoundary widgetName="Score Breakdown">
                  <ScoreBreakdownCard items={breakdownItemsData} />
                </WidgetErrorBoundary>
              </div>
              <div className="md:col-span-6">
                <WidgetErrorBoundary widgetName="Quality Radar Chart">
                  <QualityRadarCard data={radarData} />
                </WidgetErrorBoundary>
              </div>
            </div>

            {/* Bottom Row: Keyword Match, Content Insights, Competitor Benchmark */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              <div>
                <WidgetErrorBoundary widgetName="Keyword Match">
                  <KeywordMatchCard
                    matchPercentage={keywordData.matchPercentage}
                    matchedCount={keywordData.matchedCount}
                    missingCount={keywordData.missingCount}
                    totalCount={keywordData.totalCount}
                    categories={keywordData.categories}
                  />
                </WidgetErrorBoundary>
              </div>
              <div>
                <WidgetErrorBoundary widgetName="Content Insights">
                  <ContentInsightsCard stats={contentStatsData} />
                </WidgetErrorBoundary>
              </div>
              <div>
                <WidgetErrorBoundary widgetName="Competitor Benchmark">
                  <CompetitorBenchmarkCard roleDataMap={benchmarkMapData} />
                </WidgetErrorBoundary>
              </div>
            </div>

            {/* AI Insight Banner */}
            <div>
              <WidgetErrorBoundary widgetName="AI Insight Banner">
                <AIInsightBanner />
              </WidgetErrorBoundary>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Intelligence Sidebar (4 cols on Desktop / 12 on mobile) */}
          <div className="lg:col-span-4">
            <WidgetErrorBoundary widgetName="AI Intelligence Sidebar">
              <AIIntelligenceSidebar userName="Dipak" />
            </WidgetErrorBoundary>
          </div>
        </main>
      )}

      {/* Lazy Suspense Fallback for Secondary Tab Views */}
      <Suspense fallback={<AiResumeSkeleton />}>
        {/* Content Analysis View: Section-by-Section Workspace */}
        {activeTab === 'content-analysis' && (
          <main aria-label="Content Analysis & Section Analysis Tab" className="flex flex-col gap-5">
            <WidgetErrorBoundary widgetName="Section Analysis Workspace">
              <SectionAnalysisWorkspace searchQuery={searchQuery} />
            </WidgetErrorBoundary>
          </main>
        )}

        {/* Keyword Analysis View */}
        {activeTab === 'keyword-analysis' && (
          <main aria-label="Keyword Analysis Tab" className="flex flex-col gap-5">
            <WidgetErrorBoundary widgetName="Keyword Intelligence">
              <AIKeywordIntelligenceCard categories={keywordData.categories} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary widgetName="Keyword Match">
              <KeywordMatchCard
                matchPercentage={keywordData.matchPercentage}
                matchedCount={keywordData.matchedCount}
                missingCount={keywordData.missingCount}
                totalCount={keywordData.totalCount}
                categories={keywordData.categories}
              />
            </WidgetErrorBoundary>
          </main>
        )}

        {/* Competitor Benchmark View */}
        {activeTab === 'competitor-benchmark' && (
          <main aria-label="Competitor Benchmark Tab" className="flex flex-col gap-5">
            <WidgetErrorBoundary widgetName="AI Recruiter Simulation">
              <AIRecruiterSimulationCard simulation={recruiterSimulationData} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary widgetName="Competitor Benchmark">
              <CompetitorBenchmarkCard roleDataMap={benchmarkMapData} />
            </WidgetErrorBoundary>
          </main>
        )}

        {/* Score History & Improvement View */}
        {activeTab === 'score-history' && (
          <main aria-label="Score History Tab" className="flex flex-col gap-5">
            <WidgetErrorBoundary widgetName="AI Improvement Roadmap">
              <AIImprovementRoadmapCard steps={roadmapStepsData} />
            </WidgetErrorBoundary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WidgetErrorBoundary widgetName="Score Breakdown">
                <ScoreBreakdownCard items={breakdownItemsData} />
              </WidgetErrorBoundary>
              <WidgetErrorBoundary widgetName="AI Engine Confidence">
                <AIConfidenceCard />
              </WidgetErrorBoundary>
            </div>
          </main>
        )}

        {/* Detailed Report View */}
        {activeTab === 'detailed-report' && (
          <main aria-label="Detailed Report Tab" className="flex flex-col gap-5">
            <WidgetErrorBoundary widgetName="ATS Risk Analysis">
              <AIRiskAnalysisCard warnings={atsWarningsData} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary widgetName="AI Recruiter Simulation">
              <AIRecruiterSimulationCard simulation={recruiterSimulationData} />
            </WidgetErrorBoundary>
            <WidgetErrorBoundary widgetName="AI Improvement Roadmap">
              <AIImprovementRoadmapCard steps={roadmapStepsData} />
            </WidgetErrorBoundary>
          </main>
        )}
      </Suspense>
    </div>
  )
}
