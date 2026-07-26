export interface PlatformActivityPoint {
  date: string
  displayDate: string
  sessions: number
  pageViews: number
  conversions: number
  bounceRate: number
}

export interface ActiveUsersGrowthPoint {
  date: string
  displayDate: string
  activeUsers: number
  newUsers: number
  returningUsers: number
}

export interface TopFeatureUsagePoint {
  feature: string
  usage: number
  percentage: number
  color: string
  category: string
}

export interface AnalyticsChartsData {
  platformActivity: PlatformActivityPoint[]
  activeUsersGrowth: ActiveUsersGrowthPoint[]
  topFeatures: TopFeatureUsagePoint[]
}

export const analyticsChartsMockData: AnalyticsChartsData = {
  platformActivity: [
    { date: '2025-05-11', displayDate: 'May 11', sessions: 740, pageViews: 2150, conversions: 185, bounceRate: 31.2 },
    { date: '2025-05-12', displayDate: 'May 12', sessions: 910, pageViews: 2680, conversions: 228, bounceRate: 29.8 },
    { date: '2025-05-13', displayDate: 'May 13', sessions: 1080, pageViews: 3120, conversions: 270, bounceRate: 28.5 },
    { date: '2025-05-14', displayDate: 'May 14', sessions: 1248, pageViews: 3840, conversions: 312, bounceRate: 26.4 },
    { date: '2025-05-15', displayDate: 'May 15', sessions: 1190, pageViews: 3620, conversions: 298, bounceRate: 27.1 },
    { date: '2025-05-16', displayDate: 'May 16', sessions: 1350, pageViews: 4190, conversions: 338, bounceRate: 25.8 },
    { date: '2025-05-17', displayDate: 'May 17', sessions: 1420, pageViews: 4380, conversions: 355, bounceRate: 24.9 },
  ],
  activeUsersGrowth: [
    { date: '2025-04-18', displayDate: 'Apr 18', activeUsers: 420, newUsers: 150, returningUsers: 270 },
    { date: '2025-04-22', displayDate: 'Apr 22', activeUsers: 480, newUsers: 180, returningUsers: 300 },
    { date: '2025-04-25', displayDate: 'Apr 25', activeUsers: 540, newUsers: 210, returningUsers: 330 },
    { date: '2025-04-29', displayDate: 'Apr 29', activeUsers: 610, newUsers: 240, returningUsers: 370 },
    { date: '2025-05-02', displayDate: 'May 2', activeUsers: 670, newUsers: 265, returningUsers: 405 },
    { date: '2025-05-06', displayDate: 'May 6', activeUsers: 730, newUsers: 290, returningUsers: 440 },
    { date: '2025-05-09', displayDate: 'May 9', activeUsers: 810, newUsers: 320, returningUsers: 490 },
    { date: '2025-05-13', displayDate: 'May 13', activeUsers: 855, newUsers: 340, returningUsers: 515 },
    { date: '2025-05-16', displayDate: 'May 16', activeUsers: 892, newUsers: 360, returningUsers: 532 },
  ],
  topFeatures: [
    { feature: 'Resume Intelligence', usage: 1095, percentage: 32, color: '#a855f7', category: 'Intelligence' },
    { feature: 'ATS Analysis', usage: 684, percentage: 20, color: '#3b82f6', category: 'Compliance' },
    { feature: 'Interview Prep', usage: 616, percentage: 18, color: '#06b6d4', category: 'Practice' },
    { feature: 'Cover Letter', usage: 411, percentage: 12, color: '#f97316', category: 'Creation' },
    { feature: 'Career Roadmap', usage: 342, percentage: 10, color: '#ec4899', category: 'Planning' },
    { feature: 'Others', usage: 273, percentage: 8, color: '#64748b', category: 'Utilities' },
  ],
}

export default analyticsChartsMockData
