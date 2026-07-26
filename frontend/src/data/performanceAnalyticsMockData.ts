export interface DailyPerformancePoint {
  date: string
  successfulTasks: number
  failedTasks: number
  avgResponseTime: number // in seconds
  successRate: number // percentage
}

export interface TaskDistributionPoint {
  name: string
  percentage: number
  count: number
  color: string
}

export interface TopAgentRankingPoint {
  rank: number
  name: string
  category: string
  tasksCompleted: number
  successRate: number
  avgResponseTime: string
  color: string
}

// 90-Day Daily Telemetry Points (sampled across 7d, 30d, 90d periods)
export const mock90DayPerformanceData: DailyPerformancePoint[] = [
  { date: 'May 11', successfulTasks: 165, failedTasks: 4, avgResponseTime: 1.15, successRate: 97.6 },
  { date: 'May 12', successfulTasks: 172, failedTasks: 3, avgResponseTime: 1.10, successRate: 98.3 },
  { date: 'May 13', successfulTasks: 158, failedTasks: 5, avgResponseTime: 1.25, successRate: 96.9 },
  { date: 'May 14', successfulTasks: 180, failedTasks: 2, avgResponseTime: 1.05, successRate: 98.9 },
  { date: 'May 15', successfulTasks: 195, failedTasks: 6, avgResponseTime: 1.30, successRate: 97.0 },
  { date: 'May 16', successfulTasks: 210, failedTasks: 4, avgResponseTime: 1.20, successRate: 98.1 },
  { date: 'May 17', successfulTasks: 225, failedTasks: 3, avgResponseTime: 1.18, successRate: 98.7 },
  { date: 'May 18', successfulTasks: 240, failedTasks: 5, avgResponseTime: 1.22, successRate: 98.0 },
  { date: 'May 19', successfulTasks: 232, failedTasks: 4, avgResponseTime: 1.19, successRate: 98.3 },
  { date: 'May 20', successfulTasks: 250, failedTasks: 6, avgResponseTime: 1.28, successRate: 97.7 },
  { date: 'May 21', successfulTasks: 265, failedTasks: 4, avgResponseTime: 1.14, successRate: 98.5 },
  { date: 'May 22', successfulTasks: 280, failedTasks: 3, avgResponseTime: 1.08, successRate: 98.9 },
  { date: 'May 23', successfulTasks: 295, failedTasks: 5, avgResponseTime: 1.24, successRate: 98.3 },
  { date: 'May 24', successfulTasks: 310, failedTasks: 4, avgResponseTime: 1.16, successRate: 98.7 },
]

export const mock24HourPerformanceData: DailyPerformancePoint[] = [
  { date: '00:00', successfulTasks: 12, failedTasks: 0, avgResponseTime: 0.95, successRate: 100 },
  { date: '04:00', successfulTasks: 8, failedTasks: 0, avgResponseTime: 0.92, successRate: 100 },
  { date: '08:00', successfulTasks: 45, failedTasks: 1, avgResponseTime: 1.05, successRate: 97.8 },
  { date: '12:00', successfulTasks: 85, failedTasks: 2, avgResponseTime: 1.20, successRate: 97.7 },
  { date: '16:00', successfulTasks: 110, failedTasks: 3, avgResponseTime: 1.35, successRate: 97.3 },
  { date: '20:00', successfulTasks: 65, failedTasks: 1, avgResponseTime: 1.12, successRate: 98.5 },
]

// Task Category Distribution
export const mockTaskDistribution: TaskDistributionPoint[] = [
  { name: 'Resume Optimization', percentage: 25, count: 4618, color: '#a855f7' },
  { name: 'ATS Compliance Scan', percentage: 21, count: 3879, color: '#3b82f6' },
  { name: 'Interview Preparation', percentage: 16, count: 2955, color: '#06b6d4' },
  { name: 'Cover Letter Generation', percentage: 14, count: 2586, color: '#10b981' },
  { name: 'Career Roadmap Strategy', percentage: 12, count: 2216, color: '#f59e0b' },
  { name: 'Custom Agent Workflows', percentage: 12, count: 2218, color: '#64748b' },
]

// Top 10 Ranked Agents
export const mockTopAgentsRanked: TopAgentRankingPoint[] = [
  { rank: 1, name: 'Resume Assistant', category: 'Optimization', tasksCompleted: 4618, successRate: 98.1, avgResponseTime: '0.84s', color: '#a855f7' },
  { rank: 2, name: 'ATS Optimizer', category: 'Compliance', tasksCompleted: 3879, successRate: 96.2, avgResponseTime: '1.12s', color: '#3b82f6' },
  { rank: 3, name: 'Interview Coach', category: 'Coaching', tasksCompleted: 2955, successRate: 94.9, avgResponseTime: '1.45s', color: '#06b6d4' },
  { rank: 4, name: 'Cover Letter Writer', category: 'Generation', tasksCompleted: 2586, successRate: 97.2, avgResponseTime: '1.03s', color: '#10b981' },
  { rank: 5, name: 'Career Advisor', category: 'Roadmap', tasksCompleted: 2216, successRate: 93.0, avgResponseTime: '1.67s', color: '#f59e0b' },
  { rank: 6, name: 'LinkedIn Profile Optimizer', category: 'Branding', tasksCompleted: 1450, successRate: 96.5, avgResponseTime: '0.92s', color: '#0284c7' },
  { rank: 7, name: 'Code Intelligence Agent', category: 'Engineering', tasksCompleted: 1150, successRate: 95.8, avgResponseTime: '1.28s', color: '#6366f1' },
  { rank: 8, name: 'Networking Assistant', category: 'Outreach', tasksCompleted: 1100, successRate: 95.1, avgResponseTime: '1.05s', color: '#8b5cf6' },
  { rank: 9, name: 'RAG Agent', category: 'Vector Search', tasksCompleted: 980, successRate: 92.3, avgResponseTime: '1.56s', color: '#4f46e5' },
  { rank: 10, name: 'Skill Gap Matcher', category: 'Analysis', tasksCompleted: 890, successRate: 91.4, avgResponseTime: '1.18s', color: '#e11d48' },
]

// Executive Analytics Summary
export const mockAnalyticsSummary = {
  totalExecutions: 18472,
  totalExecutionsTrend: '12.4%',
  totalExecutionsTrendType: 'up' as const,

  avgLatency: 1.28,
  avgLatencyTrend: '9%',
  avgLatencyTrendType: 'down' as const,

  successRate: 96.8,
  successRateTrend: '3.1%',
  successRateTrendType: 'up' as const,

  activeAgents: 8,
  activeAgentsTrend: '+2',
  activeAgentsTrendType: 'up' as const,
}
