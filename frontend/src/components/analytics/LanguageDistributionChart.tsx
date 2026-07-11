import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'
import { useTheme } from '@/providers/ThemeProvider'
import { useState, useEffect } from 'react'

interface LanguageItem {
  label: string
  value: number // percentage or absolute bytes
}

interface LanguageDistributionChartProps {
  data: LanguageItem[]
  height?: number
}

export function LanguageDistributionChart({ data, height = 240 }: LanguageDistributionChartProps) {
  // Sort data descending to keep colors consistent
  const sortedData = [...data].sort((a, b) => b.value - a.value)

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

  const colors = [
    'var(--primary)',
    'var(--success)',
    'var(--warning)',
    'var(--danger)',
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)] m-0 mb-1 leading-none">
            {payload[0].name}
          </p>
          <div className="mt-1.5 flex items-center gap-2 font-semibold leading-none text-xs">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill || colors[0] }} />
            <span className="text-[var(--muted)] font-medium">Share:</span>
            <span className="text-[var(--heading)] font-mono font-bold">{payload[0].value}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] select-none leading-none items-center text-center">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5 hover:text-[var(--heading)] transition-colors">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-black/5 shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.value}: <span className="text-[var(--heading)] font-extrabold font-mono">{entry.payload.value}%</span>
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div style={{ width: '100%', height }} className="text-left font-sans text-xs bg-transparent">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="45%"
            innerRadius="50%"
            outerRadius="75%"
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
          >
            {sortedData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="currentColor"
                strokeWidth={1.5}
                className="text-white dark:text-slate-900 hover:opacity-90 cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
export default LanguageDistributionChart
