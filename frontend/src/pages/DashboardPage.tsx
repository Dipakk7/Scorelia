import { useQuery } from '@tanstack/react-query'
import {
  FileText,
  Scan,
  MessageSquareCode,
  Map,
  Upload,
  Sparkles,
  Award,
  Calendar,
  Layers,
  TrendingUp
} from 'lucide-react'
import { Link } from 'react-router-dom'
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
  LineChart,
  Line,
  Legend
} from 'recharts'

import api from '@/api/api'
import { useAuth } from '@/providers/AuthProvider'
import { StatisticCard } from '@/components/ui/StatisticCard'
import { ChartCard } from '@/components/ui/ChartCard'
import { ActivityCard } from '@/components/ui/ActivityCard'
import { QuickActionCard } from '@/components/ui/QuickActionCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { ErrorState } from '@/components/ui/ErrorState'
import { DashboardSkeleton } from '@/components/ui/Skeletons'
import { cn } from '@/lib/utils'
import { ChartEmptyState } from '@/components/ui/ChartEmptyState'
import type { ResumeResponse } from '@/types/resume'

interface DashboardStatsData {
  total_users: number
  total_resumes: number
  parsed_resumes: number
  total_job_matches: number
  average_ats_score: number
  average_match_score: number
  latest_resume: ResumeResponse | null
  latest_job_match: {
    resume_id: string
    timestamp: string
    overall_score: number
    grade: string
    job_title: string
    company: string
  } | null
  // Part 2 fields
  skill_gap_count: number
  interview_sessions: number
  career_progress: number
  cover_letters_generated: number
  ai_usage: number
}

interface ChartPoint {
  label: string
  value: number
}

