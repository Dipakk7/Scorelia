import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse } from '@/types/resume'
import {
  transformToATSOverviewData,
  transformToQuickMetrics,
  transformToATSCompatibility,
  transformToAIOverviewBanner,
  transformToPriorityRecommendations,
  transformToRecruiterFeedback,
  transformToSectionList,
  transformToSectionDetailsMap,
} from '@/lib/ats-adapter'
import toast from 'react-hot-toast'

export function useATSAnalysis() {
  const queryClient = useQueryClient()
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [jobDescription, setJobDescription] = useState<string>('')

  // 1. Fetch User Resumes List
  const {
    data: resumesData,
    isLoading: isResumesLoading,
    isError: isResumesError,
    refetch: refetchResumes,
  } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['resumesList'],
    queryFn: async () => {
      try {
        const res = await api.get('/resumes')
        return res?.data || { resumes: [], total: 0 }
      } catch (err) {
        console.warn('[useATSAnalysis] /resumes query fallback:', err)
        return { resumes: [], total: 0 }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 mins cache
    gcTime: 1000 * 60 * 15,
    placeholderData: { resumes: [], total: 0 },
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // Multi-format resume list extraction
  const resumes: ResumeResponse[] = Array.isArray(resumesData?.resumes)
    ? resumesData.resumes
    : Array.isArray(resumesData)
    ? (resumesData as any)
    : []

  // Pre-select first resume if available and none selected
  useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(resumes[0].id)
    }
  }, [resumesData, selectedResumeId])

  const selectedResume = resumes.find((r) => r.id === selectedResumeId)

  // 2. Query ATS Analytics Global Overview
  const {
    data: atsAnalyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery<any>({
    queryKey: ['atsAnalytics'],
    queryFn: async () => {
      try {
        const res = await api.get('/analytics/ats')
        return res?.data || null
      } catch (err) {
        console.warn('[useATSAnalysis] /analytics/ats fallback', err)
        return null
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    placeholderData: null,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // 3. Query ATS Review / Score for Selected Resume
  const {
    data: atsReviewData,
    isLoading: isReviewLoading,
    isError: isReviewError,
    refetch: refetchReview,
  } = useQuery<any>({
    queryKey: ['atsReview', selectedResumeId],
    queryFn: async () => {
      if (!selectedResumeId) return null
      try {
        const res = await api.post('/agents/ats/score', {
          resume_id: selectedResumeId,
          bypass_cache: false,
        })
        return res?.data || null
      } catch (err) {
        console.warn('[useATSAnalysis] /agents/ats/score fallback', err)
        return null
      }
    },
    enabled: !!selectedResumeId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    placeholderData: null,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // 4. Re-analyze ATS Mutation
  const reanalyzeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      toast.loading('Running ATS Agent Scanner & Evaluation Pipeline...', { id: 'ats-reanalyze' })

      const res = await api.post('/agents/ats/review', {
        resume_id: resumeId,
        job_description: jobDescription || undefined,
        bypass_cache: true,
      })

      return res.data
    },
    onSuccess: (_, resumeId) => {
      toast.success('ATS Analysis updated successfully!', { id: 'ats-reanalyze' })
      queryClient.invalidateQueries({ queryKey: ['atsReview', resumeId] })
      queryClient.invalidateQueries({ queryKey: ['atsAnalytics'] })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to complete ATS analysis'
      toast.error(msg, { id: 'ats-reanalyze' })
    },
  })

  const handleReanalyze = useCallback(() => {
    if (!selectedResumeId) {
      toast.error('Please select a resume to analyze')
      return
    }
    reanalyzeMutation.mutate(selectedResumeId)
  }, [selectedResumeId, reanalyzeMutation])

  const refetchAll = useCallback(() => {
    refetchResumes()
    refetchAnalytics()
    refetchReview()
  }, [refetchResumes, refetchAnalytics, refetchReview])

  // Combine review and analytics data
  const combinedPayload = atsReviewData || atsAnalyticsData || null

  return {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    selectedResumeTitle: selectedResume?.original_filename || selectedResume?.title || 'Software_Engineer_Resume.pdf',
    jobDescription,
    setJobDescription,

    // Adapted Data Objects
    atsOverviewData: transformToATSOverviewData(combinedPayload, selectedResume?.original_filename),
    quickMetrics: transformToQuickMetrics(combinedPayload),
    atsCompatibility: transformToATSCompatibility(combinedPayload),
    aiOverviewBanner: transformToAIOverviewBanner(combinedPayload),
    priorityRecommendations: transformToPriorityRecommendations(combinedPayload),
    recruiterFeedback: transformToRecruiterFeedback(combinedPayload),
    sectionsList: transformToSectionList(combinedPayload),
    sectionDetailsMap: transformToSectionDetailsMap(combinedPayload),

    // Loading & Error States
    isResumesLoading,
    isResumesError,
    isAtsLoading: isAnalyticsLoading || isReviewLoading,
    isAtsError: isReviewError,
    isReanalyzing: reanalyzeMutation.isPending,
    handleReanalyze,
    refetchAll,
  }
}

export default useATSAnalysis
