import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

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
  const colors = {
    brand: { stroke: '#0F9D9A', fill: '#0F9D9A' },
    violet: { stroke: '#6366f1', fill: '#6366f1' },
    emerald: { stroke: '#10b981', fill: '#10b981' },
    amber: { stroke: '#f59e0b', fill: '#f59e0b' },
    rose: { stroke: '#ef4444', fill: '#ef4444' },
    cyan: { stroke: '#00D2FF', fill: '#00D2FF' },
  }

  const activeColor = colors[colorScheme]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-205 dark:border-slate-855 bg-white/95 dark:bg-slate-950/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-455 m-0 mb-1 leading-none">
            {payload[0].payload.label}
          </p>
          <div className="mt-1.5 flex items-center gap-2 font-semibold leading-none">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeColor.stroke }} />
            <span className="text-slate-555 dark:text-slate-400">Score:</span>
            <span className="text-slate-905 dark:text-white font-mono">{payload[0].value}%</span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }} className="text-left font-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, maxVal]}
            tick={{ fill: '#94a3b8', fontSize: 8, fontWeight: 'bold' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={activeColor.stroke}
            fill={activeColor.stroke}
            fillOpacity={0.2}
            activeDot={{ r: 5, stroke: activeColor.stroke, strokeWidth: 1.5, fill: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
export default RadarAnalytics
