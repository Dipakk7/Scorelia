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
  TrendingUp,
  CheckCircle2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
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

export default function DashboardPage() {
  const { user } = useAuth()
  const userDisplayName = user?.full_name || user?.email.split('@')[0] || 'User'
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

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

  // Statistics configs
  const statCards = [
    { title: 'Total Resumes', value: analytics?.total_resumes ?? 0, icon: FileText, desc: 'CV uploads recorded' },
    { title: 'Avg ATS Score', value: analytics?.average_ats_score ? `${Math.round(analytics.average_ats_score)}%` : '0%', icon: Award, desc: 'Averaged scanner rating' },
    { title: 'Job Matches', value: analytics?.total_job_matches ?? 0, icon: Layers, desc: 'Positions evaluated' },
    { title: 'Skill Gap Count', value: analytics?.skill_gap_count ?? 0, icon: Scan, desc: 'Identified missing skills' },
    { title: 'Interview Loops', value: analytics?.interview_sessions ?? 0, icon: MessageSquareCode, desc: 'Mock prep runs completed' },
    { title: 'Career Progress', value: analytics?.career_progress ? `${Math.round(analytics.career_progress)}%` : '0%', icon: Map, desc: 'Roadmap phase completion' },
    { title: 'Cover Letters', value: analytics?.cover_letters_generated ?? 0, icon: Sparkles, desc: 'AI letters created' },
    { title: 'AI Usage Logs', value: analytics?.ai_usage ?? 0, icon: TrendingUp, desc: 'Aggregated AI prompts run' },
  ]

  // Construct recent activity items list
  const recentActivities: any[] = []

  if (analytics?.latest_resume) {
    recentActivities.push({
      id: 'latest-resume',
      title: 'Resume Uploaded',
      description: `Resume "${analytics.latest_resume.original_filename}" parsed successfully.`,
      timestamp: new Date(analytics.latest_resume.uploaded_at).toLocaleDateString(),
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
      timestamp: new Date(analytics.latest_job_match.timestamp).toLocaleDateString(),
      icon: Scan,
      badgeText: `Match: ${analytics.latest_job_match.overall_score}%`,
      badgeVariant: 'info',
    })
  }

  // Fallbacks if lists are empty
  if (recentActivities.length === 0) {
    recentActivities.push({
      id: 'welcome',
      title: 'Account Activated',
      description: 'Your Scorelia workspace has been fully initialized.',
      timestamp: 'Today',
      icon: CheckCircle2,
      badgeText: 'Info',
      badgeVariant: 'secondary',
    })
  }

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Hero / Header */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-900/40 p-6 md:p-8 text-white border border-slate-800 backdrop-blur-md">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-brand-400 font-sans flex items-center gap-1.5">
              <Calendar size={12} />
              {currentDate}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white m-0 tracking-tight leading-tight">
              Welcome back, {userDisplayName}!
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl font-sans leading-relaxed">
              Your intelligent copilot is synchronized. Scan resumes, prep for mocks, and track your career roadmap progress.
            </p>
          </div>
          <Link to="/resumes" className="shrink-0">
            <Button
              variant="primary"
              className="bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/10 shrink-0 font-display font-bold flex items-center gap-2"
            >
              <Upload size={16} />
              <span>Upload Resume</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatisticCard
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.desc}
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
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart records...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart>
                <defs>
                  <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-500, #6366f1)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-brand-500, #6366f1)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" data={scoreTrend || []} dataKey="value" stroke="var(--color-brand-600, #4f46e5)" fillOpacity={1} fill="url(#scoreColor)" name="Resume Score" strokeWidth={2} />
                <Area type="monotone" data={atsTrend || []} dataKey="value" stroke="#10b981" fillOpacity={0} name="ATS Progress" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 2: Job Match & Interview Performance */}
        <ChartCard
          title="Job Match & Interview Performance"
          description="Comparison of job match scoring percentages against mock interview turns."
        >
          {matchLoading || interviewLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart records...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line type="monotone" data={matchTrend || []} dataKey="value" stroke="var(--color-brand-600, #4f46e5)" name="Match Score" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" data={interviewTrend || []} dataKey="value" stroke="#10b981" name="Interview Prep" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 3: Weekly Activity */}
        <ChartCard
          title="Weekly Activity Distribution"
          description="Aggregated user events and AI analyses completed over the past 7 days."
        >
          {weeklyLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart records...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-brand-600, #4f46e5)" radius={[4, 4, 0, 0]} name="Actions" maxBarSize={40} />
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
            <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading chart records...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--color-brand-600, #4f46e5)" radius={[4, 4, 0, 0]} name="Actions" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
            <CardHeader className="text-left pb-4">
              <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                Quick Navigation
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
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
                description="Simulate turn-based mock reviews"
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

        {/* Resumes List Table */}
        <Card className="lg:col-span-2 border-slate-200/60 dark:border-slate-800/40 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold font-display text-slate-900 dark:text-slate-50">
                  Resumes List
                </CardTitle>
                <CardDescription className="text-xs text-slate-555">
                  Chronological record of your uploaded credentials and computed ATS levels.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {resumes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-slate-400 font-sans italic">
                No resumes uploaded yet. Click "Upload Resume" to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>ATS Score</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resumes.slice(0, 5).map((resume) => (
                    <TableRow key={resume.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[200px]">
                        {resume.original_filename}
                      </TableCell>
                      <TableCell>{new Date(resume.uploaded_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {resume.ats_score !== null ? (
                          <span
                            className={cn(
                              'font-extrabold font-display text-sm',
                              resume.ats_score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                            )}
                          >
                            {resume.ats_score}/100
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
