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
import { useTheme } from '@/providers/ThemeProvider'
import { useState, useEffect } from 'react'

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

  const themeColors = {
    primary: 'var(--primary)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    destructive: 'var(--danger)',
    grid: 'var(--divider)',
    text: 'var(--heading)',
    mutedText: 'var(--muted)',
  }

  const COLORS = [
    'var(--success)',
    'var(--primary)',
  ]

  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      const item = payload[0]?.payload
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          {item?.query && (
            <p className="text-[10px] font-black text-[var(--heading)] max-w-[200px] truncate m-0 mb-1 leading-normal">
              Query: "{item.query}"
            </p>
          )}
          {payload.map((entry: any, index: number) => {
            const isSec = entry.name?.toLowerCase().includes('latency')
            const isToken = entry.name?.toLowerCase().includes('tokens')
            return (
              <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold text-xs leading-none">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill || themeColors.primary }} />
                <span className="text-[var(--muted)] font-medium">{entry.name}:</span>
                <span className="text-[var(--heading)] font-mono font-bold">
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

  if (metrics.length === 0) {
    return (
      <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 font-sans text-xs text-left">
        <CardContent className="py-12 text-center text-[var(--muted)] italic font-medium leading-relaxed">
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

  // 3. Tokens breakdown
  const tokenData = metrics.map((m, idx) => ({
    name: `Q${idx + 1}`,
    tokens: m.tokens,
    query: m.query
  })).filter(m => m.tokens > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-sans text-xs bg-transparent">
      {/* Latency Chart */}
      <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left md:col-span-1">
        <CardHeader className="pb-4 border-b border-[var(--border)]/60 text-left">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
            Query Latency
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44 pt-5 bg-transparent">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
              <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={9} tickLine={false} tick={{ fill: themeColors.mutedText }} />
              <YAxis stroke={themeColors.mutedText} fontSize={9} tickLine={false} unit="s" tick={{ fill: themeColors.mutedText }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="latency" stroke={themeColors.primary} strokeWidth={2} dot={{ r: 3 }} name="Latency" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cache Status Pie Chart */}
      <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left md:col-span-1">
        <CardHeader className="pb-4 border-b border-[var(--border)]/60 text-left">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
            Cache Efficiency
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44 pt-5 bg-transparent">
          {hitCount === 0 && missCount === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[var(--muted)] italic font-medium leading-none">Loading...</div>
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
                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '9px', fill: themeColors.mutedText }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Token Distribution */}
      <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden text-left md:col-span-1">
        <CardHeader className="pb-4 border-b border-[var(--border)]/60 text-left">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-[var(--heading)] m-0 leading-none">
            Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="h-44 pt-5 bg-transparent">
          {tokenData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[var(--muted)] italic font-medium leading-relaxed">
              Token statistics not available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tokenData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={9} tickLine={false} tick={{ fill: themeColors.mutedText }} />
                <YAxis stroke={themeColors.mutedText} fontSize={9} tickLine={false} tick={{ fill: themeColors.mutedText }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tokens" fill={themeColors.primary} radius={[3, 3, 0, 0]} name="Tokens" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
export default SearchAnalytics
