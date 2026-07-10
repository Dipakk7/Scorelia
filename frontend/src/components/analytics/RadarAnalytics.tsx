import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useTheme } from '@/providers/ThemeProvider'
import { useState, useEffect } from 'react'

interface RadarAnalyticsProps {
  data: { label: string; value: number }[]
  colorScheme?: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan'
  height?: number
  maxVal?: number
}

export function RadarAnalytics({
  data,
  colorScheme = 'brand',
  height = 240,
  maxVal = 100,
}: RadarAnalyticsProps) {
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

  const colors = {
    primary: isDark ? '#5b9ac9' : '#2f6690',
    success: isDark ? '#3ecf8e' : '#1b9e6f',
    warning: isDark ? '#e0b845' : '#d99b1f',
    destructive: 'var(--destructive)',
    grid: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
    text: 'var(--foreground)',
    mutedText: 'var(--muted-foreground)',
  }

  const colorsMap = {
    brand: colors.primary,
    violet: colors.primary,
    emerald: colors.success,
    amber: colors.warning,
    rose: colors.destructive,
    cyan: colors.primary,
  }

  const activeColor = colorsMap[colorScheme] || colors.primary

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-455 m-0 mb-1 leading-none">
            {payload[0].payload.label}
          </p>
          <div className="mt-1.5 flex items-center gap-2 font-semibold leading-none">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeColor }} />
            <span className="text-slate-555 dark:text-slate-400">Score:</span>
            <span className="text-foreground font-mono">{payload[0].value}%</span>
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
            activeDot={{ r: 5, stroke: activeColor, strokeWidth: 1.5, fill: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default RadarAnalytics
