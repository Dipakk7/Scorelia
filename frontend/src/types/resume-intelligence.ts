export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Recommendation {
  priority: PriorityLevel
  reason: string
  impact: string
  suggested_fix: string
  estimated_benefit: string
}

export interface ResumeSectionReview {
  score: number
  feedback: string
  recommendations: Recommendation[]
}

export interface ReviewMetadata {
  prompt_version: string
  model: string
  provider: string
  created_at: string
  latency_ms: number
  review_version: string
  mode: string
  language: string
}

export interface ResumeReviewResponse {
  id: string
  user_id: string
  resume_id: string
  overall_score: number
  overall_summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: Recommendation[]
  missing_sections: string[]
  grammar_feedback: string
  ats_feedback: string
  technical_feedback: string
  career_feedback: string
  priority_improvements: Recommendation[]
  confidence: number
  sections: Record<string, ResumeSectionReview>
  metadata: ReviewMetadata
  created_at: string
  updated_at: string
}

export type ImprovementCategory =
  | 'Grammar'
  | 'Professional Tone'
  | 'ATS'
  | 'Technical'
  | 'Leadership'
  | 'Communication'
  | 'Impact'

export interface SectionDiff {
  added: string[]
  removed: string[]
  modified: Record<string, string>[]
}

export interface ChangeTracking {
  original: string
  rewritten: string
  reason: string
  improvement_category: ImprovementCategory
  confidence: number
  estimated_ats_improvement: number
  diff?: SectionDiff
}

export interface RewriteQualityScore {
  readability_improvement: number
  grammar_improvement: number
  professional_tone: number
  ats_optimization: number
  action_verb_score: number
}

export interface KeywordOptimization {
  matched_keywords: string[]
  added_keywords: string[]
  missing_keywords: string[]
}

export interface RewriteMetadata {
  prompt_version: string
  model: string
  provider: string
  created_at: string
  latency_ms: number
  mode: string
  job_description?: string
}

export interface ResumeRewriteResponse {
  id: string
  user_id: string
  resume_id: string
  parent_id?: string
  original_content: Record<string, any>
  rewritten_content: Record<string, any>
  rewrite_mode: string
  job_description?: string
  change_tracking: Record<string, ChangeTracking>
  quality_scores: RewriteQualityScore
  keyword_optimization?: KeywordOptimization
  metadata: RewriteMetadata
  created_at: string
  updated_at: string
}

export interface ResumeQualityScore {
  overall_score: number
  ats: number
  technical_skills: number
  experience: number
  projects: number
  grammar: number
  formatting: number
  readability: number
  leadership: number
  professionalism: number
  career_readiness: number
  completeness: number
  consistency: number
}

export interface MissingSkillDetail {
  skill: string
  why_it_matters: string
  priority: string
  difficulty: string
  estimated_time: string
  resources: string[]
}

export interface ATSOptimizationDetail {
  current_score: number
  why_score_is_low: string
  missing_keywords: string[]
  sections_needing_improvement: string[]
  expected_improvement: number
}

export interface KeywordAnalysis {
  matched_keywords: string[]
  missing_keywords: string[]
  recommended_keywords: string[]
  overused_keywords: string[]
  weak_keywords: string[]
  strong_action_verbs: string[]
  industry_keywords: string[]
}

export interface AchievementOptimizationDetail {
  original_bullet: string
  suggested_bullet: string
  reason: string
  missing_metrics: boolean
  missing_impact: boolean
  missing_business_value: boolean
  estimated_improvement: string
}

export interface ResumeCompleteness {
  percentage: number
  missing_sections: string[]
  evaluated_sections: Record<string, boolean>
}

export interface CareerReadinessDetail {
  ready: boolean
  reasoning: string
}

export interface CareerReadiness {
  internship_ready: CareerReadinessDetail
  entry_level_ready: CareerReadinessDetail
  mid_level_ready: CareerReadinessDetail
  senior_ready: CareerReadinessDetail
}

export interface IndustryAlignmentDetail {
  industry: string
  confidence: number
}

export interface OptimizationRecommendation {
  section: string
  type: string
  original_text?: string
  suggested_text?: string
  reason: string
  impact: string
  priority: string
  estimated_improvement: string
  difficulty: string
}

export interface OptimizationMetadata {
  prompt_version: string
  model: string
  provider: string
  created_at: string
  latency_ms: number
  mode: string
}

export interface ResumeOptimizationResponse {
  id: string
  user_id: string
  resume_id: string
  quality_score: ResumeQualityScore
  missing_skills: MissingSkillDetail[]
  ats_optimization: ATSOptimizationDetail
  keyword_optimization: KeywordAnalysis
  achievement_optimization: AchievementOptimizationDetail[]
  completeness: ResumeCompleteness
  career_readiness: CareerReadiness
  industry_alignment: IndustryAlignmentDetail[]
  recommendations: OptimizationRecommendation[]
  metadata: OptimizationMetadata
  created_at: string
  updated_at: string
}

export interface ResumeWorkflowResponse {
  resume_id: string
  stages: Record<string, string>
  quality_score?: number
  optimization_id?: string
  review_id?: string
  rewrite_id?: string
  created_at: string
}

export interface TimelineItem {
  id: string
  type: 'original' | 'review' | 'rewrite' | 'optimization'
  title: string
  timestamp: string
  score?: number
  subtitle?: string
  rawItem: any
}
