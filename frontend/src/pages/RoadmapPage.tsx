import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse } from '@/types/resume'
import type {
  RoadmapResponse,
  RoadmapHistory,
  RoadmapAnalyticsResponse,
  AISkillGapResponse,
  AILearningPlanResponse,
  MilestoneStatus
} from '@/types/roadmap'

import toast from 'react-hot-toast'
import {
  Compass,
  Award,
  ListTodo,
  TrendingUp,
  Plus,
  Loader2,
  Trash2,
  Calendar,
  RotateCw
} from 'lucide-react'

// Custom Components
import { CareerDashboardCard } from '@/components/career-coach/CareerDashboardCard'
import { RoadmapTimeline } from '@/components/career-coach/RoadmapTimeline'
import { SkillGapCard } from '@/components/career-coach/SkillGapCard'
import { LearningPlanCard } from '@/components/career-coach/LearningPlanCard'
import { CareerAnalyticsChart } from '@/components/career-coach/CareerAnalyticsChart'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ErrorState } from '@/components/ui/ErrorState'
import { CareerCoachSkeleton } from '@/components/ui/Skeletons'
import { EmptyRoadmapsState } from '@/components/ui/EmptyState'

type RoadmapTab = 'dashboard' | 'timeline' | 'skills' | 'learning-plan' | 'charts'

