export type InsightPriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational'
export type ConfidenceLevel = 'High' | 'Medium' | 'Low'
export type RecommendationDifficulty = 'Easy' | 'Medium' | 'Hard'
export type ActivityEventType = 'commit' | 'pull_request' | 'review' | 'issue' | 'release'

export interface AIInsight {
  id: string
  title: string
  description: string
  category: string
  priority: InsightPriorityLevel
  confidence: number
  confidenceLevel: ConfidenceLevel
  impact: string
  status: string
  generatedAt: string
}

export interface SmartRecommendation {
  id: string
  title: string
  description: string
  expectedBenefit: string
  difficulty: RecommendationDifficulty
  priority: InsightPriorityLevel
  estimatedTime: string
}

export interface ActivityFeedItemData {
  id: string
  type: ActivityEventType
  title: string
  description: string
  timestamp: string
  repository: string
  author: string
}

export interface WeeklySummaryData {
  commits: number
  pullRequests: number
  reviews: number
  issuesClosed: number
  repositoriesWorked: number
  highlights: string[]
}

export interface GoalItemData {
  id: string
  goal: string
  current: number
  target: number
  unit: string
  progress: number
  status: 'On Track' | 'Ahead' | 'Needs Focus'
}

export interface AchievementItemData {
  id: string
  title: string
  description: string
  earnedAt: string
  icon: string
  category: string
}

export interface GitHubAIInsightsData {
  insights: AIInsight[]
  recommendations: SmartRecommendation[]
  activityFeed: ActivityFeedItemData[]
  weeklySummary: WeeklySummaryData[]
  goals: GoalItemData[]
  achievements: AchievementItemData[]
}

export const githubAIInsightsMockData: GitHubAIInsightsData = {
  insights: [
    {
      id: 'ins-1',
      title: 'High PR Review Turnaround Speed',
      description: 'Your average PR review response time of 1.5 hours is 62% faster than industry benchmarks.',
      category: 'Code Review',
      priority: 'Informational',
      confidence: 94,
      confidenceLevel: 'High',
      impact: 'High Positive',
      status: 'Active',
      generatedAt: '10m ago',
    },
    {
      id: 'ins-[2]',
      title: 'Untested Code Paths in ml-projects',
      description: 'Repository ml-projects has 12 open issues and test coverage dropped below 60%.',
      category: 'Code Quality',
      priority: 'High',
      confidence: 88,
      confidenceLevel: 'High',
      impact: 'Medium Risk',
      status: 'Action Needed',
      generatedAt: '1h ago',
    },
    {
      id: 'ins-3',
      title: 'Consistent Daily Shipping Rhythm',
      description: 'Maintained a 7-day continuous commit streak with 42 commits shipped across 3 repos.',
      category: 'Velocity',
      priority: 'Informational',
      confidence: 98,
      confidenceLevel: 'High',
      impact: 'High Positive',
      status: 'Active',
      generatedAt: '3h ago',
    },
  ],
  recommendations: [
    {
      id: 'rec-1',
      title: 'Increase Unit Test Coverage in ml-projects',
      description: 'Add unit tests for data preprocessing modules to raise test coverage from 58% to 75%.',
      expectedBenefit: '+12% Code Reliability',
      difficulty: 'Medium',
      priority: 'High',
      estimatedTime: '2-3 hours',
    },
    {
      id: 'rec-2',
      title: 'Resolve Stale Open PR in careerpilot-ai',
      description: 'PR #14 has been waiting for review for 4 days with zero merge conflicts.',
      expectedBenefit: '-18% PR Latency',
      difficulty: 'Easy',
      priority: 'Medium',
      estimatedTime: '30 mins',
    },
    {
      id: 'rec-3',
      title: 'Refactor Monolithic Handler in scorelia',
      description: 'Split section analysis handler into modular services to improve maintainability.',
      expectedBenefit: '+15% Maintainability',
      difficulty: 'Hard',
      priority: 'Medium',
      estimatedTime: '4 hours',
    },
  ],
  activityFeed: [
    {
      id: 'act-1',
      type: 'pull_request',
      title: 'Merged PR #42: Add Repository Analytics Workspace',
      description: 'Merged 5 commits into main with 0 conflicts.',
      timestamp: '2h ago',
      repository: 'scorelia',
      author: 'Dipak K',
    },
    {
      id: 'act-2',
      type: 'commit',
      title: 'Pushed 3 commits to feature/hero-dashboard',
      description: 'Updated Recharts donut charts and progress bar animations.',
      timestamp: '4h ago',
      repository: 'scorelia',
      author: 'Dipak K',
    },
    {
      id: 'act-3',
      type: 'review',
      title: 'Approved PR #18 in careerpilot-ai',
      description: 'Left 2 suggestions for error boundary handling.',
      timestamp: '1d ago',
      repository: 'careerpilot-ai',
      author: 'Dipak K',
    },
    {
      id: 'act-4',
      type: 'issue',
      title: 'Closed Issue #27: Fix TypeScript export types',
      description: 'Resolved export re-export conflict in index.ts.',
      timestamp: '2d ago',
      repository: 'resume-parser',
      author: 'Dipak K',
    },
  ],
  weeklySummary: [
    {
      commits: 42,
      pullRequests: 15,
      reviews: 14,
      issuesClosed: 24,
      repositoriesWorked: 6,
      highlights: [
        'Shipped GitHub Intelligence Phases 1-5 with 0 TypeScript errors.',
        'Achieved 94% code reliability score across active TypeScript repos.',
        'Reduced average PR merge time down to 4.2 hours.',
      ],
    },
  ],
  goals: [
    {
      id: 'goal-1',
      goal: 'Weekly Commits',
      current: 42,
      target: 50,
      unit: 'commits',
      progress: 84,
      status: 'On Track',
    },
    {
      id: 'goal-2',
      goal: 'Code Reviews',
      current: 14,
      target: 12,
      unit: 'reviews',
      progress: 100,
      status: 'Ahead',
    },
    {
      id: 'goal-3',
      goal: 'Test Coverage',
      current: 78,
      target: 85,
      unit: '%',
      progress: 91,
      status: 'On Track',
    },
    {
      id: 'goal-4',
      goal: 'Issue Resolution',
      current: 24,
      target: 30,
      unit: 'issues',
      progress: 80,
      status: 'Needs Focus',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Pull Request Champion',
      description: 'Merged 15 pull requests in a single week.',
      earnedAt: 'May 18',
      icon: 'Award',
      category: 'PRs',
    },
    {
      id: 'ach-2',
      title: 'Consistency King',
      description: '30 consecutive days of GitHub contributions.',
      earnedAt: 'May 10',
      icon: 'Zap',
      category: 'Commits',
    },
    {
      id: 'ach-3',
      title: 'Code Quality Guru',
      description: 'Maintained Grade A code maintainability score.',
      earnedAt: 'May 5',
      icon: 'ShieldCheck',
      category: 'Quality',
    },
  ],
}
