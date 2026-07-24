import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type { ResumeResponse } from '@/types/resume'
import type { ResumeReviewResponse, ResumeOptimizationResponse } from '@/types/resume-intelligence'
import toast from 'react-hot-toast'

export function useResumeIntelligence() {
  const queryClient = useQueryClient()
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')

  // 1. Query User's Resumes List
  const {
    data: resumesData,
    isLoading: isResumesLoading,
    isError: isResumesError,
    refetch: refetchResumes,
  } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['resumesList'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      if (import.meta.env.DEV && !res.data) {
        console.warn('[useResumeIntelligence] API /resumes returned empty or null response data', res)
      }
      return res.data
    },
    staleTime: 1000 * 60 * 5, // 5 mins cache
    gcTime: 1000 * 60 * 15, // 15 mins garbage collection
    refetchOnWindowFocus: false,
    retry: 1,
  })

  // Safe multi-format array extraction supporting both { resumes: [...] } and raw [...]
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

  // 2. Query AI Reviews History for Selected Resume
  const {
    data: reviewsData,
    isLoading: isReviewLoading,
    refetch: refetchReview,
  } = useQuery<{ reviews: ResumeReviewResponse[] }>({
    queryKey: ['resumeReviews', selectedResumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/resume/reviews?resume_id=${selectedResumeId}`)
      if (import.meta.env.DEV && !res.data) {
        console.warn('[useResumeIntelligence] API /ai/resume/reviews returned empty response data', res)
      }
      return res.data
    },
    enabled: !!selectedResumeId,
    staleTime: 1000 * 60 * 5, // 5 mins cache
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const reviewsList = Array.isArray(reviewsData?.reviews)
    ? reviewsData.reviews
    : Array.isArray(reviewsData)
    ? (reviewsData as any)
    : []
  const latestReview = reviewsList[0] || null

  // 3. Query AI Optimizations History for Selected Resume
  const {
    data: optimizationsData,
    isLoading: isOptimizationLoading,
    refetch: refetchOptimization,
  } = useQuery<{ optimizations: ResumeOptimizationResponse[] }>({
    queryKey: ['resumeOptimizations', selectedResumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/resume/optimizations?resume_id=${selectedResumeId}`)
      if (import.meta.env.DEV && !res.data) {
        console.warn('[useResumeIntelligence] API /ai/resume/optimizations returned empty response data', res)
      }
      return res.data
    },
    enabled: !!selectedResumeId,
    staleTime: 1000 * 60 * 5, // 5 mins cache
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  const optimizationsList = Array.isArray(optimizationsData?.optimizations)
    ? optimizationsData.optimizations
    : Array.isArray(optimizationsData)
    ? (optimizationsData as any)
    : []
  const latestOptimization = optimizationsList[0] || null

  // 4. Re-analyze Resume Mutation (Triggers AI Review & AI Optimization)
  const reanalyzeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      toast.loading('Running AI Resume Analysis & Optimization Pipeline...', { id: 'ai-reanalyze' })
      
      const [reviewRes, optRes] = await Promise.all([
        api.post('/ai/resume/review', {
          resume_id: resumeId,
          mode: 'STANDARD',
          bypass_cache: true,
        }),
        api.post('/ai/resume/optimize', {
          resume_id: resumeId,
          mode: 'STANDARD',
          bypass_cache: true,
        }),
      ])

      return { review: reviewRes.data, optimization: optRes.data }
    },
    onSuccess: (_, resumeId) => {
      toast.success('Resume Analysis updated successfully!', { id: 'ai-reanalyze' })
      queryClient.invalidateQueries({ queryKey: ['resumeReviews', resumeId] })
      queryClient.invalidateQueries({ queryKey: ['resumeOptimizations', resumeId] })
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || 'Failed to complete AI re-analysis'
      toast.error(msg, { id: 'ai-reanalyze' })
    },
  })

  const handleReanalyze = () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume to analyze')
      return
    }
    reanalyzeMutation.mutate(selectedResumeId)
  }

  return {
    resumes,
    selectedResumeId,
    setSelectedResumeId,
    selectedResumeTitle: selectedResume?.title || selectedResume?.original_filename || 'Senior AI Engineer Resume.pdf',
    latestReview,
    latestOptimization,
    isResumesLoading,
    isResumesError,
    isReviewLoading,
    isOptimizationLoading,
    isReanalyzing: reanalyzeMutation.isPending,
    handleReanalyze,
    refetchAll: () => {
      refetchResumes()
      refetchReview()
      refetchOptimization()
    },
  }
}

export default useResumeIntelligence
