import type {
  InterviewSessionResponse,
  InterviewTurnResponse,
  InterviewHistory,
  AnswerEvaluationResponse,
  InterviewAnalyticsResponse,
  HistoryAnalyticsResponse,
} from '@/types/interview'

export interface AdaptedResumeOption {
  id: string
  title: string
  updatedAt?: string
}

export interface AdaptedTurn {
  id: string
  sessionId: string
  questionNumber: number
  questionCategory: string
  questionText: string
  answerText: string
  feedback: string
  score: number | null
  createdAt: string
}

export interface AdaptedInterviewSession {
  id: string
  userId: string
  resumeId: string
  companyName: string
  targetRole: string
  interviewType: string
  difficulty: string
  status: 'PENDING' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  totalQuestions: number
  currentQuestion: number
  sessionMetadata: Record<string, any>
  createdAt: string
  updatedAt: string
  turns: AdaptedTurn[]
}

export interface AdaptedHistoryAnalytics {
  totalInterviews: number
  averageOverallScore: number
  averageTechnicalScore: number
  averageCommunicationScore: number
  scoreTrend: { sessionId: string; date: string; score: number }[]
  categoryAverages: Record<string, number>
}

/**
 * Normalizes backend /resumes response safely.
 */
export function adaptBackendResumes(rawResumes: any[] = []): AdaptedResumeOption[] {
  if (!Array.isArray(rawResumes)) return []
  return rawResumes.map((res: any) => ({
    id: String(res?.id ?? res?._id ?? ''),
    title: String(res?.title ?? res?.name ?? 'Untitled Resume'),
    updatedAt: String(res?.updated_at ?? res?.created_at ?? ''),
  }))
}

/**
 * Normalizes a single backend turn response safely.
 */
export function adaptBackendTurn(rawTurn: Partial<InterviewTurnResponse> | null | undefined): AdaptedTurn {
  return {
    id: String(rawTurn?.id ?? ''),
    sessionId: String(rawTurn?.session_id ?? ''),
    questionNumber: Number(rawTurn?.question_number ?? 1),
    questionCategory: String(rawTurn?.question_category ?? 'General Technical'),
    questionText: String(rawTurn?.question_text ?? 'Please describe your relevant experience.'),
    answerText: String(rawTurn?.answer_text ?? ''),
    feedback: String(rawTurn?.feedback ?? ''),
    score: rawTurn?.score !== undefined && rawTurn?.score !== null ? Number(rawTurn.score) : null,
    createdAt: String(rawTurn?.created_at ?? ''),
  }
}

/**
 * Normalizes a single backend session response safely.
 */
export function adaptBackendSession(rawSession: Partial<InterviewSessionResponse> | null | undefined): AdaptedInterviewSession {
  const turnsRaw = Array.isArray(rawSession?.turns) ? rawSession!.turns : []
  const turnsAdapted = turnsRaw.map(adaptBackendTurn)

  return {
    id: String(rawSession?.id ?? ''),
    userId: String(rawSession?.user_id ?? ''),
    resumeId: String(rawSession?.resume_id ?? ''),
    companyName: String(rawSession?.company_name ?? 'Target Company'),
    targetRole: String(rawSession?.target_role ?? 'Senior Engineer'),
    interviewType: String(rawSession?.interview_type ?? 'TECHNICAL'),
    difficulty: String(rawSession?.difficulty ?? 'MEDIUM'),
    status: (rawSession?.status as any) ?? 'PENDING',
    totalQuestions: Number(rawSession?.total_questions ?? 5),
    currentQuestion: Number(rawSession?.current_question ?? 1),
    sessionMetadata: rawSession?.session_metadata ?? {},
    createdAt: String(rawSession?.created_at ?? ''),
    updatedAt: String(rawSession?.updated_at ?? ''),
    turns: turnsAdapted,
  }
}

/**
 * Normalizes sessions history list response safely.
 */
export function adaptBackendHistory(rawHistory: Partial<InterviewHistory> | null | undefined): AdaptedInterviewSession[] {
  const sessionsRaw = Array.isArray(rawHistory?.sessions) ? rawHistory!.sessions : []
  return sessionsRaw.map(adaptBackendSession)
}

/**
 * Normalizes aggregated history analytics response safely.
 */
export function adaptBackendAnalytics(rawAnalytics: Partial<HistoryAnalyticsResponse> | null | undefined): AdaptedHistoryAnalytics {
  const rawTrend = Array.isArray(rawAnalytics?.score_trend) ? rawAnalytics!.score_trend : []

  return {
    totalInterviews: Number(rawAnalytics?.total_interviews ?? 0),
    averageOverallScore: Number(rawAnalytics?.average_overall_score ?? 0),
    averageTechnicalScore: Number(rawAnalytics?.average_technical_score ?? 0),
    averageCommunicationScore: Number(rawAnalytics?.average_communication_score ?? 0),
    scoreTrend: rawTrend.map((t) => ({
      sessionId: String(t?.session_id ?? ''),
      date: String(t?.date ?? ''),
      score: Number(t?.score ?? 0),
    })),
    categoryAverages: rawAnalytics?.category_averages ?? {},
  }
}
