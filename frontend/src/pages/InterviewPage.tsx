import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScoreliaReducedMotion, getContainerVariants, getSectionVariants } from '@/lib/motion'
import { useInterview } from '@/hooks/useInterview'
import InterviewHeader from '@/components/interview/InterviewHeader'
import InterviewSetupCard, { type InterviewSetupState } from '@/components/interview/InterviewSetupCard'
import InterviewWorkspace from '@/components/interview/InterviewWorkspace'
import InterviewAnalysisOverview from '@/components/interview/InterviewAnalysisOverview'
import InterviewSidebar from '@/components/interview/InterviewSidebar'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorState } from '@/components/ui/ErrorState'
import toast from 'react-hot-toast'

export default function InterviewPage() {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const containerVariants = useMemo(() => getContainerVariants(shouldReduceMotion), [shouldReduceMotion])
  const sectionVariants = useMemo(() => getSectionVariants(shouldReduceMotion), [shouldReduceMotion])

  // 1. Live React Query Custom Hook
  const {
    resumesQuery,
    sessionsQuery,
    activeSessionQuery,
    selectedSessionId,
    setSelectedSessionId,
    selectedResumeId,
    setSelectedResumeId,
    errorMessage,
    setErrorMessage,
    adaptedResumes,
    adaptedActiveSession,
    createSessionMutation,
    submitAnswerMutation,
    endSessionMutation,
  } = useInterview()

  // 2. View Tab & UI Flow State
  const [activeTab, setActiveTab] = useState<'workspace' | 'analysis'>('workspace')
  const [setup, setSetup] = useState<InterviewSetupState>({
    resumeId: '',
    jobTitle: 'Senior Full Stack Engineer',
    companyName: 'Google',
    interviewType: 'Technical',
    difficulty: 'Medium',
    experienceLevel: 'Senior',
    language: 'English (US)',
    duration: '20',
  })

  // Auto-sync first resume ID if not selected
  useEffect(() => {
    if (!selectedResumeId && adaptedResumes.length > 0) {
      setSelectedResumeId(adaptedResumes[0].id)
      setSetup((prev) => ({ ...prev, resumeId: adaptedResumes[0].id }))
    }
  }, [adaptedResumes, selectedResumeId, setSelectedResumeId])

  // Derive session state safely from adapted active session or UI flow
  const sessionState = useMemo(() => {
    if (!selectedSessionId || !adaptedActiveSession) return 'idle'
    if (adaptedActiveSession.status === 'COMPLETED') return 'completed'
    if (submitAnswerMutation.isPending || createSessionMutation.isPending) return 'ai_thinking'
    return 'active_question'
  }, [selectedSessionId, adaptedActiveSession, submitAnswerMutation.isPending, createSessionMutation.isPending])

  const turns = useMemo(() => adaptedActiveSession?.turns ?? [], [adaptedActiveSession])
  const currentQuestionIndex = Math.max(0, (adaptedActiveSession?.currentQuestion ?? 1) - 1)

  const phases: ('Introduction' | 'Warm-up' | 'Technical Questions' | 'Behavioral Questions' | 'Wrap-up')[] = useMemo(
    () => ['Introduction', 'Technical Questions', 'Behavioral Questions'],
    []
  )
  const currentPhase = sessionState === 'idle' ? 'Introduction' : sessionState === 'completed' ? 'Wrap-up' : phases[currentQuestionIndex] || 'Technical Questions'

  // Handlers wrapped in useCallback for render stability
  const handleStartSession = useCallback(async () => {
    try {
      await createSessionMutation.mutateAsync({
        resume_id: setup.resumeId || selectedResumeId || null,
        job_id: null,
        company_name: setup.companyName || 'Target Company',
        target_role: setup.jobTitle || 'Senior Engineer',
        interview_type: setup.interviewType.toUpperCase() as any,
        difficulty: setup.difficulty.toUpperCase() as any,
        total_questions: 5,
        session_metadata: {
          language: setup.language,
          duration: setup.duration,
          experienceLevel: setup.experienceLevel,
        },
      })
      setActiveTab('workspace')
    } catch (err) {
      // Error handled safely in mutation toast
    }
  }, [createSessionMutation, setup, selectedResumeId])

  const handleResetSession = useCallback(() => {
    setSelectedSessionId(null)
    setActiveTab('workspace')
    toast.success('Workspace reset to setup configuration mode.')
  }, [setSelectedSessionId])

  const handleQuestionChange = useCallback((newIndex: number) => {
    if (!selectedSessionId) return
    if (newIndex >= 5) {
      endSessionMutation.mutate(selectedSessionId, {
        onSuccess: () => {
          setActiveTab('analysis')
          toast.success('Interview completed! Displaying analysis dashboard.')
        },
      })
    }
  }, [selectedSessionId, endSessionMutation])

  const handleSubmitAnswer = useCallback((answerText: string) => {
    if (!selectedSessionId) {
      toast.error('No active session found. Please start a session first.')
      return
    }

    submitAnswerMutation.mutate(
      { sessionId: selectedSessionId, answer: answerText },
      {
        onSuccess: (data) => {
          if (data?.session?.status === 'COMPLETED' || currentQuestionIndex >= 4) {
            setActiveTab('analysis')
            toast.success('Interview session completed! Displaying analysis overview.')
          }
        },
      }
    )
  }, [selectedSessionId, submitAnswerMutation, currentQuestionIndex])

  const handleTabChange = useCallback((newTab: 'workspace' | 'analysis') => {
    setActiveTab(newTab)
    if (newTab === 'analysis') {
      toast('Switched to Answer Analysis & Feedback Overview', { icon: '📊' })
    } else {
      toast('Switched to Interview Workspace', { icon: '💻' })
    }
  }, [])

  const handleSelectResume = useCallback((id: string) => {
    setSelectedResumeId(id)
    setSetup((prev) => ({ ...prev, resumeId: id }))
    toast.success('Target resume profile updated.')
  }, [setSelectedResumeId])

  const handleRetryError = useCallback(() => {
    setErrorMessage(null)
    resumesQuery.refetch()
    sessionsQuery.refetch()
  }, [setErrorMessage, resumesQuery, sessionsQuery])

  const isLoading = resumesQuery.isLoading || (selectedSessionId && activeSessionQuery.isLoading)

  return (
    <motion.main
      className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Error Banner */}
      {errorMessage && (
        <ErrorState
          title="Backend Notice"
          message={errorMessage}
          onRetry={handleRetryError}
        />
      )}

      {/* 1. Module Header */}
      <motion.section variants={sectionVariants} aria-label="Page Header">
        <InterviewHeader
          resumes={adaptedResumes}
          selectedResumeId={selectedResumeId || setup.resumeId}
          onSelectResume={handleSelectResume}
          sessionState={sessionState}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onStartSession={handleStartSession}
          onResetSession={handleResetSession}
          isCreating={createSessionMutation.isPending}
        />
      </motion.section>

      {/* 2. Loading Skeleton View */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <Skeleton className="h-96 lg:col-span-8 rounded-2xl" />
            <Skeleton className="h-96 lg:col-span-4 rounded-2xl" />
          </div>
        </div>
      ) : (
        <>
          {/* 3. Setup Configuration */}
          {activeTab === 'workspace' && sessionState === 'idle' && (
            <motion.section variants={sectionVariants} aria-label="Interview Setup Configuration">
              <InterviewSetupCard
                resumes={adaptedResumes}
                setupState={setup}
                onSetupChange={setSetup}
                onStartSession={handleStartSession}
                isCreating={createSessionMutation.isPending}
              />
            </motion.section>
          )}

          {/* 4. Main Responsive Workspace or Analysis Dashboard */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {activeTab === 'analysis' ? (
                  <motion.div
                    key="analysis-view"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InterviewAnalysisOverview
                      turns={turns}
                      session={adaptedActiveSession}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="workspace-view"
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <InterviewWorkspace
                      sessionState={sessionState}
                      currentPhase={currentPhase}
                      currentQuestionIndex={currentQuestionIndex}
                      interviewerStatus={submitAnswerMutation.isPending ? 'thinking' : 'ready'}
                      onQuestionChange={handleQuestionChange}
                      onSubmitAnswer={handleSubmitAnswer}
                      onRestartSession={handleResetSession}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column Sidebar */}
            <div className="lg:col-span-4">
              <InterviewSidebar activeTab={activeTab} currentQuestionIndex={currentQuestionIndex} />
            </div>
          </motion.div>
        </>
      )}
    </motion.main>
  )
}
