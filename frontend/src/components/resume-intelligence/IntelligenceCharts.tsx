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

interface IntelligenceChartsProps {
  reviews?: ResumeReviewResponse[]
  optimizations?: ResumeOptimizationResponse[]
  rewrites?: ResumeRewriteResponse[]
}

export function IntelligenceCharts({
  reviews = [],
  optimizations = [],
  rewrites = [],
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
    { name: 'AI Reviews', count: reviews.length, color: '#6366f1' },
    { name: 'AI Rewrites', count: rewrites.length, color: '#10b981' },
    { name: 'Optimizations', count: optimizations.length, color: '#f59e0b' },
  ]

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-100 dark:border-slate-850">
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'trends'
              ? 'border-brand-500 text-brand-600 dark:text-brand-450 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <TrendingUp size={14} />
          <span>Progress & Usage Trends</span>
        </button>
        <button
          onClick={() => setActiveTab('dimensions')}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
            activeTab === 'dimensions'
              ? 'border-brand-500 text-brand-600 dark:text-brand-450 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Activity size={14} />
          <span>Quality Dimension Breakdown</span>
        </button>
      </div>

      {activeTab === 'trends' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quality Score Trend Timeline */}
          <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <History size={13} className="text-brand-500" />
                <span>Resume Quality Score Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-3">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreTimelineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '11px',
                        fontFamily: 'sans-serif',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      name="Quality Grade"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#scoreTimelineGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                  Run review or optimization pipeline to generate scoring trend history.
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Feature Usage History */}
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-emerald-500" />
                <span>AI Intelligence Usage History</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 pt-3 flex flex-col justify-between">
              {reviews.length > 0 || rewrites.length > 0 || optimizations.length > 0 ? (
                <>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" allowDecimals={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#f8fafc',
                            fontSize: '11px',
                          }}
                        />
                        <Bar dataKey="count" name="Operations Run" radius={[4, 4, 0, 0]}>
                          {usageData.map((entry, index) => (
                            <Bar key={index} dataKey="count" fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 font-semibold border-t border-slate-100 dark:border-slate-850 pt-2">
                    <div>
                      <span className="block text-slate-800 dark:text-slate-350 text-sm font-extrabold">{reviews.length}</span>
                      Reviews
                    </div>
                    <div>
                      <span className="block text-slate-800 dark:text-slate-350 text-sm font-extrabold">{rewrites.length}</span>
                      Rewrites
                    </div>
                    <div>
                      <span className="block text-slate-800 dark:text-slate-350 text-sm font-extrabold">{optimizations.length}</span>
                      Optimizations
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                  No AI features run on this resume yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Dimensions breakdown subtab (Radar Chart) */
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Activity size={13} className="text-brand-500" />
              <span>Resume Optimization Progress Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-3">
            {latestOpt ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dimensionsData}>
                  <PolarGrid stroke="#cbd5e1" className="dark:stroke-slate-800" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'semibold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                  <Radar
                    name="Score Level"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.3}
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
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Please execute the AI Optimization scan to populate quality breakdown dimensions.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default IntelligenceCharts
