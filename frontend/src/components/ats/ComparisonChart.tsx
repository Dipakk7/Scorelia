import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { ChartEmptyState } from '@/components/ui/ChartEmptyState'
import { useState, useEffect } from 'react'
import { useScoreliaReducedMotion, getChartAnimationProps } from '@/lib/motion'

export interface ComparisonDataPoint {
  name: string // Resume name or Job title
  skills: number
  experience: number
  education: number
  keywords: number
  overall: number
}

interface ComparisonChartProps {
  data: ComparisonDataPoint[]
  type?: 'bar' | 'radar'
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--heading)] m-0 truncate max-w-[200px]">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((p: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2 font-semibold text-xs leading-none">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.fill }} />
              <span className="text-[var(--muted)]">{p.name}:</span>
              <span className="text-[var(--heading)] font-bold">{p.value}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function ComparisonChart({ data, type = 'bar' }: ComparisonChartProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [isInitial, setIsInitial] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitial(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const themeColors = {
    primary: 'var(--primary)',      // Resume Score -> Blue
    success: 'var(--success)',      // ATS -> Green
    warning: 'var(--accent)',       // Interview -> Orange
    destructive: 'var(--danger)',
    grid: 'var(--divider)',
    text: 'var(--heading)',
    mutedText: 'var(--muted)',
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 pt-6">
        <ChartEmptyState
          message="No comparison data available. Select additional resumes from your repository to compare suitability side-by-side."
        />
      </div>
    )
  }

  // Define colors to assign dynamically to different compared items
  const colors = [
    'var(--primary)',
    'var(--success)',
    'var(--accent)',
    'var(--danger)',
  ]

  // If radar comparison, we need to restructure the data format:
  // Subject, Item 1 Score, Item 2 Score, Item 3 Score...
  const radarData = (() => {
    if (type !== 'radar') return []
    const categories = [
      { key: 'skills', subject: 'Skills' },
      { key: 'experience', subject: 'Experience' },
      { key: 'education', subject: 'Education' },
      { key: 'keywords', subject: 'Keywords' },
    ]

    return categories.map((cat) => {
      const point: Record<string, any> = { subject: cat.subject }
      data.forEach((item) => {
        point[item.name] = item[cat.key as keyof ComparisonDataPoint]
      })
      return point
    })
  })()

  return (
    <div className="w-full h-80 min-h-[320px] font-sans bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
            <XAxis
              dataKey="name"
              tick={{ fill: themeColors.mutedText, fontSize: 10, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: themeColors.mutedText, fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'Inter', paddingTop: '10px', fontWeight: 'bold' }} />
            <Bar dataKey="overall" name="Overall Match Score" fill={themeColors.success} radius={[6, 6, 0, 0]} maxBarSize={50} {...getChartAnimationProps(shouldReduceMotion, isInitial)} />
            <Bar dataKey="skills" name="Skills Score" fill={themeColors.primary} radius={[6, 6, 0, 0]} maxBarSize={50} {...getChartAnimationProps(shouldReduceMotion, isInitial)} />
          </BarChart>
        ) : (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke={themeColors.grid} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: themeColors.mutedText, fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: themeColors.mutedText, fontSize: 8 }}
            />
            {data.map((item, idx) => (
              <Radar
                key={item.name}
                name={item.name}
                dataKey={item.name}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.15}
                {...getChartAnimationProps(shouldReduceMotion, isInitial)}
              />
            ))}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'Inter', paddingTop: '10px', fontWeight: 'bold' }} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default ComparisonChart
