import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Activity,
  Layers,
  Map,
  Compass,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useTheme } from '@/providers/ThemeProvider'

interface InterviewAnalyticsChartProps {
  scoreTrend?: { date: string; score: number }[]
  starScores?: { Situation: number; Task: number; Action: number; Result: number } | null
  techVsComm?: { date: string; technical: number; communication: number }[]
  weeklyActivity?: Record<string, number>
}

type ChartTab = 'scores' | 'dimensions' | 'activity'

export default function InterviewAnalyticsChart({
  scoreTrend = [],
  starScores,
  techVsComm = [],
  weeklyActivity = {},
}: InterviewAnalyticsChartProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>('scores')

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
    primary: 'var(--accent)',        // Interview -> Orange
    success: 'var(--success)',
    warning: 'var(--warning)',
    destructive: 'var(--danger)',
    grid: 'var(--divider)',
    text: 'var(--heading)',
    mutedText: 'var(--muted)',
  }

  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          {label && <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)] m-0">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="mt-1.5 flex items-center gap-2 font-semibold text-xs leading-none">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke || entry.fill }} />
              <span className="text-[var(--muted)] font-medium">{entry.name}:</span>
              <span className="text-[var(--heading)] font-mono font-bold">{entry.value}%</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  function ActivityTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[var(--shadow-lg)] backdrop-blur-md text-left font-sans text-xs select-none">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-[var(--muted)] m-0">{label}</p>
          <div className="mt-1.5 flex items-center gap-2 font-semibold text-xs leading-none">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColors.primary }} />
            <span className="text-[var(--muted)] font-medium">Sessions:</span>
            <span className="text-[var(--heading)] font-mono font-bold">{payload[0].value} rounds</span>
          </div>
        </div>
      )
    }
    return null
  }

  const overallTrendData = scoreTrend.map((pt) => ({
    name: pt.date,
    Score: pt.score,
  }))

  const radarData = starScores
    ? [
        { subject: 'Situation', A: starScores.Situation, fullMark: 100 },
        { subject: 'Task', A: starScores.Task, fullMark: 100 },
        { subject: 'Action', A: starScores.Action, fullMark: 100 },
        { subject: 'Result', A: starScores.Result, fullMark: 100 },
      ]
    : [
        { subject: 'Situation', A: 75, fullMark: 100 },
        { subject: 'Task', A: 68, fullMark: 100 },
        { subject: 'Action', A: 82, fullMark: 100 },
        { subject: 'Result', A: 65, fullMark: 100 },
      ]

  const techCommData = techVsComm.map((pt) => ({
    name: pt.date,
    Technical: pt.technical,
    Communication: pt.communication,
  }))

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeklyData = weekDays.map((day) => ({
    name: day,
    Sessions: weeklyActivity[day] || weeklyActivity[day.toLowerCase()] || 0,
  }))

  return (
    <div className="space-y-4 text-left font-sans text-xs bg-transparent">
      <div className="flex border-b border-border/60 gap-1 bg-transparent">
        {(['scores', 'dimensions', 'activity'] as ChartTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-2.5 px-3.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer focus:outline-none -mb-[2px] bg-transparent border-none',
              activeTab === tab
                ? 'border-brand-500 text-brand-500 font-extrabold'
                : 'border-transparent text-muted-foreground hover:text-slate-800 dark:hover:text-slate-355'
            )}
          >
            {tab === 'scores' && 'Performance Trends'}
            {tab === 'dimensions' && 'STAR Dimensions'}
            {tab === 'activity' && 'Activity Logs'}
          </button>
        ))}
      </div>

      <div className="bg-transparent">
        {activeTab === 'scores' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-transparent">
            <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <TrendingUp size={14} className="text-[var(--accent)]" />
                  <span>Interview Score Progression</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 pt-6 bg-transparent">
                {overallTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overallTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                      <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={9} tickLine={false} axisLine={false} tick={{ fill: themeColors.mutedText }} />
                      <YAxis stroke={themeColors.mutedText} fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} tick={{ fill: themeColors.mutedText }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="Score" stroke={themeColors.primary} strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] text-xs italic">
                    Not enough session logs. Complete interviews to track trends.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <Activity size={14} className="text-[var(--primary)]" />
                  <span>Technical vs. Communication Skill</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 pt-6 bg-transparent">
                {techCommData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={techCommData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                      <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={9} tickLine={false} axisLine={false} tick={{ fill: themeColors.mutedText }} />
                      <YAxis stroke={themeColors.mutedText} fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} tick={{ fill: themeColors.mutedText }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '9px', marginTop: '5px', fill: themeColors.mutedText }} />
                      <Line type="monotone" dataKey="Technical" stroke={themeColors.primary} strokeWidth={2} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Communication" stroke={themeColors.success} strokeWidth={2} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--muted)] text-xs italic">
                    Not enough session logs. Complete interviews to track trends.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 bg-transparent">
            <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <Layers size={14} className="text-[var(--analytics)]" />
                  <span>STAR Dimensions Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex justify-center items-center bg-transparent">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke={themeColors.grid} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: themeColors.mutedText, fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: themeColors.mutedText, fontSize: 8 }} />
                    <Radar name="Candidate" dataKey="A" stroke={themeColors.primary} fill={themeColors.primary} fillOpacity={0.2} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <Compass size={14} className="text-[var(--success)]" />
                  <span>STAR Methodology Scoring Blueprint</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-xs text-[var(--body)] font-sans space-y-3 leading-relaxed font-medium">
                <p className="m-0 leading-relaxed">
                  Behavioral performance is calculated by examining responses against the four pillars of structured storytelling:
                </p>
                <ul className="space-y-2 m-0 p-0 pl-4 list-disc leading-relaxed">
                  <li>
                    <strong className="text-[var(--primary)]">Situation (S)</strong>: Explaining the problem background clearly, setting context, timeframe, and scale.
                  </li>
                  <li>
                    <strong className="text-[var(--warning)]">Task (T)</strong>: Defining your specific role, target goals, constraints, and business outcomes.
                  </li>
                  <li>
                    <strong className="text-[var(--analytics)]">Action (A)</strong>: Detailing the technical steps, reasoning, leadership, and tools you utilized.
                  </li>
                  <li>
                    <strong className="text-[var(--success)]">Result (R)</strong>: Quantifying metrics, project benefits, business values, and takeaways.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 gap-4 bg-transparent">
            <Card className="border border-[var(--border)] bg-[var(--surface)]/70 backdrop-blur-md rounded-2xl shadow-sm hover:border-[var(--primary)]/40 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-2.5 border-b border-[var(--border)]/60">
                <CardTitle className="text-xs font-black text-[var(--heading)] uppercase tracking-wider flex items-center gap-1.5 m-0">
                  <Map size={14} className="text-[var(--success)]" />
                  <span>Weekly Simulated Drills Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 pt-6 bg-transparent">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                    <XAxis dataKey="name" stroke={themeColors.mutedText} fontSize={9} tickLine={false} axisLine={false} tick={{ fill: themeColors.mutedText }} />
                    <YAxis stroke={themeColors.mutedText} fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} tick={{ fill: themeColors.mutedText }} />
                    <Tooltip content={<ActivityTooltip />} />
                    <Bar dataKey="Sessions" fill={themeColors.primary} radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
