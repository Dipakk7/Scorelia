import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'
import type {
  DashboardSummaryData,
  ProfileStatsData,
  ResumeAnalyticsData,
  ATSAnalyticsData,
  JobAnalyticsData,
  GitHubAnalyticsData,
  GitHubRepositoryInsightsData,
  ChartOverviewData,
  ChartDataset,
  RAGMetricsData,
  RAGCacheData,
} from '@/types/analytics'
import type { HistoryAnalyticsResponse } from '@/types/interview'

/**
 * Fetch system-wide dashboard summary metrics
 */
export function useDashboardAnalytics() {
  return useQuery<DashboardSummaryData>({
    queryKey: ['dashboardAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard')
      return res.data?.data || res.data
    },
    retry: 2,
    staleTime: 60000, // 1 minute
  })
}

/**
 * Fetch profile statistics summary (ATS average, interview score, roadmap completion, resume counts)
 */
export function useProfileStats() {
  return useQuery<ProfileStatsData>({
    queryKey: ['profileStats'],
    queryFn: async () => {
      const res = await api.get('/analytics/profile-stats')
      return res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * Fetch detailed resume analytics distributions and timelines
 */
export function useResumeAnalytics() {
  return useQuery<ResumeAnalyticsData>({
    queryKey: ['resumeAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/resumes')
      return res.data?.data || res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * Fetch detailed ATS grading, category breakdowns, and recommendations
 */
export function useAtsAnalytics() {
  return useQuery<ATSAnalyticsData>({
    queryKey: ['atsAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/ats')
      return res.data?.data || res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * Fetch detailed Job matching cohort distributions and skill gap data
 */
export function useJobAnalytics() {
  return useQuery<JobAnalyticsData>({
    queryKey: ['jobAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/jobs')
      return res.data?.data || res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * Fetch general dashboard chart point collections (ATS, Job match, uploads timeline, top skills)
 */
export function useChartsOverview() {
  return useQuery<ChartOverviewData>({
    queryKey: ['chartsOverview'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/overview')
      return res.data?.data || res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * Fetch single specific chart dataset by chart ID
 */
export function useChartDataset(chartId: string, username?: string) {
  return useQuery<ChartDataset>({
    queryKey: ['chartDataset', chartId, username],
    queryFn: async () => {
      const res = await api.get(`/analytics/charts/${chartId}`, {
        params: username ? { username } : {},
      })
      return res.data?.data || res.data
    },
    enabled: !!chartId && (chartId.indexOf('github') === -1 || !!username),
    retry: 1,
    staleTime: 120000, // 2 minutes
  })
}

/**
 * Fetch public GitHub profile overview stats
 */
export function useGithubProfile(username: string) {
  return useQuery<GitHubAnalyticsData>({
    queryKey: ['githubProfile', username],
    queryFn: async () => {
      const res = await api.get(`/analytics/github/${username}/profile`)
      return res.data?.data || res.data
    },
    enabled: !!username && username.trim().length > 0,
    retry: 1,
    staleTime: 300000, // Cache GitHub profiles for 5 minutes
  })
}

/**
 * Fetch developer repository insights, score breakdown, and size metrics
 */
export function useGithubInsights(username: string) {
  return useQuery<GitHubRepositoryInsightsData>({
    queryKey: ['githubInsights', username],
    queryFn: async () => {
      const res = await api.get(`/analytics/github/${username}/insights`)
      return res.data?.data || res.data
    },
    enabled: !!username && username.trim().length > 0,
    retry: 1,
    staleTime: 300000, // Cache GitHub insights for 5 minutes
  })
}

/**
 * Fetch RAG performance metrics (token counts, query latencies, retrieval logs)
 */
export function useRagMetrics() {
  return useQuery<RAGMetricsData>({
    queryKey: ['ragMetrics'],
    queryFn: async () => {
      const res = await api.get('/rag/metrics')
      return res.data
    },
    retry: 2,
    staleTime: 30000,
  })
}

/**
 * Fetch RAG cache stats (hits, misses, entries sizes)
 */
export function useRagCache() {
  return useQuery<RAGCacheData>({
    queryKey: ['ragCacheStats'],
    queryFn: async () => {
      const res = await api.get('/rag/cache')
      return res.data
    },
    retry: 2,
    staleTime: 30000,
  })
}

/**
 * Fetch user's historical AI interview score patterns and completions
 */
export function useInterviewHistoryAnalytics() {
  return useQuery<HistoryAnalyticsResponse>({
    queryKey: ['interviewHistoryAnalytics'],
    queryFn: async () => {
      const res = await api.get('/ai/interview/history/analytics')
      return res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * List user's career roadmap shells
 */
export function useRoadmapsList() {
  return useQuery<any>({
    queryKey: ['roadmapsList'],
    queryFn: async () => {
      const res = await api.get('/ai/roadmap/roadmaps')
      return res.data
    },
    retry: 2,
    staleTime: 60000,
  })
}

/**
 * Fetch detailed analytics for a specific career roadmap
 */
export function useRoadmapAnalytics(roadmapId: string | null) {
  return useQuery<any>({
    queryKey: ['roadmapAnalytics', roadmapId],
    queryFn: async () => {
      if (!roadmapId) return null
      const res = await api.get(`/ai/roadmap/${roadmapId}/analytics`)
      return res.data
    },
    enabled: !!roadmapId,
    retry: 1,
    staleTime: 60000,
  })
}

/**
 * Fetch progress breakdown for a specific career roadmap
 */
export function useRoadmapProgress(roadmapId: string | null) {
  return useQuery<any>({
    queryKey: ['roadmapProgress', roadmapId],
    queryFn: async () => {
      if (!roadmapId) return null
      const res = await api.get(`/ai/roadmap/${roadmapId}/progress`)
      return res.data
    },
    enabled: !!roadmapId,
    retry: 1,
    staleTime: 60000,
  })
}

/**
 * Fetch career readiness score for a specific career roadmap
 */
export function useRoadmapReadiness(roadmapId: string | null) {
  return useQuery<any>({
    queryKey: ['roadmapReadiness', roadmapId],
    queryFn: async () => {
      if (!roadmapId) return null
      const res = await api.get(`/ai/roadmap/${roadmapId}/readiness`)
      return res.data
    },
    enabled: !!roadmapId,
    retry: 1,
    staleTime: 60000,
  })
}

/**
 * Fetch detailed skills completion roadmap for a specific career roadmap
 */
export function useRoadmapSkills(roadmapId: string | null) {
  return useQuery<any>({
    queryKey: ['roadmapSkills', roadmapId],
    queryFn: async () => {
      if (!roadmapId) return null
      const res = await api.get(`/ai/roadmap/${roadmapId}/skills`)
      return res.data
    },
    enabled: !!roadmapId,
    retry: 1,
    staleTime: 60000,
  })
}
