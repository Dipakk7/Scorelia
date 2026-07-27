export interface TimelineDayMetric {
  id: string
  date: string
  day: string
  week: number
  count: number
  intensity: 0 | 1 | 2 | 3
}

export interface ContributionTypeMetric {
  label: string
  value: number
  percentage: number
  color: string
}

export interface LanguageMetric {
  language: string
  percentage: number
  linesOfCode: number
  color: string
  rank: number
}

export interface GitHubAnalyticsData {
  timeline: TimelineDayMetric[]
  contributionTypes: ContributionTypeMetric[]
  languages: LanguageMetric[]
  totalContributions: number
}

// Generate realistic 35-day (5 weeks x 7 days) heatmap data
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['Apr', 'May']

const generateTimelineData = (): TimelineDayMetric[] => {
  const items: TimelineDayMetric[] = []
  let dayIdx = 0

  for (let week = 0; week < 5; week++) {
    for (let day = 0; day < 7; day++) {
      const counts = [0, 2, 5, 8, 12, 3, 1, 6, 9, 15, 4, 7, 10, 2]
      const count = counts[(week * 7 + day) % counts.length]
      const intensity: 0 | 1 | 2 | 3 = count === 0 ? 0 : count < 4 ? 1 : count < 9 ? 2 : 3
      const dayName = DAYS[day]

      items.push({
        id: `day-${week}-${day}`,
        date: `2026-04-${15 + (week * 7 + day)}`,
        day: dayName,
        week,
        count,
        intensity,
      })
      dayIdx++
    }
  }
  return items
}

export const githubAnalyticsMockData: GitHubAnalyticsData = {
  totalContributions: 412,
  timeline: generateTimelineData(),
  contributionTypes: [
    { label: 'Commits', value: 156, percentage: 38, color: '#a855f7' },
    { label: 'Pull Requests', value: 78, percentage: 19, color: '#38bdf8' },
    { label: 'Issues', value: 54, percentage: 13, color: '#fbbf24' },
    { label: 'Code Reviews', value: 42, percentage: 10, color: '#818cf8' },
    { label: 'Discussions', value: 28, percentage: 7, color: '#fb7185' },
    { label: 'Others', value: 54, percentage: 13, color: '#94a3b8' },
  ],
  languages: [
    { language: 'Python', percentage: 42.3, linesOfCode: 124500, color: '#38bdf8', rank: 1 },
    { language: 'TypeScript', percentage: 21.7, linesOfCode: 63800, color: '#60a5fa', rank: 2 },
    { language: 'JavaScript', percentage: 15.2, linesOfCode: 44700, color: '#facc15', rank: 3 },
    { language: 'SQL', percentage: 8.6, linesOfCode: 25300, color: '#34d399', rank: 4 },
    { language: 'CSS', percentage: 4.8, linesOfCode: 14100, color: '#ec4899', rank: 5 },
    { language: 'Other', percentage: 7.4, linesOfCode: 21700, color: '#64748b', rank: 6 },
  ],
}
