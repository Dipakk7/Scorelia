import { TrendingUp, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { ResponsiveContainer, AreaChart, Area, XAxis } from 'recharts'

interface QualityScoreCardProps {
  qualityScore: number
  readinessScore: number
  improvementScore: number
  history?: { date: string; score: number }[]
}

export function QualityScoreCard({
  qualityScore = 0,
  readinessScore = 0,
  improvementScore = 0,
  history = [],
}: QualityScoreCardProps) {
  // Circular progress helper
  const renderCircularGauge = (
    value: number,
    label: string,
    gradientId: string,
    fromColor: string,
    toColor: string,
    subtext: string
  ) => {
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="flex flex-col items-center text-center p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
        <svg className="w-24 h-24 transform -rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          {/* Outer circle track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-850"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Value Label inside circle */}
        <div className="absolute top-[42px] flex flex-col items-center">
          <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {value}
            <span className="text-[10px] text-slate-455 font-normal">%</span>
          </span>
        </div>

        <div className="mt-4">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-355 tracking-wide uppercase">
            {label}
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{subtext}</p>
        </div>
      </div>
    )
  }

  // Calculate rating tier
  const getScoreTier = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' }
    if (score >= 70) return { label: 'Good', color: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20' }
    if (score >= 50) return { label: 'Fair', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
    return { label: 'Needs Focus', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/20' }
  }

  const tier = getScoreTier(qualityScore)

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-dark-bg shadow-lg overflow-hidden font-sans">
      <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <Award size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              AI Scoring Center
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time quality grading, career suitability index, and optimization history metrics.
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${tier.color}`}>
          {tier.label}
        </span>
      </div>

      <CardContent className="pt-6 space-y-6">
        {/* Metric Gauges Grid */}
        <div className="grid grid-cols-3 gap-3.5">
          {renderCircularGauge(
            qualityScore,
            'Quality Score',
            'gradQuality',
            '#6366f1',
            '#4f46e5',
            'Weighted quality evaluation'
          )}
          {renderCircularGauge(
            readinessScore,
            'Career Readiness',
            'gradReady',
            '#10b981',
            '#059669',
            'Industry fit readiness'
          )}
          {renderCircularGauge(
            improvementScore,
            'ATS Grade',
            'gradImprove',
            '#eab308',
            '#ca8a04',
            'ATS-friendly compatibility'
          )}
        </div>

        {/* Small trend graph inside */}
        {history && history.length > 1 && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <TrendingUp size={14} className="text-brand-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Quality Score Trend
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                Last {history.length} scans
              </span>
            </div>
            <div className="h-16 w-full opacity-90">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="scoreSpark" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreSpark)"
                  />
                  <XAxis dataKey="date" hide />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default QualityScoreCard
