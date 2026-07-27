export type TrendDirection = 'up' | 'down' | 'neutral'
export type KPICardStatusColor = 'purple' | 'sky' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'teal'

export interface GitHubKPIMetric {
  id: string
  title: string
  value: string | number
  trend: string
  trendDirection: TrendDirection
  comparisonLabel: string
  icon: string // Lucide icon identifier
  sparklineData: number[]
  statusColor: KPICardStatusColor
}

export interface GitHubHeroData {
  profileName: string
  username: string
  lastSynced: string
  kpis: GitHubKPIMetric[]
}

export const githubHeroMockData: GitHubHeroData = {
  profileName: 'Dipak Khandagale',
  username: 'dipak',
  lastSynced: '2 min ago',
  kpis: [
    {
      id: 'repositories',
      title: 'Repositories',
      value: '12',
      trend: '+2',
      trendDirection: 'up',
      comparisonLabel: 'this month',
      icon: 'FolderGit2',
      sparklineData: [8, 9, 9, 10, 11, 11, 12],
      statusColor: 'purple',
    },
    {
      id: 'commits',
      title: 'Commits',
      value: '156',
      trend: '+24',
      trendDirection: 'up',
      comparisonLabel: 'this month',
      icon: 'GitCommit',
      sparklineData: [110, 120, 125, 135, 140, 148, 156],
      statusColor: 'sky',
    },
    {
      id: 'pull_requests',
      title: 'Pull Requests',
      value: '18',
      trend: '+5',
      trendDirection: 'up',
      comparisonLabel: 'this month',
      icon: 'GitPullRequest',
      sparklineData: [10, 11, 13, 14, 15, 16, 18],
      statusColor: 'emerald',
    },
    {
      id: 'issues',
      title: 'Issues',
      value: '27',
      trend: '-3',
      trendDirection: 'down',
      comparisonLabel: 'resolved',
      icon: 'AlertCircle',
      sparklineData: [32, 31, 30, 29, 28, 28, 27],
      statusColor: 'amber',
    },
    {
      id: 'code_reviews',
      title: 'Code Reviews',
      value: '14',
      trend: '+7',
      trendDirection: 'up',
      comparisonLabel: 'this month',
      icon: 'Eye',
      sparklineData: [5, 6, 8, 9, 11, 12, 14],
      statusColor: 'indigo',
    },
    {
      id: 'contributions',
      title: 'Contributions',
      value: '412',
      trend: '+18%',
      trendDirection: 'up',
      comparisonLabel: 'vs last 30 days',
      icon: 'TrendingUp',
      sparklineData: [320, 340, 355, 370, 385, 400, 412],
      statusColor: 'rose',
    },
    {
      id: 'followers',
      title: 'Followers',
      value: '136',
      trend: '+9',
      trendDirection: 'up',
      comparisonLabel: 'this month',
      icon: 'Users',
      sparklineData: [120, 122, 125, 128, 130, 132, 136],
      statusColor: 'teal',
    },
  ],
}
