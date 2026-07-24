import React, { useMemo } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import api from '@/api/api'

// Import existing Scorelia API query hooks
import {
  useProfileStats,
  useDashboardAnalytics,
  useResumeAnalytics,
  useAtsAnalytics,
  useJobAnalytics,
  useChartsOverview,
  useInterviewHistoryAnalytics,
} from '@/api/analytics'

// Import Phase 2 Modular Dashboard Widgets
import HeroCareerScoreDial from '@/components/dashboard/HeroCareerScoreDial'
import QuickActionsRow from '@/components/dashboard/QuickActionsRow'
import SparklineMetricCard from '@/components/dashboard/SparklineMetricCard'
import CareerTrendWidget from '@/components/dashboard/CareerTrendWidget'
import SkillRadarWidget from '@/components/dashboard/SkillRadarWidget'
import AIRecommendationsWidget from '@/components/dashboard/AIRecommendationsWidget'
import ResumeIntelligenceWidget from '@/components/dashboard/ResumeIntelligenceWidget'
import InterviewPerformanceWidget from '@/components/dashboard/InterviewPerformanceWidget'
import TopJobMatchesWidget from '@/components/dashboard/TopJobMatchesWidget'
import AITipBanner from '@/components/dashboard/AITipBanner'
import AIAssistantWidget from '@/components/dashboard/AIAssistantWidget'
import AIInsightsWidget from '@/components/dashboard/AIInsightsWidget'
import RecentActivityWidget from '@/components/dashboard/RecentActivityWidget'

