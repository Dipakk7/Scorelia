import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { InterviewPrepApiService } from '@/api/interviewPrepApi'
import type { MockInterviewSetupConfig } from '@/types/interviewPrep'
import toast from 'react-hot-toast'

export function useInterviewOverview() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['interviewPrepOverview'],
    queryFn: () => InterviewPrepApiService.getOverviewData(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
  })

  return {
    overviewData: data,
    isLoading,
    isError,
    refetch,
  }
}

export function useMockInterviews() {
  const queryClient = useQueryClient()

  const { data: resumes = [], isLoading: isResumesLoading } = useQuery({
    queryKey: ['interviewResumes'],
    queryFn: () => InterviewPrepApiService.getResumes(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: difficulties = [] } = useQuery({
    queryKey: ['interviewDifficulties'],
    queryFn: () => InterviewPrepApiService.getDifficulties(),
    staleTime: Infinity,
  })

  const { data: interviewTypes = [] } = useQuery({
    queryKey: ['interviewTypes'],
    queryFn: () => InterviewPrepApiService.getInterviewTypes(),
    staleTime: Infinity,
  })

  const { data: interviewModes = [] } = useQuery({
    queryKey: ['interviewModes'],
    queryFn: () => InterviewPrepApiService.getInterviewModes(),
    staleTime: Infinity,
  })

  const { data: history = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['mockInterviewHistory'],
    queryFn: () => InterviewPrepApiService.getRecentMockHistory(),
    staleTime: 1000 * 60 * 2,
  })

  const startMutation = useMutation({
    mutationFn: (config: MockInterviewSetupConfig) => InterviewPrepApiService.startMockInterview(config),
    onSuccess: () => {
      toast.success('Mock Interview session initialized!')
      queryClient.invalidateQueries({ queryKey: ['mockInterviewHistory'] })
    },
    onError: () => {
      toast.error('Failed to initialize Mock Interview session')
    },
  })

  return {
    resumes,
    difficulties,
    interviewTypes,
    interviewModes,
    history,
    isLoading: isResumesLoading || isHistoryLoading,
    startInterview: startMutation.mutateAsync,
    isStarting: startMutation.isPending,
  }
}

export function useQuestionBank() {
  const { data: categories = [] } = useQuery({
    queryKey: ['questionCategories'],
    queryFn: () => InterviewPrepApiService.getQuestionCategories(),
    staleTime: 1000 * 60 * 10,
  })

  const { data: questions = [], isLoading: isQuestionsLoading } = useQuery({
    queryKey: ['questionBankList'],
    queryFn: () => InterviewPrepApiService.getQuestionBankList(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: summary } = useQuery({
    queryKey: ['practiceSummary'],
    queryFn: () => InterviewPrepApiService.getPracticeSummary(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: recentPracticed = [] } = useQuery({
    queryKey: ['recentlyPracticed'],
    queryFn: () => InterviewPrepApiService.getRecentlyPracticedList(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    categories,
    questions,
    summary,
    recentPracticed,
    isLoading: isQuestionsLoading,
  }
}

export function useInterviewAnswers(selectedId?: string) {
  const { data: summary } = useQuery({
    queryKey: ['answerSummary'],
    queryFn: () => InterviewPrepApiService.getAnswerSummary(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: answers = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ['answerHistoryList'],
    queryFn: () => InterviewPrepApiService.getAnswerHistoryList(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: suggestions } = useQuery({
    queryKey: ['improvementSuggestions'],
    queryFn: () => InterviewPrepApiService.getImprovementSuggestions(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: recentAttempts = [] } = useQuery({
    queryKey: ['recentAttempts'],
    queryFn: () => InterviewPrepApiService.getRecentAttemptsList(),
    staleTime: 1000 * 60 * 5,
  })

  const { data: selectedDetail } = useQuery({
    queryKey: ['answerDetail', selectedId],
    queryFn: () => InterviewPrepApiService.getAnswerDetails(selectedId),
    enabled: Boolean(selectedId),
  })

  return {
    summary,
    answers,
    suggestions,
    recentAttempts,
    selectedDetail,
    isLoading: isHistoryLoading,
  }
}

export function useInterviewAnalytics() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['performanceAnalytics'],
    queryFn: () => InterviewPrepApiService.getPerformanceAnalyticsData(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    analyticsData: data,
    isLoading,
    isError,
    refetch,
  }
}

export function useInterviewCopilot() {
  const { data, isLoading } = useQuery({
    queryKey: ['interviewCopilotData'],
    queryFn: () => InterviewPrepApiService.getCopilotWorkspaceData(),
    staleTime: 1000 * 60 * 5,
  })

  const promptMutation = useMutation({
    mutationFn: (prompt: string) => InterviewPrepApiService.sendCopilotPrompt(prompt),
  })

  return {
    copilotData: data,
    isLoading,
    sendPrompt: promptMutation.mutateAsync,
    isSending: promptMutation.isPending,
  }
}

export function useInterviewReports() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['interviewReportsData'],
    queryFn: () => InterviewPrepApiService.getReportsWorkspaceData(),
    staleTime: 1000 * 60 * 5,
  })

  return {
    reportsData: data,
    isLoading,
    isError,
    refetch,
  }
}
