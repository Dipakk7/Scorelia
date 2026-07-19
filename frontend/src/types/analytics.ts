export interface DashboardSummaryData {
  total_users: number
  total_resumes: number
  parsed_resumes: number
  total_job_matches: number
  average_ats_score: number
  average_match_score: number
  latest_resume: {
    id: string
    original_filename: string
    uploaded_at: string
    status: string
    ats_score: number | null
  } | null
  latest_job_match: {
    resume_id: string
    timestamp: string
    overall_score: number
    grade: string
    job_title: string
    company: string
  } | null
  skill_gap_count: number
  interview_sessions: number
  career_progress: number
  cover_letters_generated: number
  ai_usage: number
}

export interface ProfileStatsData {
  resume_count: number
  ats_average: number
  interview_score: number
  career_progress: number
}

export interface ResumeOverviewAnalytics {
  total_resumes: number
  parsed_resumes: number
  unparsed_resumes: number
  parsing_success_rate: number
  average_resume_length: number
  oldest_resume: { original_filename: string; uploaded_at: string } | null
  newest_resume: { original_filename: string; uploaded_at: string } | null
  resumes_uploaded_this_week: number
  resumes_uploaded_this_month: number
}

export interface ResumeSkillsAnalytics {
  top_skills: string[]
  total_unique_skills: number
  most_common_skill: string
  skill_frequency: Record<string, number>
}

export interface ResumeExperienceAnalytics {
  average_years_experience: number
  experience_distribution: Record<string, number>
}

export interface ResumeEducationAnalytics {
  education_distribution: Record<string, number>
}

export interface ResumeTimelineAnalytics {
  daily: Record<string, number>
  weekly: Record<string, number>
  monthly: Record<string, number>
}

export interface ResumeAnalyticsData {
  overview: ResumeOverviewAnalytics
  skills: ResumeSkillsAnalytics
  experience: ResumeExperienceAnalytics
  education: ResumeEducationAnalytics
  timeline: ResumeTimelineAnalytics
}

export interface ATSOverviewAnalytics {
  total_ats_evaluations: number
  average_ats_score: number
  highest_ats_score: number
  lowest_ats_score: number
  median_ats_score: number
}

export interface ATSGradeDistributionItem {
  count: number
  percentage: number
}

export interface ATSGradeDistribution {
  Excellent: ATSGradeDistributionItem
  Good: ATSGradeDistributionItem
  Fair: ATSGradeDistributionItem
  Needs_Improvement: ATSGradeDistributionItem
}

export interface ATSCategoryBreakdownItem {
  average: number
  weight: number
  count: number
}

export interface ATSCategoryBreakdown {
  contact: ATSCategoryBreakdownItem
  skills: ATSCategoryBreakdownItem
  education: ATSCategoryBreakdownItem
  experience: ATSCategoryBreakdownItem
  projects: ATSCategoryBreakdownItem
  certifications: ATSCategoryBreakdownItem
}

export interface ATSTrendItem {
  date: string
  score: number
}

export interface ATSTrendAnalytics {
  score_trend: ATSTrendItem[]
  improvement_rate: number
}

export interface ATSInsightItem {
  label: string
  value: number
}

export interface ATSWeaknessInsights {
  top_weaknesses: ATSInsightItem[]
  top_recommendations: ATSInsightItem[]
}

export interface ATSAnalyticsData {
  overview: ATSOverviewAnalytics
  grade_distribution: ATSGradeDistribution
  category_breakdown: ATSCategoryBreakdown
  trend: ATSTrendAnalytics
  weaknesses: ATSWeaknessInsights
}

export interface JobOverviewAnalytics {
  total_job_matches: number
  average_match_score: number
  highest_match_score: number
  lowest_match_score: number
  median_match_score: number
}

export interface JobDistributionItem {
  count: number
  percentage: number
}

export interface JobDistribution {
  '90–100%': JobDistributionItem
  '80–89%': JobDistributionItem
  '70–79%': JobDistributionItem
  '60–69%': JobDistributionItem
  'Below 60%': JobDistributionItem
}

export interface JobMissingSkillItem {
  label: string
  value: number
}

export interface JobSkillGapAnalytics {
  top_missing_skills: JobMissingSkillItem[]
  missing_skill_frequency: Record<string, number>
  total_unique_missing_skills: number
}

export interface JobTrendItem {
  date: string
  score: number
}

