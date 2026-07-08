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

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-205 dark:border-slate-805 bg-white/95 dark:bg-slate-950/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
        {label && <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 m-0">{label}</p>}
        {payload.map((entry: any, index: number) => {
          const isPercent =
            entry.name?.toLowerCase().includes('percent') ||
            entry.name?.toLowerCase().includes('rate') ||
            entry.name?.toLowerCase().includes('mastery') ||
            entry.dataKey === 'percentage' ||
            (entry.dataKey === 'value' && entry.name === 'Mastery Rating')
          return (
            <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill || '#0F9D9A' }} />
              <span className="text-slate-555 dark:text-slate-400">{entry.name}:</span>
              <span className="text-slate-905 dark:text-white font-mono">
                {entry.value}{isPercent ? '%' : ''}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left font-sans text-xs">
      {/* Chart 1: Readiness Radar Chart */}
      <div className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0">Career Readiness Breakdown</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Multi-factor evaluation of your career preparedness.</p>
        </div>
        <div className="h-60 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={readinessData}>
              <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
              <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={10} tick={{ fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={8} />
              <Radar
                name="Mastery Rating"
                dataKey="value"
                stroke="#0F9D9A"
                fill="#0F9D9A"
                fillOpacity={0.2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Progress Timeline */}
      <div className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0">Learning Velocity & Progress</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Completion percentages across weekly learning intervals.</p>
        </div>
        <div className="h-60 pt-4">
          {progressIntervalData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
              No interval progress records found.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressIntervalData}>
                <defs>
                  <linearGradient id="velocityColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F9D9A" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F9D9A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#0F9D9A"
                  fillOpacity={1}
                  fill="url(#velocityColor)"
                  name="Interval Completed"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 3: Skills Categories */}
      <div className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0">Skill Coverage by Category</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Distribution of learning plan suggestions across technical disciplines.</p>
        </div>
        <div className="h-60 pt-4">
          {skillCategoryData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
              No skills data generated.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillCategoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0F9D9A" radius={[4, 4, 0, 0]} name="Skill Count" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 4: Skill Difficulty Distribution */}
      <div className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0">Remediation Difficulty Levels</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Visual breakdown of skills priority by learning complexity.</p>
        </div>
        <div className="h-60 pt-4">
          {difficultyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
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
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {difficultyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
export default CareerAnalyticsChart
