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

export function ComparisonChart({ data, type = 'bar' }: ComparisonChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
        No comparison data available. Select items to compare.
      </div>
    )
  }

  // Define colors to assign dynamically to different compared items
  const colors = ['#0F9D9A', '#aa3bff', '#00d2ff', '#10b981', '#f59e0b']

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
    <div className="w-full h-80 min-h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '11px',
                fontFamily: 'Inter',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter', paddingTop: '10px' }} />
            <Bar dataKey="overall" name="Overall Match Score" fill="#0F9D9A" radius={[6, 6, 0, 0]} maxBarSize={50} />
            <Bar dataKey="skills" name="Skills Score" fill="#00D2FF" radius={[6, 6, 0, 0]} maxBarSize={50} />
          </BarChart>
        ) : (
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600, fontFamily: 'Inter' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 8 }}
            />
            {data.map((item, idx) => (
              <Radar
                key={item.name}
                name={item.name}
                dataKey={item.name}
                stroke={colors[idx % colors.length]}
                fill={colors[idx % colors.length]}
                fillOpacity={0.15}
              />
            ))}
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: 'none',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '11px',
                fontFamily: 'Inter',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter', paddingTop: '10px' }} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default ComparisonChart
