import { useState } from 'react'
import {
  useDashboardAnalytics,
  useResumeAnalytics,
  useAtsAnalytics,
  useJobAnalytics,
  useChartsOverview,
  useRagMetrics,
  useRagCache,
  useInterviewHistoryAnalytics,
  useRoadmapsList,
  useRoadmapProgress,
} from '@/api/analytics'
import { useSystemAnalytics, useAgentsAnalytics } from '@/api/agents'
import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar'
import { ReportExportDialog } from '@/components/analytics/ReportExportDialog'
import { KPIWidget } from '@/components/analytics/KPIWidget'
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard'
import { TrendChart } from '@/components/analytics/TrendChart'
import { RadarAnalytics } from '@/components/analytics/RadarAnalytics'
import { LanguageDistributionChart } from '@/components/analytics/LanguageDistributionChart'
import {
  FileText,
  Scan,
  TrendingUp,
  BrainCircuit,
  MessageSquareCode,
  Map,
  Database,
  Bot,
  Sparkles,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { AnalyticsSkeleton } from '@/components/ui/Skeletons'
import { EmptyAnalyticsState } from '@/components/ui/EmptyState'

type TabType =
  | 'overview'
  | 'resumes'
  | 'ats'
  | 'jobmatch'
  | 'aicoach'
  | 'interviews'
  | 'career'
  | 'rag'
  | 'agents'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [exportOpen, setExportOpen] = useState(false)

  // Fetch queries
  const dashboard = useDashboardAnalytics()
  const resume = useResumeAnalytics()
  const ats = useAtsAnalytics()
  const jobMatch = useJobAnalytics()
  const chartsOverview = useChartsOverview()
  const ragMetrics = useRagMetrics()
  const ragCache = useRagCache()
  const interviewHistory = useInterviewHistoryAnalytics()
  const roadmaps = useRoadmapsList()
  const systemAgents = useSystemAnalytics()
  const agentsStats = useAgentsAnalytics()

  // Get active roadmap progress if list exists
  const activeRoadmapId = roadmaps.data?.roadmaps?.[0]?.id || null
  const roadmapProgress = useRoadmapProgress(activeRoadmapId)

  const handleRefresh = () => {
    dashboard.refetch()
    resume.refetch()
    ats.refetch()
    jobMatch.refetch()
    chartsOverview.refetch()
    ragMetrics.refetch()
    ragCache.refetch()
    interviewHistory.refetch()
    roadmaps.refetch()
    if (activeRoadmapId) {
      roadmapProgress.refetch()
    }
    systemAgents.refetch()
    agentsStats.refetch()
  }

  const tabs: { value: TabType; label: string; icon: any }[] = [
    { value: 'overview', label: 'Summary Overview', icon: TrendingUp },
    { value: 'resumes', label: 'Resume Profile', icon: FileText },
    { value: 'ats', label: 'ATS Metrics', icon: Scan },
    { value: 'jobmatch', label: 'Job Matching', icon: BrainCircuit },
    { value: 'aicoach', label: 'AI Resume Analytics', icon: Sparkles },
    { value: 'interviews', label: 'AI Interviews', icon: MessageSquareCode },
    { value: 'career', label: 'Career Roadmaps', icon: Map },
    { value: 'rag', label: 'RAG Pipeline', icon: Database },
    { value: 'agents', label: 'Multi-Agent Workspace', icon: Bot },
  ]

  // Normalizing distributions for chart ingestion
  const experienceChartData = resume.data?.experience.experience_distribution
    ? Object.entries(resume.data.experience.experience_distribution).map(([k, v]) => ({
        label: k,
        value: v,
      }))
    : []

  const educationChartData = resume.data?.education.education_distribution
    ? Object.entries(resume.data.education.education_distribution).map(([k, v]) => ({
        label: k,
        value: v,
      }))
    : []

  const topSkillsChartData = resume.data?.skills.top_skills
    ? resume.data.skills.top_skills.map((skill) => ({
        label: skill,
        value: resume.data.skills.skill_frequency[skill] || 0,
      }))
    : []

  const atsCategoryChartData = ats.data?.category_breakdown
    ? Object.entries(ats.data.category_breakdown).map(([k, v]) => ({
        label: k.toUpperCase(),
        value: v.average,
      }))
    : []

  const jobDistributionChartData = jobMatch.data?.distribution
    ? Object.entries(jobMatch.data.distribution).map(([k, v]) => ({
        label: k,
        value: v.percentage,
      }))
    : []

  const missingSkillsChartData = jobMatch.data?.skill_gaps.top_missing_skills
    ? jobMatch.data.skill_gaps.top_missing_skills.slice(0, 7).map((item) => ({
        label: item.label,
        value: item.value,
      }))
    : []

  // Pre-compiled charts from chartsOverview
  const overviewAtsDist = chartsOverview.data?.charts?.find(
    (c) => c.chart_id === 'ats-score-distribution'
  )?.data || []

  const overviewJobMatchDist = chartsOverview.data?.charts?.find(
    (c) => c.chart_id === 'job-match-distribution'
  )?.data || []

  const overviewTimeline = chartsOverview.data?.charts?.find(
    (c) => c.chart_id === 'resume-upload-timeline'
  )?.data || []

  const overviewSkills = chartsOverview.data?.charts?.find((c) => c.chart_id === 'top-skills')?.data || []

  if (dashboard.isLoading) {
    return <AnalyticsSkeleton />
  }

  if (!dashboard.isLoading && dashboard.data?.total_resumes === 0) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Analytics Center
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Centralized operations intelligence dashboard across all Scorelia modules.
            </p>
          </div>
        </div>
        <EmptyAnalyticsState />
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            Analytics Center
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Centralized operations intelligence dashboard across all Scorelia modules.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <AnalyticsFilterBar
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExportClick={() => setExportOpen(true)}
        onRefreshClick={handleRefresh}
        refreshing={dashboard.isFetching || resume.isFetching || ats.isFetching}
      />

      {/* Global KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPIWidget
          title="Resumes Builder"
          value={dashboard.data?.total_resumes ?? 0}
          icon={FileText}
          description="Total Resumes Uploaded"
          colorScheme="brand"
        />
        <KPIWidget
          title="ATS Compliance"
          value={`${dashboard.data?.average_ats_score ?? 0}%`}
          icon={Scan}
          description="Average Resume ATS Score"
          colorScheme="violet"
          trend={{ value: 4.8, isPositive: true }}
        />
        <KPIWidget
          title="Job Compatibility"
          value={`${dashboard.data?.average_match_score ?? 0}%`}
          icon={BrainCircuit}
          description="Average Match Alignment"
          colorScheme="emerald"
          trend={{ value: 2.1, isPositive: true }}
        />
        <KPIWidget
          title="AI Interview Prep"
          value={dashboard.data?.interview_sessions ?? 0}
          icon={MessageSquareCode}
          description="Completed Prep Sessions"
          colorScheme="amber"
        />
        <KPIWidget
          title="Career Roadmap"
          value={`${dashboard.data?.career_progress ?? 0}%`}
          icon={Map}
          description="Milestones Achievements"
          colorScheme="cyan"
        />
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto scrollbar-none flex gap-6">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`py-4 px-1 border-b-2 font-bold text-xs flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab.value
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
              }`}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* PANEL: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="ATS Scores Distribution"
              description="Quantity of resumes grouped by ATS score bands"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewAtsDist.length === 0}
            >
              <TrendChart data={overviewAtsDist} type="bar" colorScheme="violet" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Job Matches Distribution"
              description="Compatibility percentage shares across job descriptions"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewJobMatchDist.length === 0}
            >
              <TrendChart data={overviewJobMatchDist} type="bar" colorScheme="emerald" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Resume Upload Timeline"
              description="Monthly volume changes of documents uploaded"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewTimeline.length === 0}
            >
              <TrendChart data={overviewTimeline} type="area" colorScheme="brand" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Top Skills Distribution"
              description="Most common tags identified in resumes"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewSkills.length === 0}
            >
              <TrendChart data={overviewSkills} type="bar" colorScheme="amber" />
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: RESUMES */}
        {activeTab === 'resumes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Experience Distribution"
              description="Proportion of resumes grouped by years of experience"
              loading={resume.isLoading}
              error={resume.error}
              empty={experienceChartData.length === 0}
            >
              <TrendChart data={experienceChartData} type="bar" colorScheme="brand" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Degree Level Distribution"
              description="Proportion of resumes by highest educational achievement"
              loading={resume.isLoading}
              error={resume.error}
              empty={educationChartData.length === 0}
            >
              <LanguageDistributionChart data={educationChartData} />
            </AnalyticsCard>

            <AnalyticsCard
              title="Resume Upload History"
              description="Detailed upload frequency timeline"
              loading={resume.isLoading}
              error={resume.error}
              empty={Object.keys(resume.data?.timeline?.monthly || {}).length === 0}
            >
              <TrendChart
                data={Object.entries(resume.data?.timeline?.monthly || {}).map(([k, v]) => ({
                  label: k,
                  value: v,
                }))}
                type="line"
                colorScheme="cyan"
              />
            </AnalyticsCard>

            <AnalyticsCard
              title="Top Skill Keywords"
              description="Most frequent tags and counts"
              loading={resume.isLoading}
              error={resume.error}
              empty={topSkillsChartData.length === 0}
            >
              <TrendChart data={topSkillsChartData} type="bar" colorScheme="emerald" />
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: ATS */}
        {activeTab === 'ats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="ATS Scoring Breakdown"
              description="Average category marks vs. standard weights"
              loading={ats.isLoading}
              error={ats.error}
              empty={atsCategoryChartData.length === 0}
            >
              <RadarAnalytics data={atsCategoryChartData} colorScheme="violet" />
            </AnalyticsCard>

            <AnalyticsCard
              title="ATS Score Progress"
              description="ATS compliance improvement trend over time"
              loading={ats.isLoading}
              error={ats.error}
              empty={!ats.data?.trend?.score_trend?.length}
            >
              <TrendChart
                data={(ats.data?.trend?.score_trend || []).map((t) => ({
                  label: t.date,
                  value: t.score,
                }))}
                type="line"
                colorScheme="brand"
              />
            </AnalyticsCard>

            {/* List of Weaknesses & Recommendations */}
            <AnalyticsCard
              title="Weaknesses Areas"
              description="Identified compliance issues in parsed documents"
              loading={ats.isLoading}
              error={ats.error}
              empty={!ats.data?.weaknesses?.top_weaknesses?.length}
            >
              <div className="space-y-3 font-sans text-xs">
                {(ats.data?.weaknesses?.top_weaknesses || []).map((w, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/30"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      {w.label}
                    </span>
                    <span className="font-bold text-slate-500">Frequency: {w.value}</span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Action Recommendations"
              description="Actions suggested to improve ATS rankings"
              loading={ats.isLoading}
              error={ats.error}
              empty={!ats.data?.weaknesses?.top_recommendations?.length}
            >
              <div className="space-y-3 font-sans text-xs">
                {(ats.data?.weaknesses?.top_recommendations || []).map((r, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/30"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-500" />
                      {r.label}
                    </span>
                    <span className="font-bold text-slate-500">Priority: {r.value}</span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: JOB MATCH */}
        {activeTab === 'jobmatch' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Job Matches Cohorts"
              description="Percentage shares grouped by match scores"
              loading={jobMatch.isLoading}
              error={jobMatch.error}
              empty={jobDistributionChartData.length === 0}
            >
              <LanguageDistributionChart data={jobDistributionChartData} />
            </AnalyticsCard>

            <AnalyticsCard
              title="Top Missing Skills Gaps"
              description="Highest demand skills lacking in resume versions"
              loading={jobMatch.isLoading}
              error={jobMatch.error}
              empty={missingSkillsChartData.length === 0}
            >
              <TrendChart data={missingSkillsChartData} type="bar" colorScheme="amber" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Matching Score Trends"
              description="Chronological progress of description match align values"
              loading={jobMatch.isLoading}
              error={jobMatch.error}
              empty={!jobMatch.data?.trend?.score_trend?.length}
            >
              <TrendChart
                data={(jobMatch.data?.trend?.score_trend || []).map((t) => ({
                  label: t.date,
                  value: t.score,
                }))}
                type="line"
                colorScheme="emerald"
              />
            </AnalyticsCard>

            <AnalyticsCard
              title="Matches History Summary"
              description="General metrics breakdown"
              loading={jobMatch.isLoading}
              error={jobMatch.error}
            >
              <div className="grid grid-cols-2 gap-4 font-sans text-xs py-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30">
                  <div className="text-slate-400 dark:text-slate-500">Total Match Queries</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    {jobMatch.data?.history.total_matches || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30">
                  <div className="text-slate-400 dark:text-slate-500">Avg Matches / Resume</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    {jobMatch.data?.history.average_matches_per_resume || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30">
                  <div className="text-slate-400 dark:text-slate-500">Duplicate Descriptions</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    {jobMatch.data?.history.repeated_job_descriptions || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30">
                  <div className="text-slate-400 dark:text-slate-500">Historical growth</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    +{jobMatch.data?.history.historical_match_growth || 0}%
                  </div>
                </div>
              </div>
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: AI COACH */}
        {activeTab === 'aicoach' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="AI Reviews and Rewrites"
              description="Aggregated count of resume optimizations"
              loading={dashboard.isLoading}
            >
              <div className="grid grid-cols-3 gap-3 font-sans text-xs py-10">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Cover Letters</div>
                  <div className="text-2xl font-black text-brand-500 mt-1">
                    {dashboard.data?.cover_letters_generated || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">AI Interactions</div>
                  <div className="text-2xl font-black text-violet-500 mt-1">
                    {dashboard.data?.ai_usage || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Prep Sessions</div>
                  <div className="text-2xl font-black text-emerald-500 mt-1">
                    {dashboard.data?.interview_sessions || 0}
                  </div>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard title="AI Co-pilot Latency (Est)" description="Average response latency over date range">
              <TrendChart
                data={[
                  { label: 'Mon', value: 1.1 },
                  { label: 'Tue', value: 1.4 },
                  { label: 'Wed', value: 0.9 },
                  { label: 'Thu', value: 1.2 },
                  { label: 'Fri', value: 1.5 },
                  { label: 'Sat', value: 1.1 },
                  { label: 'Sun', value: 1.3 },
                ]}
                type="line"
                colorScheme="violet"
                valueFormatter={(val) => `${val}s`}
              />
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: INTERVIEWS */}
        {activeTab === 'interviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Interview Scores Breakdown"
              description="Averages across sub-components"
              loading={interviewHistory.isLoading}
              error={interviewHistory.error}
              empty={!interviewHistory.data?.total_interviews}
            >
              <RadarAnalytics
                data={[
                  { label: 'STAR Structure', value: interviewHistory.data?.average_star_score || 0 },
                  { label: 'Technical Accuracy', value: interviewHistory.data?.average_technical_score || 0 },
                  { label: 'Communication Flow', value: interviewHistory.data?.average_communication_score || 0 },
                  { label: 'Self Confidence', value: interviewHistory.data?.average_confidence_score || 0 },
                  { label: 'General Alignment', value: interviewHistory.data?.average_overall_score || 0 },
                ]}
                colorScheme="amber"
              />
            </AnalyticsCard>

            <AnalyticsCard
              title="Performance Improvement Trend"
              description="Historical scores progression"
              loading={interviewHistory.isLoading}
              error={interviewHistory.error}
              empty={!interviewHistory.data?.score_trend?.length}
            >
              <TrendChart
                data={(interviewHistory.data?.score_trend || []).map((t) => ({
                  label: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                  value: t.score,
                }))}
                type="line"
                colorScheme="brand"
              />
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: CAREER */}
        {activeTab === 'career' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Readiness Analysis"
              description="Milestones completion progression percentage"
              loading={roadmaps.isLoading}
            >
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="text-5xl font-black text-cyan-600 dark:text-cyan-400 font-display">
                  {dashboard.data?.career_progress || 0}%
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  Total Milestone Completion
                </span>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Roadmap Progression"
              description="Track details of learning milestones"
              loading={roadmaps.isLoading}
            >
              <div className="space-y-4 py-2 font-sans text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-500">Active Roadmaps Tracked</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {roadmaps.data?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-500">Milestones Completion Status</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {dashboard.data?.career_progress || 0}%
                  </span>
                </div>
              </div>
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: RAG */}
        {activeTab === 'rag' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Response latencies"
              description="E2E document retrieval operational latency"
              loading={ragMetrics.isLoading}
              error={ragMetrics.error}
            >
              <div className="grid grid-cols-3 gap-3 font-sans text-xs py-8">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Retrieval Latency</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    {ragMetrics.data?.average_retrieval_latency_ms?.toFixed(1) || 0}ms
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Gen Latency</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    {ragMetrics.data?.average_generation_latency_ms?.toFixed(1) || 0}ms
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Total Query E2E</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                    {ragMetrics.data?.average_total_latency_ms?.toFixed(1) || 0}ms
                  </div>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Cache Performance"
              description="Knowledge retrieval cache hit/miss ratio"
              loading={ragMetrics.isLoading}
              error={ragMetrics.error}
            >
              <div className="flex gap-6 items-center justify-center py-6">
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 block font-display">
                    {((ragMetrics.data?.cache_hit_ratio || 0) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-1 block">
                    Hit Ratio
                  </span>
                </div>
                <div className="w-px h-10 bg-slate-200 dark:bg-slate-800" />
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-slate-400 block font-display">
                    {((ragMetrics.data?.cache_miss_ratio || 0) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mt-1 block">
                    Miss Ratio
                  </span>
                </div>
              </div>
            </AnalyticsCard>
          </div>
        )}

        {/* PANEL: AGENTS */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnalyticsCard
              title="Orchestration Activity"
              description="System agent run loops details"
              loading={systemAgents.isLoading}
              error={systemAgents.error}
            >
              <div className="grid grid-cols-3 gap-3 font-sans text-xs py-8">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Tasks Executed</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    {systemAgents.data?.total_agent_executions || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Workflows Done</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    {systemAgents.data?.total_workflow_executions || 0}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/45 border border-slate-100 dark:border-slate-800/30 text-center">
                  <div className="text-slate-400 dark:text-slate-500">Avg Loop Speed</div>
                  <div className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                    {systemAgents.data?.average_agent_latency_ms
                      ? `${(systemAgents.data.average_agent_latency_ms / 1000).toFixed(1)}s`
                      : '0.0s'}
                  </div>
                </div>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Workload Success Rates"
              description="Individual active agents success metrics"
              loading={agentsStats.isLoading}
              error={agentsStats.error}
              empty={!agentsStats.data || Object.keys(agentsStats.data).length === 0}
            >
              <div className="space-y-3 font-sans text-xs">
                {Object.entries(agentsStats.data || {}).map(([name, stats]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/40 dark:border-slate-800/30"
                  >
                    <span className="font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wide">
                      {name.replace(/_agent/g, '').replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                        stats.success_rate >= 90
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {stats.success_rate.toFixed(0)}% Success
                    </span>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
          </div>
        )}
      </div>

      {/* Export Dialog */}
      <ReportExportDialog open={exportOpen} onOpenChange={setExportOpen} />
    </div>
  )
}
