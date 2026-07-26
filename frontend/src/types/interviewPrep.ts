import React from 'react'

export interface DashboardMetric {
  id: string
  title: string
  value: string | number
  unit?: string
  subtext?: string
  trend?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  badge?: string
  badgeVariant?: 'success' | 'warning' | 'orange' | 'info'
  gaugeScore?: number
  readinessTag?: string
  candidatePercentile?: string
  sparklinePoints?: number[]
}

export interface UpcomingInterview {
  id: string
  dateMonth: string
  dateDay: number | string
  title: string
  companyName: string
  companyLogo?: string
  durationMinutes: number
  interviewType: string
  scheduleTimeText: string
  isTomorrow?: boolean
  countdownText?: string
}

export interface RecommendationItem {
  id: string
  title: string
  roleMatchPercent?: number
  skillMatchPercent?: number
  badgeText: string
  badgeVariant: 'success' | 'warning' | 'info'
  iconName: string
  description: string
  currentPracticed: number
  totalQuestions: number
  totalTimeMinutes?: number
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  isBookmarked?: boolean
}

export interface PracticeTopicItem {
  id: string
  title: string
  totalQuestions: number
  completionPercent?: number
  priority: '+ High' | 'Medium' | 'Low'
  priorityVariant: 'high' | 'medium' | 'low'
  estimatedTimeMinutes?: number
  iconName: string
  colorTheme: string
}

export interface DifficultyBreakdownItem {
  id: 'easy' | 'medium' | 'hard'
  label: 'Easy' | 'Medium' | 'Hard'
  questionCount: number
  avgScorePercent: number
  accentColor: 'emerald' | 'amber' | 'rose'
}

export interface LibraryStatItem {
  title: string
  value: string
  iconName: string
}

export interface QuestionBankStats {
  difficulties: DifficultyBreakdownItem[]
  libraryStats: LibraryStatItem[]
}

export interface CoreSkillProgress {
  label: string
  percentage: number
  iconName: string
}

export interface RecentPerformanceItem {
  id: string
  title: string
  date: string
  scorePercent: number
  scoreTag?: string
}

export interface AIAssistantConfig {
  assistantName: string
  status: 'Online' | 'Offline'
  greeting: string
  quickPrompts: string[]
  coreSkills: CoreSkillProgress[]
  recentPerformance: RecentPerformanceItem[]
}

export interface InterviewPrepOverviewData {
  metrics: DashboardMetric[]
  upcomingInterview: UpcomingInterview
  recommendations: RecommendationItem[]
  practiceTopics: PracticeTopicItem[]
  questionBankStats: QuestionBankStats
  aiSidebarData: AIAssistantConfig
}

/* Phase 3 — Mock Interviews Types */

export interface ResumeOption {
  id: string
  fileName: string
  roleTarget: string
  lastUpdated: string
  isDefault?: boolean
}

export interface DifficultyOption {
  id: 'easy' | 'medium' | 'hard' | 'adaptive'
  label: string
  description: string
  badgeVariant: 'emerald' | 'amber' | 'rose' | 'purple'
}

export interface InterviewTypeOption {
  id: 'technical' | 'hr' | 'behavioral' | 'mixed'
  label: string
  description: string
  iconName: string
}

export interface InterviewModeOption {
  id: 'voice' | 'text' | 'mixed'
  label: string
  description: string
  iconName: string
}

export interface MockInterviewSetupConfig {
  resumeId: string
  targetRole: string
  companyName?: string
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead'
  durationMinutes: number
  interviewType: 'technical' | 'hr' | 'behavioral' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive'
  mode: 'voice' | 'text' | 'mixed'
}

export interface MockInterviewHistoryItem {
  id: string
  date: string
  company: string
  role: string
  interviewType: string
  durationMinutes: number
  scorePercent: number
  status: 'Completed' | 'In Progress' | 'Cancelled'
}

/* Phase 4 — Question Bank & Practice Types */

export interface QuestionCategory {
  id: string
  label: string
  iconName: string
  totalQuestions: number
  completionPercent: number
}

