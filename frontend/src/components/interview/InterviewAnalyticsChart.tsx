import { useState } from 'react'
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
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'

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

  // 1. Process overall score trend data
  const overallTrendData = scoreTrend.map((pt) => ({
    name: pt.date,
    Score: pt.score,
  }))

  // 2. Process STAR radar dimensions data
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

  // 3. Process Tech vs Comm data
  const techCommData = techVsComm.map((pt) => ({
    name: pt.date,
    Technical: pt.technical,
    Communication: pt.communication,
  }))

  // 4. Process Activity (weekly & monthly count)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weeklyData = weekDays.map((day) => ({
    name: day,
    Sessions: weeklyActivity[day] || weeklyActivity[day.toLowerCase()] || 0,
  }))

  return (
    <div className="space-y-4 text-left font-sans">
      {/* Chart controls */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(['scores', 'dimensions', 'activity'] as ChartTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'pb-2.5 px-4 text-xs font-semibold capitalize border-b-2 transition-all cursor-pointer focus:outline-none -mb-[2px]',
              activeTab === tab
                ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700'
            )}
          >
            {tab === 'scores' && 'Performance Trends'}
            {tab === 'dimensions' && 'STAR Dimensions'}
            {tab === 'activity' && 'Activity Logs'}
          </button>
        ))}
      </div>

      {/* Render selected chart */}
      <div>
        {activeTab === 'scores' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 1: Score progress area */}
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-brand-500" />
                  <span>Interview Score Progression</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {overallTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overallTrendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-600)" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="var(--color-brand-600)" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(17,23,38,0.9)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          fontSize: '10px',
                        }}
                      />
                      <Area type="monotone" dataKey="Score" stroke="var(--color-brand-600)" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic">
                    Not enough session logs. Complete interviews to track trends.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart 2: Tech vs Comm Line */}
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} className="text-blue-500" />
                  <span>Technical vs. Communication Skill</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                {techCommData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={techCommData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(17,23,38,0.9)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          fontSize: '10px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '9px', marginTop: '5px' }} />
                      <Line type="monotone" dataKey="Technical" stroke="#0F9D9A" strokeWidth={2} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Communication" stroke="#00D2FF" strokeWidth={2} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs italic">
                    Not enough session logs. Complete interviews to track trends.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Chart 3: Radar Chart */}
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Layers size={14} className="text-purple-500" />
                  <span>STAR Dimensions Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888888', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#888888', fontSize: 8 }} />
                    <Radar name="Candidate" dataKey="A" stroke="var(--color-brand-600)" fill="var(--color-brand-600)" fillOpacity={0.25} />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(17,23,38,0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        fontSize: '10px',
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Visual Guide explanation */}
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} className="text-emerald-500" />
                  <span>STAR Methodology Scoring Blueprint</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 text-xs text-slate-600 dark:text-slate-400 font-sans space-y-3 leading-relaxed">
                <p>
                  Behavioral performance is calculated by examining responses against the four pillars of structured storytelling:
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong className="text-blue-500">Situation (S)</strong>: Explaining the problem background clearly, setting context, timeframe, and scale.
                  </li>
                  <li>
                    <strong className="text-amber-500">Task (T)</strong>: Defining your specific role, target goals, constraints, and business outcomes.
                  </li>
                  <li>
                    <strong className="text-purple-500">Action (A)</strong>: Detailing the technical steps, reasoning, leadership, and tools you utilized.
                  </li>
                  <li>
                    <strong className="text-emerald-500">Result (R)</strong>: Quantifying metrics, project benefits, business values, and takeaways.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 gap-4">
            {/* Chart 4: Activity Weekly Count */}
            <Card className="border-slate-200/80 dark:border-dark-border dark:bg-dark-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Map size={14} className="text-emerald-500" />
                  <span>Weekly Simulated Drills Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                      contentStyle={{
                        background: 'rgba(17,23,38,0.9)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        fontSize: '10px',
                      }}
                    />
                    <Bar dataKey="Sessions" fill="var(--color-brand-600)" radius={[6, 6, 0, 0]} />
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
