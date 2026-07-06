import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/api'
import type {
  InterviewSessionResponse,
  InterviewTurnResponse,
  AnswerEvaluationResponse,
  InterviewAnalyticsResponse,
  HistoryAnalyticsResponse,
  InterviewSessionCreate,
} from '@/types/interview'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Loader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/ErrorState'
import { InterviewSkeleton } from '@/components/ui/Skeletons'
import { EmptyInterviewsState } from '@/components/ui/EmptyState'
import InterviewDashboardCard from '@/components/interview/InterviewDashboardCard'
import InterviewSetupForm from '@/components/interview/InterviewSetupForm'
import InterviewTimer from '@/components/interview/InterviewTimer'
import InterviewQuestionCard from '@/components/interview/InterviewQuestionCard'
import AnswerEvaluationCard from '@/components/interview/AnswerEvaluationCard'
import STARScoreCard from '@/components/interview/STARScoreCard'
import InterviewAnalyticsChart from '@/components/interview/InterviewAnalyticsChart'
import QuestionHistory from '@/components/interview/QuestionHistory'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import {
  Plus,
  ArrowLeft,
  ChevronRight,
  ThumbsUp,
  CheckCircle,
  ThumbsDown,
  AlertTriangle,
} from 'lucide-react'

export default function InterviewPage() {
  const queryClient = useQueryClient()

  // Views: 'dashboard' | 'setup' | 'active' | 'feedback' | 'report'
  const [currentView, setCurrentView] = useState<'dashboard' | 'setup' | 'active' | 'report'>('dashboard')
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  // Active Session simulation states
  const [activeSession, setActiveSession] = useState<InterviewSessionResponse | null>(null)
  const [currentTurn, setCurrentTurn] = useState<InterviewTurnResponse | null>(null)
  const [turnIndex, setTurnIndex] = useState<number>(0) // 0-indexed index of active question
  const [secondsLeft, setSecondsLeft] = useState<number>(300)
  const [totalSeconds, setTotalSeconds] = useState<number>(300)
  const [isPaused, setIsPaused] = useState<boolean>(false)

  // Active Turn feedback states
  const [turnFeedback, setTurnFeedback] = useState<AnswerEvaluationResponse | null>(null)
  const [submittedAnswerText, setSubmittedAnswerText] = useState<string>('')
  const timerRef = useRef<number | null>(null)

  // QUERIES

  // Fetch session history list
  const {
    data: historyData,
    isLoading: historyLoading,
    error: historyError,
    refetch,
  } = useQuery<{ sessions: InterviewSessionResponse[]; total: number }>({
    queryKey: ['interviewSessionsList'],
    queryFn: async () => {
      const res = await api.get('/ai/interview/sessions')
      return res.data
    },
  })

  // Fetch aggregated history analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery<HistoryAnalyticsResponse>({
    queryKey: ['interviewHistoryAnalytics'],
    queryFn: async () => {
      const res = await api.get('/ai/interview/history/analytics')
      return res.data
    },
  })

  // Fetch report details for selected completed session
  const { data: reportData, isLoading: reportLoading } = useQuery<InterviewAnalyticsResponse>({
    queryKey: ['interviewReport', selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return null
      const res = await api.get(`/ai/interview/session/${selectedSessionId}/report`)
      return res.data
    },
    enabled: !!selectedSessionId && currentView === 'report',
  })

  // Fetch details of selected completed session to show questions list in report
  const { data: reportSessionData } = useQuery<InterviewSessionResponse>({
    queryKey: ['interviewSessionDetail', selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return null
      const res = await api.get(`/ai/interview/sessions/${selectedSessionId}`)
      return res.data
    },
    enabled: !!selectedSessionId && currentView === 'report',
  })

  // TIMER HANDLER
  useEffect(() => {
    if (currentView === 'active' && !isPaused && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(timerRef.current!)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [currentView, isPaused, secondsLeft])

  // MUTATIONS

  // Start Session Mutation (Creates and initializes session in backend)
  const startSessionMutation = useMutation({
    mutationFn: async (config: InterviewSessionCreate & { timeLimitMinutes: number }) => {
      const res = await api.post('/ai/interview/session/start', {
        resume_id: config.resume_id,
        job_id: config.job_id,
        company_name: config.company_name,
        target_role: config.target_role,
        interview_type: config.interview_type,
        difficulty: config.difficulty,
        total_questions: config.total_questions,
        session_metadata: config.session_metadata,
      })
      return { session: res.data, timeLimitMinutes: config.timeLimitMinutes }
    },
    onSuccess: (data) => {
      const session = data.session as InterviewSessionResponse
      setActiveSession(session)
      setSelectedSessionId(session.id)
      setTurnIndex(0)
      setTurnFeedback(null)

      // Initialize timers
      const timeLimitSeconds = data.timeLimitMinutes * 60
      setSecondsLeft(timeLimitSeconds)
      setTotalSeconds(timeLimitSeconds)
      setIsPaused(false)

      if (session.turns && session.turns.length > 0) {
        // Find active question
        const active = session.turns.find((t) => t.answer_text === null) || session.turns[0]
        setCurrentTurn(active)
        setTurnIndex(active.question_number - 1)
      } else {
        // Fallback: fetch questions
        fetchQuestionsMutation.mutate(session.id)
      }

      toast.success('Mock session initialized! Focus and deliver your best.')
      setCurrentView('active')
    },
    onError: (err: any) => {
      console.error(err)
      const msg = err?.response?.data?.message || err?.message || 'Failed to start interview.'
      toast.error(msg)
    },
  })

  // Fetch Questions Mutation (Fallback if turns not in start payload)
  const fetchQuestionsMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.get(`/ai/interview/session/${id}/questions`)
      return res.data
    },
    onSuccess: (data: InterviewTurnResponse[]) => {
      if (activeSession) {
        const updated = { ...activeSession, turns: data }
        setActiveSession(updated)
        const active = data.find((t) => t.answer_text === null) || data[0]
        setCurrentTurn(active)
        setTurnIndex(active ? active.question_number - 1 : 0)
      }
    },
  })

  // Submit Answer Mutation (submits active answer and fetches evaluation)
  const submitAnswerMutation = useMutation({
    mutationFn: async (answerText: string) => {
      if (!activeSession || !currentTurn) throw new Error('No active session.')
      setSubmittedAnswerText(answerText)
      const res = await api.post(`/ai/interview/session/${activeSession.id}/answer`, {
        answer: answerText,
      })
      return res.data
    },
    onSuccess: (data: AnswerEvaluationResponse) => {
      setTurnFeedback(data)
      toast.success('Answer submitted successfully!')
    },
    onError: (err: any) => {
      console.error(err)
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit answer.'
      toast.error(msg)
    },
  })

  // Advance to Next Question
  const advanceNextMutation = useMutation({
    mutationFn: async () => {
      if (!activeSession) throw new Error('No active session.')
      const res = await api.post(`/ai/interview/session/${activeSession.id}/next`)
      return res.data
    },
    onSuccess: (data: InterviewTurnResponse) => {
      setCurrentTurn(data)
      setTurnIndex(data.question_number - 1)
      setTurnFeedback(null)
      setSubmittedAnswerText('')
      toast.success('Loading next question prompt...')
    },
    onError: (err: any) => {
      // If next returns error, check if completed
      console.warn('Next returned:', err)
      handleCompleteInterview()
    },
  })

  // Complete Interview Session
  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      if (!activeSession) throw new Error('No active session.')
      const res = await api.post(`/ai/interview/session/${activeSession.id}/complete`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Mock Interview Completed! Generating AI report card...')
      queryClient.invalidateQueries({ queryKey: ['interviewSessionsList'] })
      queryClient.invalidateQueries({ queryKey: ['interviewHistoryAnalytics'] })
      setCurrentView('report')
    },
    onError: (err: any) => {
      console.error(err)
      toast.error('Failed to complete session.')
    },
  })

  // Pause / Resume Session Mutations
  const togglePauseMutation = useMutation({
    mutationFn: async () => {
      if (!activeSession) return
      const url = isPaused ? `/ai/interview/session/${activeSession.id}/resume` : `/ai/interview/session/${activeSession.id}/pause`
      await api.post(url)
    },
    onSuccess: () => {
      setIsPaused(!isPaused)
      toast.success(isPaused ? 'Timer resumed.' : 'Timer paused.')
    },
  })

  // Cancel active session
  const cancelSessionMutation = useMutation({
    mutationFn: async () => {
      if (!activeSession) return
      await api.post(`/ai/interview/session/${activeSession.id}/cancel`)
    },
    onSuccess: () => {
      toast.success('Mock interview cancelled.')
      queryClient.invalidateQueries({ queryKey: ['interviewSessionsList'] })
      setCurrentView('dashboard')
      setActiveSession(null)
      setSelectedSessionId(null)
    },
  })

  // SIMULATOR CONTROL ACTIONS

  const handleNextQuestion = () => {
    // Check if we are at the last question
    if (activeSession && turnIndex + 1 >= activeSession.total_questions) {
      handleCompleteInterview()
    } else {
      advanceNextMutation.mutate()
    }
  }

  const handleSkipQuestion = () => {
    toast.loading('Skipping question...', { duration: 1000 })
    onSubmitAnswer('Skipped this question due to time constraints.')
  }

  const handleCompleteInterview = () => {
    completeSessionMutation.mutate()
  }

  const onSubmitAnswer = (ans: string) => {
    submitAnswerMutation.mutate(ans)
  }

  const handleOpenReport = (id: string) => {
    setSelectedSessionId(id)
    setCurrentView('report')
  }

  if (historyLoading) {
    return <InterviewSkeleton />
  }

  if (historyError) {
    return <ErrorState message="Failed to load interview history. Verify FastAPI backend." onRetry={refetch} />
  }

  const sessions = historyData?.sessions || []

  return (
    <div className="space-y-6 text-left animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-905 dark:text-white m-0">AI Interview Prep Coach</h1>
          <p className="text-xs text-slate-500 mt-1">Refine your technical stack and STAR structured storytelling skills with real-time feedback.</p>
        </div>

        {currentView === 'dashboard' && (
          <Button onClick={() => setCurrentView('setup')} className="gap-2 shadow-sm font-semibold text-xs cursor-pointer">
            <Plus size={14} />
            <span>Configure Mock Round</span>
          </Button>
        )}

        {currentView !== 'dashboard' && currentView !== 'active' && (
          <Button
            variant="outline"
            onClick={() => {
              setCurrentView('dashboard')
              setSelectedSessionId(null)
              setActiveSession(null)
            }}
            className="gap-2 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Button>
        )}
      </div>

      {/* DASHBOARD VIEW */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {/* Historical metrics grids */}
          <InterviewDashboardCard stats={analyticsData || null} isLoading={analyticsLoading} />

          {/* Interactive Trends charts */}
          {analyticsData && (
            <div className="space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Performance Metrics Analysis</h3>
              <InterviewAnalyticsChart
                scoreTrend={analyticsData.score_trend}
                weeklyActivity={analyticsData.weekly_completion_count}
              />
            </div>
          )}

          {/* Session history listings */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Simulated Mock Round History</h3>
            {sessions.length === 0 ? (
              <EmptyInterviewsState onAction={() => setCurrentView('setup')} />
            ) : (
              <QuestionHistory sessions={sessions} onSelectSession={handleOpenReport} />
            )}
          </div>
        </div>
      )}

      {/* SETUP VIEW */}
      {currentView === 'setup' && (
        <InterviewSetupForm onSubmit={(data) => startSessionMutation.mutate(data)} isSubmitting={startSessionMutation.isPending} />
      )}

      {/* ACTIVE SIMULATOR VIEW */}
      {currentView === 'active' && activeSession && currentTurn && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left panel: active question simulator or feedback */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {turnFeedback ? (
              <div className="space-y-4">
                <AnswerEvaluationCard
                  evaluation={turnFeedback}
                  questionText={currentTurn.question_text}
                  answerText={submittedAnswerText}
                />
                <STARScoreCard starScore={turnFeedback.star_score} answerText={submittedAnswerText} />
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={advanceNextMutation.isPending || completeSessionMutation.isPending}
                    className="gap-2.5 px-6 font-bold shadow-xs cursor-pointer"
                  >
                    {turnIndex + 1 >= activeSession.total_questions ? (
                      <>
                        <span>Finish & Compile Report</span>
                        <ChevronRight size={14} />
                      </>
                    ) : (
                      <>
                        <span>Next Question Drill</span>
                        <ChevronRight size={14} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <InterviewQuestionCard
                turn={currentTurn}
                currentNumber={turnIndex + 1}
                totalCount={activeSession.total_questions}
                onSubmitAnswer={onSubmitAnswer}
                onSkipQuestion={handleSkipQuestion}
                onCompleteSession={handleCompleteInterview}
                isSubmitting={submitAnswerMutation.isPending}
              />
            )}
          </div>

          {/* Right panel: timer controls */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <InterviewTimer
              secondsLeft={secondsLeft}
              totalSeconds={totalSeconds}
              isPaused={isPaused}
              onPauseToggle={() => togglePauseMutation.mutate()}
              onTimeUp={handleCompleteInterview}
            />

            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardContent className="p-5 text-xs text-slate-600 dark:text-slate-400 font-sans space-y-3 leading-relaxed">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Active Simulator Controls
                </span>
                <p>
                  You are participating in a <strong>{activeSession.interview_type}</strong> round configured for a <strong>{activeSession.target_role}</strong> role.
                </p>
                <ul className="space-y-2 text-[10px] pl-3 list-disc">
                  <li>Keep answers detailed (aim for 1-3 minutes of speaking equivalent, roughly 150-300 words).</li>
                  <li>Use structure like STAR to organize behavioral situational questions.</li>
                  <li>You can pause the session to gather your thoughts; the timer will lock.</li>
                  <li>Click skip if you want to bypass a question.</li>
                </ul>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    onClick={() => cancelSessionMutation.mutate()}
                    className="w-full text-rose-500 border-rose-500/10 hover:bg-rose-500/5 h-8 text-[11px] font-bold cursor-pointer"
                  >
                    Cancel Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* FEEDBACK REPORT VIEW */}
      {currentView === 'report' && selectedSessionId && (
        <div className="space-y-6">
          {reportLoading ? (
            <Loader label="AI is generating your comprehensive session report cards..." />
          ) : reportData ? (
            <div className="space-y-6 text-left">
              {/* Summary Grade Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                <Card className="md:col-span-2 border-brand-500/10 bg-brand-500/5 dark:bg-brand-500/10 border-slate-200/80 dark:border-dark-border dark:bg-dark-card flex flex-col justify-between">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">
                        Final Score Report Card
                      </span>
                      <h2 className="text-lg font-bold font-display text-slate-905 dark:text-white line-clamp-1">
                        Round complete! AI Score Assessment
                      </h2>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans mt-1">
                        {reportData.summary}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentView('dashboard')}
                        className="text-xs h-8.5 font-bold cursor-pointer"
                      >
                        Return to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Score Dial Card */}
                <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card flex flex-col justify-center items-center">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="h-24 w-24 bg-brand-600 text-white rounded-full flex flex-col items-center justify-center border-4 border-brand-500/10 shadow-lg">
                      <span className="text-3xl font-black font-display leading-none">{reportData.overall_score}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider mt-1">/100</span>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">Averaged Competency Rate</h4>
                      <p className="text-[10px] text-slate-400 font-sans">Across all completed questions</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Competency breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Stats scores grid */}
                <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Turn Score Breakdowns
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-3.5">
                    {[
                      { label: 'Technical Accuracy', value: reportData.session_statistics.technical_score, color: 'bg-amber-500' },
                      { label: 'STAR Methodology', value: reportData.session_statistics.star_score, color: 'bg-purple-500' },
                      { label: 'Communication delivery', value: reportData.session_statistics.communication_score, color: 'bg-blue-500' },
                      { label: 'Confidence & Assuredness', value: reportData.session_statistics.confidence_score, color: 'bg-rose-500' },
                      { label: 'Grammar structure', value: reportData.session_statistics.grammar_score, color: 'bg-emerald-500' },
                    ].map((m, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-sans">
                          <span className="font-medium text-slate-550 dark:text-slate-400">{m.label}</span>
                          <span className="font-bold text-slate-905 dark:text-white">{m.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={cn('h-full rounded-full', m.color)} style={{ width: `${m.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ThumbsUp size={14} />
                      <span>Round Strengths</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-2 overflow-y-auto max-h-[220px]">
                    {reportData.strengths.map((str, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px] text-slate-650 dark:text-slate-400 font-sans leading-relaxed">
                        <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                      <ThumbsDown size={14} />
                      <span>Delivery Weaknesses</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-2 overflow-y-auto max-h-[220px]">
                    {reportData.weaknesses.map((weak, i) => (
                      <div key={i} className="flex items-start gap-2 text-[10px] text-slate-650 dark:text-slate-400 font-sans leading-relaxed">
                        <AlertTriangle size={12} className="text-rose-500 shrink-0 mt-0.5" />
                        <span>{weak}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* STAR Radar diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-8">
                  <InterviewAnalyticsChart
                    starScores={{
                      Situation: reportData.session_statistics.star_score,
                      Task: Math.max(0, reportData.session_statistics.star_score - 5),
                      Action: Math.min(100, reportData.session_statistics.star_score + 8),
                      Result: Math.max(0, reportData.session_statistics.star_score - 10),
                    }}
                  />
                </div>

                {/* Recommendations */}
                <Card className="lg:col-span-4 border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
                  <CardHeader>
                    <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Study & Coaching Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4 text-[10px] overflow-y-auto max-h-[300px]">
                    {reportData.recommendations.practice_topics.length > 0 && (
                      <div className="space-y-1">
                        <strong className="text-slate-700 dark:text-slate-350 block uppercase tracking-wide">Practice Topics</strong>
                        <div className="flex flex-wrap gap-1">
                          {reportData.recommendations.practice_topics.map((t, i) => (
                            <Badge key={i} variant="outline" className="bg-brand-500/5 text-brand-650 border-brand-500/10 text-[9px] py-0">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {reportData.recommendations.learning_recommendations.length > 0 && (
                      <div className="space-y-1">
                        <strong className="text-slate-700 dark:text-slate-350 block uppercase tracking-wide">Coaching Advices</strong>
                        <ul className="space-y-1 pl-3 list-disc text-slate-600 dark:text-slate-400 font-sans leading-normal">
                          {reportData.recommendations.learning_recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Complete turns logging list */}
              {reportSessionData && (
                <div className="space-y-3.5">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Review Detailed Response Logs</h3>
                  <QuestionHistory sessions={[reportSessionData]} />
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 border border-slate-200/80 rounded-2xl dark:border-dark-border dark:bg-dark-card">
              AI analytics report could not be fetched. If the session was completed just now, please refresh.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
