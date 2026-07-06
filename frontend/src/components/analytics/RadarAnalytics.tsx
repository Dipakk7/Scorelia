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
    brand: { stroke: '#4f46e5', fill: '#818cf8' },
    violet: { stroke: '#7c3aed', fill: '#a78bfa' },
    emerald: { stroke: '#059669', fill: '#34d399' },
    amber: { stroke: '#d97706', fill: '#fbbf24' },
    rose: { stroke: '#e11d48', fill: '#fb7185' },
    cyan: { stroke: '#0891b2', fill: '#22d3ee' },
  }

  const activeColor = colors[colorScheme]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-xl text-xs font-sans text-slate-100">
          <p className="font-bold text-slate-400 mb-0.5 text-[10px] uppercase tracking-wider">
            {payload[0].payload.label}
          </p>
          <p className="font-extrabold text-sm text-white">
            Score: <span className="text-brand-400">{payload[0].value}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" opacity={0.15} />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, maxVal]}
            tick={{ fill: '#64748b', fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Score"
            dataKey="value"
            stroke={activeColor.stroke}
            fill={activeColor.stroke}
            fillOpacity={0.25}
            activeDot={{ r: 5, stroke: activeColor.stroke, strokeWidth: 1.5, fill: '#fff' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
