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

interface TrendChartProps {
  data: { label: string; value: number | string }[]
  type?: 'area' | 'line' | 'bar'
  colorScheme?: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan'
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
  const colors = {
    brand: { stroke: '#4f46e5', fill: '#818cf8' },
    violet: { stroke: '#7c3aed', fill: '#a78bfa' },
    emerald: { stroke: '#059669', fill: '#34d399' },
    amber: { stroke: '#d97706', fill: '#fbbf24' },
    rose: { stroke: '#e11d48', fill: '#fb7185' },
    cyan: { stroke: '#0891b2', fill: '#22d3ee' },
  }

  const activeColor = colors[colorScheme]

  // Custom tooltips matching application styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl text-xs font-sans text-slate-100">
          <p className="font-bold mb-1 text-slate-400 uppercase tracking-wider text-[10px]">{label}</p>
          <p className="font-extrabold text-sm text-white">
            Value: <span className="text-brand-400">{valueFormatter(payload[0].value)}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColor.stroke} stopOpacity={0.3} />
                <stop offset="95%" stopColor={activeColor.stroke} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey={yAxisKey}
              stroke={activeColor.stroke}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#grad-${colorScheme})`}
              activeDot={{ r: 6, stroke: activeColor.stroke, strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        ) : type === 'line' ? (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey={yAxisKey}
              stroke={activeColor.stroke}
              strokeWidth={3}
              dot={{ r: 4, stroke: activeColor.stroke, strokeWidth: 1.5, fill: '#fff' }}
              activeDot={{ r: 6, stroke: activeColor.stroke, strokeWidth: 2, fill: activeColor.stroke }}
            />
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.05)' }} />
            <Bar
              dataKey={yAxisKey}
              fill={activeColor.stroke}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