// Recharts Custom Stripe/Vercel-style Tooltip
interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 p-3 shadow-xl backdrop-blur-md text-left font-sans select-none">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 m-0 leading-none">{label}</p>
        <div className="mt-2 space-y-1.5">
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center gap-2.5 text-[11px] font-semibold leading-none">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: pld.color || pld.stroke }} />
              <span className="text-slate-500 dark:text-slate-400 font-medium">{pld.name}:</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold font-mono">{pld.value}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { user } = useAuth()
  const userDisplayName = user?.full_name || user?.email.split('@')[0] || 'User'
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Dynamic time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }
  const greeting = getGreeting()

  // Query: Dashboard stats
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery<DashboardStatsData>({
    queryKey: ['dashboardAnalytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/dashboard')
      return res.data.data
    },
  })

  // Query: Resumes
  const {
    data: resumesData,
    isLoading: resumesLoading,
    error: resumesError,
    refetch: refetchResumes,
  } = useQuery<{ resumes: ResumeResponse[]; total: number }>({
    queryKey: ['dashboardResumes'],
    queryFn: async () => {
      const res = await api.get('/resumes')
      return res.data
    },
  })

  // Query: Trend Charts
  const { data: scoreTrend, isLoading: scoreLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'resume-score-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/resume-score-trend')
      return res.data.data.data
    },
  })

  const { data: atsTrend, isLoading: atsLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'ats-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/ats-trend')
      return res.data.data.data
    },
  })

  const { data: matchTrend, isLoading: matchLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'job-match-trend'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/job-match-trend')
      return res.data.data.data
    },
  })

  const { data: interviewTrend, isLoading: interviewLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'interview-performance'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/interview-performance')
      return res.data.data.data
    },
  })

  const { data: weeklyTrend, isLoading: weeklyLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'weekly-activity'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/weekly-activity')
      return res.data.data.data
    },
  })

  const { data: monthlyTrend, isLoading: monthlyLoading } = useQuery<ChartPoint[]>({
    queryKey: ['chart', 'monthly-activity'],
    queryFn: async () => {
      const res = await api.get('/analytics/charts/monthly-activity')
      return res.data.data.data
    },
  })

  const handleRetry = () => {
    refetchAnalytics()
    refetchResumes()
  }

  const isLoading = analyticsLoading || resumesLoading
  const isError = !!analyticsError || !!resumesError

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <ErrorState
        title="Dashboard Sync Failed"
        message="Failed to load dashboard metrics from FastAPI. Please check backend connection."
        onRetry={handleRetry}
      />
    )
  }

  const resumes = resumesData?.resumes ?? []

  // Trend Delta Calculations (at least 2 points to avoid fabrication)
  let atsTrendDelta: { value: number; isPositive: boolean } | undefined = undefined
  if (atsTrend && atsTrend.length >= 2) {
    const lastVal = atsTrend[atsTrend.length - 1].value
    const prevVal = atsTrend[atsTrend.length - 2].value
    const diff = lastVal - prevVal
    if (diff !== 0) {
      atsTrendDelta = { value: Math.abs(diff), isPositive: diff > 0 }
    }
  }

  let matchTrendDelta: { value: number; isPositive: boolean } | undefined = undefined
  if (matchTrend && matchTrend.length >= 2) {
    const lastVal = matchTrend[matchTrend.length - 1].value
    const prevVal = matchTrend[matchTrend.length - 2].value
    const diff = lastVal - prevVal
    if (diff !== 0) {
      matchTrendDelta = { value: Math.abs(diff), isPositive: diff > 0 }
    }
  }

  let interviewTrendDelta: { value: number; isPositive: boolean } | undefined = undefined
  if (interviewTrend && interviewTrend.length >= 2) {
    const lastVal = interviewTrend[interviewTrend.length - 1].value
    const prevVal = interviewTrend[interviewTrend.length - 2].value
    const diff = lastVal - prevVal
    if (diff !== 0) {
      interviewTrendDelta = { value: Math.abs(diff), isPositive: diff > 0 }
    }
  }

  // Primary Metrics
  const primaryCards = [
    {
      title: 'Avg ATS Score',
      value: analytics?.average_ats_score ?? 0,
      icon: Award,
      desc: 'Based on latest resume analysis',
      metricType: 'percentage' as const,
      accentColor: 'emerald' as const,
      zeroStateText: 'No score computed yet',
      cta: { text: 'Analyze ATS score', to: '/ats' },
      trend: atsTrendDelta,
    },
    {
      title: 'Career Progress',
      value: analytics?.career_progress ?? 0,
      icon: Map,
      desc: 'Roadmap phase completion',
      metricType: 'percentage' as const,
      accentColor: 'purple' as const,
      zeroStateText: 'No milestones completed',
      cta: { text: 'Build career roadmap', to: '/roadmap' },
    },
    {
      title: 'Job Matches',
      value: analytics?.total_job_matches ?? 0,
      icon: Layers,
      desc: 'Positions evaluated',
      metricType: 'number' as const,
      accentColor: 'blue' as const,
      zeroStateText: 'No matched positions',
      cta: { text: 'Scan job matches', to: '/ats' },
      trend: matchTrendDelta,
    },
    {
      title: 'Total Resumes',
      value: analytics?.total_resumes ?? 0,
      icon: FileText,
      desc: 'CV uploads recorded',
      metricType: 'number' as const,
      accentColor: 'teal' as const,
      zeroStateText: 'No resumes uploaded yet',
      cta: { text: 'Upload first resume', to: '/resumes' },
    },
  ]

  // Secondary Metrics
  const secondaryCards = [
    {
      title: 'Skill Gap Count',
      value: analytics?.skill_gap_count ?? 0,
      icon: Scan,
      desc: 'Missing skillsets identified',
      accentColor: 'purple' as const,
      zeroStateText: 'No gaps identified',
      cta: { text: 'Analyze skill gaps', to: '/roadmap' },
    },
    {
      title: 'Interview Loops',
      value: analytics?.interview_sessions ?? 0,
      icon: MessageSquareCode,
      desc: 'Mock reviews completed',
      accentColor: 'blue' as const,
      zeroStateText: 'No loops started',
      cta: { text: 'Start mock interview', to: '/interview' },
      trend: interviewTrendDelta,
    },
    {
      title: 'Cover Letters',
      value: analytics?.cover_letters_generated ?? 0,
      icon: Sparkles,
      desc: 'AI drafts created',
      accentColor: 'teal' as const,
      zeroStateText: 'No letters generated',
      cta: { text: 'Create cover letter', to: '/cover-letter' },
    },
    {
      title: 'AI Usage Logs',
      value: analytics?.ai_usage ?? 0,
      icon: TrendingUp,
      desc: 'Prompts run',
      accentColor: 'teal' as const,
      zeroStateText: 'No AI prompts logged',
      cta: { text: 'Interact with copilot', to: '/resumes' },
    },
  ]

  // Construct recent activity items list
  const recentActivities: any[] = []

  if (analytics?.latest_resume) {
    recentActivities.push({
      id: 'latest-resume',
      title: 'Resume Uploaded',
      description: `Resume "${analytics.latest_resume.original_filename}" parsed successfully.`,
      timestamp: analytics.latest_resume.uploaded_at,
      icon: Upload,
      badgeText: analytics.latest_resume.ats_score ? `Score: ${analytics.latest_resume.ats_score}` : undefined,
      badgeVariant: 'success',
    })
  }

  if (analytics?.latest_job_match) {
    recentActivities.push({
      id: 'latest-match',
      title: 'Job Match Completed',
      description: `Matched against "${analytics.latest_job_match.job_title}" at ${analytics.latest_job_match.company}.`,
      timestamp: analytics.latest_job_match.timestamp,
      icon: Scan,
      badgeText: `Match: ${analytics.latest_job_match.overall_score}%`,
      badgeVariant: 'info',
    })
  }

  // Chart point count checks
  const scoreLength = scoreTrend?.length ?? 0
  const atsLength = atsTrend?.length ?? 0
  const chart1Points = Math.max(scoreLength, atsLength)

  const matchLength = matchTrend?.length ?? 0
  const interviewLength = interviewTrend?.length ?? 0
  const chart2Points = Math.max(matchLength, interviewLength)

  const hasWeeklyActivity = weeklyTrend && weeklyTrend.length > 0 && weeklyTrend.some(p => p.value > 0)
  const hasMonthlyActivity = monthlyTrend && monthlyTrend.length > 0 && monthlyTrend.some(p => p.value > 0)

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Welcome Hero / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 dark:bg-slate-900/20 p-6 md:p-8 text-white border border-slate-850/80 dark:border-slate-800/80 backdrop-blur-md shadow-xl select-none">
        {/* Glow ornaments */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 -ml-16 -mb-16 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/40 pb-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-brand-400 font-mono flex items-center gap-2">
                <Calendar size={13} className="text-brand-400 shrink-0" />
                {currentDate}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white m-0 tracking-tight leading-none">
                {greeting}, {userDisplayName} 👋
              </h1>
              <p className="text-xs md:text-sm text-slate-300/90 max-w-2xl font-sans leading-relaxed m-0 font-medium">
                Welcome back to Scorelia. Track your AI-powered career journey, improve your resume, increase ATS scores, prepare for interviews, and monitor your professional growth from one place.
              </p>
            </div>
          </div>

          {/* Hero Quick Actions Grid */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 font-mono">Launch Copilot Services</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link to="/resumes" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/75 border border-slate-800/80 hover:border-brand-500/45 hover:shadow-[0_4px_20px_rgba(15,157,154,0.12)] transition-all duration-200 ease-in-out group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-105 group-hover:bg-brand-500/20 transition-all duration-200 shrink-0">
                  <Upload size={16} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors">Upload Resume</p>
                  <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">Import CV file</p>
                </div>
              </Link>
              <Link to="/ats" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/75 border border-slate-800/80 hover:border-accent-blue/45 hover:shadow-[0_4px_20px_rgba(0,210,255,0.12)] transition-all duration-200 ease-in-out group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue group-hover:scale-105 group-hover:bg-accent-blue/20 transition-all duration-200 shrink-0">
                  <Scan size={16} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-accent-blue transition-colors">Analyze ATS</p>
                  <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">Scan score check</p>
                </div>
              </Link>
              <Link to="/cover-letter" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/75 border border-slate-800/80 hover:border-accent-purple/45 hover:shadow-[0_4px_20px_rgba(170,59,255,0.12)] transition-all duration-200 ease-in-out group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-xl bg-accent-purple/10 text-accent-purple group-hover:scale-105 group-hover:bg-accent-purple/20 transition-all duration-200 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-accent-purple transition-colors">Generate Cover Letter</p>
                  <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">AI draft editor</p>
                </div>
              </Link>
              <Link to="/interview" className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/75 border border-slate-800/80 hover:border-emerald-500/45 hover:shadow-[0_4px_20px_rgba(16,185,129,0.12)] transition-all duration-200 ease-in-out group hover:-translate-y-0.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all duration-200 shrink-0">
                  <MessageSquareCode size={16} />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Start Mock Interview</p>
                  <p className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">Practice prep bot</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI & Important Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {primaryCards.map((stat, i) => (
          <StatisticCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.desc}
            metricType={stat.metricType}
            accentColor={stat.accentColor}
            zeroStateText={stat.zeroStateText}
            cta={stat.cta}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Resume Score & ATS Trend */}
        <ChartCard
          title="Resume Score & ATS Trend"
          description="Timeline progression of your resume review ratings and ATS evaluations."
        >
          {scoreLoading || atsLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">Loading chart records...</div>
          ) : chart1Points === 0 ? (
            <ChartEmptyState
              message="No historical data available. Analyze your first resume to unlock performance trends."
              ctaText="Analyze Resume"
              ctaTo="/ats"
            />
          ) : (
            <div className="h-full flex flex-col justify-between">
              <ResponsiveContainer width="100%" height={chart1Points === 1 ? '85%' : '100%'}>
                <AreaChart>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F9D9A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0F9D9A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" data={scoreTrend || []} dataKey="value" stroke="#0F9D9A" fillOpacity={1} fill="url(#scoreColor)" name="Resume Score" strokeWidth={2.5} animationDuration={400} />
                  <Area type="monotone" data={atsTrend || []} dataKey="value" stroke="#00D2FF" fillOpacity={0} name="ATS Progress" strokeWidth={2} animationDuration={400} />
                </AreaChart>
              </ResponsiveContainer>
              {chart1Points === 1 && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-sans font-semibold uppercase tracking-wider">
                  Trend line unlocks after your second analysis.
                </p>
              )}
            </div>
          )}
        </ChartCard>

        {/* Chart 2: Job Match & Interview Performance */}
        <ChartCard
          title="Job Match & Interview Performance"
          description="Comparison of job match scoring percentages against mock interview turns."
        >
          {matchLoading || interviewLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">Loading chart records...</div>
          ) : chart2Points === 0 ? (
            <ChartEmptyState
              message="No historical data available. Perform job match scans or interview prep to see performance trends."
              ctaText="Start Mock Interview"
              ctaTo="/interview"
            />
          ) : (
            <div className="h-full flex flex-col justify-between">
              <ResponsiveContainer width="100%" height={chart2Points === 1 ? '85%' : '100%'}>
                <LineChart>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                  <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line type="monotone" data={matchTrend || []} dataKey="value" stroke="#0F9D9A" name="Match Score" strokeWidth={2.5} activeDot={{ r: 6 }} animationDuration={400} />
                  <Line type="monotone" data={interviewTrend || []} dataKey="value" stroke="#00D2FF" name="Interview Prep" strokeWidth={2} animationDuration={400} />
                </LineChart>
              </ResponsiveContainer>
              {chart2Points === 1 && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-sans font-semibold uppercase tracking-wider">
                  Trend line unlocks after your second analysis.
                </p>
              )}
            </div>
          )}
        </ChartCard>

        {/* Chart 3: Weekly Activity */}
        <ChartCard
          title="Weekly Activity Distribution"
          description="Aggregated user events and AI analyses completed over the past 7 days."
        >
          {weeklyLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">Loading chart records...</div>
          ) : !hasWeeklyActivity ? (
            <ChartEmptyState
              message="No weekly activity recorded. Perform actions in the workspace to build stats."
              ctaText="Upload Resume"
              ctaTo="/resumes"
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0F9D9A" radius={[6, 6, 0, 0]} name="Actions" maxBarSize={32} animationDuration={400} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 4: Monthly Activity */}
        <ChartCard
          title="Monthly Activity Distribution"
          description="Chronological aggregate counts of actions completed throughout the current year."
        >
          {monthlyLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">Loading chart records...</div>
          ) : !hasMonthlyActivity ? (
            <ChartEmptyState
              message="No monthly activity recorded. Perform actions in the workspace to build stats."
              ctaText="Upload Resume"
              ctaTo="/resumes"
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/40" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0F9D9A" radius={[6, 6, 0, 0]} name="Actions" maxBarSize={32} animationDuration={400} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {secondaryCards.map((stat, i) => (
          <StatisticCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.desc}
            accentColor={stat.accentColor}
            zeroStateText={stat.zeroStateText}
            cta={stat.cta}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Quick Navigation, Recent Activity & Resumes List Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Quick Navigation & Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-850 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md rounded-2xl">
            <CardHeader className="text-left pb-4">
              <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                Quick Navigation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Launch copilot tools to build resume drafts and prepare for applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              <QuickActionCard
                title="ATS Scanner"
                description="Audit resumes against job specs"
                icon={Scan}
                to="/ats"
                bgColor="bg-blue-500/10"
                iconColor="text-blue-600 dark:text-blue-400"
              />
              <QuickActionCard
                title="AI Mock Interview"
                description="Simulate mock recruiter reviews"
                icon={MessageSquareCode}
                to="/interview"
                bgColor="bg-emerald-500/10"
                iconColor="text-emerald-600 dark:text-emerald-400"
              />
              <QuickActionCard
                title="Career Roadmap"
                description="Track phases and milestones"
                icon={Map}
                to="/roadmap"
                bgColor="bg-purple-500/10"
                iconColor="text-purple-600 dark:text-purple-400"
              />
            </CardContent>
          </Card>

          {/* Chronological Activities Card */}
          <ActivityCard
            title="Recent Activity"
            description="Timeline list of your latest system events."
            items={recentActivities}
          />
        </div>

        {/* Right Side: Resumes List Table */}
        <Card className="lg:col-span-2 border-slate-200/60 dark:border-slate-850 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md rounded-2xl">
          <CardHeader className="pb-4 text-left">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                  Resumes List
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Chronological record of your uploaded credentials and computed ATS levels.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 font-sans italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                No resumes uploaded yet. Click "Upload Resume" in the Copilot launch grid to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-100 dark:border-slate-800">
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">File Name</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Uploaded</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">ATS Score</TableHead>
                      <TableHead className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resumes.slice(0, 5).map((resume) => (
                      <TableRow key={resume.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors border-slate-100 dark:border-slate-800">
                        <TableCell className="font-bold text-slate-900 dark:text-slate-200 truncate max-w-[200px] text-left">
                          {resume.original_filename}
                        </TableCell>
                        <TableCell className="text-slate-550 dark:text-slate-400 font-medium text-left">
                          {new Date(resume.uploaded_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-left">
                          {resume.ats_score !== null ? (
                            <span
                              className={cn(
                                'font-black font-display text-sm',
                                resume.ats_score >= 80 ? 'text-emerald-500' : 'text-amber-500'
                              )}
                            >
                              {resume.ats_score}/100
                            </span>
                          ) : (
                            <span className="text-slate-400 font-sans font-semibold">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-left">
                          <Badge
                            variant={
                              resume.status.toLowerCase() === 'completed' || resume.status.toLowerCase() === 'parsed'
                                ? 'success'
                                : resume.status.toLowerCase() === 'failed'
                                ? 'error'
                                : 'warning'
                            }
                          >
                            {resume.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
