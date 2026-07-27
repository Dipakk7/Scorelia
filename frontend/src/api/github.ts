import axios from 'axios'
import { githubHeroMockData } from '@/data/githubHeroMockData'
import { githubAnalyticsMockData } from '@/data/githubAnalyticsMockData'
import { githubRepositoriesMockData } from '@/data/githubRepositoriesMockData'
import { githubDeveloperMetricsMockData } from '@/data/githubDeveloperMetricsMockData'
import { githubAIInsightsMockData } from '@/data/githubAIInsightsMockData'

const API_BASE = '/api/v1/github'

export interface GitHubConnectionStatus {
  isConnected: boolean
  username: string
  avatarUrl?: string
  rateLimit: {
    limit: number
    remaining: number
    reset: number
    reset_in_seconds: number
    is_exceeded: boolean
  }
  lastSyncedAt: string
}

export const fetchGitHubConnectionStatus = async (): Promise<GitHubConnectionStatus> => {
  try {
    const response = await axios.get(`${API_BASE}/connection`)
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

export const fetchGitHubHeroData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/hero`)
    return response.data
  } catch (error) {
    return githubHeroMockData
  }
}

export const fetchGitHubAnalyticsData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/analytics`)
    return response.data
  } catch (error) {
    return githubAnalyticsMockData
  }
}

export const fetchGitHubRepositoriesData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/repositories`)
    return response.data
  } catch (error) {
    return githubRepositoriesMockData
  }
}

export const fetchGitHubDeveloperMetricsData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/developer-metrics`)
    return response.data
  } catch (error) {
    return githubDeveloperMetricsMockData
  }
}

export const fetchGitHubInsightsData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/insights`)
    return response.data
  } catch (error) {
    return githubAIInsightsMockData
  }
}

export const triggerGitHubSync = async () => {
  try {
    const response = await axios.post(`${API_BASE}/sync`)
    return response.data
  } catch (error) {
    return {
      status: 'success',
      message: 'Local sync triggered',
      syncedAt: new Date().toISOString(),
    }
  }
}
