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
import { useTheme } from '@/providers/ThemeProvider'
import { useState, useEffect } from 'react'

interface CareerAnalyticsChartProps {
  analytics: RoadmapAnalyticsResponse | null
}

export function CareerAnalyticsChart({ analytics }: CareerAnalyticsChartProps) {
  const { theme } = useTheme()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  const themeColors = {
    primary: 'var(--analytics)',     // Career -> Purple
    success: 'var(--success)',
    warning: 'var(--warning)',
    destructive: 'var(--danger)',
    grid: 'var(--divider)',
    text: 'var(--heading)',
    mutedText: 'var(--muted)',
  }

  const COLORS = [
    'var(--analytics)',
    'var(--success)',
    'var(--warning)',
    'var(--danger)',
  ]

  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          {label && <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)] m-0">{label}</p>}
          {payload.map((entry: any, index: number) => {
            const isPercent =
              entry.name?.toLowerCase().includes('percent') ||
              entry.name?.toLowerCase().includes('rate') ||
              entry.name?.toLowerCase().includes('mastery') ||
              entry.dataKey === 'percentage' ||
              (entry.dataKey === 'value' && entry.name === 'Mastery Rating')
            return (
              <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold text-xs leading-none">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill || themeColors.primary }} />
                <span className="text-[var(--muted)] font-medium">{entry.name}:</span>
                <span className="text-[var(--heading)] font-mono font-bold">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left font-sans text-xs bg-transparent">
      {/* Chart 1: Readiness Radar Chart */}
      <div className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground m-0">Career Readiness Breakdown</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Multi-factor evaluation of your career preparedness.</p>
        </div>
        <div className="h-60 pt-4 bg-transparent">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={readinessData}>
              <PolarGrid stroke={themeColors.grid} />
              <PolarAngleAxis dataKey="name" stroke={themeColors.mutedText} fontSize={10} tick={{ fill: themeColors.mutedText, fontWeight: 'bold' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={themeColors.mutedText} fontSize={8} tick={{ fill: themeColors.mutedText }} />
              <Radar
                name="Mastery Rating"
                dataKey="value"
                stroke={themeColors.primary}
                fill={themeColors.primary}
                fillOpacity={0.2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Progress Timeline */}
      <div className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground m-0">Learning Velocity & Progress</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Completion percentages across weekly learning intervals.</p>
        </div>
        <div className="h-60 pt-4 bg-transparent">
          {progressIntervalData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
              No interval progress records found.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressIntervalData}>
                <defs>
                  <linearGradient id="velocityColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={11} tickLine={false} tick={{ fill: themeColors.mutedText }} />
                <YAxis stroke={themeColors.mutedText} fontSize={11} tickLine={false} domain={[0, 100]} unit="%" tick={{ fill: themeColors.mutedText }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fill: themeColors.mutedText }} />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke={themeColors.primary}
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
      <div className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground m-0">Skill Coverage by Category</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Distribution of learning plan suggestions across technical disciplines.</p>
        </div>
        <div className="h-60 pt-4 bg-transparent">
          {skillCategoryData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium">
              No skills data generated.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillCategoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={10} tickLine={false} tick={{ fill: themeColors.mutedText }} />
                <YAxis stroke={themeColors.mutedText} fontSize={11} tickLine={false} allowDecimals={false} tick={{ fill: themeColors.mutedText }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill={themeColors.primary} radius={[4, 4, 0, 0]} name="Skill Count" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Chart 4: Skill Difficulty Distribution */}
      <div className="border border-border bg-card/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left p-4 h-80 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-foreground m-0">Remediation Difficulty Levels</h4>
          <p className="text-[10px] text-slate-500 m-0 font-medium">Visual breakdown of skills priority by learning complexity.</p>
        </div>
        <div className="h-60 pt-4 bg-transparent">
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
                  dataKey="value"
                >
                  {difficultyData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fill: themeColors.mutedText }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
export default CareerAnalyticsChart
