import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '@/providers/ThemeProvider'
import { useState, useEffect } from 'react'

interface TrendChartProps {
  data: { label: string; value: number | string }[]
  type?: 'area' | 'line' | 'bar'
  colorScheme?: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'indigo'
  height?: number
  xAxisKey?: string
  yAxisKey?: string
  valueFormatter?: (value: any) => string
}

export function TrendChart({
  data,
  type = 'area',
  colorScheme = 'brand',
  height = 240,
  xAxisKey = 'label',
  yAxisKey = 'value',
  valueFormatter = (val) => String(val),
}: TrendChartProps) {
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

  // Custom tooltips matching application styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          {label && <p className="text-[9px] font-black uppercase tracking-wider text-[var(--muted)] m-0 mb-1 leading-none">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold leading-none text-xs">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill || activeColor }} />
              <span className="text-[var(--muted)] font-medium">Value:</span>
              <span className="text-[var(--heading)] font-mono font-bold">{valueFormatter(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }} className="text-left font-sans text-xs bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={activeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey={xAxisKey}
              stroke={colors.mutedText}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: colors.mutedText, fontWeight: 'bold' }}
            />
            <YAxis
              stroke={colors.mutedText}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
              tick={{ fill: colors.mutedText, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.mutedText, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke={activeColor}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#grad-${colorScheme})`}
              activeDot={{ r: 6, stroke: activeColor, strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        ) : type === 'line' ? (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey={xAxisKey}
              stroke={colors.mutedText}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: colors.mutedText, fontWeight: 'bold' }}
            />
            <YAxis
              stroke={colors.mutedText}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
              tick={{ fill: colors.mutedText, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: colors.mutedText, strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={activeColor}
              strokeWidth={3}
              dot={{ r: 4, stroke: activeColor, strokeWidth: 1.5, fill: '#fff' }}
              activeDot={{ r: 6, stroke: activeColor, strokeWidth: 2, fill: activeColor }}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
            <XAxis
              dataKey={xAxisKey}
              stroke={colors.mutedText}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: colors.mutedText, fontWeight: 'bold' }}
            />
            <YAxis
              stroke={colors.mutedText}
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
              tick={{ fill: colors.mutedText, fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
            <Bar
              dataKey={yAxisKey}
              fill={activeColor}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
export default TrendChart
