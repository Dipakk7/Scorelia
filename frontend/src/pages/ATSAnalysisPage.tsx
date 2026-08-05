import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileCheck,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { useATSAnalysis } from '@/hooks/useATSAnalysis'
import type { ATSReportPayload } from '@/lib/ats-export'
import { mockSectionDetailsMap } from '@/lib/ats-section-mock-data'
import { cn } from '@/lib/utils'

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
import { AtsSkeleton } from '@/components/ui/Skeletons'

export type AnalysisState = 'idle' | 'analyzing' | 'completed'

const ANALYSIS_STEPS = [
  { id: 1, label: 'Parsing Resume Structure & Content...' },
  { id: 2, label: 'Checking ATS System Compatibility...' },
  { id: 3, label: 'Analyzing Keyword Match & Density...' },
  { id: 4, label: 'Evaluating Formatting & Risk Factors...' },
  { id: 5, label: 'Generating Recruiter Insights...' },
  { id: 6, label: 'Preparing Final Analysis Report...' },
]

export default function ATSAnalysisPage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [activeTab, setActiveTab] = useState<ATSTab>('overview')
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-summary')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // 3-State User Flow State
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [loadingStepIndex, setLoadingStepIndex] = useState<number>(0)
  const [progressPercentage, setProgressPercentage] = useState<number>(0)

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

  // Execute Analysis Pipeline Handler
  const handleRunAnalysis = useCallback(async () => {
    setAnalysisState('analyzing')
    setLoadingStepIndex(0)
    setProgressPercentage(10)

    const stepInterval = setInterval(() => {
      setLoadingStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          const nextStep = prev + 1
          setProgressPercentage(Math.round(((nextStep + 1) / ANALYSIS_STEPS.length) * 100))
          return nextStep
        }
        return prev
      })
    }, 450)

    try {
      await handleReanalyze()
    } catch (err) {
      console.warn('[ATSAnalysisPage] Pipeline execution notice:', err)
    } finally {
      clearInterval(stepInterval)
      setProgressPercentage(100)
      setTimeout(() => {
        setAnalysisState('completed')
        setActiveTab('overview')
      }, 500)
    }
  }, [handleReanalyze])

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
    <div className="w-full max-w-[1920px] mx-auto space-y-6 text-slate-100 selection:bg-purple-500/30">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* ATS Header (Dynamic State Configuration) */}
        <motion.div variants={sectionVariants}>
          <ATSWidgetErrorBoundary sectionName="ATS Header">
            <ATSHeader
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onRefresh={handleRunAnalysis}
              onExportClick={handleOpenExportModal}
              isRefreshing={analysisState === 'analyzing' || isReanalyzing}
              showTabs={analysisState === 'completed'}
              analyzeButtonText={analysisState === 'completed' ? 'Analyze Again' : analysisState === 'analyzing' ? 'Analyzing...' : 'Analyze Resume'}
              statusText={analysisState === 'completed' ? 'Status: Analysis Complete' : analysisState === 'analyzing' ? 'Status: Analyzing Resume...' : 'Status: Ready for Analysis'}
              onAnalyzeClick={handleRunAnalysis}
            />
          </ATSWidgetErrorBoundary>
        </motion.div>

        {/* Target Resume Selector */}
        <motion.div variants={sectionVariants}>
          <ATSWidgetErrorBoundary sectionName="Target Resume Selector">
            <ResumeSelector
              selectedId={selectedResumeId}
              onSelectResume={handleSelectResume}
            />
          </ATSWidgetErrorBoundary>
        </motion.div>

        {/* STATE 1: BEFORE ANALYSIS (IDLE EMPTY STATE) */}
        {analysisState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 md:p-14 rounded-2xl bg-[#121426] border border-white/10 bg-gradient-to-b from-[#14162a] via-[#111324] to-[#14162a] shadow-xl text-center my-4 space-y-6 max-w-4xl mx-auto"
          >
            <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-lg shadow-purple-950/40">
              <Sparkles className="w-10 h-10 animate-pulse text-purple-300" />
              <div className="absolute inset-0 rounded-2xl bg-purple-500/10 blur-xl -z-10" />
            </div>

            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Evaluate Your Resume for ATS Screening Systems
              </h2>
              <p className="text-sm md:text-base text-slate-300/90 leading-relaxed">
                Run an AI-powered ATS analysis to evaluate your resume against recruiter screening systems, uncover keyword gaps, check formatting compatibility, and receive recruiter-level insights before applying.
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleRunAnalysis}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-xl shadow-purple-600/30 border border-purple-500/40 transition-all hover:scale-[1.03] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:outline-none cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-purple-200" />
                <span>Analyze Resume</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <p className="text-xs text-slate-400/80 italic max-w-md">
                Run an AI-powered ATS analysis to evaluate your resume against recruiter screening systems.
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-300">
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <Search className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Keyword Match</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Formatting Audit</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Parser Simulation</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Recruiter Feedback</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STATE 2: ANALYSIS RUNNING (LOADING PROGRESS STATE) */}
        {analysisState === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 md:p-12 rounded-2xl bg-[#121426] border border-purple-500/20 bg-gradient-to-b from-[#14162a] to-[#111324] shadow-2xl text-center my-4 space-y-6 max-w-3xl mx-auto"
          >
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Sparkles className="w-8 h-8 animate-spin text-purple-300" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Running ATS Evaluation Pipeline...
              </h3>
              <p className="text-xs md:text-sm text-purple-300 font-semibold h-6">
                {ANALYSIS_STEPS[loadingStepIndex]?.label}
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full max-w-md space-y-2">
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>{ANALYSIS_STEPS[loadingStepIndex]?.label.split(' ')[0]}</span>
                <span>{progressPercentage}%</span>
              </div>
            </div>

            {/* Step Checklist Items */}
            <div className="w-full max-w-md space-y-2 text-left pt-2">
              {ANALYSIS_STEPS.map((step, idx) => {
                const isFinished = idx < loadingStepIndex
                const isCurrent = idx === loadingStepIndex
                return (
                  <div
                    key={step.id}
                    className={cn(
                      'flex items-center justify-between text-xs px-3.5 py-2 rounded-lg transition-all duration-200 border',
                      isFinished
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : isCurrent
                        ? 'bg-purple-500/15 text-purple-200 font-semibold border-purple-500/30 shadow-xs'
                        : 'bg-slate-900/40 text-slate-500 border-slate-800/40'
                    )}
                  >
                    <span>{step.label}</span>
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Zap className="w-4 h-4 text-purple-400 animate-bounce shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* STATE 3: ANALYSIS COMPLETE (DYNAMIC WORKSPACE DASHBOARD) */}
        {analysisState === 'completed' && (
          <>
            {isAtsLoading || isReanalyzing ? (
              <div className="space-y-6">
                <AtsSkeleton />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  id={`panel-${activeTab}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${activeTab}`}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5 sm:space-y-6"
                >
                  {/* 1. OVERVIEW SECTION */}
                  {activeTab === 'overview' && (
                    <div className="space-y-5 sm:space-y-6">
                      <ATSWidgetErrorBoundary sectionName="AI Readiness Overview">
                        <AIOverviewBanner data={aiOverviewBanner} onOptimizeClick={handleRunAnalysis} />
                      </ATSWidgetErrorBoundary>

                      <ATSWidgetErrorBoundary sectionName="ATS Score Overview">
                        <ATSHeroCard data={atsOverviewData} onAnalyzeClick={handleRunAnalysis} />
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
                            <ATSWidgetErrorBoundary sectionName="Keyword Intelligence">
                              <KeywordIntelligenceCard />
                            </ATSWidgetErrorBoundary>
                          </div>
                        }
                        rightSidebar={
                          <div className="space-y-5 sm:space-y-6">
                            <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                              <AIInsightsSidebar />
                            </ATSWidgetErrorBoundary>
                            <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                              <Sidebar onStartAnalysis={handleRunAnalysis} />
                            </ATSWidgetErrorBoundary>
                          </div>
                        }
                        bottomContent={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                            <div className="lg:col-span-12">
                              <ATSWidgetErrorBoundary sectionName="ATS System Compatibility">
                                <ATSCompatibilityCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-8 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="Recruiter Feedback">
                                <RecruiterFeedbackCard data={recruiterFeedback} />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-4 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="Risk Analysis">
                                <RiskAnalysisCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-8 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="Optimization Sequence">
                                <OptimizationTimeline />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-4 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="Industry Peer Benchmark">
                                <IndustryBenchmarkCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {/* 2. KEYWORD MATCH SECTION */}
                  {activeTab === 'keyword-match' && (
                    <div className="space-y-5 sm:space-y-6">
                      <WorkspaceLayout
                        leftContent={
                          <ATSWidgetErrorBoundary sectionName="Keyword Intelligence">
                            <KeywordIntelligenceCard />
                          </ATSWidgetErrorBoundary>
                        }
                        rightSidebar={
                          <div className="space-y-5 sm:space-y-6">
                            <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                              <AIInsightsSidebar />
                            </ATSWidgetErrorBoundary>
                            <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                              <Sidebar onStartAnalysis={handleRunAnalysis} />
                            </ATSWidgetErrorBoundary>
                          </div>
                        }
                        bottomContent={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                            <div className="lg:col-span-12">
                              <ATSWidgetErrorBoundary sectionName="Keyword Match & Density">
                                <KeywordAnalysisCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {/* 3. FORMAT CHECK SECTION */}
                  {activeTab === 'format-check' && (
                    <div className="space-y-5 sm:space-y-6">
                      <WorkspaceLayout
                        leftContent={
                          <ATSWidgetErrorBoundary sectionName="Formatting Audit">
                            <FormattingAnalysisCard />
                          </ATSWidgetErrorBoundary>
                        }
                        rightSidebar={
                          <div className="space-y-5 sm:space-y-6">
                            <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                              <AIInsightsSidebar />
                            </ATSWidgetErrorBoundary>
                            <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                              <Sidebar onStartAnalysis={handleRunAnalysis} />
                            </ATSWidgetErrorBoundary>
                          </div>
                        }
                        bottomContent={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                            <div className="lg:col-span-6">
                              <ATSWidgetErrorBoundary sectionName="Risk Analysis">
                                <RiskAnalysisCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-6">
                              <ATSWidgetErrorBoundary sectionName="Readiness Master Checklist">
                                <ATSChecklistCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {/* 4. CONTENT OPTIMIZATION SECTION */}
                  {activeTab === 'content-optimization' && (
                    <div className="space-y-5 sm:space-y-6">
                      <WorkspaceLayout
                        leftContent={
                          <ATSWidgetErrorBoundary sectionName="Priority Recommendations">
                            <PriorityRecommendationCard />
                          </ATSWidgetErrorBoundary>
                        }
                        rightSidebar={
                          <div className="space-y-5 sm:space-y-6">
                            <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                              <AIInsightsSidebar />
                            </ATSWidgetErrorBoundary>
                            <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                              <Sidebar onStartAnalysis={handleRunAnalysis} />
                            </ATSWidgetErrorBoundary>
                          </div>
                        }
                        bottomContent={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                            <div className="lg:col-span-6">
                              <ATSWidgetErrorBoundary sectionName="Section Scores Breakdown">
                                <SectionScoresCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-6">
                              <ATSWidgetErrorBoundary sectionName="Optimization Sequence">
                                <OptimizationTimeline />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {/* 5. ATS SIMULATION SECTION */}
                  {activeTab === 'ats-simulation' && (
                    <div className="space-y-5 sm:space-y-6">
                      <WorkspaceLayout
                        leftContent={
                          <ATSWidgetErrorBoundary sectionName="ATS System Compatibility">
                            <ATSCompatibilityCard />
                          </ATSWidgetErrorBoundary>
                        }
                        rightSidebar={
                          <div className="space-y-5 sm:space-y-6">
                            <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                              <AIInsightsSidebar />
                            </ATSWidgetErrorBoundary>
                            <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                              <Sidebar onStartAnalysis={handleRunAnalysis} />
                            </ATSWidgetErrorBoundary>
                          </div>
                        }
                        bottomContent={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
                            <div className="lg:col-span-6">
                              <ATSWidgetErrorBoundary sectionName="Recruiter Feedback">
                                <RecruiterFeedbackCard data={recruiterFeedback} />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-6">
                              <ATSWidgetErrorBoundary sectionName="ATS Parser Preview">
                                <ParserPreviewCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}

                  {/* 6. DETAILED REPORT SECTION */}
                  {activeTab === 'detailed-report' && (
                    <div className="space-y-5 sm:space-y-6">
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
                              className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch"
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
                            </motion.div>
                          )
                        }
                        rightSidebar={
                          <div className="space-y-5 sm:space-y-6 flex flex-col justify-between h-full">
                            {currentSectionDetail && (
                              <ATSWidgetErrorBoundary sectionName="Section Summary Sidebar">
                                <SectionSidebar section={currentSectionDetail} />
                              </ATSWidgetErrorBoundary>
                            )}
                            <ATSWidgetErrorBoundary sectionName="AI Health Summary Sidebar">
                              <AIInsightsSidebar />
                            </ATSWidgetErrorBoundary>
                            <div className="flex-1 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="ATS Details Sidebar">
                                <Sidebar onStartAnalysis={handleRunAnalysis} />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                        bottomContent={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
                            <div className="lg:col-span-6 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="Formatting Audit">
                                <FormattingAnalysisCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-6 flex flex-col">
                              <ATSWidgetErrorBoundary sectionName="Section Scores Breakdown">
                                <SectionScoresCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-12">
                              <ATSWidgetErrorBoundary sectionName="Readiness Master Checklist">
                                <ATSChecklistCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                            <div className="lg:col-span-12">
                              <ATSWidgetErrorBoundary sectionName="ATS Parser Preview">
                                <ParserPreviewCard />
                              </ATSWidgetErrorBoundary>
                            </div>
                          </div>
                        }
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}

        {/* Global Report Export Dialog Modal */}
        <ATSExportDialogModal
          isOpen={isExportModalOpen}
          onClose={handleCloseExportModal}
          payload={exportPayload}
        />
      </motion.div>
    </div>
  )
}
