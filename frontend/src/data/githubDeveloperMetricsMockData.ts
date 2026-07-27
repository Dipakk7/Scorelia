export type QualityScoreLevel = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' | 'Critical'

export interface CodeQualityMetrics {
  overallScore: number
  maintainability: string
  reliability: number
  testCoverage: number
  technicalDebt: number
  securityScore: number
  lintScore: number
  documentationScore: number
  healthGrade: QualityScoreLevel
}

export interface PullRequestMetricsData {
  opened: number
  merged: number
  averageMergeTime: string
  mergeRate: number
  reviewCycles: number
  averageReviewTime: string
}

export interface CodeReviewMetricsData {
  reviewsCompleted: number
  approvals: number
  changeRequests: number
  comments: number
  responseTime: string
  reviewQualityScore: number
}

export interface CommitActivityPoint {
  day: string
  commits: number
  additions: number
  deletions: number
}

export interface CommitActivityData {
  dailyCommits: number
  weeklyCommits: number
  monthlyCommits: number
  averageCommitSize: string
  commitFrequency: string
  chartData: CommitActivityPoint[]
}

export interface IssueResolutionData {
  opened: number
  closed: number
  averageResolutionTime: string
  reopened: number
  resolutionRate: number
}

export interface MergeStatisticsData {
  successfulMerges: number
  conflicts: number
  failedMerges: number
  fastForward: number
  squashMerge: number
  rebaseMerge: number
}

export interface ProductivityInsightsData {
  developerScore: number
  consistencyScore: number
  collaborationScore: number
  velocityScore: number
  qualityTrend: string
  achievementBadges: { title: string; desc: string; date: string; icon: string }[]
  weeklySummaryNote: string
}

export interface GitHubDeveloperMetricsData {
  codeQuality: CodeQualityMetrics
  pullRequests: PullRequestMetricsData
  codeReviews: CodeReviewMetricsData
  commitActivity: CommitActivityData
  issueResolution: IssueResolutionData
  mergeStatistics: MergeStatisticsData
  productivity: ProductivityInsightsData
}

export const githubDeveloperMetricsMockData: GitHubDeveloperMetricsData = {
  codeQuality: {
    overallScore: 78,
    maintainability: 'A',
    reliability: 94,
    testCoverage: 78,
    technicalDebt: 23,
    securityScore: 92,
    lintScore: 96,
    documentationScore: 82,
    healthGrade: 'Excellent',
  },
  pullRequests: {
    opened: 18,
    merged: 15,
    averageMergeTime: '4.2 hrs',
    mergeRate: 83.3,
    reviewCycles: 1.4,
    averageReviewTime: '2.1 hrs',
  },
  codeReviews: {
    reviewsCompleted: 14,
    approvals: 11,
    changeRequests: 2,
    comments: 48,
    responseTime: '1.5 hrs',
    reviewQualityScore: 92,
  },
  commitActivity: {
    dailyCommits: 8,
    weeklyCommits: 42,
    monthlyCommits: 156,
    averageCommitSize: '120 LOC',
    commitFrequency: 'High',
    chartData: [
      { day: 'Mon', commits: 12, additions: 450, deletions: 120 },
      { day: 'Tue', commits: 18, additions: 620, deletions: 180 },
      { day: 'Wed', commits: 24, additions: 890, deletions: 310 },
      { day: 'Thu', commits: 15, additions: 510, deletions: 140 },
      { day: 'Fri', commits: 20, additions: 740, deletions: 210 },
      { day: 'Sat', commits: 8, additions: 280, deletions: 90 },
      { day: 'Sun', commits: 5, additions: 190, deletions: 50 },
    ],
  },
  issueResolution: {
    opened: 27,
    closed: 24,
    averageResolutionTime: '1.8 days',
    reopened: 1,
    resolutionRate: 88.8,
  },
  mergeStatistics: {
    successfulMerges: 15,
    conflicts: 1,
    failedMerges: 0,
    fastForward: 4,
    squashMerge: 8,
    rebaseMerge: 3,
  },
  productivity: {
    developerScore: 92,
    consistencyScore: 88,
    collaborationScore: 94,
    velocityScore: 90,
    qualityTrend: '+8% vs last month',
    achievementBadges: [
      { title: 'Pull Request Champion', desc: 'Merged 10 PRs in a month', date: 'May 18', icon: 'Award' },
      { title: 'Consistency King', desc: '30 days of consistent contributions', date: 'May 10', icon: 'Zap' },
      { title: 'Code Quality Guru', desc: 'Maintained A grade in code quality', date: 'May 5', icon: 'ShieldCheck' },
    ],
    weeklySummaryNote: 'Top 12% of developers in code quality and review velocity this month.',
  },
}
