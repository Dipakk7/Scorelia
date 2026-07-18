import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { AnalyticsCard } from '@/components/analytics/AnalyticsCard'
import { TrendChart } from '@/components/analytics/TrendChart'
import { RadarAnalytics } from '@/components/analytics/RadarAnalytics'
import { LanguageDistributionChart } from '@/components/analytics/LanguageDistributionChart'
import { StatisticCard } from '@/components/ui/StatisticCard'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { AnalyticsSkeleton } from '@/components/ui/Skeletons'
import { EmptyAnalyticsState } from '@/components/ui/EmptyState'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

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
  const navigate = useNavigate()
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
    { value: 'overview', label: 'Overview', icon: TrendingUp },
    { value: 'resumes', label: 'Resumes', icon: FileText },
    { value: 'ats', label: 'ATS Metrics', icon: Scan },
    { value: 'jobmatch', label: 'Job Matches', icon: BrainCircuit },
    { value: 'aicoach', label: 'AI Resume Review', icon: Sparkles },
    { value: 'interviews', label: 'AI Interview', icon: MessageSquareCode },
    { value: 'career', label: 'Roadmap', icon: Map },
    { value: 'rag', label: 'RAG Pipeline', icon: Database },
    { value: 'agents', label: 'Agent Center', icon: Bot },
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
      <div className="space-y-6 text-left font-sans text-xs">
        <Card variant="elevated" className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-md)] flex-shrink-0">
          <div className="space-y-1 text-left">
            <h1 className="text-h1 text-[var(--heading)] m-0">
              Analytics Center
            </h1>
            <p className="text-caption text-[var(--body)] m-0 font-medium mt-1.5">
              Centralized operations intelligence dashboard across all Scorelia modules.
            </p>
          </div>
        </Card>
        <EmptyAnalyticsState onAction={() => navigate('/resumes')} />
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans select-none pb-12 text-left text-xs">
      {/* Title Header */}
      <Card variant="elevated" className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 hover:border-[var(--primary)]/40 hover:shadow-[var(--shadow-md)] flex-shrink-0">
        <div className="space-y-1.5 text-left">
          <h1 className="text-h1 text-[var(--heading)] m-0">
            Analytics Center
          </h1>
          <p className="text-caption text-[var(--body)] m-0 font-medium mt-1.5">
            Centralized operations intelligence dashboard across all Scorelia modules.
          </p>
        </div>
      </Card>

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
        <StatisticCard
          title="Total Analyses"
          value={dashboard.data?.total_resumes ?? 0}
          icon={FileText}
          description="Total Resumes Uploaded"
          className="border-[var(--border)] bg-[var(--surface)]/70"
        />
        <StatisticCard
          title="Average ATS Score"
          value={`${dashboard.data?.average_ats_score ?? 0}%`}
          icon={Scan}
          description="Average Resume ATS Score"
          trend={{ value: 4.8, isPositive: true }}
          className="border-[var(--border)] bg-[var(--surface)]/70"
        />
        <StatisticCard
          title="Job Match Success"
          value={`${dashboard.data?.average_match_score ?? 0}%`}
          icon={BrainCircuit}
          description="Average Match Alignment"
          trend={{ value: 2.1, isPositive: true }}
          className="border-[var(--border)] bg-[var(--surface)]/70"
        />
        <StatisticCard
          title="Interview Performance"
          value={dashboard.data?.interview_sessions ?? 0}
          icon={MessageSquareCode}
          description="Completed Prep Sessions"
          className="border-[var(--border)] bg-[var(--surface)]/70"
        />
        <StatisticCard
          title="AI Usage"
          value={`${dashboard.data?.career_progress ?? 0}%`}
          icon={Map}
          description="Milestones Achievements"
          className="border-[var(--border)] bg-[var(--surface)]/70"
        />
      </div>

      {/* Tabs navigation */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)}>
        <TabsList className="mb-6">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <TabIcon size={14} />
                <span>{tab.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

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
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No ATS score data available. Upload resumes to calibrate your score."
            >
              <TrendChart data={overviewAtsDist} type="bar" colorScheme="violet" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Job Matches Distribution"
              description="Compatibility percentage shares across job descriptions"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewJobMatchDist.length === 0}
              ctaText="Scan Vacancies"
              ctaTo="/ats"
              emptyMessage="No job match data available. Scan your resume against vacancies."
            >
              <TrendChart data={overviewJobMatchDist} type="bar" colorScheme="emerald" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Resume Upload Timeline"
              description="Monthly volume changes of documents uploaded"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewTimeline.length === 0}
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No resume timeline data available. Upload your first resume to track timeline."
            >
              <TrendChart data={overviewTimeline} type="area" colorScheme="brand" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Top Skills Distribution"
              description="Most common tags identified in resumes"
              loading={chartsOverview.isLoading}
              error={chartsOverview.error}
              empty={overviewSkills.length === 0}
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No skills distribution data available. Upload resumes to map skills."
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
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No experience data available. Upload resumes to compile experience charts."
            >
              <TrendChart data={experienceChartData} type="bar" colorScheme="brand" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Degree Level Distribution"
              description="Proportion of resumes by highest educational achievement"
              loading={resume.isLoading}
              error={resume.error}
              empty={educationChartData.length === 0}
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No education history available. Upload resumes to see educational levels."
            >
              <LanguageDistributionChart data={educationChartData} />
            </AnalyticsCard>

            <AnalyticsCard
              title="Resume Upload History"
              description="Detailed upload frequency timeline"
              loading={resume.isLoading}
              error={resume.error}
              empty={Object.keys(resume.data?.timeline?.monthly || {}).length === 0}
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No upload history available. Upload your first resume to build timeline."
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
              ctaText="Upload Resume"
              ctaTo="/resumes"
              emptyMessage="No skills mapped yet. Upload resumes to parse skills."
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
              ctaText="Run ATS Scan"
              ctaTo="/ats"
              emptyMessage="No ATS categories evaluated. Scan your resumes against job descriptions."
            >
              <RadarAnalytics data={atsCategoryChartData} colorScheme="violet" />
            </AnalyticsCard>

            <AnalyticsCard
              title="ATS Score Progress"
              description="ATS compliance improvement trend over time"
              loading={ats.isLoading}
              error={ats.error}
              empty={!ats.data?.trend?.score_trend?.length}
              ctaText="Run ATS Scan"
              ctaTo="/ats"
              emptyMessage="No ATS score history. Analyze your resumes to build progression trends."
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
              ctaText="Audit Weaknesses"
              ctaTo="/ats"
              emptyMessage="No compliance issues logged. Run an ATS scan to detect vocabulary gaps."
            >
              <div className="space-y-3 font-sans text-xs text-left">
                {(ats.data?.weaknesses?.top_weaknesses || []).map((w, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[var(--radius-card)] transition-all shadow-2xs hover:shadow-sm text-left"
                  >
                    <span className="font-bold text-[var(--heading)] flex items-center gap-2 text-left leading-none">
                      <AlertCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0" />
                      {w.label}
                    </span>
                    <span className="font-mono font-black text-[var(--muted)] shrink-0 leading-none">Frequency: {w.value}</span>
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
              ctaText="Analyze ATS"
              ctaTo="/ats"
              emptyMessage="No recommendations generated yet. Complete a resume evaluation to view recommendations."
            >
              <div className="space-y-3 font-sans text-xs text-left">
                {(ats.data?.weaknesses?.top_recommendations || []).map((r, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[var(--radius-card)] transition-all shadow-2xs hover:shadow-sm text-left"
                  >
                    <span className="font-bold text-[var(--heading)] flex items-center gap-2 text-left leading-none">
                      <HelpCircle className="w-4 h-4 text-[var(--success)] flex-shrink-0 animate-pulse" />
                      {r.label}
                    </span>
                    <span className="font-mono font-black text-[var(--muted)] shrink-0 leading-none">Priority: {r.value}</span>
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
              ctaText="Match Job Vacancies"
              ctaTo="/ats"
              emptyMessage="No job matches found. Align your resumes against active catalog descriptions."
            >
              <LanguageDistributionChart data={jobDistributionChartData} />
            </AnalyticsCard>

            <AnalyticsCard
              title="Top Missing Skills Gaps"
              description="Highest demand skills lacking in resume versions"
              loading={jobMatch.isLoading}
              error={jobMatch.error}
              empty={missingSkillsChartData.length === 0}
              ctaText="Audit Skill Gaps"
              ctaTo="/roadmap"
              emptyMessage="No missing skills analyzed. Build a career roadmap to view skill gaps."
            >
              <TrendChart data={missingSkillsChartData} type="bar" colorScheme="amber" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Matching Score Trends"
              description="Chronological progress of description match align values"
              loading={jobMatch.isLoading}
              error={jobMatch.error}
              empty={!jobMatch.data?.trend?.score_trend?.length}
              ctaText="Sync Job Matches"
              ctaTo="/ats"
              emptyMessage="No match trend data available. Scan your profile against vacancy targets."
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
              <div className="grid grid-cols-2 gap-4 font-sans text-xs py-4 text-left">
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">Total Match Queries</div>
                  <div className="text-h4 font-black text-[var(--heading)] mt-1 font-mono leading-none">
                    {jobMatch.data?.history.total_matches || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">Avg Matches / Resume</div>
                  <div className="text-h4 font-black text-[var(--heading)] mt-1 font-mono leading-none">
                    {jobMatch.data?.history.average_matches_per_resume || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">Repeated Jobs</div>
                  <div className="text-h4 font-black text-[var(--heading)] mt-1 font-mono leading-none">
                    {jobMatch.data?.history.repeated_job_descriptions || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">Historical Growth</div>
                  <div className="text-h4 font-black text-[var(--heading)] mt-1 font-mono leading-none">
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
              <div className="grid grid-cols-3 gap-3 font-sans text-xs py-8 text-left">
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">Cover Letters</div>
                  <div className="text-h4 font-black text-[var(--primary)] mt-1 font-mono leading-none">
                    {dashboard.data?.cover_letters_generated || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">AI usage</div>
                  <div className="text-h4 font-black text-[var(--analytics)] mt-1 font-mono leading-none">
                    {dashboard.data?.ai_usage || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-label text-[var(--muted)] leading-none mb-1.5">Prep Loops</div>
                  <div className="text-h4 font-black text-[var(--success)] mt-1 font-mono leading-none">
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
              ctaText="Practice Interview"
              ctaTo="/interview"
              emptyMessage="No interview rounds completed yet. Conduct mock training runs to audit marks."
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
              ctaText="Practice Interview"
              ctaTo="/interview"
              emptyMessage="No progression scores trend. Refine your storytelling drills today."
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
              <div className="flex flex-col items-center justify-center py-6 text-center select-none leading-none">
                <span className="text-5xl font-black text-[var(--primary)] font-display block">
                  {dashboard.data?.career_progress || 0}%
                </span>
                <span className="text-label text-[var(--muted)] mt-2 block">
                  Total Milestone Completion
                </span>
              </div>
            </AnalyticsCard>

            <AnalyticsCard
              title="Roadmap Progression"
              description="Track details of learning milestones"
              loading={roadmaps.isLoading}
            >
              <div className="space-y-4 py-2 font-sans text-xs text-left">
                <div className="flex items-center justify-between font-bold leading-none select-none">
                  <span className="text-[var(--body)]">Active Roadmaps Tracked</span>
                  <span className="text-[var(--heading)] font-mono text-sm leading-none">
                    {roadmaps.data?.total || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between font-bold leading-none select-none">
                  <span className="text-[var(--body)]">Milestones Completion Status</span>
                  <span className="text-[var(--heading)] font-mono text-sm leading-none">
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
              title="Response Latencies"
              description="E2E document retrieval operational latency"
              loading={ragMetrics.isLoading}
              error={ragMetrics.error}
            >
              <div className="grid grid-cols-3 gap-3 font-sans text-xs py-8 text-left">
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-[var(--muted)] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5">Retrieval Speed</div>
                  <div className="text-sm font-black text-[var(--heading)] mt-1 leading-none font-mono">
                    {ragMetrics.data?.average_retrieval_latency_ms?.toFixed(1) || 0}ms
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-[var(--muted)] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Generation Speed</div>
                  <div className="text-sm font-black text-[var(--heading)] mt-1 leading-none font-mono">
                    {ragMetrics.data?.average_generation_latency_ms?.toFixed(1) || 0}ms
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-[var(--muted)] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 font-sans">E2E roundtrip</div>
                  <div className="text-sm font-black text-[var(--heading)] mt-1 leading-none font-mono">
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
              <div className="flex gap-6 items-center justify-center py-6 select-none leading-none">
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-[var(--success)] block font-display leading-none">
                    {((ragMetrics.data?.cache_hit_ratio || 0) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mt-2.5 block leading-none font-sans">
                    Hit Ratio
                  </span>
                </div>
                <div className="w-px h-10 bg-[var(--border)]" />
                <div className="text-center">
                  <span className="text-4xl font-extrabold text-[var(--muted)] block font-display leading-none">
                    {((ragMetrics.data?.cache_miss_ratio || 0) * 100).toFixed(0)}%
                  </span>
                  <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mt-2.5 block leading-none font-sans">
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
              <div className="grid grid-cols-3 gap-3 font-sans text-xs py-8 text-left">
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-[var(--muted)] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Tasks Executed</div>
                  <div className="text-lg font-black text-[var(--heading)] mt-1 leading-none font-mono">
                    {systemAgents.data?.total_agent_executions || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-[var(--muted)] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Workflows Done</div>
                  <div className="text-lg font-black text-[var(--heading)] mt-1 leading-none font-mono">
                    {systemAgents.data?.total_workflow_executions || 0}
                  </div>
                </div>
                <div className="p-4 rounded-[var(--radius-card)] bg-[var(--surface-hover)] border border-[var(--border)] shadow-2xs hover:shadow-sm text-left">
                  <div className="text-[var(--muted)] text-[9px] font-black uppercase tracking-widest leading-none mb-1.5 font-sans">Avg Loop Speed</div>
                  <div className="text-lg font-black text-[var(--heading)] mt-1 leading-none font-mono">
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
              <div className="space-y-3 font-sans text-xs text-left">
                {Object.entries(agentsStats.data || {}).map(([name, stats]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center p-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[var(--radius-card)] transition-all shadow-2xs hover:shadow-sm text-left"
                  >
                    <span className="font-bold text-[var(--heading)] flex items-center gap-2 text-left leading-none uppercase tracking-wide">
                      {name.replace(/_agent/g, '').replace(/_/g, ' ')}
                    </span>
                    <span
                      className={cn(
                        'font-mono font-bold px-2 py-0.5 rounded-lg text-[9px] border leading-none shrink-0',
                        stats.success_rate >= 90
                          ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20'
                          : 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20'
                      )}
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
