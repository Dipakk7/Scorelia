import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse } from '@/types/resume'
import type {
  ResumeReviewResponse,
  ResumeRewriteResponse,
  ResumeOptimizationResponse,
  TimelineItem,
} from '@/types/resume-intelligence'

// Components
import QualityScoreCard from '@/components/resume-intelligence/QualityScoreCard'
import AIReviewCard from '@/components/resume-intelligence/AIReviewCard'
import RecommendationPanel from '@/components/resume-intelligence/RecommendationPanel'
import OptimizationCard from '@/components/resume-intelligence/OptimizationCard'
import RewriteToolbar from '@/components/resume-intelligence/RewriteToolbar'
import RewriteEditor from '@/components/resume-intelligence/RewriteEditor'
import VersionTimeline from '@/components/resume-intelligence/VersionTimeline'
import ProcessingStatus from '@/components/resume-intelligence/ProcessingStatus'
import IntelligenceCharts from '@/components/resume-intelligence/IntelligenceCharts'
import ExportDialog from '@/components/resume-intelligence/ExportDialog'

import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { Card, CardContent } from '@/components/ui/Card'
import { AiResumeSkeleton } from '@/components/ui/Skeletons'
import EmptyResumeState from '@/components/ui/EmptyResumeState'
import { Badge } from '@/components/ui/Badge'
import toast from 'react-hot-toast'
import {
  Sparkles,
  FileText,
  TrendingUp,
  History,
  Download,
  AlertCircle,
  Activity,
  Layers,
  Zap,
} from 'lucide-react'
import { ChartEmptyState } from '@/components/ui/ChartEmptyState'
import { cn } from '@/lib/utils'

type DashboardTab = 'overview' | 'review' | 'rewrite' | 'optimization' | 'history'

