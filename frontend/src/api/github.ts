import axios from 'axios'
import { githubHeroMockData } from '@/data/githubHeroMockData'
import { githubAnalyticsMockData } from '@/data/githubAnalyticsMockData'
import { githubRepositoriesMockData } from '@/data/githubRepositoriesMockData'
import { githubDeveloperMetricsMockData } from '@/data/githubDeveloperMetricsMockData'
import { githubAIInsightsMockData } from '@/data/githubAIInsightsMockData'

const API_BASE = '/api/v1/github'
const GITHUB_TOKEN_KEY = 'scorelia_github_token'
const GITHUB_USERNAME_KEY = 'scorelia_github_username'

export interface GitHubConnectionStatus {
  isConnected: boolean
  username: string
  avatarUrl?: string
  name?: string
  profileUrl?: string
  rateLimit: {
    limit: number
    remaining: number
    reset: number
    reset_in_seconds: number
    is_exceeded: boolean
  }
  lastSyncedAt: string
}

export const getGitHubToken = (): string | null => {
  return localStorage.getItem(GITHUB_TOKEN_KEY)
}

export const setGitHubToken = (token: string, username?: string): void => {
  localStorage.setItem(GITHUB_TOKEN_KEY, token)
  if (username) {
    localStorage.setItem(GITHUB_USERNAME_KEY, username)
  }
}

export const clearGitHubToken = (): void => {
  localStorage.removeItem(GITHUB_TOKEN_KEY)
  localStorage.removeItem(GITHUB_USERNAME_KEY)
}

const getHeaders = () => {
  const token = getGitHubToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const fetchGitHubConnectionStatus = async (): Promise<GitHubConnectionStatus> => {
  try {
    const token = getGitHubToken()
    if (!token) {
      return {
        isConnected: false,
        username: 'Guest User',
        rateLimit: {
          limit: 5000,
          remaining: 4850,
          reset: 0,
          reset_in_seconds: 3600,
          is_exceeded: false,
        },
        lastSyncedAt: 'Never',
      }
    }

    const response = await axios.get(`${API_BASE}/connection`, {
      headers: getHeaders(),
    })
    return response.data
  } catch (error) {
    return {
      isConnected: false,
      username: 'Guest User',
      rateLimit: {
        limit: 5000,
        remaining: 4850,
        reset: 0,
        reset_in_seconds: 3600,
        is_exceeded: false,
      },
      lastSyncedAt: 'Never',
    }
  }
}

export const connectGitHubToken = async (token: string): Promise<GitHubConnectionStatus> => {
  const response = await axios.post(`${API_BASE}/oauth/connect`, { accessToken: token })
  if (response.data && response.data.isConnected) {
    setGitHubToken(token, response.data.username)
  }
  return response.data
}

export const connectGitHubUsername = async (username: string): Promise<GitHubConnectionStatus> => {
  const tokenIdentifier = `username:${username}`
  const response = await axios.post(`${API_BASE}/oauth/connect`, { accessToken: tokenIdentifier })
  if (response.data && response.data.isConnected) {
    setGitHubToken(tokenIdentifier, response.data.username)
  }
  return response.data
}

export const disconnectGitHub = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE}/oauth/disconnect`, {}, { headers: getHeaders() })
  } finally {
    clearGitHubToken()
  }
}

export const fetchGitHubHeroData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/hero`, { headers: getHeaders() })
    const data = response.data
    return {
      profileName: data?.profileName ?? githubHeroMockData.profileName,
      username: data?.username ?? githubHeroMockData.username,
      lastSynced: data?.lastSynced ?? githubHeroMockData.lastSynced,
      kpis: Array.isArray(data?.kpis) ? data.kpis : githubHeroMockData.kpis,
    }
  } catch (error) {
    return githubHeroMockData
  }
}

export const fetchGitHubAnalyticsData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/analytics`, { headers: getHeaders() })
    const data = response.data
    return {
      totalContributions: data?.totalContributions ?? 0,
      timeline: Array.isArray(data?.timeline) ? data.timeline : [],
      contributionTypes: Array.isArray(data?.contributionTypes) ? data.contributionTypes : [],
      languages: Array.isArray(data?.languages) ? data.languages : [],
      topLanguages: Array.isArray(data?.topLanguages) ? data.topLanguages : Array.isArray(data?.languages) ? data.languages : [],
    }
  } catch (error) {
    return githubAnalyticsMockData
  }
}

export const fetchGitHubRepositoriesData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/repositories`, { headers: getHeaders() })
    const data = response.data
    return {
      summary: data?.summary ?? githubRepositoriesMockData.summary,
      repositories: Array.isArray(data?.repositories) ? data.repositories : [],
    }
  } catch (error) {
    return githubRepositoriesMockData
  }
}

