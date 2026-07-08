import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts'
import { cn } from '@/lib/utils'

interface QueryMetricPoint {
  query: string
  latencyMs: number
  chunks: number
  tokens: number
  cacheStatus: 'HIT' | 'MISS'
}

interface SearchAnalyticsProps {
  metrics: QueryMetricPoint[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const item = payload[0]?.payload
    return (
      <div className="rounded-xl border border-slate-205 dark:border-slate-805 bg-white/95 dark:bg-slate-955/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
        {item?.query && (
          <p className="text-[10px] font-black text-slate-805 dark:text-white max-w-[200px] truncate m-0 mb-1 leading-normal">
            Query: "{item.query}"
          </p>
        )}
        {payload.map((entry: any, index: number) => {
          const isSec = entry.name?.toLowerCase().includes('latency')
          const isToken = entry.name?.toLowerCase().includes('tokens')
          return (
            <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill || '#0F9D9A' }} />
              <span className="text-slate-555 dark:text-slate-400">{entry.name}:</span>
              <span className="text-slate-905 dark:text-white font-mono">
                {entry.value}{isSec ? 's' : isToken ? ' tk' : ''}
              </span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

export function SearchAnalytics({ metrics }: SearchAnalyticsProps) {
  if (metrics.length === 0) {
    return (
      <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 font-sans text-xs text-left">
        <CardContent className="py-12 text-center text-slate-455 dark:text-slate-500 italic font-medium leading-relaxed">
          No query search analytics records available. Run searches to populate metrics.
        </CardContent>
      </Card>
    )
  }

  // 1. Latency history trend
  const latencyData = metrics.map((m, idx) => ({
    name: `Q${idx + 1}`,
    latency: parseFloat((m.latencyMs / 1000).toFixed(2)),
    query: m.query
  }))

  // 2. Cache Hit vs Miss Pie Chart
  const hitCount = metrics.filter(m => m.cacheStatus === 'HIT').length
  const missCount = metrics.length - hitCount
  const cacheData = [
    { name: 'Cache Hit', value: hitCount },
    { name: 'Cache Miss', value: missCount }
  ]
  const COLORS = ['#0F9D9A', '#6366f1']

  // 3. Tokens breakdown
  const tokenData = metrics.map((m, idx) => ({
    name: `Q${idx + 1}`,
    tokens: m.tokens,
    query: m.query
  })).filter(m => m.tokens > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans text-xs">
      {/* Latency Chart */}
      <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left md:col-span-1">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/60 text-left">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none">
            Query Latency
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44 pt-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} unit="s" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="latency" stroke="#0F9D9A" strokeWidth={2} dot={{ r: 3 }} name="Latency" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cache Status Pie Chart */}
      <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left md:col-span-1">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/60 text-left">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none">
            Cache Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44 pt-5">
          {hitCount === 0 && missCount === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic font-medium leading-none">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cacheData}
                  cx="50%"
                  cy="45%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {cacheData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '9px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Token Distribution */}
      <Card className="border border-slate-205 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden text-left md:col-span-1">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/60 text-left">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white m-0 leading-none">
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44 pt-5">
          {tokenData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-455 dark:text-slate-500 italic font-medium leading-relaxed">
              Token statistics not available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/20" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tokens" fill="#0F9D9A" radius={[3, 3, 0, 0]} name="Tokens" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default SearchAnalytics