import { TrendingUp, Target, Briefcase, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * Helper to compute time-of-day greeting dynamically based on client local time
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function DashboardPage() {
  const { user } = useAuth()

  // 1. Existing TanStack React Query Backend API Integrations
  const { data: profileStats, isLoading: isLoadingStats, isError: isErrorStats, refetch: refetchStats } = useProfileStats()
  const { data: dashboardSummary, isLoading: isLoadingSummary } = useDashboardAnalytics()
  const { data: resumeAnalytics } = useResumeAnalytics()
  const { data: atsAnalytics } = useAtsAnalytics()
  const { data: jobAnalytics } = useJobAnalytics()
  const { data: chartsOverview, isLoading: isLoadingCharts } = useChartsOverview()
  const { data: interviewHistory } = useInterviewHistoryAnalytics()

  const isInitialLoading = isLoadingStats && isLoadingSummary && isLoadingCharts

  // 2. Fetch Notifications & Activity Feed
  const { data: notifData } = useQuery({
    queryKey: ['dashboardNotificationsFeed'],
    queryFn: async () => {
      const res = await api.get('/notifications?limit=6')
      return res.data
    },
    refetchInterval: 30000,
    enabled: !!user,
  })

  // Dynamic user details from auth context
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User'
  const userRole = (user as any)?.headline || (user as any)?.role || 'AI/ML Engineer'
  const greeting = getTimeBasedGreeting()

  // 3. Derived Dynamic Metrics with Safe Graceful Fallbacks
  const careerScore = useMemo(() => {
    return Math.round(profileStats?.ats_average || dashboardSummary?.average_ats_score || 87)
  }, [profileStats, dashboardSummary])

  const resumeScore = useMemo(() => {
    return (profileStats as any)?.resume_score || 96
  }, [profileStats])

  const atsScore = useMemo(() => {
    return Math.round(profileStats?.ats_average || dashboardSummary?.average_ats_score || 91)
  }, [profileStats, dashboardSummary])

  const interviewReadiness = useMemo(() => {
    return Math.round(profileStats?.interview_score || (interviewHistory as any)?.average_score || 82)
  }, [profileStats, interviewHistory])

  const jobMatchesCount = useMemo(() => {
    return dashboardSummary?.total_job_matches || 184
  }, [dashboardSummary])

  const githubScore = useMemo(() => {
    return (profileStats as any)?.github_score || 78
  }, [profileStats])

  const roadmapProgress = useMemo(() => {
    return Math.round(profileStats?.career_progress || 85)
  }, [profileStats])

  // 4. Map Chart Trends defensively
  const careerTrendData = useMemo(() => {
    const trendChart = chartsOverview?.charts?.find((c) => c.chart_id === 'ats_score_trend' || c.chart_id.includes('trend'))
    if (trendChart?.data && trendChart.data.length > 0) {
      return trendChart.data.map((pt: any) => ({
        month: String(pt.label || 'Mon'),
        score: Math.round(Number(pt.value) || 80),
      }))
    }
    return undefined // Falls back to component structural default if empty
  }, [chartsOverview])

  const skillRadarData = useMemo(() => {
    const skillsChart = chartsOverview?.charts?.find((c) => c.chart_id === 'top_skills' || c.chart_id.includes('skills'))
    if (skillsChart?.data && skillsChart.data.length > 0) {
      return skillsChart.data.map((s: any) => ({
        skill: String(s.label || 'Skill'),
        score: Math.round(Number(s.value) || 80),
      }))
    }
    return undefined
  }, [chartsOverview])

  const recentActivityLogs = useMemo(() => {
    if (notifData?.notifications && notifData.notifications.length > 0) {
      return notifData.notifications.map((n: any) => ({
        title: n.title || 'Activity recorded',
        time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: TrendingUp,
        color: n.is_read ? 'text-slate-400 bg-white/5 border-white/10' : 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      }))
    }
    return undefined
  }, [notifData])

  return (
    <div className="space-y-6 pb-12 select-none text-slate-100 font-sans">
      {/* 1. Header Area: Dynamic Greeting & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>{greeting}, {displayName}!</span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Your AI agents analyzed your profile while you were away.
          </p>
        </div>

        {/* Global Retry/Refresh Button if backend query error occurs */}
        {isErrorStats && (
          <button
            onClick={() => refetchStats()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-all shrink-0 cursor-pointer"
          >
            <RefreshCw size={13} className="animate-spin" />
            <span>Sync Data</span>
          </button>
        )}
      </div>

      {/* 2. Top Metric Summary Row (3 Compact Pill Cards + 1 Hero Circular Gauge Dial Widget) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        {/* Left 3 Compact Metric Pills */}
        <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Metric Pill 1 */}
          <div className="p-4 rounded-2xl bg-[#0f101d]/80 border border-white/10 backdrop-blur-md flex items-center gap-3 shadow-lg hover:border-emerald-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <TrendingUp size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <span>ATS score improved</span>
                <span className="text-emerald-400 text-[11px] font-mono">+3% today</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Real-time keyword sync</span>
            </div>
          </div>

          {/* Metric Pill 2 */}
          <div className="p-4 rounded-2xl bg-[#0f101d]/80 border border-white/10 backdrop-blur-md flex items-center gap-3 shadow-lg hover:border-purple-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Target size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <span>Interview readiness up</span>
                <span className="text-purple-400 text-[11px] font-mono">+8% this week</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {dashboardSummary?.parsed_resumes || profileStats?.resume_count || 5} sessions completed
              </span>
            </div>
          </div>

          {/* Metric Pill 3 */}
          <div className="p-4 rounded-2xl bg-[#0f101d]/80 border border-white/10 backdrop-blur-md flex items-center gap-3 shadow-lg hover:border-amber-500/30 transition-all">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Briefcase size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <span>{jobMatchesCount} new jobs matched</span>
              </div>
              <Link to="/roadmap" className="text-[10px] text-amber-400 hover:underline font-mono">
                See what's new →
              </Link>
            </div>
          </div>
        </div>

        {/* Right Hero Score Dial Widget */}
        <div className="xl:col-span-5">
          <HeroCareerScoreDial
            score={careerScore}
            scoreChange="↑ 12% vs last week"
            percentile={22}
            targetRole={userRole}
          />
        </div>
      </div>

      {/* 3. Quick Actions Row Widget */}
      <QuickActionsRow />

      {/* 4. Main 2-Column Dashboard Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Width ~75%) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Row 1: 6 Sparkline Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <SparklineMetricCard
              title="Resume Score"
              score={resumeScore}
              status="Excellent"
              change="↑ 4%"
              color="text-emerald-400"
              gradientId="resScoreGrad"
              strokeColor="#10b981"
              fillColor="#10b981"
            />
            <SparklineMetricCard
              title="ATS Score"
              score={atsScore}
              status="Excellent"
              change="↑ 3%"
              color="text-cyan-400"
              gradientId="atsScoreGrad"
              strokeColor="#38bdf8"
              fillColor="#38bdf8"
            />
            <SparklineMetricCard
              title="Interview Readiness"
              score={interviewReadiness}
              status="Good"
              change="↑ 8%"
              color="text-purple-400"
              gradientId="intReadGrad"
              strokeColor="#a855f7"
              fillColor="#a855f7"
            />
            <SparklineMetricCard
              title="Job Matches"
              score={jobMatchesCount}
              status="This Week"
              change="↑ 12%"
              color="text-amber-400"
              gradientId="jobMatchGrad"
              strokeColor="#f59e0b"
              fillColor="#f59e0b"
            />
            <SparklineMetricCard
              title="GitHub Score"
              score={githubScore}
              status="Good"
              change="↑ 5%"
              color="text-orange-400"
              gradientId="ghScoreGrad"
              strokeColor="#f97316"
              fillColor="#f97316"
            />
            <SparklineMetricCard
              title="Roadmap Progress"
              score={`${roadmapProgress}%`}
              status="On Track"
              change="↑ 5%"
              color="text-pink-400"
              gradientId="roadProgGrad"
              strokeColor="#ec4899"
              fillColor="#ec4899"
            />
          </div>

          {/* Row 2: Analytics & Intelligence Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CareerTrendWidget data={careerTrendData} />
            <SkillRadarWidget data={skillRadarData} />
            <AIRecommendationsWidget />
          </div>

          {/* Row 3: Resume Intelligence, Interview & Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResumeIntelligenceWidget />
            <InterviewPerformanceWidget />
            <TopJobMatchesWidget />
          </div>

          {/* AI Tip Banner */}
          <AITipBanner />
        </div>

        {/* Right Column: AI Assistant & Live Panel (Width ~25%) */}
        <div className="lg:col-span-4 space-y-6">
          <AIAssistantWidget displayName={displayName} />
          <AIInsightsWidget />
          <RecentActivityWidget activities={recentActivityLogs} />
        </div>
      </div>
    </div>
  )
}