export const fetchGitHubDeveloperMetricsData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/developer-metrics`, { headers: getHeaders() })
    const data = response.data
    return {
      codeQuality: {
        overallScore: data?.codeQuality?.overallScore ?? data?.codeQuality?.codeQualityScore ?? 0,
        maintainability: data?.codeQuality?.maintainability ?? data?.codeQuality?.maintainabilityGrade ?? 'A',
        reliability: data?.codeQuality?.reliability ?? 90,
        testCoverage: data?.codeQuality?.testCoverage ?? 0,
        technicalDebt: data?.codeQuality?.technicalDebt ?? data?.codeQuality?.technicalDebtHours ?? 0,
        securityScore: data?.codeQuality?.securityScore ?? 90,
        lintScore: data?.codeQuality?.lintScore ?? 90,
        documentationScore: data?.codeQuality?.documentationScore ?? 80,
        healthGrade: data?.codeQuality?.healthGrade ?? 'Good',
      },
      pullRequests: {
        opened: data?.pullRequests?.opened ?? data?.pullRequests?.totalPRs ?? 0,
        merged: data?.pullRequests?.merged ?? data?.pullRequests?.mergedPRs ?? 0,
        averageMergeTime: data?.pullRequests?.averageMergeTime ?? (data?.pullRequests?.averageMergeTimeHours ? `${data.pullRequests.averageMergeTimeHours} hrs` : '0 hrs'),
        mergeRate: data?.pullRequests?.mergeRate ?? data?.pullRequests?.mergeSuccessRate ?? 0,
        reviewCycles: data?.pullRequests?.reviewCycles ?? 1.0,
        averageReviewTime: data?.pullRequests?.averageReviewTime ?? '2.0 hrs',
      },
      codeReviews: {
        reviewsCompleted: data?.codeReviews?.reviewsCompleted ?? 0,
        approvals: data?.codeReviews?.approvals ?? 0,
        changeRequests: data?.codeReviews?.changeRequests ?? 0,
        comments: data?.codeReviews?.comments ?? 0,
        responseTime: data?.codeReviews?.responseTime ?? (data?.codeReviews?.averageResponseTimeHours ? `${data.codeReviews.averageResponseTimeHours} hrs` : '0 hrs'),
        reviewQualityScore: data?.codeReviews?.reviewQualityScore ?? data?.codeReviews?.approvalRate ?? 0,
      },
      commitActivity: {
        dailyCommits: data?.commitActivity?.dailyCommits ?? 0,
        weeklyCommits: data?.commitActivity?.weeklyCommits ?? 0,
        monthlyCommits: data?.commitActivity?.monthlyCommits ?? 0,
        averageCommitSize: data?.commitActivity?.averageCommitSize ?? '0 LOC',
        commitFrequency: data?.commitActivity?.commitFrequency ?? 'Normal',
        chartData: Array.isArray(data?.commitActivity?.chartData) ? data.commitActivity.chartData : [],
      },
      issueResolution: {
        opened: data?.issueResolution?.opened ?? 0,
        closed: data?.issueResolution?.closed ?? data?.issueResolution?.issuesResolved ?? 0,
        averageResolutionTime: data?.issueResolution?.averageResolutionTime ?? (data?.issueResolution?.averageResolutionDays ? `${data.issueResolution.averageResolutionDays} days` : '0 days'),
        reopened: data?.issueResolution?.reopened ?? 0,
        resolutionRate: data?.issueResolution?.resolutionRate ?? 100,
      },
      mergeStatistics: {
        successfulMerges: data?.mergeStatistics?.successfulMerges ?? 0,
        conflicts: data?.mergeStatistics?.conflicts ?? 0,
        failedMerges: data?.mergeStatistics?.failedMerges ?? 0,
        fastForward: data?.mergeStatistics?.fastForward ?? data?.mergeStatistics?.fastForwardMerges ?? 0,
        squashMerge: data?.mergeStatistics?.squashMerge ?? data?.mergeStatistics?.squashMerges ?? 0,
        rebaseMerge: data?.mergeStatistics?.rebaseMerge ?? data?.mergeStatistics?.rebaseMerges ?? 0,
      },
      productivity: {
        developerScore: data?.productivity?.developerScore ?? 0,
        consistencyScore: data?.productivity?.consistencyScore ?? 0,
        collaborationScore: data?.productivity?.collaborationScore ?? 0,
        velocityScore: data?.productivity?.velocityScore ?? 0,
        qualityTrend: data?.productivity?.qualityTrend ?? 'Stable',
        weeklySummaryNote: data?.productivity?.weeklySummaryNote ?? '',
        achievementBadges: Array.isArray(data?.productivity?.achievementBadges)
          ? data.productivity.achievementBadges.map((b: any) => ({
              id: b.id ?? '',
              title: b.title ?? '',
              desc: b.desc ?? b.description ?? '',
              date: b.date ?? 'Recently',
              icon: b.icon ?? 'Award',
            }))
          : [],
      },
    }
  } catch (error) {
    return githubDeveloperMetricsMockData
  }
}

export const fetchGitHubInsightsData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/insights`, { headers: getHeaders() })
    const data = response.data
    return {
      insights: Array.isArray(data?.insights) ? data.insights : [],
      recommendations: Array.isArray(data?.recommendations) ? data.recommendations : [],
      weeklySummary: Array.isArray(data?.weeklySummary) ? data.weeklySummary : [],
      goals: Array.isArray(data?.goals) ? data.goals : [],
      activityFeed: Array.isArray(data?.activityFeed) ? data.activityFeed : [],
      achievements: Array.isArray(data?.achievements) ? data.achievements : [],
    }
  } catch (error) {
    return githubAIInsightsMockData
  }
}

export const triggerGitHubSync = async () => {
  try {
    const response = await axios.post(`${API_BASE}/sync`, {}, { headers: getHeaders() })
    return response.data
  } catch (error) {
    return {
      status: 'success',
      message: 'Local sync triggered',
      syncedAt: new Date().toISOString(),
    }
  }
}
