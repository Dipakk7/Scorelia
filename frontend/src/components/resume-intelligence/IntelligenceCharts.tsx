import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Activity,
  History,
  Sparkles,
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
  Cell
} from 'recharts'
import type {
  ResumeReviewResponse,
  ResumeOptimizationResponse,
  ResumeRewriteResponse,
} from '@/types/resume-intelligence'
import { ChartEmptyState } from '@/components/ui/ChartEmptyState'
import { cn } from '@/lib/utils'
import { useTheme } from '@/providers/ThemeProvider'

interface IntelligenceChartsProps {
  reviews?: ResumeReviewResponse[]
  optimizations?: ResumeOptimizationResponse[]
  rewrites?: ResumeRewriteResponse[]
  onAnalyze?: () => void
  isAnalyzing?: boolean
}

export function IntelligenceCharts({
  reviews = [],
  optimizations = [],
  rewrites = [],
  onAnalyze,
  isAnalyzing = false,
}: IntelligenceChartsProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'dimensions'>('trends')

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
    primary: isDark ? '#5b9ac9' : '#2f6690',
    success: isDark ? '#3ecf8e' : '#1b9e6f',
    warning: isDark ? '#e0b845' : '#d99b1f',
    destructive: 'var(--destructive)',
    grid: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
    text: 'var(--foreground)',
    mutedText: 'var(--muted-foreground)',
  }

  function CustomTooltip({ active, payload, label }: any) {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-805 bg-card/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 m-0">{label}</p>
          <div className="mt-1.5 flex items-center gap-2 font-semibold">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].fill || themeColors.primary }} />
            <span className="text-muted-foreground">{data.type || 'Value'}:</span>
            <span className="text-slate-900 dark:text-slate-100">{payload[0].value}</span>
          </div>
        </div>
      )
    }
    return null
  }

  // 1. Process Quality Score Trend & Timeline
  const allScans = [
    ...reviews.map((r) => ({ date: new Date(r.created_at), score: r.overall_score, type: 'Review' })),
    ...optimizations.map((o) => ({ date: new Date(o.created_at), score: o.quality_score?.overall_score || 0, type: 'Optimization' })),
  ]

  // Sort chronologically
  allScans.sort((a, b) => a.date.getTime() - b.date.getTime())

  const trendData = allScans.map((scan) => ({
    date: scan.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: scan.score,
    type: scan.type,
  }))

  // 2. Process Optimization Progress Dimensions (using latest optimization)
  const latestOpt = optimizations[0]
  const dimensionsData = latestOpt?.quality_score
    ? [
        { subject: 'ATS Score', value: latestOpt.quality_score.ats },
        { subject: 'Technical', value: latestOpt.quality_score.technical_skills },
        { subject: 'Experience', value: latestOpt.quality_score.experience },
        { subject: 'Projects', value: latestOpt.quality_score.projects },
        { subject: 'Grammar', value: latestOpt.quality_score.grammar },
        { subject: 'Format', value: latestOpt.quality_score.formatting },
        { subject: 'Readability', value: latestOpt.quality_score.readability },
        { subject: 'Completeness', value: latestOpt.quality_score.completeness },
      ]
    : [
        { subject: 'ATS Score', value: 0 },
        { subject: 'Technical', value: 0 },
        { subject: 'Experience', value: 0 },
        { subject: 'Projects', value: 0 },
        { subject: 'Grammar', value: 0 },
        { subject: 'Format', value: 0 },
        { subject: 'Readability', value: 0 },
        { subject: 'Completeness', value: 0 },
      ]

  // 3. Process AI Usage History (Group count by type)
  const usageData = [
    { name: 'AI Reviews', count: reviews.length, color: themeColors.primary, type: 'Scans' },
    { name: 'AI Rewrites', count: rewrites.length, color: themeColors.success, type: 'Scans' },
    { name: 'Optimizations', count: optimizations.length, color: themeColors.warning, type: 'Scans' },
  ]

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in bg-transparent">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-105 dark:border-slate-850/80 overflow-x-auto scrollbar-none bg-slate-50/20 dark:bg-slate-900/10 rounded-t-2xl">
        <button
          onClick={() => setActiveTab('trends')}
          className={cn(
            'flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer',
            activeTab === 'trends'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white/40 dark:bg-slate-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-850/20'
          )}
        >
          <TrendingUp size={13} className={activeTab === 'trends' ? 'text-brand-500' : 'text-slate-455'} />
          <span>Progress & Usage Trends</span>
        </button>
        <button
          onClick={() => setActiveTab('dimensions')}
          className={cn(
            'flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer',
            activeTab === 'dimensions'
              ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white/40 dark:bg-slate-900/20'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-850/20'
          )}
        >
          <Activity size={13} className={activeTab === 'dimensions' ? 'text-brand-500' : 'text-slate-455'} />
          <span>Quality Dimension Breakdown</span>
        </button>
      </div>

      {activeTab === 'trends' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 bg-transparent">
          {/* Quality Score Trend Timeline */}
          <Card className="lg:col-span-2 border border-border/60 bg-card/70 backdrop-blur-md shadow-sm rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-2.5 border-b border-border/60 text-left">
              <CardTitle className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 m-0">
                <History size={14} className="text-brand-500" />
                <span>Resume Quality Score Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-6 bg-transparent">
              {trendData.length > 0 ? (
                <div className="h-full flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height={trendData.length === 1 ? '85%' : '100%'}>
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.25} />
                          <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: themeColors.mutedText }} stroke={themeColors.mutedText} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: themeColors.mutedText }} stroke={themeColors.mutedText} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        name="Quality Grade"
                        stroke={themeColors.primary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#scoreTimelineGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  {trendData.length === 1 && (
                    <p className="text-[10px] text-muted-foreground text-center font-sans font-semibold uppercase tracking-wider m-0">
                      Scans timeline unlocked. Run pipeline again to see progress trends.
                    </p>
                  )}
                </div>
              ) : (
                <div className="h-full">
                  <ChartEmptyState
                    message="No quality score trends recorded. Run review or optimization pipeline to generate scoring trend history."
                    ctaText="Analyze Resume"
                    ctaOnClick={onAnalyze}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Feature Usage History */}
          <Card className="border border-border/60 bg-card/70 backdrop-blur-md shadow-sm rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden">
            <CardHeader className="pb-2.5 border-b border-border/60 text-left">
              <CardTitle className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 m-0">
                <Sparkles size={14} className="text-emerald-500" />
                <span>AI Intelligence Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-6 flex flex-col justify-between bg-transparent">
              {reviews.length > 0 || rewrites.length > 0 || optimizations.length > 0 ? (
                <>
                  <div className="h-40 w-full bg-transparent">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={themeColors.grid} />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: themeColors.mutedText }} stroke={themeColors.mutedText} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: themeColors.mutedText }} stroke={themeColors.mutedText} allowDecimals={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Operations Run" radius={[4, 4, 0, 0]} barSize={24}>
                          {usageData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-wider border-t border-slate-100 dark:border-slate-850 pt-3">
                    <div>
                      <span className="block text-slate-900 dark:text-slate-200 text-sm font-extrabold">{reviews.length}</span>
                      Reviews
                    </div>
                    <div>
                      <span className="block text-slate-900 dark:text-slate-200 text-sm font-extrabold">{rewrites.length}</span>
                      Rewrites
                    </div>
                    <div>
                      <span className="block text-slate-900 dark:text-slate-200 text-sm font-extrabold">{optimizations.length}</span>
                      Optimizations
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full">
                  <ChartEmptyState
                    message="No AI features run on this resume yet. Run the workflow pipeline to populate tools analytics."
                    ctaText="Analyze Resume"
                    ctaOnClick={onAnalyze}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Dimensions breakdown subtab (Radar Chart) */
        <Card className="border border-border/60 bg-card/70 backdrop-blur-md shadow-sm rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300 overflow-hidden">
          <CardHeader className="pb-2.5 border-b border-border/60 text-left">
            <CardTitle className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 m-0">
              <Activity size={14} className="text-brand-500" />
              <span>Resume Optimization Progress Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6 bg-transparent">
            {latestOpt ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dimensionsData}>
                  <PolarGrid stroke={themeColors.grid} />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: themeColors.mutedText, fontWeight: 'semibold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8, fill: themeColors.mutedText }} stroke={themeColors.mutedText} />
                  <Radar
                    name="Score Level"
                    dataKey="value"
                    stroke={themeColors.primary}
                    fill={themeColors.primary}
                    fillOpacity={0.25}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full">
                <ChartEmptyState
                  message="Please execute the AI Optimization scan to populate quality breakdown dimensions."
                  ctaText="Analyze Resume"
                  ctaOnClick={onAnalyze}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default IntelligenceCharts
