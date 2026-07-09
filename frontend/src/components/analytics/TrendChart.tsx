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
    brand: { stroke: '#0F9D9A', fill: '#0F9D9A' },
    violet: { stroke: '#6366f1', fill: '#6366f1' },
    emerald: { stroke: '#10b981', fill: '#10b981' },
    amber: { stroke: '#f59e0b', fill: '#f59e0b' },
    rose: { stroke: '#ef4444', fill: '#ef4444' },
    cyan: { stroke: '#00D2FF', fill: '#00D2FF' },
  }

  const activeColor = colors[colorScheme]

  // Custom tooltips matching application styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs select-none">
          {label && <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0 mb-1 leading-none">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold leading-none">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill || activeColor.stroke }} />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Value:</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold">{valueFormatter(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ width: '100%', height }} className="text-left font-sans text-xs">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${colorScheme}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activeColor.stroke} stopOpacity={0.2} />
                <stop offset="95%" stopColor={activeColor.stroke} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fontWeight: 'bold' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
              tick={{ fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fontWeight: 'bold' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
              tick={{ fontWeight: 'bold' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
            <XAxis
              dataKey={xAxisKey}
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fontWeight: 'bold' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={valueFormatter}
              tick={{ fontWeight: 'bold' }}
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
export default TrendChart
