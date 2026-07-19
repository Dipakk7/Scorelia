import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useState, useEffect } from 'react'
import { useScoreliaReducedMotion, getChartAnimationProps } from '@/lib/motion'

interface RadarAnalyticsProps {
  data: { label: string; value: number }[]
  colorScheme?: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'indigo'
  height?: number
  maxVal?: number
}

export function RadarAnalytics({
  data,
  colorScheme = 'brand',
  height = 240,
  maxVal = 100,
}: RadarAnalyticsProps) {
  const shouldReduceMotion = useScoreliaReducedMotion()
  const [isInitial, setIsInitial] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsInitial(false), 500)
    return () => clearTimeout(timer)
  }, [])


  const colors = {
    primary: 'var(--primary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    destructive: 'var(--danger)',
    grid: 'var(--divider)',
    text: 'var(--heading)',
    mutedText: 'var(--muted)',
  }

  const colorsMap = {
    brand: 'var(--primary)',
    violet: 'var(--analytics)',     // Career -> Purple
    emerald: 'var(--success)',      // ATS -> Green
    amber: 'var(--accent)',         // Interview -> Orange
    rose: 'var(--danger)',
    cyan: 'var(--github)',          // GitHub -> Cyan
    indigo: 'var(--indigo)',        // Analytics -> Indigo
  }

  const activeColor = colorsMap[colorScheme] || colors.primary

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)] m-0 mb-1 leading-none">
            {payload[0].payload.label}
          </p>
          <div className="mt-1.5 flex items-center gap-2 font-semibold leading-none text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeColor }} />
            <span className="text-[var(--muted)] font-medium">Score:</span>
            <span className="text-[var(--heading)] font-mono font-bold">{payload[0].value}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }} className="text-left font-sans text-xs bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke={colors.grid} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: colors.mutedText, fontSize: 10, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, maxVal]}
            tick={{ fill: colors.mutedText, fontSize: 8, fontWeight: 'bold' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={activeColor}
            fill={activeColor}
            fillOpacity={0.2}
            activeDot={{ r: 5, stroke: activeColor, strokeWidth: 1.5, fill: 'var(--surface)' }}
            {...getChartAnimationProps(shouldReduceMotion, isInitial)}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default RadarAnalytics
