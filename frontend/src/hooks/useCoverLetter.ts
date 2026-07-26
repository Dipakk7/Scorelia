import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type {
  CoverLetterResponse,
  CoverLetterHistory,
  CoverLetterRequest,
} from '@/types/cover-letter'
import type { ResumeResponse } from '@/types/resume'
import {
  adaptBackendCoverLetter,
  adaptBackendResumes,
  adaptBackendKeywords,
  adaptBackendScoreBreakdown,
  adaptBackendSuggestions,
} from '@/lib/cover-letter-adapter'
import { mockCoverLetterVersions } from '@/lib/cover-letter-mock-data'

export function useCoverLetter() {
  const queryClient = useQueryClient()
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 1. Query: Resumes List (Optimized Cache Config)
  const resumesQuery = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['coverLetterResumes'],
    queryFn: async () => {
      try {
        const res = await api.get('/resumes')
        return res.data
      } catch (err: any) {
        return { resumes: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 60000,
    gcTime: 300000,
  })

  // 2. Query: Cover Letters History (Optimized Cache Config)
  const historyQuery = useQuery<CoverLetterHistory>({
    queryKey: ['coverLettersHistory'],
    queryFn: async () => {
      try {
        const res = await api.get('/cover-letters')
        return res.data
      } catch (err: any) {
        return { cover_letters: [], total: 0 }
      }
    },
    retry: 1,
    staleTime: 30000,
    gcTime: 300000,
  })

  // Determine active letter ID from history if not set
  const activeId = useMemo(() => {
    if (selectedLetterId) return selectedLetterId
    const list = historyQuery.data?.cover_letters ?? []
    return list.length > 0 ? list[0].id : null
  }, [selectedLetterId, historyQuery.data])

  // 3. Query: Cover Letter Detail
  const activeDetailQuery = useQuery<CoverLetterResponse>({
    queryKey: ['coverLetterDetail', activeId],
    queryFn: async () => {
      if (!activeId) throw new Error('No active letter ID')
      const res = await api.get(`/cover-letters/${activeId}`)
      return res.data
    },
    enabled: Boolean(activeId),
    retry: 1,
    staleTime: 60000,
    gcTime: 300000,
  })

  // 4. Mutation: Generate Cover Letter
  const generateMutation = useMutation({
    mutationFn: async (payload: CoverLetterRequest) => {
      setErrorMessage(null)
      const res = await api.post('/cover-letters', payload)
      return res.data as CoverLetterResponse
    },
    onSuccess: (data) => {
      if (data?.id) {
        setSelectedLetterId(data.id)
      }
      queryClient.invalidateQueries({ queryKey: ['coverLettersHistory'] })
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || 'Generation failed. Using offline presentation mode.'
      setErrorMessage(msg)
    },
  })

  // 5. Mutation: Update / Enhance Cover Letter
  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await api.put(`/cover-letters/${id}`, { generated_content: content })
      return res.data as CoverLetterResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetterDetail', activeId] })
      queryClient.invalidateQueries({ queryKey: ['coverLettersHistory'] })
    },
  })

  // 6. Mutation: Delete Cover Letter
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/cover-letters/${id}`)
      return id
    },
    onSuccess: (deletedId) => {
      if (selectedLetterId === deletedId) {
        setSelectedLetterId(null)
      }
      queryClient.invalidateQueries({ queryKey: ['coverLettersHistory'] })
    },
  })

  // Safe Defensive Adapted Output Data
  const adaptedResumes = useMemo(() => {
    return adaptBackendResumes(resumesQuery.data?.resumes)
  }, [resumesQuery.data])

  const adaptedActiveContent = useMemo(() => {
    if (activeDetailQuery.data) {
      return adaptBackendCoverLetter(activeDetailQuery.data)
    }
    const firstHistory = historyQuery.data?.cover_letters?.[0]
    if (firstHistory) {
      return adaptBackendCoverLetter(firstHistory)
    }
    return mockCoverLetterVersions[0]
  }, [activeDetailQuery.data, historyQuery.data])

  const adaptedScoreBreakdown = useMemo(() => {
    return adaptBackendScoreBreakdown()
  }, [])

  const adaptedKeywords = useMemo(() => {
    return adaptBackendKeywords()
  }, [])

  const adaptedSuggestions = useMemo(() => {
    return adaptBackendSuggestions()
  }, [])

  const handleSelectLetter = useCallback((id: string) => {
    setSelectedLetterId(id)
  }, [])

  return {
    resumesQuery,
    historyQuery,
    activeDetailQuery,
    generateMutation,
    updateMutation,
    deleteMutation,
    selectedLetterId,
    handleSelectLetter,
    errorMessage,
    setErrorMessage,
    adaptedResumes,
    adaptedActiveContent,
    adaptedScoreBreakdown,
    adaptedKeywords,
    adaptedSuggestions,
  }
}