export default function ResumeIntelligencePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [isExportOpen, setIsExportOpen] = useState(false)

  // Compare overlay state
  const [comparisonItem, setComparisonItem] = useState<TimelineItem | null>(null)

  // Pipeline simulation stages
  const [pipelineStages, setPipelineStages] = useState<Record<string, string>>({
    parser: 'PENDING',
    review: 'PENDING',
    rewrite: 'PENDING',
    optimization: 'PENDING',
  })

  // 1. Fetch resumes list
  const {
    data: resumesData,
    isLoading: isResumesLoading,
    error: resumesError,
  } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['resumesList'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  const resumes = resumesData?.resumes || []

  // Pre-select first resume if none selected
  useEffect(() => {
    if (resumesData?.resumes && resumesData.resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumesData.resumes[0].id)
    }
  }, [resumesData, selectedResumeId])

  const activeResume = resumes.find((r) => r.id === selectedResumeId)

  // 3. Fetch Reviews
  const { data: reviewsData } = useQuery<{ reviews: ResumeReviewResponse[] }>({
    queryKey: ['resumeReviews', selectedResumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/resume/reviews?resume_id=${selectedResumeId}`)
      return res.data
    },
    enabled: !!selectedResumeId,
  })
  const reviews = reviewsData?.reviews || []
  const latestReview = reviews[0] || null

  // 4. Fetch Rewrites
  const { data: rewritesData } = useQuery<{ rewrites: ResumeRewriteResponse[] }>({
    queryKey: ['resumeRewrites', selectedResumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/resume/rewrites?resume_id=${selectedResumeId}`)
      return res.data
    },
    enabled: !!selectedResumeId,
  })
  const rewrites = rewritesData?.rewrites || []
  const latestRewrite = rewrites[0] || null

  // 5. Fetch Optimizations
  const { data: optimizationsData } = useQuery<{ optimizations: ResumeOptimizationResponse[] }>({
    queryKey: ['resumeOptimizations', selectedResumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/resume/optimizations?resume_id=${selectedResumeId}`)
      return res.data
    },
    enabled: !!selectedResumeId,
  })
  const optimizations = optimizationsData?.optimizations || []
  const latestOptimization = optimizations[0] || null

  // Pipeline Execution Mutation (Parser -> Review -> Rewrite -> Optimize -> Scoring)
  const pipelineMutation = useMutation({
    mutationFn: async (payload: { resume_id: string; jobDescription?: string }) => {
      const res = await api.post('/ai/resume/workflow', {
        resume_id: payload.resume_id,
        job_description: payload.jobDescription || 'Standard Professional target job',
        mode: 'PROFESSIONAL',
      })
      return res.data
    },
    onMutate: () => {
      // Initialize pipeline stages tracking
      setPipelineStages({
        parser: 'RUNNING',
        review: 'PENDING',
        rewrite: 'PENDING',
        optimization: 'PENDING',
      })
    },
    onSuccess: () => {
      toast.success('AI Workflow Pipeline completed successfully!')
      setPipelineStages({
        parser: 'SUCCESS',
        review: 'SUCCESS',
        rewrite: 'SUCCESS',
        optimization: 'SUCCESS',
      })
      // Invalidate queries to fetch fresh reviews, rewrites, and optimizations
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumeReviews', selectedResumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumeRewrites', selectedResumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumeOptimizations', selectedResumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumesList'] })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || 'Pipeline workflow execution failed.'
      toast.error(msg)
      // Determine failed stage based on stages or set all failing
      setPipelineStages((prev) => {
        const next = { ...prev }
        if (next.parser === 'RUNNING') next.parser = 'FAILED'
        else if (next.review === 'RUNNING') next.review = 'FAILED'
        else if (next.rewrite === 'RUNNING') next.rewrite = 'FAILED'
        else next.optimization = 'FAILED'
        return next
      })
    },
  })

  // Simulated timer pipeline steps during pending mutation execution
  useEffect(() => {
    let t1: any, t2: any, t3: any
    if (pipelineMutation.isPending) {
      t1 = setTimeout(() => {
        setPipelineStages((prev) => ({ ...prev, parser: 'SUCCESS', review: 'RUNNING' }))
      }, 2500)

      t2 = setTimeout(() => {
        setPipelineStages((prev) => ({ ...prev, review: 'SUCCESS', rewrite: 'RUNNING' }))
      }, 5500)

      t3 = setTimeout(() => {
        setPipelineStages((prev) => ({ ...prev, rewrite: 'SUCCESS', optimization: 'RUNNING' }))
      }, 8500)
    }
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [pipelineMutation.isPending])

  // Individual rewrite trigger mutation
  const rewriteMutation = useMutation({
    mutationFn: async (payload: { mode: string; jobDescription?: string }) => {
      const res = await api.post('/ai/resume/rewrite', {
        resume_id: selectedResumeId,
        mode: payload.mode,
        job_description: payload.jobDescription,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success('AI Resume rewrite generated!')
      queryClient.invalidateQueries({ queryKey: ['resumeRewrites', selectedResumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || 'Rewrite failed.')
    },
  })

  // Undo rewrite mutation
  const undoRewriteMutation = useMutation({
    mutationFn: async (rewriteId: string) => {
      const res = await api.post(`/ai/resume/rewrite/${rewriteId}/undo`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Resume rolled back successfully!')
      queryClient.invalidateQueries({ queryKey: ['resumeDetail', selectedResumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumeRewrites', selectedResumeId] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || 'Rollback failed.')
    },
  })

  if (isResumesLoading) {
    return <AiResumeSkeleton />
  }

  if (resumesError) {
    return (
      <ErrorState
        title="Failed to load workspace"
        message="Could not establish contact with FastAPI AI intelligence server."
      />
    )
  }

  if (resumes.length === 0) {
    return (
      <div className="py-12">
        <EmptyResumeState onUploadClick={() => navigate('/resumes')} />
      </div>
    )
  }

  const handleRunPipeline = () => {
    if (!selectedResumeId) return
    pipelineMutation.mutate({ resume_id: selectedResumeId })
  }

  // Compile history aggregated for charts
  const historyData = [
    ...reviews.map((r) => ({ date: new Date(r.created_at).toLocaleDateString(), score: r.overall_score })),
    ...optimizations.map((o) => ({ date: new Date(o.created_at).toLocaleDateString(), score: o.quality_score?.overall_score || 0 })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto font-sans focus:outline-none animate-fade-in">
      {/* Selector & Setup Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-200/60 dark:border-slate-855 shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2 m-0 leading-none">
            <Sparkles className="text-brand-500 animate-pulse" size={22} />
            <span>AI Resume Intelligence Workspace</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed m-0">
            Audit formatting, match keywords, score readiness, and generate persona styles.
          </p>
        </div>

        {/* Dropdown selector & pipeline triggers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1 min-w-[200px]">
            <label htmlFor="resume-select" className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
              Active Selection
            </label>
            <select
              id="resume-select"
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              disabled={pipelineMutation.isPending}
              className="text-xs bg-slate-50/50 dark:bg-slate-900/60 border border-slate-250 dark:border-slate-800 rounded-xl p-2.5 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer transition-colors duration-200"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.original_filename} ({r.status})
                </option>
              ))}
              {resumes.length === 0 && <option>No resumes uploaded</option>}
            </select>
          </div>

          <div className="flex items-end self-end gap-2 pt-2 md:pt-0">
            <Button
              variant="primary"
              size="sm"
              onClick={handleRunPipeline}
              disabled={!selectedResumeId || pipelineMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-gradient-to-r from-brand-600 to-indigo-650 hover:from-brand-700 hover:to-indigo-700 text-white shadow-sm shadow-brand-500/10 border-none rounded-xl transition-all duration-200"
            >
              <Zap size={14} className="animate-pulse" />
              <span>Run AI Pipeline</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportOpen(true)}
              disabled={!latestReview && !latestOptimization}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-slate-250 dark:border-slate-800 cursor-pointer rounded-xl hover:border-brand-500/30 hover:bg-brand-500/5 transition-all"
            >
              <Download size={14} />
              <span>Export Report</span>
            </Button>
          </div>
        </div>
      </div>

      {resumes.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm text-center py-16">
          <CardContent className="space-y-4 max-w-sm mx-auto p-0">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
              <FileText size={22} className="stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 m-0">No Resumes Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-455 mt-1.5 leading-relaxed font-sans">
                Please upload a resume in the Resume Builder or parsed document list before initiating the AI scan.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Processing Orchestrator Status overlay */}
          {(pipelineMutation.isPending || pipelineMutation.isSuccess) && (
            <ProcessingStatus
              stages={pipelineStages}
              isProcessing={pipelineMutation.isPending}
              error={(pipelineMutation.error as any)?.message}
              onRetry={handleRunPipeline}
              onCancel={() => pipelineMutation.reset()}
            />
          )}

          {/* Workspace Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-850 overflow-x-auto scrollbar-none gap-1 bg-slate-50/20 dark:bg-slate-900/10 rounded-t-2xl">
            {[
              { id: 'overview', label: 'Intelligence Dashboard', icon: Layers },
              { id: 'review', label: 'AI Review & Diagnostic', icon: Activity },
              { id: 'rewrite', label: 'AI Style Rewrite', icon: Sparkles },
              { id: 'optimization', label: 'ATS Keyword Optimizer', icon: TrendingUp },
              { id: 'history', label: 'Version Timeline', icon: History },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer',
                    isActive
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white/40 dark:bg-slate-900/20'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-850/20'
                  )}
                >
                  <Icon size={13} className={isActive ? 'text-brand-500' : 'text-slate-455'} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Tab Panes */}
          <div className="space-y-6">
            {/* OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Scoring cards center */}
                <div className="lg:col-span-2 space-y-6">
                  <QualityScoreCard
                    qualityScore={latestOptimization?.quality_score?.overall_score || latestReview?.overall_score || 0}
                    readinessScore={latestOptimization?.quality_score?.career_readiness || 0}
                    improvementScore={latestOptimization?.ats_optimization?.current_score || 0}
                    history={historyData}
                    onAnalyze={handleRunPipeline}
                    isAnalyzing={pipelineMutation.isPending}
                  />

                  {/* Recharts Analytics graphs */}
                  <IntelligenceCharts
                    reviews={reviews}
                    optimizations={optimizations}
                    rewrites={rewrites}
                    onAnalyze={handleRunPipeline}
                    isAnalyzing={pipelineMutation.isPending}
                  />
                </div>

                {/* Status and Activity history */}
                <div className="space-y-6 col-span-1">
                  {/* Latest Review Info */}
                  <Card className="border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl shadow-sm space-y-4 hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
                    <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-250 uppercase tracking-wider m-0">
                        Latest Review Audit
                      </h4>
                    </div>
                    {latestReview ? (
                      <div className="space-y-3.5 text-xs text-left">
                        <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-850 font-sans">
                          <span className="text-slate-550 dark:text-slate-400 font-semibold">Quality Score</span>
                          <Badge variant="success" className="font-extrabold text-[10px] px-2 py-0">
                            {latestReview.overall_score}/100
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest">
                            Summary Brief
                          </span>
                          <p className="text-[11px] text-slate-655 dark:text-slate-300 leading-relaxed line-clamp-3 font-medium m-0">
                            {latestReview.overall_summary}
                          </p>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          Scanned on: {new Date(latestReview.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-450 dark:text-slate-500 italic text-center py-6 font-sans font-medium">
                        No review record available. Click 'Run AI Pipeline'.
                      </div>
                    )}
                  </Card>

                  {/* Latest Style Rewrite Version */}
                  <Card className="border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl shadow-sm space-y-4 hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
                    <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-250 uppercase tracking-wider m-0">
                        Latest Style Rewrite
                      </h4>
                    </div>
                    {latestRewrite ? (
                      <div className="space-y-3 text-xs text-left">
                        <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-955/20 p-2.5 rounded-xl border border-slate-200/40 dark:border-slate-850">
                          <span className="text-slate-555 dark:text-slate-400 font-semibold">Applied Persona</span>
                          <Badge variant="secondary" className="font-bold text-[10px] px-2 py-0">
                            {latestRewrite.rewrite_mode}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          <span>Model: {latestRewrite.metadata?.model || 'Ollama'}</span>
                          <span>{new Date(latestRewrite.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-450 dark:text-slate-500 italic text-center py-6 font-sans font-medium">
                        No rewritten version.
                      </div>
                    )}
                  </Card>

                  {/* ATS optimizations status */}
                  <Card className="border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl shadow-sm space-y-4 hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
                    <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-250 uppercase tracking-wider m-0">
                        ATS Diagnostic Level
                      </h4>
                    </div>
                    {latestOptimization?.ats_optimization ? (
                      <div className="space-y-3 text-xs text-left">
                        <div className="flex justify-between items-center font-sans">
                          <span className="text-slate-555 dark:text-slate-400 font-semibold">ATS Match Score</span>
                          <span className="font-black text-brand-600 dark:text-brand-400">
                            {latestOptimization.ats_optimization.current_score}%
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest block">
                            Key Missing Keywords
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {latestOptimization.ats_optimization.missing_keywords
                              ?.slice(0, 5)
                              .map((kw) => (
                                <span
                                  key={kw}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-455 border border-rose-500/15 shadow-2xs"
                                >
                                  {kw}
                                </span>
                              ))}
                            {latestOptimization.ats_optimization.missing_keywords?.length > 5 && (
                              <span className="text-[9px] text-slate-450 dark:text-slate-500 self-center font-bold">
                                +{latestOptimization.ats_optimization.missing_keywords.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-455 dark:text-slate-500 italic text-center py-6 font-sans font-medium">
                        No optimizations found.
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {/* AI REVIEW */}
            {activeTab === 'review' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Diagnostic detailed tabs */}
                <div className="lg:col-span-2">
                  {latestReview ? (
                    <AIReviewCard review={latestReview} />
                  ) : (
                    <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm text-center py-16">
                      <CardContent className="space-y-4 max-w-sm mx-auto p-0 text-center">
                        <div className="h-10 w-10 rounded-xl bg-slate-55/60 dark:bg-slate-850 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
                          <AlertCircle size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-200 m-0">
                            No Review Found
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-455 mt-1.5 leading-relaxed font-sans">
                            Generate diagnostic review feedback by executing the full workflow orchestrator.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Expandable actionable suggestions list */}
                <div className="lg:col-span-1">
                  {latestReview ? (
                    <RecommendationPanel
                      recommendations={latestReview.recommendations}
                      priorityImprovements={latestReview.priority_improvements}
                    />
                  ) : (
                    <div className="text-xs text-slate-450 dark:text-slate-500 italic text-center py-10 font-sans font-medium">
                      No recommendations to show.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI REWRITE */}
            {activeTab === 'rewrite' && (
              <div className="space-y-6 animate-fade-in">
                {/* Trigger panels */}
                <RewriteToolbar
                  onRewrite={(payload) => rewriteMutation.mutate(payload)}
                  isPending={rewriteMutation.isPending}
                />

                {/* Draft side by side panel */}
                {latestRewrite ? (
                  <RewriteEditor
                    rewrite={latestRewrite}
                    isPending={rewriteMutation.isPending}
                    isRejecting={undoRewriteMutation.isPending}
                    onAccept={() => toast.success('Rewrite accepted!')}
                    onReject={() => undoRewriteMutation.mutate(latestRewrite.id)}
                    onRegenerate={() =>
                      rewriteMutation.mutate({
                        mode: latestRewrite.rewrite_mode,
                        jobDescription: latestRewrite.job_description,
                      })
                    }
                  />
                ) : (
                  <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm text-center py-16">
                    <CardContent className="space-y-4 max-w-sm mx-auto p-0 text-center">
                      <div className="h-10 w-10 bg-slate-55/60 dark:bg-slate-850 rounded-xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-200 m-0">
                          No Rewritten Versions
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-455 mt-1.5 leading-relaxed font-sans">
                          Choose a persona style and hit 'Generate AI Rewrite' above to tailor your resume text.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* ATS OPTIMIZER */}
            {activeTab === 'optimization' && (
              <div className="space-y-6 animate-fade-in">
                {latestOptimization ? (
                  <OptimizationCard optimization={latestOptimization} />
                ) : (
                  <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm text-center py-16">
                    <CardContent className="space-y-4 max-w-sm mx-auto p-0 text-center">
                      <div className="h-10 w-10 bg-slate-55/60 dark:bg-slate-850 rounded-xl flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
                        <TrendingUp size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-200 m-0">
                          No Optimization Recommendations
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-455 mt-1.5 leading-relaxed font-sans">
                          Run the AI pipeline to analyze ATS keywords density and compile bullet point suggestions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* TIMELINE */}
            {activeTab === 'history' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                <div className="lg:col-span-2">
                  <VersionTimeline
                    resumeUploadedAt={activeResume?.uploaded_at || new Date().toISOString()}
                    resumeFilename={activeResume?.original_filename || 'original_resume.pdf'}
                    reviews={reviews}
                    rewrites={rewrites}
                    optimizations={optimizations}
                    isRestoring={undoRewriteMutation.isPending}
                    onCompare={(item) => {
                      setComparisonItem(item)
                      toast.success(`Comparing current vs: ${item.title}`)
                    }}
                    onRestore={(item) => {
                      if (item.type === 'rewrite') {
                        undoRewriteMutation.mutate(item.id)
                      }
                    }}
                  />
                </div>

                {/* Compare view sidebar overlay */}
                <div className="lg:col-span-1">
                  <Card className="border border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 shadow-sm rounded-2xl space-y-4 hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
                    <div className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
                      <h4 className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider m-0">
                        Timeline Sandbox Comparator
                      </h4>
                    </div>
                    {comparisonItem ? (
                      <div className="space-y-3.5 text-xs text-left">
                        <div className="p-3 bg-brand-500/5 border border-brand-500/10 rounded-xl space-y-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                            Comparison Target
                          </span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">
                            {comparisonItem.title}
                          </span>
                          <span className="block text-[9px] text-slate-500">
                            {new Date(comparisonItem.timestamp).toLocaleString()}
                          </span>
                        </div>

                        {/* Direct comparison view trigger */}
                        <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal leading-relaxed m-0 font-medium">
                          Currently evaluating revisions for {comparisonItem.title}. Compare how keyword lists, bullet highlights, or summary fields have drifted across edits.
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setComparisonItem(null)}
                          className="w-full py-2 text-xs cursor-pointer rounded-xl font-bold border-slate-200 dark:border-slate-800 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-455 dark:text-slate-500 italic text-center py-8 font-sans font-medium">
                        Select 'Compare' on any timeline version item to load differences.
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Export Report dialog modal */}
      {isExportOpen && (
        <ExportDialog
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          reviewData={latestReview}
          optimizationData={latestOptimization}
          rewriteData={latestRewrite}
          resumeFilename={activeResume?.original_filename}
        />
      )}
    </div>
  )
}
