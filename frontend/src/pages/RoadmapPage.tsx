import React, { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
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
import { cn } from '@/lib/utils'

// Custom Components
import { CareerDashboardCard } from '@/components/career-coach/CareerDashboardCard'
import { RoadmapTimeline } from '@/components/career-coach/RoadmapTimeline'
import { SkillGapCard } from '@/components/career-coach/SkillGapCard'
import { LearningPlanCard } from '@/components/career-coach/LearningPlanCard'
import { CareerAnalyticsChart } from '@/components/career-coach/CareerAnalyticsChart'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ErrorState } from '@/components/ui/ErrorState'
import { CareerCoachSkeleton } from '@/components/ui/Skeletons'
import { EmptyRoadmapsState } from '@/components/ui/EmptyState'

type RoadmapTab = 'dashboard' | 'timeline' | 'skills' | 'learning-plan' | 'charts'

export default function RoadmapPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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
        const saved = localStorage.getItem(`scorelia_milestones_status_${selectedRoadmapId}`)
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
        `scorelia_milestones_status_${selectedRoadmapId}`,
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
    <div className="space-y-6 text-left animate-fade-in font-sans focus:outline-none">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)]/70 backdrop-blur-md p-5 rounded-[var(--radius-card)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:border-[var(--primary)]/40 transition-all duration-300">
        <div className="space-y-1.5 text-left">
          <h1 className="text-h1 text-[var(--heading)] m-0">
            Career Roadmap Builder
          </h1>
          <p className="text-caption text-[var(--muted)] leading-relaxed m-0 font-medium">
            Map out custom career pivots, audit missing skill gaps, and execute weekly learning milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {roadmaps.length > 0 && (
            <Select
              value={selectedRoadmapId}
              onChange={(e) => setSelectedRoadmapId(e.target.value)}
              containerClassName="w-60"
            >
              {roadmaps.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.target_role} ({r.experience_level})
                </option>
              ))}
            </Select>
          )}

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-none rounded-xl transition-all duration-200 text-xs h-9.5"
          >
            <Plus size={14} />
            <span>New Roadmap</span>
          </Button>
        </div>
      </div>

      {/* Creation form modal/pane */}
      {showCreateForm && (
        <Card className="border border-[var(--primary)]/20 bg-[var(--surface-hover)] p-5 rounded-[var(--radius-card)] backdrop-blur-md shadow-sm animate-slideDown text-left">
          <form onSubmit={handleGenerate} className="space-y-5 text-left m-0">
            <h3 className="text-h3 text-[var(--heading)] m-0 flex items-center gap-2 pb-3 border-b border-[var(--border)]">
              <Compass className="text-[var(--primary)]" size={16} />
              <span>Configure AI Milestone Generator</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-left">
              <Input
                label="Target Career Role"
                placeholder="e.g. Senior Machine Learning Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              />

              <Input
                label="Current Role (Optional)"
                placeholder="e.g. Junior Backend Developer"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
              />

              <Input
                label="Target Industry (Optional)"
                placeholder="e.g. Fintech, Healthcare"
                value={targetIndustry}
                onChange={(e) => setTargetIndustry(e.target.value)}
              />

              <Select
                label="Experience Level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="ENTRY">Entry Level</option>
                <option value="MID">Mid Level</option>
                <option value="SENIOR">Senior Level</option>
                <option value="LEAD">Lead / Architect</option>
              </Select>

              <Select
                label="Estimated Timeline"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
              >
                <option value="3">3 Months (Intensive Pivot)</option>
                <option value="6">6 Months (Standard Focus)</option>
                <option value="12">12 Months (Deep Reskilling)</option>
                <option value="18">18 Months (Long-term Mastery)</option>
                <option value="24">24 Months (Structural Shift)</option>
              </Select>

              <Select
                label="Associate Resume Base"
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
              >
                <option value="">No Resume Profile (Blank baseline)</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.original_filename} (ATS: {r.ats_score || 'N/A'})
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                className="h-9.5 text-xs font-bold cursor-pointer rounded-xl border-[var(--border)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-all text-[var(--body)] bg-transparent"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                disabled={generateRoadmapMutation.isPending}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 font-bold cursor-pointer bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white border-none rounded-xl transition-all duration-200 text-xs h-9.5"
              >
                {generateRoadmapMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5" />
                    <span>Mapping roadmap details...</span>
                  </>
                ) : (
                  <>
                    <Compass size={14} className="animate-pulse" />
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
        <EmptyRoadmapsState 
          onAction={() => setShowCreateForm(true)} 
          hasResumes={resumes.length > 0}
          onNavigateToResumes={() => navigate('/resumes')}
        />
      ) : isActiveRoadmapLoading ? (
        <CareerCoachSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Navigation Tabs bar */}
          <div className="border-b border-[var(--border)] flex items-center justify-between gap-4 overflow-x-auto pb-px">
            <div className="flex gap-1">
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
                    className={cn(
                      'flex items-center gap-2 pb-3 px-3.5 text-label transition-all relative cursor-pointer border-b-2 border-transparent bg-transparent focus:outline-none -mb-[1px]',
                      isActive
                        ? 'text-[var(--primary)] border-[var(--primary)] font-extrabold'
                        : 'text-[var(--muted)] hover:text-[var(--heading)]'
                    )}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 pb-2">
              <button
                onClick={handleReload}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--heading)] hover:bg-[var(--surface-hover)] cursor-pointer transition-colors bg-transparent animate-duration-150"
                title="Sync roadmap workspace"
              >
                <RotateCw size={14} />
              </button>
              <button
                onClick={() => handleDelete(selectedRoadmapId)}
                disabled={deleteRoadmapMutation.isPending}
                className="p-1.5 rounded-lg border border-[var(--danger)]/25 hover:border-[var(--danger)]/40 text-[var(--danger)] hover:bg-[var(--danger)]/10 cursor-pointer transition-colors bg-transparent animate-duration-150"
                title="Delete active roadmap"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Active Tab contents */}
          <div className="animate-fade-in text-left">
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