export interface QuestionBankItem {
  id: string
  title: string
  categoryId: string
  categoryLabel: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  questionType: 'Technical' | 'Behavioral' | 'HR' | 'Coding' | 'System Design'
  experienceLevel: 'Fresher' | 'Junior' | 'Mid' | 'Senior'
  estimatedTimeMinutes: number
  companyTags: string[]
  roleTags: string[]
  shortDescription: string
  hints: string[]
  expectedDurationText: string
  skillsTested: string[]
  learningObjectives: string[]
  isBookmarked?: boolean
  isCompleted?: boolean
  isFavorite?: boolean
}

export interface QuestionBankFilterState {
  searchQuery: string
  categoryId: string
  difficulty: string
  questionType: string
  experience: string
  company: string
  tag: string
}

export interface PracticeSummaryData {
  totalAvailable: number
  totalCompleted: number
  totalBookmarked: number
  avgPracticeScore: number
  recommendedNextTopic: string
}

export interface RecentlyPracticedQuestionItem {
  id: string
  questionTitle: string
  categoryLabel: string
  completionDate: string
  practiceScorePercent: number
}

/* Phase 5 — My Answers & Feedback Types */

export interface AnswerHistoryItem {
  id: string
  questionTitle: string
  categoryLabel: string
  companyName: string
  attemptDate: string
  scorePercent: number
  durationText: string
  attemptNumber: number
  source: 'Mock Interview' | 'Question Bank'
  isBookmarked?: boolean
  isFavorite?: boolean
  difficulty: 'Easy' | 'Medium' | 'Hard'
  resultTag: 'Excellent' | 'Good' | 'Needs Improvement'
}

export interface AIFeedbackBreakdown {
  overallRatingPercent: number
  strengths: string[]
  areasToImprove: string[]
  communicationScore: number
  technicalAccuracyScore: number
  problemSolvingScore: number
  confidenceScore: number
  clarityScore: number
  starStructureScore: number
}

export interface AnswerDetailData {
  id: string
  questionTitle: string
  userAnswerText: string
  expectedAnswerText: string
  keySkillsTested: string[]
  difficulty: string
  durationText: string
  interviewSource: string
  attemptDate: string
  statusBadge: string
  feedback: AIFeedbackBreakdown
}

export interface AnswerSummaryData {
  totalAnswers: number
  avgScorePercent: number
  bestAnswerTitle: string
  needsImprovementCount: number
  feedbackGeneratedCount: number
  improvementTrend: string
}

export interface ImprovementSuggestionData {
  recommendedPracticeTopic: string
  suggestedTopics: string[]
  recommendedInterviewRound: string
  recommendedQuestionSet: string
  estimatedImprovementTimeText: string
  nextGoalText: string
}

export interface RecentAttemptItem {
  id: string
  questionTitle: string
  scorePercent: number
  attemptDate: string
  improvementPercent: number
}

export interface AnswerFilterState {
  searchQuery: string
  source: string
  questionType: string
  difficulty: string
  result: string
}

/* Phase 6 — Performance & Analytics Types */

export interface AnalyticsSummaryCardItem {
  id: string
  title: string
  value: string | number
  unit?: string
  trendText?: string
  trendType?: 'positive' | 'negative' | 'neutral'
  badgeText?: string
  iconName: string
}

export interface PerformanceTrendPoint {
  label: string
  score: number
  targetScore: number
  mockCount: number
}

export interface SkillBreakdownItem {
  skillName: string
  scorePercent: number
  trendText: string
  proficiencyBadge: 'Expert' | 'Advanced' | 'Intermediate' | 'Improving'
  category: 'Machine Learning' | 'Engineering' | 'Soft Skills' | 'Databases'
}

export interface InterviewHistoryTrendItem {
  monthLabel: string
  attemptsCount: number
  avgDurationMin: number
  successPercent: number
}

export interface StrengthWeaknessItem {
  title: string
  skill: string
  score: number
}

export interface StrengthWeaknessData {
  strengths: StrengthWeaknessItem[]
  weaknesses: StrengthWeaknessItem[]
}

export interface ProgressTimelineEvent {
  id: string
  date: string
  type: 'Mock Interview' | 'Question Bank Milestone' | 'Streak Milestone' | 'Score Achievement'
  title: string
  description: string
  badgeText: string
}

export interface GoalTrackerData {
  currentGoalTitle: string
  progressPercent: number
  targetScorePercent: number
  estimatedCompletionDate: string
  nextObjectiveTitle: string
  dailyStreakDays: number
}

