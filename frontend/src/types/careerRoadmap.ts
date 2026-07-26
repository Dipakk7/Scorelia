export type KPICardAccent = 'purple' | 'blue' | 'cyan' | 'emerald' | 'amber'

export type KPIIconType = 'briefcase' | 'graduationCap' | 'clock' | 'progressRing' | 'trendingUp'

export type PhaseStatus = 'completed' | 'in-progress' | 'upcoming' | 'planned'

export type TimelineViewMode = 'timeline' | 'board'

export interface KPICardData {
  id: string
  label: string
  value: string
  subtext: string
  accentColor: KPICardAccent
  iconType: KPIIconType
  actionable?: boolean
  actionText?: string
  progressValue?: number
}

export interface CareerRoadmapHeroData {
  title: string
  subtitle: string
  lastUpdated: string
  kpis: KPICardData[]
}

export interface ChecklistItemData {
  id: string
  title: string
  status: 'completed' | 'current' | 'locked'
}

export interface RoadmapPhase {
  id: string
  phaseNumber: number
  title: string
  months: string
  progress: number
  status: PhaseStatus
  description: string
  learningObjectives: string[]
  checklist: ChecklistItemData[]
  estimatedHours: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  skillTags: string[]
  accentColor: KPICardAccent
}

export interface RecommendedStepData {
  id: string
  type: string
  title: string
  subtitle: string
  meta: string
  estimatedTime: string
  difficulty: string
  action: string
  btnVariant: 'primary' | 'outline'
  tagBg: string
}

export type MessageSender = 'user' | 'assistant' | 'system'

export interface ChatMessageData {
  id: string
  sender: MessageSender
  text: string
  timestamp: string
  codeSnippet?: string
  bulletPoints?: string[]
}

export interface CareerInsightData {
  readinessScore: number
  strongestSkill: string
  weakestSkill: string
  estimatedTimeline: string
  focusArea: string
  learningVelocity: string
}

export interface RecommendedActionData {
  id: string
  title: string
  category: string
  iconName: string
  actionText: string
}

export interface SessionSummaryData {
  todayFocus: string
  goalsDiscussed: string[]
  aiSuggestionsCount: number
  completedTopicsCount: number
  sessionDuration: string
}

export interface SkillsOverviewData {
  overallReadiness: number
  gapScore: number
  completedSkillsCount: number
  totalSkillsCount: number
  marketAlignment: string
}

export interface SkillCategoryItem {
  id: string
  name: string
  completion: number
  status: 'completed' | 'in-progress' | 'missing'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  iconName: string
  accentColor: KPICardAccent
}

export interface MissingSkillItem {
  id: string
  name: string
  priority: 'Critical' | 'High' | 'Medium'
  estimatedHours: string
  recommendedTimeline: string
  category: string
}

export interface PriorityMatrixItem {
  id: string
  name: string
  impact: 'High' | 'Low'
  effort: 'High' | 'Low'
  quadrant: 'quick-wins' | 'strategic' | 'fill-ins' | 'reevaluate'
  category: string
}

export interface MarketDemandData {
  demandLevel: 'Very High' | 'High' | 'Moderate'
  hiringTrend: string
  yoyGrowth: string
  topHiringSkills: string[]
  salaryRange: string
  industryGrowth: string
}

export interface CertificationItem {
  id: string
  title: string
  provider: string
  estimatedDuration: string
  difficulty: string
  priority: 'High' | 'Medium' | 'Recommended'
  actionText: string
}

export interface LearningPathStep {
  stepNumber: number
  title: string
  status: 'completed' | 'current' | 'upcoming'
  description: string
}

export interface MilestonesOverviewData {
  completedMilestones: number
  upcomingMilestones: number
  currentStreakDays: number
  overallCompletionPercentage: number
}

export interface GoalTrackerData {
  currentGoal: string
  targetCompletionQuarter: string
  goalHealth: string
  weeklyProgressPercentage: number
  weeklyTasksDone: number
  weeklyTasksTotal: number
  monthlyProgressPercentage: number
  monthlyTopicsDone: number
  monthlyTopicsTotal: number
}

export interface MilestoneItem {
  id: string
  title: string
  phaseName: string
  targetDate: string
  status: PhaseStatus
  progress: number
  description: string
  priority: 'Critical' | 'High' | 'Medium'
  estimatedEffort: string
  iconName: string
}

export interface UpcomingMilestoneItem {
  id: string
  title: string
  dueDate: string
  daysRemaining: number
  priority: 'Critical' | 'High' | 'Medium'
  progress: number
}

export interface AchievementItem {
  id: string
  title: string
  unlockDate: string
  description: string
  iconName: string
  badgeRibbon: string
}

export interface NextStepPlannerItem {
  id: string
  title: string
  category: string
  estimatedDuration: string
  priority: 'Critical' | 'High' | 'Medium'
  actionText: string
  iconName: string
}

export interface ProgressHistoryItem {
  id: string
  title: string
  description: string
  timestamp: string
  eventType: 'completed' | 'started' | 'milestone' | 'analysis'
}

export interface ProductivityInsightData {
  learningConsistencyPercentage: number
  avgStudyHoursPerDay: number
  tasksCompletedTotal: number
  weeklyTrendPercentage: string
  longestStreakDays: number
  mostProductiveDay: string
}
