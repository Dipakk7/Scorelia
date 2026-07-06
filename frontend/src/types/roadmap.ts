export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD'
export type RoadmapStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
export type MilestoneStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type LearningPriority = 'HIGH' | 'MEDIUM' | 'LOW'

export interface MilestoneResponse {
  id: string
  roadmap_id: string
  phase_number: number
  title: string
  description?: string
  duration?: string
  order_index: number
  status: MilestoneStatus
  created_at: string
  updated_at: string
}

export interface LearningRecommendationResponse {
  id: string
  roadmap_id: string
  category: string
  title: string
  description?: string
  priority: LearningPriority
  resource_url?: string
  estimated_hours?: number
  created_at: string
  updated_at: string
}

export interface RoadmapResponse {
  id: string
  user_id: string
  resume_id?: string
  target_role: string
  current_role?: string
  experience_level: ExperienceLevel
  target_industry?: string
  roadmap_status: RoadmapStatus
  estimated_duration_months: number
  current_readiness_score: number
  roadmap_metadata?: any
  created_at: string
  updated_at: string
  milestones: MilestoneResponse[]
  recommendations: LearningRecommendationResponse[]
}

export interface RoadmapHistory {
  roadmaps: RoadmapResponse[]
  total: number
}

export interface AISkillGapItem {
  skill: string
  gap_severity: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW'
  remediation_action: string
}

export interface AISkillGapResponse {
  target_role: string
  readiness_score: number
  technical_gaps: AISkillGapItem[]
  soft_skill_gaps: AISkillGapItem[]
  domain_knowledge_gaps: AISkillGapItem[]
  tool_gaps: AISkillGapItem[]
  framework_gaps: AISkillGapItem[]
  communication_gaps: AISkillGapItem[]
  confidence_gaps: AISkillGapItem[]
}

export interface AILearningRecommendation {
  recommendation_id: number
  title: string
  category: string
  priority: 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW'
  estimated_hours: number
  difficulty: string
  reason: string
  learning_resources: string[]
  practice_projects: string[]
  success_criteria: string[]
  career_impact: string
}

export interface AIWeeklyPlanDay {
  day: string
  focus: string
  tasks: string[]
}

export interface AIWeeklyPlanItem {
  week_number: number
  topic: string
  focus: string
  objectives: string[]
  schedule: AIWeeklyPlanDay[]
}

export interface AILearningPlanResponse {
  weekly_plan: AIWeeklyPlanItem[]
  monthly_goals: string[]
  quarterly_goals: string[]
  practice_schedule: string[]
  certification_suggestions: string[]
  books: string[]
  courses: string[]
  hands_on_projects: string[]
  open_source_contributions: string[]
  interview_practice: string[]
  recommendations: AILearningRecommendation[]
}

export interface AIMilestone {
  id: string
  title: string
  description?: string
  start_week: number
  end_week: number
  estimated_hours: number
  prerequisite_skills: string[]
  expected_outcome: string
  completion_status: MilestoneStatus
}

export interface AIWeeklyGoal {
  week_number: number
  goal: string
  tasks: string[]
}

export interface AIMonthlyMilestone {
  month_number: number
  milestone: string
}

export interface AIQuarterlyObjective {
  quarter_number: number
  objective: string
}

export interface AITimelineResponse {
  roadmap_id: string
  weekly_goals: AIWeeklyGoal[]
  monthly_milestones: AIMonthlyMilestone[]
  quarterly_objectives: AIQuarterlyObjective[]
  estimated_completion_date: string
  time_estimates: string
  dependencies: string[]
  priority_ordering: string[]
  milestones: AIMilestone[]
}

export interface CareerReadinessRecommendation {
  category: string
  recommendation: string
}

export interface CareerReadinessBreakdown {
  resume_review?: number
  resume_optimization?: number
  ats_score?: number
  interview_readiness?: number
  skill_gap?: number
  github_readiness?: number
  learning_completion?: number
}

export interface CareerReadinessResponse {
  overall_score: number
  breakdown: CareerReadinessBreakdown
  recommendations: CareerReadinessRecommendation[]
}

export interface ProgressDelayStatus {
  is_delayed: boolean
  delay_weeks: number
  delay_severity: string
}

export interface ProgressIntervalItem {
  total_items: number
  completed_items: number
  completion_percentage: number
  status: string
}

export interface ProgressIntervalBreakdown {
  weekly: Record<number, ProgressIntervalItem>
  monthly: Record<number, ProgressIntervalItem>
  quarterly: Record<number, ProgressIntervalItem>
  yearly: Record<number, ProgressIntervalItem>
}

export interface ProgressResponse {
  roadmap_id: string
  completion_percentage: number
  velocity_percentage_per_week: number
  expected_progress_percentage: number
  estimated_completion_date?: string
  remaining_weeks: number
  delay_status: ProgressDelayStatus
  breakdown: ProgressIntervalBreakdown
}

export interface SkillAnalyticsResponse {
  roadmap_id: string
  skills_completed: string[]
  skills_remaining: string[]
  skills_in_progress: string[]
  top_missing_skills: string[]
  top_strong_skills: string[]
  learning_velocity_skills_per_week: number
  difficulty_distribution: Record<string, number>
  category_distribution: Record<string, number>
}

export interface TimelineAnalyticsResponse {
  roadmap_id: string
  upcoming_milestones: MilestoneResponse[]
  overdue_milestones: MilestoneResponse[]
  completed_milestones: MilestoneResponse[]
  current_week: number
  current_month: number
  expected_completion_date?: string
  timeline_health: string
}

export interface DashboardMetricsResponse {
  overall_progress: number
  roadmap_completion_percentage: number
  completed_milestones_count: number
  remaining_milestones_count: number
  completed_learning_hours: number
  remaining_learning_hours: number
  current_readiness_score: number
  ats_readiness?: number
  interview_readiness?: number
  github_readiness?: number
  skill_coverage_percentage: number
  certification_progress_percentage: number
  timeline_progress_percentage: number
  estimated_remaining_weeks: number
  average_weekly_learning_hours: number
  current_career_level: string
  target_career_level: string
}

export interface RoadmapAnalyticsResponse {
  roadmap_id: string
  metrics: DashboardMetricsResponse
  progress: ProgressResponse
  readiness: CareerReadinessResponse
  skills: SkillAnalyticsResponse
  timeline: TimelineAnalyticsResponse
}
