export type KPITrendType = 'positive' | 'negative' | 'neutral'
export type KPIStatusType = 'optimal' | 'warning' | 'critical' | 'neutral'

export interface KPIMetricItem {
  id: string
  title: string
  value: string
  numericValue: number
  previousValue: string
  percentageChange: number
  trend: KPITrendType
  status: KPIStatusType
  iconName: 'Users' | 'UserCheck' | 'CheckCircle2' | 'Target' | 'Clock' | 'Star'
  sparklineData: number[]
  description: string
  comparisonLabel: string
  color: string
  strokeColor: string
  iconBg: string
  timeframe: string
}

export interface AnalyticsHeroOverviewData {
  lastUpdated: string
  dataFreshness: string
  statusMessage: string
  kpis: KPIMetricItem[]
}

export const analyticsHeroMockData: AnalyticsHeroOverviewData = {
  lastUpdated: 'May 17, 2025 • 10:45 AM',
  dataFreshness: 'All systems operational',
  statusMessage: 'Live Data Sync Active',
  kpis: [
    {
      id: 'total_sessions',
      title: 'Total Sessions',
      value: '1,248',
      numericValue: 1248,
      previousValue: '1,002',
      percentageChange: 24.6,
      trend: 'positive',
      status: 'optimal',
      iconName: 'Users',
      sparklineData: [45, 52, 48, 65, 70, 82, 95],
      description: 'Total user platform sessions recorded during timeframe',
      comparisonLabel: 'vs May 4 – May 10',
      color: '#3b82f6',
      strokeColor: '#3b82f6',
      iconBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      timeframe: 'May 11 – May 17',
    },
    {
      id: 'active_users',
      title: 'Active Users',
      value: '892',
      numericValue: 892,
      previousValue: '754',
      percentageChange: 18.3,
      trend: 'positive',
      status: 'optimal',
      iconName: 'UserCheck',
      sparklineData: [30, 42, 40, 58, 62, 75, 88],
      description: 'Unique active users engaging with Scorelia modules',
      comparisonLabel: 'vs May 4 – May 10',
      color: '#14b8a6',
      strokeColor: '#14b8a6',
      iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      timeframe: 'May 11 – May 17',
    },
    {
      id: 'tasks_completed',
      title: 'Tasks Completed',
      value: '3,421',
      numericValue: 3421,
      previousValue: '2,607',
      percentageChange: 31.2,
      trend: 'positive',
      status: 'optimal',
      iconName: 'CheckCircle2',
      sparklineData: [120, 150, 180, 210, 250, 310, 380],
      description: 'Total AI workflows and resume analyses executed',
      comparisonLabel: 'vs May 4 – May 10',
      color: '#a855f7',
      strokeColor: '#a855f7',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      timeframe: 'May 11 – May 17',
    },
    {
      id: 'success_rate',
      title: 'Success Rate',
      value: '96.4%',
      numericValue: 96.4,
      previousValue: '93.9%',
      percentageChange: 2.6,
      trend: 'positive',
      status: 'optimal',
      iconName: 'Target',
      sparklineData: [92, 93, 94, 95, 94.5, 95.8, 96.4],
      description: 'Overall platform request success and completion rate',
      comparisonLabel: 'vs May 4 – May 10',
      color: '#06b6d4',
      strokeColor: '#06b6d4',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      timeframe: 'May 11 – May 17',
    },
    {
      id: 'avg_time_saved',
      title: 'Avg. Time Saved',
      value: '12.4 h',
      numericValue: 12.4,
      previousValue: '10.7 h',
      percentageChange: 15.7,
      trend: 'positive',
      status: 'optimal',
      iconName: 'Clock',
      sparklineData: [8.5, 9.2, 9.8, 10.5, 11.2, 11.8, 12.4],
      description: 'Estimated hours saved per candidate using AI automation',
      comparisonLabel: 'vs May 4 – May 10',
      color: '#f59e0b',
      strokeColor: '#f59e0b',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      timeframe: 'May 11 – May 17',
    },
    {
      id: 'satisfaction_score',
      title: 'Satisfaction Score',
      value: '4.8 / 5',
      numericValue: 4.8,
      previousValue: '4.5 / 5',
      percentageChange: 0.3,
      trend: 'positive',
      status: 'optimal',
      iconName: 'Star',
      sparklineData: [4.4, 4.5, 4.5, 4.6, 4.7, 4.7, 4.8],
      description: 'Candidate experience rating across platform tools',
      comparisonLabel: 'vs May 4 – May 10',
      color: '#eab308',
      strokeColor: '#eab308',
      iconBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      timeframe: 'May 11 – May 17',
    },
  ],
}

export default analyticsHeroMockData
