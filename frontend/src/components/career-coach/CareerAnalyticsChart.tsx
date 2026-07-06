
import { ChartCard } from '@/components/ui/ChartCard'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import type { RoadmapAnalyticsResponse } from '@/types/roadmap'

interface CareerAnalyticsChartProps {
  analytics: RoadmapAnalyticsResponse | null
}

export function CareerAnalyticsChart({ analytics }: CareerAnalyticsChartProps) {
  if (!analytics) {
    return (
      <div className="py-12 text-center text-xs text-slate-400 italic">
        No analytics records available. Generate a roadmap to view charts.
      </div>
    )
  }

  const { progress, readiness, skills } = analytics

  // 1. Readiness Breakdown radar or bar chart data
  const readinessData = [
    { name: 'ATS Score', value: readiness?.breakdown?.ats_score ?? 50 },
    { name: 'Resume Review', value: readiness?.breakdown?.resume_review ?? 50 },
    { name: 'Optimize Rating', value: readiness?.breakdown?.resume_optimization ?? 50 },
    { name: 'Interview Loop', value: readiness?.breakdown?.interview_readiness ?? 50 },
    { name: 'Skill Gap', value: readiness?.breakdown?.skill_gap ?? 50 },
    { name: 'Github Review', value: readiness?.breakdown?.github_readiness ?? 50 },
    { name: 'Learning Done', value: readiness?.breakdown?.learning_completion ?? 50 },
  ]

  // 2. Skill Category Distribution data
  const skillCategoryData = Object.entries(skills?.category_distribution || {}).map(([key, val]) => ({
    name: key,
    value: val
  }))

  // 3. Difficulty Distribution pie chart data
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444']
  const difficultyData = Object.entries(skills?.difficulty_distribution || {}).map(([key, val]) => ({
    name: key,
    value: val
  }))

  // 4. Progress Interval Timeline data (completed vs expected)
  const progressIntervalData = Object.entries(progress?.breakdown?.weekly || {}).map(([week, item]: [string, any]) => ({
    name: `Wk ${week}`,
    completed: item.completed_items,
    total: item.total_items,
    percentage: Math.round(item.completion_percentage * 100)
  })).slice(0, 10) // Limit to first 10 intervals for clean fit

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
      {/* Chart 1: Readiness Radar Chart */}
      <ChartCard
        title="Career Readiness Breakdown"
        description="Multi-factor evaluation of your career preparedness."
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={readinessData}>
            <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
            <Radar
              name="Mastery Rating"
              dataKey="value"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chart 2: Progress Timeline */}
      <ChartCard
        title="Learning Velocity & Milestones Progress"
        description="Completion percentages across weekly learning intervals."
      >
        {progressIntervalData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No interval progress records found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressIntervalData}>
              <defs>
                <linearGradient id="velocityColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#velocityColor)"
                name="Interval Completed %"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Chart 3: Skills Categories */}
      <ChartCard
        title="Skill Coverage by Category"
        description="Distribution of learning plan suggestions across technical disciplines."
      >
        {skillCategoryData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No skills data generated.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillCategoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Skill Count" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Chart 4: Skill Difficulty Distribution */}
      <ChartCard
        title="Remediation Difficulty Levels"
        description="Visual breakdown of skills priority by learning complexity."
      >
        {difficultyData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            No difficulty records found.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name ?? 'Unknown'}: ${((props.percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {difficultyData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  )
}
export default CareerAnalyticsChart