export interface RecommendationInsightData {
  recommendedSkills: string[]
  suggestedInterviewType: string
  suggestedPracticeTopics: string[]
  weeklyFocusText: string
  estimatedReadinessGainText: string
}

export interface AchievementBadgeItem {
  id: string
  title: string
  iconName: string
  dateEarned: string
}

export interface PerformanceSidebarData {
  quickStats: Array<{ label: string; value: string }>
  weeklyHighlights: string[]
  bestPerformanceTitle: string
  bestPerformanceScore: number
  areasRequiringAttention: string[]
  achievementBadges: AchievementBadgeItem[]
}

export interface PerformanceWorkspaceData {
  summaryCards: AnalyticsSummaryCardItem[]
  readinessGaugeScore: number
  readinessTag: string
  trendPoints: PerformanceTrendPoint[]
  skillBreakdown: SkillBreakdownItem[]
  historyTrends: InterviewHistoryTrendItem[]
  strengthsWeaknesses: StrengthWeaknessData
  timelineEvents: ProgressTimelineEvent[]
  goalTracker: GoalTrackerData
  recommendationInsights: RecommendationInsightData
  performanceSidebar: PerformanceSidebarData
}

/* Phase 7 — Interview Copilot Types */

export interface CopilotChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  codeSnippet?: {
    language: string
    code: string
  }
  bulletPoints?: string[]
  timestamp: string
  avatarUrl?: string
}

export interface SuggestedPromptItem {
  id: string
  label: string
  promptText: string
  category: 'Technical' | 'Behavioral' | 'System Design' | 'Coding'
}

export interface ResumeContextData {
  fileName: string
  roleTarget: string
  skillsDetected: string[]
  experienceYears: number
  topProjects: string[]
}

export interface JobContextData {
  targetCompany: string
  roleTitle: string
  requiredSkills: string[]
  interviewType: string
  difficultyLevel: string
}

export interface STARCoachData {
  situation: string
  task: string
  action: string
  result: string
  checklist: Array<{ item: string; completed: boolean }>
  starScorePercent: number
  suggestions: string[]
}

export interface CodingAssistantData {
  language: string
  difficulty: string
  practiceTopics: string[]
  timeComplexityTip: string
  spaceComplexityTip: string
  bestPractices: string[]
}

export interface CopilotSidebarData {
  quickStats: Array<{ label: string; value: string }>
  recentConversations: Array<{ id: string; title: string; date: string }>
  todayGoalText: string
  streakDays: number
  aiSuggestions: string[]
  pinnedTopics: string[]
}

export interface InterviewCopilotWorkspaceData {
  messages: CopilotChatMessage[]
  suggestedPrompts: SuggestedPromptItem[]
  resumeContext: ResumeContextData
  jobContext: JobContextData
  starCoach: STARCoachData
  codingAssistant: CodingAssistantData
  sidebarData: CopilotSidebarData
}

/* Phase 9 — Reports, Export & UX Polish Types */

export interface InterviewReportSummary {
  overallReadinessScore: number
  overallScorePercent: number
  interviewCount: number
  questionCount: number
  avgAccuracyPercent: number
  strongestSkill: string
  weakestSkill: string
  totalPracticeTimeHours: number
}

export interface InterviewReportDetails {
  reportId: string
  generatedDate: string
  reportType: 'Overall' | 'Mock' | 'Question Practice' | 'Performance' | 'Skill Assessment' | 'Readiness'
  title: string
  summaryText: string
  keyHighlights: string[]
}

export interface ExportFormatOption {
  format: 'PDF' | 'DOCX' | 'Markdown' | 'JSON' | 'CSV' | 'Print'
  label: string
  isAvailable: boolean
  tooltipMessage?: string
}

export interface ReportTimelineItem {
  id: string
  date: string
  title: string
  category: 'Practice' | 'Mock Interview' | 'Milestone' | 'Report Generated'
  scoreBadge?: string
}

export interface ReportsWorkspaceData {
  summary: InterviewReportSummary
  availableReports: InterviewReportDetails[]
  exportFormats: ExportFormatOption[]
  timeline: ReportTimelineItem[]
}