export interface JobTrendAnalytics {
  score_trend: JobTrendItem[]
}

export interface JobRecommendationItem {
  label: string
  value: number
}

export interface JobRecommendationsAnalytics {
  top_recommendations: JobRecommendationItem[]
}

export interface JobLatestMatch {
  resume_id: string
  timestamp: string
  overall_score: number
  grade: string
  job_title: string
  company: string
}

export interface JobHistoryAnalytics {
  total_matches: number
  latest_match: JobLatestMatch | null
  average_matches_per_resume: number
  repeated_job_descriptions: number
  historical_match_growth: number
}

export interface JobAnalyticsData {
  overview: JobOverviewAnalytics
  distribution: JobDistribution
  skill_gaps: JobSkillGapAnalytics
  trend: JobTrendAnalytics
  recommendations: JobRecommendationsAnalytics
  history: JobHistoryAnalytics
}

export interface GitHubProfileInfo {
  username: string
  name: string | null
  bio: string | null
  avatar_url: string
  followers: number
  following: number
  public_repos_count: number
  account_created_at: string
  account_age_years: number
}

export interface GitHubRepositorySummary {
  total_repos: number
  total_stars: number
  total_forks: number
  average_stars_per_repo: number
  most_starred_repo: { name: string; stars: number; url: string } | null
  top_repositories: { name: string; description: string | null; stars: number; forks: number; url: string }[]
}

export interface GitHubAnalyticsData {
  profile: GitHubProfileInfo
  repository_summary: GitHubRepositorySummary
}

export interface GitHubLanguageDistributionItem {
  label: string
  value: number
}

export interface GitHubLanguagesAnalytics {
  top_languages: GitHubLanguageDistributionItem[]
  total_languages_used: number
  primary_language: string | null
}

export interface GitHubGrowthYearItem {
  date: string
  value: number
}

export interface GitHubRepoDateItem {
  name: string
  date: string
}

export interface GitHubGrowthAnalytics {
  repos_created_by_year: GitHubGrowthYearItem[]
  newest_repo: GitHubRepoDateItem | null
  oldest_repo: GitHubRepoDateItem | null
}

export interface GitHubLargestRepoItem {
  name: string
  size_kb: number
}

export interface GitHubSizeAnalytics {
  average_repo_size_kb: number
  largest_repo: GitHubLargestRepoItem | null
}

export interface GitHubTopicItem {
  label: string
  value: number
}

export interface GitHubTopicsAnalytics {
  top_topics: GitHubTopicItem[]
  total_unique_topics: number
}

export interface GitHubRepoPushItem {
  name: string
  pushed_at: string
}

export interface GitHubActivityTrendItem {
  date: string
  value: number
}

export interface GitHubActivityAnalytics {
  most_recently_active_repo: GitHubRepoPushItem | null
  repos_updated_this_month: number
  activity_trend: GitHubActivityTrendItem[]
}

export interface GitHubDeveloperScoreBreakdown {
  code_quality_score: number
  documentation_score: number
  testing_score: number
  complexity_score: number
  security_score: number
  language_diversity?: number
  activity?: number
  community_engagement?: number
  consistency?: number
  documentation?: number
}

export interface GitHubDeveloperScore {
  developer_score: number
  breakdown: GitHubDeveloperScoreBreakdown
}

export interface GitHubRepositoryInsightsData {
  languages: GitHubLanguagesAnalytics
  growth: GitHubGrowthAnalytics
  size: GitHubSizeAnalytics
  topics: GitHubTopicsAnalytics
  activity: GitHubActivityAnalytics
  developer_score: GitHubDeveloperScore
  is_partial: boolean
  partial_reason: string | null
}

export interface ChartPoint {
  label: string
  value: number | string
}

export interface ChartDataset {
  chart_id: string
  chart_type: string
  title: string
  data: ChartPoint[]
  metadata: Record<string, any> | null
}

export interface ChartOverviewData {
  charts: ChartDataset[]
  omitted_charts: Record<string, string> | null
}

export interface RAGMetricsData {
  total_queries: number
  error_rate: number
  cache_hit_ratio: number
  cache_miss_ratio: number
  average_total_latency_ms: number
  average_retrieval_latency_ms: number
  average_generation_latency_ms: number
  token_usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface RAGCacheData {
  total_entries?: number
  hit_count?: number
  miss_count?: number
  hit_rate?: number
  size?: number
  hits?: number
  misses?: number
}
