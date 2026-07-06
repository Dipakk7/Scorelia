export interface CoverLetterMetadata {
  ats_score?: number | null
  review_id?: string | null
  rewrite_id?: string | null
  optimization_id?: string | null
  prompt_metadata?: Record<string, any> | null
  interview_context?: Record<string, any> | null
}

export interface CoverLetterRequest {
  resume_id: string
  company_name: string
  job_title: string
  job_description?: string
  writing_style?: string
  generation_mode?: 'STANDARD' | 'FAST' | 'DETAILED'
  experience_level?: 'INTERNSHIP' | 'FRESHER' | 'EXPERIENCED' | 'CAREER_CHANGE' | 'REFERRAL' | 'EXECUTIVE'
  metadata?: CoverLetterMetadata
}

export interface CoverLetterResponse {
  id: string
  user_id: string
  resume_id: string
  company_name: string
  job_title: string
  job_description: string | null
  writing_style: string
  generation_mode: 'STANDARD' | 'FAST' | 'DETAILED'
  generated_content: string | null
  metadata: CoverLetterMetadata | null
  provider: string | null
  model: string | null
  prompt_version: string | null
  created_at: string
  updated_at: string
}

export interface CoverLetterHistory {
  cover_letters: CoverLetterResponse[]
  total: number
}

export interface CategoryScore {
  grammar: number
  professional_tone: number
  readability: number
  ats: number
  keyword_usage: number
  company_alignment: number
  job_alignment: number
  personalization: number
  structure: number
  closing: number
}

export interface QualityScore {
  overall_score: number
  category_scores: CategoryScore
}

export interface OptimizationSuggestion {
  reason: string
  expected_benefit: string
  suggested_improvement: string
  estimated_ats_improvement: number
}

export interface KeywordAnalysis {
  matched_keywords: string[]
  missing_keywords: string[]
  recommended_keywords: string[]
  overused_keywords: string[]
  weak_keywords: string[]
  strong_action_verbs: string[]
}

export interface CompanyAlignment {
  mission_alignment: string
  culture_fit: string
  role_alignment: string
  technical_alignment: string
  industry_language: string
  alignment_confidence: number
}

export interface ModifiedSection {
  from: string
  to: string
}

export interface VersionComparison {
  added_content: string[]
  removed_content: string[]
  modified_sections: ModifiedSection[]
  improvement_summary: string
  estimated_quality_gain: number
}

export interface CoverLetterOptimizationResponse {
  id: string
  user_id: string
  cover_letter_id: string
  quality_score: QualityScore
  keyword_analysis: KeywordAnalysis
  company_alignment: CompanyAlignment
  suggestions: {
    high_priority: OptimizationSuggestion[]
    medium_priority: OptimizationSuggestion[]
    low_priority: OptimizationSuggestion[]
  }
  original_content: string
  optimized_content: string
  version_comparison: VersionComparison
  metadata: {
    prompt_version: string
    model: string
    provider: string
    created_at: string
    latency_ms: number
  }
  created_at: string
  updated_at: string
}

export interface CoverLetterOptimizationRequest {
  cover_letter_id: string
  job_description?: string
  model_override?: string
  bypass_cache?: boolean
}

export interface CoverLetterCompareRequest {
  original_content: string
  optimized_content: string
  improvement_summary?: string
  estimated_quality_gain?: number
}

export interface CoverLetterExportRequest {
  cover_letter_id: string
  template_name?: string
  optimization_id?: string
}

export interface CoverLetterExportResponse {
  id: string
  user_id: string
  cover_letter_id: string
  optimization_id: string | null
  export_format: string
  template_name: string
  file_name: string
  file_size: number
  metadata: Record<string, any> | null
  created_at: string
}

export interface CoverLetterExportListResponse {
  exports: CoverLetterExportResponse[]
  total: number
}
