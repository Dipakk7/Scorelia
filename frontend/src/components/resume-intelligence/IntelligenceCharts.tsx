import { useState } from 'react'
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
} from 'recharts'
import type {
  ResumeReviewResponse,
  ResumeOptimizationResponse,
  ResumeRewriteResponse,
} from '@/types/resume-intelligence'
import { ChartEmptyState } from '@/components/ui/ChartEmptyState'
import { cn } from '@/lib/utils'

interface IntelligenceChartsProps {
  reviews?: ResumeReviewResponse[]
  optimizations?: ResumeOptimizationResponse[]
  rewrites?: ResumeRewriteResponse[]
  onAnalyze?: () => void
  isAnalyzing?: boolean
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-805 bg-white/95 dark:bg-slate-950/95 p-3 shadow-xl backdrop-blur-md text-left font-sans text-xs">
        <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 m-0">{label}</p>
        <div className="mt-1.5 flex items-center gap-2 font-semibold">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          <span className="text-slate-500 dark:text-slate-400">{data.type || 'Value'}:</span>
          <span className="text-slate-900 dark:text-slate-100">{payload[0].value}</span>
        </div>
      </div>
    )
  }
  return null
}

export function IntelligenceCharts({
  reviews = [],
  optimizations = [],
  rewrites = [],
  onAnalyze,
  isAnalyzing = false,
}: IntelligenceChartsProps) {
  const [activeTab, setActiveTab] = useState<'trends' | 'dimensions'>('trends')

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
    { name: 'AI Reviews', count: reviews.length, color: '#0F9D9A', type: 'Scans' },
    { name: 'AI Rewrites', count: rewrites.length, color: '#aa3bff', type: 'Scans' },
    { name: 'Optimizations', count: optimizations.length, color: '#00D2FF', type: 'Scans' },
  ]

  return (
    <div className="space-y-6 text-left font-sans animate-fade-in">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quality Score Trend Timeline */}
          <Card className="lg:col-span-2 border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
            <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
              <CardTitle className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 m-0">
                <History size={14} className="text-brand-500" />
                <span>Resume Quality Score Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-6">
              {trendData.length > 0 ? (
                <div className="h-full flex flex-col justify-between">
                  <ResponsiveContainer width="100%" height={trendData.length === 1 ? '85%' : '100%'}>
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scoreTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0F9D9A" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0F9D9A" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/50" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        name="Quality Grade"
                        stroke="#0F9D9A"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#scoreTimelineGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  {trendData.length === 1 && (
                    <p className="text-[10px] text-slate-450 dark:text-slate-500 text-center font-sans font-semibold uppercase tracking-wider m-0">
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
          <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
            <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
              <CardTitle className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 m-0">
                <Sparkles size={14} className="text-emerald-500" />
                <span>AI Intelligence Usage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-6 flex flex-col justify-between">
              {reviews.length > 0 || rewrites.length > 0 || optimizations.length > 0 ? (
                <>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/50" />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" tickLine={false} />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" allowDecimals={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Operations Run" radius={[4, 4, 0, 0]} barSize={24}>
                          {usageData.map((entry, index) => (
                            <Bar key={index} dataKey="count" fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider border-t border-slate-100 dark:border-slate-850 pt-3">
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
        <Card className="border border-slate-200/60 dark:border-slate-855 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-sm rounded-2xl hover:border-slate-350 dark:hover:border-slate-750 transition-all duration-300">
          <CardHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/60 text-left">
            <CardTitle className="text-xs font-black text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5 m-0">
              <Activity size={14} className="text-brand-500" />
              <span>Resume Optimization Progress Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            {latestOpt ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dimensionsData}>
                  <PolarGrid stroke="#cbd5e1" className="dark:stroke-slate-800/50" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'semibold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar
                    name="Score Level"
                    dataKey="value"
                    stroke="#0F9D9A"
                    fill="#0F9D9A"
                    fillOpacity={0.25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '11px',
                    }}
                  />
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