export default function RoadmapPage() {
  const queryClient = useQueryClient()
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<RoadmapTab>('dashboard')

  // Form input states for creating/generating roadmaps
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [targetRole, setTargetRole] = useState('')
  const [currentRole, setCurrentRole] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('ENTRY')
  const [targetIndustry, setTargetIndustry] = useState('')
  const [durationMonths, setDurationMonths] = useState(12)
  const [selectedResumeId, setSelectedResumeId] = useState('')

  // Checkbox/milestone overrides store in localState/localStorage
  const [milestoneStatusOverrides, setMilestoneStatusOverrides] = useState<Record<string, MilestoneStatus>>({})

  // Load milestone overrides for current roadmap from localStorage
  useEffect(() => {
    if (selectedRoadmapId) {
      try {
        const saved = localStorage.getItem(`careerpilot_milestones_status_${selectedRoadmapId}`)
        if (saved) {
          setMilestoneStatusOverrides(JSON.parse(saved))
        } else {
          setMilestoneStatusOverrides({})
        }
      } catch (e) {
        console.error('Failed to load milestone status overrides', e)
      }
    }
  }, [selectedRoadmapId])

  // Save milestone overrides
  const handleUpdateMilestoneStatus = (milestoneId: string, newStatus: MilestoneStatus) => {
    const nextOverrides = {
      ...milestoneStatusOverrides,
      [milestoneId]: newStatus
    }
    setMilestoneStatusOverrides(nextOverrides)
    try {
      localStorage.setItem(
        `careerpilot_milestones_status_${selectedRoadmapId}`,
        JSON.stringify(nextOverrides)
      )
      // Invalidating queries to force calculations refresh
      queryClient.invalidateQueries({ queryKey: ['roadmapAnalytics', selectedRoadmapId] })
    } catch (e) {
      console.error('Failed to save milestone overrides', e)
    }
  }

  // 1. Fetch resumes list for dropdown selection
  const { data: resumesData } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['resumesList'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    }
  })
  const resumes = resumesData?.resumes || []

  // 2. Fetch career roadmaps history list
  const {
    data: roadmapHistory,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory
  } = useQuery<RoadmapHistory>({
    queryKey: ['roadmapHistory'],
    queryFn: async () => {
      const res = await api.get('/ai/roadmap/roadmaps')
      return res.data
    }
  })
  const roadmaps = useMemo(() => roadmapHistory?.roadmaps || [], [roadmapHistory])

  // Set default selected roadmap
  useEffect(() => {
    if (roadmaps.length > 0 && !selectedRoadmapId) {
      setSelectedRoadmapId(roadmaps[0].id)
    }
  }, [roadmaps, selectedRoadmapId])

  // 3. Fetch detailed active career roadmap (milestones, recommendations)
  const {
    data: activeRoadmapRaw,
    isLoading: isActiveRoadmapLoading,
    refetch: refetchActiveRoadmap
  } = useQuery<RoadmapResponse>({
    queryKey: ['roadmapDetail', selectedRoadmapId],
    queryFn: async () => {
      if (!selectedRoadmapId) return null
      const res = await api.get(`/ai/roadmap/roadmaps/${selectedRoadmapId}`)
      return res.data
    },
    enabled: !!selectedRoadmapId
  })

  // Apply milestone status overrides locally so visual progression works flawlessly
  const activeRoadmap = useMemo(() => {
    if (!activeRoadmapRaw) return null
    const overriddenMilestones = activeRoadmapRaw.milestones.map((ms) => ({
      ...ms,
      status: milestoneStatusOverrides[ms.id] || ms.status
    }))
    return {
      ...activeRoadmapRaw,
      milestones: overriddenMilestones
    }
  }, [activeRoadmapRaw, milestoneStatusOverrides])

  // 4. Fetch Roadmap-specific analytics (readiness score breakdowns, skill distributions)
  const {
    data: activeAnalyticsRaw
  } = useQuery<RoadmapAnalyticsResponse>({
    queryKey: ['roadmapAnalytics', selectedRoadmapId],
    queryFn: async () => {
      if (!selectedRoadmapId) return null
      const res = await api.get(`/ai/roadmap/${selectedRoadmapId}/analytics`)
      return res.data
    },
    enabled: !!selectedRoadmapId
  })

  // Recalculate metrics based on local overrides to keep indicators synchronized
  const activeAnalytics = useMemo(() => {
    if (!activeAnalyticsRaw || !activeRoadmap) return null
    
    // Calculate milestone counts from local overrides
    const totalCount = activeRoadmap.milestones.length
    const completedCount = activeRoadmap.milestones.filter(m => m.status === 'COMPLETED').length
    const remainingCount = totalCount - completedCount
    
    const calculatedPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return {
      ...activeAnalyticsRaw,
      metrics: {
        ...activeAnalyticsRaw.metrics,
        overall_progress: calculatedPercentage,
        roadmap_completion_percentage: calculatedPercentage,
        completed_milestones_count: completedCount,
        remaining_milestones_count: remainingCount,
      }
    }
  }, [activeAnalyticsRaw, activeRoadmap])

  // 5. Fetch/generate active skill gap analysis
  const {
    data: skillGap,
    isLoading: isSkillGapLoading,
    refetch: refetchSkillGap
  } = useQuery<AISkillGapResponse>({
    queryKey: ['roadmapSkillGap', selectedRoadmapId],
    queryFn: async () => {
      if (!selectedRoadmapId || !activeRoadmap) return null
      const payload = {
        roadmap_id: selectedRoadmapId,
        target_role: activeRoadmap.target_role,
        current_role: activeRoadmap.current_role,
        experience_level: activeRoadmap.experience_level,
        target_industry: activeRoadmap.target_industry,
        resume_id: activeRoadmap.resume_id
      }
      const res = await api.post('/ai/roadmap/skill-gap', payload)
      return res.data
    },
    enabled: !!selectedRoadmapId && !!activeRoadmap
  })

  // 6. Fetch/generate learning plan resources
  const {
    data: learningPlan,
    isLoading: isLearningPlanLoading,
    refetch: refetchLearningPlan
  } = useQuery<AILearningPlanResponse>({
    queryKey: ['roadmapLearningPlan', selectedRoadmapId],
    queryFn: async () => {
      if (!selectedRoadmapId || !activeRoadmap) return null
      const payload = {
        roadmap_id: selectedRoadmapId,
        target_role: activeRoadmap.target_role,
        current_role: activeRoadmap.current_role,
        experience_level: activeRoadmap.experience_level,
        target_industry: activeRoadmap.target_industry,
        resume_id: activeRoadmap.resume_id
      }
      const res = await api.post('/ai/roadmap/learning-plan', payload)
      return res.data
    },
    enabled: !!selectedRoadmapId && !!activeRoadmap
  })

  // Mutation: Generate new career roadmap
  const generateRoadmapMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        target_role: targetRole,
        current_role: currentRole || undefined,
        experience_level: experienceLevel,
        target_industry: targetIndustry || undefined,
        estimated_duration_months: durationMonths,
        resume_id: selectedResumeId || undefined
      }
      const res = await api.post('/ai/roadmap/generate', payload)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('AI Career Roadmap generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['roadmapHistory'] })
      setSelectedRoadmapId(data.id)
      setShowCreateForm(false)
      // Reset form fields
      setTargetRole('')
      setCurrentRole('')
      setTargetIndustry('')
      setSelectedResumeId('')
      setActiveTab('dashboard')
    },
    onError: (err: any) => {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to generate roadmap.')
    }
  })

  // Mutation: Delete roadmap
  const deleteRoadmapMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/ai/roadmap/roadmaps/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Roadmap deleted successfully.')
      queryClient.invalidateQueries({ queryKey: ['roadmapHistory'] })
      setSelectedRoadmapId('')
    },
    onError: () => {
      toast.error('Failed to delete roadmap.')
    }
  })

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetRole.trim()) {
      toast.error('Please enter a target career role.')
      return
    }
    generateRoadmapMutation.mutate()
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this career roadmap? All milestones and logs will be permanently deleted.')) {
      deleteRoadmapMutation.mutate(id)
    }
  }

  // Handle reload / recalculate APIs
  const handleReload = () => {
    refetchActiveRoadmap()
    refetchSkillGap()
    refetchLearningPlan()
    toast.success('Workspace re-synchronized.')
  }

  if (isHistoryLoading) {
    return <CareerCoachSkeleton />
  }

  if (historyError) {
    return (
      <ErrorState
        title="Roadmaps Loading Failed"
        message="Could not load your career roadmap history. Please check backend connection."
        onRetry={refetchHistory}
      />
    )
  }

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white m-0 tracking-tight">
            AI Career Coach
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Map out custom career pivots, audit missing skill gaps, and execute weekly learning milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {roadmaps.length > 0 && (
            <select
              value={selectedRoadmapId}
              onChange={(e) => setSelectedRoadmapId(e.target.value)}
              className="text-xs py-2 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
            >
              {roadmaps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.target_role} ({r.experience_level})
                </option>
              ))}
            </select>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/10 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>New Roadmap</span>
          </Button>
        </div>
      </div>

      {/* Creation form modal/pane */}
      {showCreateForm && (
        <Card className="border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 p-5 animate-slideDown">
          <form onSubmit={handleGenerate} className="space-y-4">
            <h3 className="text-sm font-extrabold font-display text-slate-900 dark:text-white m-0 flex items-center gap-2">
              <Compass className="text-brand-500" size={16} />
              <span>Map Your AI Career Plan</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">Target Career Role *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Machine Learning Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">Current Role (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Junior Backend Developer"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">Target Industry (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Fintech, Healthcare"
                  value={targetIndustry}
                  onChange={(e) => setTargetIndustry(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                >
                  <option value="ENTRY">Entry Level</option>
                  <option value="MID">Mid Level</option>
                  <option value="SENIOR">Senior Level</option>
                  <option value="LEAD">Lead / Architect</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">Estimated Timeline (Months)</label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                >
                  <option value="3">3 Months (Intensive Pivot)</option>
                  <option value="6">6 Months (Standard Focus)</option>
                  <option value="12">12 Months (Deep Reskilling)</option>
                  <option value="18">18 Months (Long-term Mastery)</option>
                  <option value="24">24 Months (Structural Shift)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-display">Associate Resume Base</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 font-semibold"
                >
                  <option value="">No Resume Profile (Blank baseline)</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.original_filename} (ATS: {r.ats_score || 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="text-xs border-slate-200 dark:border-slate-800"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={generateRoadmapMutation.isPending}
                className="bg-brand-600 hover:bg-brand-700 text-xs font-bold flex items-center gap-1.5"
              >
                {generateRoadmapMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                    <span>Mapping roadmap details...</span>
                  </>
                ) : (
                  <>
                    <Compass size={14} />
                    <span>Generate AI Roadmap</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Main Workspace content */}
      {roadmaps.length === 0 ? (
        <EmptyRoadmapsState onAction={() => setShowCreateForm(true)} />
      ) : isActiveRoadmapLoading ? (
        <CareerCoachSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Navigation Tabs bar */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 overflow-x-auto pb-px">
            <div className="flex gap-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Compass },
                { id: 'timeline', label: 'Roadmap Timeline', icon: Calendar },
                { id: 'skills', label: 'Skill Gap Analysis', icon: Award },
                { id: 'learning-plan', label: 'Learning Plan', icon: ListTodo },
                { id: 'charts', label: 'Career Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as RoadmapTab)}
                    className={`flex items-center gap-2 pb-3 text-sm font-semibold font-display transition-all relative cursor-pointer focus:outline-none ${
                      isActive
                        ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={handleReload}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-450 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                title="Sync roadmap workspace"
              >
                <RotateCw size={14} />
              </button>
              <button
                onClick={() => handleDelete(selectedRoadmapId)}
                disabled={deleteRoadmapMutation.isPending}
                className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors"
                title="Delete active roadmap"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Active Tab contents */}
          <div className="animate-fadeIn">
            {activeTab === 'dashboard' && (
              <CareerDashboardCard
                analytics={activeAnalytics}
                targetRole={activeRoadmap?.target_role || ''}
                estimatedDuration={activeRoadmap?.estimated_duration_months || 0}
              />
            )}

            {activeTab === 'timeline' && (
              <RoadmapTimeline
                milestones={activeRoadmap?.milestones || []}
                onUpdateStatus={handleUpdateMilestoneStatus}
              />
            )}

            {activeTab === 'skills' && (
              <SkillGapCard
                skillGap={skillGap || null}
                isLoading={isSkillGapLoading}
              />
            )}

            {activeTab === 'learning-plan' && (
              <LearningPlanCard
                learningPlan={learningPlan || null}
                roadmapId={selectedRoadmapId}
                isLoading={isLearningPlanLoading}
              />
            )}

            {activeTab === 'charts' && (
              <CareerAnalyticsChart
                analytics={activeAnalytics}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
