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

export function SearchAnalytics({ metrics }: SearchAnalyticsProps) {
  if (metrics.length === 0) {
    return (
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
        <CardContent className="py-12 text-center text-xs text-slate-400 italic">
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
  const COLORS = ['#10b981', '#6366f1']

  // 3. Tokens breakdown
  const tokenData = metrics.map((m, idx) => ({
    name: `Q${idx + 1}`,
    tokens: m.tokens,
    query: m.query
  })).filter(m => m.tokens > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      {/* Latency Chart */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md md:col-span-1">
        <CardHeader className="pb-3 text-left">
          <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-white m-0">
            Query Execution Latency (sec)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} unit="s" />
              <Tooltip labelFormatter={(label, items) => {
                const item = items[0]?.payload
                return item ? `Query: "${item.query}"` : label
              }} />
              <Line type="monotone" dataKey="latency" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Latency" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cache Status Pie Chart */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md md:col-span-1">
        <CardHeader className="pb-3 text-left">
          <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-white m-0">
            Cache Utilization Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44">
          {hitCount === 0 && missCount === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading...</div>
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
                <Tooltip />
                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Token Distribution */}
      <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md md:col-span-1">
        <CardHeader className="pb-3 text-left">
          <CardTitle className="text-xs font-bold font-display text-slate-900 dark:text-white m-0">
            Token Footprint Per Search
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44">
          {tokenData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
              Token statistics not available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip labelFormatter={(label, items) => {
                  const item = items[0]?.payload
                  return item ? `Query: "${item.query}"` : label
                }} />
                <Bar dataKey="tokens" fill="#10b981" radius={[3, 3, 0, 0]} name="Tokens" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default SearchAnalytics
