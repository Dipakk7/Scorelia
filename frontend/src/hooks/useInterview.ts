import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type {
  InterviewSessionCreate,
  InterviewSessionResponse,
  InterviewHistory,
  AnswerSubmitRequest,
  HistoryAnalyticsResponse,
  InterviewAnalyticsResponse,
} from '@/types/interview'
import {
  adaptBackendResumes,
  adaptBackendSession,
  adaptBackendHistory,
  adaptBackendAnalytics,
  type AdaptedResumeOption,
  type AdaptedInterviewSession,
  type AdaptedHistoryAnalytics,
} from '@/lib/interview-adapter'
import toast from 'react-hot-toast'

export function useInterview() {
  const queryClient = useQueryClient()
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. Resumes Query (Optimized Cache)
  const resumesQuery = useQuery<{ resumes: any[]; total: number }>({
    queryKey: ['interviewResumes'],
    queryFn: async () => {
      try {
        const res = await api.get('/resumes')
        return res.data ?? { resumes: [], total: 0 }
      } catch (err) {
        return { resumes: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 60000,
    gcTime: 300000,
  })

  // 2. Interview Sessions History List Query
  const sessionsQuery = useQuery<InterviewHistory>({
    queryKey: ['interviewSessionsList'],
    queryFn: async () => {
      try {
        const res = await api.get('/ai/interview/sessions')
        return res.data ?? { sessions: [], total: 0 }
      } catch (err) {
        return { sessions: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 30000,
    gcTime: 300000,
  })

  // 3. Active Session Detail Query
  const activeSessionQuery = useQuery<InterviewSessionResponse>({
    queryKey: ['interviewActiveSession', selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return null as any
      try {
        const res = await api.get(`/ai/interview/session/${selectedSessionId}`)
        return res.data
      } catch (err: any) {
        setErrorMessage(err?.response?.data?.detail ?? 'Failed to load interview session details.')
        return null as any
      }
    },
    enabled: Boolean(selectedSessionId),
    staleTime: 10000,
  })

  // 4. Aggregated History Analytics Query
  const analyticsQuery = useQuery<HistoryAnalyticsResponse>({
    queryKey: ['interviewHistoryAnalytics'],
    queryFn: async () => {
      try {
        const res = await api.get('/ai/interview/history/analytics')
        return res.data
      } catch (err) {
        return null as any
      }
    },
    retry: 1,
    staleTime: 60000,
  })

  // 5. Session Report Analytics Query
  const sessionReportQuery = useQuery<InterviewAnalyticsResponse>({
    queryKey: ['interviewReport', selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return null as any
      try {
        const res = await api.get(`/ai/interview/session/${selectedSessionId}/report`)
        return res.data
      } catch (err) {
        return null as any
      }
    },
    enabled: Boolean(selectedSessionId && activeSessionQuery.data?.status === 'COMPLETED'),
    staleTime: 30000,
  })

  // MUTATIONS

  // Create Session Mutation
  const createSessionMutation = useMutation<InterviewSessionResponse, Error, InterviewSessionCreate>({
    mutationFn: async (payload) => {
      const res = await api.post('/ai/interview/session', payload)
      return res.data
    },
    onSuccess: (data) => {
      setSelectedSessionId(data.id)
      queryClient.invalidateQueries({ queryKey: ['interviewSessionsList'] })
      queryClient.invalidateQueries({ queryKey: ['interviewHistoryAnalytics'] })
      toast.success('Interview session created successfully!')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? 'Failed to create interview session. Please check backend connection.'
      setErrorMessage(msg)
      toast.error(msg)
    },
  })

  // Submit Answer Turn Mutation
  const submitAnswerMutation = useMutation<any, Error, { sessionId: string; answer: string }>({
    mutationFn: async ({ sessionId, answer }) => {
      const res = await api.post(`/ai/interview/session/${sessionId}/turn`, { answer })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviewActiveSession', selectedSessionId] })
      queryClient.invalidateQueries({ queryKey: ['interviewSessionsList'] })
      toast.success('Answer submitted successfully!')
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? 'Failed to submit answer. Please try again.'
      toast.error(msg)
    },
  })

  // End Session Mutation
  const endSessionMutation = useMutation<InterviewSessionResponse, Error, string>({
    mutationFn: async (sessionId) => {
      const res = await api.post(`/ai/interview/session/${sessionId}/end`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviewActiveSession', selectedSessionId] })
      queryClient.invalidateQueries({ queryKey: ['interviewSessionsList'] })
      queryClient.invalidateQueries({ queryKey: ['interviewReport', selectedSessionId] })
      toast.success('Interview session completed!')
    },
    onError: (err: any) => {
      toast.error('Failed to end session.')
    },
  })

  // Delete Session Mutation
  const deleteSessionMutation = useMutation<void, Error, string>({
    mutationFn: async (sessionId) => {
      await api.delete(`/ai/interview/session/${sessionId}`)
    },
    onSuccess: (_, sessionId) => {
      if (selectedSessionId === sessionId) {
        setSelectedSessionId(null)
      }
      queryClient.invalidateQueries({ queryKey: ['interviewSessionsList'] })
      toast.success('Interview session deleted.')
    },
  })

  // Normalized Models
  const adaptedResumes = useMemo<AdaptedResumeOption[]>(() => {
    return adaptBackendResumes(resumesQuery.data?.resumes ?? [])
  }, [resumesQuery.data])

  const adaptedSessions = useMemo<AdaptedInterviewSession[]>(() => {
    return adaptBackendHistory(sessionsQuery.data)
  }, [sessionsQuery.data])

  const adaptedActiveSession = useMemo<AdaptedInterviewSession | null>(() => {
    if (!activeSessionQuery.data) return null
    return adaptBackendSession(activeSessionQuery.data)
  }, [activeSessionQuery.data])

  const adaptedAnalytics = useMemo<AdaptedHistoryAnalytics>(() => {
    return adaptBackendAnalytics(analyticsQuery.data)
  }, [analyticsQuery.data])

  return {
    // Queries
    resumesQuery,
    sessionsQuery,
    activeSessionQuery,
    analyticsQuery,
    sessionReportQuery,

    // State & Selection
    selectedSessionId,
    setSelectedSessionId,
    selectedResumeId,
    setSelectedResumeId,
    errorMessage,
    setErrorMessage,

    // Adapted Data Models
    adaptedResumes,
    adaptedSessions,
    adaptedActiveSession,
    adaptedAnalytics,

    // Mutations
    createSessionMutation,
    submitAnswerMutation,
    endSessionMutation,
    deleteSessionMutation,
  }
}

export default useInterview
