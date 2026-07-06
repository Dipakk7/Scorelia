export interface InterviewSessionCreate {
  resume_id?: string | null
  job_id?: string | null
  company_name?: string
  target_role?: string
  interview_type?: 'BEHAVIORAL' | 'TECHNICAL' | 'FIT' | 'HR' | 'SYSTEM_DESIGN' | 'RESUME_BASED' | 'MIXED'
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'ADAPTIVE'
  total_questions?: number
  session_metadata?: Record<string, any>
}

export interface InterviewTurnResponse {
  id: string
  session_id: string
  question_number: number
  question_category: string | null
  question_text: string
  answer_text: string | null
  feedback: string | null
  score: number | null
  created_at: string
  updated_at: string
}

export interface InterviewSessionResponse {
  id: string
  user_id: string
  resume_id: string | null
  job_id: string | null
  company_name: string | null
  target_role: string | null
  interview_type: string
  difficulty: string
  status: 'PENDING' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'
  total_questions: number
  current_question: number
  provider: string | null
  model: string | null
  prompt_version: string | null
  session_metadata: Record<string, any> | null
  created_at: string
  updated_at: string
  turns: InterviewTurnResponse[]
}

export interface InterviewHistory {
  sessions: InterviewSessionResponse[]
  total: number
}

export interface AnswerSubmitRequest {
  answer: string
}

export interface AdHocEvaluationRequest {
  question: string
  answer: string
  interview_type?: string
  difficulty?: string
  role?: string
  company?: string
  expected_topics?: string[]
}

export interface AnswerEvaluationResponse {
  overall_score: number
  technical_score: number
  communication_score: number
  grammar_score: number
  confidence_score: number
  professionalism_score: number
  star_score: number
  strengths: string[]
  weaknesses: string[]
  missing_topics: string[]
  improvements: string[]
  followup_questions: string[]
  summary: string
}

export interface TrendAnalysis {
  performance_trend: number[]
  difficulty_trend: string[]
  communication_trend: number[]
  confidence_trend: number[]
  star_trend: number[]
  response_time_trend: number[]
  session_comparison: Record<string, any> | null
  skill_improvement_trend: Record<string, any> | null
}

export interface SkillGapAnalysis {
  strong_skills: string[]
  weak_skills: string[]
  missing_topics: string[]
  repeated_mistakes: string[]
  knowledge_gaps: string[]
  behavioral_weaknesses: string[]
  technical_weaknesses: string[]
  communication_issues: string[]
  improvement_priorities: string[]
}

export interface Recommendations {
  learning_recommendations: string[]
  practice_topics: string[]
  suggested_projects: string[]
  certification_suggestions: string[]
  interview_tips: string[]
  resume_improvement_suggestions: string[]
  cover_letter_suggestions: string[]
  career_guidance: string[]
}

export interface SessionStatistics {
  overall_score: number
  technical_score: number
  behavioral_score: number
  hr_score: number
  communication_score: number
  grammar_score: number
  confidence_score: number
  professionalism_score: number
  problem_solving_score: number
  star_score: number
  question_accuracy: number
  average_response_time: number
  session_completion_rate: number
  difficulty_progression: string[]
  question_category_distribution: Record<string, number>
  follow_up_question_rate: number
}

export interface ResponseTimeAnalysis {
  average_response_time: number
  response_time_trend: number[]
  total_duration_seconds: number | null
  total_paused_seconds: number
}

export interface InterviewAnalyticsResponse {
  session_id: string
  overall_score: number
  category_scores: Record<string, number>
  trend_analysis: TrendAnalysis
  skill_gap_analysis: SkillGapAnalysis
  recommendations: Recommendations
  session_statistics: SessionStatistics
  difficulty_progression: string[]
  response_time_analysis: ResponseTimeAnalysis
  strengths: string[]
  weaknesses: string[]
  improvement_plan: string[]
  summary: string
}

export interface HistoryAnalyticsResponse {
  total_interviews: number
  average_overall_score: number
  average_technical_score: number
  average_communication_score: number
  average_star_score: number
  average_confidence_score: number
  score_trend: { session_id: string; date: string; score: number }[]
  category_averages: Record<string, number>
  weekly_completion_count: Record<string, number>
  monthly_completion_count: Record<string, number>
}
