import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

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

  const colors = ['#4f46e5', '#7c3aed', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#64748b']

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border border-slate-800 rounded-xl p-2.5 shadow-xl text-xs font-sans text-slate-100">
          <p className="font-bold text-slate-400 mb-0.5 text-[10px] uppercase tracking-wider">
            {payload[0].name}
          </p>
          <p className="font-extrabold text-sm text-white">
            Share: <span className="text-brand-400">{payload[0].value}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegend = (props: any) => {
    const { payload } = props
    return (
      <ul className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2 text-[11px] font-semibold text-slate-500">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-350 transition-colors">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block border border-black/5"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.value}: <span className="text-slate-900 dark:text-slate-300 font-bold">{entry.payload.value}%</span>
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div style={{ width: '100%', height }}>
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
